import React from 'react';
import { Reveal } from '@/components/ui/Reveal';

/**
 * This year's confirmed sponsors, shown as a showcase rather than a ticker.
 * Instead of crawling at a constant speed, the strip glides one slot to the
 * left with a slight overshoot, settles, and rests so each logo gets a moment.
 * Each chip also floats gently on its own rhythm, and lifts with an accent glow
 * when hovered. The run pauses on hover or keyboard focus and holds still when
 * the visitor prefers reduced motion.
 *
 * Two identical rows sit side by side inside the clipped, full-width strip, and
 * every logo gets an equal slot, so stepping by one slot (100% / N of a row)
 * always lands a logo where the previous one stood. After N steps row two sits
 * exactly where row one began, which makes the loop seamless. The second row is
 * aria-hidden so screen readers announce the list once.
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

/** Seconds each logo rests before the strip glides on. */
const REST_S = 2.6;
/** Seconds each glide takes. */
const GLIDE_S = 1.1;

/**
 * Keyframes for the glide-and-rest loop. They depend on how many sponsors
 * there are, so they are generated here rather than written in globals.css.
 */
function stepKeyframes(name: string, steps: number) {
  const frames: string[] = [];
  const restShare = REST_S / (REST_S + GLIDE_S);
  for (let i = 0; i < steps; i++) {
    const at = (i / steps) * 100;
    const restEnd = ((i + restShare) / steps) * 100;
    const x = -(i / steps) * 100;
    frames.push(`${at.toFixed(3)}% { transform: translateX(${x}%); }`);
    // The timing function on a keyframe governs the move to the next one: a
    // smooth glide with a touch of overshoot so it settles rather than stops.
    frames.push(
      `${restEnd.toFixed(3)}% { transform: translateX(${x}%); animation-timing-function: cubic-bezier(0.5, 0, 0.2, 1.15); }`,
    );
  }
  frames.push('100% { transform: translateX(-100%); }');
  return `@keyframes ${name} { ${frames.join(' ')} }`;
}

const KEYFRAMES = 'sponsor-step';
const TRACK_STYLE: React.CSSProperties = {
  // Only the name and duration: setting the whole `animation` inline would
  // override the hover pause and reduced-motion rules in globals.css.
  animationName: KEYFRAMES,
  animationDuration: `${SPONSORS.length * (REST_S + GLIDE_S)}s`,
};

function SponsorRow({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <ul
      aria-hidden={ariaHidden}
      className="marquee-track flex min-w-full shrink-0 items-center"
      style={TRACK_STYLE}
    >
      {SPONSORS.map((sponsor, i) => (
        // Equal slots: flex-1 shares the row out evenly, and the min width
        // keeps that true on narrow screens where the row outgrows the strip.
        <li key={sponsor.name} className="flex min-w-[280px] flex-1 justify-center px-5 py-4 sm:min-w-[380px]">
          <div
            className="sponsor-chip flex h-24 items-center justify-center rounded-2xl bg-offwhite px-8 sm:h-28 sm:px-10"
            style={{ animationDelay: `${i * -1.3}s` }}
          >
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

      <style>{stepKeyframes(KEYFRAMES, SPONSORS.length)}</style>

      <div className="sponsor-marquee relative mt-6 flex overflow-hidden">
        {/* Soft fades so logos ease in and out at the edges rather than clip */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-midnight to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-midnight to-transparent sm:w-24" />

        <SponsorRow />
        <SponsorRow ariaHidden />
      </div>
    </section>
  );
}
