import React from 'react';
import { socials } from '@/components/ui/SocialIcons';
import { EXECS, PRESIDENT } from '@/lib/execs';
import { ADDRESS, ADDRESS_MAP_URL } from '@/lib/society';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-ice">
      <section className="bg-midnight py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-display text-accent text-sm font-semibold uppercase tracking-widest mb-2">Reach Out</p>
          <h1 className="text-4xl font-black text-offwhite">Contact Us</h1>
        </div>
      </section>

      <section className="py-16 bg-ice">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-center">
          <div>
            <h2 className="text-2xl font-bold text-midnight mb-2">Email the Team</h2>
            <p className="text-muted text-sm mb-6">
              Reach the right person directly. Not sure who you need?{' '}
              <a href={`mailto:${PRESIDENT.email}`} className="text-midnight font-semibold underline decoration-accent decoration-2 underline-offset-2">
                Contact the president
              </a>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EXECS.map((item) => (
                <a
                  key={item.email}
                  href={`mailto:${item.email}`}
                  className="flex items-center justify-between gap-4 bg-offwhite border border-ice-400 hover:border-accent rounded-xl px-5 py-3.5 transition-colors group text-left"
                >
                  <div className="min-w-0">
                    <p className="font-display text-xs font-semibold text-muted uppercase tracking-widest">
                      {item.role}
                    </p>
                    <p className="text-midnight font-semibold text-sm mt-0.5 truncate">{item.email}</p>
                  </div>
                  <svg className="w-4 h-4 flex-shrink-0 text-midnight-700 opacity-40 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div id="visit" className="anchor-offset">
            <h2 className="text-2xl font-bold text-midnight mb-2">Visit Us</h2>
            <p className="text-muted text-sm mb-4">
              The VSEUS office is in the basement of the Iona Building on UBC&apos;s Vancouver campus.
            </p>
            <a
              href={ADDRESS_MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-4 bg-offwhite border border-ice-400 hover:border-accent rounded-xl px-5 py-4 transition-colors group text-left"
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="w-11 h-11 rounded-lg bg-midnight text-offwhite group-hover:bg-accent group-hover:text-midnight flex items-center justify-center flex-shrink-0 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block font-display font-semibold text-midnight text-sm">
                    {ADDRESS.street}
                  </span>
                  <span className="block text-muted text-xs mt-0.5">{ADDRESS.locality}</span>
                </span>
              </div>
              <svg className="w-4 h-4 flex-shrink-0 text-midnight-700 opacity-40 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>

          <div id="follow" className="anchor-offset">
            <h2 className="text-2xl font-bold text-midnight mb-4">Follow Us</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex items-center gap-3 bg-offwhite border border-ice-400 hover:border-accent hover:bg-accent/10 rounded-xl px-4 py-4 transition-all group text-left"
                >
                  <span className="w-11 h-11 rounded-lg bg-midnight text-offwhite group-hover:bg-accent group-hover:text-midnight flex items-center justify-center flex-shrink-0 transition-colors">
                    <span className="w-6 h-6 block">{s.icon}</span>
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display font-semibold text-midnight text-sm">{s.label}</span>
                    <span className="block text-muted text-xs truncate">{s.handle}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
