import React from 'react';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Reveal } from '@/components/ui/Reveal';
import { socials } from '@/components/ui/SocialIcons';
import { PUBLICATION } from '@/lib/economicreview/content';
import { ALUMNI, TEAM, TEAM_TIERS, type TeamMember } from '@/lib/economicreview/team';

export const metadata: Metadata = {
  title: 'Our Team',
  description:
    'The students who write, edit, and publish the Vancouver Economic Review each week, and the alumni who came before them.',
};

/** The same mark the footer and contact page use, so the site has one LinkedIn glyph. */
const LINKEDIN_ICON = socials.find((s) => s.label === 'LinkedIn')?.icon;

/*
  Column widths for a centred, wrapping row. Flex rather than grid, so a tier
  with fewer people still sits in the middle instead of hugging the left edge.
  Each width subtracts its share of the gap-x-6 (1.5rem) gutters. Vice
  Presidents stop at three across so their larger photos keep some room.
*/
const LEAD_WIDTH = 'w-full max-w-sm sm:w-[calc((100%_-_1.5rem)/2)] lg:w-[calc((100%_-_3rem)/3)]';
const MEMBER_WIDTH =
  'w-full max-w-sm sm:w-[calc((100%_-_1.5rem)/2)] lg:w-[calc((100%_-_3rem)/3)] xl:w-[calc((100%_-_4.5rem)/4)]';

/**
 * Circular headshot, or a grey silhouette in the same circle when there's no
 * photo yet. The silhouette's greys are matched to the reference placeholder
 * rather than the palette, so it reads as "photo to come" and not as artwork.
 */
function MemberPhoto({ member, lead }: { member: TeamMember; lead: boolean }) {
  return (
    <div
      className={[
        'relative flex-shrink-0 rounded-full overflow-hidden bg-[#EDEDED]',
        'ring-2 ring-transparent transition-shadow duration-200',
        'group-hover:ring-brand-blue group-hover:shadow-xl group-hover:shadow-midnight/15',
        lead ? 'w-44 h-44' : 'w-38 h-38',
      ].join(' ')}
    >
      {member.photo ? (
        <Image
          src={member.photo}
          alt={member.name}
          fill
          sizes={lead ? '176px' : '152px'}
          className="object-cover"
          style={{ objectPosition: member.photoPosition ?? 'center 20%' }}
        />
      ) : (
        <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
          <path fill="#BFBFBF" d="M12 100C12 72 29 57 50 57s38 15 38 43z" />
          <circle cx="50" cy="33" r="25" fill="#BFBFBF" stroke="#EDEDED" strokeWidth="3" />
        </svg>
      )}
    </div>
  );
}

/*
  Names are 24px+ regular in brand-blue-600 because that is the smallest size
  WCAG counts as large text, and 3:1 (what that shade reaches) is the bar for
  large text. Shrinking a name below 24px would need a darker blue.
*/
function Member({ member, lead }: { member: TeamMember; lead: boolean }) {
  return (
    <div className="group flex flex-col items-center text-center transition-transform duration-200 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <MemberPhoto member={member} lead={lead} />
      <h4
        className={[
          'font-normal text-brand-blue-600 leading-tight mt-5',
          lead ? 'text-[1.75rem]' : 'text-2xl',
        ].join(' ')}
      >
        {member.name}
      </h4>
      <p className="font-display text-lg text-midnight leading-snug mt-1">{member.role}</p>

      {member.university && <p className="text-sm text-muted mt-2">{member.university}</p>}

      {member.linkedin && LINKEDIN_ICON && (
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name} on LinkedIn`}
          className="mt-2 w-10 h-10 flex items-center justify-center rounded-full text-brand-blue-600 hover:bg-brand-blue/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
        >
          <span className="w-5 h-5">{LINKEDIN_ICON}</span>
        </a>
      )}
    </div>
  );
}

export default function EconomicReviewTeamPage() {
  return (
    <section className="py-16 lg:py-20 bg-offwhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-midnight mb-4 leading-tight">
            Meet the Team
          </h2>
          <p className="text-muted leading-relaxed">
            {PUBLICATION.name} is written, edited, and published by UBC students. Want to write for
            us? Email{' '}
            <a
              href={`mailto:${PUBLICATION.email}`}
              className="text-midnight font-semibold underline decoration-brand-blue decoration-2 underline-offset-2 hover:bg-brand-blue/15 transition-colors"
            >
              {PUBLICATION.email}
            </a>
            .
          </p>
        </div>

        {/* Tiers, most senior first, each closed off by a thin brand-blue rule. */}
        {TEAM_TIERS.map((tier) => {
          const members = TEAM.filter((member) => member.tier === tier.id);
          if (members.length === 0) return null;
          const lead = tier.id === 'vp';

          return (
            <div key={tier.id} className="py-14 border-b border-brand-blue">
              <h3 className="text-xl font-bold text-muted mb-10">{tier.title}</h3>

              <div className="flex flex-wrap justify-center gap-x-6 gap-y-14">
                {members.map((member, i) => (
                  <Reveal
                    key={member.name}
                    delay={i * 80}
                    className={lead ? LEAD_WIDTH : MEMBER_WIDTH}
                  >
                    <Member member={member} lead={lead} />
                  </Reveal>
                ))}
              </div>
            </div>
          );
        })}

        {/* Alumni: one ruled row of names per academic year, newest on top. */}
        <div className="mt-20">
          <h2 className="text-3xl sm:text-4xl font-black text-midnight mb-12 leading-tight">
            Alumni
          </h2>

          <div className="space-y-16">
            {ALUMNI.map((cohort) => (
              <div key={cohort.year}>
                <h3 className="text-xl font-extrabold text-midnight mb-5">{cohort.year}</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-5 border-y border-ice-200 py-5">
                  {cohort.members.map((member) => (
                    <li key={member.name} className="text-center px-3">
                      <p className="font-medium text-midnight">{member.name}</p>
                      <p className="text-xs text-muted mt-0.5">{member.role}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
