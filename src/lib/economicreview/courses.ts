/**
 * The UBC economics courses an issue relates to.
 *
 * Editors list them when they add or edit an issue, and readers filter the
 * archive by them. Each is stored in the `courses` column of `newsletters` as
 * "ECON 301": the subject, one space, the three-digit number, and an optional
 * letter suffix. The database refuses any other shape, see
 * supabase/migrations/20261001120000_newsletter_courses.sql in the
 * economicsgazette repository.
 */

/** The most courses one issue can list. The database holds the same limit. */
export const MAX_COURSES = 10;

/** A stored code, e.g. "ECON 301". */
const CODE = /^ECON \d{3}[A-Z]?$/;

/** A course number on its own, as left once any subject in front of it is dropped. */
const NUMBER = /^(\d{3})([a-z]?)$/i;

/*
  One token of what an editor typed, with any subject in front of it. Covers
  "301", "ECON 301", "econ301", "econ-301" (the archive's own URL form), and
  "ECON_V 301", as Workday writes UBC Vancouver courses. A subject typed with
  no number after it is left as a token of its own, so it is reported rather
  than silently dropped.
*/
const TOKEN = /(?:\becon(?:_[a-z])?[\s_-]*)?([^\s,;/]+)/gi;

/**
 * Every course in a piece of free text, plus anything in it that is not one.
 * Separators can be commas, semicolons, slashes, or spaces, so a pasted list
 * like "ECON 101, ECON 102" reads the same as "101 102".
 */
export function parseCourses(text: string): { courses: string[]; invalid: string[] } {
  const courses: string[] = [];
  const invalid: string[] = [];

  for (const [whole, token] of text.matchAll(TOKEN)) {
    const number = NUMBER.exec(token);
    if (number) courses.push(`ECON ${number[1]}${number[2].toUpperCase()}`);
    else invalid.push(whole.trim());
  }
  return { courses, invalid };
}

/** One course in any of the forms parseCourses() reads, as a stored code. Null for anything else. */
export function normalizeCourse(value: string): string | null {
  const { courses, invalid } = parseCourses(value);
  return courses.length === 1 && invalid.length === 0 ? courses[0] : null;
}

/** "ECON 301" as it appears in the archive's address: "econ-301". */
export function courseSlug(code: string): string {
  return code.toLowerCase().replace(' ', '-');
}

/**
 * A list of courses as stored: valid codes only, each once, in course order.
 *
 * Every code has the same subject and a fixed-width number, so plain string
 * order is course order, with "ECON 101A" just after "ECON 101".
 */
export function cleanCourses(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const codes = value.filter((code): code is string => typeof code === 'string' && CODE.test(code));
  return Array.from(new Set(codes)).sort();
}

/** Whether two cleaned lists name the same courses. */
export function sameCourses(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((code, i) => code === b[i]);
}

export type CourseInput = { ok: true; courses: string[] } | { ok: false; problem: string };

/**
 * The list with whatever the editor typed added to it, or a message saying
 * why it cannot be, written to show under the field. Typing nothing leaves
 * the list as it is.
 */
export function addCourses(current: string[], text: string): CourseInput {
  const { courses, invalid } = parseCourses(text);
  if (invalid.length > 0) {
    return { ok: false, problem: `"${invalid[0]}" is not an ECON course number. Type the number, such as 301.` };
  }

  const next = cleanCourses([...current, ...courses]);
  if (next.length > MAX_COURSES) {
    return { ok: false, problem: `An issue can list up to ${MAX_COURSES} courses.` };
  }
  return { ok: true, courses: next };
}
