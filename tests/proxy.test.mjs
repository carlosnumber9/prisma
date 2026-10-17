import './rendering-loader.mjs';
import assert from 'node:assert/strict';
import test from 'node:test';
import { NextRequest } from 'next/server.js';
import {
  unstable_doesMiddlewareMatch,
  getRedirectUrl,
} from 'next/experimental/testing/server.js';
const { proxy, config } = await import('../src/proxy.ts');

function request(path, language, cookie) {
  return new NextRequest(`https://example.org${path}`, {
    headers: {
      ...(language ? { 'accept-language': language } : {}),
      ...(cookie ? { cookie: `prisma-locale=${cookie}` } : {}),
    },
  });
}

test('explicit locale URLs pass through without changing the saved preference', () => {
  for (const locale of ['es', 'ca', 'gl', 'eu', 'oc', 'en']) {
    const response = proxy(request(`/${locale}/topics/housing`, 'en', 'es'));
    assert.equal(response.headers.get('x-middleware-next'), '1');
    assert.equal(response.headers.get('location'), null);
    assert.equal(response.headers.get('set-cookie'), null);
  }
});

test('neutral entry redirects before rendering, retains query and cannot be shared-cached', () => {
  for (const [path, language, cookie, expected] of [
    ['/', 'fr, en;q=0.8', undefined, '/en'],
    [
      '/parties/fixture/housing?view=sources',
      'en',
      'eu',
      '/eu/parties/fixture/housing?view=sources',
    ],
    ['/topics/housing', 'ca-ES-valencia', 'invalid', '/ca/topics/housing'],
    ['/', undefined, undefined, '/es'],
  ]) {
    const response = proxy(request(path, language, cookie));
    assert.equal(response.status, 307);
    assert.equal(getRedirectUrl(response), `https://example.org${expected}`);
    assert.equal(response.headers.get('cache-control'), 'private, no-store');
    assert.equal(response.headers.get('vary'), 'Accept-Language, Cookie');
    assert.equal(response.headers.get('set-cookie'), null);
  }
});

test('proxy matcher bypasses framework resources and public assets', () => {
  for (const path of [
    '/_next/static/app.js',
    '/_next/image?url=x',
    '/robots.txt',
    '/sitemap.xml',
    '/prism-poster.png',
    '/favicon.ico',
    '/api/health',
  ]) {
    assert.equal(
      unstable_doesMiddlewareMatch({
        config,
        url: `https://example.org${path}`,
      }),
      false,
      path,
    );
  }
  for (const path of ['/', '/parties/fixture/housing', '/oc/topics/housing'])
    assert.equal(
      unstable_doesMiddlewareMatch({
        config,
        url: `https://example.org${path}`,
      }),
      true,
      path,
    );
});
