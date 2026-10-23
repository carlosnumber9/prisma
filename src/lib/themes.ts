import type { Party } from './content.ts';

export const NEUTRAL_ACCENT = '#364653';
export const NEUTRAL_BANNER = '#e5eaed';

export function partyAccent(party?: Pick<Party, 'officialColor'>) {
  return party?.officialColor ?? NEUTRAL_ACCENT;
}

export function contrastingText(color: string) {
  const channels = color.match(/[a-f\d]{2}/gi)!.map((hex) => {
    const value = parseInt(hex, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  const luminance =
    channels[0]! * 0.2126 + channels[1]! * 0.7152 + channels[2]! * 0.0722;
  return luminance > 0.179 ? '#000000' : '#ffffff';
}
