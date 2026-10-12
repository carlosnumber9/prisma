import type { MetadataRoute } from 'next';
import { content } from '../lib/public-content';
import { sitemapEntries } from '../lib/seo';
import { origin } from '../lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries(content, origin);
}
