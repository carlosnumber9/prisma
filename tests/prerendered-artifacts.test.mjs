import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import routeCache from 'next/dist/server/lib/route-cache-key.js';
import pagePath from 'next/dist/shared/lib/page-path/normalize-page-path.js';
import { createPrerenderedArtifactReader } from '../scripts/prerendered-artifacts.mjs';

const cases = [
  ['/', '/page', '/', '.html'],
  ['/parties', '/parties/page', '/parties', '.html'],
  [
    '/parties/fixture/housing',
    '/parties/[party]/[topic]/page',
    '/parties/[party]/[topic]',
    '.html',
  ],
  ['/topics/index', '/topics/[topic]/page', '/topics/[topic]', '.html'],
  ['/index', '/index/page', '/index', '.html'],
  ['/_not-found', '/_not-found/page', '/_not-found', '.html'],
  ['/sitemap.xml', '/sitemap.xml/route', '/sitemap.xml', '.body'],
  ['/grouped', '/(group)/grouped/page', '/grouped', '.html'],
];

function fixture(t, scoped) {
  const distDir = mkdtempSync(join(tmpdir(), 'prisma-artifacts-'));
  t.after(() => rmSync(distDir, { recursive: true, force: true }));
  const write = (path, value) => {
    const destination = join(distDir, path);
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, value);
  };
  write(
    'required-server-files.json',
    JSON.stringify({ config: { adapterPath: scoped ? '/adapter.mjs' : null } }),
  );
  write(
    'app-path-routes-manifest.json',
    JSON.stringify(
      Object.fromEntries(cases.map(([, page, route]) => [page, route])),
    ),
  );
  const prerender = {
    routes: Object.fromEntries(
      cases.map(([path, , source]) => [path, { srcRoute: source }]),
    ),
  };
  const artifactPath = (path, page, extension) => {
    // Use Next's implementation as an independent oracle for adapter fixtures.
    const key = routeCache.getRouteCacheKey(path, {
      kind: extension === '.body' ? 'APP_ROUTE' : 'APP_PAGE',
      sourceRoute: page,
    });
    return scoped
      ? join('server', `${key}${extension}`)
      : join('server/app', `${pagePath.normalizePagePath(path)}${extension}`);
  };
  for (const [path, page, , extension] of cases)
    write(artifactPath(path, page, extension), `Artifact for ${path}`);
  return { distDir, prerender, write, artifactPath };
}

for (const scoped of [false, true]) {
  test(`reads pages, dynamic instances, sitemap and 404 from ${scoped ? 'adapter' : 'local'} output`, (t) => {
    const { distDir, prerender } = fixture(t, scoped);
    const readArtifact = createPrerenderedArtifactReader(distDir, prerender);
    for (const [path, , , extension] of cases)
      assert.equal(readArtifact(path, extension), `Artifact for ${path}`);
    assert.throws(() => readArtifact('/unknown'), /must be prerendered/);
  });
}

test('missing adapter output fails even if stale local HTML exists', (t) => {
  const { distDir, prerender, write, artifactPath } = fixture(t, true);
  rmSync(join(distDir, artifactPath('/', '/page', '.html')));
  write('server/app/index.html', 'Stale HTML');
  const readArtifact = createPrerenderedArtifactReader(distDir, prerender);
  assert.throws(() => readArtifact('/'), { code: 'ENOENT' });
});

test('adapter output fails when its source route is absent from the manifest', (t) => {
  const { distDir, prerender, write } = fixture(t, true);
  write('app-path-routes-manifest.json', '{}');
  const readArtifact = createPrerenderedArtifactReader(distDir, prerender);
  assert.throws(() => readArtifact('/'), /one App Router source/);
});
