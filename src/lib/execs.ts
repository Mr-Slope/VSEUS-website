/**
 * The VSEUS executive roster — single source for the About page and the
 * Contact page, so the two can't drift apart.
 *
 * TODO: replace the placeholder addresses with the real inboxes.
 * TODO: add a `photo` field pointing at public/exec/<name>.jpg once supplied.
 */
export interface Exec {
  name: string;
  role: string;
  email: string;
}

export const PRESIDENT: Exec = {
  name: 'Yash Dhaundiyal',
  role: 'President',
  email: 'president@vseus.ca',
};

/** Alphabetical by role. Drives both the Contact list and the About diagram. */
export const VPS: Exec[] = [
  { name: 'Grace Ding',          role: 'VP Academics',      email: 'academics@vseus.ca'      },
  { name: 'Saloni Karla',        role: 'VP Administration', email: 'administration@vseus.ca' },
  { name: 'Nokutenda Dzobo',     role: 'VP External',       email: 'external@vseus.ca'       },
  { name: 'Sebastian Contreras', role: 'VP Finance',        email: 'finance@vseus.ca'        },
  { name: 'Mishka Balraj',       role: 'VP Marketing',      email: 'marketing@vseus.ca'      },
  { name: 'Aiden Ng',            role: 'VP Student Life',   email: 'studentlife@vseus.ca'    },
];

export const EXECS: Exec[] = [PRESIDENT, ...VPS];

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
