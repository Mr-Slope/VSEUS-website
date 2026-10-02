import React from 'react';
import type { Metadata } from 'next';
import { Reveal } from '@/components/ui/Reveal';
import { HISTORY, PUBLICATION, type Milestone } from '@/lib/economicreview/content';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Who publishes the Vancouver Economic Review, and how it grew from a 2022 news curation project into a publication of original student research.',
};

/**
 * Both sections share one grid: a reading column held to a comfortable line
 * length, and a margin beside it that only the pull quote uses. On narrower
 * screens the margin folds under the column.
 */
const COLUMNS = 'lg:grid lg:grid-cols-[minmax(0,650px)_minmax(0,1fr)] lg:gap-x-16 xl:gap-x-24';

/**
 * One timeline entry: a marker on the rule, then date, title, and body.
 *
 * The rule is drawn per entry, from this marker's centre down to the next
 * one's, so the stretch that follows a muted entry can be dashed to read as a
 * gap in the record. It stays outside <Reveal> and is in place before the
 * entries fade in over it. The marker column is 15px wide and every marker is
 * an odd size, so markers and the 1px rule share a centre at 7.5px.
 */
function TimelineEntry({
  milestone,
  index,
  isLast,
}: {
  milestone: Milestone;
  index: number;
  isLast: boolean;
}) {
  const muted = milestone.tone === 'muted';
  const highlight = milestone.tone === 'highlight';

  return (
    <li className={`relative ${isLast ? '' : 'pb-12 sm:pb-14'}`}>
      {!isLast && (
        <span
          aria-hidden="true"
          className={[
            'absolute left-[7px] top-2 -bottom-2 w-px',
            muted
              ? 'bg-[repeating-linear-gradient(to_bottom,var(--blue)_0_4px,transparent_4px_9px)]'
              : 'bg-blue',
          ].join(' ')}
        />
      )}

      <Reveal
        delay={index * 70}
        className="reveal-subtle grid grid-cols-[15px_minmax(0,1fr)] gap-x-6 sm:gap-x-8"
      >
        {/* As tall as the date's line box, so each marker centres on the date. */}
        <span aria-hidden="true" className="flex h-4 items-center justify-center">
          <span
            className={[
              'block rounded-full',
              muted && 'w-[11px] h-[11px] border-2 border-blue/60 bg-offwhite',
              highlight && 'w-[15px] h-[15px] bg-blue ring-4 ring-blue/20',
              !muted && !highlight && 'w-[11px] h-[11px] bg-blue',
            ]
              .filter(Boolean)
              .join(' ')}
          />
        </span>

        <div>
          <p
            className={[
              'font-display text-xs leading-4 font-semibold uppercase tracking-[0.14em]',
              muted ? 'text-muted/90' : 'text-midnight-700',
            ].join(' ')}
          >
            {milestone.date}
          </p>
          <h3
            className={[
              'mt-2 leading-snug',
              muted && 'text-lg font-semibold text-muted',
              highlight && 'text-2xl sm:text-[1.7rem] font-extrabold text-midnight',
              !muted && !highlight && 'text-xl font-bold text-midnight',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {milestone.title}
          </h3>
          <p
            className={[
              'mt-2 leading-relaxed',
              muted ? 'text-[0.95rem] text-muted/90' : 'text-base text-muted',
            ].join(' ')}
          >
            {milestone.body}
          </p>
        </div>
      </Reveal>
    </li>
  );
}

/**
 * The Review's About page.
 *
 * Laid out like a journal's front matter rather than a marketing page: no
 * imagery, a heavy rule opening the page and a hairline opening each section
 * after it, and the copy in a single reading column. The off-white ground
 * sets it apart from the ice-blue archive and team pages as the one page in
 * the section meant to be read start to finish.
 *
 * The pull quote is the second sentence of the opening paragraph rather than
 * the first, because the first is already the masthead tagline directly
 * above. It repeats body copy, so it is hidden from screen readers.
 */
export default function EconomicReviewAboutPage() {
  return (
    <div className="bg-offwhite">
      {/* About */}
      <section className="pt-14 lg:pt-20 pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t-2 border-midnight pt-6 sm:pt-8">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-midnight leading-[0.95] tracking-tight">
              About Us
            </h2>
          </div>

          <div className={`mt-10 lg:mt-14 ${COLUMNS}`}>
            <div className="max-w-[650px] space-y-6 text-[1.0625rem] sm:text-lg leading-[1.8] text-midnight/85">
              <p>
                <span className="font-display font-bold uppercase tracking-[0.06em] text-midnight">
                  The {PUBLICATION.name}
                </span>{' '}
                is a student-led publication covering financial markets, economics, and public
                policy. We publish clear, data-driven analysis that combines original research with
                accessible writing.
              </p>
              <p>
                Founded by students at the Vancouver School of Economics, the Review exists to
                foster informed public commentary on the forces shaping our economy, and to give
                emerging analysts and writers a serious editorial platform to develop their ideas
                and share them with the wider community. The journal is nonpartisan and committed
                to protecting and promoting critical thinking. Our central aim is to keep
                students&apos; minds active and engaged, because the ability to generate original
                ideas is a skill built through practice, and one that has been increasingly
                undermined in recent years.
              </p>
            </div>

            <aside aria-hidden="true" className="mt-12 lg:mt-1 max-w-md lg:max-w-sm">
              <p className="border-t-2 border-blue border-b border-b-midnight/15 py-6 font-display font-semibold text-midnight text-2xl xl:text-[1.75rem] leading-[1.3] tracking-tight">
                We publish clear, data-driven analysis that combines original research with
                accessible writing.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="pb-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-midnight/15 pt-10 lg:pt-14">
            <div className={COLUMNS}>
              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-midnight leading-tight mb-10 lg:mb-12">
                  Our History
                </h2>

                <ol>
                  {HISTORY.map((milestone, i) => (
                    <TimelineEntry
                      key={`${milestone.date} ${milestone.title}`}
                      milestone={milestone}
                      index={i}
                      isLast={i === HISTORY.length - 1}
                    />
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
