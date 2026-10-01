/**
 * Global business data for 5 Star Limousine Service.
 * Everything here was captured from the original site and is served locally.
 */

export const site = {
  name: '5 Star Limousine & Transportation Services',
  shortName: '5 Star Limo OC',
  legalName: '5 Star Limousine & Transportation Services',
  // Canonical domain of the site this build is for (used for schema/canonical only,
  // never to load an asset).
  url: 'https://5starlimooc.com',
  tagline: 'Luxury Meets Party Vibes',
  description:
    '5 Star Limousine & Transportation Services provides luxury limousine and party bus rental services including airport transfers, corporate travel, weddings, parties, and special events across Orange County with professional chauffeurs and premium vehicles.',
  phone: '+1-714-605-4550',
  phoneDisplay: '714-605-4550',
  phonePretty: '+1 714-605-4550',
  email: 'fivestarzlimo@hotmail.com',
  priceRange: '$$',
  address: {
    street: '1125 N Magnolia Ave',
    streetAlt: '520 N. Magnolia Ave',
    city: 'Anaheim',
    region: 'CA',
    postalCode: '92801',
    country: 'US',
  },
  geo: { lat: '33.84788010', lng: '-117.97654090' },
  rating: { value: '4.5', count: '30' },
  hours: 'Open 24 hours, 7 days a week',
  logo: '/images/wp-content/uploads/2024/09/5STAR-B.png',
  founded: '2004',
  yearsInBusiness: '20+',
  serviceAreas: ['Santa Ana', 'Anaheim', 'Newport Beach'],
  social: {
    facebook: 'https://www.facebook.com/Fivestarzlimo/',
    instagram: 'https://www.instagram.com/fivestarzlimo',
    yelp: 'https://yelp.com/biz/5-star-limousine-and-transportation-services-anaheim',
    youtube: 'https://www.youtube.com/watch?v=Gu1vHSpbjkY',
    maps: 'https://maps.google.com/?cid=10114373548570961545',
    linkedin: '',
  },
} as const;

/** Third-party measurement / review widgets — preserved verbatim. */
export const tracking = {
  /** Google Analytics 4 measurement id */
  ga4Id: 'G-9F9GDE33Z9',
  /** Google Tag Manager container id */
  gtmId: 'GTM-KHQFFXS4',
  /** Trustindex (Google reviews widget) loader */
  trustindexLoader: 'https://cdn.trustindex.io/loader.js',
  /** Quote form endpoint (byTHUB) used by the "Request a quote" form */
  quoteEndpoint: 'https://api-inform.bythub.in/?formId=exhaHQQKhtJI41f6RLmH',
  /** Single canonical destination every form redirects to after a successful submit */
  thankYouUrl: 'https://www.5starlimooc.com/thankyou',
  quoteRedirect: '/thankyou/',
  /** Contact form endpoint (Web3Forms) */
  contactEndpoint: 'https://api.web3forms.com/submit',
  contactAccessKey: '0e09cbcd-eec9-4457-b82a-712420a187d4',
} as const;

export default site;
