/** Primary navigation — mirrors the original header (all local routes). */

export interface NavLink {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href?: string;
  children?: NavLink[];
}

export const mainNav: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Services',
    children: [
      { label: 'Wedding Limo Rental', href: '/services/wedding-limo-service/' },
      { label: 'Bachelor Party Limo Rental', href: '/services/bachelor-party-limo-service/' },
      { label: 'Quinceanera Limo Rental', href: '/services/quinceanera-limo-service/' },
      { label: 'Airport Transportation', href: '/services/airport-limo-service/' },
      { label: 'Prom Limo Rental', href: '/services/prom-limo-service/' },
      { label: 'Wine Tour Limo Rental', href: '/services/wine-tour-limo-service/' },
      { label: 'Hollywood Tour', href: '/services/hollywood-tour-limo-service/' },
      { label: 'Concerts Limo & Party Bus', href: '/services/concerts-limo-party-bus-service/' },
      { label: '50 Passenger Party Bus', href: '/services/large-50-passenger-party-bus-service/' },
      { label: 'Birthday Limo & Party Bus', href: '/services/birthday-limo-party-bus-service/' },
    ],
  },
  {
    label: 'Limos',
    children: [
      { label: 'Escalade Limo Rental', href: '/fleet/cadillac-escalade-limo/' },
      { label: 'Hummer Limo Rental', href: '/fleet/hummer-limo-rental/' },
      { label: 'Party Bus Rental', href: '/services/party-bus-rental/' },
      { label: 'Chrysler 300 Limo Rental', href: '/fleet/chrysler-300-limo-rental/' },
      { label: 'Mercedes Sprinter Limo Bus', href: '/fleet/mercedes-sprinter-limo-bus/' },
      { label: 'Luxury SUV Service', href: '/luxury-suv-service/' },
      { label: 'Stretch Limo Rental', href: '/fleet/stretch-suv-limo-rentals/' },
    ],
  },
  { label: 'About Us', href: '/about-us/' },
  { label: 'Gallery', href: '/gallery/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Cities', href: '/cities/' },
  { label: 'Contact', href: '/contact/' },
];

/** Top-of-page scrolling offer marquee. */
export const offerStrip = [
  { icon: 'calendar', text: 'Lock In Your Free Hour!' },
  { icon: 'cup', text: 'Chilled Sodas & Refreshments' },
  { icon: 'star', text: 'VIP Red Carpet Service' },
  { icon: 'gift', text: 'Custom Birthday Decorations' },
];
