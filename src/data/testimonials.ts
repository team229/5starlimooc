/** Google reviews shown on the homepage (captured from the original site). */

export interface Review {
  name: string;
  avatar: string;
  stars: number;
  text: string;
  source: string;
}

export const reviews: Review[] = [
  {
    name: 'Cynthia Phan',
    avatar: '/images/ext/avatar-cynthia-phan.png',
    stars: 5,
    source: 'Google',
    text: 'bus service was overall great, it was clean and stocked as they said it would be but the customer service was lacking a bit as they forgot about something months after my service date. thankfully it was resolved quickly once i reached out to them :)',
  },
  {
    name: 'Brandy Hesskamp',
    avatar: '/images/ext/avatar-brandy-hesskamp.png',
    stars: 5,
    source: 'Google',
    text: "I would recommend 5 Star Limousin to everyone. They were very professional, kind, quick response and helped us get a Limousin for our Sons prom. Their driver was awesome as well. He went over everything in the limo with our group, and made it a great night for them all. Thank you guys so much. We'll definitely be using you again.",
  },
  {
    name: '6 Palms Management',
    avatar: '/images/ext/avatar-6-palms-management.png',
    stars: 5,
    source: 'Google',
    text: 'Great experience. On time and extremely professional. We left something in the car and they were quick to help us get it back. I highly recommend.',
  },
];

export const ratingSummary = {
  label: 'EXCELLENT',
  rating: '4.5',
  total: 32,
  source: 'Google',
};

export default reviews;
