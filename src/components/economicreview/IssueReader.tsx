'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import {
  assetUrl,
  downloadNameFor,
  fetchIssue,
  formatIssueDate,
  isScheduled,
  NotConfiguredError,
  type Issue,
} from '@/lib/economicreview/issues';
import { hasEditorSession } from '@/lib/economicreview/editor';
import { courseHref } from '@/lib/economicreview/search';
import { PUBLICATION } from '@/lib/economicreview/content';
import { Conversation } from './comments/Conversation';

/** The viewer's footprint while PDF.js itself is still downloading. */
function ViewerSkeleton() {
  return (
    <div aria-hidden="true" className="-mx-4 sm:mx-0">
      <div className="h-14 bg-offwhite border-y sm:border border-ice-400 sm:rounded-t-2xl" />
      <div className="bg-ice-200 border-b border-ice-400 sm:border-x sm:rounded-b-2xl px-2 py-4 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-[816px] aspect-[17/22] bg-offwhite shadow-md shadow-midnight/10 animate-pulse motion-reduce:animate-none" />
      </div>
    </div>
  );
}

/*
  PDF.js reaches for browser-only APIs as soon as it is evaluated, so the
  viewer is loaded in the browser only. It is also by far the heaviest thing
  in the section, and loading it here keeps it off every other page.
*/
const PdfViewer = dynamic(() => import('./PdfViewer').then((m) => m.PdfViewer), {
  ssr: false,
  loading: () => <ViewerSkeleton />,
});

/** What the static HTML ships with, and what shows while the issue is fetched. */
export function IssueReaderSkeleton() {
  return (
    <div>
      <div aria-hidden="true" className="mb-8 lg:mb-10 animate-pulse motion-reduce:animate-none">
        <div className="h-3 w-32 rounded bg-ice-200 mb-5" />
        <div className="max-w-4xl h-8 sm:h-10 lg:h-11 w-11/12 rounded bg-ice-200 mb-3" />
        <div className="max-w-4xl h-8 sm:h-10 lg:h-11 w-2/3 rounded bg-ice-200 mb-4" />
        <div className="h-3.5 w-72 max-w-full rounded bg-ice-200 mb-5" />
        <div className="max-w-3xl h-4 w-full rounded bg-ice-200 mb-2.5" />
        <div className="max-w-3xl h-4 w-4/5 rounded bg-ice-200" />
        <div className="mt-6 pt-5 border-t border-midnight/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="h-4 w-full max-w-md rounded bg-ice-200" />
          <div className="h-10 w-40 rounded-lg bg-ice-200" />
        </div>
      </div>
      <ViewerSkeleton />
      <span className="sr-only" role="status">
        Loading issue
      </span>
    </div>
  );
}

/** Shared shell for the states that have no issue to show. */
function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-offwhite border border-ice-400 rounded-2xl p-8 sm:p-12 text-center max-w-xl mx-auto">
      {children}
    </div>
  );
}

/**
 * One fact in the issue's metadata row, set inline as "Label: value".
 *
 * Each fact draws its own separator in the gap before it. The row clips
 * whatever falls outside it, so the fact that opens a line, whether the first
 * or one that wrapped, loses its separator and no line starts with a stray
 * rule.
 */
function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="relative flex items-baseline gap-1.5 before:absolute before:-left-3 before:top-1/2 before:h-3.5 before:w-px before:-translate-y-1/2 before:bg-midnight/25">
      <dt className="text-muted">{label}:</dt>
      <dd className="font-medium text-midnight">{children}</dd>
    </div>
  );
}

/*
  The accent fill of the masthead's Subscribe button. The label is white, as
  the design calls for, though white on this orange is only about 1.9:1.
*/
const DOWNLOAD_PDF = [
  'inline-flex items-center justify-center gap-2 flex-shrink-0 self-start sm:self-auto',
  'px-4 py-2.5 rounded-lg bg-accent text-white font-display font-semibold text-sm shadow-md shadow-accent/20',
  'hover:bg-accent-600 transition-colors btn-press',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ice',
].join(' ');

const PANEL_ACTION =
  'mt-6 inline-flex items-center gap-2 bg-midnight-700 text-offwhite font-display font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-midnight transition-colors btn-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-offwhite';

type State =
  | { kind: 'loading' }
  | { kind: 'ready'; issue: Issue }
  | { kind: 'missing' }
  | { kind: 'error'; configured: boolean };

/**
 * One issue, read in the page: its date, title, and summary over the PDF.
 *
 * The issue id comes from the query string, so this is the one static page
 * behind every issue's link, and the row is fetched in the browser like the
 * archive's list. A link with no id, a malformed one, or one to an issue that
 * has been deleted all land on the same "not found" panel, which is distinct
 * from the error panel for a request that failed.
 *
 * A scheduled issue reads as not found, except to an editor who is signed in,
 * so they can check a queued issue from its card before it goes out. Their
 * session survives the move from the archive because it lives in memory and
 * this is a client-side navigation.
 */
export function IssueReader() {
  const id = useSearchParams().get('issue') ?? '';
  const [state, setState] = useState<State>({ kind: 'loading' });
  const [attempt, setAttempt] = useState(0);
  /** Known once the viewer has opened the PDF. */
  const [pageCount, setPageCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    hasEditorSession()
      .then((editor) => fetchIssue(id, { includeScheduled: editor }))
      .then((issue) => {
        if (!cancelled) setState(issue ? { kind: 'ready', issue } : { kind: 'missing' });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setState({ kind: 'error', configured: !(error instanceof NotConfiguredError) });
      });

    return () => {
      cancelled = true;
    };
  }, [id, attempt]);

  /*
    The route's own metadata can only say "Weekly Report", since it is built
    before any issue exists. Once the issue is known, the tab and history entry
    get its real title.
  */
  useEffect(() => {
    if (state.kind === 'ready') document.title = `${state.issue.title} | ${PUBLICATION.name} | VSEUS`;
  }, [state]);

  const retry = useCallback(() => {
    setState({ kind: 'loading' });
    setAttempt((n) => n + 1);
  }, []);

  if (state.kind === 'loading') return <IssueReaderSkeleton />;

  if (state.kind === 'missing') {
    return (
      <Panel>
        <h3 className="text-xl font-bold text-midnight mb-2">We could not find that issue</h3>
        <p className="text-muted text-sm leading-relaxed">
          The link may be incomplete, or the issue may have been taken down. Every published issue
          is in the archive.
        </p>
        <Link href="/economicreview" className={PANEL_ACTION}>
          Browse the archive
        </Link>
      </Panel>
    );
  }

  if (state.kind === 'error') {
    return (
      <Panel>
        <h3 className="text-xl font-bold text-midnight mb-2">We could not load this issue</h3>
        <p className="text-muted text-sm leading-relaxed">
          {state.configured
            ? 'The issue did not come back. The problem is on our end, not yours.'
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
          <button type="button" onClick={retry} className={PANEL_ACTION}>
            Try again
          </button>
        )}
      </Panel>
    );
  }

  const { issue } = state;
  const pdf = assetUrl(issue.pdf_path);
  const date = formatIssueDate(issue.created_at);
  const scheduled = isScheduled(issue);
  /** "Name, Role" for the byline. A role on its own has no one to belong to, so it waits for a name. */
  const author = issue.author_name ? [issue.author_name, issue.author_role].filter(Boolean).join(', ') : null;

  /*
    Laid out like the title page of a published report: a kicker naming the
    series, the headline in the Review's serif, a byline, the summary as a
    standfirst, and the facts of the issue on a ruled line beneath with the
    download beside them. The summary is set in near-midnight rather than the
    muted grey, which is under 4.5:1 on the icy page background and reads as
    an afterthought at this length.
  */
  return (
    <div>
      <header className="mb-8 lg:mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-accent" />
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Weekly Report</p>
          {scheduled && (
            <span className="font-display text-[10px] font-semibold uppercase tracking-widest text-midnight bg-accent px-2.5 py-1 rounded-full">
              Scheduled
            </span>
          )}
        </div>

        <h2 className="max-w-4xl font-serif sm:[font-variation-settings:'opsz'_144] text-[1.75rem] sm:text-4xl lg:text-[2.75rem] font-semibold text-midnight leading-[1.12] text-balance">
          {issue.title}
        </h2>

        {(author || date) && (
          <p className="mt-3 text-sm text-midnight">
            {author && `By ${author}`}
            {author && date && (
              <span aria-hidden="true" className="mx-2 text-muted">
                |
              </span>
            )}
            {date && (
              <>
                {scheduled ? 'Goes live' : 'Published'} <time dateTime={issue.created_at}>{date}</time>
              </>
            )}
          </p>
        )}

        {issue.description && (
          <p className="max-w-3xl mt-4 text-base text-midnight/90 leading-relaxed">{issue.description}</p>
        )}

        <div className="mt-6 pt-5 border-t border-midnight/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* The padding gives focus rings room inside the clip that hides each line's leading separator. */}
          <dl className="-m-1 p-1 overflow-hidden flex flex-wrap items-baseline gap-x-6 gap-y-1.5 text-sm">
            {pageCount !== null && (
              <Meta label="Length">
                {pageCount} {pageCount === 1 ? 'page' : 'pages'}
              </Meta>
            )}
            <Meta label="Publication">{PUBLICATION.name}</Meta>
            {pdf && <Meta label="Format">PDF Report</Meta>}
            {issue.courses.length > 0 && (
              <Meta label={issue.courses.length === 1 ? 'Related course' : 'Related courses'}>
                {/* Each one opens the archive filtered to that course. */}
                <ul className="inline-flex flex-wrap gap-x-3 gap-y-1">
                  {issue.courses.map((code) => (
                    <li key={code}>
                      <Link
                        href={courseHref(code)}
                        className="underline decoration-accent decoration-2 underline-offset-2 hover:text-midnight-700 transition-colors"
                      >
                        <span className="sr-only">More issues for </span>
                        {code}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Meta>
            )}
          </dl>

          {pdf && (
            <a href={pdf} download={downloadNameFor(issue.title)} className={DOWNLOAD_PDF}>
              Download PDF
              <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </a>
          )}
        </div>
      </header>

      {pdf ? (
        <PdfViewer key={pdf} url={pdf} downloadName={downloadNameFor(issue.title)} onPageCount={setPageCount} />
      ) : (
        <Panel>
          <h3 className="text-xl font-bold text-midnight mb-2">PDF coming soon</h3>
          <p className="text-muted text-sm leading-relaxed">
            This issue does not have its PDF yet. Check back shortly.
          </p>
        </Panel>
      )}

      <Conversation key={issue.id} issueId={issue.id} />
    </div>
  );
}
