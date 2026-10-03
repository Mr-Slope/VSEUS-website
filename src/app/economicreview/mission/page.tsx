import React from 'react';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Reveal } from '@/components/ui/Reveal';
import { CTAButton } from '@/components/ui/CTAButton';
import { MISSION_PILLARS, PUBLICATION } from '@/lib/economicreview/content';

export const metadata: Metadata = {
  title: 'Our Mission',
  description:
    'Why the Vancouver Economic Review exists: educating, inspiring, and empowering UBC economics students through accessible, high-quality economic insight.',
};

export default function EconomicReviewMissionPage() {
  return (
    <>
      {/* Statement */}
      <section className="py-16 lg:py-20 bg-ice">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-display text-sm font-semibold text-midnight-700 uppercase tracking-widest mb-3">
              Our Mission
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-midnight mb-6 leading-tight">
              Economics, made legible.
            </h2>
            <p className="text-midnight/85 leading-relaxed text-lg mb-5">
              The {PUBLICATION.name} is the official publication of the Vancouver School of
              Economics Undergraduate Society. It is a platform for UBC economics students to
              explore, analyze, and discuss economic ideas, market developments, and the policy
              issues that shape our world.
            </p>
            <p className="text-muted leading-relaxed mb-5">
              The Review represents a growing community of student writers, analysts, and editors
              committed to fostering economic literacy and intellectual curiosity across the UBC
              community.
            </p>
            <p className="text-midnight font-semibold leading-relaxed">
              Our mission is to educate, inspire, and empower students through accessible,
              high-quality economic insight, guided by four core pillars.
            </p>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-16 lg:py-20 bg-midnight relative overflow-hidden">
        <div className="absolute inset-0 hero-grid-bg opacity-20 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <Reveal>
              <div className="bg-offwhite rounded-2xl p-6 sm:p-8">
                <Image
                  src="/photos/EconomicReview/mission-diagram.png"
                  alt="Diagram of the four pillars of the Vancouver Economic Review, overlapping at the centre"
                  width={1200}
                  height={1200}
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="w-full h-auto object-contain"
                />
              </div>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {MISSION_PILLARS.map((pillar, i) => (
                <Reveal key={pillar.title} delay={i * 90}>
                  <div className="h-full bg-midnight-800/70 border border-offwhite/10 hover:border-accent/40 rounded-2xl p-6 transition-colors">
                    <p className="font-display text-accent text-xs font-semibold tracking-widest mb-3">
                      {String(i + 1).padStart(2, '0')}
                    </p>
                    <h3 className="text-offwhite font-bold text-base leading-snug mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-offwhite/55 text-sm leading-relaxed">{pillar.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Back to the society */}
      <section className="py-16 bg-ice">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-offwhite border border-ice-400 rounded-2xl p-8 sm:p-10 text-center max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-midnight mb-3">More about VSEUS</h3>
            <p className="text-muted leading-relaxed text-sm mb-7 max-w-xl mx-auto">
              The Review is one of several initiatives the society runs. For our constitution, meeting
              minutes, budgetary reports, and the rest of what VSEUS does, start with the society
              page.
            </p>
            <CTAButton href="/about#mission" variant="midnight" size="md">
              Visit the VSEUS mission
            </CTAButton>
          </div>
        </div>
      </section>
    </>
  );
}
