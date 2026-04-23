'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { CTAButton } from '@/components/ui/CTAButton';

export function Hero() {
  const { user } = useAuth();
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    function onScroll() {
      const progress = Math.min(window.scrollY / 280, 1);
      path!.style.strokeDashoffset = `${length * (1 - progress)}`;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center bg-navy-900 overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 hero-grid-bg" />

      {/* Depth gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-900/60 to-navy-700/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/50 to-transparent" />

      {/* Decorative concentric rings — right */}
      <div className="absolute -right-56 top-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/[0.03]" />
      <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-[580px] h-[580px] rounded-full border border-white/[0.05]" />
      <div className="absolute right-8 top-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full border border-gold/[0.08] hero-float" />
      <div className="absolute right-36 top-1/2 -translate-y-1/2 w-[180px] h-[180px] rounded-full border border-gold/[0.15]" />

      {/* Gold left accent line */}
      <div className="absolute left-0 top-0 w-[2px] h-full bg-gradient-to-b from-transparent via-gold/50 to-transparent" />
      <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-[12px] h-[12px] rounded-full bg-gold shadow-[0_0_24px_6px_rgba(201,168,76,0.4)]" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-36 lg:py-44 w-full">
        <div className="max-w-4xl">

          {/* Badge */}
          <div className="hero-tag inline-flex items-center gap-2.5 bg-white/[0.07] backdrop-blur-sm border border-white/[0.1] rounded-full px-4 py-2 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span className="text-sm text-white/65 tracking-wide">
              Est. 2014 &nbsp;·&nbsp; University of British Columbia
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-black text-white leading-[0.88] tracking-tight mb-8">
            <span className="hero-word text-6xl sm:text-7xl lg:text-[88px]" style={{ animationDelay: '80ms' }}>
              Ahead of
            </span>
            <span className="hero-word text-6xl sm:text-7xl lg:text-[88px] mt-2" style={{ animationDelay: '200ms' }}>
              the{' '}
              <span className="text-gold relative inline-block">
                Curve
                <svg
                  className="absolute left-0 w-full pointer-events-none"
                  style={{ bottom: '-14px', overflow: 'visible' }}
                  height="16"
                  viewBox="0 0 100 16"
                  preserveAspectRatio="none"
                  fill="none"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="curveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(201,168,76,0.9)" />
                      <stop offset="100%" stopColor="rgba(222,192,110,0.55)" />
                    </linearGradient>
                  </defs>
                  <path
                    ref={pathRef}
                    d="M 0 2 Q 50 14 100 2"
                    stroke="url(#curveGrad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle text-lg sm:text-xl text-white/55 leading-relaxed mb-10 max-w-[520px]">
            The Vancouver School of Economics Undergraduate Society empowers UBC
            students with academic resources, networking opportunities, and career
            preparation for tomorrow&apos;s economy.
          </p>

          {/* CTAs */}
          <div className="hero-ctas flex flex-wrap items-center gap-4">
            {user ? (
              <CTAButton href="/portal" variant="gold" size="lg">
                Go to My Portal
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </CTAButton>
            ) : (
              <CTAButton href="/auth/login" variant="gold" size="lg">
                Member Login
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </CTAButton>
            )}
            <Link
              href="/about"
              className="inline-flex items-center gap-2 border border-white/20 text-white/75 font-medium px-7 py-3.5 rounded-lg hover:bg-white/[0.08] hover:border-white/30 hover:text-white transition-all text-base"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-[10px] text-white/25 uppercase tracking-[0.22em]">Scroll</span>
        <div className="w-5 h-8 border border-white/15 rounded-full flex justify-center pt-1.5">
          <div className="w-[3px] h-2 bg-white/25 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
