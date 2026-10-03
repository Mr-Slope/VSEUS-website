import React from 'react';
import Image from 'next/image';
import { PRESIDENT, VPS, type Exec, type VPExec } from '@/lib/execs';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { SectionDivider } from '@/components/ui/SectionDivider';

/** Photo if supplied, otherwise the dashed placeholder — same footprint either way. */
function ExecPhoto({ exec, className }: { exec: Exec; className: string }) {
  if (exec.photo) {
    return (
      <div className={`relative ${className}`}>
        <Image
          src={exec.photo}
          alt={exec.name}
          fill
          sizes="160px"
          className="object-cover rounded-[inherit]"
          style={exec.photoPosition ? { objectPosition: exec.photoPosition } : undefined}
        />
      </div>
    );
  }
  return <ImagePlaceholder label="Photo" tone="dark" hideIcon className={className} />;
}

const reports = [
  { title: '2026-2027 Start of the Year Budgetary Financial Report', type: 'Annual', href: '/reports/2026-2027-start-of-year-budgetary-report.pdf' },
  { title: '2025-2026 Semester 1 Budgetary Report',       type: 'Semester', href: '/reports/2025-2026-semester-1-budgetary-report.pdf' },
  { title: 'November 2025 External Monthly Budgetary Report',  type: 'Monthly',  href: '/reports/2025-11-external-monthly-budgetary-report.pdf' },
  { title: 'October 2025 External Monthly Budgetary Report',   type: 'Monthly',  href: '/reports/2025-10-external-monthly-budgetary-report.pdf' },
  { title: 'September 2025 External Monthly Budgetary Report', type: 'Monthly',  href: '/reports/2025-09-external-monthly-budgetary-report.pdf' },
];

/*
  Orbital layout constants.

  Six VPs sit on a circle around the president at 60° intervals, starting
  straight up, and each VP's Assistant VPs sit on the far side of that VP
  from the president. Every line from the president therefore ends on a VP,
  and the AVPs form an outer ring:
    top VP           → AVPs stacked above it
    bottom VP        → AVPs stacked below it
    four diagonals   → AVPs beside it, on the outer side, in a column
                       centred on the VP (two AVPs make a triangle with it)

  Cards are vertical (photo on top) so the side AVPs fit across the width.
  Geometry at R=330, VP 208×220, AVP 180×190, PRES 250×256:
    diagonal VP centre                    → (±285.8, ∓165)
    diagonal VP inner edge (181.8) vs president edge (125)  → 57px
    top VP inner edge (-220) vs president top (-128)        → 92px
    top VP side (104) vs upper diagonal inner edge (181.8)  → 78px
    side AVP outer edge                   → 285.8 + 104 + SIDE_GAP + 180 = 597.8

  So the content is 1195.6px wide, and with PAD on each side the container
  stays inside the 1216px of content width available at the xl breakpoint.
  Height is whatever the stacks need: the container is sized from the
  furthest card in each direction, so adding an AVP grows it rather than
  clipping it. Two AVPs beside an upper diagonal, or three beside any
  diagonal, would run into the neighbouring column and need a rethink.

  The orbital only renders at xl and up. Below that it would overflow, so a
  responsive card grid takes over.
*/
const R = 330;
const PRES_W = 250, PRES_H = 256;
const VP_W = 208, VP_H = 220;
const AVP_W = 180, AVP_H = 190;
/** Horizontal gap between a diagonal VP and the AVPs beside it. */
const SIDE_GAP = 28;
/** Vertical gap between stacked cards (top/bottom stacks and side columns). */
const STACK_GAP = 20;
const PAD = 8;

/** Positions relative to the president at (0, 0); shifted into the container below. */
const vpRel = VPS.map((vp, i) => {
  const rad = ((i * 360) / VPS.length - 90) * (Math.PI / 180);
  return { ...vp, i, x: R * Math.cos(rad), y: R * Math.sin(rad) };
});

/**
 * `path` draws the connector to this AVP, given the president's position, so
 * it can be built once that position is known.
 */
const avpRel = vpRel.flatMap((vp) => {
  const avps = vp.avps ?? [];
  // Top and bottom VPs have x ≈ 0 (cos 90° is only nearly zero in floating point).
  if (Math.abs(vp.x) < 1) {
    const dir = Math.sign(vp.y);
    return avps.map((avp, k) => {
      const y = vp.y + dir * (VP_H / 2 + STACK_GAP + AVP_H / 2 + k * (AVP_H + STACK_GAP));
      const near = y - dir * (AVP_H / 2);
      const path = (cx: number, cy: number) =>
        `M ${cx + vp.x} ${cy + near - dir * STACK_GAP} L ${cx + vp.x} ${cy + near}`;
      return { ...avp, x: vp.x, y, path };
    });
  }
  // Diagonal VPs: a column beside the VP, joined by an elbow from the VP's outer edge.
  const side = Math.sign(vp.x);
  const x = vp.x + side * (VP_W / 2 + SIDE_GAP + AVP_W / 2);
  const edge = vp.x + side * (VP_W / 2);
  const spine = vp.x + side * (VP_W / 2 + SIDE_GAP / 2);
  const avpEdge = x - side * (AVP_W / 2);
  return avps.map((avp, k) => {
    const y = vp.y + (k - (avps.length - 1) / 2) * (AVP_H + STACK_GAP);
    const path = (cx: number, cy: number) =>
      `M ${cx + edge} ${cy + vp.y} H ${cx + spine} V ${cy + y} H ${cx + avpEdge}`;
    return { ...avp, x, y, path };
  });
});

const boxes = [
  { x: 0, y: 0, w: PRES_W, h: PRES_H },
  ...vpRel.map((v) => ({ x: v.x, y: v.y, w: VP_W, h: VP_H })),
  ...avpRel.map((a) => ({ x: a.x, y: a.y, w: AVP_W, h: AVP_H })),
];
const minX = Math.min(...boxes.map((b) => b.x - b.w / 2));
const maxX = Math.max(...boxes.map((b) => b.x + b.w / 2));
const minY = Math.min(...boxes.map((b) => b.y - b.h / 2));
const maxY = Math.max(...boxes.map((b) => b.y + b.h / 2));

const CONTAINER_W = Math.ceil(maxX - minX + 2 * PAD);
const CONTAINER_H = Math.ceil(maxY - minY + 2 * PAD);
const CX = PAD - minX, CY = PAD - minY;

const vpNodes = vpRel.map((vp) => ({ ...vp, x: CX + vp.x, y: CY + vp.y }));
const avpNodes = avpRel.map(({ path, ...avp }) => ({ ...avp, x: CX + avp.x, y: CY + avp.y, d: path(CX, CY) }));

/** The president's orange glow, shared by the president and VP cards. */
const GLOW =
  'border-2 border-accent/60 shadow-[0_0_60px_rgba(237,177,135,0.3)] hover:shadow-[0_0_80px_rgba(237,177,135,0.45)]';

/** AVP cards get a quiet border and no glow, so the VPs read as the leads. */
const AVP_BORDER = 'border-2 border-accent/25 hover:border-accent/40';

const ORBIT_D = `M ${CX} ${CY - R} A ${R} ${R} 0 1 1 ${CX - 0.001} ${CY - R}`;

/** Wide card used in the responsive grid below xl. */
function ExecCard({ exec, size = 'vp' }: { exec: Exec; size?: 'featured' | 'vp' | 'avp' }) {
  const photo = { featured: 'w-40 h-40', vp: 'w-32 h-32', avp: 'w-24 h-24' }[size];
  return (
    <div
      className={`flex items-center gap-5 rounded-2xl backdrop-blur-sm transition-all duration-500 p-5 ${size === 'avp' ? AVP_BORDER : GLOW} ${
        size === 'featured' ? 'bg-midnight-800/90' : 'bg-midnight-800/70'
      }`}
    >
      <ExecPhoto exec={exec} className={`rounded-xl flex-shrink-0 ${photo}`} />
      <div className="min-w-0">
        <p className={`text-offwhite font-bold leading-tight ${size === 'featured' ? 'text-2xl' : 'text-lg'}`}>
          {exec.name}
        </p>
        <p className={`font-display font-semibold mt-1.5 ${size === 'featured' ? 'text-accent text-base whitespace-nowrap' : 'text-accent/85 text-sm'}`}>
          {exec.role}
        </p>
      </div>
    </div>
  );
}

/** A VP with their AVPs stacked directly beneath, for the grid below xl. */
function VpColumn({ vp }: { vp: VPExec }) {
  return (
    <div className="space-y-4">
      <ExecCard exec={vp} />
      {vp.avps?.map((avp) => (
        <div key={avp.name} className="relative pl-6">
          <span className="absolute left-2 -top-4 bottom-1/2 w-3 border-l-2 border-b-2 border-accent/50 rounded-bl-lg" />
          <ExecCard exec={avp} size="avp" />
        </div>
      ))}
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ice">

      {/* Mission */}
      <section className="py-24 bg-ice">
        <div id="mission" className="anchor-offset max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="font-sans text-sm font-semibold text-midnight-700 uppercase tracking-widest mb-4">
              Our Mission
            </p>
            <h1 className="text-5xl sm:text-6xl font-black text-midnight mb-8 leading-[1.05]">
              A place to <span className="heading-accent">belong.</span>
            </h1>
            <p className="text-midnight/85 leading-relaxed text-xl mb-6">
              The Vancouver School of Economics Undergraduate Society (VSEUS) was founded in 2014 to build an economics community at UBC by creating and facilitating spaces where students are comfortable with one another, can share their stories, and can form the relationships a community is made of.
            </p>
            <p className="text-muted leading-relaxed text-lg mb-6">
              A community like that has to answer to the people in it. We keep a clear feedback channel between the VSEUS Council and our members, to know which issues genuinely matter to our constituents while ensuring transparency about what we do next.
            </p>
            <p className="text-muted leading-relaxed text-lg">
              We look outward, learning from other groups who share that vision, and inward, opening volunteer roles so members can help run the society rather than watch it from a distance. We build traditions strong enough to outlast any one cohort, so students feel proud to belong to the economics community at UBC.
            </p>
          </div>
        </div>
      </section>

      <SectionDivider from="ice" to="midnight" variant="ripple" />
      {/* Executives */}
      <section className="py-20 bg-midnight relative overflow-hidden">
        <div className="absolute inset-0 hero-grid-bg opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/60 via-transparent to-midnight/60 pointer-events-none" />

        <div id="executives" className="anchor-offset relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="font-sans text-accent text-xs font-semibold uppercase tracking-widest mb-3">Leadership</p>
            <h2 className="text-3xl font-black text-offwhite">Executive Team 2026-27</h2>
            <p className="text-offwhite/40 text-sm mt-3 max-w-xs mx-auto leading-relaxed">
              Seven leaders. One mission. Driving economics forward at UBC.
            </p>
          </div>

          {/* Orbital layout — xl and up only */}
          <div className="hidden xl:flex justify-center">
            <div className="relative" style={{ width: CONTAINER_W, height: CONTAINER_H }}>

              <svg
                className="absolute inset-0 pointer-events-none"
                width={CONTAINER_W}
                height={CONTAINER_H}
                viewBox={`0 0 ${CONTAINER_W} ${CONTAINER_H}`}
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
                  <filter id="lineGlow" filterUnits="userSpaceOnUse" x="-20" y="-20" width={CONTAINER_W + 40} height={CONTAINER_H + 40}>
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="dotGlow" filterUnits="userSpaceOnUse" x="-20" y="-20" width={CONTAINER_W + 40} height={CONTAINER_H + 40}>
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>

                {/* Dashed orbit ring */}
                <ellipse
                  cx={CX} cy={CY} rx={R} ry={R}
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
                        stroke="rgba(237,177,135,0.5)"
                        strokeWidth="2"
                        filter="url(#lineGlow)"
                      />
                      {/* Node dot on orbit ring */}
                      <circle cx={vp.x} cy={vp.y} r="5" fill="rgba(237,177,135,0.45)" />
                      {/* Primary traveling dot */}
                      <circle r="4" fill="rgba(237,177,135,1)" filter="url(#dotGlow)">
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
                      <circle r="2.4" fill="rgba(247,218,197,0.85)">
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

                {/* Connector from each VP (or the AVP nearer it) to its AVP */}
                {avpNodes.map((avp) => (
                  <path
                    key={avp.name}
                    d={avp.d}
                    stroke="rgba(237,177,135,0.5)"
                    strokeWidth="2"
                    filter="url(#lineGlow)"
                  />
                ))}
              </svg>

              {/* President card at center */}
              <div
                className="absolute flex flex-col items-center justify-center text-center px-4 rounded-2xl border-2 border-accent/60 bg-midnight-800/95 backdrop-blur-sm shadow-[0_0_60px_rgba(237,177,135,0.3)] hover:shadow-[0_0_80px_rgba(237,177,135,0.45)] transition-shadow duration-500 z-10"
                style={{
                  width:  PRES_W,
                  height: PRES_H,
                  left:   CX - PRES_W / 2,
                  top:    CY - PRES_H / 2,
                }}
              >
                <ExecPhoto exec={PRESIDENT} className="w-[150px] h-[150px] rounded-xl flex-shrink-0" />
                <p className="text-offwhite font-bold text-xl leading-tight mt-3">{PRESIDENT.name}</p>
                <p className="font-display text-accent text-base font-semibold mt-1">{PRESIDENT.role}</p>
              </div>

              {/* VP cards */}
              {vpNodes.map((vp) => (
                <div
                  key={vp.name}
                  className={`absolute flex flex-col items-center justify-center text-center px-4 rounded-xl bg-midnight-800/85 backdrop-blur-sm hover:bg-midnight-700/90 transition-all duration-500 cursor-default z-10 ${GLOW}`}
                  style={{
                    width:  VP_W,
                    height: VP_H,
                    left:   vp.x - VP_W / 2,
                    top:    vp.y - VP_H / 2,
                  }}
                >
                  <ExecPhoto exec={vp} className="w-[112px] h-[112px] rounded-lg flex-shrink-0" />
                  <p className="text-offwhite font-bold text-base leading-tight mt-3">{vp.name}</p>
                  <p className="font-display text-accent/85 text-xs font-semibold mt-1.5 whitespace-nowrap">{vp.role}</p>
                </div>
              ))}

              {/* AVP cards, on the far side of their VP, with smaller photos */}
              {avpNodes.map((avp) => (
                <div
                  key={avp.name}
                  className={`absolute flex flex-col items-center justify-center text-center px-3 rounded-xl bg-midnight-800/85 backdrop-blur-sm hover:bg-midnight-700/90 transition-all duration-500 cursor-default z-10 ${AVP_BORDER}`}
                  style={{
                    width:  AVP_W,
                    height: AVP_H,
                    left:   avp.x - AVP_W / 2,
                    top:    avp.y - AVP_H / 2,
                  }}
                >
                  <ExecPhoto exec={avp} className="w-[80px] h-[80px] rounded-lg flex-shrink-0" />
                  <p className="text-offwhite font-bold text-sm leading-tight mt-2.5">{avp.name}</p>
                  <p className="font-display text-accent/85 text-xs font-semibold leading-snug mt-1">{avp.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Responsive grid below xl */}
          <div className="xl:hidden space-y-4">
            <div className="sm:max-w-md sm:mx-auto">
              <ExecCard exec={PRESIDENT} size="featured" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              {VPS.map((vp) => (
                <VpColumn key={vp.name} vp={vp} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionDivider from="midnight" to="ice" variant="drift" flip />
      {/* Reports */}
      <section className="py-24 bg-ice">
        <div id="reports" className="anchor-offset max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl">
            <p className="font-sans text-sm font-semibold text-midnight-700 uppercase tracking-widest mb-3">
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
