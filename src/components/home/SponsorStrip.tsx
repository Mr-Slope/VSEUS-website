import React from 'react';
import { Reveal } from '@/components/ui/Reveal';

/**
 * A slow, continuous marquee of this year's confirmed sponsors, sitting just
 * below the stats bar. It reads like a news ticker: logos slide right to left
 * at a steady pace, the run pauses on hover or keyboard focus, and it holds
 * still entirely when the visitor prefers reduced motion.
 *
 * Two identical rows sit side by side inside the clipped, full-width strip.
 * Each row is at least as wide as the strip, so a few logos on their own never
 * leave a gap, and each row slides left by its own full width (-100%) in step,
 * so row two lands exactly where row one began: a seamless loop. The second row
 * is aria-hidden so screen readers announce the list once.
 *
 * Each logo sits on an off-white chip so they read as one set despite their
 * different source backgrounds.
 */

interface Sponsor {
  name: string;
  logo: string;
  /** Overrides the default logo size, for files with a lot of built-in padding. */
  imgClassName?: string;
}

const DEFAULT_IMG_CLASS = 'h-12 w-auto max-w-[190px] sm:h-14 sm:max-w-[240px]';

const SPONSORS: Sponsor[] = [
  // The square file is mostly white margin, so it needs more height to match.
  // multiply melts its pure-white ground into the off-white chip.
  { name: 'Wizeprep', logo: '/sponsors/wizeprep.jpeg', imgClassName: 'h-24 w-auto sm:h-28 mix-blend-multiply' },
  { name: 'Jukebox', logo: '/sponsors/jukebox.png' },
];

function SponsorRow({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <ul
      aria-hidden={ariaHidden}
      className="marquee-track flex min-w-full shrink-0 items-center justify-around gap-10 px-5 sm:gap-20 sm:px-10"
    >
      {SPONSORS.map((sponsor) => (
        <li key={sponsor.name} className="shrink-0">
          <div className="flex h-24 items-center justify-center rounded-xl bg-offwhite px-8 sm:h-28 sm:px-10">
            {/* Plain img: static export serves these unoptimised anyway, and the
                marquee renders each logo twice. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sponsor.logo}
              alt={sponsor.name}
              loading="lazy"
              className={`object-contain ${sponsor.imgClassName ?? DEFAULT_IMG_CLASS}`}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function SponsorStrip() {
  return (
    <section className="bg-midnight border-b border-offwhite/[0.06] py-10 lg:py-12">
      <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="font-display text-center text-xs font-semibold text-offwhite/45 uppercase tracking-[0.2em]">
          This Year&rsquo;s Sponsors
        </p>
      </Reveal>

      <div className="sponsor-marquee relative mt-8 flex overflow-hidden">
        {/* Soft fades so logos ease in and out at the edges rather than clip */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-midnight to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-midnight to-transparent sm:w-24" />

        <SponsorRow />
        <SponsorRow ariaHidden />
      </div>
    </section>
  );
}
