import { lstatSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Deliberately bounded signatures: no credential validity or provider calls.
const signatures = [
  { kind: 'Mapbox access token', pattern: /\b(?:pk|sk)\.[A-Za-z0-9_.-]{20,}/g },
  {
    kind: 'GitHub access token',
    pattern: /\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})/g,
  },
  { kind: 'AWS access key ID', pattern: /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g },
  {
    kind: 'private key',
    pattern:
      /-----BEGIN (?:RSA |EC |DSA |OPENSSH |ENCRYPTED )?PRIVATE KEY-----/g,
  },
];

/** Return locations and signature names only, never matched values or snippets. */
export function findSourceSecrets(text, file) {
  const findings = [];
  for (const { kind, pattern } of signatures) {
    for (const match of text.matchAll(pattern)) {
      findings.push({
        file,
        line: text.slice(0, match.index).split('\n').length,
        kind,
      });
    }
  }
  return findings;
}

/** Inspect all bytes, including PDF streams, without following symlinks. */
export function scanSourceDirectory(directory) {
  const findings = [];
  try {
    lstatSync(directory);
  } catch (error) {
    if (error.code === 'ENOENT') return findings;
    throw error;
  }
  function visit(path) {
    const stat = lstatSync(path);
    if (stat.isSymbolicLink())
      throw new Error('Source scanning refuses symbolic links');
    if (stat.isDirectory()) {
      for (const name of readdirSync(path).sort()) visit(join(path, name));
    } else if (stat.isFile()) {
      // ASCII signatures are byte-aligned; no extraction or PDF decoding required.
      findings.push(
        ...findSourceSecrets(readFileSync(path).toString('latin1'), path),
      );
    }
  }
  visit(directory);
  return findings;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const directories = process.argv.slice(2);
  const paths = directories.length
    ? directories
    : [
        join(projectRoot, 'content/sources'),
        join(projectRoot, 'content/political-info/sources'),
      ];
  try {
    const findings = paths.flatMap((path) => scanSourceDirectory(path));
    if (findings.length) {
      for (const { file, line, kind } of findings)
        process.stderr.write(
          `${file}:${line}: possible ${kind}; redact before publication.\n`,
        );
      process.exitCode = 1;
    } else {
      process.stdout.write(
        'Source credential signature check passed (bounded patterns only).\n',
      );
    }
  } catch {
    process.stderr.write(
      'Source credential scan failed; inspect source paths and permissions.\n',
    );
    process.exitCode = 1;
  }
}
