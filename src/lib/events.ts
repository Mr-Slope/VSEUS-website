import type { Event, PastEventPhoto } from '@/types/event';

/**
 * The public events list. Edit this file to add, change, or remove an event —
 * there is no database and no admin UI behind it.
 *
 * Set `registrationUrl` to a Google Form, Eventbrite page, or ticket store to
 * put a "Register" button on the card. Leave it off and the card is
 * information only.
 *
 * Leave an event here once its date passes. `getUpcomingEvents()` and
 * `getPastEvents()` below split the list by today's date automatically, so a
 * finished event drops off the upcoming section and reappears in the archived
 * section on /events on its own, with no manual deletion step.
 *
 * Set `series` to group events into a shared calendar strip, e.g. 'Econ
 * Week'. Events without a `series` render in the standalone section above it.
 */
export const UPCOMING_EVENTS: Event[] = [
  {
    id: 'evt-pre-n-pit',
    title: 'AUS x VSEUS x MUSA Pre n’ Pit',
    description:
      'Pregame at the Arts Student Centre with AUS and MUSA, then head to The Pit together. Tickets run $3.10 to $7.32 CAD.',
    date: '2026-09-09',
    time: '7:30 PM to 10:00 PM PT',
    location: 'Arts Student Centre, 1860 East Mall, UBC Vancouver',
    isPaid: true,
    price: null,
    posterUrl: null,
    category: 'Social',
    registrationUrl: 'https://www.showpass.com/prenpit2026/',
  },
  {
    id: 'evt-ew-beach-day',
    title: 'Beach Day',
    description:
      'A low-key start to Econ Week: sand, sun, and no agenda beyond showing up and meeting people before the week gets busy.',
    date: '2026-09-27',
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
    registrationUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeL5K84HdlMl_vISqfboPTvIu75-pPR9_yDS5y9aBLmImB-7w/viewform',
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
    registrationUrl: 'https://forms.gle/HrQABzh2hU9wSLaD6',
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
    registrationUrl: 'https://forms.gle/5MGsdydYTHPr94bd7',
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
    registrationUrl: 'https://www.showpass.com/vseus-annual-blue-day',
  },
];

/** Today's date as 'YYYY-MM-DD', recomputed on every call. */
function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Events from UPCOMING_EVENTS whose date hasn't passed yet. Use this, not
 * UPCOMING_EVENTS directly, anywhere upcoming events are listed, so an event
 * drops off on its own the day after it happens.
 */
export function getUpcomingEvents(): Event[] {
  const today = todayIso();
  return UPCOMING_EVENTS.filter((event) => event.date >= today);
}

/**
 * Events from UPCOMING_EVENTS whose date has passed, most recent first. Feeds
 * the archived section on /events so a finished event moves there
 * automatically instead of vanishing outright.
 */
export function getPastEvents(): Event[] {
  const today = todayIso();
  return UPCOMING_EVENTS.filter((event) => event.date < today).sort((a, b) =>
    b.date.localeCompare(a.date),
  );
}

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
  { title: 'Christmas Social',            when: '2025', image: '/photos/Events/christmas-social.jpg' },
];
