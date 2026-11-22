import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  mkdtempSync,
  readFileSync,
  mkdirSync,
  writeFileSync,
  rmSync,
  symlinkSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
  prepareTask,
  verifySnapshots,
  summariseMetrics,
} from '../scripts/research-efficiency.mjs';

const hash = (value) => createHash('sha256').update(value).digest('hex');
const task = () => ({
  taskId: 'fixture',
  agent: 'prisma-research',
  formationId: 'fixture-party',
  scope: 'national programme',
  question: 'Locate eligible sources',
  evidencePaths: [],
  sourceHashes: [],
  resultPath: 'results/fixture.json',
});
const metric = () => ({
  taskId: 'fixture',
  workloadSha256: hash('same-work'),
  model: 'fixture-model',
  reasoningEffort: 'high',
  usageSource: null,
  inputTokens: null,
  outputTokens: null,
  cachedInputTokens: null,
  reasoningOutputTokens: null,
  searchQueries: 2,
  sourceOpens: 1,
  cacheHits: 0,
  attempts: 1,
  qualityErrors: 0,
});

test('task packets accept the bounded discovery role and reject unrecognised roles', () => {
  for (const agent of [
    'prisma-discovery',
    'prisma-research',
    'prisma-synthesis',
    'prisma-qa',
  ]) {
    const packet = prepareTask({
      ...task(),
      agent,
      maxSearchQueries: 3,
      maxSourceOpens: 4,
    });
    assert.equal(packet.agent, agent);
    assert.equal(packet.maxSearchQueries, 3);
    assert.equal(packet.maxSourceOpens, 4);
  }
  for (const agent of ['discovery', 'prisma-coordinator', '', null])
    assert.throws(
      () => prepareTask({ ...task(), agent }),
      /Unknown research agent/,
    );
});

test('offline handoffs permit zero web work and reject invalid budgets', () => {
  const packet = prepareTask({
    ...task(),
    maxSearchQueries: 0,
    maxSourceOpens: 0,
  });
  assert.equal(packet.maxSearchQueries, 0);
  assert.equal(packet.maxSourceOpens, 0);
  for (const key of ['maxSearchQueries', 'maxSourceOpens'])
    for (const value of [-1, 0.5, 51, '0'])
      assert.throws(
        () => prepareTask({ ...task(), [key]: value }),
        new RegExp(`Invalid ${key}`),
      );
});

test('task packets reject history and oversized handoffs, fixing electoral scope', () => {
  const packet = prepareTask(task());
  assert.throws(
    () =>
      prepareTask({ ...task(), sourceHashes: Array(25).fill(hash('fixture')) }),
    /Invalid source hashes/,
  );
  assert.equal(packet.history, 'none');
  assert.equal(packet.electionDate, '2026-11-29');
  assert.equal(packet.maxAttemptsPerIssue, 2);
  assert.throws(
    () => prepareTask({ ...task(), conversation: 'old history' }),
    /Unknown task field/,
  );
  assert.throws(
    () =>
      prepareTask({ ...task(), evidencePaths: Array(13).fill('source.json') }),
    /at most 12/,
  );
  assert.throws(
    () => prepareTask({ ...task(), question: 'x'.repeat(3501) }),
    /Invalid question/,
  );
});

test('benchmark identity tracks changed evidence and ignores source ordering', () => {
  const a = { ...task(), sourceHashes: [hash('a'), hash('b')] };
  assert.equal(
    prepareTask(a).workloadSha256,
    prepareTask({ ...a, sourceHashes: [...a.sourceHashes].reverse() })
      .workloadSha256,
  );
  assert.notEqual(
    prepareTask(a).workloadSha256,
    prepareTask({ ...a, sourceHashes: [hash('changed')] }).workloadSha256,
  );
});

test('offline cache verification detects tampering without claiming current electoral status', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'prisma-cache-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, 'source'));
  const original = '<p>Clearly synthetic source</p>';
  const extracted = JSON.stringify({
    sourceId: 'fixture-source',
    sourceSha256: hash(original),
    segments: [],
  });
  writeFileSync(join(root, 'source/original.html'), original);
  writeFileSync(join(root, 'source/extracted.json'), extracted);
  writeFileSync(
    join(root, 'source/metadata.json'),
    JSON.stringify({
      id: 'fixture-source',
      originalFile: 'original.html',
      sha256: hash(original),
      extractionSha256: hash(extracted),
    }),
  );
  const [result] = verifySnapshots(root, ['source/metadata.json']);
  assert.equal(result.reusableBytes, true);
  assert.equal(result.currentStatusVerified, false);
  assert.throws(
    () => verifySnapshots(root, ['../outside.json']),
    /escapes root/,
  );
  symlinkSync(join(root, 'source'), join(root, 'alias'));
  assert.throws(
    () => verifySnapshots(root, ['alias/metadata.json']),
    /Symlinked/,
  );
  writeFileSync(join(root, 'source/extracted.json'), 'tampered');
  assert.throws(
    () => verifySnapshots(root, ['source/metadata.json']),
    /Extraction hash mismatch/,
  );
  writeFileSync(join(root, 'source/extracted.json'), extracted);
  writeFileSync(join(root, 'source/original.html'), 'tampered');
  assert.throws(
    () => verifySnapshots(root, ['source/metadata.json']),
    /Original hash mismatch/,
  );
});

test('metrics never turn unavailable usage into zero or mix distinct workloads', () => {
  const rows = [
    metric(),
    {
      ...metric(),
      taskId: 'measured',
      usageSource: 'fixture telemetry',
      inputTokens: 100,
      outputTokens: 20,
      cachedInputTokens: 40,
      reasoningOutputTokens: 5,
    },
  ];
  const [group] = summariseMetrics(rows);
  assert.deepEqual(group.measurements.inputTokens, {
    reported: 1,
    missing: 1,
    knownSum: 100,
    total: null,
  });
  assert.equal(group.measurements.qualityErrors.total, 0);
  assert.equal(
    summariseMetrics([rows[1]])[0].measurements.inputTokens.total,
    100,
  );
  assert.equal(
    summariseMetrics([
      rows[0],
      { ...rows[1], workloadSha256: hash('other-work') },
    ]).length,
    2,
  );
  assert.throws(() => summariseMetrics([rows[0], rows[0]]), /Duplicate/);
  assert.throws(
    () => summariseMetrics([{ ...rows[1], usageSource: null }]),
    /usage source/,
  );
  assert.throws(
    () => summariseMetrics([{ ...rows[1], cachedInputTokens: 101 }]),
    /exceeds/,
  );
});

test('documented CLI prepares read-only handoffs and reports missing usage', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'prisma-efficiency-cli-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const script = fileURLToPath(
    new URL('../scripts/research-efficiency.mjs', import.meta.url),
  );
  const input = join(root, 'task.json');
  const bytes = JSON.stringify(task());
  writeFileSync(input, bytes);
  const result = JSON.parse(
    execFileSync(process.execPath, [script, 'packet', input], {
      encoding: 'utf8',
    }),
  );
  assert.equal(result.history, 'none');
  assert.equal(readFileSync(input, 'utf8'), bytes);
  const metrics = join(root, 'metrics.json');
  writeFileSync(metrics, JSON.stringify([metric()]));
  const [summary] = JSON.parse(
    execFileSync(process.execPath, [script, 'metrics', metrics], {
      encoding: 'utf8',
    }),
  );
  assert.equal(summary.measurements.inputTokens.total, null);
  assert.throws(
    () =>
      execFileSync(process.execPath, [script, 'unsupported', input], {
        stdio: 'pipe',
      }),
    /Command failed/,
  );
});
