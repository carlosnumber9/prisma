import { localizedFixture } from './localized-fixture.mjs';
import './rendering-loader.mjs';
import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  createContentRepository,
  readPublicContent,
} from '../src/lib/content.ts';
import { dictionaries, locales } from '../src/lib/i18n.ts';
import { reviewLabel } from '../src/lib/presentation.ts';
const { SynthesisReader } = await import('../src/components/synthesis.tsx');
const { Directory } = await import('../src/components/directory.tsx');
const { HeaderNavigation } =
  await import('../src/components/header-navigation.tsx');

test('navbar marks only its selected section and omits the outline on home in every locale', () => {
  for (const locale of locales) {
    for (const section of [undefined, 'parties', 'topics']) {
      const html = renderToStaticMarkup(
        createElement(HeaderNavigation, { locale, section }),
      );
      const anchors = [...html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)];
      assert.equal(anchors.length, 2);
      for (const [index, item] of ['parties', 'topics'].entries()) {
        const anchor = anchors[index][0];
        assert.ok(anchor.includes(`href="/${locale}/${item}"`));
        assert.ok(anchor.includes(dictionaries[locale][item]));
        assert.equal(anchor.includes('aria-current="true"'), section === item);
      }
      assert.equal(
        (html.match(/class="indicator" aria-hidden="true"/g) ?? []).length,
        section ? 1 : 0,
      );
      assert.ok(html.includes(dictionaries[locale].language));
    }
  }
});

test('directory buttons retain localized destinations, review states and empty-catalogue messages in both layouts', () => {
  const statuses = ['pending', 'partial', 'complete'];
  for (const locale of locales) {
    for (const columns of [false, true]) {
      const html = renderToStaticMarkup(
        createElement(Directory, {
          locale,
          columns,
          entries: statuses.map((status) => ({
            label: `Synthetic ${status}`,
            href: `/parties/fixture/${status}`,
            status,
          })),
        }),
      );
      const anchors = [...html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)];
      assert.equal(anchors.length, statuses.length);
      for (const [index, status] of statuses.entries()) {
        const anchor = anchors[index][0];
        assert.ok(
          anchor.includes(`href="/${locale}/parties/fixture/${status}"`),
        );
        assert.ok(anchor.includes(`Synthetic ${status}`));
        assert.ok(anchor.includes(reviewLabel(status, locale)));
      }
      const empty = renderToStaticMarkup(
        createElement(Directory, { locale, columns, entries: [] }),
      );
      assert.ok(empty.includes(dictionaries[locale].emptyCatalogue));
      assert.ok(!empty.includes('<a'));
    }
  }
});

function fixture(status, empty = false) {
  const reviewed = status !== 'pending';
  const envelope = (key, items) => ({
    schemaVersion: 3,
    electionDate: '2026-11-29',
    [key]: items,
  });
  const source = {
    id: 'fixture-source',
    partyId: 'fixture-party',
    electionDate: '2026-11-29',
    title: 'Synthetic official document',
    url: 'https://example.org/program.pdf',
    format: 'pdf',
    capturedAt: '2026-10-12T10:00:00Z',
    sha256: '0'.repeat(64),
    pageCount: 3,
  };
  const synthesis = {
    id: 'fixture-party--housing',
    partyId: 'fixture-party',
    topicId: 'housing',
    path: '/parties/fixture-party/housing',
    reviewStatus: status,
    revision: reviewed ? 2 : null,
    reviewedAt: reviewed ? '2026-10-12T10:00:00Z' : null,
    sourceIds: reviewed ? [source.id] : [],
    points:
      reviewed && !empty
        ? [
            {
              id: 'stable-point',
              title: localizedFixture('Synthetic approved point'),
              text: localizedFixture(
                'Synthetic summary subject to a condition.',
              ),
              citations: [
                {
                  sourceId: source.id,
                  segmentId: 'page-3',
                  page: 3,
                  printedPage: 'i',
                  quote: 'Synthetic source <text> with a condition.',
                },
              ],
            },
          ]
        : [],
  };
  const repository = createContentRepository(
    readPublicContent({
      parties: envelope('parties', [
        {
          id: 'fixture-party',
          name: 'Synthetic formation',
          officialWebsite: null,
        },
      ]),
      topics: envelope('topics', [
        {
          id: 'housing',
          label: localizedFixture('Vivienda'),
          path: '/topics/housing',
        },
      ]),
      sources: envelope('sources', reviewed ? [source] : []),
      syntheses: envelope('syntheses', [synthesis]),
    }),
  );
  return { repository, synthesis };
}

test('pending markup states unavailability without a review, points or source section', () => {
  const html = renderToStaticMarkup(
    createElement(SynthesisReader, fixture('pending')),
  );
  assert.ok(html.includes('Resumen todavía no disponible'));
  assert.ok(html.includes('no significa que el partido no tenga propuestas'));
  assert.ok(!html.includes('Fuentes consultadas'));
  assert.ok(!html.includes('Revisado el'));
  assert.ok(!html.includes('<article'));
});

test('reviewed markup retains anchors, conditions, escaped quotes and physical source references', () => {
  for (const status of ['partial', 'complete']) {
    const html = renderToStaticMarkup(
      createElement(SynthesisReader, fixture(status)),
    );
    assert.ok(html.includes('id="stable-point"'));
    assert.ok(html.includes('href="#stable-point"'));
    assert.ok(html.includes('Synthetic summary subject to a condition.'));
    assert.ok(html.includes('Synthetic source &lt;text&gt; with a condition.'));
    assert.ok(html.includes('href="https://example.org/program.pdf#page=3"'));
    assert.ok(html.includes('Página 3 (numeración impresa: i)'));
    assert.ok(html.includes('Revisión 2'));
    assert.ok(html.includes('Fuentes consultadas'));
    assert.equal(
      html.includes('La revisión del resto del área sigue pendiente'),
      status === 'partial',
    );
  }
});

test('a complete empty review renders its evidence rather than an unavailable message', () => {
  const html = renderToStaticMarkup(
    createElement(SynthesisReader, fixture('complete', true)),
  );
  assert.ok(
    html.includes('Sin propuestas identificadas en el corpus revisado'),
  );
  assert.ok(html.includes('Synthetic official document'));
  assert.ok(html.includes('Fuentes consultadas'));
  assert.ok(!html.includes('Resumen todavía no disponible'));
  assert.ok(!html.includes('<article'));
});

test('each language selects its own approved fields and retains original evidence', async () => {
  const { locales } = await import('../src/lib/locales.mjs');
  const { dictionaries } = await import('../src/lib/i18n.ts');
  const { synthesis, repository } = fixture('partial');
  for (const locale of locales) {
    const html = renderToStaticMarkup(
      createElement(SynthesisReader, { synthesis, repository, locale }),
    );
    assert.ok(html.includes(synthesis.points[0].text[locale]));
    assert.ok(html.includes(dictionaries[locale].sources));
    assert.ok(html.includes(dictionaries[locale].permalink));
    assert.ok(html.includes('<blockquote lang="">'));
    assert.ok(html.includes('Synthetic source &lt;text&gt; with a condition.'));
    assert.ok(html.includes('id="stable-point"'));
    if (locale !== 'es') assert.ok(!html.includes('aria-label="Enlace a'));
  }
});
