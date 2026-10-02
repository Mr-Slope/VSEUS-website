import React from 'react';

/**
 * Placeholder card shown while the archive loads.
 *
 * It mirrors the real card's footprint exactly, so the grid does not jump when
 * the issues arrive. This is also what the static HTML ships with, since the
 * fetch happens in the browser.
 */
export function IssueCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="bg-offwhite border border-ice-400 rounded-2xl overflow-hidden flex flex-col animate-pulse motion-reduce:animate-none"
    >
      <div className="w-full h-48 bg-ice-200" />
      <div className="p-6 flex flex-col flex-1">
        <div className="h-5 w-32 rounded-full bg-ice-200 mb-3" />
        <div className="h-4 w-4/5 rounded bg-ice-200 mb-2.5" />
        <div className="h-3 w-full rounded bg-ice-200 mb-2" />
        <div className="h-3 w-11/12 rounded bg-ice-200 mb-2" />
        <div className="h-3 w-2/3 rounded bg-ice-200 mb-6" />
        <div className="mt-auto h-10 w-full rounded-lg bg-ice-200" />
      </div>
    </div>
  );
}
