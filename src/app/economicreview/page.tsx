import React from 'react';
import type { Metadata } from 'next';
import { EditableArchive } from '@/components/economicreview/EditableArchive';
import { PUBLICATION } from '@/lib/economicreview/content';

/*
  No `title` here on purpose. The section layout's title template does not
  apply to its own segment, so setting one would drop the suffix that every
  other page in the section carries. Falling through to the layout's `default`
  gives "Vancouver Economic Review | VSEUS", which is the right title for the
  section's landing page anyway.
*/
export const metadata: Metadata = {
  description:
    'Every issue of the Vancouver Economic Review, the VSEUS student publication covering markets, economics, and policy. Read and download the full archive.',
};

/**
 * The archive, and the section's landing page.
 *
 * A server component that prerenders as static HTML. The issue list inside
 * <EditableArchive /> is the only part that loads in the browser, along with
 * the editor that manages it. The editor lives here rather than in the section
 * layout, so the other Review pages stay fully static.
 */
export default function EconomicReviewPage() {
  return (
    <section className="py-16 bg-ice">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <p className="font-display text-sm font-semibold text-midnight-700 uppercase tracking-widest mb-3">
            The Archive
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-midnight mb-4 leading-tight">
            Every issue, start to finish.
          </h2>
          <p className="text-muted leading-relaxed">
            The {PUBLICATION.name} publishes every Friday during the academic year. Search
            every issue below, narrow it to a course you are taking, or subscribe and have
            each issue arrive in your inbox.
          </p>
        </div>

        <EditableArchive />
      </div>
    </section>
  );
}
