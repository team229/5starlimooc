/** Occasion / service cards shown on the homepage and index pages. */

export interface ServiceCard {
  title: string;
  image: string;
  alt: string;
  href: string;
}

export const occasionCards: ServiceCard[] = [
  {
    title: 'Weddings',
    image: '/images/wp-content/uploads/2026/07/weddings.png',
    alt: 'Wedding Limo Service',
    href: '/services/wedding-limo-service/',
  },
  {
    title: 'Quinceanera',
    image: '/images/wp-content/uploads/2026/07/quinceanera-limo-service.png',
    alt: 'Quinceanera Limo Service',
    href: '/services/quinceanera-limo-service/',
  },
  {
    title: 'Prom',
    image: '/images/wp-content/uploads/2026/07/prom-limo-service.png',
    alt: 'Prom Limo Service',
    href: '/services/prom-limo-service/',
  },
  {
    title: 'Airport',
    image: '/images/wp-content/uploads/2026/07/airport-limo-service.png',
    alt: 'Airport Transfer Service',
    href: '/services/airport-limo-service/',
  },
  {
    title: 'Corporate Events',
    image: '/images/wp-content/uploads/2026/07/corporate-events-limo-service.png',
    alt: 'Corporate Event Limo Service',
    href: '/corporate-limo-service/',
  },
  {
    title: "Bachelorette Party",
    image: '/images/wp-content/uploads/2026/07/bachelorette-party-limo-service.png',
    alt: 'Bachelorette Party Limo Service',
    href: '/services/bachelor-party-limo-service/',
  },
];

/** "Services We Offer" text blocks (from the Why Choose section). */
export const offeredServices = [
  {
    title: 'Weddings',
    body: 'Arrive in elegance on your big day with our luxurious limousine rental options. Our stylish limo service Anaheim makes your wedding unforgettable.',
    href: '/services/wedding-limo-service/',
  },
  {
    title: 'Corporate Events',
    body: 'Impress clients and colleagues with our executive-level limousine service Anaheim. Our professional drivers provide seamless transport for business meetings and events.',
    href: '/corporate-limo-service/',
  },
  {
    title: 'Airport Transfers',
    body: 'Looking for dependable limo rental near me for airport transportation? Our punctual chauffeurs guarantee timely arrivals and departures for a hassle-free experience.',
    href: '/services/airport-limo-service/',
  },
  {
    title: 'Special Occasions',
    body: 'From birthdays to anniversaries, our limousine service is perfect for any milestone. Choose 5 Star Limo when you need a limo service in Anaheim for life’s biggest celebrations.',
    href: '/services/birthday-limo-party-bus-service/',
  },
];
