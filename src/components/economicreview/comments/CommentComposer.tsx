'use client';

import React, { useId, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { fieldClassName } from '@/components/ui/Input';
import { Avatar } from './CommentItem';
import {
  BODY_MAX,
  BODY_MIN,
  COMMENT_TERMS_PATH,
  CommentError,
  postComment,
  savedName,
  saveName,
  USERNAME_MAX,
  USERNAME_MIN,
} from '@/lib/economicreview/comments';

interface CommentComposerProps {
  issueId: string;
  /** The comment being answered, or null to start a new thread. */
  replyTo: { id: string; username: string } | null;
  /** Text to start with, such as "@name " when replying inside a thread. */
  prefill?: string;
  onPosted: () => void;
  /** Replies only: closes the reply box. */
  onCancel?: () => void;
}

type FieldError = { field: 'name' | 'body' | 'form'; message: string };

const LINK = 'font-semibold text-midnight underline decoration-accent decoration-2 underline-offset-2 hover:text-midnight-700';

/**
 * The box a reader writes a comment or reply in.
 *
 * No account and no sign-up: a display name and the comment. Posting is the
 * agreement to the terms, as the note above the button says, so there is no box
 * to tick. The name is remembered in this browser, so the next comment is just
 * the text.
 *
 * The new-thread box starts as a single line and opens out on focus, so the
 * conversation leads with what people said rather than a form.
 *
 * The hidden "website" field is a honeypot. People never see it; form-filling
 * bots tend to fill every field, and a submission with it filled is quietly
 * dropped. It is a courtesy filter only. The real limits are in the database.
 */
export function CommentComposer({ issueId, replyTo, prefill = '', onPosted, onCancel }: CommentComposerProps) {
  const id = useId();
  const [name, setName] = useState(savedName);
  const [body, setBody] = useState(prefill);
  const [trap, setTrap] = useState('');
  const [expanded, setExpanded] = useState(replyTo !== null);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<FieldError | null>(null);

  const nameError = error?.field === 'name' ? error.message : undefined;
  const bodyError = error?.field === 'body' ? error.message : undefined;
  const over = body.length > BODY_MAX;

  function reset() {
    setBody('');
    setError(null);
    setExpanded(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const displayName = name.trim().replace(/\s+/g, ' ');
    const text = body.trim();

    if (displayName.length < USERNAME_MIN || displayName.length > USERNAME_MAX) {
      return setError({ field: 'name', message: `Choose a display name of ${USERNAME_MIN} to ${USERNAME_MAX} characters.` });
    }
    if (text.length < BODY_MIN) {
      return setError({ field: 'body', message: replyTo ? 'Write your reply first.' : 'Write your comment first.' });
    }
    if (text.length > BODY_MAX) {
      return setError({ field: 'body', message: `Comments can be up to ${BODY_MAX} characters. Trim it a little.` });
    }

    if (trap) {
      reset();
      return;
    }

    setWorking(true);
    setError(null);
    try {
      await postComment({ issueId, parentId: replyTo?.id ?? null, username: displayName, body: text });
      saveName(displayName);
      reset();
      onPosted();
    } catch (e) {
      setError({
        field: 'form',
        message: e instanceof CommentError ? e.message : 'Your comment was not posted. Check your connection and try again.',
      });
    } finally {
      setWorking(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={working} className="relative flex gap-3 sm:gap-4">
      <Avatar name={name} small={replyTo !== null} />

      <div className="flex-1 min-w-0">
        {replyTo && (
          <p className="text-xs text-muted mb-2">
            Replying to <span className="font-semibold text-midnight">{replyTo.username}</span>
          </p>
        )}

        <label htmlFor={`${id}-body`} className="sr-only">
          {replyTo ? `Your reply to ${replyTo.username}` : 'Your comment'}
        </label>
        <textarea
          id={`${id}-body`}
          value={body}
          rows={expanded ? 4 : 1}
          autoFocus={replyTo !== null}
          placeholder={replyTo ? 'Write a reply' : 'What do you think?'}
          onFocus={() => setExpanded(true)}
          onChange={(event) => {
            setBody(event.target.value);
            if (error?.field === 'body' || error?.field === 'form') setError(null);
          }}
          aria-invalid={bodyError || over ? true : undefined}
          aria-describedby={`${id}-count${bodyError ? ` ${id}-body-error` : ''}`}
          className={`${fieldClassName(bodyError)} block resize-y leading-relaxed ${expanded ? 'min-h-[7rem]' : 'min-h-[2.75rem]'}`}
        />
        {bodyError && (
          <p id={`${id}-body-error`} className="mt-1 text-xs text-red-500">
            {bodyError}
          </p>
        )}

        {expanded && (
          <>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
              <div className="w-full sm:w-64">
                <label htmlFor={`${id}-name`} className="text-sm font-medium text-midnight">
                  Display name
                </label>
                <input
                  id={`${id}-name`}
                  value={name}
                  maxLength={USERNAME_MAX + 10}
                  autoComplete="nickname"
                  onChange={(event) => {
                    setName(event.target.value);
                    if (error?.field === 'name') setError(null);
                  }}
                  aria-invalid={nameError ? true : undefined}
                  aria-describedby={`${id}-name-${nameError ? 'error' : 'hint'}`}
                  className={`${fieldClassName(nameError)} mt-1`}
                />
                {nameError ? (
                  <p id={`${id}-name-error`} className="mt-1 text-xs text-red-500">
                    {nameError}
                  </p>
                ) : (
                  <p id={`${id}-name-hint`} className="mt-1 text-xs text-muted">
                    Shown with your comment. No account needed.
                  </p>
                )}
              </div>
              <p id={`${id}-count`} className={`text-xs tabular-nums ${over ? 'text-red-600 font-semibold' : 'text-muted'}`}>
                {body.length} / {BODY_MAX}
              </p>
            </div>

            <p className="mt-4 text-xs text-muted leading-relaxed">
              By posting you confirm you are 13 or older and agree to the{' '}
              <a href={COMMENT_TERMS_PATH} target="_blank" rel="noopener" className={LINK}>
                Comment Terms and Community Guidelines
              </a>
              . Your comment will be public.
            </p>

            {error?.field === 'form' && (
              <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                {error.message}
              </p>
            )}

            <div className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={working}
                onClick={() => (onCancel ? onCancel() : reset())}
              >
                Cancel
              </Button>
              <Button type="submit" variant="accent" size="sm" loading={working} disabled={over}>
                {replyTo ? 'Post reply' : 'Post comment'}
              </Button>
            </div>
          </>
        )}

        <div aria-hidden="true" className="absolute -left-[10000px] top-0 h-px w-px overflow-hidden">
          <label>
            Leave this empty
            <input type="text" name="website" tabIndex={-1} autoComplete="off" value={trap} onChange={(event) => setTrap(event.target.value)} />
          </label>
        </div>
      </div>
    </form>
  );
}
