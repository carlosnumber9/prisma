import { localizedFixture } from './localized-fixture.mjs';
import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createContentRepository,
  readPublicContent,
} from '../src/lib/content.ts';
import {
  citationLocation,
  citationUrl,
  formatDate,
  reviewLabel,
  synthesisState,
  UNAVAILABLE_LABEL,
} from '../src/lib/presentation.ts';
import {
  isIndexable,
  pageSeo,
  siteOrigin,
  sitemapEntries,
} from '../src/lib/seo.ts';
import { NEUTRAL_ACCENT, partyAccent } from '../src/lib/themes.ts';
import {
  ribbonRevealEase,
  ribbonRevealGeometry,
} from '../src/lib/ribbon-reveal.ts';

test('ribbon reveal preserves the original speed until the final eight visible pixels', () => {
  for (const [width, height, foldWidth] of [
    [390, 44, 40],
    [210, 44, 20],
    [180, 76, 20],
    [563, 44, 40],
  ]) {
    const geometry = ribbonRevealGeometry({
      width,
      height,
      foldWidth,
      foldRise: 12,
      mirrored: false,
    });
    const ease = (time) => ribbonRevealEase(time, geometry);
    const original = (time) => 1 - (1 - time) ** 3;
    const tip = geometry.visibleLength / geometry.horizontalLength;
    const brakeStart = (geometry.visibleLength - 8) / geometry.horizontalLength;
    const brakeTime = 1 - Math.cbrt(1 - brakeStart);
    for (let frame = 0; frame < 100; frame++) {
      const time = (brakeTime * frame) / 100;
      assert.equal(ease(time), original(time));
    }
    const originalTipTime = 1 - Math.cbrt(1 - tip);
    const newTipTime = 1 - Math.cbrt(1 - tip - 8 / geometry.horizontalLength);
    assert.ok(Math.abs(ease(newTipTime) - tip) < 1e-9);
    assert.ok((newTipTime - originalTipTime) * 450 < 15);
    const step = 0.00001;
    const speed = (time) => (ease(time + step) - ease(time)) / step;
    assert.ok(Math.abs(speed(brakeTime - step) - speed(brakeTime)) < 0.01);
    assert.ok(Math.abs(speed(newTipTime)) < 0.01);
    assert.equal(ease(0), 0);
    assert.equal(ease(1), 1);
    let previous = 0;
    for (let frame = 0; frame <= 1000; frame++) {
      const value = ease(frame / 1000);
      assert.ok(value >= previous && value <= 1);
      previous = value;
    }
  }
});

test('ribbon reveal follows the raised lateral plane before the horizontal face', () => {
  for (const [width, height, foldWidth] of [
    [390, 44, 40],
    [210, 44, 20],
    [180, 76, 20],
  ]) {
    const geometry = ribbonRevealGeometry({
      width,
      height,
      foldWidth,
      foldRise: 12,
      mirrored: false,
    });
    const [startX, startY, foldX, foldY, endX, endY] = geometry.path
      .match(/-?\d+(?:\.\d+)?/g)
      .map(Number);
    const slope = 12 / foldWidth;
    const leadingReach =
      (geometry.strokeWidth / 2) * (slope / Math.hypot(1, slope));
    assert.ok(startX + leadingReach <= -8);
    assert.equal(foldX, foldWidth - 8);
    assert.equal(foldY, height / 2);
    assert.equal(endY, foldY);
    assert.ok(endX - geometry.strokeWidth / 2 > width);
    assert.ok(
      Math.abs((foldY - startY) / (foldX - startX) - 12 / foldWidth) < 1e-9,
    );
    assert.ok(geometry.length > geometry.horizontalLength);
    assert.ok(geometry.bounds.y < -12);
    assert.ok(geometry.bounds.y + geometry.bounds.height > height);
  }
});

test('right ribbon reveal mirrors the complete path while preserving its timing distances', () => {
  const dimensions = { width: 420, height: 44, foldWidth: 40, foldRise: 12 };
  const left = ribbonRevealGeometry({ ...dimensions, mirrored: false });
  const right = ribbonRevealGeometry({ ...dimensions, mirrored: true });
  const coordinates = (geometry) =>
    geometry.path.match(/-?\d+(?:\.\d+)?/g).map(Number);
  const leftPoints = coordinates(left);
  const rightPoints = coordinates(right);
  leftPoints.forEach((value, index) => {
    assert.equal(
      rightPoints[index],
      index % 2 ? value : dimensions.width - value,
    );
  });
  assert.equal(right.length, left.length);
  assert.equal(right.horizontalLength, left.horizontalLength);
  assert.deepEqual(right.bounds, left.bounds);
});

function dataset(status = 'pending', points = []) {
  const envelope = (key, items) => ({
    schemaVersion: 3,
    electionDate: '2026-11-29',
    [key]: items,
  });
  return readPublicContent({
    parties: envelope('parties', [
      {
        id: 'fixture-party',
        name: 'Synthetic formation',
        officialWebsite: null,
      },
    ]),
    topics: envelope('topics', [
      {
        id: 'housing',
        label: localizedFixture('Vivienda'),
        path: '/topics/housing',
      },
    ]),
    sources: envelope('sources', []),
    syntheses: envelope('syntheses', [
      {
        id: 'fixture-party--housing',
        partyId: 'fixture-party',
        topicId: 'housing',
        path: '/parties/fixture-party/housing',
        reviewStatus: status,
        revision: status === 'pending' ? null : 1,
        reviewedAt: status === 'pending' ? null : '2026-10-12T10:00:00Z',
        sourceIds: [],
        points,
      },
    ]),
  });
}

test('distinguishes unavailable summaries, partial review and a complete review with no proposals', () => {
  for (const [status, points, expected] of [
    ['pending', [], 'pending'],
    ['partial', [{ id: 'fixture', citations: [] }], 'partial'],
    ['complete', [{ id: 'fixture', citations: [] }], 'complete'],
    ['complete', [], 'reviewed-empty'],
  ]) {
    const synthesis = dataset(status, points).syntheses.syntheses[0];
    assert.equal(synthesisState(synthesis), expected);
    assert.equal(isIndexable(synthesis), status !== 'pending');
  }
  assert.equal(reviewLabel('pending'), UNAVAILABLE_LABEL);
  assert.equal(UNAVAILABLE_LABEL, 'Resumen todavía no disponible');
  assert.equal(reviewLabel('partial'), 'Revisión parcial');
  assert.equal(reviewLabel('complete'), 'Revisión completa');
});

test('keeps physical PDF pages and printed numbering distinct and resolves real HTML anchors', () => {
  const source = { url: 'https://example.org/program.pdf#old' };
  const pdf = { page: 3, printedPage: 'i' };
  assert.equal(citationLocation(pdf), 'Página 3 (numeración impresa: i)');
  assert.equal(
    citationUrl(source, pdf),
    'https://example.org/program.pdf#page=3',
  );
  const html = { section: 'Synthetic section', anchor: '#housing' };
  assert.equal(citationLocation(html), 'Sección: Synthetic section');
  assert.equal(
    citationUrl({ url: 'https://example.org/program' }, html),
    'https://example.org/program#housing',
  );
  assert.equal(
    citationUrl(
      { url: 'https://example.org/program' },
      { section: 'No anchor' },
    ),
    'https://example.org/program',
  );
});

test('review dates use Spanish and UTC independent of the host timezone', () => {
  assert.equal(formatDate('2026-10-12T23:30:00Z'), '12 de octubre de 2026');
});

test('only evidenced brand accents are applied; unknown formations remain neutral', () => {
  assert.equal(partyAccent('pp'), '#21599E');
  assert.equal(partyAccent('psoe'), '#E20025');
  for (const id of ['vox', 'erc', 'frente-amplio', 'new-formation', undefined])
    assert.equal(partyAccent(id), NEUTRAL_ACCENT);
});

test('does not emit canonical or sitemap URLs until a production origin is configured', () => {
  const repository = createContentRepository(dataset());
  assert.equal(siteOrigin(''), undefined);
  assert.equal(siteOrigin(undefined), undefined);
  assert.ok(
    !Object.hasOwn(
      pageSeo('Title', 'Description', '/topics/housing'),
      'alternates',
    ),
  );
  assert.deepEqual(sitemapEntries(repository), []);
  assert.equal(siteOrigin('https://example.org/'), 'https://example.org');
  for (const value of [
    'invalid',
    'ftp://example.org',
    'https://user:secret@example.org',
    'http://localhost:3000',
    'http://127.0.0.1',
    'https://example.org/subpath',
    'https://example.org/?q=1',
    'https://example.org/#x',
  ])
    assert.throws(() => siteOrigin(value));
});

test('pending summaries are noindex and excluded; reviewed empty summaries are indexable', () => {
  const origin = 'https://example.org';
  const pending = createContentRepository(dataset());
  assert.equal(sitemapEntries(pending, origin).length, 30);
  assert.ok(
    !sitemapEntries(pending, origin).some(
      (item) => item.url.endsWith('/housing') && item.url.includes('/parties/'),
    ),
  );
  const metadata = pageSeo(
    'Title',
    'Description',
    '/parties/fixture-party/housing',
    origin,
    false,
  );
  assert.deepEqual(metadata.robots, { index: false, follow: true });
  assert.equal(
    metadata.alternates.canonical,
    `${origin}/es/parties/fixture-party/housing`,
  );
  for (const status of ['partial', 'complete']) {
    const reviewed = createContentRepository(dataset(status));
    const entry = sitemapEntries(reviewed, origin).find(
      (item) => item.url === `${origin}/es/parties/fixture-party/housing`,
    );
    assert.equal(entry.lastModified, '2026-10-12T10:00:00Z');
  }
});
