import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Fraunces, Playfair_Display } from 'next/font/google';
import { SectionTabs } from '@/components/economicreview/SectionTabs';
import { SubscribePanel } from '@/components/economicreview/SubscribePanel';
import { PUBLICATION } from '@/lib/economicreview/content';

/*
  The Review's editorial serif, behind the `font-serif` utility. It is loaded
  here rather than in the root layout so only the Review's pages preload it.
  The optical size axis comes along so headlines can use the display cut,
  with its finer hairlines and tighter fit.
*/
const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  axes: ['opsz'],
});

/*
  The masthead's nameplate face, behind the `font-masthead` utility. It is
  reserved for the title alone, so the nameplate reads as a wordmark set apart
  from the Fraunces headlines on the pages below it.
*/
const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
});

/**
 * Every page in the section gets a consistent suffix, so each route is
 * distinguishable in a tab or a search result even though they all share the
 * masthead's h1.
 *
 * `template` applies to child segments only, never to the segment that defines
 * it, so `default` is what the archive at /economicreview ends up using.
 */
export const metadata: Metadata = {
  title: {
    default: `${PUBLICATION.name} | VSEUS`,
    template: `%s | ${PUBLICATION.name} | VSEUS`,
  },
  description: PUBLICATION.tagline,
};

/**
 * The Review's section chrome: one masthead and one tab bar, shared by every
 * route so the section reads as a publication inside the site rather than a
 * set of loosely related pages.
 *
 * The masthead carries the h1 on every page and the pages below it open at h2.
 * That is the usual shape for a publication section, and the per-route
 * metadata titles above keep the pages distinct where it counts.
 */
export default function EconomicReviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${fraunces.variable} ${playfair.variable} min-h-screen bg-ice`}>
      <section className="bg-midnight relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-midnight via-midnight/70 to-midnight-700/40" />
        {/*
          The grid sits over the gradient, not under it, where the gradient
          washed it out entirely. At 60% its lines come to about 2.5% off-white,
          faint enough to read as texture in the ground rather than as a pattern.
        */}
        <div className="absolute inset-0 hero-grid-bg opacity-60" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex items-center gap-2 text-sm text-offwhite/40 mb-5">
            <Link href="/resources" className="hover:text-offwhite transition-colors">
              Resources
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-offwhite/70">{PUBLICATION.name}</span>
          </div>

          {/*
            The logo stands beside the nameplate, sized to the two-line title.
            On phones it moves above, since "Economic Review" needs the full
            width at that size. The alt is empty because the h1 beside it
            already names the publication.
          */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <Image
              src="/photos/logos/economic-review.png"
              alt=""
              width={128}
              height={128}
              loading="eager"
              className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full flex-shrink-0 shadow-lg shadow-midnight-900/40"
            />
            <div>
              {/* One step smaller under 360px, where "Economic Review" would otherwise wrap. */}
              <h1 className="font-masthead text-[2rem] min-[360px]:text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-offwhite leading-[1.05]">
                Vancouver
                <br />
                Economic Review
              </h1>
              <p className="font-display text-accent text-xs font-bold uppercase tracking-widest mt-3">
                Powered by VSEUS
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-10">
            <p className="max-w-2xl text-offwhite/75 text-base sm:text-lg leading-relaxed">
              {PUBLICATION.tagline}
            </p>

            <SubscribePanel />
          </div>
        </div>
      </section>

      <SectionTabs />

      {children}
    </div>
  );
}
