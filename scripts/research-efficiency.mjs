import { createHash } from 'node:crypto';
import { readFileSync, realpathSync, lstatSync } from 'node:fs';
import { isAbsolute, relative, resolve, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';

const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const digest = /^[a-f0-9]{64}$/;
const roles = ['prisma-research', 'prisma-synthesis', 'prisma-qa'];
function requireValue(condition, message) {
  if (!condition) throw new Error(message);
}

// A bounded task handoff is not a replacement for repository/skill instructions.
export function prepareTask(input) {
  const allowed = [
    'taskId',
    'agent',
    'formationId',
    'scope',
    'question',
    'evidencePaths',
    'sourceHashes',
    'resultPath',
    'maxSearchQueries',
    'maxSourceOpens',
  ];
  requireValue(
    input && typeof input === 'object' && !Array.isArray(input),
    'Expected task object',
  );
  requireValue(
    Object.keys(input).every((key) => allowed.includes(key)),
    'Unknown task field; do not include conversation history',
  );
  for (const key of [
    'taskId',
    'formationId',
    'scope',
    'question',
    'resultPath',
  ])
    requireValue(
      typeof input[key] === 'string' &&
        input[key].trim() &&
        input[key].length <= 3500,
      `Invalid ${key}`,
    );
  requireValue(roles.includes(input.agent), 'Unknown research agent');
  requireValue(
    Array.isArray(input.evidencePaths) &&
      input.evidencePaths.length <= 12 &&
      input.evidencePaths.every(
        (p) => typeof p === 'string' && p.length > 0 && p.length <= 1000,
      ),
    'Use at most 12 evidence paths',
  );
  requireValue(
    Array.isArray(input.sourceHashes) &&
      input.sourceHashes.length <= 24 &&
      input.sourceHashes.every((h) => typeof h === 'string' && digest.test(h)),
    'Invalid source hashes',
  );
  const limits = {};
  for (const [key, fallback] of [
    ['maxSearchQueries', 8],
    ['maxSourceOpens', 12],
  ]) {
    const value = input[key] ?? fallback;
    requireValue(
      Number.isSafeInteger(value) && value > 0 && value <= 50,
      `Invalid ${key}`,
    );
    limits[key] = value;
  }
  const workloadSha256 = hash(
    JSON.stringify({
      electionDate: '2026-11-29',
      formationId: input.formationId,
      scope: input.scope,
      question: input.question,
      sourceHashes: [...new Set(input.sourceHashes)].sort(),
    }),
  );
  return {
    ...input,
    electionDate: '2026-11-29',
    ...limits,
    maxAttemptsPerIssue: 2,
    maxEscalationsPerIssue: 1,
    history: 'none',
    workloadSha256,
  };
}

// Restrict offline cache reads to regular, non-symlink files inside the run root.
function localFile(root, file) {
  requireValue(
    typeof file === 'string' && file.length > 0 && !isAbsolute(file),
    'Expected relative evidence path',
  );
  const base = realpathSync(root);
  const target = resolve(base, file);
  const inside = relative(base, target);
  requireValue(
    inside &&
      inside !== '..' &&
      !inside.startsWith('../') &&
      !isAbsolute(inside),
    'Evidence path escapes root',
  );
  let cursor = target;
  while (cursor !== base) {
    requireValue(
      !lstatSync(cursor).isSymbolicLink(),
      'Symlinked evidence is not allowed',
    );
    cursor = dirname(cursor);
  }
  requireValue(lstatSync(target).isFile(), 'Evidence must be a regular file');
  return target;
}

export function verifySnapshots(root, metadataPaths) {
  requireValue(Array.isArray(metadataPaths), 'Expected metadata path array');
  return metadataPaths.map((metadataPath) => {
    const path = localFile(root, metadataPath);
    const meta = JSON.parse(readFileSync(path, 'utf8'));
    requireValue(
      typeof meta.id === 'string' &&
        digest.test(meta.sha256) &&
        digest.test(meta.extractionSha256),
      'Invalid source hash metadata',
    );
    requireValue(
      typeof meta.originalFile === 'string' && !/[\\/]/.test(meta.originalFile),
      'Invalid original basename',
    );
    const folder = dirname(metadataPath);
    const original = localFile(root, `${folder}/${meta.originalFile}`);
    const extraction = localFile(root, `${folder}/extracted.json`);
    requireValue(
      hash(readFileSync(original)) === meta.sha256,
      `Original hash mismatch: ${meta.id}`,
    );
    requireValue(
      hash(readFileSync(extraction)) === meta.extractionSha256,
      `Extraction hash mismatch: ${meta.id}`,
    );
    const extracted = JSON.parse(readFileSync(extraction, 'utf8'));
    requireValue(
      extracted.sourceId === meta.id && extracted.sourceSha256 === meta.sha256,
      `Extraction identity mismatch: ${meta.id}`,
    );
    return {
      sourceId: meta.id,
      sha256: meta.sha256,
      extractionSha256: meta.extractionSha256,
      reusableBytes: true,
      currentStatusVerified: false,
    };
  });
}

const counters = [
  'inputTokens',
  'outputTokens',
  'cachedInputTokens',
  'reasoningOutputTokens',
  'searchQueries',
  'sourceOpens',
  'cacheHits',
  'attempts',
  'qualityErrors',
];
export function summariseMetrics(records) {
  requireValue(Array.isArray(records), 'Expected metrics array');
  const groups = new Map();
  const ids = new Set();
  for (const record of records) {
    requireValue(
      record && typeof record === 'object',
      'Invalid metrics record',
    );
    requireValue(
      typeof record.taskId === 'string' &&
        record.taskId &&
        !ids.has(record.taskId),
      'Duplicate or missing task ID',
    );
    ids.add(record.taskId);
    requireValue(
      digest.test(record.workloadSha256) &&
        typeof record.model === 'string' &&
        record.model &&
        typeof record.reasoningEffort === 'string' &&
        record.reasoningEffort,
      'Missing measured model/workload',
    );
    for (const key of counters)
      requireValue(
        record[key] === null ||
          (Number.isSafeInteger(record[key]) && record[key] >= 0),
        `Invalid or missing ${key}; use null when unavailable`,
      );
    if (counters.slice(0, 4).some((key) => record[key] !== null))
      requireValue(
        typeof record.usageSource === 'string' && record.usageSource.trim(),
        'Token measurements require a usage source',
      );
    for (const [subset, total] of [
      ['cachedInputTokens', 'inputTokens'],
      ['reasoningOutputTokens', 'outputTokens'],
    ])
      if (record[subset] !== null && record[total] !== null)
        requireValue(
          record[subset] <= record[total],
          `${subset} exceeds ${total}`,
        );
    const key = JSON.stringify([
      record.workloadSha256,
      record.model,
      record.reasoningEffort,
    ]);
    const group = groups.get(key) ?? {
      workloadSha256: record.workloadSha256,
      model: record.model,
      reasoningEffort: record.reasoningEffort,
      records: [],
    };
    group.records.push(record);
    groups.set(key, group);
  }
  return [...groups.values()].map(({ records: rows, ...group }) => ({
    ...group,
    taskCount: rows.length,
    measurements: Object.fromEntries(
      counters.map((key) => {
        const known = rows.filter((row) => row[key] !== null);
        const sum = known.reduce((total, row) => total + row[key], 0);
        return [
          key,
          {
            reported: known.length,
            missing: rows.length - known.length,
            knownSum: sum,
            total: known.length === rows.length ? sum : null,
          },
        ];
      }),
    ),
    note: 'Cached input is a subset of input; reasoning output is a subset of output. Missing usage is not zero. No price or savings estimate is inferred.',
  }));
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  try {
    const [command, file, root, ...extra] = process.argv.slice(2);
    requireValue(
      file && !extra.length,
      'Usage: research-efficiency.mjs packet|metrics <json> OR snapshots <index-json> <root>',
    );
    const input = JSON.parse(readFileSync(file, 'utf8'));
    let output;
    if (command === 'packet' && !root) output = prepareTask(input);
    else if (command === 'metrics' && !root) output = summariseMetrics(input);
    else if (command === 'snapshots' && root)
      output = verifySnapshots(root, input);
    else throw new Error('Invalid command or arguments');
    process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
