import React from 'react';
import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';

export function CalendarSection() {
  return (
    <section className="bg-midnight py-20 lg:py-28 relative overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 hero-grid-bg opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-midnight/80 via-transparent to-midnight/80" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          <Reveal>
            <p className="font-display text-accent text-xs font-semibold uppercase tracking-widest mb-4">
              Stay in the Loop
            </p>
            <h2 className="text-4xl font-black text-offwhite mb-4 leading-tight">
              Never Miss<br />an Event.
            </h2>
            <p className="text-offwhite/55 leading-relaxed mb-8 max-w-md">
              Subscribe to the VSEUS Economics Calendar and get all our events
              (competitions, networking nights, workshops, and socials) delivered
              directly to Google Calendar, Apple Calendar, or Outlook.
            </p>
            <div className="flex flex-wrap gap-3">
              {/* TODO: replace with the published calendar subscription URL */}
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-accent text-midnight font-display font-semibold px-5 py-2.5 rounded-lg hover:bg-accent-600 transition-colors text-sm shadow-lg shadow-accent/20"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Subscribe to Calendar
              </a>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 border border-offwhite/20 text-offwhite/75 font-display font-medium px-5 py-2.5 rounded-lg hover:bg-offwhite/10 hover:text-offwhite hover:border-offwhite/35 transition-all text-sm"
              >
                View All Events
              </Link>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-2xl overflow-hidden border border-offwhite/[0.1] bg-offwhite/[0.03] aspect-video flex items-center justify-center relative group hover:border-accent/30 transition-colors duration-300">
              <div className="text-center text-offwhite/30 group-hover:text-offwhite/45 transition-colors duration-300">
                <svg className="w-12 h-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-medium">Google Calendar embed</p>
                <p className="text-xs mt-1 opacity-60">Coming soon</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
