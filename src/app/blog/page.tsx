import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | VSEUS',
  description: 'Society updates, event recaps, and practical advice for economics students at UBC, coming soon.',
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-ice">
      <section className="bg-midnight py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-display text-accent text-sm font-semibold uppercase tracking-widest mb-2">
            Writing
          </p>
          <h1 className="text-4xl font-black text-offwhite">Blog</h1>
        </div>
      </section>

      <section className="py-24 bg-ice">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-offwhite border border-ice-400 rounded-2xl p-12 text-center max-w-xl mx-auto">
            <svg className="w-12 h-12 mx-auto mb-4 text-ice-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <h2 className="text-xl font-bold text-midnight mb-2">Coming Soon</h2>
            <p className="text-muted text-sm">
              We&apos;re working on it. Check back soon for society updates, event recaps, and practical advice for economics students at UBC.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
