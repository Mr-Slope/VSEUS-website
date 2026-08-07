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

export const VPS: Exec[] = [
  { name: 'Aiden Ng',            role: 'VP Student Life',   email: 'studentlife@vseus.ca' },
  { name: 'Mishka Balraj',       role: 'VP Marketing',      email: 'marketing@vseus.ca'   },
  { name: 'Sebastian Contreras', role: 'VP Finance',        email: 'finance@vseus.ca'     },
  { name: 'Saloni Karla',        role: 'VP Administration', email: 'administration@vseus.ca' },
  { name: 'Grace Ding',          role: 'VP Academics',      email: 'academics@vseus.ca'   },
  { name: 'Nokutenda Dzobo',     role: 'VP External',       email: 'external@vseus.ca'    },
];

export const EXECS: Exec[] = [PRESIDENT, ...VPS];
