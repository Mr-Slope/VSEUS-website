import type { Event, PastEventPhoto } from '@/types/event';

/**
 * Bounce registration link, shared by the Econ Week banner and Pre-n-Pit's
 * ticket button. This is a placeholder — replace it with the real Bounce
 * event link once it exists, then remove this comment.
 */
export const BOUNCE_URL = 'https://bounce.app/vseus';

/**
 * The public events list. Edit this file to add, change, or remove an event —
 * there is no database and no admin UI behind it.
 *
 * Set `registrationUrl` to a Google Form, Eventbrite page, or ticket store to
 * put a "Register" button on the card. Leave it off and the card is
 * information only. Past events should be deleted rather than left in place.
 *
 * Set `series` to group events into a shared calendar strip, e.g. 'Econ
 * Week'. Events without a `series` render in the standalone section above it.
 */
export const UPCOMING_EVENTS: Event[] = [
  {
    id: 'evt-pre-n-pit',
    title: 'Pre-n-Pit',
    description:
      'Pregame in the Arts Student Centre, then head to The Pit together. Tickets are cheap and cover drinks.',
    date: '2026-09-08',
    time: 'Time TBA',
    location: 'Arts Student Centre, then The Pit Pub, UBC Vancouver',
    isPaid: true,
    price: null,
    posterUrl: null,
    category: 'Social',
    ticketsAvailableSoon: true,
  },
  {
    id: 'evt-ew-beach-day',
    title: 'Beach Day',
    description:
      'A low-key start to Econ Week: sand, sun, and no agenda beyond showing up and meeting people before the week gets busy.',
    date: '2026-09-20',
    time: 'Time TBA',
    location: 'Location TBA',
    isPaid: false,
    price: null,
    posterUrl: null,
    category: 'Social',
    series: 'Econ Week',
  },
  {
    id: 'evt-ew-pin-ceremony',
    title: 'Pin Ceremony',
    description:
      'First-year students receive their official Econ pin: the start of a tradition that marks you as part of this program, not just enrolled in it.',
    date: '2026-09-21',
    time: 'Time TBA',
    location: 'Great Hall South, UBC Vancouver',
    isPaid: false,
    price: null,
    posterUrl: null,
    category: 'Ceremony',
    series: 'Econ Week',
  },
  {
    id: 'evt-ew-agora-kickoff',
    title: 'Agora Mentor Program Kickoff',
    description:
      'The Agora mentor program pairs upper-year students with first-years for guidance on courses, co-op, and everything the calendar doesn’t tell you. Come meet your mentor or mentee.',
    date: '2026-09-22',
    time: 'Time TBA',
    location: 'Location TBA',
    isPaid: false,
    price: null,
    posterUrl: null,
    category: 'Mentorship',
    series: 'Econ Week',
  },
  {
    id: 'evt-ew-fun-run',
    title: 'Econ Finance Fun Run',
    description:
      'A casual run around the Iona loop. All fitness levels welcome, all faculties welcome: you don’t need to be in Econ to join.',
    date: '2026-09-23',
    time: 'Time TBA',
    location: 'Iona Loop, UBC Vancouver',
    isPaid: false,
    price: null,
    posterUrl: null,
    category: 'Fitness',
    series: 'Econ Week',
  },
  {
    id: 'evt-ew-linkedin-photoshoot',
    title: 'LinkedIn Photoshoot',
    description:
      'Free professional headshots for your LinkedIn, resume, and everything after graduation. Two sessions to choose from, drop in for either.',
    date: '2026-09-23',
    time: '9:00 AM & 2:00 PM',
    location: 'Location TBA',
    isPaid: false,
    price: null,
    posterUrl: null,
    category: 'Career',
    series: 'Econ Week',
  },
  {
    id: 'evt-ew-professor-roundtable',
    title: 'Professor Round Table',
    description:
      'Sit down with faculty in a small-group, informal setting. Ask about research, course design, or anything you wouldn’t normally ask in office hours.',
    date: '2026-09-24',
    time: 'Time TBA',
    location: 'Location TBA',
    isPaid: false,
    price: null,
    posterUrl: null,
    category: 'Academic',
    series: 'Econ Week',
  },
  {
    id: 'evt-ew-brew-your-success',
    title: 'Brew Your Success',
    description:
      'A relaxed networking night pairing good coffee with real conversations about careers in economics.',
    date: '2026-09-25',
    time: 'Time TBA',
    location: 'Location TBA',
    isPaid: false,
    price: null,
    posterUrl: null,
    category: 'Networking',
    series: 'Econ Week',
  },
  {
    id: 'evt-ew-blue-day',
    title: 'Blue Day',
    description:
      'A scavenger hunt across campus followed by a fancy dinner, reserved for BIE first-year students. Econ Week’s flagship close.',
    date: '2026-09-26',
    time: 'Time TBA',
    location: 'Location TBA',
    isPaid: true,
    price: null,
    posterUrl: null,
    category: 'Social',
    series: 'Econ Week',
    ticketsAvailableSoon: true,
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
  { title: 'Annual VSEUS Gala',           when: '2025', image: '/photos/Events/annual-vseus-gala-2025.jpg' },
  { title: 'Networking Event',            when: '2025', image: '/photos/Events/networking-event.jpg' },
  { title: 'Blue Day 2024',               when: '2024', image: '/photos/Events/blue-day-group-photo.jpg' },
  { title: 'End of Term Mixer',           when: '2025', image: '/photos/Events/end-of-term-mixer.jpg' },
  { title: 'Economics Panel',             when: '2025', image: '/photos/Events/economics-panel.jpg' },
  { title: 'Coming Soon' },
];
