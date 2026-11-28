import assert from 'node:assert/strict';
import test from 'node:test';
import budgetPlugin from '../scripts/opencode-budget/index.js';

const freeModel = (id) => ({
  id,
  providerID: 'opencode',
  enabled: true,
  capabilities: { tools: true },
  cost: [{ input: 0, output: 0, cache: { read: 0, write: 0 } }],
});
const openAIModel = (id, price) => ({
  id,
  providerID: 'openai',
  capabilities: { tools: true },
  cost: [{ input: price, output: price }],
});
const dynamicAgents = ['prisma-discovery', 'title', 'summary', 'compaction'];
const reference = (id, providerID = 'opencode') => ({ id, providerID });

async function createHost(initialModels) {
  let candidates = initialModels;
  let models;
  let agents;
  let modelBarrier;
  let agentBarrier;
  let agentFailure;
  let afterAgentRead;
  let eventHandled;
  let eventReceiver;
  const modelTransforms = [];
  const agentTransforms = [];
  const hooks = new Map();
  const calls = { agentRegistrations: 0, agentDisposals: 0, modelReloads: 0 };
  const ctx = {
    model: {
      transform: async (callback) => {
        modelTransforms.push(callback);
        models = undefined;
      },
      list: async () => {
        if (!models) {
          const collection = new Map(
            candidates.map((model) => [
              `${model.providerID}/${model.id}`,
              structuredClone(model),
            ]),
          );
          for (const transform of modelTransforms)
            transform({
              list: () => [...collection.values()],
              remove: (providerID, id) =>
                collection.delete(`${providerID}/${id}`),
            });
          models = [...collection.values()];
        }
        const snapshot = models;
        if (modelBarrier) {
          const barrier = modelBarrier;
          modelBarrier = undefined;
          barrier.reached.resolve();
          await barrier.release.promise;
        }
        return { data: snapshot };
      },
      reload: async () => {
        calls.modelReloads++;
        models = undefined;
      },
    },
    agent: {
      transform: async (callback) => {
        calls.agentRegistrations++;
        agentTransforms.push(callback);
        agents = undefined;
        return {
          dispose: async () => {
            calls.agentDisposals++;
            agentTransforms.splice(agentTransforms.indexOf(callback), 1);
            agents = undefined;
          },
        };
      },
      reload: async () => {
        agents = undefined;
      },
      list: async () => {
        if (agentBarrier) {
          const barrier = agentBarrier;
          agentBarrier = undefined;
          barrier.reached.resolve();
          await barrier.release.promise;
        }
        if (agentFailure) throw agentFailure;
        if (!agents) {
          agents = new Map();
          for (const transform of agentTransforms) {
            if (transform === 'config') {
              for (const id of dynamicAgents)
                agents.set(id, {
                  id,
                  model: reference('configured-default'),
                });
            } else {
              transform({
                get: (id) => agents.get(id),
                update: (id, callback) => callback(agents.get(id)),
              });
            }
          }
        }
        if (afterAgentRead) {
          queueMicrotask(afterAgentRead);
          afterAgentRead = undefined;
        }
        return { data: [...agents.values()] };
      },
    },
    session: {
      hook: async (name, callback) => {
        hooks.set(name, callback);
      },
    },
    event: {
      subscribe: ({ signal }) => ({
        [Symbol.asyncIterator]() {
          return this;
        },
        next: () =>
          new Promise((resolve) => {
            if (signal.aborted) return resolve({ done: true });
            eventHandled?.();
            eventHandled = undefined;
            eventReceiver = resolve;
            signal.addEventListener('abort', () => resolve({ done: true }), {
              once: true,
            });
          }),
      }),
    },
  };
  const cleanup = await budgetPlugin.setup(ctx);
  return {
    hooks,
    calls,
    cleanup,
    configureAgents() {
      agentTransforms.push('config');
      agents = undefined;
    },
    pauseModelRead() {
      const barrier = {
        reached: Promise.withResolvers(),
        release: Promise.withResolvers(),
      };
      modelBarrier = barrier;
      return {
        reached: barrier.reached.promise,
        resume: barrier.release.resolve,
      };
    },
    pauseAgentRead() {
      const barrier = {
        reached: Promise.withResolvers(),
        release: Promise.withResolvers(),
      };
      agentBarrier = barrier;
      return {
        reached: barrier.reached.promise,
        resume: barrier.release.resolve,
      };
    },
    failAgentReads(error) {
      agentFailure = error;
    },
    afterNextAgentRead(callback) {
      afterAgentRead = callback;
    },
    async assigned(id = 'prisma-discovery') {
      await ctx.agent.list();
      return agents.get(id).model;
    },
    resolve(model, agent = 'prisma-discovery', kind = 'primary') {
      return hooks.get('experimental.model.resolve')({
        sessionID: 'synthetic-session',
        agent,
        kind,
        model,
      });
    },
    refresh(nextModels, type = 'models-dev.refreshed') {
      candidates = nextModels;
      const delivered = Promise.withResolvers();
      const done = new Promise((resolve) => {
        eventHandled = resolve;
      });
      eventReceiver({ value: { type }, done: false });
      queueMicrotask(delivered.resolve);
      return { done, delivered: delivered.promise };
    },
  };
}

test('assignment waits for configured agents and materializes the lazy catalog', async (t) => {
  const host = await createHost([freeModel('z-free'), freeModel('a-free')]);
  t.after(host.cleanup);
  assert.equal(host.calls.agentRegistrations, 0);
  host.configureAgents();
  await host.hooks.get('prompt')();
  for (const agent of dynamicAgents)
    assert.deepEqual(await host.assigned(agent), reference('a-free'));
  await host.resolve({ ...reference('a-free'), variant: 'default' });
  assert.equal(host.calls.agentRegistrations - host.calls.agentDisposals, 1);
});

test('Builder model resolution synchronizes workers without routing its own model', async (t) => {
  const host = await createHost([freeModel('a-free')]);
  t.after(host.cleanup);
  host.configureAgents();
  const selected = {
    ...reference('gpt-6.1-sol', 'openai'),
    variant: 'medium',
  };
  await host.resolve(selected, 'prisma-builder');
  assert.deepEqual(selected, {
    id: 'gpt-6.1-sol',
    providerID: 'openai',
    variant: 'medium',
  });
  assert.deepEqual(await host.assigned(), reference('a-free'));
});

test('stale models and unapproved variants remain rejected without substitution', async (t) => {
  const host = await createHost([freeModel('a-free'), freeModel('z-free')]);
  t.after(host.cleanup);
  host.configureAgents();
  for (const model of [
    reference('z-free'),
    { ...reference('a-free'), variant: 'high' },
    reference('gpt-6.1-sol', 'openai'),
  ]) {
    const before = structuredClone(model);
    await assert.rejects(host.resolve(model), /outside the approved role/);
    assert.deepEqual(model, before);
  }
});

test('catalog refresh materializes models before rebuilding all dynamic agents', async (t) => {
  const host = await createHost([freeModel('z-free')]);
  t.after(host.cleanup);
  host.configureAgents();
  await host.hooks.get('prompt')();
  await host.refresh([freeModel('a-free'), freeModel('z-free')]).done;
  for (const agent of dynamicAgents)
    assert.deepEqual(await host.assigned(agent), reference('a-free'));
  await assert.rejects(
    host.resolve(reference('z-free')),
    /outside the approved/,
  );
  await host.resolve(reference('a-free'));
});

test('auxiliary calls enforce the current selection regardless of parent role', async (t) => {
  const host = await createHost([freeModel('a-free')]);
  t.after(host.cleanup);
  host.configureAgents();
  for (const kind of ['title', 'compaction']) {
    await host.resolve(reference('a-free'), 'prisma-builder', kind);
    await assert.rejects(
      host.resolve(reference('gpt-6.1-sol', 'openai'), 'prisma-builder', kind),
      /outside the approved/,
    );
  }
});

test('fallback selection still uses catalog prices and rejects every other model', async (t) => {
  const host = await createHost([
    openAIModel('expensive', 2),
    openAIModel('cheap', 0.1),
    { ...freeModel('not-free'), cost: [{ input: 0, output: 1 }] },
  ]);
  t.after(host.cleanup);
  host.configureAgents();
  await host.hooks.get('prompt')();
  assert.deepEqual(await host.assigned(), reference('cheap', 'openai'));
  await host.resolve(reference('cheap', 'openai'));
  await assert.rejects(
    host.resolve(reference('expensive', 'openai')),
    /outside the approved/,
  );
});

test('missing eligible models fail closed and retry remains disabled', async (t) => {
  const host = await createHost([]);
  t.after(host.cleanup);
  host.configureAgents();
  await assert.rejects(
    host.resolve(reference('configured-default')),
    /no zero-priced OpenCode model or priced OpenAI model/,
  );
  const retry = { decision: { retry: true } };
  await host.hooks.get('retry')(retry);
  assert.deepEqual(retry.decision, { retry: false });
});

test('concurrent synchronization retains one registration and cleanup disposes it', async () => {
  const host = await createHost([freeModel('a-free')]);
  host.configureAgents();
  await Promise.all([
    host.hooks.get('prompt')(),
    host.hooks.get('prompt')(),
    host.resolve(reference('a-free')),
  ]);
  assert.equal(host.calls.agentRegistrations - host.calls.agentDisposals, 1);
  await host.cleanup();
  assert.equal(host.calls.agentRegistrations, host.calls.agentDisposals);
});

test('startup refresh cannot register assignment before later configuration', async (t) => {
  const host = await createHost([freeModel('z-free')]);
  t.after(host.cleanup);
  await host.refresh([freeModel('a-free')]).done;
  assert.equal(host.calls.agentRegistrations, 0);
  host.configureAgents();
  await host.hooks.get('prompt')();
  assert.deepEqual(await host.assigned(), reference('a-free'));
  host.configureAgents();
  await host.hooks.get('prompt')();
  assert.deepEqual(await host.assigned(), reference('a-free'));
});

test('refresh arriving after a model read forces another synchronized pass', async (t) => {
  const host = await createHost([freeModel('z-free')]);
  t.after(host.cleanup);
  host.configureAgents();
  await host.hooks.get('prompt')();
  const barrier = host.pauseModelRead();
  const admission = host.hooks.get('prompt')();
  await barrier.reached;
  const refresh = host.refresh([freeModel('a-free')]);
  await refresh.delivered;
  barrier.resume();
  await Promise.all([admission, refresh.done]);
  assert.deepEqual(await host.assigned(), reference('a-free'));
});

test('cleanup disposes the registration even when in-flight synchronization fails', async () => {
  const host = await createHost([freeModel('a-free')]);
  host.configureAgents();
  await host.hooks.get('prompt')();
  const barrier = host.pauseAgentRead();
  host.failAgentReads(new Error('synthetic model failure'));
  const admission = host.hooks.get('prompt')();
  const rejectedAdmission = assert.rejects(
    admission,
    /synthetic model failure/,
  );
  await barrier.reached;
  const rejectedCleanup = assert.rejects(
    host.cleanup(),
    /synthetic model failure/,
  );
  barrier.resume();
  await Promise.all([rejectedAdmission, rejectedCleanup]);
  assert.equal(host.calls.agentRegistrations, host.calls.agentDisposals);
});

test('refresh in the finalizer window drains pending invalidation before resolving', async (t) => {
  const host = await createHost([freeModel('z-free')]);
  t.after(host.cleanup);
  host.configureAgents();
  await host.hooks.get('prompt')();
  let refresh;
  host.afterNextAgentRead(() => {
    refresh = host.refresh([freeModel('a-free')]);
  });
  await host.hooks.get('prompt')();
  await refresh.done;
  assert.deepEqual(await host.assigned(), reference('a-free'));
});
