/**
 * Hero imagery for the service pages.
 *
 * These are the site's own 5 Star Limo OC photos (uploads/2026/07 and
 * related), chosen per service so each page opens on a relevant shot rather
 * than a generic one.
 *
 * Note: the previously bundled public/images/unsplash/*.jpg files are NOT
 * used here — they were keyword-matched stock and several are unrelated
 * (a vintage Beetle for airport transfers, pineapples for prom).
 */

export interface ServiceHero {
  src: string;
  alt: string;
}

/** Keyed by the page path as it appears in the content collection. */
export const serviceHeroes: Record<string, ServiceHero> = {
  '/services/wedding-limo-service/': {
    src: '/images/wp-content/uploads/2026/07/weddings.png',
    alt: 'Bride and groom beside a white stretch limousine at sunset',
  },
  '/services/quinceanera-limo-service/': {
    src: '/images/wp-content/uploads/2026/07/quinceanera-limo-service.png',
    alt: 'Quinceañera arriving in a luxury limousine',
  },
  '/services/prom-limo-service/': {
    src: '/images/wp-content/uploads/2026/07/prom-limo-service.png',
    alt: 'Prom party arriving in a stretch limousine with a chauffeur',
  },
  '/services/bachelorette-limo-service/': {
    src: '/images/wp-content/uploads/2026/07/bachelorette-party-limo-service.png',
    alt: 'Bachelorette party limousine service',
  },
  '/services/bachelor-party-limo-service/': {
    src: '/images/wp-content/uploads/2026/07/bachelorette-party-limo-service.png',
    alt: 'Group celebrating bachelor party transportation in a limousine',
  },
  '/services/airport-limo-service/': {
    src: '/images/wp-content/uploads/2026/07/airport-limo-service.png',
    alt: 'Airport transfer — a chauffeur helping a guest into a limousine at John Wayne Airport',
  },
  '/services/corporate-limo-service/': {
    src: '/images/wp-content/uploads/2026/07/corporate-events-limo-service.png',
    alt: 'Business travellers boarding a branded limousine for a corporate event',
  },
  '/services/wine-tour-limo-service/': {
    src: '/images/heroes/wine-tour.jpg',
    alt: 'Private wine tour limousine in Temecula wine country',
  },
  '/services/hollywood-tour-limo-service/': {
    src: '/images/heroes/hollywood-tour.jpg',
    alt: 'VIP Los Angeles sightseeing in a luxury SUV over the city',
  },
  '/services/concerts-limo-party-bus-service/': {
    src: '/images/heroes/concerts.jpg',
    alt: 'Limousine and party bus ready for a concert night out',
  },
  '/services/birthday-limo-party-bus-service/': {
    src: '/images/heroes/birthday-hummer.jpg',
    alt: 'White Hummer stretch limousine for birthday parties',
  },
  '/services/party-bus-rental/': {
    src: '/images/wp-content/uploads/2026/03/party-bus.webp',
    alt: 'White party bus ready for rental',
  },
  '/services/large-50-passenger-party-bus-service/': {
    src: '/images/wp-content/uploads/2026/03/party-bus.webp',
    alt: 'Large party bus available for groups of up to fifty passengers',
  },
  '/services/luxury-suv-service/': {
    src: '/images/wp-content/uploads/2026/03/suv-suburban-.webp',
    alt: 'Luxury SUV Suburban for airport and business travel',
  },
};

export const fallbackServiceHero: ServiceHero = {
  src: '/images/wp-content/uploads/2026/03/cadillac-escalade-limousine-.webp',
  alt: 'Cadillac Escalade stretch limousine',
};

export function heroFor(path = ''): ServiceHero {
  return serviceHeroes[path] ?? fallbackServiceHero;
}

export default serviceHeroes;
