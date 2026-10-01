/** Fleet inventory — cards and copy taken from the original site. */

export interface Vehicle {
  slug: string;
  name: string;
  tagline: string;
  image: string;
  alt: string;
  href: string;
}

export const fleet: Vehicle[] = [
  {
    slug: 'cadillac-escalade-limo',
    name: 'Escalade Limo',
    tagline: 'A modern and unique limo that suits any celebration.',
    image: '/images/wp-content/uploads/2026/09/cadillac-escalade-limo-768x512.webp',
    alt: 'Cadillac Escalade Limo',
    href: '/fleet/cadillac-escalade-limo/',
  },
  {
    slug: 'hummer-limo-rental',
    name: 'Hummer Limo',
    tagline: 'A spacious and pleasant limo with top of the line interior.',
    image: '/images/wp-content/uploads/2026/09/hummer-limo-rental-768x512.webp',
    alt: 'Hummer Limo Rental',
    href: '/fleet/hummer-limo-rental/',
  },
  {
    slug: 'party-bus-rental',
    name: 'Party Bus',
    tagline: 'A classic and elegant ride with additional space for larger groups.',
    image: '/images/wp-content/uploads/2026/09/party-bus-1024x683.webp',
    alt: 'Party Bus',
    href: '/services/party-bus-rental/',
  },
  {
    slug: 'chrysler-300-limo-rental',
    name: 'Chrysler 300 Limo',
    tagline: 'A comfortable and modern limo perfect for any occasion.',
    image: '/images/wp-content/uploads/2026/09/chrysler-300-limo-1024x683.webp',
    alt: 'Chrysler 300 Limo',
    href: '/fleet/chrysler-300-limo-rental/',
  },
  {
    slug: 'mercedes-sprinter-limo-bus',
    name: 'Sprinter Limo',
    tagline: 'An entertaining and fancy ride with state of the art features.',
    image: '/images/wp-content/uploads/2026/09/mercedes-sprinter-limo-300x200.webp',
    alt: 'Mercedes Sprinter Limo',
    href: '/fleet/mercedes-sprinter-limo-bus/',
  },
  {
    slug: 'luxury-suv-service',
    name: 'Luxury SUV',
    tagline: 'A classy & luxurious SUV suitable for airport services or business ventures.',
    image: '/images/wp-content/uploads/2026/03/suv-suburban--300x200.webp',
    alt: 'Luxury SUV Suburban',
    href: '/luxury-suv-service/',
  },
];

/** Footer quick-links also include the stretch limo. */
export const fleetFooter: NavLinkLike[] = [
  { label: 'Hummer Limo', href: '/fleet/hummer-limo-rental/' },
  { label: 'Party Bus', href: '/services/party-bus-rental/' },
  { label: 'Escalade Limo', href: '/fleet/cadillac-escalade-limo/' },
  { label: 'Chrysler 300', href: '/fleet/chrysler-300-limo-rental/' },
  { label: 'Sprinter Limo', href: '/fleet/mercedes-sprinter-limo-bus/' },
  { label: 'Luxury SUV', href: '/luxury-suv-service/' },
  { label: 'Stretch Limo', href: '/fleet/stretch-suv-limo-rentals/' },
];

interface NavLinkLike {
  label: string;
  href: string;
}

export const serviceFooter: NavLinkLike[] = [
  { label: 'Wedding Limo', href: '/services/wedding-limo-service/' },
  { label: 'Bachelor Party', href: '/services/bachelor-party-limo-service/' },
  { label: 'Quinceañera', href: '/services/quinceanera-limo-service/' },
  { label: 'Airport Transfer', href: '/services/airport-limo-service/' },
  { label: 'Prom Limo', href: '/services/prom-limo-service/' },
  { label: 'Wine Tour', href: '/services/wine-tour-limo-service/' },
  { label: 'Hollywood Tour', href: '/services/hollywood-tour-limo-service/' },
  { label: 'Corporate Events', href: '/corporate-limo-service/' },
];
