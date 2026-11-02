/**
 * Seasonal events marketing content.
 *
 * Feeds:
 *   1. the homepage Christmas section (`components/ChristmasSection.astro`)
 *   2. the Christmas landing page (`pages/christmas-limo-party-bus-orange-county.astro`)
 *   3. the Halloween / Homecoming / Oktoberfest landing pages
 *      (`components/EventLandingPage.astro`)
 *
 * Keyword targets: Christmas limo and party bus rental, Christmas light tours,
 * holiday parties and New Year's Eve across Anaheim and Orange County.
 */
import site from './site';
import { cities, type City } from './cities';

export interface SeasonalEvent {
  key: string;
  /** Small pill on the card, e.g. "Now – Oct 31". */
  badge: string;
  /** Season label shown above the card heading. */
  season: string;
  title: string;
  blurb: string;
  points: string[];
  image: string;
  imageAlt: string;
  href: string;
  cta: string;
  links: { label: string; href: string }[];
}

export interface LandingEvent {
  key: string;
  path: string;
  crumb: string;
  /** Lowercase head-term used to compose keyword-rich section headings. */
  keyword: string;
  eyebrow: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  heroImage: string;
  heroImageAlt: string;
  /** Paragraphs of intro copy. May contain inline HTML links. */
  intro: string[];
  highlights: { title: string; body: string }[];
  includes: string[];
  cities: City[];
  vehicles: { title: string; body: string; href: string }[];
  /** Rates table (kept consistent with the party bus prices guide). */
  pricing: { vehicle: string; seats: string; rate: string; best: string }[];
  /** Reassurance note shown under the rates table. */
  pricingNote: string;
  /** Popular local itineraries — long-tail SEO and booking ideas. */
  itineraries: { title: string; body: string; links: { label: string; href: string }[] }[];
  faq: { question: string; answer: string }[];
  related: { label: string; href: string }[];
  event: { name: string; startDate: string; endDate: string; description: string };
}

const pick = (label: string): City => cities.find((c) => c.label === label) as City;

/** Shared trust bar rendered under the hero on both landing pages. */
export const landingStats: { value: string; label: string }[] = [
  { value: '20+', label: 'Years serving Orange County' },
  { value: '2–50', label: 'Passengers per vehicle' },
  { value: '24/7', label: 'Booking & dispatch' },
  { value: '4.5★', label: 'Rated on Google' },
];

/** Shared "how it works" booking flow on both landing pages. */
export const bookingSteps: { title: string; body: string }[] = [
  {
    title: 'Tell us your date & group',
    body: 'Call or request a quote with your event date, headcount and pickup spots. We check live availability and recommend the right vehicle for your budget.',
  },
  {
    title: 'Lock in your ride',
    body: 'We put your rate, minimum and itinerary in writing — including your first hour free — so there are no surprises when the vehicle arrives.',
  },
  {
    title: 'Ride & enjoy the night',
    body: 'Your professional chauffeur handles every pickup, the traffic, the parking and the safe ride home while your group stays together.',
  },
];

/* ------------------------------------------------------------------ *
 * Homepage section copy
 * ------------------------------------------------------------------ */

export const seasonalIntro = {
  eyebrow: 'Seasonal Rides — Booking Now',
  h2: 'Upcoming Events in Orange County',
  lead:
    'Halloween nights, homecoming dances and Oktoberfest weekends book out fast. Reserve a limo or party bus for your whole group and let a professional chauffeur handle the driving, the traffic and the parking while you enjoy the night.',
  offer: 'Reserve early and get your first hour free on select vehicles.',
};

export const seasonalEvents: SeasonalEvent[] = [
  {
    key: 'halloween',
    badge: 'Now – Oct 31',
    season: 'Halloween Season 2026',
    title: 'Halloween Party Bus & Limo Rental',
    blurb:
      'Costume bar crawls, haunted-house tours and Halloween nights out across Anaheim and Orange County. Keep the whole group together and get home safe — no designated driver, no parking, no surge pricing.',
    points: [
      'Costume bar crawls & club nights',
      "Haunted attractions, Knott's & theme parks",
      'Groups of 2–50 passengers',
      'Licensed, insured & available 24/7',
    ],
    image: '/images/events/halloween-party-bus-orange-county.webp',
    imageAlt: 'Halloween party bus and limo rental for a night out in Orange County',
    href: '/halloween-party-bus-vs-limo-orange-county/',
    cta: 'Halloween Party Bus vs. Limo',
    links: [
      { label: 'Party bus rental', href: '/services/party-bus-rental/' },
      { label: 'Party bus prices', href: '/party-bus-prices-orange-county/' },
    ],
  },
  {
    key: 'homecoming',
    badge: 'School Dance Season',
    season: 'Homecoming 2026',
    title: 'Homecoming Limo & Party Bus Rental',
    blurb:
      'Arrive together and stay safe. Homecoming groups across Anaheim, Fullerton, Santa Ana, Tustin and Orange book our limos and party buses for pictures, dinner and the dance — with a chauffeur on duty all night.',
    points: [
      'Groups of 2–50 students',
      'Multiple pickup & drop-off stops',
      'Red-carpet photo stops',
      'Professional, background-checked chauffeurs',
    ],
    image: '/images/events/homecoming-limo-party-bus-orange-county.webp',
    imageAlt: 'Homecoming limo and party bus rental in Orange County for local high school students',
    href: '/homecoming-limo-party-bus-orange-county/',
    cta: 'Plan Your Homecoming Ride',
    links: [
      { label: 'Prom & homecoming limo', href: '/services/prom-limo-service/' },
      { label: '50-passenger party bus', href: '/services/large-50-passenger-party-bus-service/' },
    ],
  },
  {
    key: 'oktoberfest',
    badge: 'Sep – Nov',
    season: 'Oktoberfest & Fall Festivals',
    title: 'Oktoberfest & Fall Festival Party Bus',
    blurb:
      'Skip parking and the rideshare surge. Book a party bus for Oktoberfest celebrations, brewery tours, pumpkin patches and fall festivals across Orange County — door to door, all night long.',
    points: [
      'Oktoberfest & brewery tours',
      'No parking and no designated driver',
      'BYOB-friendly buses with ice & coolers',
      'All-night, door-to-door service',
    ],
    image: '/images/events/oktoberfest-fall-festival-party-bus-orange-county.webp',
    imageAlt: 'Oktoberfest and fall festival party bus rental in Orange County',
    href: '/oktoberfest-fall-festival-party-bus-orange-county/',
    cta: 'Oktoberfest & Fall Festival Rides',
    links: [
      { label: 'Concerts limo & party bus', href: '/services/concerts-limo-party-bus-service/' },
      { label: 'Party bus rental', href: '/services/party-bus-rental/' },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Homepage Christmas section
 * ------------------------------------------------------------------ */

export const christmasSection = {
  eyebrow: 'Christmas 2026 — Booking Now',
  headingLead: 'Christmas Limo & Party Bus Rentals in',
  headingHighlight: 'Orange County',
  lead:
    "Christmas light tours, office parties, family gatherings and New Year's Eve — reserve a limo or party bus for your whole group and let a professional chauffeur handle the traffic, the parking and the late-night drive home.",
  bullets: [
    'Christmas light tours across Orange County',
    'Holiday and company party transportation',
    "New Year's Eve — book early, dates sell out",
    'Groups of 2–50 passengers, chauffeur included',
  ],
  image: '/images/events/christmas-limo-party-bus-orange-county.webp',
  imageAlt: 'A historic mansion lit with Christmas lights at night in California',
  href: '/christmas-limo-party-bus-orange-county/',
  cta: 'See Christmas Rides & Rates',
  offer: 'Reserve early and get your first hour free on select vehicles.',
};

/* ------------------------------------------------------------------ *
 * Homepage New Year's Eve card
 * ------------------------------------------------------------------ */

export const newYearsEveSection = {
  eyebrow: "New Year's Eve 2026 — Booking Now",
  title: "New Year's Eve Party Bus & Limo Rental",
  lead:
    'Skip the rideshare surge and the parking nightmare. One fixed-rate vehicle, one professional chauffeur and one safe ride home for the whole group.',
  bullets: [
    'Dinner, party and countdown stops',
    'No surge pricing, no designated driver',
    'Groups of 2–50 passengers',
  ],
  image: '/images/events/new-years-eve-party-bus-limo-orange-county.webp',
  imageAlt: "Fireworks over the city on New Year's Eve in Orange County",
  href: '/new-years-eve-party-bus-limo-orange-county/',
  cta: "See New Year's Eve Rides & Rates",
};

/* ------------------------------------------------------------------ *
 * Landing pages
 * ------------------------------------------------------------------ */

export const homecomingLanding: LandingEvent = {
  key: 'homecoming',
  path: '/homecoming-limo-party-bus-orange-county/',
  crumb: 'Homecoming Transportation',
  keyword: 'homecoming limo & party bus',
  eyebrow: 'Homecoming 2026 — Orange County',
  h1: 'Homecoming Limo & Party Bus Rental in Orange County',
  metaTitle: 'Homecoming Limo & Party Bus Rental in Orange County | 5 Star Limo OC',
  metaDescription:
    'Book a homecoming limo or party bus in Orange County. Groups from Anaheim, Fullerton, Santa Ana, Tustin and Orange ride together — safe, on time and affordable. Call (714) 605-4550.',
  heroImage: '/images/events/homecoming-limo-party-bus-orange-county.webp',
  heroImageAlt: 'Homecoming limo and party bus rental in Orange County',
  intro: [
    "Homecoming is one of the biggest nights of the school year, and getting a whole group there safely — for <a href=\"/services/prom-limo-service/\">prom and homecoming photos</a>, dinner and the dance — takes more than a few cars. A 5 Star limo or <a href=\"/services/party-bus-rental/\">party bus rental</a> keeps everyone together, on time and off the road, with a professional chauffeur behind the wheel all night.",
    "We're based in Anaheim and serve homecoming groups across Orange County every fall, including <a href=\"/limo-party-bus-rentals-service-anaheim-ca/\">Anaheim</a>, <a href=\"/limo-party-bus-rentals-service-fullerton-ca/\">Fullerton</a>, <a href=\"/limo-party-bus-rentals-service-santa-ana-ca/\">Santa Ana</a>, <a href=\"/limo-party-bus-rentals-service-tustin-ca/\">Tustin</a> and <a href=\"/limo-party-bus-rentals-service-orange-ca/\">Orange</a>. Pick your group up at home, take pictures at a scenic stop, swing by dinner, arrive at the dance in style, and get everyone home safely afterward.",
    "Not sure how much it costs or which vehicle fits your group? Start with our <a href=\"/party-bus-prices-orange-county/\">party bus prices guide</a>, then call us and we'll build a homecoming package around your school's schedule.",
  ],
  highlights: [
    {
      title: 'Safety first',
      body: 'Licensed, insured and background-checked chauffeurs keep your student group safe while you focus on the night. No teen drivers, no split ride-shares.',
    },
    {
      title: 'Room for the group',
      body: 'From a 6-passenger stretch limo to a 50-passenger party bus, there is a vehicle for every homecoming group size and budget.',
    },
    {
      title: 'Picture-perfect arrival',
      body: 'Add a red-carpet rollout, photo stop or custom decor so your homecoming group makes an entrance at the dance.',
    },
    {
      title: 'Flexible, all-night itinerary',
      body: 'Photos, dinner, the dance and an after-party stop — we plan multiple pickups and drop-offs so no one is left behind.',
    },
    {
      title: 'Affordable when split',
      body: 'Splitting one limo or party bus across the whole group usually costs far less per person than surge-priced rides and separate cars.',
    },
    {
      title: 'Booked early, on time',
      body: 'Homecoming Saturdays sell out weeks ahead. Reserve early to lock in your date, your vehicle and your first hour free.',
    },
  ],
  includes: [
    'Professional chauffeur and round-trip coordination',
    'Multiple pickup and drop-off stops across Orange County',
    'Complimentary bottled water, ice and soft drinks',
    'Bluetooth sound system and LED party lighting',
    'Red-carpet and photo-stop options',
    '24/7 booking support and on-time arrival guarantee',
  ],
  cities: [
    'Anaheim',
    'Fullerton',
    'Santa Ana',
    'Tustin',
    'Orange',
    'Garden Grove',
    'Westminster',
    'Villa Park',
    'Placentia',
    'Yorba Linda',
    'Buena Park',
    'La Habra',
  ].map(pick),
  vehicles: [
    {
      title: 'Prom & Homecoming Limo',
      body: 'Classic stretch limousine for 6–10 passengers — the elegant choice for pictures and the dance.',
      href: '/services/prom-limo-service/',
    },
    {
      title: '50-Passenger Party Bus',
      body: 'Our largest party bus keeps big homecoming groups together with room to dance, lights and a premium sound system.',
      href: '/services/large-50-passenger-party-bus-service/',
    },
    {
      title: 'Hummer Limo',
      body: 'A bold, spacious limo with a head-turning presence that is always a homecoming favorite.',
      href: '/fleet/hummer-limo-rental/',
    },
    {
      title: 'Party Bus Rental',
      body: 'Flexible party bus options sized from 14 to 50 passengers with wrap-around seating and party lighting.',
      href: '/services/party-bus-rental/',
    },
  ],
  pricing: [
    { vehicle: 'Stretch limousine', seats: '6–8', rate: '$100–$125/hr', best: 'Photos, dinner & the dance' },
    { vehicle: 'Chrysler 300 limo', seats: '8', rate: '$125–$140/hr', best: 'Arrivals worth filming' },
    { vehicle: 'Hummer limo', seats: '12', rate: '$140–$160/hr', best: 'Groups of 8–12 wanting space' },
    { vehicle: 'Mercedes Sprinter limo', seats: 'up to 14', rate: '$140–$200/hr', best: 'Bigger groups in one vehicle' },
    { vehicle: 'Party bus, small', seats: '15–20', rate: '$195–$250/hr', best: 'Whole-grade groups' },
    { vehicle: '50-passenger party bus', seats: '40–50', rate: 'from $250/hr', best: 'Everyone together' },
  ],
  pricingNote:
    'Homecoming rates follow the same bands as the rest of the Orange County market, with a four-hour minimum on most vehicles. Split across the group, a homecoming limo usually costs less per person than separate cars or surge-priced rides. Rates are starting points — call for a fixed quote for your date.',
  itineraries: [
    {
      title: 'Anaheim & Fullerton homecoming night',
      body: 'Neighborhood pickups around Anaheim and Fullerton, a scenic photo stop, dinner, then a red-carpet arrival at the dance — with a late-night drop-off so everyone gets home safely.',
      links: [
        { label: 'Anaheim limo service', href: '/limo-party-bus-rentals-service-anaheim-ca/' },
        { label: 'Fullerton limo service', href: '/limo-party-bus-rentals-service-fullerton-ca/' },
      ],
    },
    {
      title: 'Santa Ana, Tustin & Orange run',
      body: 'One loop through Santa Ana, Tustin and Orange keeps the whole group together, with time for photos before the dance and a coordinated ride home afterward.',
      links: [
        { label: 'Santa Ana limo service', href: '/limo-party-bus-rentals-service-santa-ana-ca/' },
        { label: 'Tustin limo service', href: '/limo-party-bus-rentals-service-tustin-ca/' },
        { label: 'Orange limo service', href: '/limo-party-bus-rentals-service-orange-ca/' },
      ],
    },
    {
      title: 'North Orange County pickups',
      body: 'We serve Placentia, Yorba Linda, Brea, La Habra and Buena Park with one coordinated route and one professional chauffeur, so no parent has to drive.',
      links: [
        { label: 'Placentia', href: '/limo-party-bus-rentals-service-placentia-ca/' },
        { label: 'Yorba Linda', href: '/limo-party-bus-rentals-service-yorba-linda-ca/' },
        { label: 'Buena Park', href: '/limo-party-bus-rentals-service-buena-park-ca/' },
      ],
    },
  ],
  faq: [
    {
      question: 'How much does a homecoming limo or party bus cost in Orange County?',
      answer:
        'Homecoming stretch limos generally run about $100–$160 per hour depending on the vehicle, while party buses run about $195–$375 per hour depending on size and day. Most groups book a 4–5 hour package, and splitting the total across the group usually works out to less per person than surge-priced rides. See our party bus prices guide for full 2026 rates.',
    },
    {
      question: 'How many people fit in a homecoming party bus?',
      answer:
        'Our party buses seat anywhere from 14 to 50 passengers. The 50-passenger party bus is the most popular choice for larger homecoming groups who want everyone in one vehicle.',
    },
    {
      question: 'What time should we book the limo for homecoming night?',
      answer:
        'Plan for about 4–5 hours: photos at a scenic stop, dinner, then the dance, with a safe ride home afterward. We recommend booking three to four weeks ahead because homecoming Saturdays sell out quickly.',
    },
    {
      question: 'Can we make multiple stops during homecoming?',
      answer:
        'Yes. We build your itinerary around the group — starting with neighborhood pickups, then a photo stop, dinner and the dance, plus any after-party drop-offs. Your chauffeur stays with the group all night.',
    },
    {
      question: 'Which Orange County schools and cities do you serve?',
      answer:
        'We serve homecoming groups across Orange County, including Anaheim, Fullerton, Santa Ana, Tustin, Orange, Garden Grove, Westminster, Villa Park, Placentia, Yorba Linda, Buena Park and La Habra.',
    },
    {
      question: 'Are decorations or a red-carpet arrival available?',
      answer:
        'Yes. We offer red-carpet rollouts, photo stops and custom decorations so your homecoming group can make an entrance. Just let us know your theme when you book.',
    },
    {
      question: 'Is alcohol allowed on a homecoming party bus?',
      answer:
        'No. Homecoming guests are typically underage, and alcohol is not permitted on student trips. Our chauffeurs enforce a strict no-alcohol policy so parents can book with confidence.',
    },
    {
      question: 'How far in advance should we book a homecoming limo?',
      answer:
        'We recommend booking three to four weeks before the dance, and earlier for large groups or the busiest Saturday nights. Call (714) 605-4550 and we will check live availability for your date.',
    },
  ],
  related: [
    { label: 'Prom & homecoming limo service', href: '/services/prom-limo-service/' },
    { label: '50-passenger party bus', href: '/services/large-50-passenger-party-bus-service/' },
    { label: 'Party bus prices & rates', href: '/party-bus-prices-orange-county/' },
    { label: 'How to split prom party bus costs', href: '/how-to-split-prom-party-bus-costs-with-friends-save-money-guide/' },
    { label: 'Reasons to book a limo for prom night', href: '/top-reasons-to-book-a-limo-for-prom-night/' },
    { label: 'All blog articles', href: '/blog/' },
  ],
  event: {
    name: 'Homecoming Limo & Party Bus Season in Orange County 2026',
    startDate: '2026-09-11',
    endDate: '2026-11-14',
    description:
      'Safe, affordable homecoming limo and party bus rentals for high school groups across Anaheim, Fullerton, Santa Ana, Tustin, Orange and Orange County.',
  },
};

export const oktoberfestLanding: LandingEvent = {
  key: 'oktoberfest',
  path: '/oktoberfest-fall-festival-party-bus-orange-county/',
  crumb: 'Oktoberfest & Fall Festivals',
  keyword: 'Oktoberfest & fall festival party bus',
  eyebrow: 'Oktoberfest & Fall Festival Season',
  h1: 'Oktoberfest & Fall Festival Party Bus Rental in Orange County',
  metaTitle: 'Oktoberfest & Fall Festival Party Bus Rental | Orange County',
  metaDescription:
    'Party bus rental for Oktoberfest, brewery tours, pumpkin patches and fall festivals in Orange County. No parking, no designated driver, groups up to 50. Call (714) 605-4550.',
  heroImage: '/images/events/oktoberfest-fall-festival-party-bus-orange-county.webp',
  heroImageAlt: 'Oktoberfest and fall festival party bus rental in Orange County',
  intro: [
    "Fall in Orange County means Oktoberfest celebrations, brewery tours, pumpkin patches and weekend festivals — and every one of them comes with the same headaches: parking, traffic and getting a whole group home safely. A <a href=\"/services/party-bus-rental/\">party bus rental</a> solves all three. You get a private vehicle, a professional chauffeur and door-to-door service so nobody has to volunteer as the designated driver.",
    "Round up your group and book a party bus for an Oktoberfest weekend, a self-guided brewery tour from <a href=\"/limo-party-bus-rentals-service-anaheim-ca/\">Anaheim</a> to <a href=\"/limo-party-bus-rentals-service-huntington-beach-ca/\">Huntington Beach</a>, or a fall-festival and pumpkin-patch run across Orange County. Buses are BYOB-friendly for guests 21 and over, with ice, coolers and a premium sound system on board.",
    "Want the numbers first? Start with our <a href=\"/party-bus-prices-orange-county/\">2026 party bus prices guide</a>, then call and we'll match the right vehicle to your group size and itinerary.",
  ],
  highlights: [
    {
      title: 'Nobody drives',
      body: 'Every trip includes a professional chauffeur, so your group can enjoy Oktoberfest and fall festivals without worrying about the drive home.',
    },
    {
      title: 'Skip the parking nightmare',
      body: 'Busy festivals mean packed lots and long walks. We drop you at the entrance and pick you up right where you left off.',
    },
    {
      title: 'BYOB-friendly for 21+',
      body: 'Our party buses come with ice, coolers and room for your drinks, so your group can celebrate responsibly on board.',
    },
    {
      title: 'Groups from 2 to 50',
      body: 'From a luxe SUV or stretch limo to a 50-passenger party bus, there is a ride that fits your celebration.',
    },
    {
      title: 'Brewery & wine tours',
      body: 'Build a custom route through Orange County breweries, or head further to Temecula wine country and Big Bear for a full-day outing.',
    },
    {
      title: 'All-night, all-weather',
      body: 'Available 24/7 through the fall season, with heated, covered interiors so rain or cold nights never dampen the party.',
    },
  ],
  includes: [
    'Professional chauffeur and custom route planning',
    'Door-to-door pickup anywhere in Orange County',
    'Ice, coolers and complimentary bottled water',
    'Bluetooth sound system and party lighting',
    'BYOB-friendly for guests 21 and over',
    '24/7 booking support and flexible hourly packages',
  ],
  cities: [
    'Anaheim',
    'Orange',
    'Fullerton',
    'Huntington Beach',
    'Costa Mesa',
    'Newport Beach',
    'Irvine',
    'Tustin',
    'Santa Ana',
    'Garden Grove',
    'Westminster',
    'Brea',
  ].map(pick),
  vehicles: [
    {
      title: 'Party Bus Rental',
      body: 'The go-to for Oktoberfest and fall festivals — wrap-around seating, lights and a sound system for groups of 14–50.',
      href: '/services/party-bus-rental/',
    },
    {
      title: '50-Passenger Party Bus',
      body: 'Bring the entire crew in one bus with maximum space, dancing room and premium audio.',
      href: '/services/large-50-passenger-party-bus-service/',
    },
    {
      title: 'Concerts & Events Party Bus',
      body: 'Purpose-built for concerts, festivals and big nights out across Southern California.',
      href: '/services/concerts-limo-party-bus-service/',
    },
    {
      title: 'Luxury SUV & Sprinter',
      body: 'A refined, comfortable option for smaller groups and brewery or wine-tour itineraries.',
      href: '/fleet/mercedes-sprinter-limo-bus/',
    },
  ],
  pricing: [
    { vehicle: 'Luxury SUV / Escalade', seats: '6–8', rate: '$130–$160/hr', best: 'Small crews & brewery hops' },
    { vehicle: 'Mercedes Sprinter limo', seats: 'up to 14', rate: '$140–$200/hr', best: 'Mid-size groups & tours' },
    { vehicle: 'Party bus, small', seats: '15–20', rate: '$195–$250/hr', best: 'Groups of 10–20' },
    { vehicle: 'Party bus, medium', seats: '25–30', rate: '$250–$375/hr', best: 'The most-booked size' },
    { vehicle: '50-passenger party bus', seats: '40–50', rate: 'from $250/hr', best: 'Big Oktoberfest crews' },
    { vehicle: 'Stretch limousine', seats: '6–8', rate: '$100–$125/hr', best: 'Date nights & small groups' },
  ],
  pricingNote:
    'Fall-festival rates use the same Orange County bands, with a four-hour minimum on most vehicles and most Oktoberfest groups booking five to six hours. Split across the bus, per-person cost drops fast — see our party bus prices guide for the full 2026 breakdown, then call us for a fixed quote.',
  itineraries: [
    {
      title: 'Oktoberfest & brewery tour from Anaheim',
      body: 'Build a route through Anaheim breweries and taprooms, then let your chauffeur handle the parking, the pickups and the ride home for the whole crew.',
      links: [
        { label: 'Anaheim limo & party bus', href: '/limo-party-bus-rentals-service-anaheim-ca/' },
        { label: 'Party bus rental service', href: '/services/party-bus-rental/' },
      ],
    },
    {
      title: 'Huntington Beach & Costa Mesa fall nights',
      body: 'Hit the coastal beer scene in Huntington Beach and Costa Mesa without worrying about who is driving — one bus, all night, door to door.',
      links: [
        { label: 'Huntington Beach', href: '/limo-party-bus-rentals-service-huntington-beach-ca/' },
        { label: 'Costa Mesa', href: '/limo-party-bus-rentals-service-costa-mesa-ca/' },
      ],
    },
    {
      title: 'Temecula wine country & mountain getaways',
      body: 'Full-day fall trips to Temecula wine country or a Big Bear getaway, quoted by the day with a comfortable Sprinter limo or party bus.',
      links: [
        { label: 'Wine tour limo service', href: '/services/wine-tour-limo-service/' },
        { label: 'Mercedes Sprinter limo bus', href: '/fleet/mercedes-sprinter-limo-bus/' },
      ],
    },
  ],
  faq: [
    {
      question: 'How much does a party bus cost for Oktoberfest in Orange County?',
      answer:
        'Party bus rentals generally run about $195–$375 per hour depending on vehicle size and day, with most fall-festival groups booking 5–6 hours. Splitting one bus across the group usually costs less per person than ride-shares and separate parking. See our party bus prices guide for 2026 rates.',
    },
    {
      question: 'Do we need a designated driver for Oktoberfest?',
      answer:
        'No. Every rental includes a professional chauffeur who stays with your group for the full booking, so nobody has to drive and everyone gets home safely.',
    },
    {
      question: 'Can we drink on the party bus?',
      answer:
        'Yes, for guests 21 and over. Our party buses are BYOB-friendly and include ice and coolers. We do not allow alcohol on trips with underage guests, including homecoming and prom groups.',
    },
    {
      question: 'Where can you pick us up for Oktoberfest or a fall festival?',
      answer:
        'Anywhere in Orange County — homes, hotels, or a central meeting point. We serve Anaheim, Orange, Fullerton, Huntington Beach, Costa Mesa, Newport Beach, Irvine, Tustin and surrounding cities.',
    },
    {
      question: 'How long should we book the party bus for a festival?',
      answer:
        'Most Oktoberfest and fall-festival groups book five to six hours to cover pickups, the event and the ride home. We also offer full-day packages for brewery tours and wine-country trips.',
    },
    {
      question: 'Do you offer brewery, wine or Big Bear trips?',
      answer:
        'Yes. We build custom routes through Orange County breweries, out to Temecula wine country, or up to the mountains for fall getaways. Longer trips are quoted by the day — just tell us your itinerary.',
    },
    {
      question: 'What size group can a party bus hold?',
      answer:
        'Our party buses seat from 14 up to 50 passengers, so whether it is a small double date or a full Oktoberfest crew, we have a vehicle that fits.',
    },
    {
      question: 'Can we add a pumpkin patch or fall photo stop?',
      answer:
        'Absolutely. Tell us your must-see fall spots — pumpkin patches, festivals, breweries or scenic overlooks — and we will build them into your route with time for photos.',
    },
  ],
  related: [
    { label: 'Party bus rental service', href: '/services/party-bus-rental/' },
    { label: 'Concerts & events party bus', href: '/services/concerts-limo-party-bus-service/' },
    { label: 'Party bus prices & rates', href: '/party-bus-prices-orange-county/' },
    { label: 'Halloween Party Bus vs. Limo guide', href: '/halloween-party-bus-vs-limo-orange-county/' },
    { label: 'Homecoming limo & party bus', href: '/homecoming-limo-party-bus-orange-county/' },
    { label: 'All blog articles', href: '/blog/' },
  ],
  event: {
    name: 'Oktoberfest & Fall Festival Party Bus Season in Orange County 2026',
    startDate: '2026-09-18',
    endDate: '2026-11-22',
    description:
      'Party bus and limo rentals for Oktoberfest celebrations, brewery tours, pumpkin patches and fall festivals across Orange County.',
  },
};

export const christmasLanding: LandingEvent = {
  key: 'christmas',
  path: '/christmas-limo-party-bus-orange-county/',
  crumb: 'Christmas Transportation',
  keyword: 'Christmas limo & party bus',
  eyebrow: 'Christmas 2026 — Orange County',
  h1: 'Christmas Limo & Party Bus Rental in Orange County',
  metaTitle: 'Christmas Limo & Party Bus Rental in Orange County | 5 Star Limo OC',
  metaDescription:
    "Christmas limo and party bus rental in Orange County for holiday light tours, company parties and New Year's Eve. Groups of 2–50. Call (714) 605-4550.",
  heroImage: '/images/events/christmas-limo-party-bus-orange-county.webp',
  heroImageAlt: 'Christmas limo and party bus rental in Orange County with festive holiday lights',
  intro: [
    "Christmas in Orange County means neighborhood light tours, office parties, family dinners and New Year's Eve — and every one of them is easier when nobody in your group has to drive. A 5 Star <a href=\"/services/party-bus-rental/\">party bus rental</a> or <a href=\"/fleet/hummer-limo-rental/\">luxury limo</a> keeps everyone together, on time and off the road, with a professional chauffeur handling the traffic, the parking and the late-night ride home.",
    "We're based in Anaheim and serve holiday groups across Orange County, including <a href=\"/limo-party-bus-rentals-service-anaheim-ca/\">Anaheim</a>, <a href=\"/limo-party-bus-rentals-service-orange-ca/\">Orange</a>, <a href=\"/limo-party-bus-rentals-service-santa-ana-ca/\">Santa Ana</a>, <a href=\"/limo-party-bus-rentals-service-irvine-ca/\">Irvine</a>, <a href=\"/limo-party-bus-rentals-service-newport-beach-ca/\">Newport Beach</a> and <a href=\"/limo-party-bus-rentals-service-huntington-beach-ca/\">Huntington Beach</a>. Build a route around the best Christmas lights, a holiday dinner, a company party or a New Year's Eve celebration — we handle multiple pickups and drop-offs so the whole group stays together.",
    "Christmas and New Year's Eve are the busiest nights of the year for us. Start with our <a href=\"/party-bus-prices-orange-county/\">party bus prices guide</a>, then call early to lock in your date, your vehicle and your first hour free.",
  ],
  highlights: [
    {
      title: 'Christmas light tours',
      body: 'Build a route through the best decorated neighborhoods, drives and displays in Orange County — with a chauffeur to handle the traffic and parking so everyone can enjoy the lights.',
    },
    {
      title: 'Holiday & company parties',
      body: 'Arrive together and get home safely. We handle office parties, family gatherings and friend-group dinners with multiple pickups and a chauffeur on duty all night.',
    },
    {
      title: "New Year's Eve",
      body: "Skip the rideshare surge and the parking nightmare. Reserve a limo or party bus for New Year's Eve and keep your whole group together from the first toast to the last drop-off.",
    },
    {
      title: 'A professional chauffeur',
      body: "Licensed, insured and background-checked chauffeurs handle every mile, so nobody has to volunteer as the designated driver on Christmas Eve or New Year's Eve.",
    },
    {
      title: 'Groups from 2 to 50',
      body: 'From a 6-passenger stretch limo to a 50-passenger party bus, there is a vehicle for every holiday group size and budget.',
    },
    {
      title: 'Book early for the holidays',
      body: "Christmas light tours and New Year's Eve sell out weeks ahead. Reserve early to lock in your date, your vehicle and your first hour free.",
    },
  ],
  includes: [
    'Professional chauffeur and custom holiday route planning',
    'Multiple pickup and drop-off stops across Orange County',
    'Complimentary bottled water, ice and soft drinks',
    'Bluetooth sound system and LED party lighting',
    'Festive decor and photo-stop options',
    '24/7 booking support and on-time arrival guarantee',
  ],
  cities: [
    'Anaheim',
    'Orange',
    'Santa Ana',
    'Irvine',
    'Newport Beach',
    'Huntington Beach',
    'Fullerton',
    'Tustin',
    'Costa Mesa',
    'Garden Grove',
    'Westminster',
    'Yorba Linda',
  ].map(pick),
  vehicles: [
    {
      title: 'Party Bus Rental',
      body: 'The go-to for Christmas light tours and holiday parties — wrap-around seating, lights and a sound system for groups of 14–50.',
      href: '/services/party-bus-rental/',
    },
    {
      title: '50-Passenger Party Bus',
      body: 'Keep the entire holiday crew in one vehicle with maximum space, dancing room and premium audio.',
      href: '/services/large-50-passenger-party-bus-service/',
    },
    {
      title: 'Hummer Limo',
      body: "A bold, spacious limo with a head-turning presence — a favorite for holiday parties and New Year's Eve.",
      href: '/fleet/hummer-limo-rental/',
    },
    {
      title: 'Mercedes Sprinter Limo Bus',
      body: 'A refined option for smaller holiday groups, family gatherings and airport runs over the holidays.',
      href: '/fleet/mercedes-sprinter-limo-bus/',
    },
  ],
  pricing: [
    { vehicle: 'Stretch limousine', seats: '6–8', rate: '$100–$125/hr', best: 'Holiday dinners & date nights' },
    { vehicle: 'Chrysler 300 limo', seats: '8', rate: '$125–$140/hr', best: 'Arrivals worth filming' },
    { vehicle: 'Hummer limo', seats: '12', rate: '$140–$160/hr', best: 'Holiday parties & NYE' },
    { vehicle: 'Mercedes Sprinter limo', seats: 'up to 14', rate: '$140–$200/hr', best: 'Family groups & airport runs' },
    { vehicle: 'Party bus, small', seats: '15–20', rate: '$195–$250/hr', best: 'Christmas light tours' },
    { vehicle: '50-passenger party bus', seats: '40–50', rate: 'from $250/hr', best: 'Big holiday crews' },
  ],
  pricingNote:
    "Holiday rates follow the same Orange County bands as the rest of the year, with a four-hour minimum on most vehicles. Christmas Eve, Christmas Day and New Year's Eve may carry a holiday premium and sell out early. Split across the group, a holiday limo or party bus usually costs less per person than separate cars and surge-priced rides. Rates are starting points — call for a fixed quote for your date.",
  itineraries: [
    {
      title: 'Christmas light tour from Anaheim',
      body: 'Start with neighborhood pickups around Anaheim and Orange, then follow a route past the best decorated streets and displays. Your chauffeur handles the traffic and parking while the group stays together.',
      links: [
        { label: 'Anaheim limo & party bus', href: '/limo-party-bus-rentals-service-anaheim-ca/' },
        { label: 'Orange limo & party bus', href: '/limo-party-bus-rentals-service-orange-ca/' },
      ],
    },
    {
      title: 'Holiday party loop through Irvine & Newport Beach',
      body: 'One coordinated route for office parties and family gatherings across Irvine, Newport Beach and Costa Mesa — multiple stops, one chauffeur, and a safe ride home for everyone.',
      links: [
        { label: 'Irvine', href: '/limo-party-bus-rentals-service-irvine-ca/' },
        { label: 'Newport Beach', href: '/limo-party-bus-rentals-service-newport-beach-ca/' },
        { label: 'Costa Mesa', href: '/limo-party-bus-rentals-service-costa-mesa-ca/' },
      ],
    },
    {
      title: "New Year's Eve in Orange County",
      body: "Ring in the new year without worrying about the drive home. We build a New Year's Eve route around dinner, the celebration and a late-night drop-off for the whole group.",
      links: [
        { label: 'Party bus rental service', href: '/services/party-bus-rental/' },
        { label: 'Party bus prices & rates', href: '/party-bus-prices-orange-county/' },
      ],
    },
  ],
  faq: [
    {
      question: 'How much does a Christmas limo or party bus cost in Orange County?',
      answer:
        'Christmas stretch limos generally run about $100–$160 per hour depending on the vehicle, while party buses run about $195–$375 per hour depending on size and date. Most holiday groups book a 4–5 hour package, and splitting the total across the group usually works out to less per person than separate cars and surge-priced rides. Christmas Eve, Christmas Day and New Year\'s Eve may carry a holiday premium. See our party bus prices guide for full 2026 rates.',
    },
    {
      question: "How far in advance should we book for Christmas or New Year's Eve?",
      answer:
        "Book as early as you can — Christmas light tours and New Year's Eve are the busiest dates of the year and sell out weeks in advance. We recommend reserving at least three to four weeks ahead, and earlier for large groups or the prime evening hours.",
    },
    {
      question: 'Do you offer Christmas light tours in Orange County?',
      answer:
        'Yes. We build custom Christmas light tour routes around the best decorated neighborhoods, drives and displays in Orange County. Your chauffeur handles the traffic, the parking and the driving while your group enjoys the lights.',
    },
    {
      question: 'Can we make multiple stops during a holiday party?',
      answer:
        "Absolutely. We plan the route around your group — neighborhood pickups, a light-tour stop, dinner and the party — with multiple drop-offs at the end of the night. Your chauffeur stays with the group for the full booking.",
    },
    {
      question: 'How many people fit in a Christmas party bus?',
      answer:
        'Our party buses seat anywhere from 14 to 50 passengers, and our limos and Sprinters cover smaller groups from 6 to 14. The 50-passenger party bus is the most popular choice for large holiday groups who want everyone in one vehicle.',
    },
    {
      question: 'Is alcohol allowed on the party bus?',
      answer:
        'Yes, for guests 21 and over. Our party buses are BYOB-friendly and include ice and coolers. Alcohol is not permitted on trips with underage guests, and our chauffeurs enforce a strict no-alcohol policy on those bookings.',
    },
    {
      question: 'Do you provide Christmas decorations?',
      answer:
        'Yes. We offer festive decor and photo-stop options so your holiday group can make an entrance. Tell us your theme when you book and we will confirm what is available for your vehicle and date.',
    },
    {
      question: 'Which Orange County cities do you serve for Christmas?',
      answer:
        'We serve holiday groups across Orange County, including Anaheim, Orange, Santa Ana, Irvine, Newport Beach, Huntington Beach, Fullerton, Tustin, Costa Mesa, Garden Grove, Westminster and Yorba Linda.',
    },
  ],
  related: [
    { label: 'Party bus rental service', href: '/services/party-bus-rental/' },
    { label: '50-passenger party bus', href: '/services/large-50-passenger-party-bus-service/' },
    { label: 'Party bus prices & rates', href: '/party-bus-prices-orange-county/' },
    { label: 'Hummer limo rental', href: '/fleet/hummer-limo-rental/' },
    { label: 'Mercedes Sprinter limo bus', href: '/fleet/mercedes-sprinter-limo-bus/' },
    { label: 'All blog articles', href: '/blog/' },
  ],
  event: {
    name: 'Christmas Limo & Party Bus Season in Orange County 2026',
    startDate: '2026-11-20',
    endDate: '2027-01-01',
    description:
      "Christmas limo and party bus rentals for holiday light tours, company parties, family gatherings and New Year's Eve across Anaheim, Irvine, Newport Beach and Orange County.",
  },
};

export const newYearsEveLanding: LandingEvent = {
  key: 'new-years-eve',
  path: '/new-years-eve-party-bus-limo-orange-county/',
  crumb: "New Year's Eve Transportation",
  keyword: "New Year's Eve party bus & limo",
  eyebrow: "New Year's Eve 2026 — Orange County",
  h1: "New Year's Eve Party Bus & Limo Rental in Orange County",
  metaTitle: "New Year's Eve Party Bus & Limo Rental in Orange County | 5 Star Limo OC",
  metaDescription:
    "New Year's Eve party bus and limo rental in Orange County. Skip the rideshare surge, keep your group together and get home safe. Call (714) 605-4550.",
  heroImage: '/images/events/new-years-eve-party-bus-limo-orange-county.webp',
  heroImageAlt: "New Year's Eve party bus and limo rental in Orange County with fireworks over the city",
  intro: [
    "New Year's Eve is the busiest night of the year, and the last thing you want is to spend it hunting for parking or watching rideshare prices surge. A 5 Star <a href=\"/services/party-bus-rental/\">party bus rental</a> or <a href=\"/fleet/hummer-limo-rental/\">luxury limo</a> keeps your whole group together, gets you to the celebration on time and brings everyone home safely after the countdown.",
    "We're based in Anaheim and serve New Year's Eve groups across Orange County, including <a href=\"/limo-party-bus-rentals-service-anaheim-ca/\">Anaheim</a>, <a href=\"/limo-party-bus-rentals-service-orange-ca/\">Orange</a>, <a href=\"/limo-party-bus-rentals-service-santa-ana-ca/\">Santa Ana</a>, <a href=\"/limo-party-bus-rentals-service-irvine-ca/\">Irvine</a>, <a href=\"/limo-party-bus-rentals-service-newport-beach-ca/\">Newport Beach</a> and <a href=\"/limo-party-bus-rentals-service-costa-mesa-ca/\">Costa Mesa</a>. Build a route around dinner, a house party, a club or a hotel celebration — with multiple pickups and drop-offs so nobody drives home at 1 a.m.",
    "New Year's Eve books out earlier than any other date. Check our <a href=\"/party-bus-prices-orange-county/\">party bus prices guide</a>, then call early to lock in your vehicle, your rate and your first hour free.",
  ],
  highlights: [
    {
      title: 'Skip the rideshare surge',
      body: "New Year's Eve rideshare prices spike right when everyone wants to leave. One fixed-rate limo or party bus keeps the cost predictable and the group together.",
    },
    {
      title: 'A safe ride home',
      body: 'Every booking includes a professional chauffeur who stays with your group all night, so nobody has to drive after midnight.',
    },
    {
      title: 'Dinner, parties & countdowns',
      body: 'From a holiday dinner to a hotel party or club, we plan multiple stops and a late-night drop-off that fits your group.',
    },
    {
      title: 'Groups from 2 to 50',
      body: 'From a 6-passenger stretch limo to a 50-passenger party bus, there is a vehicle for every New Year\'s Eve group size and budget.',
    },
    {
      title: 'No parking nightmare',
      body: 'We drop you at the door and pick you up where you left off, so your group never circles a packed lot at midnight.',
    },
    {
      title: 'Book early — it sells out',
      body: "New Year's Eve is our busiest date of the year. Reserve early to lock in your vehicle, your rate and your first hour free.",
    },
  ],
  includes: [
    'Professional chauffeur and custom New Year\'s Eve route planning',
    'Multiple pickup and drop-off stops across Orange County',
    'Complimentary bottled water, ice and soft drinks',
    'Bluetooth sound system and LED party lighting',
    'Festive decor and photo-stop options',
    '24/7 booking support and on-time arrival guarantee',
  ],
  cities: [
    'Anaheim',
    'Orange',
    'Santa Ana',
    'Irvine',
    'Newport Beach',
    'Costa Mesa',
    'Huntington Beach',
    'Fullerton',
    'Tustin',
    'Garden Grove',
    'Westminster',
    'Yorba Linda',
  ].map(pick),
  vehicles: [
    {
      title: 'Party Bus Rental',
      body: "The go-to for New Year's Eve — wrap-around seating, lights and a sound system for groups of 14–50.",
      href: '/services/party-bus-rental/',
    },
    {
      title: '50-Passenger Party Bus',
      body: 'Keep the entire New Year\'s Eve crew in one vehicle with maximum space, dancing room and premium audio.',
      href: '/services/large-50-passenger-party-bus-service/',
    },
    {
      title: 'Hummer Limo',
      body: "A bold, spacious limo with a head-turning presence — a favorite for New Year's Eve arrivals.",
      href: '/fleet/hummer-limo-rental/',
    },
    {
      title: 'Mercedes Sprinter Limo Bus',
      body: 'A refined option for smaller groups heading to dinner and the countdown.',
      href: '/fleet/mercedes-sprinter-limo-bus/',
    },
  ],
  pricing: [
    { vehicle: 'Stretch limousine', seats: '6–8', rate: '$100–$125/hr', best: 'Dinner & a small group' },
    { vehicle: 'Chrysler 300 limo', seats: '8', rate: '$125–$140/hr', best: 'Arrivals worth filming' },
    { vehicle: 'Hummer limo', seats: '12', rate: '$140–$160/hr', best: 'NYE parties & photos' },
    { vehicle: 'Mercedes Sprinter limo', seats: 'up to 14', rate: '$140–$200/hr', best: 'Friends & family groups' },
    { vehicle: 'Party bus, small', seats: '15–20', rate: '$195–$250/hr', best: 'Countdown crews' },
    { vehicle: '50-passenger party bus', seats: '40–50', rate: 'from $250/hr', best: 'Everyone together' },
  ],
  pricingNote:
    "New Year's Eve rates follow the same Orange County bands, with a four-hour minimum on most vehicles and a holiday premium on December 31. Most NYE groups book five to six hours to cover dinner, the countdown and the ride home. Split across the group, a party bus usually costs less per person than surge-priced rides. Rates are starting points — call for a fixed quote for your date.",
  itineraries: [
    {
      title: 'Dinner & countdown in Anaheim',
      body: 'Start with pickups around Anaheim and Orange, head to dinner, then on to the countdown party — with a late-night drop-off for the whole group.',
      links: [
        { label: 'Anaheim limo & party bus', href: '/limo-party-bus-rentals-service-anaheim-ca/' },
        { label: 'Orange limo & party bus', href: '/limo-party-bus-rentals-service-orange-ca/' },
      ],
    },
    {
      title: 'Newport Beach & Costa Mesa celebration',
      body: 'One coordinated route for dinner, a waterfront party and the midnight countdown across Newport Beach and Costa Mesa, with one chauffeur all night.',
      links: [
        { label: 'Newport Beach', href: '/limo-party-bus-rentals-service-newport-beach-ca/' },
        { label: 'Costa Mesa', href: '/limo-party-bus-rentals-service-costa-mesa-ca/' },
      ],
    },
    {
      title: 'Hotel & club loop from Irvine',
      body: 'We handle the pickups, the parking and the late-night drive so your group can celebrate across Irvine and Santa Ana without splitting into ride-shares.',
      links: [
        { label: 'Irvine', href: '/limo-party-bus-rentals-service-irvine-ca/' },
        { label: 'Santa Ana', href: '/limo-party-bus-rentals-service-santa-ana-ca/' },
      ],
    },
  ],
  faq: [
    {
      question: "How much does a New Year's Eve party bus or limo cost in Orange County?",
      answer:
        "New Year's Eve stretch limos generally run about $100–$160 per hour, while party buses run about $195–$375 per hour depending on size. Most NYE groups book five to six hours, and December 31 may carry a holiday premium. Splitting the total across the group usually costs less per person than surge-priced rides. See our party bus prices guide for full 2026 rates.",
    },
    {
      question: "How far in advance should we book for New Year's Eve?",
      answer:
        "As early as possible — New Year's Eve is the busiest date of the year and sells out weeks in advance. We recommend reserving at least three to four weeks ahead, and earlier for large groups or the prime evening hours.",
    },
    {
      question: "What time should we start the booking?",
      answer:
        "Most groups start around 7–8 p.m. for dinner, then continue to the party and countdown, with a drop-off after midnight. We build the schedule around your plans and keep the vehicle with you for the full booking.",
    },
    {
      question: "Can we make multiple stops on New Year's Eve?",
      answer:
        "Yes. We plan the route around your group — neighborhood pickups, dinner, the party and a late-night drop-off — so everyone stays together and nobody has to drive.",
    },
    {
      question: "How many people fit in a New Year's Eve party bus?",
      answer:
        'Our party buses seat anywhere from 14 to 50 passengers, and our limos and Sprinters cover smaller groups from 6 to 14. The 50-passenger party bus is the most popular choice for large NYE groups.',
    },
    {
      question: 'Is alcohol allowed on the party bus?',
      answer:
        'Yes, for guests 21 and over. Our party buses are BYOB-friendly and include ice and coolers. Alcohol is not permitted on trips with underage guests, and our chauffeurs enforce a strict no-alcohol policy on those bookings.',
    },
    {
      question: 'Do you charge surge pricing on New Year\'s Eve?',
      answer:
        'No. We quote a fixed rate for your date and vehicle, so the price does not change when demand spikes. December 31 may carry a holiday premium, which we confirm in writing before you book.',
    },
    {
      question: "Which Orange County cities do you serve on New Year's Eve?",
      answer:
        'We serve NYE groups across Orange County, including Anaheim, Orange, Santa Ana, Irvine, Newport Beach, Costa Mesa, Huntington Beach, Fullerton, Tustin, Garden Grove, Westminster and Yorba Linda.',
    },
  ],
  related: [
    { label: 'Party bus rental service', href: '/services/party-bus-rental/' },
    { label: '50-passenger party bus', href: '/services/large-50-passenger-party-bus-service/' },
    { label: 'Party bus prices & rates', href: '/party-bus-prices-orange-county/' },
    { label: 'Hummer limo rental', href: '/fleet/hummer-limo-rental/' },
    { label: 'Christmas limo & party bus', href: '/christmas-limo-party-bus-orange-county/' },
    { label: 'All blog articles', href: '/blog/' },
  ],
  event: {
    name: "New Year's Eve Party Bus & Limo in Orange County 2026",
    startDate: '2026-12-31',
    endDate: '2027-01-01',
    description:
      "New Year's Eve party bus and limo rentals for dinner, countdown parties and a safe ride home across Anaheim, Irvine, Newport Beach and Orange County.",
  },
};

/** Build a valid schema.org Event object for any landing event. */
export function buildEventSchema(e: {
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  image: string;
  url: string;
}) {
  const absolute = (u: string) => (u.startsWith('http') ? u : `${site.url}${u}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: e.name,
    startDate: e.startDate,
    endDate: e.endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    description: e.description,
    image: absolute(e.image),
    url: absolute(e.url),
    location: {
      '@type': 'Place',
      name: 'Orange County, California',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Anaheim',
        addressRegion: 'CA',
        addressCountry: 'US',
      },
    },
    organizer: { '@type': 'Organization', name: site.name, url: `${site.url}/` },
  };
}

/** Homepage Event schemas for the current seasonal campaigns (Christmas + New Year's Eve). */
export const homepageEventSchemas = [
  buildEventSchema({
    ...christmasLanding.event,
    image: christmasLanding.heroImage,
    url: christmasLanding.path,
  }),
  buildEventSchema({
    ...newYearsEveLanding.event,
    image: newYearsEveLanding.heroImage,
    url: newYearsEveLanding.path,
  }),
];
