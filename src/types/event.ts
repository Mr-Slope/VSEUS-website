/** One photo in the past-events gallery at the bottom of /events. */
export interface PastEventPhoto {
  /** Caption shown under the photo. */
  title: string;
  /** Path under public/, e.g. '/events/gala-2025.jpg'. Omit to show a placeholder. */
  image?: string;
  /** Optional year or date line under the title. */
  when?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  /** 'YYYY-MM-DD' */
  date: string;
  /** Display string, e.g. '6:00 PM' */
  time: string;
  location: string;
  isPaid: boolean;
  price: number | null;
  posterUrl: string | null;
  category: string;
  /**
   * External registration link — a Google Form, Eventbrite page, or ticket
   * store. Omit it and the card renders as information only, with no button.
   */
  registrationUrl?: string;
}
