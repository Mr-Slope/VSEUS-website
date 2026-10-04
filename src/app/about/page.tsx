import React from 'react';
import Image from 'next/image';
import { PRESIDENT, VPS, type Exec } from '@/lib/execs';
import { Reveal } from '@/components/ui/Reveal';
import { SectionDivider } from '@/components/ui/SectionDivider';

const reports = [
  { title: '2026-2027 Start of the Year Budgetary Financial Report', type: 'Annual', href: '/reports/2026-2027-start-of-year-budgetary-report.pdf' },
  { title: '2025-2026 Semester 1 Budgetary Report',       type: 'Semester', href: '/reports/2025-2026-semester-1-budgetary-report.pdf' },
  { title: 'November 2025 External Monthly Budgetary Report',  type: 'Monthly',  href: '/reports/2025-11-external-monthly-budgetary-report.pdf' },
  { title: 'October 2025 External Monthly Budgetary Report',   type: 'Monthly',  href: '/reports/2025-10-external-monthly-budgetary-report.pdf' },
  { title: 'September 2025 External Monthly Budgetary Report', type: 'Monthly',  href: '/reports/2025-09-external-monthly-budgetary-report.pdf' },
];

/*
  The executive tiers, most senior first, laid out like the Economic Review's
  Our Team page: a heading per tier, then a centred, wrapping row of people.
*/
const TIERS: { title: string; members: Exec[]; lead: boolean }[] = [
  { title: 'President', members: [PRESIDENT], lead: true },
  { title: 'Vice Presidents', members: VPS, lead: true },
  { title: 'Assistant Vice Presidents', members: VPS.flatMap((vp) => vp.avps ?? []), lead: false },
];

/*
  Column widths for a centred, wrapping row, matching the team page. Flex
  rather than grid, so a tier with fewer people still sits in the middle.
  Each width subtracts its share of the gap-x-6 (1.5rem) gutters. Leads stop
  at three across so their larger photos keep some room.
*/
const LEAD_WIDTH = 'w-full max-w-sm sm:w-[calc((100%_-_1.5rem)/2)] lg:w-[calc((100%_-_3rem)/3)]';
const MEMBER_WIDTH =
  'w-full max-w-sm sm:w-[calc((100%_-_1.5rem)/2)] lg:w-[calc((100%_-_3rem)/3)] xl:w-[calc((100%_-_4.5rem)/4)]';

/** Circular headshot, or a silhouette in the same circle when there's no photo yet. */
function ExecPhoto({ exec, lead }: { exec: Exec; lead: boolean }) {
  return (
    <div
      className={[
        'relative flex-shrink-0 rounded-full overflow-hidden bg-midnight-800',
        'ring-2 ring-transparent transition-shadow duration-200',
        'group-hover:ring-accent group-hover:shadow-xl group-hover:shadow-accent/15',
        lead ? 'w-44 h-44' : 'w-38 h-38',
      ].join(' ')}
    >
      {exec.photo ? (
        <Image
          src={exec.photo}
          alt={exec.name}
          fill
          sizes={lead ? '176px' : '152px'}
          className="object-cover"
          style={{ objectPosition: exec.photoPosition ?? 'center 20%' }}
        />
      ) : (
        <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
          <path fill="#4B5563" d="M12 100C12 72 29 57 50 57s38 15 38 43z" />
          <circle cx="50" cy="33" r="25" fill="#4B5563" stroke="var(--midnight-800)" strokeWidth="3" />
        </svg>
      )}
    </div>
  );
}

function ExecMember({ exec, lead }: { exec: Exec; lead: boolean }) {
  return (
    <div className="group flex flex-col items-center text-center transition-transform duration-200 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <ExecPhoto exec={exec} lead={lead} />
      <h4
        className={[
          'font-normal text-offwhite leading-tight mt-5',
          lead ? 'text-[1.75rem]' : 'text-2xl',
        ].join(' ')}
      >
        {exec.name}
      </h4>
      <p className="font-display text-lg text-accent leading-snug mt-1">{exec.role}</p>
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

          {/* Tiers, most senior first, each closed off by a thin accent rule. */}
          {TIERS.map((tier) => {
            if (tier.members.length === 0) return null;
            return (
              <div key={tier.title} className="py-14 border-b border-accent/40">
                <h3 className="text-xl font-bold text-offwhite/60 mb-10">{tier.title}</h3>

                <div className="flex flex-wrap justify-center gap-x-6 gap-y-14">
                  {tier.members.map((exec, i) => (
                    <Reveal
                      key={exec.name}
                      delay={i * 80}
                      className={tier.lead ? LEAD_WIDTH : MEMBER_WIDTH}
                    >
                      <ExecMember exec={exec} lead={tier.lead} />
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
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
