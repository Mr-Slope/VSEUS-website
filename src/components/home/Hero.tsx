'use client';

import React, { useRef, useEffect } from 'react';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { CTAButton } from '@/components/ui/CTAButton';
import Image from 'next/image';

export function Hero() {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    function onScroll() {
      // First ~40% of scroll draws the underline arc; the rest unfurls squiggles
      const progress = Math.min(window.scrollY / 480, 1);
      path!.style.strokeDashoffset = `${length * (1 - progress)}`;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="relative min-h-screen lg:min-h-[108vh] flex items-center bg-midnight overflow-hidden">
      {/*
        The photo is the hero's whole background, edge to edge.
        Layer order matters: image → scrim → grid/gradient → decoration → content.
        preload rather than eager: this is the page's LCP element. alt is empty
        because the scrim makes it a backdrop — the headline carries the meaning.
      */}
      <Image
        src="/photos/Home/vseus-banner.jpg"
        alt=""
        fill
        sizes="100vw"
        preload
        className="object-cover"
      />

      {/*
        The scrim is what lets the headline sit at 85% opacity and stay legible:
        it darkens the photo enough to hold type without hiding the picture.
      */}
      <div className="absolute inset-0 bg-midnight/55" />
      {/*
        Darkest edge follows the type, which sits on the right: to-l puts the 80%
        stop at the right. That also lifts the left to ~20%, letting the printed
        banner read instead of being crushed.
      */}
      <div className="absolute inset-0 bg-gradient-to-l from-midnight/80 via-midnight/40 to-midnight/20" />

      {/* Accent left edge */}
      <div className="absolute left-0 top-0 w-[3px] h-full bg-gradient-to-b from-transparent via-accent/60 to-transparent" />
      <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-[12px] h-[12px] rounded-full bg-accent shadow-[0_0_24px_6px_rgba(237,177,135,0.45)]" />

      {/* Content: full width, no centering cap, so the right-aligned block sits
          one padding-step from the viewport's right edge, as far right as it
          goes while staying off the edge. */}
      <div className="relative w-full px-4 sm:px-6 lg:px-10 py-36 lg:py-44">
        {/*
          ml-auto moves the column to the right half, clear of the banner's
          printed wordmark. Narrower than the old max-w-4xl so the text actually
          reads as right-hand; both headline lines still fit on one line each.
          Below 2xl the cap exceeds the viewport, so mobile is unaffected.
        */}
        {/*
          translate-y aligns the headline with the "vseus" printed on the banner,
          whose glyphs are centred at 50% of the image height. The copy block
          otherwise centres a little above that. Panning the image instead is not
          an option: object-cover on a 3:2 source in a 108vh box leaves zero
          vertical overflow at 16:10 and 3:2 aspect ratios, so object-position
          has nothing to move into. Tune this one value if the match drifts.
        */}
        {/* lg:mr-[7vw] backs the block off the right edge, nudging it left.
            Tune this value to slide it further left or right. */}
        <div className="max-w-2xl ml-auto text-right translate-y-[6vh] lg:mr-[7vw]">

          {/* Badge */}
          <div className="hero-tag inline-flex items-center gap-2.5 bg-offwhite/[0.07] backdrop-blur-sm border border-offwhite/[0.12] rounded-full px-4 py-2 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-sm text-offwhite/70 tracking-wide">
              Est. 2014 &nbsp;·&nbsp; University of British Columbia
            </span>
          </div>

          <div className="mb-8">
            <h1 className="relative font-black text-offwhite/85 leading-[0.88] tracking-tight">
              <span className="hero-word text-6xl sm:text-7xl lg:text-[88px]" style={{ animationDelay: '80ms' }}>
                Ahead of
              </span>
              <span className="hero-word text-6xl sm:text-7xl lg:text-[88px] mt-2" style={{ animationDelay: '200ms' }}>
                the{' '}
                <span className="text-accent relative inline-block">
                  Curve
                  <svg
                    className="absolute left-0 w-full pointer-events-none"
                    style={{ bottom: '-16px', overflow: 'visible' }}
                    height="22"
                    viewBox="0 0 300 22"
                    preserveAspectRatio="none"
                    fill="none"
                    aria-hidden="true"
                  >
                    <defs>
                      {/* Fades from solid accent to transparent as squiggles extend right */}
                      <linearGradient id="curveGrad" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
                        <stop offset="0%"   stopColor="rgba(237,177,135,0.95)" />
                        <stop offset="32%"  stopColor="rgba(237,177,135,0.90)" />
                        <stop offset="58%"  stopColor="rgba(237,177,135,0.55)" />
                        <stop offset="100%" stopColor="rgba(237,177,135,0)" />
                      </linearGradient>
                    </defs>
                    {/*
                      Path structure (in viewBox units, 0–300):
                      0–100   : gentle arc = the underline beneath "Curve"
                      100–300 : cubic-bezier squiggles that extend beyond the word
                    */}
                    <path
                      ref={pathRef}
                      d="M 0 5 Q 50 19 100 5 C 116 -3 136 22 156 5 C 174 -3 194 22 214 5 C 232 -3 252 22 272 5 C 283 -1 293 17 300 9"
                      stroke="url(#curveGrad)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </span>
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          {/* ml-auto because its 520px box is narrower than the column, and
              text-align alone would leave the box itself on the left.
              text-balance evens the line lengths so the last line isn't a lone
              "belong." — the browser redistributes breaks per viewport rather
              than us freezing them with <br />. */}
          <p className="hero-subtitle text-lg sm:text-xl text-offwhite/60 leading-relaxed mb-10 max-w-[520px] ml-auto text-balance">
            The Vancouver School of Economics Undergraduate Society empowers UBC
            economics students with academic resources, networking and career
            preparation, and a community where they belong.
          </p>

          {/* CTAs */}
          {/* justify-end because flex items ignore the inherited text-right */}
          <div className="hero-ctas flex flex-wrap items-center justify-end gap-4">
            <CTAButton href="/resources" variant="accent" size="lg">
              Explore Resources
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </CTAButton>
            {/* Names its destination — next to "Explore Resources", a generic
                "Learn More" read as "learn more about the resources". */}
            <TransitionLink
              href="/about"
              className="inline-flex items-center gap-2 border border-offwhite/25 text-offwhite/80 font-display font-medium px-7 py-3.5 rounded-lg hover:bg-offwhite/[0.08] hover:border-offwhite/40 hover:text-offwhite transition-all text-base"
            >
              About VSEUS
            </TransitionLink>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-[10px] text-offwhite/30 uppercase tracking-[0.22em]">Scroll</span>
        <div className="w-5 h-8 border border-offwhite/20 rounded-full flex justify-center pt-1.5">
          <div className="w-[3px] h-2 bg-offwhite/30 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
