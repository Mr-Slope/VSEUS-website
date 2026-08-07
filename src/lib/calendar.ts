/**
 * The Economics Calendar — the public Google Calendar shared across the
 * economics clubs, embedded on the home page.
 *
 * The embed starts at the next upcoming event rather than at today, so the
 * frame is never empty. Google's ICS feed sends no CORS headers, so the
 * browser can't read it directly; instead
 * the feed is fetched and parsed at BUILD time and the resulting dates are
 * baked into the page. The client then picks the first one still in the
 * future, which keeps the embed correct as events pass without a rebuild.
 *
 * Adding events beyond the baked list needs a redeploy to show up in the
 * targeting — the calendar contents themselves are always live, since the
 * iframe loads from Google.
 */

export const CALENDAR_ID =
  'c_a1a5a1e97a97ce89a5d89cb665b287511c3d8a1dad2a5a9df1caf7be7457152e@group.calendar.google.com';

export const CALENDAR_TZ = 'America/Vancouver';

/**
 * Where the "Subscribe to Calendar" button goes — the calendar's public URL.
 *
 * Note the absence of `/u/0/`. That segment scopes the link to whichever
 * Google account is signed in as user 0, so a visitor either lands in the
 * wrong account's context or gets a sign-in prompt. The plain /calendar/embed
 * form is the one that works for everyone.
 */
export const CALENDAR_SUBSCRIBE_URL =
  'https://calendar.google.com/calendar/embed?src=c_a1a5a1e97a97ce89a5d89cb665b287511c3d8a1dad2a5a9df1caf7be7457152e%40group.calendar.google.com&ctz=America%2FVancouver';

const ICS_URL = `https://calendar.google.com/calendar/ical/${encodeURIComponent(
  CALENDAR_ID,
)}/public/basic.ics`;

/**
 * AGENDA lists the events themselves; WEEK draws an hour grid.
 *
 * Agenda is the deliberate choice. A week grid devotes most of its height to
 * empty morning hours, and Google's embed has no parameter for the starting
 * hour or scroll position — that's genuinely not configurable, and the grid
 * lives in a cross-origin iframe so it can't be scrolled from outside either.
 * Listing the events sidesteps the problem instead of fighting it, and reads
 * better in a frame this size than seven day-columns.
 *
 * Switch to 'WEEK' here if the grid is ever wanted back.
 */
const EMBED_MODE = 'AGENDA';

/** Build the iframe URL. `focusDate` is 'YYYY-MM-DD'; omit it to start from today. */
export function buildEmbedUrl(focusDate?: string): string {
  const params = new URLSearchParams({
    src: CALENDAR_ID,
    ctz: CALENDAR_TZ,
    mode: EMBED_MODE,
    bgcolor: '#F7F6F5',
    showTitle: '0',
    showPrint: '0',
    showTabs: '0',
    showCalendars: '0',
    showTz: '0',
  });

  if (focusDate) {
    // Google wants YYYYMMDD/YYYYMMDD. In agenda view this is where the list
    // starts; in week view it's the week the grid lands on.
    const compact = focusDate.replace(/-/g, '');
    params.set('dates', `${compact}/${compact}`);
  }

  return `https://calendar.google.com/calendar/embed?${params.toString()}`;
}

/**
 * Every event start date on the calendar from today onward, as 'YYYY-MM-DD',
 * ascending and de-duplicated.
 *
 * Runs at build time only. Returns [] if the feed can't be read, in which case
 * the embed falls back to starting from today rather than failing the build.
 */
export async function getUpcomingEventDates(): Promise<string[]> {
  let text: string;
  try {
    const res = await fetch(ICS_URL, { cache: 'force-cache' });
    if (!res.ok) throw new Error(`ICS responded ${res.status}`);
    text = await res.text();
  } catch (err) {
    console.warn('[calendar] could not read the ICS feed, starting the agenda from today:', err);
    return [];
  }

  // RFC 5545 folds long lines by starting the continuation with a space or tab.
  const unfolded = text.replace(/\r?\n[ \t]/g, '');

  const dates = new Set<string>();
  // Matches both 'DTSTART:20260921T170000Z' and 'DTSTART;VALUE=DATE:20260921'.
  for (const match of unfolded.matchAll(/^DTSTART[^:\r\n]*:(\d{8})/gm)) {
    const raw = match[1];
    dates.add(`${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`);
  }

  const today = new Date().toISOString().slice(0, 10);
  return [...dates].filter((d) => d >= today).sort();
}
