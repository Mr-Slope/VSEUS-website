'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { formatIssueDate } from '@/lib/economicreview/issues';
import type { Comment } from '@/lib/economicreview/comments';

/*
  Avatar colours, picked by name so a commenter keeps theirs down a thread.
  Every pair clears 4.5:1 for the initials, which rules out off-white on blue
  and orange as text on anything light.
*/
const AVATAR_COLOURS = [
  'bg-accent-200 text-midnight',
  'bg-ice text-midnight',
  'bg-blue-300 text-midnight',
  'bg-midnight-700 text-offwhite',
  'bg-accent text-midnight',
  'bg-midnight text-accent',
];

function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  const letters = words.length > 1 ? [words[0], words[1]].map((w) => Array.from(w)[0]) : Array.from(words[0]).slice(0, 2);
  return letters.join('').toUpperCase();
}

export function Avatar({ name, small = false }: { name: string; small?: boolean }) {
  const letters = initials(name);
  const colour = AVATAR_COLOURS[Array.from(name).reduce((sum, ch) => sum + (ch.codePointAt(0) ?? 0), 0) % AVATAR_COLOURS.length];

  return (
    <span
      aria-hidden="true"
      className={[
        'rounded-full flex items-center justify-center flex-shrink-0 font-display font-semibold select-none',
        small ? 'w-8 h-8 text-[11px]' : 'w-10 h-10 text-sm',
        letters ? colour : 'bg-ice-200 text-muted',
      ].join(' ')}
    >
      {letters || (
        <svg className="w-1/2 h-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
        </svg>
      )}
    </span>
  );
}

const RELATIVE = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['day', 86_400],
  ['hour', 3_600],
  ['minute', 60],
];

/** "3 hours ago" for the past week, then the date, like the rest of the Review. */
function timeAgo(value: string): string {
  const seconds = (Date.now() - new Date(value).getTime()) / 1000;
  if (seconds < 45) return 'just now';
  if (seconds >= 7 * 86_400) return formatIssueDate(value);
  for (const [unit, size] of UNITS) {
    if (seconds >= size) return RELATIVE.format(-Math.floor(seconds / size), unit);
  }
  return RELATIVE.format(-1, 'minute');
}

interface MenuItem {
  label: string;
  onSelect: () => void;
  danger?: boolean;
}

/** The ⋯ beside a comment. A disclosure of plain buttons, like the editor's ⋮ menu. */
function CommentMenu({ label, items }: { label: string; items: MenuItem[] }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative flex-shrink-0">
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((o) => !o)}
        className="w-9 h-9 -mr-2 -mt-1.5 rounded-lg flex items-center justify-center text-muted hover:text-midnight hover:bg-ice-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-midnight"
      >
        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM15.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
        </svg>
      </button>

      {open && (
        <div
          id={menuId}
          className="absolute right-0 top-full z-20 mt-1 w-52 rounded-xl border border-ice-400 bg-offwhite p-1.5 shadow-xl shadow-midnight/15"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setOpen(false);
                item.onSelect();
              }}
              className={[
                'w-full text-left rounded-lg px-3 py-2 text-sm font-display transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-midnight',
                item.danger ? 'text-red-700 hover:bg-red-50' : 'text-midnight hover:bg-ice-200',
              ].join(' ')}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const ACTION_BUTTON = [
  'inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 min-h-[36px]',
  'font-display font-semibold text-sm text-midnight-700 hover:text-midnight hover:bg-ice-200 transition-colors',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-midnight',
].join(' ');

export interface CommentActions {
  onReply: (comment: Comment) => void;
  onLike: (comment: Comment) => void;
  onShare: (comment: Comment) => void;
  onReport: (comment: Comment) => void;
  /** The reader deleting their own comment. */
  onDelete: (comment: Comment) => void;
  onModerate: (comment: Comment, action: 'remove' | 'hide' | 'restore') => void;
}

interface CommentItemProps {
  comment: Comment;
  reply?: boolean;
  /** An editor is signed in, so moderation options and report counts show. */
  editor: boolean;
  actions: CommentActions;
}

/**
 * One comment or reply.
 *
 * The body is plain text: links are shown, not made clickable, so a comment
 * cannot become a way to send readers somewhere harmful, and spam gains
 * nothing from being here. React escapes the text, so nothing in it can run.
 *
 * A comment taken down while it had replies stays as a placeholder saying who
 * took it down, so the replies under it still make sense.
 */
export function CommentItem({ comment, reply = false, editor, actions }: CommentItemProps) {
  if (comment.status === 'deleted' || comment.status === 'removed') {
    return (
      <article id={`comment-${comment.id}`} className="flex items-center gap-3 sm:gap-4 scroll-mt-40">
        <span aria-hidden="true" className={`${reply ? 'w-8 h-8' : 'w-10 h-10'} rounded-full border-2 border-dashed border-ice-400 flex-shrink-0`} />
        <p className="text-sm italic text-muted">
          {comment.status === 'deleted' ? 'This comment was deleted by its author.' : 'This comment was removed by a moderator.'}
        </p>
      </article>
    );
  }

  const hidden = comment.status === 'hidden';
  const items: MenuItem[] = [];
  if (comment.mine) items.push({ label: 'Delete my comment', onSelect: () => actions.onDelete(comment), danger: true });
  else if (!hidden) items.push({ label: 'Report', onSelect: () => actions.onReport(comment) });
  if (editor) {
    items.push(
      hidden
        ? { label: 'Restore (make visible)', onSelect: () => actions.onModerate(comment, 'restore') }
        : { label: 'Hide for review', onSelect: () => actions.onModerate(comment, 'hide') },
      { label: 'Remove comment', onSelect: () => actions.onModerate(comment, 'remove'), danger: true },
    );
  }

  const nameId = `comment-${comment.id}-name`;

  return (
    <article
      id={`comment-${comment.id}`}
      aria-labelledby={nameId}
      className="flex gap-3 sm:gap-4 rounded-xl scroll-mt-40 transition-shadow duration-500 data-[highlight=true]:ring-2 data-[highlight=true]:ring-accent data-[highlight=true]:ring-offset-8 data-[highlight=true]:ring-offset-offwhite"
    >
      <Avatar name={comment.username} small={reply} />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 leading-tight">
              <span id={nameId} className="font-display font-semibold text-midnight break-words">
                {comment.username}
              </span>
              {comment.mine && (
                <span className="font-display text-[10px] font-semibold uppercase tracking-widest text-midnight bg-ice px-1.5 py-0.5 rounded">
                  You
                </span>
              )}
            </p>
            <p className="text-xs text-muted mt-1">
              <time dateTime={comment.created_at} title={new Date(comment.created_at).toLocaleString('en-CA')}>
                {timeAgo(comment.created_at)}
              </time>
            </p>
          </div>
          {items.length > 0 && <CommentMenu label={`More options for the comment by ${comment.username}`} items={items} />}
        </div>

        {editor && (hidden || comment.reports > 0) && (
          <p
            className={[
              'mt-2 inline-block font-display text-[10px] font-semibold uppercase tracking-widest text-midnight px-2 py-0.5 rounded-full',
              hidden ? 'bg-accent' : 'bg-accent-200',
            ].join(' ')}
          >
            {hidden ? 'Hidden from readers' : 'Visible'} · {comment.reports} {comment.reports === 1 ? 'report' : 'reports'}
          </p>
        )}

        <p className={`mt-2 text-[15px] leading-relaxed whitespace-pre-line break-words ${hidden ? 'text-muted' : 'text-midnight'}`}>
          {comment.body}
        </p>

        {!hidden && (
          <div className="mt-1.5 -ml-2 flex flex-wrap items-center">
            <button type="button" onClick={() => actions.onReply(comment)} className={ACTION_BUTTON}>
              Reply
            </button>
            <span aria-hidden="true" className="text-ice-400">·</span>
            <button
              type="button"
              onClick={() => actions.onLike(comment)}
              aria-pressed={comment.liked}
              aria-label={`Like the comment by ${comment.username}. ${comment.likes} ${comment.likes === 1 ? 'like' : 'likes'}`}
              className={ACTION_BUTTON}
            >
              {comment.liked ? (
                <svg aria-hidden="true" className="w-[18px] h-[18px] text-midnight-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M1 8.25a1.25 1.25 0 112.5 0v7.5a1.25 1.25 0 11-2.5 0v-7.5zM11 3V1.7c0-.268.14-.526.395-.607A2 2 0 0114 3c0 .995-.182 1.948-.514 2.826-.204.54.166 1.174.744 1.174h2.52c1.243 0 2.261 1.01 2.146 2.247a23.864 23.864 0 01-1.341 5.974C17.153 16.323 16.072 17 14.9 17h-3.192a3 3 0 01-1.341-.317l-2.734-1.366A3 3 0 006.292 15H5V8h.963c.685 0 1.258-.483 1.612-1.068a4.011 4.011 0 012.166-1.73c.432-.143.853-.386 1.011-.814.16-.432.248-.9.248-1.388z" />
                </svg>
              ) : (
                <svg aria-hidden="true" className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V2.75a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                </svg>
              )}
              {comment.likes > 0 && <span className="tabular-nums">{comment.likes}</span>}
            </button>
            <span aria-hidden="true" className="text-ice-400">·</span>
            <button type="button" onClick={() => actions.onShare(comment)} className={ACTION_BUTTON}>
              Share
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
