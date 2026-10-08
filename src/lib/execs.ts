/**
 * The VSEUS executive roster — single source for the About page and the
 * Contact page, so the two can't drift apart.
 *
 * TODO: replace the placeholder addresses with the real inboxes.
 * TODO: add the remaining `photo` fields once those headshots are supplied.
 */
export interface Exec {
  name: string;
  role: string;
  email: string;
  /** Path under public/, e.g. "/exec/grace-ding.jpg". Omit to show the placeholder. */
  photo?: string;
  /** CSS object-position for the photo, e.g. "center 30%". Omit to default to "center". */
  photoPosition?: string;
  /** Full LinkedIn profile URL. Omit and the About page shows no LinkedIn button. */
  linkedin?: string;
}

/** A VP, optionally with the Assistant VPs who report to them. */
export interface VPExec extends Exec {
  avps?: Exec[];
}

export const PRESIDENT: Exec = {
  name: 'Yash Dhaundiyal',
  role: 'President',
  email: 'president@vseus.ca',
  photo: '/exec/yash-dhaundiyal.jpg',
  linkedin: 'https://www.linkedin.com/in/yash-dhaundiyal/',
};

/** Alphabetical by role. Drives both the Contact list and the About diagram. */
export const VPS: VPExec[] = [
  {
    name: 'Grace Ding',                  role: 'VP Academic',       email: 'academic@vseus.ca',  photo: '/exec/grace-ding.jpg',
    linkedin: 'https://www.linkedin.com/in/grace-ding-edu/',
    avps: [
      { name: 'Ciara Egalahewa', role: 'Assistant VP Academic', email: 'avp.academic@vseus.ca', photo: '/exec/ciara-egalahewa.jpg', linkedin: 'https://www.linkedin.com/in/ciara-egalahewa-291b73236/' },
    ],
  },
  {
    name: 'Saloni Snehal Karia',         role: 'VP Administration', email: 'admin@vseus.ca',     photo: '/exec/saloni-karia.jpg',
    linkedin: 'https://www.linkedin.com/in/saloni-karia/',
    avps: [
      { name: 'Niels Cook', role: 'Assistant VP Administration', email: 'avp.admin@vseus.ca', photo: '/exec/niels-cook.jpg', photoPosition: 'center 40%', linkedin: 'https://www.linkedin.com/in/niels-cook/' },
    ],
  },
  {
    name: 'Nokutenda Dzobo',             role: 'VP External',       email: 'external@vseus.ca',  photo: '/exec/nokutenda-dzobo.jpg',
    linkedin: 'https://www.linkedin.com/in/nokutenda-dzobo-2a687b207/',
    avps: [
      { name: 'Daniel Li', role: 'Assistant VP External', email: 'avp.external@vseus.ca', photo: '/exec/daniel-li.png', linkedin: 'https://www.linkedin.com/in/daniel-li-03-2026-ubc/' },
    ],
  },
  {
    name: 'Sebastian Contreras Alfaro',  role: 'VP Finance',        email: 'finance@vseus.ca',    photo: '/exec/sebastian-contreras.jpg',
    linkedin: 'https://www.linkedin.com/in/sebastian-contralf/',
    avps: [
      { name: 'Ilan Shapiro', role: 'Assistant VP Finance', email: 'avp.finance@vseus.ca', photo: '/exec/ilan-shapiro.png', linkedin: 'https://www.linkedin.com/in/ilan-shapiro-8b5730241/' },
    ],
  },
  {
    name: 'Mishka Balraj',               role: 'VP Marketing',      email: 'marketing@vseus.ca', photo: '/exec/mishka-balraj.jpg', photoPosition: 'center 25%',
    linkedin: 'https://www.linkedin.com/in/mishka-balraj-054aa7293/',
    avps: [
      { name: 'Marina Pelletier', role: 'Assistant VP Marketing', email: 'avp.marketing@vseus.ca', photo: '/exec/marina-pelletier.jpg', linkedin: 'https://www.linkedin.com/in/marina-pelletier-96643b24a/' },
      { name: 'Gaureka Khurana',  role: 'Assistant VP Marketing', email: 'avp.marketing@vseus.ca', photo: '/exec/gaureka-khurana.jpg', photoPosition: 'center 20%', linkedin: 'https://www.linkedin.com/in/gaureka-khurana/' },
    ],
  },
  {
    name: 'Aiden Ng',                    role: 'VP Student Life',   email: 'studentlife@vseus.ca', photo: '/exec/aiden-ng.jpg',
    linkedin: 'https://www.linkedin.com/in/aidenng273/',
    avps: [
      { name: 'Dorine Benedict', role: 'Assistant VP Student Life', email: 'avp.studentlife@vseus.ca', photo: '/exec/dorine-benedict.jpg', linkedin: 'https://www.linkedin.com/in/dorinebenedict/' },
    ],
  },
];

/** President, then each VP immediately followed by their AVPs, if any. */
export const EXECS: Exec[] = [PRESIDENT, ...VPS.flatMap((vp) => [vp, ...(vp.avps ?? [])])];

function emailFor(role: string): string {
  const exec = EXECS.find((e) => e.role === role);
  if (!exec) throw new Error(`No exec with the role "${role}"`);
  return exec.email;
}

/**
 * Where the contact form goes, now that there's no general inbox.
 *
 * Derived from the roster above rather than written out again, so changing an
 * address in one place can't leave the form pointing at a dead one.
 */
export const CONTACT_FORM_TO = emailFor('VP Marketing');
export const CONTACT_FORM_CC = [emailFor('President'), emailFor('VP Administration')];
