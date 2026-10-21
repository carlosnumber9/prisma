import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import {
  HALFTONE_MAX_RADIUS,
  HALFTONE_SIZE,
  halftoneRadius,
  movingHalftoneRadius,
  staticHalftoneRadius,
} from '../src/lib/halftone.ts';

test('the initial frame matches every circle in the published static fallback', () => {
  const svg = readFileSync(
    new URL('../public/dot-texture.svg', import.meta.url),
    'utf8',
  );
  const circles = [...svg.matchAll(/cx="(\d+)" cy="(\d+)" r="([\d.]+)"/g)];
  assert.ok(circles.length > 2000);
  for (const [, x, y, radius] of circles) {
    assert.equal(
      halftoneRadius(Number(x), Number(y), 0).toFixed(2),
      Number(radius).toFixed(2),
    );
  }
});

test('waves expose previously empty regions and erase previously visible regions throughout the page', () => {
  for (const top of [0, HALFTONE_SIZE, HALFTONE_SIZE * 3]) {
    let appeared = 0;
    let disappeared = 0;
    for (let y = top + 10; y < top + HALFTONE_SIZE; y += 40) {
      for (let x = 10; x < HALFTONE_SIZE; x += 40) {
        const initial = staticHalftoneRadius(x, y);
        const samples = Array.from({ length: 24 }, (_, i) =>
          halftoneRadius(x, y, 2 + i / 2),
        );
        if (initial < 0.12 && samples.some((radius) => radius > 1)) appeared++;
        if (initial > 0.6 && samples.some((radius) => radius < 0.12))
          disappeared++;
        assert.ok(
          samples.every(
            (radius) =>
              Number.isFinite(radius) &&
              radius >= 0 &&
              radius <= HALFTONE_MAX_RADIUS,
          ),
        );
      }
    }
    assert.ok(
      appeared > 100,
      `Empty regions did not become visible at y=${top}`,
    );
    assert.ok(
      disappeared > 100,
      `Visible regions did not disappear at y=${top}`,
    );
  }
});

test('a crest reaches neighbouring cells successively rather than pulsing the whole field together', () => {
  const arrivals = [110, 130, 150, 170].map((x) => {
    let peakTime = 0;
    let peak = 0;
    for (let time = 0; time < 9; time += 0.01) {
      const radius = movingHalftoneRadius(x, 310, time);
      if (radius > peak) {
        peak = radius;
        peakTime = time;
      }
    }
    return peakTime;
  });
  for (let index = 1; index < arrivals.length; index++) {
    const lag = arrivals[index] - arrivals[index - 1];
    assert.ok(lag > 0.05 && lag < 0.5);
  }
});

test('the moving field repeats continuously without a visible loop reset', () => {
  for (const [x, y] of [
    [110, 310],
    [710, 750],
    [1290, 2850],
  ]) {
    for (const time of [0, 3.5, 8.9, 17]) {
      assert.ok(
        Math.abs(
          movingHalftoneRadius(x, y, time) -
            movingHalftoneRadius(x, y, time + 36),
        ) < 1e-10,
      );
    }
  }
});
