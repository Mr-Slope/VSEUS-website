import React from 'react';
import { Reveal } from '@/components/ui/Reveal';

// TODO: point this at the real storefront once it exists.
const SHOP_URL = '#';

export function MerchStrip() {
  return (
    <section className="bg-midnight-700 py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-14 items-center">

          <Reveal>
            <p className="font-display text-xs font-semibold text-accent uppercase tracking-widest mb-3">
              VSEUS Merch
            </p>
            <h2 className="text-4xl font-black text-offwhite mb-4 leading-tight">
              Wear the<br />Society.
            </h2>
            <p className="text-offwhite/60 leading-relaxed mb-7 max-w-md text-sm">
              Crewnecks, hoodies, and stickers designed by and for economics
              students. Every purchase goes straight back into student programming.
            </p>
            <a
              href={SHOP_URL}
              className="inline-flex items-center gap-2 bg-accent text-midnight font-display font-semibold px-6 py-3.5 rounded-lg hover:bg-accent-600 transition-colors text-base shadow-lg shadow-accent/20"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              Shop Merch
            </a>
          </Reveal>

          <Reveal delay={120}>
            {/* TODO: swap for a product grid once the storefront and photos exist. */}
            <div className="flex flex-col items-center justify-center text-center gap-4 border-2 border-dashed border-offwhite/25 rounded-2xl aspect-video px-8">
              <div className="w-14 h-14 rounded-full bg-accent/15 text-accent flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                </svg>
              </div>
              <div>
                <p className="font-display font-bold text-offwhite text-lg">Coming Soon</p>
                <p className="text-offwhite/50 text-sm mt-1">The full lineup is on its way. Check back soon.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
