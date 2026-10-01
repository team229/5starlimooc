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
];

/** Group used for breadcrumb labels on scraped pages. */
export const KIND_CRUMB: Record<string, { name: string; href: string }> = {
  post: { name: 'Blog', href: '/blog/' },
  service: { name: 'Services', href: '/services/' },
  fleet: { name: 'Fleet', href: '/fleet/' },
  city: { name: 'Service Areas', href: '/cities/' },
};
