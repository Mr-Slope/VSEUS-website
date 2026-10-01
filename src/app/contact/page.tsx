import React from 'react';
import { socials } from '@/components/ui/SocialIcons';
import { EXECS, PRESIDENT } from '@/lib/execs';
import { ADDRESS, ADDRESS_MAP_URL } from '@/lib/society';
import { SectionDivider } from '@/components/ui/SectionDivider';

function MailIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function MailOpenIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.981l7.5-4.039a2.25 2.25 0 012.134 0l7.5 4.039a2.25 2.25 0 011.183 1.98V19.5z" />
    </svg>
  );
}

/*
  Header artwork: an open envelope with a letter bobbing out of it and a paper
  plane looping away along a dashed trail. Purely decorative. The motion lives
  in globals.css (.mail-*) and stops under prefers-reduced-motion.
*/
function MailIllustration() {
  return (
    <svg
      className="w-full max-w-sm md:max-w-md mx-auto md:mr-0"
      viewBox="0 0 320 240"
      fill="none"
      aria-hidden="true"
    >
      {/* Paper plane trail */}
      <path
        className="mail-trail"
        d="M150,96 C120,60 150,24 196,34 C236,43 236,86 270,70 C286,62 292,46 296,34"
        stroke="var(--accent)"
        strokeOpacity="0.55"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="5 9"
      />
      <g className="mail-plane">
        <path d="M282,38 L312,16 L300,48 L292,40 Z" fill="var(--offwhite)" />
        <path d="M292,40 L312,16 L288,50 Z" fill="var(--ice-400)" />
      </g>

      {/* Envelope back and open flap */}
      <rect x="60" y="112" width="200" height="116" rx="14" fill="var(--midnight-800)" />
      <path d="M66,114 L160,58 L254,114 Z" fill="var(--accent-600)" stroke="var(--accent-600)" strokeWidth="8" strokeLinejoin="round" />

      {/* Letter */}
      <g className="mail-letter">
        <rect x="82" y="72" width="156" height="120" rx="8" fill="var(--offwhite)" />
        <rect x="100" y="92" width="64" height="8" rx="4" fill="var(--accent)" />
        <rect x="100" y="110" width="120" height="6" rx="3" fill="var(--ice)" />
        <rect x="100" y="124" width="108" height="6" rx="3" fill="var(--ice)" />
        <rect x="100" y="138" width="114" height="6" rx="3" fill="var(--ice)" />
      </g>

      {/* Envelope front pocket */}
      <path
        d="M60,128 L160,184 L260,128 V214 Q260,228 246,228 H74 Q60,228 60,214 Z"
        fill="var(--midnight-700)"
      />
      <path d="M60,214 L132,168 M260,214 L188,168" stroke="var(--blue-300)" strokeOpacity="0.25" strokeWidth="2" strokeLinecap="round" />

      {/* @ badge */}
      <circle className="mail-ping" cx="252" cy="120" r="20" fill="var(--accent)" />
      <circle cx="252" cy="120" r="20" fill="var(--accent)" />
      <text
        x="252"
        y="127"
        textAnchor="middle"
        fontSize="22"
        fontWeight="800"
        fill="var(--midnight)"
        fontFamily="var(--font-barlow), system-ui, sans-serif"
      >
        @
      </text>
    </svg>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-ice">
      <section className="bg-midnight py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 hero-grid-bg opacity-40" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-10 items-center">
          <div>
            <p className="font-sans text-accent text-sm font-semibold uppercase tracking-widest mb-2">Reach Out</p>
            <h1 className="text-5xl font-black text-offwhite leading-tight mb-4">
              Contact <span className="heading-accent">Us</span>
            </h1>
            <p className="text-offwhite/65 text-lg leading-relaxed max-w-md mb-8">
              Questions, ideas, sponsorships, or just want to say hi? Drop us a line
              and the right person on the team will get back to you.
            </p>
            <a href={`mailto:${PRESIDENT.email}`} className="btn btn-solid px-6 py-3.5 text-base">
              <MailIcon className="w-5 h-5" />
              Email the President
            </a>
          </div>

          <MailIllustration />
        </div>
      </section>

      <SectionDivider from="midnight" to="ice" variant="wave" flip />
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
                  key={item.name}
                  href={`mailto:${item.email}`}
                  className="flex items-center gap-4 bg-offwhite border border-ice-400 hover:border-accent hover:-translate-y-0.5 hover:shadow-lg hover:shadow-midnight/10 rounded-xl px-4 py-3.5 transition-all group text-left"
                >
                  {/* The envelope opens on hover, as if the letter is on its way. */}
                  <span className="w-11 h-11 rounded-lg bg-midnight text-offwhite group-hover:bg-accent group-hover:text-midnight flex items-center justify-center flex-shrink-0 transition-colors">
                    <MailIcon className="w-5 h-5 group-hover:hidden" />
                    <MailOpenIcon className="w-5 h-5 hidden group-hover:block" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-sans text-xs font-semibold text-muted uppercase tracking-widest">
                      {item.role}
                    </p>
                    <p className="text-midnight font-semibold text-sm mt-0.5 truncate">{item.email}</p>
                  </div>
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
