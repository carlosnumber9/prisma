import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import budgetPlugin, {
  freeModel,
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
  assert.equal(config.default_agent, 'prisma-builder');
  assert.equal(config.websearch, false);
  assert.equal(config.warming, false);
  assert.equal(config.automations, false);
  assert.equal(config.experimental.subagent_depth, 1);
  assert.ok(!config.provider, 'Unsupported legacy provider fields');
  assert.deepEqual(config.plugins, ['./scripts/opencode-budget']);
  assert.equal(budgetPlugin.id, 'prisma.model-budget');
  assert.equal(typeof budgetPlugin.setup, 'function');
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
    ['synthesis', free],
    ['translation', free],
    ['qa', `${strong}#high`],
  ]);
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
