import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { scanSourceDirectory } from './check-source-secrets.mjs';
import { generateContent } from './generate-content.mjs';
import { generateProvincialContent } from './generate-provincial-content.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const digest = /^[a-f0-9]{64}$/;
const slug = '[a-z0-9]+(?:-[a-z0-9]+)*';
const allowed = new RegExp(
  `^(?:content/editorial/(?:parties|programme-identities)\\.json|content/editorial/syntheses/${slug}/${slug}\\.json|content/sources/${slug}/(?:metadata|extracted)\\.json)$`,
);
const generated = [
  ...['parties', 'topics', 'sources', 'syntheses'].map(
    (name) => `content/generated/${name}.json`,
  ),
  'content/generated-provincial/congress.json',
];

function fields(value, keys) {
  assert.ok(
    value && typeof value === 'object' && !Array.isArray(value),
    'Expected an object',
  );
  assert.deepEqual(
    Object.keys(value).sort(),
    [...keys].sort(),
    'Unexpected or missing fields',
  );
}

// Reject symlinks in every existing component, including parent directories.
function confined(directory, name) {
  assert.ok(
    !isAbsolute(name) &&
      !name.includes('\\') &&
      !name.split('/').some((part) => part === '..' || part === '.' || !part),
    'Invalid relative path',
  );
  const base = realpathSync(directory);
  const target = resolve(base, name);
  assert.ok(
    relative(base, target) && !relative(base, target).startsWith('..'),
    'Path escapes root',
  );
  let current = base;
  for (const part of name.split('/')) {
    current = resolve(current, part);
    if (existsSync(current))
      assert.ok(!lstatSync(current).isSymbolicLink(), 'Symlinked path');
    else {
      // existsSync follows symlinks; lstat also catches dangling links.
      try {
        assert.ok(!lstatSync(current).isSymbolicLink(), 'Dangling symlink');
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
    }
  }
  if (existsSync(target))
    assert.ok(lstatSync(target).isFile(), 'Expected a regular file');
  return target;
}

function readCurrent(directory, name) {
  const path = confined(directory, name);
  return existsSync(path) ? readFileSync(path) : null;
}

// Include the complete validation baseline, so unrelated concurrent content edits
// invalidate staging rather than producing output from an obsolete snapshot.
function snapshot(directory, name = 'content') {
  const result = new Map();
  const visit = (path) => {
    const absolute = resolve(directory, path);
    const info = lstatSync(absolute);
    assert.ok(!info.isSymbolicLink(), 'Symlinked validation input');
    if (info.isDirectory())
      for (const entry of readdirSync(absolute).sort())
        visit(`${path}/${entry}`);
    else {
      assert.ok(info.isFile(), 'Non-regular validation input');
      result.set(path, hash(readFileSync(absolute)));
    }
  };
  if (existsSync(resolve(directory, name))) visit(name);
  return result;
}

export function batchFilesDigest(files) {
  return hash(
    JSON.stringify(
      files
        .map(({ path, expectedSha256, sha256 }) => ({
          path,
          expectedSha256,
          sha256,
        }))
        .sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0)),
    ),
  );
}

export function validateManifest(batch, accepted = true) {
  fields(batch, [
    'schemaVersion',
    'electionDate',
    'batchId',
    'acceptance',
    'qa',
    'files',
  ]);
  assert.equal(batch.schemaVersion, 1);
  assert.equal(batch.electionDate, '2026-11-29');
  assert.ok(
    typeof batch.batchId === 'string' &&
      /^[a-z0-9-]{1,120}$/.test(batch.batchId),
  );
  assert.ok(
    Array.isArray(batch.files) &&
      batch.files.length > 0 &&
      batch.files.length <= 512,
  );
  const seen = new Set();
  for (const file of batch.files) {
    fields(file, ['path', 'expectedSha256', 'sha256', 'content']);
    assert.ok(
      typeof file.path === 'string' && allowed.test(file.path),
      'Path is outside the programme batch allowlist',
    );
    assert.ok(!seen.has(file.path), 'Duplicate batch path');
    seen.add(file.path);
    assert.ok(
      file.expectedSha256 === null ||
        (typeof file.expectedSha256 === 'string' &&
          digest.test(file.expectedSha256)),
      'Invalid baseline hash',
    );
    assert.ok(
      typeof file.content === 'string' &&
        file.content.length <= 16 * 1024 * 1024,
      'Invalid content',
    );
    assert.equal(
      file.sha256,
      hash(file.content),
      'Proposed file hash mismatch',
    );
    JSON.parse(file.content);
  }
  const filesSha256 = batchFilesDigest(batch.files);
  if (accepted) {
    fields(batch.acceptance, ['authority', 'reference']);
    assert.ok(['maintainer', 'delegated'].includes(batch.acceptance.authority));
    assert.ok(
      typeof batch.acceptance.reference === 'string' &&
        batch.acceptance.reference.trim().length >= 12,
      'Record the actual authorization reference',
    );
    fields(batch.qa, ['agent', 'result', 'reviewedFilesSha256']);
    assert.equal(batch.qa.agent, 'prisma-qa');
    assert.equal(batch.qa.result, 'passed');
    assert.equal(
      batch.qa.reviewedFilesSha256,
      filesSha256,
      'QA reviewed different files',
    );
  }
  return filesSha256;
}

function baselineMatches(directory, files) {
  for (const file of files) {
    const before = readCurrent(directory, file.path);
    assert.equal(
      before === null ? null : hash(before),
      file.expectedSha256,
      `Baseline changed: ${file.path}`,
    );
    if (before && file.path === 'content/editorial/parties.json') {
      const ids = new Set(JSON.parse(file.content).map((party) => party.id));
      assert.ok(
        JSON.parse(before.toString('utf8')).every((party) => ids.has(party.id)),
        'Batch cannot remove existing catalogue IDs',
      );
    }
    // Require an actual editorial revision for changed existing syntheses and
    // prohibit removing accepted stable points through a batch replacement.
    if (
      before &&
      file.path.startsWith('content/editorial/syntheses/') &&
      hash(before) !== file.sha256
    ) {
      const old = JSON.parse(before.toString('utf8'));
      const next = JSON.parse(file.content);
      assert.equal(next.id, old.id, 'Synthesis identity changed');
      assert.equal(
        next.revision,
        old.revision + 1,
        'Changed synthesis must increment revision once',
      );
      const ids = new Set(next.points.map((point) => point.id));
      assert.ok(
        old.points.every((point) => ids.has(point.id)),
        'Batch cannot remove existing point IDs',
      );
    }
  }
}

function atomicWrite(path, bytes) {
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.${process.pid}.tmp`;
  let created = false;
  try {
    writeFileSync(temporary, bytes, { flag: 'wx' });
    created = true;
    renameSync(temporary, path);
  } finally {
    if (created) rmSync(temporary, { force: true });
  }
}

export function applyBatch(directory, batch, apply = false) {
  const reviewedFilesSha256 = validateManifest(batch);
  baselineMatches(directory, batch.files);
  const temporaryRoot = realpathSync(tmpdir());
  const inside = relative(realpathSync(directory), temporaryRoot);
  assert.ok(
    inside.startsWith('..') || isAbsolute(inside),
    'Temporary staging must be outside the repository',
  );
  const lock = resolve(
    temporaryRoot,
    `prisma-editorial-${hash(realpathSync(directory)).slice(0, 20)}.lock`,
  );
  mkdirSync(lock); // Refuse concurrent batch writers; never silently remove a stale lock.
  let staging;
  try {
    const baseline = snapshot(directory);
    const fonts = snapshot(directory, 'public/fonts');
    staging = mkdtempSync(resolve(temporaryRoot, 'prisma-accepted-'));
    cpSync(resolve(directory, 'content'), resolve(staging, 'content'), {
      recursive: true,
    });
    if (fonts.size)
      cpSync(
        resolve(directory, 'public/fonts'),
        resolve(staging, 'public/fonts'),
        { recursive: true },
      );
    for (const file of batch.files)
      atomicWrite(confined(staging, file.path), file.content);
    assert.equal(
      scanSourceDirectory(resolve(staging, 'content')).length,
      0,
      'Credential signature found in proposed content',
    );
    generateContent(staging, { approvedOnly: true });
    generateProvincialContent(staging);
    const paths = [...batch.files.map((file) => file.path), ...generated];
    for (const name of paths) confined(directory, name);
    assert.deepEqual(
      snapshot(directory),
      baseline,
      'Content changed during validation',
    );
    assert.deepEqual(
      snapshot(directory, 'public/fonts'),
      fonts,
      'Fonts changed during validation',
    );
    baselineMatches(directory, batch.files);
    if (apply) {
      const backups = new Map(
        paths.map((name) => [name, readCurrent(directory, name)]),
      );
      const written = [];
      try {
        for (const name of paths) {
          // Detect target edits immediately before each replacement as well.
          const current = readCurrent(directory, name);
          assert.deepEqual(
            current,
            backups.get(name),
            `Concurrent edit: ${name}`,
          );
          atomicWrite(
            confined(directory, name),
            readFileSync(confined(staging, name)),
          );
          written.push(name);
        }
      } catch (error) {
        for (const name of written.reverse()) {
          const before = backups.get(name);
          const target = confined(directory, name);
          // Preserve a concurrent editor's replacement rather than overwriting it.
          assert.equal(
            hash(readFileSync(target)),
            hash(readFileSync(confined(staging, name))),
            `Rollback requires manual recovery: ${name}`,
          );
          if (before === null) rmSync(target);
          else atomicWrite(target, before);
        }
        throw error;
      }
    }
    return {
      batchId: batch.batchId,
      reviewedFilesSha256,
      applied: apply,
      paths,
    };
  } finally {
    if (staging) rmSync(staging, { recursive: true, force: true });
    rmSync(lock, { recursive: true });
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  try {
    const [command, file, flag, expected, ...extra] = process.argv.slice(2);
    assert.ok(
      ['digest', 'check', 'apply'].includes(command) && file && !extra.length,
      'Usage: apply-editorial-batch.mjs digest|check <manifest> OR apply <manifest> --sha256 <manifest-sha256>',
    );
    const path = realpathSync(file);
    assert.ok(
      relative(root, path).startsWith('..'),
      'Batch manifests must remain outside the repository',
    );
    assert.ok(
      lstatSync(path).isFile() && lstatSync(path).size <= 64 * 1024 * 1024,
      'Invalid manifest file',
    );
    const bytes = readFileSync(path);
    if (command === 'apply')
      assert.ok(
        flag === '--sha256' &&
          digest.test(expected) &&
          hash(bytes) === expected,
        'Apply requires the exact accepted manifest SHA-256',
      );
    else assert.ok(!flag && !expected, 'Unexpected arguments');
    const batch = JSON.parse(bytes.toString('utf8'));
    const result =
      command === 'digest'
        ? {
            manifestSha256: hash(bytes),
            reviewedFilesSha256: validateManifest(batch, false),
          }
        : {
            manifestSha256: hash(bytes),
            ...applyBatch(root, batch, command === 'apply'),
          };
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
