'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export function Hero() {
  const { user } = useAuth();

  return (
    <section className="bg-navy-700 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/20" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-white/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-3xl">
          <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-4">
            Est. 2014 · University of British Columbia
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            Ahead of the{' '}
            <span className="text-gold">Curve.</span>
          </h1>
          <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-xl">
            The Vancouver School of Economics Undergraduate Society empowers UBC students with academic resources, networking opportunities, and career preparation for tomorrow&apos;s economy.
          </p>
          <div className="flex flex-wrap gap-4">
            {user ? (
              <Link
                href="/portal"
                className="inline-flex items-center justify-center gap-2 bg-gold text-navy-900 font-semibold px-7 py-3.5 rounded-lg hover:bg-gold-light transition-colors"
              >
                Go to My Portal
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            ) : (
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center gap-2 bg-gold text-navy-900 font-semibold px-7 py-3.5 rounded-lg hover:bg-gold-light transition-colors"
              >
                Become a Member
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            )}
            <Link
              href="/about"
              className="inline-flex items-center justify-center border border-white/30 text-white font-medium px-7 py-3.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
