'use client';

import React from 'react';
import Link from 'next/link';

const PRESIDENT = { name: 'Yash Dhaundiyal', role: 'President', year: '4th Year BIE + Data Science Minor' };

const VPS = [
  { name: 'Aiden Ng',            role: 'VP Student Life',   year: '3rd Year BIE' },
  { name: 'Mishka Balraj',       role: 'VP Marketing',      year: '3rd Year BIE' },
  { name: 'Sebastian Contreras', role: 'VP Finance',        year: '4th Year BA'  },
  { name: 'Saloni Karla',        role: 'VP Administration', year: '4th Year BA'  },
  { name: 'Grace Ding',          role: 'VP Academics',      year: '2nd Year BIE' },
  { name: 'Nokutenda Dzobo',     role: 'VP External',       year: '2nd Year BIE' },
];

const reports = [
  { title: 'Annual Report 2024-25',         type: 'Annual',  href: '#' },
  { title: 'Budget Report: March 2025',     type: 'Monthly', href: '#' },
  { title: 'Budget Report: February 2025',  type: 'Monthly', href: '#' },
  { title: 'Hiring Statistics 2024-25',     type: 'Hiring',  href: '#' },
];

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

// Orbital layout constants
const CX = 475, CY = 475, R = 310;
const CONTAINER = 950;
const CARD_W = 160, CARD_H = 148;
const PRES_W = 192, PRES_H = 192;

const vpNodes = VPS.map((vp, i) => {
  const deg = (i * 360) / VPS.length - 90;
  const rad = deg * (Math.PI / 180);
  return { ...vp, x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad), i };
});

const ORBIT_D = `M ${CX} ${CY - R} A ${R} ${R} 0 1 1 ${CX - 0.001} ${CY - R}`;

export default function AboutPage() {
  return (
    <div className="min-h-screen">

      {/* Header */}
      <section className="bg-navy-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-2">About VSEUS</p>
          <h1 className="text-4xl font-black text-white">Who We Are</h1>
        </div>
      </section>

      {/* Mission */}
      <section id="mission" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-black text-navy-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-4">
              The Vancouver School of Economics Undergraduate Society (VSEUS) was founded in 2014 with a single goal: to ensure that every economics student at UBC has access to the resources, community, and opportunities they need to thrive academically, professionally, and socially.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We believe that economics education extends beyond the classroom. Through competitions, workshops, networking events, and advocacy, we help students build the real-world skills and connections that define a successful career in economics, finance, and public policy.
            </p>
          </div>
        </div>
      </section>

      {/* Executives */}
      <section id="executives" className="py-20 bg-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 hero-grid-bg opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/60 via-transparent to-navy-900/60 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-3">Leadership</p>
            <h2 className="text-3xl font-black text-white">Executive Team 2024-25</h2>
            <p className="text-white/35 text-sm mt-3 max-w-xs mx-auto leading-relaxed">
              Seven leaders. One mission. Driving economics forward at UBC.
            </p>
          </div>

          {/* Desktop orbital layout */}
          <div className="hidden sm:flex justify-center">
            <div className="relative" style={{ width: CONTAINER, height: CONTAINER }}>

              <svg
                className="absolute inset-0 pointer-events-none"
                width={CONTAINER}
                height={CONTAINER}
                viewBox={`0 0 ${CONTAINER} ${CONTAINER}`}
                fill="none"
              >
                <defs>
                  {/*
                    filterUnits="userSpaceOnUse" with absolute pixel coordinates is required here.
                    The default objectBoundingBox mode makes the filter region proportional to the
                    element's own bounding box — a perfectly vertical line (VP Student Life, VP
                    Administration) has zero width, collapsing the X filter region to zero and
                    clipping those lines entirely. Absolute coords spanning the full SVG fix this.
                  */}
                  <filter id="lineGlow" filterUnits="userSpaceOnUse" x="-20" y="-20" width={CONTAINER + 40} height={CONTAINER + 40}>
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="dotGlow" filterUnits="userSpaceOnUse" x="-20" y="-20" width={CONTAINER + 40} height={CONTAINER + 40}>
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>

                {/* Dashed orbit ring */}
                <circle
                  cx={CX} cy={CY} r={R}
                  stroke="rgba(201,168,76,0.15)"
                  strokeWidth="1"
                  strokeDasharray="6 12"
                />

                {/* Pulsing rings from president */}
                <circle cx={CX} cy={CY} r="80" stroke="rgba(201,168,76,0.25)" strokeWidth="1.5">
                  <animate attributeName="r"       values="80;118;80"    dur="3.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.25;0;0.25"  dur="3.4s" repeatCount="indefinite" />
                </circle>
                <circle cx={CX} cy={CY} r="80" stroke="rgba(201,168,76,0.12)" strokeWidth="1">
                  <animate attributeName="r"       values="80;140;80"    dur="3.4s" begin="1.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.12;0;0.12"  dur="3.4s" begin="1.2s" repeatCount="indefinite" />
                </circle>

                {/* Slow ambient particles tracing the orbit */}
                {[0, 7, 14].map((offset, k) => (
                  <circle key={k} r="3" fill="rgba(201,168,76,0.2)" filter="url(#dotGlow)">
                    <animateMotion dur="24s" begin={`${offset}s`} repeatCount="indefinite" path={ORBIT_D} />
                  </circle>
                ))}

                {/* Connection lines + traveling dots for ALL 6 VPs */}
                {vpNodes.map((vp) => {
                  const lineD = `M ${CX} ${CY} L ${vp.x} ${vp.y}`;
                  return (
                    <g key={vp.i}>
                      {/* Solid line — no gradient so every angle renders correctly */}
                      <path
                        d={lineD}
                        stroke="rgba(201,168,76,0.32)"
                        strokeWidth="1.5"
                        filter="url(#lineGlow)"
                      />
                      {/* Node dot on orbit ring */}
                      <circle cx={vp.x} cy={vp.y} r="4" fill="rgba(201,168,76,0.25)" />
                      {/* Primary traveling dot */}
                      <circle r="3" fill="rgba(201,168,76,1)" filter="url(#dotGlow)">
                        <animateMotion
                          dur="3s"
                          begin={`${vp.i * 0.5}s`}
                          repeatCount="indefinite"
                          path={lineD}
                        />
                        <animate
                          attributeName="opacity"
                          values="0;1;1;0"
                          keyTimes="0;0.08;0.88;1"
                          dur="3s"
                          begin={`${vp.i * 0.5}s`}
                          repeatCount="indefinite"
                        />
                      </circle>
                      {/* Secondary trailing dot */}
                      <circle r="1.8" fill="rgba(222,192,110,0.75)">
                        <animateMotion
                          dur="3s"
                          begin={`${vp.i * 0.5 + 1.5}s`}
                          repeatCount="indefinite"
                          path={lineD}
                        />
                        <animate
                          attributeName="opacity"
                          values="0;0.75;0.75;0"
                          keyTimes="0;0.08;0.88;1"
                          dur="3s"
                          begin={`${vp.i * 0.5 + 1.5}s`}
                          repeatCount="indefinite"
                        />
                      </circle>
                    </g>
                  );
                })}
              </svg>

              {/* President card at center */}
              <div
                className="absolute flex flex-col items-center justify-center text-center rounded-2xl border-2 border-gold/60 bg-navy-800/90 backdrop-blur-sm shadow-[0_0_60px_rgba(201,168,76,0.28)] hover:shadow-[0_0_80px_rgba(201,168,76,0.45)] transition-shadow duration-500 z-10"
                style={{
                  width:  PRES_W,
                  height: PRES_H,
                  left:   CX - PRES_W / 2,
                  top:    CY - PRES_H / 2,
                }}
              >
                <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center text-navy-900 font-black text-xl mb-3 shadow-[0_0_28px_rgba(201,168,76,0.65)]">
                  {initials(PRESIDENT.name)}
                </div>
                <p className="text-white font-bold text-sm leading-tight px-3">{PRESIDENT.name}</p>
                <p className="text-gold text-xs font-semibold mt-1.5">{PRESIDENT.role}</p>
                <p className="text-white/35 text-[10px] mt-1 px-3 leading-tight">{PRESIDENT.year}</p>
              </div>

              {/* VP cards */}
              {vpNodes.map((vp) => (
                <div
                  key={vp.name}
                  className="absolute flex flex-col items-center justify-center text-center rounded-xl border border-white/10 bg-navy-800/80 backdrop-blur-sm hover:border-gold/40 hover:bg-navy-700/90 hover:-translate-y-1.5 hover:shadow-[0_10px_36px_rgba(201,168,76,0.18)] transition-all duration-300 cursor-default"
                  style={{
                    width:  CARD_W,
                    height: CARD_H,
                    left:   vp.x - CARD_W / 2,
                    top:    vp.y - CARD_H / 2,
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-navy-700 border border-white/15 flex items-center justify-center text-white/80 font-bold text-sm mb-2.5">
                    {initials(vp.name)}
                  </div>
                  <p className="text-white font-bold text-xs leading-tight px-3">{vp.name}</p>
                  <p className="text-gold/80 text-[11px] font-medium mt-1.5">{vp.role}</p>
                  <p className="text-white/30 text-[9.5px] mt-1 px-3 leading-tight">{vp.year}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile fallback */}
          <div className="sm:hidden space-y-3">
            <div className="bg-navy-800 border-2 border-gold/50 rounded-2xl p-5 flex items-center gap-4 shadow-[0_0_30px_rgba(201,168,76,0.15)]">
              <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center text-navy-900 font-black text-base flex-shrink-0">
                {initials(PRESIDENT.name)}
              </div>
              <div>
                <p className="text-white font-bold text-sm">{PRESIDENT.name}</p>
                <p className="text-gold text-xs font-semibold">{PRESIDENT.role}</p>
                <p className="text-white/45 text-xs mt-0.5">{PRESIDENT.year}</p>
              </div>
            </div>
            {VPS.map(vp => (
              <div key={vp.name} className="bg-navy-800/80 border border-white/10 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-navy-700 border border-white/15 flex items-center justify-center text-white/80 font-bold text-xs flex-shrink-0">
                  {initials(vp.name)}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{vp.name}</p>
                  <p className="text-gold/80 text-xs font-medium">{vp.role}</p>
                  <p className="text-white/40 text-xs mt-0.5">{vp.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financial Reports */}
      <section id="reports" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-black text-navy-900 mb-2">Transparency Reports</h2>
            <p className="text-gray-500 mb-8 text-sm">
              VSEUS is committed to full financial transparency. All reports are publicly available.
            </p>
            <div className="space-y-3">
              {reports.map((r) => (
                <a
                  key={r.title}
                  href={r.href}
                  className="flex items-center justify-between bg-navy-100 hover:bg-navy-700 text-navy-900 hover:text-white rounded-xl px-5 py-4 transition-all group"
                >
                  <div>
                    <p className="font-medium text-sm">{r.title}</p>
                    <p className="text-xs opacity-60 mt-0.5">{r.type} Report</p>
                  </div>
                  <svg className="w-4 h-4 opacity-50 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section id="partners" className="py-16 bg-navy-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-navy-900 mb-4">Our Partners</h2>
          <p className="text-gray-600 mb-8 max-w-2xl">
            We partner with leading financial institutions, consulting firms, and professional organizations to create opportunities for our members.
          </p>
          <div className="flex flex-wrap gap-3">
            {['TD Bank', 'RBC', 'Scotiabank', 'Bank of Canada', 'Deloitte', 'KPMG', 'University of British Columbia', 'Sauder School of Business'].map((p) => (
              <span key={p} className="bg-white border border-navy-100 text-navy-700 font-semibold text-sm px-4 py-2 rounded-full">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-navy-700 text-center">
        <h2 className="text-2xl font-black text-white mb-3">Join Our Team</h2>
        <p className="text-white/70 mb-6 text-sm">Applications for the 2025-26 executive team open in September.</p>
        <Link href="/contact" className="inline-flex items-center bg-gold text-navy-900 font-semibold px-6 py-3 rounded-lg hover:bg-gold-light transition-colors text-sm">
          Get in Touch
        </Link>
      </section>

    </div>
  );
}
