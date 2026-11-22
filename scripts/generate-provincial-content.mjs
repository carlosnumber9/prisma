import assert from 'node:assert/strict';
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  lstatSync,
  existsSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { programmeForFormation } from './programme-identity.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const json = (path) => {
  assert.ok(lstatSync(path).isFile() && !lstatSync(path).isSymbolicLink());
  return JSON.parse(readFileSync(path, 'utf8'));
};
function keys(value, names) {
  assert.ok(value && typeof value === 'object' && !Array.isArray(value));
  assert.deepEqual(Object.keys(value).sort(), [...names].sort());
}
function date(value) {
  assert.match(value, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(
    new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10),
    value,
  );
}
function unique(items) {
  const result = new Map();
  for (const item of items) {
    assert.match(item.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(!result.has(item.id), `Duplicate ID: ${item.id}`);
    result.set(item.id, item);
  }
  return result;
}

// This contract stores only the formation presence needed by the portal.
// Official URLs document provenance; offline checks do not reverify the BOE.
export function projectProvincialContent(
  dataset,
  provinces,
  programmeParties,
  programmeAliases = {},
) {
  keys(dataset, [
    'schemaVersion',
    'electionDate',
    'revision',
    'asOf',
    'sources',
    'formations',
    'provinces',
  ]);
  assert.equal(dataset.schemaVersion, 1);
  assert.equal(dataset.electionDate, '2026-11-29');
  assert.ok(Number.isInteger(dataset.revision) && dataset.revision > 0);
  date(dataset.asOf);
  assert.ok(dataset.asOf <= dataset.electionDate);
  assert.ok(Array.isArray(dataset.sources) && dataset.sources.length > 0);
  unique(dataset.sources);
  for (const source of dataset.sources) {
    keys(source, ['id', 'title', 'url', 'publishedAt']);
    assert.ok(typeof source.title === 'string' && source.title.trim());
    const url = new URL(source.url);
    assert.equal(url.protocol, 'https:');
    assert.equal(url.hostname, 'www.boe.es');
    assert.equal(url.username + url.password, '');
    date(source.publishedAt);
    assert.ok(source.publishedAt <= dataset.asOf);
  }
  assert.ok(Array.isArray(dataset.formations));
  const formations = unique(dataset.formations);
  for (const formation of formations.values()) {
    keys(formation, ['id', 'name']);
    assert.ok(typeof formation.name === 'string' && formation.name.trim());
  }
  const programmeByFormation = new Map(
    [...formations.values()].map((formation) => [
      formation.id,
      programmeForFormation(formation, programmeParties, programmeAliases),
    ]),
  );
  assert.ok(Array.isArray(dataset.provinces));
  const expected = new Set(provinces.map((province) => province.id));
  assert.equal(expected.size, 52);
  const seen = new Set();
  const used = new Set();
  const output = dataset.provinces.map((province) => {
    keys(province, ['id', 'formationIds']);
    assert.ok(
      expected.has(province.id) && !seen.has(province.id),
      'Unknown or duplicate province',
    );
    seen.add(province.id);
    assert.ok(
      Array.isArray(province.formationIds) && province.formationIds.length > 0,
    );
    assert.equal(
      new Set(province.formationIds).size,
      province.formationIds.length,
      'Duplicate formation in constituency',
    );
    const parties = province.formationIds.map((id) => {
      const formation = formations.get(id);
      assert.ok(formation, 'Unknown formation');
      used.add(id);
      const programme = programmeByFormation.get(id);
      const abbreviation = formation.name.match(/\(([^()]*)\)\s*$/)?.[1];
      return {
        id,
        label:
          programme?.name ??
          (formation.name.startsWith('FRENTE OBRERO')
            ? 'Frente Obrero'
            : (abbreviation ?? formation.name)),
        programmeId: programme?.id ?? null,
      };
    });
    parties.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
    return { id: province.id, parties };
  });
  assert.equal(seen.size, expected.size, 'Missing province');
  assert.equal(used.size, formations.size, 'Unused formation');
  output.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return {
    schemaVersion: 1,
    electionDate: dataset.electionDate,
    revision: dataset.revision,
    provinces: output,
  };
}

export function generateProvincialContent(directory, check = false) {
  assert.ok(
    !existsSync(join(directory, 'content/political-info')),
    'Legacy political research must remain outside the repository',
  );
  const dataset = json(
    join(directory, 'content/editorial/provincial-presence.json'),
  );
  const output = projectProvincialContent(
    dataset,
    json(join(directory, 'content/geography/provinces.json')),
    json(join(directory, 'content/editorial/parties.json')),
    json(join(directory, 'content/editorial/programme-identities.json')),
  );
  const path = join(directory, 'content/generated-provincial/congress.json');
  const bytes = `${JSON.stringify(output, null, 2)}\n`;
  if (check)
    assert.equal(
      readFileSync(path, 'utf8'),
      bytes,
      'Provincial content is stale',
    );
  else {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, bytes);
  }
  return output;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    assert.ok(process.argv.slice(2).every((arg) => arg === '--check'));
    const result = generateProvincialContent(
      root,
      process.argv.includes('--check'),
    );
    console.log(
      `Validated ${result.provinces.length} provinces and ${result.provinces.reduce((total, p) => total + p.parties.length, 0)} Congress candidatures.`,
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
