import assert from 'node:assert/strict';
import {
  mkdtempSync,
  mkdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import {
  findSourceSecrets,
  scanSourceDirectory,
} from '../scripts/check-source-secrets.mjs';

const syntheticToken = (prefix) => `${prefix}.${'synthetic'.repeat(6)}`;
const checker = new URL('../scripts/check-source-secrets.mjs', import.meta.url);

function temporaryDirectory(t) {
  const path = mkdtempSync(join(tmpdir(), 'prisma-source-secrets-'));
  t.after(() => rmSync(path, { recursive: true, force: true }));
  return path;
}

test('reports both Mapbox token prefixes with line numbers and no values', () => {
  for (const prefix of ['pk', 'sk']) {
    const token = syntheticToken(prefix);
    const findings = findSourceSecrets(
      `header\r\nmapbox="${token}"`,
      'source.html',
    );
    assert.deepEqual(findings, [
      { file: 'source.html', line: 2, kind: 'Mapbox access token' },
    ]);
    assert.equal(JSON.stringify(findings).includes(token), false);
  }
});

test('recognises additional bounded credential signatures', () => {
  const samples = [
    ['ghp_' + 'x'.repeat(36), 'GitHub access token'],
    ['github_pat_' + 'y'.repeat(40), 'GitHub access token'],
    ['AKIA' + 'Z'.repeat(16), 'AWS access key ID'],
    ['-----BEGIN ' + 'OPENSSH PRIVATE KEY-----', 'private key'],
  ];
  for (const [sample, kind] of samples) {
    assert.equal(findSourceSecrets(sample, 'fixture')[0]?.kind, kind);
  }
});

test('allows redacted evidence and ordinary political source text', () => {
  assert.deepEqual(
    findSourceSecrets(
      'Candidate 1. Mapbox: [REDACTED_MAPBOX_TOKEN].',
      'fixture',
    ),
    [],
  );
});

test('recurses into captures, including byte streams, and CLI fails without leaking values', (t) => {
  const root = temporaryDirectory(t);
  const nested = join(root, 'snapshot');
  mkdirSync(nested);
  const token = syntheticToken('pk');
  writeFileSync(
    join(nested, 'original.pdf'),
    Buffer.concat([Buffer.from([0, 255]), Buffer.from(`\n${token}`)]),
  );
  assert.equal(scanSourceDirectory(root).length, 1);
  const result = spawnSync(process.execPath, [checker.pathname, root], {
    encoding: 'utf8',
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /original\.pdf:2: possible Mapbox access token/);
  assert.equal((result.stdout + result.stderr).includes(token), false);
});

test('CLI accepts sanitised captures', (t) => {
  const root = temporaryDirectory(t);
  writeFileSync(
    join(root, 'redacted.html'),
    '<p>Election evidence</p> [REDACTED_MAPBOX_TOKEN]',
  );
  const result = spawnSync(process.execPath, [checker.pathname, root], {
    encoding: 'utf8',
  });
  assert.equal(result.status, 0);
  assert.equal(result.stderr, '');
});

test('refuses source symlinks and does not silently scan their targets', (t) => {
  const root = temporaryDirectory(t);
  const outside = temporaryDirectory(t);
  symlinkSync(outside, join(root, 'external'));
  assert.throws(() => scanSourceDirectory(root), /refuses symbolic links/);
});

test('rejects dangling source symlinks too', (t) => {
  const root = temporaryDirectory(t);
  symlinkSync(join(root, 'missing'), join(root, 'dangling'));
  assert.throws(
    () => scanSourceDirectory(join(root, 'dangling')),
    /refuses symbolic links/,
  );
});
