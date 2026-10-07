/**
 * Recognized clubs. Shown on /clubs, and referenced by id from an event's
 * `club` field in src/lib/events.ts to mark it as a club event on /events.
 * Descriptions are drawn from how each club describes itself.
 */
export interface Club {
  /** Short slug an event's `club` field points at, e.g. 'devec'. */
  id: string;
  name: string;
  fullName: string;
  description: string;
  href: string;
  linkLabel: string;
  /** Path under public/. Omit to show a placeholder. */
  logo?: string;
  instagram: string;
}

export const CLUBS: Club[] = [
  {
    id: 'devec',
    name: 'DEVEC',
    fullName: 'UBC Development Economics Club',
    description:
      'UBC’s only club bringing together students from every discipline to discuss the economic, social, and fiscal conditions of the developing world. Runs research deep-dives in partnership with the VSE, career pathways into development work, and events connecting students who care about poverty and growth.',
    href: 'https://ubcdevec.com',
    linkLabel: 'ubcdevec.com',
    logo: '/clubs/devec.jpg',
    instagram: 'devec.ubc',
  },
  {
    id: 'iona-journal',
    name: 'Iona Journal',
    fullName: 'IONA Journal of Economics',
    description:
      'The VSE’s undergraduate economics journal, publishing blind peer- and faculty-reviewed student research. Beyond the annual issue it runs IONA Exchange (a blog on global developments), IONA Reads (professor-curated resources), and IONA Asks (a podcast with faculty, alumni, and scholars).',
    href: 'https://www.ionajournal.ca',
    linkLabel: 'ionajournal.ca',
    logo: '/clubs/iona-journal.jpg',
    instagram: 'ionajournal',
  },
  {
    id: 'eps',
    name: 'EPS',
    fullName: 'Economic Theory & Philosophy Society',
    description:
      'Runs thought-provoking discussions and debates built around strategy and deduction games, plus social experiments rooted in game theory. Built on a supportive community of curious, open-minded people willing to challenge perspectives and think critically.',
    href: 'https://www.instagram.com/epsubc/',
    linkLabel: '@epsubc',
    logo: '/clubs/eps.png',
    instagram: 'epsubc',
  },
];

/** The club with this id, or undefined if there isn't one. */
export function getClub(id: string): Club | undefined {
  return CLUBS.find((club) => club.id === id);
}
