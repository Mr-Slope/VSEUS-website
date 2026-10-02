'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { IssueCard } from './IssueCard';
import { IssueCardSkeleton } from './IssueCardSkeleton';
import { ArchiveToolbar, ArchiveToolbarSkeleton } from './ArchiveToolbar';
import { fetchIssues, NotConfiguredError, type Issue } from '@/lib/economicreview/issues';
import {
  coursesIn,
  filterIssues,
  isFiltering,
  readFilters,
  withFilters,
  type ArchiveFilters,
} from '@/lib/economicreview/search';
import { PUBLICATION } from '@/lib/economicreview/content';

/**
 * The issue archive: one of the two places on the site that load data at
 * runtime. The other is IssueReader, which fetches the single issue a card
 * opens.
 *
 * Everything else is prerendered at build time and ships as static HTML. Here
 * the fetch runs in the browser after hydration, so the editorial team can
 * publish an issue by adding a row rather than by triggering a deploy. That
 * keeps the rest of the site a plain static export with no server, no API
 * route, and no build-time database dependency.
 *
 * The states stay visually distinct on purpose. An archive that failed to
 * load must never be mistakable for an archive with nothing in it: one is a
 * problem to report, the other is simply the truth. Likewise a search that
 * matches nothing says so and offers a way back, rather than looking like an
 * empty archive.
 *
 * Above the grid sit the search box and the course filter, see
 * ArchiveToolbar and lib/economicreview/search.ts.
 *
 * Reading the address means this renders only in the browser, so it has to
 * sit inside a Suspense boundary; EditableArchive provides one, with
 * IssueArchiveSkeleton as what the static HTML carries.
 *
 * Readers render it with no props. EditableArchive passes the editor's props
 * while it is unlocked.
 */

const SKELETON_COUNT = 6;

/** How long typing has to pause before the address catches up. */
const ADDRESS_DELAY_MS = 300;

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: SKELETON_COUNT }, (_, i) => (
        <IssueCardSkeleton key={i} />
      ))}
      <span className="sr-only" role="status">
        Loading issues
      </span>
    </div>
  );
}

/** The archive before it has hydrated: the search box's outline over loading cards. */
export function IssueArchiveSkeleton() {
  return (
    <div>
      <ArchiveToolbarSkeleton />
      <SkeletonGrid />
    </div>
  );
}

interface IssueArchiveProps {
  /** List scheduled issues too. Only the editor asks for this. */
  includeScheduled?: boolean;
  /** Bumped after every edit, to fetch the list again without a loading flash. */
  revision?: number;
  onEdit?: (issue: Issue) => void;
  onDelete?: (issue: Issue) => void;
}

type State =
  | { kind: 'loading' }
  | { kind: 'ready'; issues: Issue[] }
  | { kind: 'error'; configured: boolean };

/** Shared shell for the three non-grid states. */
function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-offwhite border border-ice-400 rounded-2xl p-12 text-center max-w-xl mx-auto">
      {children}
    </div>
  );
}

export function IssueArchive({ includeScheduled = false, revision = 0, onEdit, onDelete }: IssueArchiveProps) {
  const [state, setState] = useState<State>({ kind: 'loading' });

  /*
    The filters start from the address, so a shared link or the back button
    from the reader opens the archive as it was left. From then on the filters
    lead and the address follows. Not the other way round: Next applies a
    history change in a transition, so a search box driven by useSearchParams
    would trail the keyboard and could drop keystrokes.
  */
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<ArchiveFilters>(() => readFilters(searchParams));

  /*
    Mirrored with replaceState, not pushState: narrowing the list is not a
    place the back button should step through. The write waits for a pause in
    typing, since Safari refuses more than 100 history changes in 10 seconds.
    Leaving the page cancels a write still waiting, which would otherwise land
    on the next page's address.
  */
  useEffect(() => {
    const { pathname, search, hash } = window.location;
    const next = withFilters(search, filters);
    if (next === search) return;

    const timer = setTimeout(() => {
      window.history.replaceState(null, '', `${pathname}${next}${hash}`);
    }, ADDRESS_DELAY_MS);
    return () => clearTimeout(timer);
  }, [filters]);

  const clearFilters = useCallback(() => setFilters({ query: '', course: null }), []);

  /*
    Retrying is modelled as a new attempt rather than as a second code path.
    Bumping `attempt` re-runs the effect, and React tears down the previous run
    first, so an earlier response can never land after a later one and
    overwrite it. That covers both unmounting mid-flight and an impatient
    double click on "Try again".

    An edit refreshes the same way through `revision`, and unlocking or locking
    the editor through `includeScheduled`. Neither goes back to the skeletons:
    the current grid stays up until the new list replaces it.
  */
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetchIssues({ includeScheduled })
      .then((issues) => {
        if (!cancelled) setState({ kind: 'ready', issues });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setState({ kind: 'error', configured: !(error instanceof NotConfiguredError) });
      });

    return () => {
      cancelled = true;
    };
  }, [attempt, includeScheduled, revision]);

  const retry = useCallback(() => {
    setState({ kind: 'loading' });
    setAttempt((n) => n + 1);
  }, []);

  if (state.kind === 'error') {
    return (
      <Panel>
        <svg
          className="w-12 h-12 mx-auto mb-4 text-accent-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.25}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
        <h3 className="text-xl font-bold text-midnight mb-2">We could not load the archive</h3>
        <p className="text-muted text-sm leading-relaxed">
          {state.configured
            ? 'The issue list did not come back. This is on our side, not yours.'
            : 'The archive is not configured on this build.'}{' '}
          Try again in a moment, or email{' '}
          <a
            href={`mailto:${PUBLICATION.email}`}
            className="text-midnight font-semibold underline decoration-accent decoration-2 underline-offset-2"
          >
            {PUBLICATION.email}
          </a>{' '}
          and we will send you the issue you are after.
        </p>
        {state.configured && (
          <button
            type="button"
            onClick={retry}
            className="mt-6 inline-flex items-center gap-2 bg-midnight-700 text-offwhite font-display font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-midnight transition-colors btn-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-offwhite"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992V4.356m-4.993 4.992l3.181-3.183a8.25 8.25 0 00-13.803 3.7M4.031 9.865v4.992m0 0h4.992m-4.992 0l3.181 3.183a8.25 8.25 0 0013.803-3.7"
              />
            </svg>
            Try again
          </button>
        )}
      </Panel>
    );
  }

  if (state.kind === 'ready' && state.issues.length === 0) {
    return (
      <Panel>
        <svg
          className="w-12 h-12 mx-auto mb-4 text-ice-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.25}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
          />
        </svg>
        <h3 className="text-xl font-bold text-midnight mb-2">No issues published yet</h3>
        <p className="text-muted text-sm">
          The first one is on its way. Subscribe above and it will land in your inbox.
        </p>
      </Panel>
    );
  }

  const issues = state.kind === 'ready' ? state.issues : null;
  const shown = issues ? filterIssues(issues, filters) : null;
  const filtering = isFiltering(filters);

  // A course from a link that no issue lists any more still shows, pressed, so it can be cleared.
  let courses = issues ? coursesIn(issues) : [];
  if (issues && filters.course && !courses.includes(filters.course)) courses = [...courses, filters.course].sort();

  let results: React.ReactNode;
  if (!issues || !shown) {
    results = <SkeletonGrid />;
  } else if (shown.length === 0) {
    results = <NoMatches filters={filters} onClear={clearFilters} />;
  } else {
    results = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shown.map((issue) => (
          <IssueCard key={issue.id} issue={issue} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <ArchiveToolbar
        query={filters.query}
        onQueryChange={(query) => setFilters((f) => ({ ...f, query }))}
        courses={courses}
        course={filters.course}
        onCourseChange={(course) => setFilters((f) => ({ ...f, course }))}
        count={issues && shown ? { shown: shown.length, total: issues.length } : null}
        filtering={filtering}
        onClear={clearFilters}
      />
      {results}
    </div>
  );
}

/** A search or course filter that leaves nothing to show. */
function NoMatches({ filters, onClear }: { filters: ArchiveFilters; onClear: () => void }) {
  const query = filters.query.trim();
  const { course } = filters;

  let message: string;
  if (query && course) message = `No ${course} reports match "${query}". Try fewer or different words.`;
  else if (query) message = `No reports match "${query}". Try fewer or different words, or a course number.`;
  else message = `No reports are listed under ${course} yet.`;

  return (
    <Panel>
      <svg
        aria-hidden="true"
        className="w-12 h-12 mx-auto mb-4 text-ice-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.25}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
      <h3 className="text-xl font-bold text-midnight mb-2">Nothing matches</h3>
      <p className="text-muted text-sm leading-relaxed break-words">{message}</p>
      <button
        type="button"
        onClick={onClear}
        className="mt-6 inline-flex items-center gap-2 bg-midnight-700 text-offwhite font-display font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-midnight transition-colors btn-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-offwhite"
      >
        Show every report
      </button>
    </Panel>
  );
}
