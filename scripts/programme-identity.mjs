import assert from 'node:assert/strict';

const identityKey = (value) =>
  value
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('es')
    .replace(/[^\p{Letter}\p{Number}]/gu, '');

// Programme identity belongs to the formation, never to a province. Compare
// complete names or complete acronyms; a coalition member is not its programme.
export function programmeForFormation(formation, programmes, aliases = {}) {
  for (const [id, values] of Object.entries(aliases)) {
    assert.ok(
      programmes.some((programme) => programme.id === id),
      `Unknown programme identity: ${id}`,
    );
    assert.ok(
      Array.isArray(values) &&
        values.every(
          (value) => typeof value === 'string' && identityKey(value),
        ),
      `Invalid programme aliases: ${id}`,
    );
  }
  const byId = programmes.find((programme) => programme.id === formation.id);
  if (byId) return byId;

  const names = new Set([
    identityKey(formation.name),
    identityKey(formation.name.replace(/\([^()]*\)/gu, '')),
  ]);
  names.delete('');
  const acronyms = new Set(
    [...formation.name.matchAll(/\(([^()]*)\)/gu)].map((match) =>
      identityKey(match[1]),
    ),
  );
  acronyms.delete('');
  for (const keys of [names, acronyms]) {
    const matches = programmes.filter((programme) =>
      [programme.id, programme.name, ...(aliases[programme.id] ?? [])].some(
        (value) => keys.has(identityKey(value)),
      ),
    );
    assert.ok(
      matches.length <= 1,
      `Ambiguous programme identity for ${formation.id}`,
    );
    if (matches.length === 1) return matches[0];
  }
  return undefined;
}
