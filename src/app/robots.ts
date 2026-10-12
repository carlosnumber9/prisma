import type { MetadataRoute } from 'next';
import { origin } from '../lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    ...(origin ? { sitemap: `${origin}/sitemap.xml` } : {}),
  };
}
