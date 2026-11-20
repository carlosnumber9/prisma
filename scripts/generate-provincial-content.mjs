import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, lstatSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const normalize = (value) => value.replace(/\s+/gu, ' ').trim();
const json = (path) => JSON.parse(readFileSync(path, 'utf8'));
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
function utc(value) {
  assert.match(value, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?Z$/);
  assert.equal(new Date(value).toISOString().slice(0, 19), value.slice(0, 19));
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

// This validates only the presence-only Congress subset used by this feature.
// It is not a general validator for political biographies or candidate lists.
export function projectProvincialContent(
  dataset,
  provinces,
  programmeParties,
  readSource,
) {
  keys(dataset, [
    'schemaVersion',
    'datasetId',
    'revision',
    'reviewedAt',
    'coverage',
    'entities',
    'facts',
    'candidatures',
    'sources',
  ]);
  assert.equal(dataset.schemaVersion, 1);
  assert.equal(dataset.datasetId, 'congress-2026-provinces');
  assert.ok(Number.isInteger(dataset.revision) && dataset.revision > 0);
  utc(dataset.reviewedAt);
  keys(dataset.coverage, ['entityIds', 'asOf', 'status', 'limitations']);
  date(dataset.coverage.asOf);
  assert.equal(dataset.coverage.status, 'partial');
  keys(dataset.coverage.limitations, ['es', 'ca', 'gl', 'eu', 'oc', 'en']);
  Object.values(dataset.coverage.limitations).forEach((text) =>
    assert.ok(typeof text === 'string' && text.trim()),
  );
  assert.deepEqual(dataset.facts, []);
  const entities = unique(dataset.entities);
  const sources = unique(dataset.sources);
  const segments = new Map();
  for (const source of sources.values()) {
    keys(source, [
      'id',
      'title',
      'url',
      'authority',
      'publishedAt',
      'capturedAt',
      'sha256',
      'redacted',
    ]);
    assert.equal(source.authority, 'electoral');
    const url = new URL(source.url);
    assert.equal(url.protocol, 'https:');
    assert.equal(url.hostname, 'www.boe.es');
    assert.equal(url.username + url.password, '');
    date(source.publishedAt);
    assert.ok(source.publishedAt <= dataset.coverage.asOf);
    assert.ok(source.capturedAt.slice(0, 10) >= source.publishedAt);
    utc(source.capturedAt);
    assert.match(source.sha256, /^[a-f0-9]{64}$/);
    assert.equal(source.id, `source-${source.sha256.slice(0, 12)}`);
    const { metadata, original, extractedBytes } = readSource(source.id);
    keys(metadata, [
      ...Object.keys(source),
      'originalFile',
      'extractionSha256',
    ]);
    for (const key of Object.keys(source))
      assert.deepEqual(metadata[key], source[key]);
    assert.equal(
      metadata.originalFile,
      source.redacted ? 'redacted.html' : 'original.html',
    );
    assert.equal(hash(original), source.sha256);
    assert.equal(hash(extractedBytes), metadata.extractionSha256);
    const extracted = JSON.parse(extractedBytes.toString('utf8'));
    keys(extracted, ['sourceId', 'sourceSha256', 'segments']);
    assert.equal(extracted.sourceId, source.id);
    assert.equal(extracted.sourceSha256, source.sha256);
    const entries = unique(extracted.segments);
    for (const segment of entries.values()) {
      keys(segment, ['id', 'text', 'section']);
      assert.ok(segment.text.trim() && segment.section.trim());
    }
    segments.set(source.id, entries);
  }
  const citations = (items) => {
    assert.ok(Array.isArray(items) && items.length > 0);
    for (const citation of items) {
      keys(citation, ['sourceId', 'segmentId', 'quote']);
      const segment = segments.get(citation.sourceId)?.get(citation.segmentId);
      assert.ok(
        segment &&
          citation.quote.trim() &&
          normalize(segment.text).includes(normalize(citation.quote)),
        'Unverifiable citation',
      );
    }
  };
  for (const entity of entities.values()) {
    keys(entity, ['id', 'kind', 'name', 'citations']);
    assert.ok(
      ['formation', 'territory', 'election', 'institution'].includes(
        entity.kind,
      ),
    );
    assert.ok(typeof entity.name === 'string' && entity.name.trim());
    citations(entity.citations);
  }
  for (const id of dataset.coverage.entityIds) assert.ok(entities.has(id));
  assert.equal(
    new Set(dataset.coverage.entityIds).size,
    dataset.coverage.entityIds.length,
  );
  const provinceIds = new Set();
  const output = provinces.map((province) => {
    keys(province, ['id', 'name', 'aliases']);
    assert.match(province.id, /^\d{2}$/);
    assert.ok(!provinceIds.has(province.id));
    provinceIds.add(province.id);
    assert.ok(
      dataset.coverage.entityIds.includes(`territory-province-${province.id}`),
    );
    assert.equal(
      entities.get(`territory-province-${province.id}`)?.kind,
      'territory',
    );
    return { id: province.id, parties: [] };
  });
  const byProvince = new Map(output.map((p) => [p.id, p]));
  const catalogue = new Map(programmeParties.map((p) => [p.id, p]));
  const pairs = new Set();
  unique(dataset.candidatures);
  for (const candidature of dataset.candidatures) {
    keys(candidature, [
      'id',
      'formationId',
      'electionId',
      'institutionId',
      'constituencyId',
      'status',
      'asOf',
      'listCoverage',
      'candidates',
      'citations',
    ]);
    assert.equal(candidature.institutionId, 'institution-congress');
    assert.equal(candidature.electionId, 'election-general-2026');
    assert.equal(entities.get(candidature.institutionId)?.kind, 'institution');
    assert.equal(entities.get(candidature.electionId)?.kind, 'election');
    assert.equal(candidature.status, 'proclaimed');
    assert.equal(candidature.listCoverage, 'partial');
    assert.deepEqual(candidature.candidates, []);
    date(candidature.asOf);
    assert.equal(candidature.asOf, dataset.coverage.asOf);
    citations(candidature.citations);
    const formation = entities.get(candidature.formationId);
    assert.equal(formation?.kind, 'formation');
    const province = byProvince.get(
      candidature.constituencyId.replace('territory-province-', ''),
    );
    assert.ok(province, 'Unknown province');
    const pair = `${province.id}/${formation.id}`;
    assert.ok(!pairs.has(pair), 'Duplicate formation in constituency');
    pairs.add(pair);
    // Only identical, already-reviewed formation IDs can expose programme routes.
    // Coalition members and similar territorial labels do not imply identity.
    const programme = catalogue.get(formation.id);
    const abbreviation = formation.name.match(/\(([^()]*)\)\s*$/)?.[1];
    const label =
      programme?.name ??
      (formation.name.startsWith('FRENTE OBRERO')
        ? 'Frente Obrero'
        : (abbreviation ?? formation.name));
    province.parties.push({
      id: formation.id,
      label,
      programmeId: programme?.id ?? null,
    });
  }
  assert.equal(provinces.length, 52);
  for (const province of output) {
    assert.ok(province.parties.length > 0, `Missing province ${province.id}`);
    province.parties.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  }
  return {
    schemaVersion: 1,
    electionDate: '2026-11-29',
    revision: dataset.revision,
    provinces: output,
  };
}

export function generateProvincialContent(directory, check = false) {
  const dataset = json(
    join(
      directory,
      'content/political-info/approved/congress-2026-provinces.json',
    ),
  );
  const readSource = (id) => {
    const base = join(directory, 'content/political-info/sources', id);
    const metadata = json(join(base, 'metadata.json'));
    assert.ok(
      ['original.html', 'redacted.html'].includes(metadata.originalFile),
    );
    const read = (name) => {
      const path = join(base, name);
      assert.ok(lstatSync(path).isFile() && !lstatSync(path).isSymbolicLink());
      return readFileSync(path);
    };
    return {
      metadata,
      original: read(metadata.originalFile),
      extractedBytes: read('extracted.json'),
    };
  };
  const output = projectProvincialContent(
    dataset,
    json(join(directory, 'content/geography/provinces.json')),
    json(join(directory, 'content/editorial/parties.json')),
    readSource,
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
