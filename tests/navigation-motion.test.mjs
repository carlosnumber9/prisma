import assert from 'node:assert/strict';
import test from 'node:test';
import { shellRoutes, commonCrumbCount } from '../src/lib/shell-routes.ts';
import { locales } from '../src/lib/i18n.ts';
import { localizedFixture } from './localized-fixture.mjs';

test('persistent shell routes share stable breadcrumb identities without exposing programme records', () => {
  const party = {
    id: 'fixture',
    name: 'Synthetic party',
    officialColor: '#112233',
    officialWebsite: null,
  };
  const topic = {
    id: 'housing',
    path: '/topics/housing',
    label: localizedFixture('Housing'),
  };
  for (const locale of locales) {
    const routes = shellRoutes(locale, [party], [topic]);
    const parent = routes[`/${locale}/parties/fixture`];
    const child = routes[`/${locale}/parties/fixture/housing`];
    assert.equal(child.accent, '#112233');
    assert.equal(child.section, 'parties');
    assert.deepEqual(
      parent.crumbs.map((crumb) => crumb.id),
      child.crumbs.slice(0, -1).map((crumb) => crumb.id),
    );
    assert.equal(child.crumbs.at(-2).href, `/${locale}/parties/fixture`);
    assert.equal(child.crumbs.at(-1).href, undefined);
    assert.equal(routes[`/${locale}/topics/housing`].section, 'topics');
    assert.deepEqual(routes[`/${locale}`].crumbs, []);
    assert.ok(!JSON.stringify(routes).includes('officialWebsite'));
  }
});

test('breadcrumb transitions use the route prefix for forward, backward and sibling navigation', () => {
  const home = { id: '/es', label: 'Home' };
  const parties = { id: '/es/parties', label: 'Parties' };
  const party = { id: '/es/parties/fixture', label: 'Same label' };
  const other = { id: '/es/parties/other', label: 'Same label' };
  const area = { id: '/es/parties/fixture/housing', label: 'Housing' };
  assert.equal(commonCrumbCount([home, parties], [home, parties, party]), 2);
  assert.equal(
    commonCrumbCount([home, parties, party, area], [home, parties]),
    2,
  );
  assert.equal(
    commonCrumbCount([home, parties, party], [home, parties, other]),
    2,
  );
  assert.equal(commonCrumbCount([], [home, parties]), 0);
  assert.equal(commonCrumbCount([home, parties], []), 0);
});

test('route fades ignore fragments, external links, downloads and modified clicks', async (t) => {
  const { isRouteLink } = await import('../src/lib/route-fades.ts');
  const original = Object.getOwnPropertyDescriptor(globalThis, 'Element');
  class Anchor {
    href = 'https://example.org/es/topics';
    target = '';
    rel = '';
    download = false;
    closest() {
      return this;
    }
    hasAttribute(name) {
      return name === 'download' && this.download;
    }
  }
  Object.defineProperty(globalThis, 'Element', {
    configurable: true,
    value: Anchor,
  });
  t.after(() =>
    original
      ? Object.defineProperty(globalThis, 'Element', original)
      : delete globalThis.Element,
  );
  const anchor = new Anchor();
  const current = new URL('https://example.org/es/parties');
  const event = { button: 0, target: anchor };
  assert.equal(isRouteLink(event, current), true);
  for (const modifier of [
    'metaKey',
    'ctrlKey',
    'shiftKey',
    'altKey',
    'defaultPrevented',
  ])
    assert.equal(isRouteLink({ ...event, [modifier]: true }, current), false);
  for (const href of [
    'https://example.org/es/parties#point',
    'https://example.org/es/parties?view=sources',
    'https://other.example/es/topics',
    'mailto:fixture@example.org',
  ]) {
    anchor.href = href;
    assert.equal(isRouteLink(event, current), false);
  }
  anchor.href = 'https://example.org/es/topics';
  anchor.target = '_blank';
  assert.equal(isRouteLink(event, current), false);
  anchor.target = '';
  anchor.download = true;
  assert.equal(isRouteLink(event, current), false);
  anchor.download = false;
  anchor.rel = 'external';
  assert.equal(isRouteLink(event, current), false);
});
