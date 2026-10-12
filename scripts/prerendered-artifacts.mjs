import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Read App Router artifacts from the layout selected by the completed build.
 * Adapter builds in the pinned Next 16.4 use source-scoped response cache keys.
 * @param {string} distDir
 * @param {{ routes: Record<string, { srcRoute?: string | null }> }} prerender
 */
export function createPrerenderedArtifactReader(distDir, prerender) {
  const readJson = (path) =>
    JSON.parse(readFileSync(join(distDir, path), 'utf8'));
  const { config } = readJson('required-server-files.json');
  const scoped = Boolean(config.adapterPath) && config.output !== 'export';
  const appPaths = scoped ? readJson('app-path-routes-manifest.json') : {};

  return (pathname, extension = '.html') => {
    assert.ok(
      Object.hasOwn(prerender.routes, pathname),
      `${pathname}: must be prerendered`,
    );
    const normalized =
      pathname === '/'
        ? '/index'
        : /^\/index(\/|$)/.test(pathname)
          ? `/index${pathname}`
          : pathname;
    let artifact;
    if (scoped) {
      const source = prerender.routes[pathname].srcRoute ?? pathname;
      const suffix = extension === '.body' ? '/route' : '/page';
      const sources = Object.entries(appPaths).filter(
        ([page, route]) => route === source && page.endsWith(suffix),
      );
      assert.equal(sources.length, 1, `${pathname}: one App Router source`);
      const hash = createHash('sha256').update(sources[0][0]).digest('hex');
      const kind = extension === '.body' ? 'APP_ROUTE' : 'APP_PAGE';
      artifact = join('route-cache', kind, hash, `$${normalized}${extension}`);
    } else {
      artifact = join('app', `${normalized.slice(1)}${extension}`);
    }
    return readFileSync(join(distDir, 'server', artifact), 'utf8');
  };
}
