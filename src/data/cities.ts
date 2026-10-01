/** Service-area city links (all local routes). */

export interface City {
  label: string;
  href: string;
}

const route = (slug: string) => `/limo-party-bus-rentals-service-${slug}-ca/`;

export const cities: City[] = [
  { label: 'Fullerton', href: route('fullerton') },
  { label: 'Aliso Viejo', href: route('aliso-viejo') },
  { label: 'Anaheim', href: route('anaheim') },
  { label: 'Brea', href: route('brea') },
  { label: 'Buena Park', href: route('buena-park') },
  { label: 'Costa Mesa', href: route('costa-mesa') },
  { label: 'Cypress', href: route('cypress') },
  { label: 'Dana Point', href: route('dana-point') },
  { label: 'Garden Grove', href: route('garden-grove') },
  { label: 'Huntington Beach', href: route('huntington-beach') },
  { label: 'Irvine', href: route('irvine') },
  { label: 'La Habra', href: route('la-habra') },
  { label: 'Los Angeles', href: route('los-angeles') },
  { label: 'La Palma', href: route('la-palma') },
  { label: 'Laguna Beach', href: route('laguna-beach') },
  { label: 'Laguna Niguel', href: route('laguna-niguel') },
  { label: 'Laguna Woods', href: route('laguna-woods') },
  { label: 'Lake Forest', href: route('lake-forest') },
  { label: 'Los Alamitos', href: route('los-alamitos') },
  { label: 'Newport Beach', href: route('newport-beach') },
  { label: 'Orange County', href: '/' },
  { label: 'Orange', href: route('orange') },
  { label: 'Placentia', href: route('placentia') },
  { label: 'Rancho Santa Margarita', href: route('rancho-santa-margarita') },
  { label: 'Riverside', href: route('riverside') },
  { label: 'San Bernardino', href: route('san-bernardino') },
  { label: 'San Fernando', href: route('san-fernando') },
  { label: 'San Clemente', href: route('san-clemente') },
  { label: 'San Juan Capistrano', href: route('san-juan-capistrano') },
  { label: 'Santa Ana', href: route('santa-ana') },
  { label: 'Seal Beach', href: route('seal-beach') },
  { label: 'Stanton', href: route('stanton') },
  { label: 'Tustin', href: route('tustin') },
  { label: 'Villa Park', href: route('villa-park') },
  { label: 'Westminster', href: route('westminster') },
  { label: 'Yorba Linda', href: route('yorba-linda') },
];

export default cities;
