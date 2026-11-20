import './rendering-loader.mjs';
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import {
  createProvinceStore,
  matchProvince,
  searchProvinces,
  provinceAtCoordinates,
  provinces,
} from '../src/lib/provinces.ts';
import {
  generateProvincialContent,
  projectProvincialContent,
} from '../scripts/generate-provincial-content.mjs';
const root = new URL('../', import.meta.url).pathname;
const read = (path) =>
  JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'));
const boundaries = read('public/geography/provinces.json');
const square = (west, south, east, north) => [
  [west, south],
  [east, south],
  [east, north],
  [west, north],
  [west, south],
];
const fixture = {
  schemaVersion: 1,
  provinces: [
    {
      id: '08',
      bounds: [1, 40, 3, 42],
      polygons: [[square(1, 40, 3, 42), square(1.2, 40.2, 1.4, 40.4)]],
    },
  ],
};
const dependencies = (overrides = {}) => ({
  locate: async () => ({ longitude: 2, latitude: 41 }),
  boundaries: async () => fixture,
  readManual: () => null,
  writeManual: () => {},
  ...overrides,
});

test('province search supports aliases, accents, case and exact confirmation', () => {
  assert.equal(provinces.length, 52);
  for (const [query, id] of [
    ['vizcaya', '48'],
    [' ÁLAVA ', '01'],
    ['lerida', '25'],
    ['Baleares', '07'],
    ['València', '46'],
    ['La Coruña', '15'],
    ['Guipuzcoa', '20'],
  ])
    assert.equal(matchProvince(query)?.id, id);
  assert.equal(matchProvince('Mad'), undefined);
  assert.ok(searchProvinces('ten').some((p) => p.id === '38'));
  assert.deepEqual(searchProvinces('not-a-province'), []);
});

test('coordinate matching respects polygon holes, edges and invalid coordinates', () => {
  assert.equal(provinceAtCoordinates(fixture, 2, 41), '08');
  assert.equal(provinceAtCoordinates(fixture, 1, 41), '08');
  assert.equal(provinceAtCoordinates(fixture, 1.3, 40.3), undefined);
  for (const [x, y] of [
    [0, 0],
    [NaN, 41],
    [2, Infinity],
    [181, 41],
    [2, 91],
  ])
    assert.equal(provinceAtCoordinates(fixture, x, y), undefined);
});

test('official geometry covers mainland, islands, cities and enclaves without assigning neighbouring countries', () => {
  const locations = [
    [-3.7038, 40.4168, '28'],
    [2.1734, 41.3851, '08'],
    [-0.3763, 39.4699, '46'],
    [2.6502, 39.5696, '07'],
    [4.263, 39.889, '07'],
    [-15.4314, 28.1248, '35'],
    [-16.2518, 28.4636, '38'],
    [-5.3162, 35.8894, '51'],
    [-2.9381, 35.2923, '52'],
    [1.982, 42.464, '17'],
    [-2.744, 42.734, '09'],
  ];
  for (const [x, y, id] of locations)
    assert.equal(provinceAtCoordinates(boundaries, x, y), id, `${x}, ${y}`);
  for (const [x, y] of [
    [-9.139, 38.722],
    [2.3522, 48.8566],
    [-5.3536, 36.1408],
    [1.5218, 42.5063],
    [0, 35],
  ])
    assert.equal(
      provinceAtCoordinates(boundaries, x, y),
      undefined,
      `${x}, ${y}`,
    );
  const meta = read('content/geography/metadata.json');
  assert.equal(
    createHash('sha256')
      .update(
        readFileSync(
          new URL('../public/geography/provinces.json', import.meta.url),
        ),
      )
      .digest('hex'),
    meta.derivativeSha256,
  );
  assert.deepEqual(
    boundaries.provinces.map((p) => p.id).sort(),
    provinces.map((p) => p.id).sort(),
  );
});

test('automatic selection requests location once and resolves the province', async () => {
  let calls = 0;
  const store = createProvinceStore(
    dependencies({
      locate: async () => {
        calls++;
        return { longitude: 2, latitude: 41 };
      },
    }),
  );
  let changes = 0;
  const unsubscribe = store.subscribe(() => changes++);
  assert.equal(store.getSnapshot(), '28');
  await store.initialize();
  await store.initialize();
  assert.equal(store.getSnapshot(), '08');
  assert.equal(calls, 1);
  assert.equal(changes, 1);
  unsubscribe();
  store.select('17');
  assert.equal(changes, 1);
});

test('denial, unavailable location, geography failures and foreign positions retain Madrid', async () => {
  for (const override of [
    {
      locate: async () => {
        throw new Error('denied');
      },
    },
    {
      boundaries: async () => {
        throw new Error('offline');
      },
    },
    { locate: async () => ({ longitude: -9, latitude: 39 }) },
    { locate: async () => ({ longitude: NaN, latitude: 41 }) },
  ]) {
    const store = createProvinceStore(dependencies(override));
    await store.initialize();
    assert.equal(store.getSnapshot(), '28');
  }
});

test('a manual choice wins races against location and geography success or failure', async () => {
  for (const reject of [false, true]) {
    let finish;
    const pending = new Promise((resolve, rejectPromise) => {
      finish = () =>
        reject
          ? rejectPromise(new Error('timeout'))
          : resolve({ longitude: 2, latitude: 41 });
    });
    const writes = [];
    const store = createProvinceStore(
      dependencies({
        locate: () => pending,
        writeManual: (id) => writes.push(id),
      }),
    );
    const initialization = store.initialize();
    store.select('48');
    finish();
    await initialization;
    assert.equal(store.getSnapshot(), '48');
    assert.deepEqual(writes, ['48']);
  }
  let finish;
  const pending = new Promise((resolve) => {
    finish = () => resolve(fixture);
  });
  const store = createProvinceStore(
    dependencies({ boundaries: () => pending }),
  );
  const initializing = store.initialize();
  await Promise.resolve();
  store.select('07');
  finish();
  await initializing;
  assert.equal(store.getSnapshot(), '07');
  store.select('invalid');
  assert.equal(store.getSnapshot(), '07');
});

test('manual selection survives locale reloads; blocked or corrupt storage does not break geolocation', async () => {
  let calls = 0;
  const store = createProvinceStore(
    dependencies({
      readManual: () => '48',
      locate: async () => {
        calls++;
        throw new Error('must not request');
      },
    }),
  );
  await store.initialize();
  assert.equal(store.getSnapshot(), '48');
  assert.equal(calls, 0);
  for (const readManual of [
    () => 'invalid',
    () => {
      throw new Error('blocked');
    },
  ]) {
    const store = createProvinceStore(
      dependencies({
        readManual,
        writeManual: () => {
          throw new Error('blocked');
        },
      }),
    );
    await store.initialize();
    assert.equal(store.getSnapshot(), '08');
    store.select('51');
    assert.equal(store.getSnapshot(), '51');
  }
  const early = createProvinceStore(dependencies());
  early.select('20');
  await early.initialize();
  assert.equal(early.getSnapshot(), '20');
});

test('BOE projection covers 52 provinces and exposes formations without people, evidence or invented routes', () => {
  const result = generateProvincialContent(root, true);
  assert.equal(result.provinces.length, 52);
  assert.equal(
    result.provinces.reduce((n, p) => n + p.parties.length, 0),
    534,
  );
  for (const province of result.provinces)
    for (const party of province.parties) {
      assert.deepEqual(Object.keys(party).sort(), [
        'id',
        'label',
        'programmeId',
      ]);
      if (party.programmeId)
        assert.ok(
          ['pp', 'psoe', 'vox', 'podemos', 'frente-amplio'].includes(
            party.programmeId,
          ),
        );
    }
  const byProvince = (id) => result.provinces.find((p) => p.id === id).parties;
  assert.ok(byProvince('31').some((p) => p.label === 'PCTE'));
  assert.ok(byProvince('43').some((p) => p.label === 'JxCat'));
  assert.ok(byProvince('09').some((p) => p.label === 'PCTE'));
  assert.ok(!byProvince('30').some((p) => p.label === 'PACMA'));
  assert.ok(!byProvince('03').some((p) => p.label === 'FE de las JONS'));
});

test('provincial validation rejects unknown fields, people, duplicate lists and unsupported citations before projection', () => {
  const dataset = read(
    'content/political-info/approved/congress-2026-provinces.json',
  );
  const readSource = (id) => {
    const path = `content/political-info/sources/${id}/`;
    const metadata = read(path + 'metadata.json');
    return {
      metadata,
      original: readFileSync(
        new URL('../' + path + metadata.originalFile, import.meta.url),
      ),
      extractedBytes: readFileSync(
        new URL('../' + path + 'extracted.json', import.meta.url),
      ),
    };
  };
  for (const mutate of [
    (data) => {
      data.entities[0].unexpected = true;
    },
    (data) => {
      data.entities[0].kind = 'person';
    },
    (data) => {
      data.candidatures.push(data.candidatures[0]);
    },
    (data) => {
      data.candidatures[0].citations[0].quote = 'Unsupported assertion';
    },
    (data) => {
      data.candidatures[0].candidates = [{ personId: 'person-fixture' }];
    },
    (data) => {
      data.sources[0].sha256 = '0'.repeat(64);
    },
  ]) {
    const changed = structuredClone(dataset);
    mutate(changed);
    assert.throws(() =>
      projectProvincialContent(changed, provinces, [], readSource),
    );
  }
});
