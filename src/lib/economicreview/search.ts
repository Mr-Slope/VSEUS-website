/**
 * Narrowing the archive: a search over each issue's words, and a filter by
 * related course.
 *
 * Both run in the browser over the list the archive has already loaded. The
 * whole archive arrives in one request and is a few dozen rows, so filtering
 * it in place answers on every keystroke with no round trip and no search
 * index to keep in step.
 *
 * The search covers what the archive knows about an issue: its title,
 * summary, related courses, and date. The text inside the PDFs is not
 * searched, since reading it would mean downloading every issue.
 *
 * Both filters live in the archive's address as well, e.g.
 * /economicreview?q=housing&course=econ-301, so a filtered view can be shared
 * and survives a trip to the reader and back.
 */
import { courseSlug, normalizeCourse } from './courses';
import { formatIssueDate, type Issue } from './issues';

export interface ArchiveFilters {
  /** The search as typed. Trimmed and split into words when matching. */
  query: string;
  /** A stored course code such as "ECON 301", or null for every course. */
  course: string | null;
}

const QUERY_PARAM = 'q';
const COURSE_PARAM = 'course';

/** Long enough for any real search. Keeps a pasted essay out of the address bar. */
export const MAX_QUERY_LENGTH = 100;

/** Lowercased, with accents dropped, so "Quebec" finds "Québec" and the other way round. */
function fold(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function searchTerms(query: string): string[] {
  return fold(query).split(/\s+/).filter(Boolean);
}

/** Everything a search is matched against, folded the same way as the terms. */
function searchableText(issue: Issue): string {
  return fold(
    [
      issue.title,
      issue.description,
      formatIssueDate(issue.created_at),
      ...issue.courses,
      // "econ301" typed without the space still finds ECON 301.
      ...issue.courses.map((code) => code.replace(' ', '')),
    ].join('\n'),
  );
}

/** Whether any filter is narrowing the list. A query of only spaces is not. */
export function isFiltering(filters: ArchiveFilters): boolean {
  return filters.course !== null || searchTerms(filters.query).length > 0;
}

/**
 * The issues that pass both filters, in their original order.
 *
 * Every word of the search has to appear somewhere in the issue, in any
 * order, so adding a word narrows the list rather than widening it.
 */
export function filterIssues(issues: Issue[], filters: ArchiveFilters): Issue[] {
  const terms = searchTerms(filters.query);
  const { course } = filters;
  if (terms.length === 0 && course === null) return issues;

  return issues.filter((issue) => {
    if (course !== null && !issue.courses.includes(course)) return false;
    if (terms.length === 0) return true;
    const text = searchableText(issue);
    return terms.every((term) => text.includes(term));
  });
}

/** Every course listed by at least one of the issues, in course order. */
export function coursesIn(issues: Issue[]): string[] {
  return Array.from(new Set(issues.flatMap((issue) => issue.courses))).sort();
}

/** The filters in an address's query string. Anything unreadable is ignored rather than shown as an error. */
export function readFilters(params: Pick<URLSearchParams, 'get'>): ArchiveFilters {
  return {
    query: (params.get(QUERY_PARAM) ?? '').slice(0, MAX_QUERY_LENGTH),
    course: normalizeCourse(params.get(COURSE_PARAM) ?? ''),
  };
}

/**
 * A query string with the filters written into it, "" when nothing is left.
 * Other parameters, such as a campaign tag on a shared link, are kept.
 */
export function withFilters(search: string, filters: ArchiveFilters): string {
  const params = new URLSearchParams(search);

  const query = filters.query.trim();
  if (query) params.set(QUERY_PARAM, query);
  else params.delete(QUERY_PARAM);

  if (filters.course) params.set(COURSE_PARAM, courseSlug(filters.course));
  else params.delete(COURSE_PARAM);

  const next = params.toString();
  return next ? `?${next}` : '';
}

/** The archive showing only the issues related to one course. */
export function courseHref(course: string): string {
  return `/economicreview${withFilters('', { query: '', course })}`;
}
