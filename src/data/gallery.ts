/** Curated gallery photos, grouped into filterable collections. */

export interface GalleryImage {
  src: string;
  alt: string;
  category: GalleryCategory;
  caption: string;
}

export type GalleryCategory = 'limousines' | 'party-buses' | 'occasions' | 'interiors';

export interface GalleryGroup {
  id: GalleryCategory;
  label: string;
  blurb: string;
}

export const galleryGroups: GalleryGroup[] = [
  { id: 'limousines', label: 'Limousines', blurb: 'Stretch limos and luxury SUVs for every guest count.' },
  { id: 'party-buses', label: 'Party Buses', blurb: 'Sprinter and charter buses built for a full party.' },
  { id: 'occasions', label: 'Occasions', blurb: 'Weddings, proms, concerts, airport runs and wine tours.' },
  { id: 'interiors', label: 'Interiors', blurb: 'Inside the vehicles — the details that set the night apart.' },
];

const img = (src: string, alt: string, category: GalleryCategory, caption: string): GalleryImage => ({
  src,
  alt,
  category,
  caption,
});

export const galleryImages: GalleryImage[] = [
  // ---- limousines ----
  img(
    '/images/wp-content/uploads/2026/03/cadillac-escalade-limousine-.webp',
    'White Cadillac Escalade stretch limousine parked at a resort',
    'limousines',
    'Cadillac Escalade Limo',
  ),
  img(
    '/images/wp-content/uploads/2026/03/hummer-limousine-2-.webp',
    'White Hummer H2 stretch limousine in a driveway',
    'limousines',
    'Hummer Stretch Limo',
  ),
  img(
    '/images/wp-content/uploads/2026/03/chrsyler-limousine-.webp',
    'Black Chrysler 300 stretch limousine at night',
    'limousines',
    'Chrysler 300 Limo',
  ),
  img(
    '/images/wp-content/uploads/2026/03/lincoln-mkt-limousine-.webp',
    'Black Lincoln MKT stretch limousine',
    'limousines',
    'Lincoln MKT Stretch Limo',
  ),
  img(
    '/images/wp-content/uploads/2026/03/suv-suburban-.webp',
    'Black luxury SUV Suburban ready for an airport run',
    'limousines',
    'Luxury SUV',
  ),
  img(
    '/images/wp-content/uploads/2023/06/escalade-limo-768x353.png',
    'Escalade limousine on a coastal road',
    'limousines',
    'Escalade Limo — Coast Run',
  ),
  img(
    '/images/wp-content/uploads/2026/08/luxury-suv-car-service-1024x683.png',
    'Luxury SUV car service for business travel',
    'limousines',
    'Luxury SUV Car Service',
  ),
  img(
    '/images/wp-content/uploads/2026/08/limo-rental-for-6-8-10-and-14-passengers-1024x683.png',
    'Limousine options for small and large groups',
    'limousines',
    '6, 8, 10 & 14 Passenger Options',
  ),

  // ---- party buses ----
  img(
    '/images/wp-content/uploads/2026/03/party-bus.webp',
    'White party bus with tinted windows',
    'party-buses',
    'Party Bus',
  ),
  img(
    '/images/wp-content/uploads/2026/03/mercedes-sprinter-party-bus-.webp',
    'Mercedes Sprinter party bus limo',
    'party-buses',
    'Mercedes Sprinter Limo Bus',
  ),
  img(
    '/images/ext/5starpartybusrental.com-45-passenger-party-bus.jpeg',
    'Forty-five passenger party bus',
    'party-buses',
    '45 Passenger Party Bus',
  ),
  img(
    '/images/ext/5starpartybusrental.com-50-passenger-charter-bus.jpeg',
    'Fifty passenger charter bus for large events',
    'party-buses',
    '50 Passenger Charter Bus',
  ),
  img(
    '/images/unsplash/large-50-passenger-party-bus-service.jpg',
    'Large party bus ready for a group event',
    'party-buses',
    'Large Group Party Bus',
  ),
  img(
    '/images/wp-content/uploads/2026/09/party-bus-1024x683.webp',
    'Party bus photographed on the street',
    'party-buses',
    'Party Bus — Night Out',
  ),

  // ---- occasions ----
  img(
    '/images/wp-content/uploads/2026/07/weddings.png',
    'Wedding limousine service in Orange County',
    'occasions',
    'Weddings',
  ),
  img(
    '/images/wp-content/uploads/2026/07/quinceanera-limo-service.png',
    'Quinceañera limousine service',
    'occasions',
    'Quinceañera',
  ),
  img(
    '/images/wp-content/uploads/2026/07/prom-limo-service.png',
    'Prom limousine service',
    'occasions',
    'Prom Night',
  ),
  img(
    '/images/wp-content/uploads/2026/07/bachelorette-party-limo-service.png',
    'Bachelorette party limousine service',
    'occasions',
    'Bachelorette Party',
  ),
  img(
    '/images/wp-content/uploads/2026/07/corporate-events-limo-service.png',
    'Corporate event transportation',
    'occasions',
    'Corporate Events',
  ),
  img(
    '/images/wp-content/uploads/2026/07/airport-limo-service.png',
    'Airport limo transfer service',
    'occasions',
    'Airport Transfers',
  ),
  img(
    '/images/wp-content/uploads/2023/03/winetourpicute19.jpg',
    'Wine tour limousine in Temecula',
    'occasions',
    'Temecula Wine Tours',
  ),
  img(
    '/images/wp-content/uploads/2019/04/hollywoodpicutre19.jpg',
    'Hollywood sightseeing tour limousine',
    'occasions',
    'Hollywood Tours',
  ),
  img(
    '/images/wp-content/uploads/2023/03/concertpicture19.jpg',
    'Limo service for a concert night',
    'occasions',
    'Concert Nights',
  ),
  img(
    '/images/wp-content/uploads/2023/03/airportpicture19.jpg',
    'Airport pickup in a stretch limousine',
    'occasions',
    'Airport Pickup',
  ),
  img(
    '/images/wp-content/uploads/2026/09/wedding-guest-transportation-orange-county-1024x683.png',
    'Wedding guest transportation in Orange County',
    'occasions',
    'Wedding Guest Transport',
  ),
  img(
    '/images/wp-content/uploads/2026/09/graduation-party-bus-rental-orange-county-1024x683.png',
    'Graduation party bus rental in Orange County',
    'occasions',
    'Graduation Parties',
  ),
  img(
    '/images/wp-content/uploads/2026/09/disneyland-to-lax-transportation-1024x683.png',
    'Disneyland to LAX transportation',
    'occasions',
    'Disneyland ↔ LAX',
  ),
  img(
    '/images/wp-content/uploads/2026/06/temecula-wine-tour-from-orange-county-1024x683.png',
    'Private wine tour limousine in Temecula',
    'occasions',
    'Private Temecula Tour',
  ),

  // ---- interiors ----
  img(
    '/images/wp-content/uploads/2023/03/party-bus-interior--768x513.jpg',
    'Party bus interior with lounge seating and lighting',
    'interiors',
    'Party Bus Interior',
  ),
  img(
    '/images/wp-content/uploads/2018/05/party-bus-interior.jpg',
    'Party bus interior seating area',
    'interiors',
    'Lounge Interior',
  ),
  img(
    '/images/wp-content/uploads/2023/03/van-14-pass.jpg',
    'Fourteen passenger van interior',
    'interiors',
    '14 Passenger Interior',
  ),
  img(
    '/images/wp-content/uploads/2026/09/chatgpt-image-sep-22-2026-12_48_44-am.webp',
    'Limousine cabin detail with premium lighting',
    'interiors',
    'Cabin Detail',
  ),
  img(
    '/images/wp-content/uploads/2023/06/party-bus-picture-3.jpeg',
    'Party bus interior prepared for a group',
    'interiors',
    'Group Ready',
  ),
];

export default galleryImages;
