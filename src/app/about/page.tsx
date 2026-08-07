import React from 'react';
import { PRESIDENT, VPS, type Exec } from '@/lib/execs';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';

const reports = [
  { title: 'Annual Report 2024-25',         type: 'Annual',  href: '#' },
  { title: 'Budget Report: March 2025',     type: 'Monthly', href: '#' },
  { title: 'Budget Report: February 2025',  type: 'Monthly', href: '#' },
  { title: 'Hiring Statistics 2024-25',     type: 'Hiring',  href: '#' },
];

/*
  Orbital layout constants.

  Cards are wide and horizontal (square photo left, text right), so the ring
  has to be big enough to keep them apart: with six VPs at R = 360 the chord
  between neighbours is 2·R·sin(30°) = 360px against a 240px card, leaving
  120px of clearance. Max extent is CX + R + CARD_W/2 = 1005px, inside the
  1050px container.

  The orbital only renders at xl and up. Below that it would overflow, so a
  responsive card grid takes over.
*/
const CX = 525, CY = 525, R = 360;
const CONTAINER = 1050;
const CARD_W = 240, CARD_H = 150;
const PRES_W = 280, PRES_H = 200;

const vpNodes = VPS.map((vp, i) => {
  const deg = (i * 360) / VPS.length - 90;
  const rad = deg * (Math.PI / 180);
  return { ...vp, x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad), i };
});

const ORBIT_D = `M ${CX} ${CY - R} A ${R} ${R} 0 1 1 ${CX - 0.001} ${CY - R}`;

/** Wide card used in the responsive grid below xl. */
function ExecCard({ exec, featured = false }: { exec: Exec; featured?: boolean }) {
  return (
    <div
      className={`flex items-center gap-5 rounded-2xl backdrop-blur-sm transition-all duration-300 p-5 ${
        featured
          ? 'bg-midnight-800/90 border-2 border-accent/60 shadow-[0_0_40px_rgba(237,177,135,0.18)]'
          : 'bg-midnight-800/70 border border-offwhite/10 hover:border-accent/40'
      }`}
    >
      {/* TODO: replace with <Image src={`/exec/${…}.jpg`} … /> once photos are supplied */}
      <ImagePlaceholder
        label="Photo"
        tone="dark"
        hideIcon
        className={`rounded-xl flex-shrink-0 ${featured ? 'w-28 h-28' : 'w-24 h-24'}`}
      />
      <div className="min-w-0">
        <p className={`text-offwhite font-bold leading-tight ${featured ? 'text-xl' : 'text-lg'}`}>
          {exec.name}
        </p>
        <p className={`font-display font-semibold mt-1 ${featured ? 'text-accent text-base' : 'text-accent/85 text-sm'}`}>
          {exec.role}
        </p>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ice">

      {/* Mission */}
      <section id="mission" className="py-24 bg-ice">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="font-display text-sm font-semibold text-midnight-700 uppercase tracking-widest mb-4">
              Our Mission
            </p>
            <h1 className="text-5xl sm:text-6xl font-black text-midnight mb-8 leading-[1.05]">
              Every economics student at UBC, supported.
            </h1>
            <p className="text-midnight/85 leading-relaxed text-xl mb-6">
              The Vancouver School of Economics Undergraduate Society (VSEUS) was founded in 2014 with a single goal: to ensure that every economics student at UBC has access to the resources, community, and opportunities they need to thrive academically, professionally, and socially.
            </p>
            <p className="text-muted leading-relaxed text-lg">
              We believe that economics education extends beyond the classroom. Through competitions, workshops, networking events, and advocacy, we help students build the real-world skills and connections that define a successful career in economics, finance, and public policy.
            </p>
          </div>
        </div>
      </section>

      {/* Executives */}
      <section id="executives" className="py-20 bg-midnight relative overflow-hidden">
        <div className="absolute inset-0 hero-grid-bg opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/60 via-transparent to-midnight/60 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="font-display text-accent text-xs font-semibold uppercase tracking-widest mb-3">Leadership</p>
            <h2 className="text-3xl font-black text-offwhite">Executive Team 2026-27</h2>
            <p className="text-offwhite/40 text-sm mt-3 max-w-xs mx-auto leading-relaxed">
              Seven leaders. One mission. Driving economics forward at UBC.
            </p>
          </div>

          {/* Orbital layout — xl and up only */}
          <div className="hidden xl:flex justify-center">
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
                  stroke="rgba(237,177,135,0.18)"
                  strokeWidth="1"
                  strokeDasharray="6 12"
                />

                {/* Pulsing rings from president */}
                <circle cx={CX} cy={CY} r="100" stroke="rgba(237,177,135,0.28)" strokeWidth="1.5">
                  <animate attributeName="r"       values="100;145;100"  dur="3.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.28;0;0.28"  dur="3.4s" repeatCount="indefinite" />
                </circle>
                <circle cx={CX} cy={CY} r="100" stroke="rgba(237,177,135,0.14)" strokeWidth="1">
                  <animate attributeName="r"       values="100;170;100"  dur="3.4s" begin="1.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.14;0;0.14"  dur="3.4s" begin="1.2s" repeatCount="indefinite" />
                </circle>

                {/* Slow ambient particles tracing the orbit */}
                {[0, 7, 14].map((offset, k) => (
                  <circle key={k} r="3" fill="rgba(237,177,135,0.25)" filter="url(#dotGlow)">
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
                        stroke="rgba(237,177,135,0.35)"
                        strokeWidth="1.5"
                        filter="url(#lineGlow)"
                      />
                      {/* Node dot on orbit ring */}
                      <circle cx={vp.x} cy={vp.y} r="4" fill="rgba(237,177,135,0.3)" />
                      {/* Primary traveling dot */}
                      <circle r="3" fill="rgba(237,177,135,1)" filter="url(#dotGlow)">
                        <animateMotion
                          dur="3s"
                          begin="0s"
                          repeatCount="indefinite"
                          path={lineD}
                        />
                        <animate
                          attributeName="opacity"
                          values="0;1;1;0"
                          keyTimes="0;0.08;0.88;1"
                          dur="3s"
                          begin="0s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      {/* Secondary trailing dot */}
                      <circle r="1.8" fill="rgba(247,218,197,0.8)">
                        <animateMotion
                          dur="3s"
                          begin="1.5s"
                          repeatCount="indefinite"
                          path={lineD}
                        />
                        <animate
                          attributeName="opacity"
                          values="0;0.8;0.8;0"
                          keyTimes="0;0.08;0.88;1"
                          dur="3s"
                          begin="1.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </g>
                  );
                })}
              </svg>

              {/* President card at center */}
              <div
                className="absolute flex items-center gap-4 px-5 rounded-2xl border-2 border-accent/60 bg-midnight-800/95 backdrop-blur-sm shadow-[0_0_60px_rgba(237,177,135,0.3)] hover:shadow-[0_0_80px_rgba(237,177,135,0.45)] transition-shadow duration-500 z-10"
                style={{
                  width:  PRES_W,
                  height: PRES_H,
                  left:   CX - PRES_W / 2,
                  top:    CY - PRES_H / 2,
                }}
              >
                <ImagePlaceholder
                  label="Photo"
                  tone="dark"
                  hideIcon
                  className="w-28 h-28 rounded-xl flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-offwhite font-bold text-lg leading-tight">{PRESIDENT.name}</p>
                  <p className="font-display text-accent text-sm font-semibold mt-1.5">{PRESIDENT.role}</p>
                </div>
              </div>

              {/* VP cards */}
              {vpNodes.map((vp) => (
                <div
                  key={vp.name}
                  className="absolute flex items-center gap-4 px-4 rounded-xl border border-offwhite/10 bg-midnight-800/85 backdrop-blur-sm hover:border-accent/40 hover:bg-midnight-700/90 hover:-translate-y-1.5 hover:shadow-[0_10px_36px_rgba(237,177,135,0.2)] transition-all duration-300 cursor-default"
                  style={{
                    width:  CARD_W,
                    height: CARD_H,
                    left:   vp.x - CARD_W / 2,
                    top:    vp.y - CARD_H / 2,
                  }}
                >
                  <ImagePlaceholder
                    label="Photo"
                    tone="dark"
                    hideIcon
                    className="w-24 h-24 rounded-lg flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-offwhite font-bold text-base leading-tight">{vp.name}</p>
                    <p className="font-display text-accent/85 text-xs font-semibold mt-1.5">{vp.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Responsive grid below xl */}
          <div className="xl:hidden space-y-4">
            <div className="sm:max-w-md sm:mx-auto">
              <ExecCard exec={PRESIDENT} featured />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {VPS.map((vp) => (
                <ExecCard key={vp.name} exec={vp} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reports */}
      <section id="reports" className="py-24 bg-ice">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl">
            <p className="font-display text-sm font-semibold text-midnight-700 uppercase tracking-widest mb-3">
              Accountability
            </p>
            <h2 className="text-4xl font-black text-midnight mb-4">Reports</h2>
            <p className="text-muted mb-10 text-lg max-w-2xl">
              VSEUS is committed to full financial transparency. Every budget, annual
              report, and hiring summary we produce is published here for any student
              to read.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.map((r) => (
                <a
                  key={r.title}
                  href={r.href}
                  className="flex items-center justify-between gap-4 bg-offwhite border border-ice-400 hover:border-accent hover:shadow-lg hover:shadow-midnight/10 text-midnight rounded-2xl px-7 py-6 transition-all group"
                >
                  <div>
                    <p className="font-display font-semibold text-lg leading-snug">{r.title}</p>
                    <p className="text-sm text-muted mt-1">{r.type} Report · PDF</p>
                  </div>
                  <span className="w-11 h-11 rounded-xl bg-ice group-hover:bg-accent flex items-center justify-center flex-shrink-0 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
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
