/** Routes that get a dedicated hand-written Astro template. */
export const HAND_BUILT = [
  '/',
  '/about-us/',
  '/contact/',
  '/blog/',
  '/services/',
  '/fleet/',
  '/cities/',
  '/locations/',
  '/gallery/',
  '/thankyou/',
  '/privacy-policy/',
  '/terms-of-service/',
  '/sitemap/',
  '/homecoming-limo-party-bus-orange-county/',
  '/oktoberfest-fall-festival-party-bus-orange-county/',
];

/**
 * Pages deliberately kept out of the sitemap and search indexes: utility
 * pages, the legacy /locations/ redirect, and leftover theme-demo posts
 * from the original WordPress install.
 */
export const EXCLUDE_PATHS = [
  '/404',
  '/404-2/',
  '/thankyou/',
  '/locations/',
  '/a-powerful-theme/',
  '/a-push-for-your-business/',
];

/** Content pages that should emit `<meta name="robots" content="noindex">`. */
export const NOINDEX_PATHS = new Set(['/a-powerful-theme/', '/a-push-for-your-business/']);

/** Group used for breadcrumb labels on scraped pages. */
export const KIND_CRUMB: Record<string, { name: string; href: string }> = {
  post: { name: 'Blog', href: '/blog/' },
  service: { name: 'Services', href: '/services/' },
  fleet: { name: 'Fleet', href: '/fleet/' },
  city: { name: 'Service Areas', href: '/cities/' },
};
