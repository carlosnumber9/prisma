import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

mkdirSync('coverage', { recursive: true });
const result = spawnSync(
  process.execPath,
  [
    '--test',
    '--experimental-test-coverage',
    '--test-coverage-include=scripts/generate-content.mjs',
    '--test-reporter=spec',
    '--test-reporter=lcov',
    '--test-reporter-destination=stdout',
    '--test-reporter-destination=coverage/lcov.info',
    'tests/generate-content.test.mjs',
  ],
  { stdio: 'inherit' },
);
if (result.error) process.stderr.write(`${result.error.message}\n`);
process.exitCode = result.status ?? 1;
