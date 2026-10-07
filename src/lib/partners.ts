/**
 * Organizations other than recognized clubs whose events VSEUS lists, such as
 * the Career Centre. Referenced by id from an event's `partner` field in
 * src/lib/events.ts to mark it as a partner event on /events.
 */
export interface Partner {
  /** Short slug an event's `partner` field points at, e.g. 'career-centre'. */
  id: string;
  name: string;
  /** Link out from the event card. Omit and the name renders as plain text. */
  href?: string;
  /** Path under public/. Omit and the card shows a generic building icon. */
  logo?: string;
}

export const PARTNERS: Partner[] = [
  {
    id: 'career-centre',
    name: 'Career Centre',
  },
];

/** The partner with this id, or undefined if there isn't one. */
export function getPartner(id: string): Partner | undefined {
  return PARTNERS.find((partner) => partner.id === id);
}
