import './rendering-loader.mjs';
import assert from 'node:assert/strict';
import test from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  dictionaries,
  languageSelection,
  localizedPath,
  negotiateLocale,
  locales,
  LANGUAGE_COOKIE,
} from '../src/lib/i18n.ts';
import { formatDate } from '../src/lib/presentation.ts';
import { pageSeo } from '../src/lib/seo.ts';
const { LanguageSelect } =
  await import('../src/components/language-select.tsx');

for (const [header, cookie, expected] of [
  ['fr-FR, en-GB;q=0.8', undefined, 'en'],
  ['en;q=0.5, eu-ES;q=0.9', undefined, 'eu'],
  ['ca-ES-valencia,es;q=0.9', undefined, 'ca'],
  ['oc-aran,es', undefined, 'oc'],
  ['GL-es, en;q=0.5', undefined, 'gl'],
  ['en;q=0, eu;q=0.2', undefined, 'eu'],
  ['en;q=garbage, gl;q=0.5', undefined, 'gl'],
  ['en;q=2, ca;q=-1, eu;q=0.1', undefined, 'eu'],
  ['fr-FR,de', undefined, 'es'],
  [null, undefined, 'es'],
  ['*', undefined, 'es'],
  ['fr-EN, ca;q=0.7', undefined, 'ca'],
  ['en', 'eu', 'eu'],
  ['ca', 'invalid', 'ca'],
])
  test(`negotiates ${JSON.stringify(header)} with cookie ${cookie}`, () =>
    assert.equal(negotiateLocale(header, cookie), expected));

test('dictionaries have complete nonempty keys and matching interpolation fields', () => {
  const keys = Object.keys(dictionaries.es).sort();
  for (const locale of locales) {
    assert.deepEqual(Object.keys(dictionaries[locale]).sort(), keys);
    for (const key of keys) {
      assert.ok(dictionaries[locale][key].trim(), `${locale}.${key}`);
      const placeholders = (value) =>
        [...value.matchAll(/\{\w+\}/g)].map(([match]) => match).sort();
      assert.deepEqual(
        placeholders(dictionaries[locale][key]),
        placeholders(dictionaries.es[key]),
      );
    }
    assert.equal(dictionaries[locale].months.split('|').length, 12);
  }
});

test('language changes retain query, point anchor and stable slugs without nesting prefixes', () => {
  const selection = languageSelection(
    'https://example.org/es/parties/fixture/housing?view=sources#stable-point',
    'eu',
  );
  assert.equal(
    selection.href,
    'https://example.org/eu/parties/fixture/housing?view=sources#stable-point',
  );
  assert.match(
    selection.cookie,
    /^prisma-locale=eu; Path=\/; Max-Age=31536000; SameSite=Lax; Secure$/,
  );
  assert.equal(
    languageSelection('http://localhost:3000/?q=1#point', 'ca').href,
    'http://localhost:3000/ca?q=1#point',
  );
  assert.ok(
    !languageSelection('http://localhost:3000/es', 'en').cookie.includes(
      'Secure',
    ),
  );
  assert.equal(localizedPath('/', 'oc'), '/oc');
});

test('native select has an accessible label, six autonyms and the active option', (t) => {
  const element = LanguageSelect({ locale: 'gl', label: 'Idioma' });
  const html = renderToStaticMarkup(element);
  assert.match(html, /<label[^>]*><span>Idioma<\/span><select/);
  assert.equal((html.match(/<option /g) ?? []).length, 6);
  assert.match(html, /value="gl"[^>]*selected=""/);
  assert.ok(html.includes('Català / Valencià'));
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const previousDocument = Object.getOwnPropertyDescriptor(
    globalThis,
    'document',
  );
  const assignments = [];
  const document = { cookie: '' };
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      location: {
        href: 'https://example.org/gl/topics/housing?x=1#point',
        assign: (url) => assignments.push(url),
      },
    },
  });
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: document,
  });
  t.after(() => {
    for (const [name, descriptor] of [
      ['window', previousWindow],
      ['document', previousDocument],
    ]) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  });
  const select = element.props.children[1];
  select.props.onChange({ currentTarget: { value: 'en' } });
  assert.match(document.cookie, /^prisma-locale=en;/);
  assert.deepEqual(assignments, [
    'https://example.org/en/topics/housing?x=1#point',
  ]);
  select.props.onChange({ currentTarget: { value: 'invalid' } });
  assert.equal(assignments.length, 1);
});

test('dates use translated month names and UTC even for Aranese without ICU support', () => {
  const expected = {
    es: '12 de octubre de 2026',
    ca: '12 d’octubre de 2026',
    gl: '12 de outubro de 2026',
    eu: '2026ko urriaren 12a',
    oc: '12 de octobre de 2026',
    en: 'October 12, 2026',
  };
  for (const locale of locales)
    assert.equal(formatDate('2026-10-12T23:30:00Z', locale), expected[locale]);
});

test('localized SEO has a self canonical, six reciprocal alternatives and a neutral entry', () => {
  for (const locale of locales) {
    const metadata = pageSeo(
      'Title',
      'Description',
      '/topics/housing',
      'https://example.org',
      true,
      locale,
    );
    assert.equal(
      metadata.alternates.canonical,
      `https://example.org/${locale}/topics/housing`,
    );
    assert.equal(Object.keys(metadata.alternates.languages).length, 7);
    assert.equal(
      metadata.alternates.languages['x-default'],
      'https://example.org/topics/housing',
    );
    for (const language of locales)
      assert.equal(
        metadata.alternates.languages[language],
        `https://example.org/${language}/topics/housing`,
      );
  }
  assert.equal(LANGUAGE_COOKIE, 'prisma-locale');
});
