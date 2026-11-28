// OpenCode V2 accepts a default definition with id/setup. No SDK dependency is
// needed for this small runtime policy; the host supplies its documented context.
export const subscriptionModel = 'openai/gpt-6.1-sol';
export const lightModel = 'openai/gpt-6-luna';
export const freeModel = 'opencode/deepseek-v4.1-flash-free';
export const roleModels = Object.freeze({
  'prisma-builder': subscriptionModel,
  'prisma-discovery': freeModel,
  'prisma-research': `${subscriptionModel}#high`,
  'prisma-synthesis': `${lightModel}#medium`,
  'prisma-translation': `${lightModel}#low`,
  'prisma-qa': `${subscriptionModel}#high`,
  title: freeModel,
  summary: freeModel,
  compaction: freeModel,
});

/** @param {{ input: number, output: number, cache?: { read?: number, write?: number } }} tier */
function hasZeroPrice(tier) {
  return (
    tier.input === 0 &&
    tier.output === 0 &&
    (tier.cache?.read === undefined || tier.cache.read === 0) &&
    (tier.cache?.write === undefined || tier.cache.write === 0)
  );
}

/** @param {{ providerID: string, id: string, enabled?: boolean, capabilities?: { tools?: boolean }, cost?: { input: number, output: number, cache?: { read?: number, write?: number } }[] }} model */
export function isZeroPricedOpenCodeModel(model) {
  return (
    model.providerID === 'opencode' &&
    model.enabled !== false &&
    model.capabilities?.tools === true &&
    Array.isArray(model.cost) &&
    model.cost.length > 0 &&
    model.cost.every(hasZeroPrice)
  );
}

/** @param {{ providerID: string, id: string, enabled?: boolean, capabilities?: { tools?: boolean }, cost?: { input: number, output: number, cache?: { read?: number, write?: number } }[] }} model */
export function openAIFallbackCost(model) {
  if (
    model.providerID !== 'openai' ||
    model.enabled === false ||
    model.capabilities?.tools !== true ||
    !Array.isArray(model.cost) ||
    model.cost.length === 0
  )
    return undefined;

  let maximumTierCost = 0;
  for (const tier of model.cost) {
    const prices = [
      tier.input,
      tier.output,
      tier.cache?.read ?? 0,
      tier.cache?.write ?? 0,
    ];
    if (prices.some((price) => !Number.isFinite(price) || price < 0))
      return undefined;
    maximumTierCost = Math.max(
      maximumTierCost,
      prices.reduce((sum, price) => sum + price, 0),
    );
  }
  return maximumTierCost;
}

/** @param {Array<{ providerID: string, id: string, enabled?: boolean, capabilities?: { tools?: boolean }, cost?: { input: number, output: number, cache?: { read?: number, write?: number } }[] }>} models */
export function chooseDiscoveryModel(models) {
  const free = models
    .filter(isZeroPricedOpenCodeModel)
    .sort((a, b) => a.id.localeCompare(b.id));
  if (free.length) return { providerID: 'opencode', id: free[0].id };

  const paidFallback = models
    .map((model) => ({ model, cost: openAIFallbackCost(model) }))
    .filter((row) => row.cost !== undefined)
    .sort(
      (a, b) =>
        (a.cost ?? Number.POSITIVE_INFINITY) -
          (b.cost ?? Number.POSITIVE_INFINITY) ||
        a.model.id.localeCompare(b.model.id),
    );
  if (paidFallback.length)
    return { providerID: 'openai', id: paidFallback[0].model.id };
  return undefined;
}

/** @param {{ providerID: string, id: string, enabled?: boolean, capabilities?: { tools?: boolean }, cost?: { input: number, output: number, cache?: { read?: number, write?: number } }[] }} model @param {{ providerID: string, id: string } | undefined} discoveryModel */
export function isAllowedModel(model, discoveryModel) {
  const reference = `${model.providerID}/${model.id}`;
  return (
    reference === subscriptionModel ||
    reference === lightModel ||
    isZeroPricedOpenCodeModel(model) ||
    (discoveryModel?.providerID === model.providerID &&
      discoveryModel?.id === model.id)
  );
}

export default {
  id: 'prisma.model-budget',
  async setup(ctx) {
    let discoveryModel;
    // Replay against the complete candidate collection, including later refreshes.
    await ctx.model.transform((editor) => {
      const candidates = [...editor.list()];
      discoveryModel = chooseDiscoveryModel(candidates);
      for (const model of candidates) {
        if (!isAllowedModel(model, discoveryModel))
          editor.remove(model.providerID, model.id);
      }
    });
    let assignmentRegistration;
    let synchronization;
    let stopped = false;
    let assignmentActivated = false;
    let synchronizationPending = false;
    let catalogInvalidated = false;
    const synchronizeAssignment = ({
      activate = false,
      invalidate = false,
    } = {}) => {
      if (stopped) return Promise.resolve();
      assignmentActivated ||= activate;
      catalogInvalidated ||= invalidate;
      synchronizationPending = true;
      if (synchronization) return synchronization;
      synchronization = (async () => {
        while (synchronizationPending && !stopped) {
          synchronizationPending = false;
          if (catalogInvalidated) {
            catalogInvalidated = false;
            await ctx.model.reload();
          }
          await ctx.model.list();
          if (stopped) return;
          if (!assignmentActivated) continue;
          const previousRegistration = assignmentRegistration;
          assignmentRegistration = await ctx.agent.transform((editor) => {
            for (const agentID of [
              'prisma-discovery',
              'title',
              'summary',
              'compaction',
            ])
              if (editor.get(agentID))
                editor.update(agentID, (agent) => {
                  agent.model = discoveryModel;
                });
          });
          await previousRegistration?.dispose();
          await ctx.agent.reload();
          await ctx.agent.list();
        }
      })().finally(() => {
        synchronization = undefined;
        if (synchronizationPending && !stopped) return synchronizeAssignment();
      });
      return synchronization;
    };
    await ctx.session.hook('prompt', () =>
      synchronizeAssignment({ activate: true }),
    );
    // Reject explicit substitutions, including auxiliary title/compaction calls.
    await ctx.session.hook('experimental.model.resolve', async (event) => {
      await synchronizeAssignment({ activate: true });
      const reference = `${event.model.providerID}/${event.model.id}`;
      const dynamicRole =
        event.kind === 'title' ||
        event.kind === 'compaction' ||
        ['prisma-discovery', 'title', 'summary', 'compaction'].includes(
          event.agent,
        );
      const expected = dynamicRole
        ? discoveryModel && `${discoveryModel.providerID}/${discoveryModel.id}`
        : roleModels[event.agent];
      const [model, variant] = expected?.split('#') ?? [];
      const selectedVariant = event.model.variant;
      if (!expected)
        throw new Error(
          'Prisma Discovery stopped: no zero-priced OpenCode model or priced OpenAI model is available through the existing ChatGPT OAuth connection. Ask the maintainer before enabling additional paid access.',
        );
      if (
        reference !== model ||
        (variant && selectedVariant !== variant) ||
        (!variant &&
          selectedVariant !== undefined &&
          selectedVariant !== 'default' &&
          !(reference === subscriptionModel && selectedVariant === 'medium'))
      )
        throw new Error(
          'Prisma blocked a model or variant outside the approved role assignment; stop the task without substitution',
        );
    });
    await ctx.session.hook('retry', (event) => {
      event.decision = { retry: false };
    });

    const controller = new AbortController();
    void (async () => {
      for await (const event of ctx.event.subscribe({
        types: [
          'models-dev.refreshed',
          'provider.updated',
          'credential.updated',
          'credential.switched',
        ],
        signal: controller.signal,
      })) {
        void event;
        try {
          await synchronizeAssignment({ invalidate: true });
        } catch (error) {
          console.error('Prisma Discovery model refresh failed', error);
        }
      }
    })();
    return async () => {
      stopped = true;
      controller.abort();
      try {
        await synchronization;
      } finally {
        await assignmentRegistration?.dispose();
      }
    };
  },
};
