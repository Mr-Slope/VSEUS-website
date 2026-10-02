'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { assetUrl, formatIssueDate, isScheduled, readerHref, type Issue } from '@/lib/economicreview/issues';

const EDIT_CONTROL = [
  'w-9 h-9 rounded-lg flex items-center justify-center',
  'bg-midnight/85 text-offwhite shadow-md backdrop-blur-sm transition-colors',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-midnight',
].join(' ');

interface IssueCardProps {
  issue: Issue;
  /** Passed only while the archive editor is unlocked. */
  onEdit?: (issue: Issue) => void;
  onDelete?: (issue: Issue) => void;
}

/**
 * One issue in the archive.
 *
 * Built on the same card as the blog index: off-white panel, icy border that
 * warms to accent on hover, and the shared lift. The difference is the action.
 * A post card is a link to a page, so the whole card is clickable. An issue
 * card can carry the editor's buttons, which cannot sit inside a link, so it
 * is an article with one explicit control that opens the issue in the reader
 * (where it can also be downloaded) and the cover is decorative.
 *
 * The cover uses a plain img rather than next/image on purpose. The URLs
 * arrive from the database at runtime with dimensions and origin unknown, and
 * image optimization is off for the static export anyway, so next/image would
 * add a remotePatterns constraint and buy nothing.
 *
 * The issue's related courses sit under its summary as plain tags. Filtering
 * by them happens in the toolbar above the grid, which keeps the card to its
 * one control.
 *
 * With the editor unlocked the cover carries Edit and Delete controls. They
 * are always visible rather than revealed on hover, so they work by touch and
 * keyboard too. A scheduled issue, which only the editor sees, says so in
 * place of its date.
 */
export function IssueCard({ issue, onEdit, onDelete }: IssueCardProps) {
  const cover = assetUrl(issue.image_path);
  const date = formatIssueDate(issue.created_at);
  const scheduled = isScheduled(issue);

  /*
    A row can point at a file that is missing or unreadable, and at least one
    in the archive does. Falling back to the placeholder keeps that looking
    like a card without a cover rather than a broken page.
  */
  const [coverBroken, setCoverBroken] = useState(false);

  return (
    <article className="group bg-offwhite border border-ice-400 hover:border-accent hover:shadow-lg hover:shadow-midnight/10 rounded-2xl overflow-hidden transition-all flex flex-col">
      <div className="relative w-full h-48 overflow-hidden bg-ice-200">
        {cover && !coverBroken ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setCoverBroken(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <ImagePlaceholder label="Issue cover" className="w-full h-full border-0 border-b border-dashed" />
        )}

        {(onEdit || onDelete) && (
          <div className="absolute top-3 right-3 flex gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(issue)}
                aria-label={`Edit ${issue.title}`}
                className={`${EDIT_CONTROL} hover:bg-midnight`}
              >
                <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(issue)}
                aria-label={`Delete ${issue.title}`}
                className={`${EDIT_CONTROL} hover:bg-red-600`}
              >
                <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        {date && (
          <p
            className={[
              'font-display text-[10px] font-semibold uppercase tracking-widest text-midnight px-2.5 py-1 rounded-full self-start mb-3',
              scheduled ? 'bg-accent' : 'bg-ice',
            ].join(' ')}
          >
            {scheduled && 'Scheduled: '}
            <time dateTime={issue.created_at}>{date}</time>
          </p>
        )}

        <h3 className="text-lg font-bold text-midnight leading-snug mb-2">{issue.title}</h3>

        {issue.description && (
          <p
            className={[
              'text-sm text-muted leading-relaxed line-clamp-3',
              issue.courses.length > 0 ? 'mb-3' : 'mb-5',
            ].join(' ')}
          >
            {issue.description}
          </p>
        )}

        {issue.courses.length > 0 && (
          <ul aria-label="Related courses" className="flex flex-wrap gap-1.5 mb-5">
            {issue.courses.map((code) => (
              <li
                key={code}
                className="font-display text-[11px] font-semibold text-midnight-700 border border-ice-400 rounded-md px-2 py-0.5"
              >
                {code}
              </li>
            ))}
          </ul>
        )}

        {issue.pdf_path ? (
          <Link
            href={readerHref(issue)}
            className="mt-auto inline-flex items-center justify-center gap-2 bg-accent text-midnight font-display font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-accent-600 transition-colors btn-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-midnight focus-visible:ring-offset-2 focus-visible:ring-offset-offwhite"
          >
            <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            Open Report
            <span className="sr-only">, {issue.title}</span>
          </Link>
        ) : (
          <p className="mt-auto text-xs text-muted/70 italic">PDF coming soon.</p>
        )}
      </div>
    </article>
  );
}
