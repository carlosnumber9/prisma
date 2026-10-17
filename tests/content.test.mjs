import { localizedFixture } from './localized-fixture.mjs';
import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createContentRepository,
  readPublicContent,
} from '../src/lib/content.ts';

export function publicFixture() {
  const envelope = (key, values) => ({
    schemaVersion: 3,
    electionDate: '2026-11-29',
    [key]: values,
  });
  const source = {
    id: 'synthetic-source',
    partyId: 'fixture-party',
    electionDate: '2026-11-29',
    title: 'Synthetic source',
    url: 'https://example.org/program.pdf',
    format: 'pdf',
    capturedAt: '2026-10-12T10:00:00Z',
    sha256: '0'.repeat(64),
    pageCount: 3,
  };
  const synthesis = {
    id: 'fixture-party--housing',
    partyId: 'fixture-party',
    topicId: 'housing',
    path: '/parties/fixture-party/housing',
    revision: 1,
    reviewStatus: 'partial',
    reviewedAt: '2026-10-12T10:00:00Z',
    sourceIds: [source.id],
    points: [
      {
        id: 'stable-point',
        title: localizedFixture('Synthetic point'),
        text: localizedFixture('Synthetic approved text'),
        citations: [
          {
            sourceId: source.id,
            segmentId: 'page-3',
            page: 3,
            quote: 'Synthetic quotation',
          },
        ],
      },
    ],
  };
  return {
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
    sources: envelope('sources', [source]),
    syntheses: envelope('syntheses', [synthesis]),
  };
}

test('queries preserve approved text, stable point IDs, source versions and a null website', () => {
  const input = publicFixture();
  const repository = createContentRepository(readPublicContent(input));
  assert.equal(repository.getParty('fixture-party').officialWebsite, null);
  const synthesis = repository.getSynthesis('fixture-party', 'housing');
  assert.strictEqual(synthesis, input.syntheses.syntheses[0]);
  assert.equal(synthesis.points[0].id, 'stable-point');
  assert.equal(synthesis.points[0].text.es, 'Synthetic approved text');
  assert.equal(repository.getSources(synthesis)[0].sha256, '0'.repeat(64));
  assert.strictEqual(
    repository.getSource('synthetic-source'),
    input.sources.sources[0],
  );
  assert.equal(repository.getTopic('housing').path, '/topics/housing');
});

test('unknown route IDs have no match and do not manufacture a pending synthesis', () => {
  const repository = createContentRepository(
    readPublicContent(publicFixture()),
  );
  assert.equal(repository.getParty('unknown'), undefined);
  assert.equal(repository.getTopic('unknown'), undefined);
  assert.equal(repository.getSynthesis('unknown', 'housing'), undefined);
  assert.equal(repository.getSynthesis('fixture-party', 'unknown'), undefined);
  assert.throws(() => repository.getSource('missing'), /Missing public source/);
});

test('an empty catalogue retains its topic index without manufacturing formations', () => {
  const input = publicFixture();
  input.parties.parties = [];
  input.sources.sources = [];
  input.syntheses.syntheses = [];
  const repository = createContentRepository(readPublicContent(input));
  assert.deepEqual(repository.parties, []);
  assert.deepEqual(repository.syntheses, []);
  assert.equal(repository.topics.length, 1);
});

test('rejects obsolete schemas, missing envelopes and mixed election dates', () => {
  for (const key of ['parties', 'topics', 'sources', 'syntheses']) {
    const input = publicFixture();
    input[key].schemaVersion = 2;
    assert.throws(() => readPublicContent(input), /Unsupported public schema/);
    input[key].schemaVersion = 1;
    assert.throws(() => readPublicContent(input), /Unsupported public schema/);
    delete input[key];
    assert.throws(() => readPublicContent(input), /Missing public envelope/);
  }
  const input = publicFixture();
  input.topics.electionDate = '2023-07-23';
  assert.throws(() => readPublicContent(input), /different elections/);
});

test('rejects incomplete combinations and missing cited sources instead of hiding evidence', () => {
  const input = publicFixture();
  input.syntheses.syntheses = [];
  assert.throws(
    () => createContentRepository(readPublicContent(input)),
    /Missing public synthesis/,
  );
  const missing = publicFixture();
  missing.sources.sources = [];
  assert.throws(
    () => createContentRepository(readPublicContent(missing)),
    /Missing public source/,
  );
});
