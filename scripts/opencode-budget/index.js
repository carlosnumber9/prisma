// OpenCode V2 accepts a default definition with id/setup. No SDK dependency is
// needed for this small runtime policy; the host supplies its documented context.
export const subscriptionModel = 'openai/gpt-6.1-sol';
export const freeModel = 'opencode/deepseek-v4.1-flash-free';

/** @param {{ providerID: string, id: string, cost?: { input: number, output: number, cache?: { read?: number, write?: number } }[] }} model */
function allowed(model) {
  const reference = `${model.providerID}/${model.id}`;
  if (reference === subscriptionModel) return true;
  if (
    reference !== freeModel ||
    !Array.isArray(model.cost) ||
    !model.cost.length
  )
    return false;
  return model.cost.every(
    (tier) =>
      tier.input === 0 &&
      tier.output === 0 &&
      (tier.cache?.read === undefined || tier.cache.read === 0) &&
      (tier.cache?.write === undefined || tier.cache.write === 0),
  );
}

export default {
  id: 'prisma.model-budget',
  async setup(ctx) {
    // Replay against the complete candidate collection, including later refreshes.
    await ctx.model.transform((editor) => {
      for (const model of editor.list()) {
        if (!allowed(model)) editor.remove(model.providerID, model.id);
      }
    });
    // Reject explicit substitutions, including auxiliary title/compaction calls.
    await ctx.session.hook('experimental.model.resolve', (event) => {
      const reference = `${event.model.providerID}/${event.model.id}`;
      if (reference !== subscriptionModel && reference !== freeModel)
        throw new Error(
          'Prisma blocked a model outside the subscription/free allowlist',
        );
    });
  },
};
