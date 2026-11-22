import './rendering-loader.mjs';
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { provinces } from '../src/lib/provinces.ts';
import { provincialPartyEntries } from '../src/lib/provincial-parties.ts';
const { HomeExperience } =
  await import('../src/components/home-experience.tsx');
const { ProvincialPartyDirectory } =
  await import('../src/components/provincial-party-directory.tsx');
const { ProvinceSelect } =
  await import('../src/components/province-select.tsx');
const read = (path) =>
  JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'));

test('home renders the complete default provincial list and links only existing programme pages', () => {
  const html = renderToStaticMarkup(
    createElement(HomeExperience, {
      locale: 'es',
      topics: [],
      parties: [{ label: 'PP', href: '/parties/pp' }],
    }),
  );
  assert.ok(html.includes('IUSTITIA EUROPA') || html.includes('IE'));
  assert.match(html, /href="\/es\/parties\/pp"/);
  assert.ok(!html.includes('/parties/formation-'));
  assert.equal((html.match(/<button[^>]*disabled=""/g) ?? []).length, 13);
  const selector = renderToStaticMarkup(
    createElement(ProvinceSelect, { locale: 'es' }),
  );
  assert.match(selector, /role="combobox"/);
  assert.match(selector, /value="Madrid"/);
  assert.match(selector, /aria-expanded="false"/);
});

test('both party views use every provincial formation with identical reviewed programme availability', () => {
  const data = read('content/generated-provincial/congress.json');
  const programmes = read('content/editorial/parties.json').map((party) => ({
    href: `/parties/${party.id}`,
  }));
  for (const province of data.provinces) {
    const entries = provincialPartyEntries(province.id, programmes);
    assert.deepEqual(
      entries.map((entry) => entry.id),
      province.parties.map((party) => party.id),
    );
    for (const entry of entries) {
      assert.equal(entry.disabled, !entry.href);
      if (entry.href)
        assert.ok(programmes.some((party) => party.href === entry.href));
    }
  }
  assert.equal(provincialPartyEntries('28', programmes).length, 14);
  assert.equal(provincialPartyEntries('52', programmes).length, 5);
});

test('party directory renders the full default provincial list in all locales without inventing destinations', () => {
  const parties = [{ label: 'PP', href: '/parties/pp' }];
  for (const locale of ['es', 'ca', 'gl', 'eu', 'oc', 'en']) {
    const html = renderToStaticMarkup(
      createElement(ProvincialPartyDirectory, { locale, parties }),
    );
    assert.equal((html.match(/<li\b/g) ?? []).length, 14);
    assert.equal((html.match(/<button[^>]*disabled=""/g) ?? []).length, 13);
    assert.match(html, new RegExp(`href="/${locale}/parties/pp"`));
    assert.ok(!html.includes('/parties/formation-'));
  }
});

test('area selection preserves provincial coverage and only enables reviewed area destinations', () => {
  const topics = read('content/editorial/topics.json');
  for (const topic of topics) {
    const programmes = [
      { href: `/parties/pp/${topic.id}` },
      { href: `/parties/psoe/${topic.id}`, disabled: true },
    ];
    for (const province of provinces) {
      const entries = provincialPartyEntries(province.id, programmes, topic.id);
      assert.deepEqual(
        entries.map((entry) => entry.id),
        provincialPartyEntries(province.id, []).map((entry) => entry.id),
      );
      for (const entry of entries) {
        if (!entry.disabled)
          assert.equal(entry.href, `/parties/pp/${topic.id}`);
        if (entry.id === 'psoe') assert.equal(entry.disabled, true);
      }
    }
    const generic = provincialPartyEntries(
      '28',
      [{ href: '/parties/pp' }],
      topic.id,
    );
    assert.ok(generic.every((entry) => entry.disabled));
  }
});

test('all area directories render provincial parties in every locale with only reviewed area links', () => {
  const topics = read('content/editorial/topics.json');
  for (const topic of topics) {
    for (const locale of ['es', 'ca', 'gl', 'eu', 'oc', 'en']) {
      const html = renderToStaticMarkup(
        createElement(ProvincialPartyDirectory, {
          locale,
          topicId: topic.id,
          parties: [
            { label: 'PP', href: `/parties/pp/${topic.id}` },
            {
              label: 'PSOE',
              href: `/parties/psoe/${topic.id}`,
              disabled: true,
            },
          ],
        }),
      );
      assert.equal((html.match(/<li\b/g) ?? []).length, 14);
      assert.equal((html.match(/<button[^>]*disabled=""/g) ?? []).length, 13);
      assert.ok(html.includes(`href="/${locale}/parties/pp/${topic.id}"`));
      assert.ok(!html.includes(`href="/${locale}/parties/psoe/${topic.id}"`));
      assert.ok(!html.includes(`href="/${locale}/parties/pp"`));
    }
  }
});

test('Frente Obrero uses its single national programme in every province including Ceuta', () => {
  const programme = { href: '/parties/frente-obrero' };
  const topic = 'housing';
  for (const province of provinces) {
    const entries = provincialPartyEntries(province.id, [programme]);
    const frenteObrero = entries.filter(
      (entry) => entry.label === 'Frente Obrero',
    );
    assert.equal(frenteObrero.length, 1, province.name);
    assert.equal(frenteObrero[0].href, programme.href, province.name);
    assert.equal(frenteObrero[0].disabled, false, province.name);
    const area = provincialPartyEntries(
      province.id,
      [{ href: `${programme.href}/${topic}` }],
      topic,
    );
    assert.equal(
      area.find((entry) => entry.id === frenteObrero[0].id).href,
      `${programme.href}/${topic}`,
      province.name,
    );
    const draft = provincialPartyEntries(
      province.id,
      [{ href: `${programme.href}/${topic}`, disabled: true }],
      topic,
    );
    assert.equal(
      draft.find((entry) => entry.id === frenteObrero[0].id).disabled,
      true,
      province.name,
    );
  }
});

test('province selection reads the same global reviewed synthesis availability for Frente Obrero', () => {
  const syntheses = read('content/generated/syntheses.json').syntheses.filter(
    (synthesis) => synthesis.partyId === 'frente-obrero',
  );
  assert.equal(syntheses.length, 8);
  for (const synthesis of syntheses) {
    for (const province of provinces) {
      const entries = provincialPartyEntries(
        province.id,
        [{ href: synthesis.path, disabled: synthesis.points.length === 0 }],
        synthesis.topicId,
      );
      const entry = entries.find((party) => party.label === 'Frente Obrero');
      assert.equal(
        entry.disabled,
        synthesis.points.length === 0,
        `${province.name}/${synthesis.topicId}`,
      );
      assert.equal(entry.href, synthesis.path);
    }
  }
});
