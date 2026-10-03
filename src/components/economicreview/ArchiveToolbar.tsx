'use client';

import React, { useId } from 'react';
import { MAX_QUERY_LENGTH } from '@/lib/economicreview/search';

/*
  16px text, not the 14px of the editor's fields: iOS zooms the page into any
  input set smaller than that, and this one is for every reader on a phone.
  WebKit draws its own clear button inside a search input, which would sit
  beside ours, so it is hidden.
*/
const SEARCH_FIELD = [
  'w-full rounded-xl border border-ice-400 bg-offwhite pl-11 pr-11 py-3 text-base text-midnight',
  'placeholder:text-muted/80 outline-none transition-all duration-150',
  'focus:border-blue focus:ring-2 focus:ring-blue/25',
  '[&::-webkit-search-cancel-button]:appearance-none',
].join(' ');

const PLACEHOLDER = 'Search by title, topic, or course';

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-700"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

/** The search box's footprint, for the static HTML before the archive hydrates. */
export function ArchiveToolbarSkeleton() {
  return (
    <div aria-hidden="true" className="mb-8">
      <div className="relative max-w-xl">
        <SearchIcon />
        <div className={`${SEARCH_FIELD} text-muted/80 select-none`}>{PLACEHOLDER}</div>
      </div>
    </div>
  );
}

interface ArchiveToolbarProps {
  query: string;
  onQueryChange: (query: string) => void;
  /** The courses to offer. Empty hides the row, as before any issue lists one. */
  courses: string[];
  /** The course being shown, or null for all of them. */
  course: string | null;
  onCourseChange: (course: string | null) => void;
  /** How many issues pass the filters, out of how many. Null until the list has loaded. */
  count: { shown: number; total: number } | null;
  filtering: boolean;
  onClear: () => void;
}

/**
 * The controls at the top of the archive: a search box, a row of courses to
 * filter by, and how many issues are showing.
 *
 * The search box works from the moment the page hydrates, even while the list
 * is still loading, so a reader who starts typing straight away is not held
 * up. The course row appears once the list is in, since the courses are read
 * from the issues themselves rather than from a fixed list.
 */
export function ArchiveToolbar({
  query,
  onQueryChange,
  courses,
  course,
  onCourseChange,
  count,
  filtering,
  onClear,
}: ArchiveToolbarProps) {
  const id = useId();

  return (
    <div className="mb-8 flex flex-col gap-4">
      <div role="search" className="relative max-w-xl">
        <label htmlFor={`${id}-search`} className="sr-only">
          Search issues
        </label>
        <SearchIcon />
        <input
          id={`${id}-search`}
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          maxLength={MAX_QUERY_LENGTH}
          placeholder={PLACEHOLDER}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={(e) => {
            // Chrome and Safari clear a search box on Escape by themselves. Firefox does not.
            if (e.key === 'Escape' && query) {
              e.preventDefault();
              onQueryChange('');
            }
          }}
          className={SEARCH_FIELD}
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange('')}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-midnight-700 hover:bg-ice transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
          >
            <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {courses.length > 0 && (
        <div role="group" aria-labelledby={`${id}-courses`} className="flex flex-wrap items-center gap-2">
          <span
            id={`${id}-courses`}
            className="font-display text-xs font-semibold uppercase tracking-widest text-midnight-700 mr-1"
          >
            Courses
          </span>
          <CourseChip pressed={course === null} onClick={() => onCourseChange(null)}>
            All courses
          </CourseChip>
          {courses.map((code) => (
            <CourseChip key={code} pressed={course === code} onClick={() => onCourseChange(course === code ? null : code)}>
              {code}
            </CourseChip>
          ))}
        </div>
      )}

      {count && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p role="status" className="text-sm text-muted">
            {filtering
              ? `${count.shown} of ${count.total} ${count.total === 1 ? 'issue' : 'issues'}`
              : `${count.total} ${count.total === 1 ? 'issue' : 'issues'}`}
          </p>
          {filtering && (
            <button
              type="button"
              onClick={onClear}
              className="text-sm font-semibold text-midnight underline decoration-accent decoration-2 underline-offset-2 hover:text-midnight-700 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-ice"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/** One course in the filter row. Pressing the course already shown goes back to all of them. */
function CourseChip({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={[
        'font-display text-xs font-semibold px-3.5 py-2 rounded-full border transition-colors btn-press',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-ice',
        pressed
          ? 'bg-midnight-700 border-midnight-700 text-offwhite'
          : 'bg-offwhite border-ice-400 text-midnight hover:border-midnight-700',
      ].join(' ')}
    >
      {children}
    </button>
  );
}
