import { createHash } from 'node:crypto';
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { locales } from '../src/lib/locales.mjs';

export const ELECTION_DATE = '2026-11-29';
const PUBLIC_FILES = [
  'parties.json',
  'topics.json',
  'sources.json',
  'syntheses.json',
];
const ordered = (items) =>
  [...items].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
const normalize = (text) => text.replace(/\s+/gu, ' ').trim();
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');

function requireCondition(condition, message) {
  if (!condition) throw new Error(message);
}

function fields(value, required, optional, context) {
  requireCondition(
    value !== null && typeof value === 'object' && !Array.isArray(value),
    `${context}: must be an object`,
  );
  for (const key of required) {
    requireCondition(Object.hasOwn(value, key), `${context}: missing ${key}`);
  }
  for (const key of Object.keys(value)) {
    requireCondition(
      required.includes(key) || optional.includes(key),
      `${context}: unknown field ${key}`,
    );
  }
}

function string(value, context, allowEmpty = false) {
  requireCondition(
    typeof value === 'string' && (allowEmpty || value.trim().length > 0),
    `${context}: must be text${allowEmpty ? '' : ' and non-empty'}`,
  );
}

function slug(value, context) {
  string(value, context);
  requireCondition(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value),
    `${context}: invalid identifier`,
  );
}

function timestamp(value, context) {
  string(value, context);
  requireCondition(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value),
    `${context}: use a UTC ISO 8601 timestamp`,
  );
  const date = new Date(value);
  requireCondition(
    !Number.isNaN(date.getTime()) &&
      date.toISOString().replace('.000Z', 'Z') === value.replace('.000Z', 'Z'),
    `${context}: invalid date`,
  );
}

function webUrl(value, context) {
  string(value, context);
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${context}: invalid URL`);
  }
  requireCondition(
    ['http:', 'https:'].includes(url.protocol) &&
      !url.username &&
      !url.password,
    `${context}: use an HTTP(S) URL without credentials`,
  );
}

function array(value, context) {
  requireCondition(Array.isArray(value), `${context}: must be an array`);
}

function regularFile(path) {
  requireCondition(
    existsSync(path) &&
      lstatSync(path).isFile() &&
      !lstatSync(path).isSymbolicLink(),
    `${path}: expected a regular file`,
  );
  return readFileSync(path);
}

function entries(path) {
  requireCondition(
    existsSync(path) &&
      lstatSync(path).isDirectory() &&
      !lstatSync(path).isSymbolicLink(),
    `${path}: expected a regular directory`,
  );
  return readdirSync(path)
    .sort()
    .filter((name) => !['.gitkeep', '.DS_Store'].includes(name));
}

function readJson(path) {
  const bytes = regularFile(path);
  try {
    return JSON.parse(bytes.toString('utf8'));
  } catch {
    throw new Error(`${path}: invalid JSON`);
  }
}

function localizedText(value, context, approved = true) {
  fields(
    value,
    approved ? [...locales] : ['es'],
    approved ? [] : [...locales],
    context,
  );
  for (const [locale, text] of Object.entries(value))
    string(text, `${context}.${locale}`);
}

function catalogue(path, kind, root) {
  const values = readJson(path);
  array(values, path);
  const byId = new Map();
  for (const value of values) {
    fields(
      value,
      kind === 'party' ? ['id', 'name', 'officialWebsite'] : ['id', 'label'],
      kind === 'party' ? ['officialColor', 'officialFont'] : [],
      path,
    );
    slug(value.id, `${path}.id`);
    if (kind === 'party') string(value.name, `${path}.${value.id}`);
    else localizedText(value.label, `${path}.${value.id}`);
    if (kind === 'party' && value.officialWebsite !== null)
      webUrl(value.officialWebsite, `${path}.${value.id}.officialWebsite`);
    if (kind === 'party') {
      const context = `${path}.${value.id}`;
      if (value.officialColor != null)
        requireCondition(
          typeof value.officialColor === 'string' &&
            /^#[0-9a-fA-F]{6}$/.test(value.officialColor),
          `${context}.officialColor: use a six-digit hex colour`,
        );
      if (value.officialFont != null) {
        const font = value.officialFont;
        fields(
          font,
          ['family', 'src', 'weight'],
          [],
          `${context}.officialFont`,
        );
        string(font.family, `${context}.officialFont.family`);
        requireCondition(
          typeof font.src === 'string' &&
            /^\/fonts\/parties\/[a-z0-9]+(?:-[a-z0-9]+)*\.(woff2?|ttf|otf)$/.test(
              font.src,
            ),
          `${context}.officialFont.src: use a local /fonts/parties/ font path`,
        );
        requireCondition(
          Number.isInteger(font.weight) &&
            font.weight >= 1 &&
            font.weight <= 1000,
          `${context}.officialFont.weight: use an integer from 1 to 1000`,
        );
        regularFile(join(root, 'public', font.src));
      }
    }
    requireCondition(
      !byId.has(value.id),
      `${path}: duplicate identifier ${value.id}`,
    );
    byId.set(value.id, value);
  }
  requireCondition(
    kind !== 'topic' || values.length > 0,
    `${path}: must contain topics`,
  );
  return byId;
}

function loadSources(root, parties) {
  const sources = new Map();
  for (const id of entries(join(root, 'content/sources'))) {
    slug(id, 'source.id');
    const directory = join(root, 'content/sources', id);
    const names = entries(directory);
    const meta = readJson(join(directory, 'metadata.json'));
    fields(
      meta,
      [
        'id',
        'partyId',
        'electionDate',
        'title',
        'url',
        'format',
        'capturedAt',
        'originalFile',
        'sha256',
        'extractionSha256',
      ],
      ['pageCount'],
      `source ${id}`,
    );
    requireCondition(
      meta.id === id,
      `source ${id}: ID does not match its directory`,
    );
    requireCondition(
      parties.has(meta.partyId),
      `source ${id}: unknown formation ${meta.partyId}`,
    );
    requireCondition(
      meta.electionDate === ELECTION_DATE,
      `source ${id}: only programmes for this election are allowed: ${ELECTION_DATE}`,
    );
    string(meta.title, `source ${id}.title`);
    webUrl(meta.url, `source ${id}.url`);
    timestamp(meta.capturedAt, `source ${id}.capturedAt`);
    requireCondition(
      ['pdf', 'html', 'other'].includes(meta.format),
      `source ${id}: invalid format`,
    );
    requireCondition(
      typeof meta.originalFile === 'string' &&
        /^original\.[a-z0-9]+$/.test(meta.originalFile),
      `source ${id}: originalFile must be named original.ext`,
    );
    requireCondition(
      meta.format !== 'pdf' || meta.originalFile === 'original.pdf',
      `source ${id}: a PDF must be stored as original.pdf`,
    );
    requireCondition(
      meta.format !== 'html' ||
        ['original.html', 'original.htm'].includes(meta.originalFile),
      `source ${id}: HTML must be stored as original.html or original.htm`,
    );
    requireCondition(
      names.length === 3 &&
        names.every((name) =>
          [meta.originalFile, 'metadata.json', 'extracted.json'].includes(name),
        ),
      `source ${id}: keep only the original, metadata.json and extracted.json`,
    );
    for (const key of ['sha256', 'extractionSha256']) {
      requireCondition(
        typeof meta[key] === 'string' && /^[a-f0-9]{64}$/.test(meta[key]),
        `source ${id}.${key}: invalid hash`,
      );
    }
    const original = regularFile(join(directory, meta.originalFile));
    requireCondition(original.length > 0, `source ${id}: empty original`);
    requireCondition(
      hash(original) === meta.sha256,
      `source ${id}: original hash mismatch`,
    );
    requireCondition(
      id === `${meta.partyId}-2026-${meta.sha256.slice(0, 12)}`,
      `source ${id}: incorrect version ID`,
    );
    const extractedBytes = regularFile(join(directory, 'extracted.json'));
    requireCondition(
      hash(extractedBytes) === meta.extractionSha256,
      `source ${id}: extraction hash mismatch`,
    );
    const extraction = readJson(join(directory, 'extracted.json'));
    fields(
      extraction,
      ['sourceId', 'sourceSha256', 'segments'],
      [],
      `extraction ${id}`,
    );
    requireCondition(
      extraction.sourceId === id && extraction.sourceSha256 === meta.sha256,
      `source ${id}: extraction linked to another version`,
    );
    array(extraction.segments, `source ${id}.segments`);
    requireCondition(
      extraction.segments.length > 0,
      `source ${id}: extraction has no segments`,
    );
    const segments = new Map();
    for (const segment of extraction.segments) {
      fields(
        segment,
        ['id', 'text'],
        ['page', 'printedPage', 'section', 'anchor'],
        `segment ${id}`,
      );
      slug(segment.id, `source ${id}.segment.id`);
      string(segment.text, `source ${id}.${segment.id}.text`, true);
      requireCondition(
        !segments.has(segment.id),
        `source ${id}: duplicate segment ${segment.id}`,
      );
      if (meta.format === 'pdf') {
        requireCondition(
          Number.isInteger(segment.page) && segment.page > 0,
          `source ${id}.${segment.id}: missing a valid physical page`,
        );
        requireCondition(
          !Object.hasOwn(segment, 'section') &&
            !Object.hasOwn(segment, 'anchor'),
          `source ${id}.${segment.id}: PDF uses pages`,
        );
        if (Object.hasOwn(segment, 'printedPage'))
          string(segment.printedPage, `source ${id}.${segment.id}.printedPage`);
      } else {
        string(segment.section, `source ${id}.${segment.id}.section`);
        requireCondition(
          !Object.hasOwn(segment, 'page') &&
            !Object.hasOwn(segment, 'printedPage'),
          `source ${id}.${segment.id}: this format uses sections`,
        );
        if (Object.hasOwn(segment, 'anchor')) {
          string(segment.anchor, `source ${id}.${segment.id}.anchor`);
          requireCondition(
            segment.anchor.startsWith('#') && segment.anchor.length > 1,
            `source ${id}.${segment.id}: invalid anchor`,
          );
        }
      }
      segments.set(segment.id, segment);
    }
    requireCondition(
      extraction.segments.some((segment) => normalize(segment.text).length > 0),
      `source ${id}: extraction has no verifiable text`,
    );
    if (meta.format === 'pdf') {
      requireCondition(
        Number.isInteger(meta.pageCount) && meta.pageCount > 0,
        `source ${id}: missing pageCount`,
      );
      requireCondition(
        extraction.segments.length === meta.pageCount &&
          extraction.segments.every(
            (segment, index) => segment.page === index + 1,
          ),
        `source ${id}: keep one entry per physical page in order, including empty pages`,
      );
    } else {
      requireCondition(
        !Object.hasOwn(meta, 'pageCount'),
        `source ${id}: pageCount is only valid for PDF`,
      );
    }
    sources.set(id, { meta, segments });
  }
  return sources;
}

function publicCitation(citation, sources, partyId, sourceIds, context) {
  fields(citation, ['sourceId', 'segmentId', 'quote'], [], context);
  const source = sources.get(citation.sourceId);
  requireCondition(
    source &&
      source.meta.partyId === partyId &&
      sourceIds.includes(citation.sourceId),
    `${context}: source is missing, belongs to another formation or is undeclared`,
  );
  const segment = source.segments.get(citation.segmentId);
  requireCondition(
    segment,
    `${context}: unknown segment ${citation.segmentId}`,
  );
  string(citation.quote, `${context}.quote`);
  requireCondition(
    normalize(segment.text).includes(normalize(citation.quote)),
    `${context}: quote does not occur in extracted text`,
  );
  const location =
    source.meta.format === 'pdf'
      ? {
          page: segment.page,
          ...(segment.printedPage ? { printedPage: segment.printedPage } : {}),
        }
      : {
          section: segment.section,
          ...(segment.anchor ? { anchor: segment.anchor } : {}),
        };
  return {
    sourceId: citation.sourceId,
    segmentId: citation.segmentId,
    quote: citation.quote,
    ...location,
  };
}

function loadSyntheses(root, parties, topics, sources) {
  const syntheses = new Map();
  const pointIds = new Set();
  const directory = join(root, 'content/editorial/syntheses');
  for (const partyId of entries(directory)) {
    requireCondition(
      parties.has(partyId),
      `syntheses: unknown formation ${partyId}`,
    );
    for (const name of entries(join(directory, partyId))) {
      requireCondition(
        name.endsWith('.json') && topics.has(name.slice(0, -5)),
        `syntheses ${partyId}: unknown topic or file ${name}`,
      );
      const synthesis = readJson(join(directory, partyId, name));
      const topicId = name.slice(0, -5);
      const id = `${partyId}--${topicId}`;
      fields(
        synthesis,
        [
          'id',
          'partyId',
          'topicId',
          'revision',
          'reviewStatus',
          'reviewedAt',
          'sourceIds',
          'points',
        ],
        ['internalNotes'],
        `synthesis ${id}`,
      );
      requireCondition(
        synthesis.id === id &&
          synthesis.partyId === partyId &&
          synthesis.topicId === topicId,
        `synthesis ${id}: identifiers do not match the path`,
      );
      requireCondition(
        !syntheses.has(id),
        `synthesis: duplicate identifier ${id}`,
      );
      requireCondition(
        Number.isInteger(synthesis.revision) && synthesis.revision > 0,
        `synthesis ${id}: invalid revision`,
      );
      requireCondition(
        ['pending', 'partial', 'complete'].includes(synthesis.reviewStatus),
        `synthesis ${id}: invalid review status`,
      );
      if (Object.hasOwn(synthesis, 'internalNotes'))
        string(synthesis.internalNotes, `synthesis ${id}.internalNotes`, true);
      array(synthesis.sourceIds, `synthesis ${id}.sourceIds`);
      requireCondition(
        new Set(synthesis.sourceIds).size === synthesis.sourceIds.length,
        `synthesis ${id}: duplicate sources`,
      );
      for (const sourceId of synthesis.sourceIds) {
        requireCondition(
          sources.get(sourceId)?.meta.partyId === partyId,
          `synthesis ${id}: source is missing or belongs to another formation ${sourceId}`,
        );
      }
      array(synthesis.points, `synthesis ${id}.points`);
      const approved = [];
      for (const point of synthesis.points) {
        fields(
          point,
          ['id', 'title', 'text', 'status', 'citations'],
          ['internalNotes'],
          `point ${id}`,
        );
        slug(point.id, `point ${id}.id`);
        requireCondition(
          !pointIds.has(point.id),
          `point: duplicate identifier ${point.id}`,
        );
        pointIds.add(point.id);
        localizedText(
          point.title,
          `point ${point.id}.title`,
          point.status === 'approved',
        );
        localizedText(
          point.text,
          `point ${point.id}.text`,
          point.status === 'approved',
        );
        requireCondition(
          ['draft', 'approved'].includes(point.status),
          `point ${point.id}: invalid status`,
        );
        if (Object.hasOwn(point, 'internalNotes'))
          string(point.internalNotes, `point ${point.id}.internalNotes`, true);
        array(point.citations, `point ${point.id}.citations`);
        requireCondition(
          point.citations.length > 0,
          `point ${point.id}: requires a verifiable citation`,
        );
        const citations = point.citations.map((citation) =>
          publicCitation(
            citation,
            sources,
            partyId,
            synthesis.sourceIds,
            `point ${point.id}.citation`,
          ),
        );
        if (point.status === 'approved')
          approved.push({
            id: point.id,
            title: point.title,
            text: point.text,
            citations,
          });
      }
      if (synthesis.reviewStatus === 'pending') {
        requireCondition(
          approved.length === 0 && synthesis.reviewedAt === null,
          `synthesis ${id}: pending cannot contain approved points or a review timestamp`,
        );
      } else {
        timestamp(synthesis.reviewedAt, `synthesis ${id}.reviewedAt`);
        requireCondition(
          synthesis.sourceIds.length > 0,
          `synthesis ${id}: missing reviewed source`,
        );
        if (synthesis.reviewStatus === 'partial')
          requireCondition(
            approved.length > 0,
            `synthesis ${id}: partial requires approved points`,
          );
        if (synthesis.reviewStatus === 'complete')
          requireCondition(
            approved.length === synthesis.points.length,
            `synthesis ${id}: complete cannot contain drafts`,
          );
      }
      const visibleSourceIds =
        synthesis.reviewStatus === 'complete'
          ? [...synthesis.sourceIds].sort()
          : [
              ...new Set(
                approved.flatMap((point) =>
                  point.citations.map((citation) => citation.sourceId),
                ),
              ),
            ].sort();
      syntheses.set(id, {
        id,
        partyId,
        topicId,
        path: `/parties/${partyId}/${topicId}`,
        revision:
          synthesis.reviewStatus === 'pending' ? null : synthesis.revision,
        reviewStatus: synthesis.reviewStatus,
        reviewedAt: synthesis.reviewedAt,
        sourceIds: visibleSourceIds,
        points: approved,
      });
    }
  }
  return syntheses;
}

export function buildContent(root) {
  // Reject symlinks in the input tree before following any nested path.
  entries(join(root, 'content'));
  entries(join(root, 'content/editorial'));
  const parties = catalogue(
    join(root, 'content/editorial/parties.json'),
    'party',
    root,
  );
  const topics = catalogue(
    join(root, 'content/editorial/topics.json'),
    'topic',
    root,
  );
  const sources = loadSources(root, parties);
  const syntheses = loadSyntheses(root, parties, topics, sources);
  for (const party of parties.values()) {
    for (const topic of topics.values()) {
      const id = `${party.id}--${topic.id}`;
      if (!syntheses.has(id))
        syntheses.set(id, {
          id,
          partyId: party.id,
          topicId: topic.id,
          path: `/parties/${party.id}/${topic.id}`,
          revision: null,
          reviewStatus: 'pending',
          reviewedAt: null,
          sourceIds: [],
          points: [],
        });
    }
  }
  const usedSources = new Set(
    [...syntheses.values()].flatMap((synthesis) => synthesis.sourceIds),
  );
  const publicSources = ordered(
    [...sources.values()]
      .filter((source) => usedSources.has(source.meta.id))
      .map(({ meta }) => ({
        id: meta.id,
        partyId: meta.partyId,
        electionDate: meta.electionDate,
        title: meta.title,
        url: meta.url,
        format: meta.format,
        capturedAt: meta.capturedAt,
        sha256: meta.sha256,
        ...(meta.format === 'pdf' ? { pageCount: meta.pageCount } : {}),
      })),
  );
  const envelope = (key, values) =>
    JSON.stringify(
      { schemaVersion: 3, electionDate: ELECTION_DATE, [key]: values },
      null,
      2,
    ) + '\n';
  return new Map([
    ['parties.json', envelope('parties', ordered([...parties.values()]))],
    [
      'topics.json',
      envelope(
        'topics',
        ordered([...topics.values()]).map((topic) => ({
          ...topic,
          path: `/topics/${topic.id}`,
        })),
      ),
    ],
    ['sources.json', envelope('sources', publicSources)],
    ['syntheses.json', envelope('syntheses', ordered([...syntheses.values()]))],
  ]);
}

export function generateContent(root, { check = false } = {}) {
  // Complete validation before touching any public output.
  const output = buildContent(root);
  const directory = join(root, 'content/generated');
  if (existsSync(directory)) {
    for (const name of entries(directory)) {
      requireCondition(
        PUBLIC_FILES.includes(name),
        `${directory}: unexpected file ${name}; review it before generating`,
      );
      regularFile(join(directory, name));
    }
  }
  if (check) {
    const stale = [...output].filter(
      ([name, bytes]) =>
        !existsSync(join(directory, name)) ||
        readFileSync(join(directory, name), 'utf8') !== bytes,
    );
    requireCondition(
      stale.length === 0,
      `Generated JSON is stale: ${stale.map(([name]) => name).join(', ')}. Run npm run content:generate.`,
    );
    return;
  }
  mkdirSync(directory, { recursive: true });
  for (const [name, bytes] of output) {
    const target = join(directory, name);
    if (existsSync(target) && readFileSync(target, 'utf8') === bytes) continue;
    const temporary = join(directory, `.${name}.${process.pid}.tmp`);
    try {
      writeFileSync(temporary, bytes, { flag: 'wx' });
      renameSync(temporary, target);
    } finally {
      rmSync(temporary, { force: true });
    }
  }
}

function main(args) {
  let root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  let check = false;
  for (let index = 0; index < args.length; index++) {
    if (args[index] === '--check') check = true;
    else if (args[index] === '--root' && args[index + 1])
      root = resolve(args[++index]);
    else if (args[index] === '--help') {
      process.stdout.write(
        'Usage: node scripts/generate-content.mjs [--check] [--root directory]\n',
      );
      return;
    } else throw new Error(`Unknown or incomplete argument: ${args[index]}`);
  }
  generateContent(root, { check });
  process.stdout.write(
    check
      ? 'Content validated; generated JSON is up to date.\n'
      : 'Content validated; JSON generated.\n',
  );
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
