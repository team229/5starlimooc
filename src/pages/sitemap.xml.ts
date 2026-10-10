/**
 * XML sitemap at /sitemap.xml.
 *
 * The URL list is the same union the HTML sitemap uses: every hand-built route
 * plus every page captured in the content collection, de-duplicated. Internal
 * pages that are deliberately kept out of the index (thank-you, error pages)
 * are excluded.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { HAND_BUILT } from '../data/routes';
import { site } from '../data/site';

/** Pages that must not appear in the sitemap. */
const EXCLUDE = new Set(['/404', '/404-2/', '/thankyou/']);

export const GET: APIRoute = async () => {
  const scraped = (await getCollection('pages'))
    .map((p) => p.data.path)
    .filter((p) => p && p !== '/' && !EXCLUDE.has(p));

  const paths = Array.from(new Set([...HAND_BUILT, ...scraped]))
    .filter((p) => !EXCLUDE.has(p))
    // The build uses trailingSlash: 'always', so every canonical URL ends in '/'.
    .map((p) => (p.endsWith('/') ? p : `${p}/`))
    .sort((a, b) => a.localeCompare(b));

  const urls = paths.map((p) => `  <url><loc>${site.url}${p}</loc></url>`).join('\n');

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
