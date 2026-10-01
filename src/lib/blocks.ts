/** Helpers for the scraped content blocks (see scripts/scrape.py). */

export interface ContentBlock {
  type: string;
  text?: string;
  html?: string;
  items?: string[];
  src?: string;
  alt?: string;
  caption?: string;
  href?: string;
  rows?: string[][];
}

export interface TocEntry {
  id: string;
  label: string;
  level: 2 | 3;
}

/** Strip tags and normalise whitespace for use in labels/ids. */
export function plainText(value = ''): string {
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8217;|&rsquo;/g, '’')
    .replace(/&#8211;|&ndash;/g, '–')
    .replace(/\s+/g, ' ')
    .trim();
}

/** URL-safe id derived from heading text. */
export function slugify(value = ''): string {
  return (
    plainText(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'section'
  );
}

/** Heading outline for the sticky "on this page" rail. */
export function buildToc(blocks: ContentBlock[] = []): TocEntry[] {
  const seen = new Map<string, number>();
  const out: TocEntry[] = [];

  for (const block of blocks) {
    if (block.type !== 'h2' && block.type !== 'h3') continue;
    const label = plainText(block.text);
    if (!label) continue;

    const base = slugify(label);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);

    out.push({ id: count ? `${base}-${count + 1}` : base, label, level: block.type === 'h2' ? 2 : 3 });
  }

  return out;
}

/** Matches a toc entry back to its block so the heading can carry the same id. */
export function headingId(block: ContentBlock, index: number, blocks: ContentBlock[]): string {
  return buildToc(blocks.slice(0, index + 1)).at(-1)?.id ?? slugify(block.text);
}

/**
 * Review-widget and brand assets that the scraper picked up from the original
 * pages. They are site chrome, not editorial content, so they are dropped
 * before rendering — otherwise the Google "G" icon and star SVGs blow up to
 * full column width and wreck the layout.
 */
const CHROME_IMAGE = [
  /^\/images\/ext\/trustindex\//i, // trustindex / Google review widget assets
  /^\/images\/ext\/.*\/(icon|logo|f\.svg|star)/i,
  /trustindex/i,
  /googleusercontent\.com\/a\//i, // reviewer avatars
  /5STAR-B\.png$/i, // the site logo, already in the header
  /astra\.(svg|ttf|woff)$/i, // theme font files
];

export function isChromeImage(src = ''): boolean {
  return CHROME_IMAGE.some((re) => re.test(src));
}

/**
 * Text the Trustindex widget injected into the original DOM. The site's own
 * `Reviews.astro` already renders the real reviews, so these leftovers would
 * just repeat the widget as loose paragraphs.
 */
const CHROME_TEXT = [
  /^Trustindex verifies that the original source of the review is Google\.?$/i,
  /^Posted on\s+\w+$/i,
  /^Based on [\d,.]+ reviews?(?: on [\w ]+)?$/i,
  /^(EXCELLENT|GOOD|AVERAGE|POOR)\b$/i,
  /^[\d.]+$/, // the widget's bare rating number
  /^R-CONTENT$/i,
  /^L-CONTENT$/i,
  /^\d+ days? ago$/i,
  /^(Read more|Show more|Load more)$/i,
];

function isChromeParagraph(text = ''): boolean {
  const t = plainText(text);
  if (!t || t.length > 120) return false;
  if (CHROME_TEXT.some((re) => re.test(t))) return true;
  // review text the widget tagged inline, e.g. "... again. R-CONTENT"
  return /R-CONTENT\s*$/.test(t) || /L-CONTENT\s*$/.test(t);
}

/** The widget tags its own text regions with these sentinels. */
const CONTENT_MARKER = /\s*(?:R|L|C)-CONTENT\s*/gi;

/**
 * Strips widget chrome (review-widget icons and boilerplate, the header logo)
 * from scraped blocks, and removes the widget's inline R-CONTENT sentinels so
 * the review wording itself survives. Editorial copy is otherwise untouched.
 */
export function presentableBlocks(blocks: ContentBlock[] = []): ContentBlock[] {
  return blocks
    .filter((b) => {
      if (b.type === 'img') return Boolean(b.src) && !isChromeImage(b.src);
      if (b.type === 'p' && isChromeParagraph(b.text)) return false;
      return true;
    })
    .map((b) => {
      if (b.type !== 'p' || (!b.text?.includes('-CONTENT') && !b.html?.includes('-CONTENT'))) return b;
      return {
        ...b,
        text: b.text?.replace(CONTENT_MARKER, ' ').replace(/\s+/g, ' ').trim(),
        html: b.html?.replace(CONTENT_MARKER, ' '),
      };
    });
}

