import type { ContentRepository, Synthesis } from './content.ts';

export function siteOrigin(value?: string) {
  if (!value?.trim()) return undefined;
  const url = new URL(value.trim());
  if (
    !['https:', 'http:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash ||
    ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
  )
    throw new Error(
      'SITE_URL must be a public HTTP(S) origin without credentials, path, query or fragment',
    );
  return url.origin;
}

export function isIndexable(synthesis: Synthesis) {
  return synthesis.reviewStatus !== 'pending';
}

export function pageSeo(
  title: string,
  description: string,
  path: string,
  origin?: string,
  index = true,
) {
  return {
    title,
    description,
    robots: { index, follow: true },
    ...(origin
      ? { alternates: { canonical: new URL(path, origin).href } }
      : {}),
  };
}

export function sitemapEntries(repository: ContentRepository, origin?: string) {
  if (!origin) return [];
  const paths = [
    '/',
    '/parties',
    '/topics',
    ...repository.parties.map((party) => `/parties/${party.id}`),
    ...repository.topics.map((topic) => topic.path),
  ];
  return [
    ...paths.map((path) => ({ url: new URL(path, origin).href })),
    ...repository.syntheses.filter(isIndexable).map((synthesis) => ({
      url: new URL(synthesis.path, origin).href,
      ...(synthesis.reviewedAt ? { lastModified: synthesis.reviewedAt } : {}),
    })),
  ];
}
