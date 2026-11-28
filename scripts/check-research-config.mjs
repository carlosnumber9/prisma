import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import budgetPlugin, {
  chooseDiscoveryModel,
  freeModel,
  isAllowedModel,
  isZeroPricedOpenCodeModel,
  lightModel,
  openAIFallbackCost,
  roleModels,
  subscriptionModel,
} from './opencode-budget/index.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const free = freeModel;
const strong = subscriptionModel;
try {
  // The maintained JSONC file intentionally uses plain JSON for offline parsing.
  const config = JSON.parse(
    readFileSync(resolve(root, 'opencode.jsonc'), 'utf8'),
  );
  assert.equal(config.model, strong);
  assert.ok(!config.default_agent, 'Agent selection must remain manual');
  assert.notEqual(
    config.agents.build?.disabled,
    true,
    'OpenCode built-in fallback agent must remain available',
  );
  assert.equal(config.websearch, false);
  assert.equal(config.warming, false);
  assert.equal(config.automations, false);
  assert.equal(config.experimental.subagent_depth, 1);
  assert.ok(!config.provider, 'Unsupported legacy provider fields');
  assert.deepEqual(config.plugins, ['./scripts/opencode-budget']);
  assert.equal(budgetPlugin.id, 'prisma.model-budget');
  assert.equal(typeof budgetPlugin.setup, 'function');
  const freeCandidate = {
    providerID: 'opencode',
    id: 'deepseek-v4.1-flash-free',
    capabilities: { tools: true },
    cost: [{ input: 0, output: 0, cache: { read: 0 } }],
  };
  assert.equal(isZeroPricedOpenCodeModel(freeCandidate), true);
  assert.equal(isAllowedModel(freeCandidate, undefined), true);
  assert.equal(
    isZeroPricedOpenCodeModel({ ...freeCandidate, enabled: false }),
    false,
  );
  const cheapOpenAI = {
    providerID: 'openai',
    id: 'cheap-model',
    capabilities: { tools: true },
    cost: [{ input: 0.1, output: 0.2, cache: { read: 0.01, write: 0 } }],
  };
  const expensiveOpenAI = {
    ...cheapOpenAI,
    id: 'expensive-model',
    cost: [{ input: 0.5, output: 1, cache: { read: 0.1, write: 0 } }],
  };
  assert.equal(openAIFallbackCost(cheapOpenAI)?.toFixed(2), '0.31');
  assert.equal(
    openAIFallbackCost({ ...cheapOpenAI, enabled: false }),
    undefined,
  );
  assert.deepEqual(
    chooseDiscoveryModel([expensiveOpenAI, cheapOpenAI, freeCandidate]),
    { providerID: 'opencode', id: 'deepseek-v4.1-flash-free' },
  );
  assert.deepEqual(chooseDiscoveryModel([expensiveOpenAI, cheapOpenAI]), {
    providerID: 'openai',
    id: 'cheap-model',
  });
  assert.equal(
    isAllowedModel(cheapOpenAI, {
      providerID: 'openai',
      id: 'cheap-model',
    }),
    true,
  );
  assert.equal(
    isZeroPricedOpenCodeModel({
      providerID: 'opencode',
      id: 'deepseek-v4.1-flash-free',
      capabilities: { tools: true },
      cost: [{ input: 0, output: 0, cache: { read: 0 } }],
    }),
    true,
  );
  assert.equal(
    isZeroPricedOpenCodeModel({
      providerID: 'opencode',
      id: 'deepseek-v4.1-flash-free',
      capabilities: { tools: true },
      cost: [{ input: 0, output: 0, cache: { read: 0, write: 0 } }],
    }),
    true,
  );
  assert.equal(
    isZeroPricedOpenCodeModel({
      providerID: 'opencode',
      id: 'deepseek-v4.1-flash-free',
      capabilities: { tools: true },
      cost: [{ input: 0, output: 0, cache: { read: 0, write: 0.01 } }],
    }),
    false,
  );
  assert.deepEqual(Object.keys(config.providers).sort(), [
    'openai',
    'opencode',
  ]);
  assert.deepEqual(Object.keys(config.providers.openai.models).sort(), [
    'gpt-6-luna',
    'gpt-6.1-sol',
  ]);
  assert.deepEqual(
    config.providers.openai.models['gpt-6-luna'].variants.map(({ id }) => id),
    ['low', 'medium'],
  );
  assert.deepEqual(Object.keys(config.providers.opencode.models), [
    'deepseek-v4.1-flash-free',
  ]);
  for (const provider of Object.values(config.providers)) {
    assert.ok(!provider.settings?.apiKey && !provider.settings?.baseURL);
    assert.ok(!provider.headers && !provider.env && !provider.modelID);
  }
  const allowed = config.policies.filter(
    (row) => row.action === 'provider.use',
  );
  assert.deepEqual(allowed, [
    { action: 'provider.use', resource: '*', effect: 'deny' },
    { action: 'provider.use', resource: 'openai', effect: 'allow' },
    { action: 'provider.use', resource: 'opencode', effect: 'allow' },
  ]);
  for (const role of ['title', 'summary', 'compaction'])
    assert.equal(config.agents[role].model, free);
  const expected = new Map([
    ['builder', strong],
    ['discovery', free],
    ['research', `${strong}#high`],
    ['synthesis', `${lightModel}#medium`],
    ['translation', `${lightModel}#low`],
    ['qa', `${strong}#high`],
  ]);
  for (const [role, model] of expected)
    assert.equal(roleModels[`prisma-${role}`], model);
  assert.equal(
    readdirSync(resolve(root, '.opencode/agents')).length,
    expected.size,
  );
  for (const [role, model] of expected) {
    const body = readFileSync(
      resolve(root, `.opencode/agents/prisma-${role}.md`),
      'utf8',
    );
    const match = body.match(/^---\n([\s\S]*?)\n---\n/);
    assert.ok(match, `Missing frontmatter: ${role}`);
    const agent = parse(match[1]);
    assert.equal(agent.model, model);
    assert.ok(
      model === free ||
        config.providers.openai.models[model.split('/')[1].split('#')[0]],
      `Unconfigured model: ${role}`,
    );
    assert.equal(agent.mode, role === 'builder' ? 'primary' : 'subagent');
    assert.ok(Number.isInteger(agent.steps) && agent.steps > 0);
    if (role !== 'builder') {
      assert.ok(
        agent.permissions.some(
          (row) =>
            row.action === 'subagent' &&
            row.resource === '*' &&
            row.effect === 'deny',
        ),
      );
      assert.ok(
        !agent.permissions.some(
          (row) => row.action === 'subagent' && row.effect === 'allow',
        ),
      );
      assert.ok(
        agent.permissions.some(
          (row) =>
            row.action === 'shell' &&
            row.resource === '*' &&
            row.effect === 'deny',
        ),
      );
    }
  }
  process.stdout.write(
    'Research configuration validated offline. Runtime authentication, model availability, current prices, user overrides and search access still require session inspection.\n',
  );
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}
