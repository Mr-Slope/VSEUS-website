/**
 * Reading the Vancouver Economic Review archive.
 *
 * Issues live in the `newsletters` table of the Review's Supabase project,
 * which the editorial team updates from the archive's editor (see editor.ts).
 * Publishing an issue is a row, not a deploy, so the list is fetched in the
 * browser rather than baked in at build time.
 *
 * Reads need no sign-in: the table's row level security policy is
 * "Newsletters are viewable by everyone", so the publishable anon key is
 * enough.
 */
import { getSupabase } from './supabase';
import { READER_PATH } from './content';
import { cleanCourses } from './courses';

export interface Issue {
  id: string;
  title: string;
  description: string;
  /**
   * Either a site-relative path under public/ for older issues, e.g.
   * "/newsletter_images/RBC.jpg", or the public Storage URL of a cover uploaded
   * through the editor. Null shows a placeholder.
   */
  image_path: string | null;
  /** Same two forms as image_path, e.g. "/newsletter_pdfs/July_11_2025.pdf". */
  pdf_path: string | null;
  /** The ECON courses the issue relates to, e.g. ["ECON 101", "ECON 302"], in course order. See courses.ts. */
  courses: string[];
  /** Who wrote the issue, for the reader's byline. Null leaves the byline at just the date. */
  author_name: string | null;
  /** What the author does, e.g. "Senior Director, CFIB". Only shown alongside a name. */
  author_role: string | null;
  /** Timestamp. Doubles as the publication date and the sort key. */
  created_at: string;
}

/** Thrown when the section has no Supabase configuration to talk to. */
export class NotConfiguredError extends Error {
  constructor() {
    super('The Economic Review archive is not configured.');
    this.name = 'NotConfiguredError';
  }
}

/**
 * How long to wait before giving up on the archive.
 *
 * Without a ceiling, a request that hangs rather than fails leaves the page
 * showing loading skeletons forever, which reads as a broken page with no way
 * out. Failing at a known point gets the reader an error they can act on and a
 * button to retry.
 */
const REQUEST_TIMEOUT_MS = 12_000;

const COLUMNS = 'id, title, description, image_path, pdf_path, courses, author_name, author_role, created_at';

/** Row ids are Postgres UUIDs. Anything else cannot match, so it is not worth a request. */
const ID_SHAPE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/*
  Titles and blurbs are typed into the Supabase dashboard by hand and some
  carry a stray trailing newline. Trimming here keeps that out of the layout
  rather than leaving every consumer to remember it. Courses get the same
  treatment, so the filter and the editor can compare lists directly. A blank
  author or role reads as none, so the byline never prints "By ,".
*/
function tidy(row: Issue): Issue {
  return {
    ...row,
    title: row.title?.trim() ?? '',
    description: row.description?.trim() ?? '',
    courses: cleanCourses(row.courses),
    author_name: row.author_name?.trim() || null,
    author_role: row.author_role?.trim() || null,
  };
}

/**
 * Published issues, newest first.
 *
 * Issues dated in the future are scheduled, not published, so they are
 * filtered out rather than shown early. The cutoff is read at call time so a
 * long-lived tab doesn't keep comparing against the moment it loaded.
 *
 * `includeScheduled` is for the editor, who needs to see a queued issue to fix
 * or withdraw it. It only widens what this page asks for: scheduled rows are
 * readable by anyone who queries the table directly, as they always were.
 */
export async function fetchIssues({ includeScheduled = false } = {}): Promise<Issue[]> {
  const supabase = getSupabase();
  if (!supabase) throw new NotConfiguredError();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    let query = supabase.from('newsletters').select(COLUMNS);
    if (!includeScheduled) query = query.lte('created_at', new Date().toISOString());

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .abortSignal(controller.signal);

    if (error) throw error;

    return (data ?? []).map((row) => tidy(row as Issue));
  } finally {
    clearTimeout(timer);
  }
}

/**
 * One issue by id, for the reader page. Null when there is no such issue, or
 * when it is scheduled and `includeScheduled` is off, so a reader holding the
 * link to a queued issue sees it as missing rather than early.
 */
export async function fetchIssue(id: string, { includeScheduled = false } = {}): Promise<Issue | null> {
  const supabase = getSupabase();
  if (!supabase) throw new NotConfiguredError();
  if (!ID_SHAPE.test(id)) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    let query = supabase.from('newsletters').select(COLUMNS).eq('id', id);
    if (!includeScheduled) query = query.lte('created_at', new Date().toISOString());

    const { data, error } = await query.abortSignal(controller.signal).maybeSingle();

    if (error) throw error;
    return data ? tidy(data as Issue) : null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Where an issue is read on the site.
 *
 * A query string rather than a path segment: under `output: "export"` every
 * path has to exist at build time, and issues are published as rows without a
 * deploy. One static page that reads the id in the browser covers them all.
 */
export function readerHref(issue: Pick<Issue, 'id'>): string {
  return `${READER_PATH}?issue=${encodeURIComponent(issue.id)}`;
}

/** True for an issue whose publication date has not arrived yet. */
export function isScheduled(issue: Pick<Issue, 'created_at'>): boolean {
  return new Date(issue.created_at).getTime() > Date.now();
}

/**
 * The publication date, formatted like the rest of the site.
 *
 * Pinned to Vancouver rather than to the reader's own timezone or to UTC.
 * `created_at` is the real moment an issue was published from campus, so the
 * date the newsletter calls itself is its Vancouver date. An issue published
 * at 18:05 on Friday 27 February is already 28 February in UTC, and would
 * read as Saturday the 28th to a reader in London. Pinning it keeps every
 * visitor seeing the date printed on the issue itself.
 */
export function formatIssueDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Vancouver',
  });
}

/**
 * A stored path made safe to put in an href or src.
 *
 * Many of the filenames carry spaces and parentheses, e.g.
 * "/newsletter_pdfs/Weekly Economics Gazette Newsletter (October 3, Friday).pdf".
 * Encoding beats renaming the files, which would strand every row that points
 * at the old name.
 *
 * encodeURI, not encodeURIComponent: the slashes are part of the path and have
 * to survive. Absolute URLs pass through unharmed for the same reason.
 */
export function assetUrl(path: string | null): string | null {
  if (!path) return null;
  return encodeURI(path);
}

/** An issue title reduced to lowercase letters, digits, and single hyphens. */
export function slugFor(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** A tidy filename for the downloaded PDF, derived from the issue title. */
export function downloadNameFor(title: string): string {
  return `${slugFor(title) || 'issue'}.pdf`;
}
