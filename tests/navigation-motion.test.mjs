import assert from 'node:assert/strict';
import test from 'node:test';
import { shellRoutes } from '../src/lib/shell-routes.ts';
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
