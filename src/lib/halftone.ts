export const HALFTONE_SIZE = 1440;
export const HALFTONE_SPACING = 20;
export const HALFTONE_MAX_RADIUS = 2.15;
export const HALFTONE_COLOR = '#64717b';

function gaussian(distance: number, width: number) {
  return Math.exp(-((distance / width) ** 2));
}

export function staticHalftoneRadius(x: number, y: number) {
  const phase = (y / HALFTONE_SIZE) * Math.PI * 2;
  const leftFold =
    gaussian(x - (290 + 240 * Math.sin(phase - 0.6)), 200) *
    (0.5 + 0.5 * Math.cos(phase + 0.4));
  const rightFold =
    gaussian(x - (1130 + 240 * Math.sin(phase + 1.1)), 230) *
    (0.5 + 0.5 * Math.sin(phase - 0.5));
  const lowerFold =
    gaussian(x - (710 + 310 * Math.cos(phase + 0.8)), 220) *
    (0.5 + 0.5 * Math.cos(phase - 3.7)) ** 3;
  const readingSpace = 1 - 0.65 * gaussian(x - HALFTONE_SIZE / 2, 240);
  const intensity = Math.min(1, leftFold + rightFold + lowerFold);
  return HALFTONE_MAX_RADIUS * intensity ** 1.4 * readingSpace;
}

function crest(distance: number, time: number, period: number, offset: number) {
  const phase = (distance / 900 - time / period + offset) * Math.PI * 2;
  return Math.max(0, Math.cos(phase)) ** 4;
}

export function movingHalftoneRadius(x: number, y: number, time: number) {
  // Neighbouring cells sample the same continuous field: crests travel through
  // the grid, exposing new regions while the troughs shrink old dots to zero.
  const warpedX = x + 85 * Math.sin(y / 430);
  const warpedY = y + 65 * Math.sin(x / 310);
  const first = crest(Math.hypot(warpedX + 180, warpedY - 140), time, 9, 0);
  const second = crest(
    Math.hypot((warpedX - 1500) * 0.9, warpedY - 850),
    time,
    12,
    0.4,
  );
  const readingSpace = 1 - 0.3 * gaussian(x - HALFTONE_SIZE / 2, 240);
  return HALFTONE_MAX_RADIUS * Math.max(first, second) * readingSpace;
}

export function halftoneRadius(x: number, y: number, time: number) {
  // Match the SVG at hydration, then hand over to the travelling field.
  const blend = Math.min(1, Math.max(0, time / 1.2));
  const moving = movingHalftoneRadius(x, y, time);
  if (blend === 1) return moving;
  return staticHalftoneRadius(x, y) * (1 - blend) + moving * blend;
}
