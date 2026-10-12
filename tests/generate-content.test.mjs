import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import test from 'node:test';
import { buildContent, generateContent } from '../scripts/generate-content.mjs';

const script = join(
  dirname(fileURLToPath(import.meta.url)),
  '../scripts/generate-content.mjs',
);
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const json = (value) => JSON.stringify(value, null, 2) + '\n';
const writeJson = (path, value) => writeFileSync(path, json(value));
const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'prisma-editorial-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const directory of [
    'content/editorial/syntheses/fixture-party',
    'content/sources',
    'content/reviews',
  ])
    mkdirSync(join(root, directory), { recursive: true });
  writeJson(join(root, 'content/editorial/parties.json'), [
    {
      id: 'fixture-party',
      name: 'Synthetic test formation',
      officialWebsite: 'https://example.org',
    },
  ]);
  writeJson(join(root, 'content/editorial/topics.json'), [
    { id: 'housing', label: 'Housing' },
    { id: 'education', label: 'Education' },
  ]);
  // Synthetic snapshots exercise the data contract, not PDF parsing or real programmes.
  const original =
    '%PDF-1.7\nSynthetic document for hash and reference checks.\n';
  const sourceSha256 = sha256(original);
  const sourceId = `fixture-party-2026-${sourceSha256.slice(0, 12)}`;
  const sourceDirectory = join(root, 'content/sources', sourceId);
  mkdirSync(sourceDirectory);
  writeFileSync(join(sourceDirectory, 'original.pdf'), original);
  const extraction = {
    sourceId,
    sourceSha256,
    segments: [
      { id: 'page-1', page: 1, text: '' },
      {
        id: 'page-2',
        page: 2,
        printedPage: '1',
        text: 'Synthetic text A, subject to a condition.\nSynthetic text B is still pending review.',
      },
    ],
  };
  writeJson(join(sourceDirectory, 'extracted.json'), extraction);
  const metadata = {
    id: sourceId,
    partyId: 'fixture-party',
    electionDate: '2026-11-29',
    title: 'Synthetic source, not an electoral programme',
    url: 'https://example.org/program.pdf',
    format: 'pdf',
    capturedAt: '2026-10-12T10:00:00Z',
    originalFile: 'original.pdf',
    sha256: sourceSha256,
    extractionSha256: sha256(json(extraction)),
    pageCount: 2,
  };
  writeJson(join(sourceDirectory, 'metadata.json'), metadata);
  const synthesisPath = join(
    root,
    'content/editorial/syntheses/fixture-party/housing.json',
  );
  const synthesis = {
    id: 'fixture-party--housing',
    partyId: 'fixture-party',
    topicId: 'housing',
    revision: 2,
    reviewStatus: 'partial',
    reviewedAt: '2026-10-12T11:00:00Z',
    sourceIds: [sourceId],
    internalNotes: 'INTERNAL_EVIDENCE_DO_NOT_PUBLISH',
    points: [
      {
        id: 'fixture-point-a',
        title: 'Approved synthetic point',
        text: 'Synthetic summary A preserving the condition.',
        status: 'approved',
        internalNotes: 'INTERNAL_DEBATE_DO_NOT_PUBLISH',
        citations: [
          {
            sourceId,
            segmentId: 'page-2',
            quote: 'Synthetic text A, subject to a condition.',
          },
        ],
      },
      {
        id: 'fixture-point-b',
        title: 'DRAFT_DO_NOT_PUBLISH',
        text: 'PENDING_TEXT_DO_NOT_PUBLISH',
        status: 'draft',
        citations: [
          {
            sourceId,
            segmentId: 'page-2',
            quote: 'Synthetic text B is still pending review.',
          },
        ],
      },
    ],
  };
  writeJson(synthesisPath, synthesis);
  return {
    root,
    sourceId,
    sourceDirectory,
    synthesisPath,
    synthesis,
    metadata,
    extraction,
  };
}

function publicData(root, key) {
  return JSON.parse(buildContent(root).get(`${key}.json`))[key];
}

function outputSnapshot(root) {
  const directory = join(root, 'content/generated');
  return readdirSync(directory)
    .sort()
    .map((name) => [name, readFileSync(join(directory, name), 'utf8')]);
}

test('publishes only approved points with physical references and excludes draft and review material', (t) => {
  const { root } = fixture(t);
  const output = buildContent(root);
  const housing = publicData(root, 'syntheses').find(
    (item) => item.topicId === 'housing',
  );
  assert.equal(housing.reviewStatus, 'partial');
  assert.equal(housing.revision, 2);
  assert.equal(housing.points.length, 1);
  assert.equal(housing.path, '/parties/fixture-party/housing');
  assert.equal(housing.points[0].citations[0].page, 2);
  assert.equal(housing.points[0].citations[0].printedPage, '1');
  const all = [...output.values()].join('');
  for (const hidden of [
    'INTERNAL_EVIDENCE_DO_NOT_PUBLISH',
    'INTERNAL_DEBATE_DO_NOT_PUBLISH',
    'DRAFT_DO_NOT_PUBLISH',
    'PENDING_TEXT_DO_NOT_PUBLISH',
    'internalNotes',
    'extracted.json',
    'original.pdf',
  ])
    assert.ok(!all.includes(hidden));
});

test('generates pending topics without confusing absence with complete review', (t) => {
  const { root } = fixture(t);
  const education = publicData(root, 'syntheses').find(
    (item) => item.topicId === 'education',
  );
  assert.equal(education.reviewStatus, 'pending');
  assert.equal(education.revision, null);
  assert.deepEqual(education.points, []);
  assert.deepEqual(education.sourceIds, []);
  assert.equal(
    publicData(root, 'topics').find((item) => item.id === 'education').path,
    '/topics/education',
  );
});

test('excludes draft-only content and unpublished sources from public JSON', (t) => {
  const { root, synthesis, synthesisPath } = fixture(t);
  synthesis.points[0].status = 'draft';
  synthesis.reviewStatus = 'pending';
  synthesis.reviewedAt = null;
  writeJson(synthesisPath, synthesis);
  assert.equal(publicData(root, 'sources').length, 0);
  assert.ok(
    publicData(root, 'syntheses').every((item) => item.points.length === 0),
  );
});

test('preserves reviewed sources when a complete review finds no proposals', (t) => {
  const { root, synthesis, synthesisPath, sourceId } = fixture(t);
  synthesis.points = [];
  synthesis.reviewStatus = 'complete';
  writeJson(synthesisPath, synthesis);
  const housing = publicData(root, 'syntheses').find(
    (item) => item.topicId === 'housing',
  );
  assert.equal(housing.reviewStatus, 'complete');
  assert.deepEqual(housing.sourceIds, [sourceId]);
  assert.equal(publicData(root, 'sources').length, 1);
});

test('regeneration is identical and does not modify editorial inputs', (t) => {
  const { root, synthesisPath } = fixture(t);
  const before = readFileSync(synthesisPath, 'utf8');
  generateContent(root);
  const first = outputSnapshot(root);
  generateContent(root);
  assert.deepEqual(outputSnapshot(root), first);
  assert.equal(readFileSync(synthesisPath, 'utf8'), before);
  generateContent(root, { check: true });
});

test('--check detects stale output without writing or creating output directories', (t) => {
  const { root } = fixture(t);
  assert.throws(() => generateContent(root, { check: true }), /stale/);
  assert.ok(!existsSync(join(root, 'content/generated')));
  generateContent(root);
  writeFileSync(
    join(root, 'content/generated/syntheses.json'),
    'stale content\n',
  );
  const before = outputSnapshot(root);
  assert.throws(() => generateContent(root, { check: true }), /stale/);
  assert.deepEqual(outputSnapshot(root), before);
});

test('validation failure preserves all previous generated JSON', (t) => {
  const { root, synthesis, synthesisPath } = fixture(t);
  generateContent(root);
  const before = outputSnapshot(root);
  synthesis.points[0].citations[0].segmentId = 'missing';
  writeJson(synthesisPath, synthesis);
  assert.throws(() => generateContent(root), /unknown segment/);
  assert.deepEqual(outputSnapshot(root), before);
});

for (const [name, change, expected] of [
  [
    'duplicate points across syntheses',
    (f) => {
      const education = {
        ...f.synthesis,
        id: 'fixture-party--education',
        topicId: 'education',
      };
      writeJson(
        join(
          f.root,
          'content/editorial/syntheses/fixture-party/education.json',
        ),
        education,
      );
    },
    /duplicate identifier/,
  ],
  [
    'missing source',
    (f) => {
      f.synthesis.sourceIds = ['missing'];
      writeJson(f.synthesisPath, f.synthesis);
    },
    /source is missing/,
  ],
  [
    'a quote altering source wording',
    (f) => {
      f.synthesis.points[0].citations[0].quote =
        'Synthetic text A without any condition.';
      writeJson(f.synthesisPath, f.synthesis);
    },
    /quote does not occur/,
  ],
  [
    'complete review with drafts',
    (f) => {
      f.synthesis.reviewStatus = 'complete';
      writeJson(f.synthesisPath, f.synthesis);
    },
    /complete cannot contain/,
  ],
  [
    'pending review with approved points',
    (f) => {
      f.synthesis.reviewStatus = 'pending';
      f.synthesis.reviewedAt = null;
      writeJson(f.synthesisPath, f.synthesis);
    },
    /pending cannot contain/,
  ],
  [
    'partial review without approved points',
    (f) => {
      f.synthesis.points[0].status = 'draft';
      writeJson(f.synthesisPath, f.synthesis);
    },
    /partial requires/,
  ],
  [
    'an unknown field that could leak into the portal',
    (f) => {
      f.synthesis.points[0].externalAnalysis = 'do not publish';
      writeJson(f.synthesisPath, f.synthesis);
    },
    /unknown field/,
  ],
  [
    'an impossible review timestamp',
    (f) => {
      f.synthesis.reviewedAt = '2026-02-30T11:00:00Z';
      writeJson(f.synthesisPath, f.synthesis);
    },
    /invalid date/,
  ],
  [
    'a programme for another election',
    (f) => {
      f.metadata.electionDate = '2023-07-23';
      writeJson(join(f.sourceDirectory, 'metadata.json'), f.metadata);
    },
    /only programmes/,
  ],
  [
    'a modified original',
    (f) => {
      writeFileSync(join(f.sourceDirectory, 'original.pdf'), 'another version');
    },
    /original hash/,
  ],
  [
    'a modified extraction',
    (f) => {
      writeFileSync(join(f.sourceDirectory, 'extracted.json'), '{}');
    },
    /extraction hash/,
  ],
  [
    'extraction linked to another version',
    (f) => {
      f.extraction.sourceSha256 = '0'.repeat(64);
      writeJson(join(f.sourceDirectory, 'extracted.json'), f.extraction);
      f.metadata.extractionSha256 = sha256(json(f.extraction));
      writeJson(join(f.sourceDirectory, 'metadata.json'), f.metadata);
    },
    /another version/,
  ],
  [
    'missing extraction pages',
    (f) => {
      f.extraction.segments.shift();
      writeJson(join(f.sourceDirectory, 'extracted.json'), f.extraction);
      f.metadata.extractionSha256 = sha256(json(f.extraction));
      writeJson(join(f.sourceDirectory, 'metadata.json'), f.metadata);
    },
    /one entry per physical page/,
  ],
]) {
  test(`rejects ${name}`, (t) => {
    const f = fixture(t);
    change(f);
    assert.throws(() => buildContent(f.root), expected);
  });
}

test('supports HTML section and anchor references without requiring PDF', (t) => {
  const f = fixture(t);
  rmSync(f.sourceDirectory, { recursive: true });
  const html =
    '<!doctype html><h2 id="section-a">Synthetic section</h2><p>Synthetic HTML text.</p>';
  const sourceSha256 = sha256(html);
  const sourceId = `fixture-party-2026-${sourceSha256.slice(0, 12)}`;
  const directory = join(f.root, 'content/sources', sourceId);
  mkdirSync(directory);
  writeFileSync(join(directory, 'original.html'), html);
  const extraction = {
    sourceId,
    sourceSha256,
    segments: [
      {
        id: 'section-a',
        section: 'Synthetic section',
        anchor: '#section-a',
        text: 'Synthetic HTML text.',
      },
    ],
  };
  writeJson(join(directory, 'extracted.json'), extraction);
  const { pageCount, ...metadata } = f.metadata;
  writeJson(join(directory, 'metadata.json'), {
    ...metadata,
    id: sourceId,
    format: 'html',
    originalFile: 'original.html',
    sha256: sourceSha256,
    extractionSha256: sha256(json(extraction)),
    url: 'https://example.org/program',
  });
  f.synthesis.sourceIds = [sourceId];
  f.synthesis.points = [
    {
      ...f.synthesis.points[0],
      citations: [
        { sourceId, segmentId: 'section-a', quote: 'Synthetic HTML text.' },
      ],
    },
  ];
  writeJson(f.synthesisPath, f.synthesis);
  const citation = publicData(f.root, 'syntheses').find(
    (item) => item.topicId === 'housing',
  ).points[0].citations[0];
  assert.equal(citation.section, 'Synthetic section');
  assert.equal(citation.anchor, '#section-a');
  assert.ok(!Object.hasOwn(citation, 'page'));
});

test('allows whitespace differences in quotes without changing words', (t) => {
  const { root, synthesis, synthesisPath } = fixture(t);
  synthesis.points[0].citations[0].quote =
    'Synthetic text A,\n  subject to a condition.';
  writeJson(synthesisPath, synthesis);
  assert.equal(
    publicData(root, 'syntheses').find((item) => item.topicId === 'housing')
      .points.length,
    1,
  );
});

test('rejects cross-formation sources', (t) => {
  const f = fixture(t);
  const parties = readJson(join(f.root, 'content/editorial/parties.json'));
  parties.push({
    id: 'other-fixture',
    name: 'Another synthetic formation',
    officialWebsite: 'https://example.net',
  });
  writeJson(join(f.root, 'content/editorial/parties.json'), parties);
  mkdirSync(join(f.root, 'content/editorial/syntheses/other-fixture'));
  writeJson(
    join(f.root, 'content/editorial/syntheses/other-fixture/housing.json'),
    {
      ...f.synthesis,
      id: 'other-fixture--housing',
      partyId: 'other-fixture',
    },
  );
  assert.throws(
    () => buildContent(f.root),
    /source is missing or belongs to another formation/,
  );
});

test('rejects symlinked originals and preserves unexpected outputs', (t) => {
  const f = fixture(t);
  const originalPath = join(f.sourceDirectory, 'original.pdf');
  const externalPath = join(f.root, 'external.pdf');
  writeFileSync(externalPath, readFileSync(originalPath));
  rmSync(originalPath);
  symlinkSync(externalPath, originalPath);
  assert.throws(() => buildContent(f.root), /regular file/);
  rmSync(originalPath);
  writeFileSync(originalPath, readFileSync(externalPath));
  generateContent(f.root);
  const stray = join(f.root, 'content/generated/private.json');
  writeFileSync(stray, '{"private":true}\n');
  const before = outputSnapshot(f.root);
  assert.throws(() => generateContent(f.root), /unexpected file/);
  assert.deepEqual(outputSnapshot(f.root), before);
});

test('CLI supports another root offline and rejects invalid arguments', (t) => {
  const f = fixture(t);
  assert.match(
    execFileSync(process.execPath, [script, '--root', f.root], {
      encoding: 'utf8',
    }),
    /JSON generated/,
  );
  assert.match(
    execFileSync(process.execPath, [script, '--root', f.root, '--check'], {
      encoding: 'utf8',
    }),
    /up to date/,
  );
  const result = spawnSync(process.execPath, [script, '--unknown'], {
    encoding: 'utf8',
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unknown or incomplete argument/);
});

test('Finder metadata does not affect generation or public output', (t) => {
  const f = fixture(t);
  const before = [...buildContent(f.root)];
  writeFileSync(join(f.root, 'content/sources/.DS_Store'), 'Finder metadata');
  writeFileSync(join(f.sourceDirectory, '.DS_Store'), 'Finder metadata');
  assert.deepEqual([...buildContent(f.root)], before);
  generateContent(f.root);
  writeFileSync(join(f.root, 'content/generated/.DS_Store'), 'Finder metadata');
  generateContent(f.root, { check: true });
});
