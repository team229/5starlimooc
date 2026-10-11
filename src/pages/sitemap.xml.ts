/**
 * XML sitemap at /sitemap.xml.
 *
 * The URL list is the same union the HTML sitemap uses: every hand-built route
 * plus every page captured in the content collection, de-duplicated. Internal
 * pages that are deliberately kept out of the index (thank-you, error pages,
 * legacy redirects and leftover theme demos) are excluded.
 *
 * Each URL carries a <lastmod> so Google can prioritise recrawls: the article's
 * own `updated`/`date` when we have one, otherwise the site-wide refresh date.
 * It is intentionally NOT the build time — a lastmod that changes on every
 * deploy is ignored by search engines.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { HAND_BUILT, EXCLUDE_PATHS } from '../data/routes';
import { site } from '../data/site';

/** Pages that must not appear in the sitemap. */
const EXCLUDE = new Set(EXCLUDE_PATHS);

/** Trim an entry date (`YYYY-MM-DD` or ISO datetime) to a plain date. */
const asDate = (value: string): string | null =>
  /^\d{4}-\d{2}-\d{2}/.test(value) ? value.slice(0, 10) : null;

export const GET: APIRoute = async () => {
  const pages = await getCollection('pages');

  // path -> best-known modification date
  const lastmod = new Map<string, string>();
  for (const page of pages) {
    const path = page.data.path;
    const date = asDate(page.data.updated) ?? asDate(page.data.date);
    if (path && date) lastmod.set(path, date);
  }

  const urlSet = new Set<string>(HAND_BUILT);
  for (const page of pages) if (page.data.path) urlSet.add(page.data.path);

  const urls = [...urlSet]
    .filter((path) => path && !EXCLUDE.has(path))
    .map((path) => {
      const url = `${site.url}${path}`;
      const mod = lastmod.get(path) ?? site.contentUpdated;
      return `  <url>\n    <loc>${url}</loc>\n    <lastmod>${mod}</lastmod>\n  </url>`;
    });

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
