import type { Event, PastEventPhoto } from '@/types/event';

/**
 * The public events list. Edit this file to add, change, or remove an event —
 * there is no database and no admin UI behind it.
 *
 * Set `registrationUrl` to a Google Form, Eventbrite page, or ticket store to
 * put a "Register" button on the card. Leave it off and the card is
 * information only. Past events should be deleted rather than left in place.
 */
export const UPCOMING_EVENTS: Event[] = [
  {
    id: 'evt-001',
    title: 'Economics Case Competition',
    description:
      'Compete in teams of 4 to analyze a real-world economic policy challenge. Cash prizes for top 3 teams. Open to all faculties; economics knowledge is helpful but not required.',
    date: '2026-05-10',
    time: '10:00 AM',
    location: 'Chan Centre for the Performing Arts, UBC Vancouver',
    isPaid: false,
    price: null,
    posterUrl: null,
    category: 'Competition',
  },
  {
    id: 'evt-002',
    title: 'Industry Networking Night',
    description:
      'Meet economists and analysts working across banking, consulting, and public policy. Bring your resume. Light refreshments provided. Dress business casual.',
    date: '2026-05-17',
    time: '6:00 PM',
    location: 'Downtown Vancouver — venue announced closer to the date',
    isPaid: false,
    price: null,
    posterUrl: null,
    category: 'Networking',
  },
  {
    id: 'evt-003',
    title: 'Annual VSEUS Gala',
    description:
      'Our flagship year-end gala celebrating student achievement in economics. Formal dinner, awards ceremony, and keynote speaker. Ticket price covers venue and catering.',
    date: '2026-05-30',
    time: '7:00 PM',
    location: 'Fairmont Hotel Vancouver, 900 W Georgia St, Vancouver',
    isPaid: true,
    price: 35,
    posterUrl: null,
    category: 'Social',
  },
  {
    id: 'evt-004',
    title: 'Research Skills Workshop',
    description:
      'A hands-on workshop covering economic research methodology, data sources (FRED, Statistics Canada, World Bank), and how to structure a policy brief. Certificates provided.',
    date: '2026-06-05',
    time: '2:00 PM',
    location: 'Buchanan Tower 1197, UBC Vancouver',
    isPaid: false,
    price: null,
    posterUrl: null,
    category: 'Workshop',
  },
  {
    id: 'evt-005',
    title: 'Summer Economics Symposium',
    description:
      'A half-day symposium featuring student paper presentations, faculty discussants, and a panel on careers in economics. Submit your paper by May 20th to present.',
    date: '2026-06-15',
    time: '9:00 AM',
    location: 'Life Sciences Centre, UBC Vancouver',
    isPaid: false,
    price: null,
    posterUrl: null,
    category: 'Academic',
  },
];

/**
 * Photos from events we've already run, shown in the gallery at the bottom of
 * /events.
 *
 * Add `image: '/events/<file>.jpg'` (file goes in public/events/) and the photo
 * renders. Leave `image` off and the tile shows a placeholder, so the gallery
 * can be laid out before the photos are gathered.
 */
export const PAST_EVENT_PHOTOS: PastEventPhoto[] = [
  { title: 'Annual VSEUS Gala',           when: '2025' },
  { title: 'Economics Case Competition',  when: '2025' },
  { title: 'Industry Networking Night',   when: '2025' },
  { title: 'Welcome Back Social',         when: '2025' },
  { title: 'Research Skills Workshop',    when: '2025' },
  { title: 'End of Term Mixer',           when: '2025' },
];
