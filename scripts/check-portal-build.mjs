import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  createContentRepository,
  readPublicContent,
} from '../src/lib/content.ts';
import { UNAVAILABLE_LABEL } from '../src/lib/presentation.ts';
import { partyAccent } from '../src/lib/themes.ts';
import { siteOrigin, sitemapEntries } from '../src/lib/seo.ts';
import { createPrerenderedArtifactReader } from './prerendered-artifacts.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (path) => JSON.parse(readFileSync(join(root, path), 'utf8'));
const repository = createContentRepository(
  readPublicContent(
    Object.fromEntries(
      ['parties', 'topics', 'sources', 'syntheses'].map((key) => [
        key,
        readJson(`content/generated/${key}.json`),
      ]),
    ),
  ),
);
const prerender = readJson('.next/prerender-manifest.json');
const readArtifact = createPrerenderedArtifactReader(
  join(root, '.next'),
  prerender,
);
const paths = [
  '/',
  '/parties',
  '/topics',
  ...repository.parties.map((party) => `/parties/${party.id}`),
  ...repository.topics.map((topic) => topic.path),
  ...repository.syntheses.map((synthesis) => synthesis.path),
];
const htmlByPath = new Map();
const origin = siteOrigin(process.env.SITE_URL);
const validPaths = new Set(paths);
for (const path of paths) {
  const html = readArtifact(path);
  htmlByPath.set(path, html);
  assert.match(html, /<html[^>]*lang="es"/);
  assert.match(html, /href="#main-content"/);
  assert.equal(
    (html.match(/<h1(?:\s|>)/g) ?? []).length,
    1,
    `${path}: one primary heading`,
  );
  assert.ok(
    !html.includes('http://localhost'),
    `${path}: no development canonical URLs`,
  );
  for (const [, href] of html.matchAll(/href="(\/[^"#]*)(?:#[^"]*)?"/g)) {
    if (!href.startsWith('/_next/'))
      assert.ok(validPaths.has(href), `${path}: broken internal link ${href}`);
  }
  if (origin)
    assert.ok(
      html.includes(`rel="canonical" href="${new URL(path, origin).href}"`),
      `${path}: canonical origin`,
    );
  else
    assert.ok(
      !html.includes('rel="canonical"'),
      `${path}: domain is not configured`,
    );
}
for (const synthesis of repository.syntheses) {
  const html = htmlByPath.get(synthesis.path);
  if (synthesis.reviewStatus === 'pending') {
    assert.ok(
      html.includes(UNAVAILABLE_LABEL),
      `${synthesis.path}: unavailable summary`,
    );
    assert.match(html, /<meta name="robots" content="noindex, follow"/);
  }
  assert.ok(html.includes(`--accent:${partyAccent(synthesis.partyId)}`));
  for (const point of synthesis.points)
    assert.ok(html.includes(`id="${point.id}"`));
}
for (const party of repository.parties) {
  const html = htmlByPath.get(`/parties/${party.id}`);
  if (party.officialWebsite === null)
    assert.ok(!html.includes('Web oficial de'));
}
const sitemap = readArtifact('/sitemap.xml', '.body');
assert.equal(
  (sitemap.match(/<loc>/g) ?? []).length,
  sitemapEntries(repository, origin).length,
);
for (const entry of sitemapEntries(repository, origin))
  assert.ok(sitemap.includes(`<loc>${entry.url}</loc>`));
const notFound = readArtifact('/_not-found');
assert.ok(notFound.includes('Página no encontrada'));
// dynamicParams=false must also be reflected in the compiled route fallback.
for (const route of Object.values(prerender.dynamicRoutes))
  assert.equal(
    route.fallback,
    false,
    'Unknown dynamic IDs must not render on demand',
  );
process.stdout.write(
  `Verified ${paths.length} prerendered portal pages, pending SEO, themes, sitemap and 404.\n`,
);
