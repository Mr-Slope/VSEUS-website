'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { EditorDialog } from '../editor/EditorDialog';
import { PUBLICATION } from '@/lib/economicreview/content';
import { CommentError, REPORT_REASONS, type Comment, type ReportReason } from '@/lib/economicreview/comments';

/*
  Both dialogs use the archive editor's modal shell, so they look and behave
  like every other dialog in the Review: focus trapped while open, Escape to
  close, and no closing while a request is in flight.
*/

function failure(e: unknown, fallback: string): string {
  return e instanceof CommentError ? e.message : fallback;
}

function Quote({ comment }: { comment: Comment }) {
  return (
    <div className="mt-4 rounded-lg border border-ice-400 bg-ice-200 px-4 py-3">
      <p className="font-display font-semibold text-sm text-midnight">{comment.username}</p>
      <p className="text-sm text-muted mt-1 line-clamp-3 whitespace-pre-line break-words">{comment.body}</p>
    </div>
  );
}

function Failure({ message }: { message: string }) {
  return (
    <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
      {message}
    </p>
  );
}

interface ReportDialogProps {
  comment: Comment | null;
  onClose: () => void;
  /** Resolves once sent. Rejects with a message to show in the dialog. */
  onSubmit: (reason: ReportReason) => Promise<void>;
}

export function ReportDialog({ comment, onClose, onSubmit }: ReportDialogProps) {
  return (
    <EditorDialog open={comment !== null} onClose={onClose} title="Report this comment" titleId="economicreview-report-comment-title">
      {comment && <ReportForm comment={comment} onCancel={onClose} onSubmit={onSubmit} />}
    </EditorDialog>
  );
}

function ReportForm({
  comment,
  onCancel,
  onSubmit,
}: {
  comment: Comment;
  onCancel: () => void;
  onSubmit: (reason: ReportReason) => Promise<void>;
}) {
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reason) return setError('Choose what is wrong with this comment.');
    setWorking(true);
    setError(null);
    try {
      await onSubmit(reason);
    } catch (e) {
      setWorking(false);
      setError(failure(e, 'Your report was not sent. Try again in a moment.'));
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={working}>
      <p className="text-sm text-muted leading-relaxed">
        Reports are anonymous. A comment reported by several readers is hidden until a moderator reviews it.
      </p>
      <Quote comment={comment} />

      <fieldset className="mt-5">
        <legend className="text-sm font-medium text-midnight mb-2">What is wrong with it?</legend>
        <div className="space-y-1">
          {REPORT_REASONS.map((option, i) => (
            <label key={option.value} className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-midnight hover:bg-ice-200 cursor-pointer">
              <input
                type="radio"
                name="reason"
                value={option.value}
                checked={reason === option.value}
                onChange={() => {
                  setReason(option.value);
                  setError(null);
                }}
                data-autofocus={i === 0 ? true : undefined}
                className="h-4 w-4 accent-midnight-700"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <p className="mt-4 text-xs text-muted leading-relaxed">
        If a comment threatens someone or shares their personal information, also email{' '}
        <a href={`mailto:${PUBLICATION.email}`} className="font-semibold text-midnight underline decoration-accent decoration-2 underline-offset-2">
          {PUBLICATION.email}
        </a>{' '}
        so we can act quickly.
      </p>

      {error && <Failure message={error} />}

      <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={working}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={working}>
          Send report
        </Button>
      </div>
    </form>
  );
}

export interface ConfirmRequest {
  title: string;
  body: string;
  confirmLabel: string;
  comment: Comment;
  /** Resolves once done. Rejects with a message to show in the dialog. */
  run: () => Promise<void>;
}

/** One step between a delete or remove button and a comment that is gone. Focus starts on Cancel. */
export function ConfirmDialog({ request, onClose }: { request: ConfirmRequest | null; onClose: () => void }) {
  return (
    <EditorDialog
      open={request !== null}
      onClose={onClose}
      title={request?.title ?? ''}
      titleId="economicreview-confirm-comment-title"
    >
      {request && <ConfirmBody request={request} onCancel={onClose} />}
    </EditorDialog>
  );
}

function ConfirmBody({ request, onCancel }: { request: ConfirmRequest; onCancel: () => void }) {
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    setWorking(true);
    setError(null);
    try {
      await request.run();
    } catch (e) {
      setWorking(false);
      setError(failure(e, 'That did not go through. Try again.'));
    }
  }

  return (
    <div aria-busy={working}>
      <p className="text-sm text-muted leading-relaxed">{request.body}</p>
      <Quote comment={request.comment} />
      {error && <Failure message={error} />}
      <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={working} data-autofocus>
          Cancel
        </Button>
        <Button type="button" variant="danger" onClick={confirm} loading={working}>
          {request.confirmLabel}
        </Button>
      </div>
    </div>
  );
}
