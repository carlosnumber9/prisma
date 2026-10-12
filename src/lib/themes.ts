export const NEUTRAL_ACCENT = '#364653';

// Primary evidence is recorded in docs/catalogue-provenance.md.
const accents: Readonly<Record<string, string>> = {
  pp: '#21599E',
  psoe: '#E20025',
};

export function partyAccent(partyId?: string) {
  return partyId ? (accents[partyId] ?? NEUTRAL_ACCENT) : NEUTRAL_ACCENT;
}
