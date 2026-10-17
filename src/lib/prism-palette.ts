// Normalised sRGB values. Party assignments will be configured separately.
export const PRISM_BLUE_BEAM_COLOR = [0.08, 0.39, 0.91] as const;
export const PRISM_RED_BEAM_COLOR = [0.91, 0.12, 0.24] as const;
export const PRISM_GREEN_BEAM_COLOR = [0.2, 0.65, 0.39] as const;
export const PRISM_VIOLET_BEAM_COLOR = [0.62, 0.3, 0.87] as const;

export const PRISM_BEAM_PALETTE = {
  blue: PRISM_BLUE_BEAM_COLOR,
  red: PRISM_RED_BEAM_COLOR,
  green: PRISM_GREEN_BEAM_COLOR,
  violet: PRISM_VIOLET_BEAM_COLOR,
} as const;
