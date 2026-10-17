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
