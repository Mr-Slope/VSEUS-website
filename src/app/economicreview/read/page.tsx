import React, { Suspense } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { IssueReader, IssueReaderSkeleton } from '@/components/economicreview/IssueReader';

export const metadata: Metadata = {
  title: 'Weekly Report',
  description:
    'Read an issue of the Vancouver Economic Review in your browser, or download the PDF.',
};

/**
 * The reader for a single issue, at /economicreview/read?issue=<id>.
 *
 * One static page serves every issue. The id is in the query string because a
 * static export can only have paths that exist at build time, and issues are
 * published as rows without a deploy. The back link and the section chrome
 * prerender; IssueReader reads the id and fetches the issue in the browser.
 *
 * The Suspense boundary is required, not decorative: reading search params
 * makes everything up to the nearest boundary render in the browser, and
 * without one the build fails. The fallback is what the static HTML carries.
 *
 * Arriving from a card further down the archive, Next scrolls this section to
 * the top of the viewport. The scroll margin stops it there tucking the back
 * link under the sticky navbar, which is h-20.
 */
export default function ReadIssuePage() {
  return (
    <section className="py-10 lg:py-14 bg-ice scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/economicreview"
          className="inline-flex items-center gap-2 font-display text-sm font-semibold text-midnight hover:text-midnight-700 transition-colors mb-6"
        >
          <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          All reports
        </Link>

        <Suspense fallback={<IssueReaderSkeleton />}>
          <IssueReader />
        </Suspense>
      </div>
    </section>
  );
}
