'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { CommentComposer } from './CommentComposer';
import { CommentItem, type CommentActions } from './CommentItem';
import { ConfirmDialog, ReportDialog, type ConfirmRequest } from './CommentDialogs';
import { TAB_BAR_ACTIONS_ID } from '../SectionTabs';
import { Toast, type ToastMessage } from '../Toast';
import { EditorMenuButton } from '../editor/EditorMenuButton';
import { PasswordDialog } from '../editor/PasswordDialog';
import { hasEditorSession, onSessionEnded, signIn, signOut } from '@/lib/economicreview/editor';
import { NotConfiguredError, readerHref } from '@/lib/economicreview/issues';
import { PUBLICATION } from '@/lib/economicreview/content';
import {
  COMMENT_TERMS_PATH,
  CommentError,
  countComments,
  deleteOwnComment,
  fetchComments,
  moderateComment,
  reportComment,
  toggleLike,
  toThreads,
  type Comment,
  type ReportReason,
} from '@/lib/economicreview/comments';

type Sort = 'newest' | 'oldest' | 'liked';

type State =
  | { kind: 'loading' }
  | { kind: 'ready'; comments: Comment[] }
  /** `retry` is false when trying again cannot help, such as comments not being set up. */
  | { kind: 'error'; message: string; retry: boolean };

/* See EditableArchive: the tab bar's action slot is fixed, so there is nothing to subscribe to. */
const subscribeToNothing = () => () => {};
const findSlot = () => document.getElementById(TAB_BAR_ACTIONS_ID);
const noSlotOnServer = () => null;

const LINK = 'font-semibold text-midnight underline decoration-accent decoration-2 underline-offset-2 hover:text-midnight-700';

function CommentSkeleton() {
  return (
    <div aria-hidden="true" className="flex gap-4 animate-pulse motion-reduce:animate-none">
      <div className="w-10 h-10 rounded-full bg-ice-200 flex-shrink-0" />
      <div className="flex-1">
        <div className="h-4 w-32 rounded bg-ice-200 mb-2" />
        <div className="h-3 w-16 rounded bg-ice-200 mb-4" />
        <div className="h-3.5 w-full rounded bg-ice-200 mb-2" />
        <div className="h-3.5 w-3/4 rounded bg-ice-200" />
      </div>
    </div>
  );
}

/**
 * The conversation under an issue: the community notice, the comment box,
 * and the threads.
 *
 * It is also where the editor moderates. The ⋮ button in the tab bar unlocks
 * it with the same password as the archive, and an editor already signed in
 * on the archive arrives unlocked, since the session lives in memory and
 * survives the client-side move. Unlocked, hidden comments appear marked as
 * such, and every comment's ⋯ menu offers Hide, Restore, and Remove. As on the
 * archive, unlocking only changes what is shown: the database decides who may
 * moderate.
 *
 * The list is fetched again after every change rather than patched by hand,
 * except likes, which update at once and are corrected by the reply.
 */
export function Conversation({ issueId }: { issueId: string }) {
  const slot = useSyncExternalStore(subscribeToNothing, findSlot, noSlotOnServer);

  const [state, setState] = useState<State>({ kind: 'loading' });
  /** Bumped after every change to fetch the list again without a loading flash. */
  const [revision, setRevision] = useState(0);
  const [sort, setSort] = useState<Sort>('newest');
  const [replyTo, setReplyTo] = useState<{ threadId: string; comment: Comment } | null>(null);
  const [reportTarget, setReportTarget] = useState<Comment | null>(null);
  const [confirm, setConfirm] = useState<ConfirmRequest | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [prompt, setPrompt] = useState<{ notice: string | null } | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const pendingLikes = useRef(new Set<string>());
  const deepLinked = useRef(false);
  const dismissToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    let cancelled = false;
    hasEditorSession().then((live) => {
      if (!cancelled && live) setUnlocked(true);
    });
    const stop = onSessionEnded(() => setUnlocked(false));
    return () => {
      cancelled = true;
      stop();
    };
  }, []);

  // Unlocking changes what the list returns, so it fetches again too.
  useEffect(() => {
    let cancelled = false;

    fetchComments(issueId)
      .then((comments) => {
        if (!cancelled) setState({ kind: 'ready', comments });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (error instanceof NotConfiguredError) {
          setState({ kind: 'error', message: 'Comments are not configured on this build.', retry: false });
        } else if (error instanceof CommentError && error.kind === 'closed') {
          setState({ kind: 'error', message: error.message, retry: false });
        } else {
          setState({ kind: 'error', message: 'The comments did not load. This is on our side, not yours.', retry: true });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [issueId, revision, unlocked]);

  // A shared link (#comment-<id>) scrolls to its comment and marks it briefly, once.
  const ready = state.kind === 'ready';
  useEffect(() => {
    if (!ready || deepLinked.current) return;
    deepLinked.current = true;
    const match = window.location.hash.match(/^#comment-([0-9a-f-]{36})$/i);
    const target = match && document.getElementById(`comment-${match[1]}`);
    if (!target) return;
    target.scrollIntoView({ block: 'center' });
    target.dataset.highlight = 'true';
    const timer = setTimeout(() => delete target.dataset.highlight, 2500);
    return () => clearTimeout(timer);
  }, [ready]);

  const comments = useMemo(() => (state.kind === 'ready' ? state.comments : []), [state]);
  const threads = useMemo(() => toThreads(comments, sort), [comments, sort]);
  const count = countComments(comments);

  const refresh = useCallback(() => setRevision((n) => n + 1), []);

  function retry() {
    setState({ kind: 'loading' });
    refresh();
  }

  function patch(id: string, change: Partial<Comment>) {
    setState((s) =>
      s.kind === 'ready' ? { kind: 'ready', comments: s.comments.map((c) => (c.id === id ? { ...c, ...change } : c)) } : s,
    );
  }

  function showError(error: unknown, title: string) {
    setToast({
      tone: 'info',
      title,
      body: error instanceof CommentError ? error.message : 'Check your connection and try again.',
    });
  }

  /**
   * Runs one editor action. If the session has ended, the editor locks and
   * asks for the password again, as on the archive. The error still reaches
   * the caller, so a dialog that started it can show it.
   */
  async function moderate(comment: Comment, action: 'remove' | 'hide' | 'restore') {
    try {
      await moderateComment(comment.id, action);
    } catch (error) {
      if (error instanceof CommentError && error.kind === 'forbidden') {
        await signOut();
        setUnlocked(false);
        setPrompt({ notice: error.message });
      }
      throw error;
    }
  }

  const actions: CommentActions = {
    onReply(comment) {
      setReplyTo({ threadId: comment.parent_id ?? comment.id, comment });
    },

    async onLike(comment) {
      if (pendingLikes.current.has(comment.id)) return;
      pendingLikes.current.add(comment.id);
      patch(comment.id, { liked: !comment.liked, likes: comment.likes + (comment.liked ? -1 : 1) });
      try {
        patch(comment.id, await toggleLike(comment.id));
      } catch (error) {
        patch(comment.id, { liked: comment.liked, likes: comment.likes });
        showError(error, 'That like did not go through');
      } finally {
        pendingLikes.current.delete(comment.id);
      }
    },

    async onShare(comment) {
      const url = new URL(readerHref({ id: issueId }), window.location.origin);
      url.hash = `comment-${comment.id}`;
      try {
        await navigator.clipboard.writeText(url.toString());
        setToast({ tone: 'success', title: 'Link copied', body: 'It opens this issue at this comment.' });
      } catch {
        setToast({ tone: 'info', title: 'Copy this link', body: url.toString() });
      }
    },

    onReport: setReportTarget,

    onDelete(comment) {
      setConfirm({
        title: 'Delete your comment?',
        body: 'It will be taken down for everyone. If people have replied, their replies stay under a note that you deleted it. This cannot be undone.',
        confirmLabel: 'Delete comment',
        comment,
        run: async () => {
          await deleteOwnComment(comment.id);
          setConfirm(null);
          refresh();
          setToast({ tone: 'success', title: 'Comment deleted', body: 'Your comment has been taken down.' });
        },
      });
    },

    async onModerate(comment, action) {
      if (action === 'remove') {
        setConfirm({
          title: 'Remove this comment?',
          body: 'It will be taken down for everyone. Replies to it stay, under a note that a moderator removed it. This cannot be undone.',
          confirmLabel: 'Remove comment',
          comment,
          run: async () => {
            await moderate(comment, 'remove');
            setConfirm(null);
            refresh();
            setToast({ tone: 'success', title: 'Comment removed', body: `The comment by ${comment.username} has been taken down.` });
          },
        });
        return;
      }

      try {
        await moderate(comment, action);
        refresh();
        setToast(
          action === 'hide'
            ? { tone: 'success', title: 'Comment hidden', body: 'Readers no longer see it. Restore it from its menu.' }
            : { tone: 'success', title: 'Comment restored', body: 'It is visible again and its reports have been cleared.' },
        );
      } catch (error) {
        showError(error, 'That change did not go through');
      }
    },
  };

  async function sendReport(reason: ReportReason) {
    const comment = reportTarget;
    if (!comment) return;
    const hidden = await reportComment(comment.id, reason);
    setReportTarget(null);
    if (hidden) refresh();
    setToast({
      tone: 'success',
      title: 'Thanks for the report',
      body: hidden
        ? 'The comment is hidden until a moderator reviews it.'
        : 'Reports help our moderators find comments that break the guidelines.',
    });
  }

  function posted(reply: boolean) {
    setReplyTo(null);
    if (!reply) setSort('newest');
    refresh();
    setToast({ tone: 'success', title: reply ? 'Reply posted' : 'Comment posted', body: 'Thanks for joining the conversation.' });
  }

  async function unlock(password: string) {
    await signIn(password);
    setUnlocked(true);
    setPrompt(null);
    setToast({
      tone: 'success',
      title: 'Editor unlocked',
      body: 'Hidden comments now show here, and each comment has moderation options in its ⋯ menu.',
    });
  }

  async function lock() {
    await signOut();
    setUnlocked(false);
    setToast({ tone: 'info', title: 'Editor locked', body: 'You are signed out. Moderating needs the password again.' });
  }

  const canPost = state.kind !== 'error' || state.retry;

  return (
    <section
      aria-labelledby="conversation-title"
      className="-mx-4 sm:mx-auto sm:max-w-4xl mt-10 lg:mt-14 bg-offwhite border-y sm:border border-ice-400 sm:rounded-2xl px-4 py-8 sm:p-8 lg:p-10"
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 pb-5 border-b border-ice-400">
        <h3 id="conversation-title" className="text-2xl sm:text-3xl font-black text-midnight leading-none">
          Conversation
        </h3>
        {state.kind === 'ready' && (
          <p className="font-display font-semibold text-midnight-700">
            {count} {count === 1 ? 'comment' : 'comments'}
          </p>
        )}
      </div>

      <div className="mt-5 space-y-3 text-sm text-muted leading-relaxed">
        <p>
          By joining the conversation you agree to our{' '}
          <Link href={COMMENT_TERMS_PATH} className={LINK}>
            Comment Terms and Community Guidelines
          </Link>
          . Comments are public and moderated. Questions or concerns can be sent to{' '}
          <a href={`mailto:${PUBLICATION.email}`} className={LINK}>
            {PUBLICATION.email}
          </a>
          .
        </p>
        <p>
          Keep it on the topic of the issue and keep it civil: debate ideas, not people, and never share anyone&apos;s
          personal information. Comments reported by several readers are hidden until a moderator reviews them.
        </p>
      </div>

      {unlocked && (
        <p className="mt-5 rounded-lg bg-accent-200 px-3 py-2.5 text-sm text-midnight leading-relaxed">
          You are moderating as an editor. Hidden comments are shown to you, marked as hidden, and every comment has
          moderation options in its ⋯ menu.
        </p>
      )}

      {canPost && (
        <div className="mt-7">
          <CommentComposer issueId={issueId} replyTo={null} onPosted={() => posted(false)} />
        </div>
      )}

      {state.kind === 'ready' && threads.length > 0 && (
        <div className="mt-8 flex items-center gap-1.5 text-sm">
          <label htmlFor="conversation-sort" className="text-muted">
            Sort by
          </label>
          <select
            id="conversation-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value as Sort)}
            className="font-display font-semibold text-midnight bg-transparent rounded-md py-1 pl-1 pr-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-midnight"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="liked">Most liked</option>
          </select>
        </div>
      )}

      <div className="mt-6">
        {state.kind === 'loading' && (
          <div className="space-y-8">
            <CommentSkeleton />
            <CommentSkeleton />
            <span className="sr-only" role="status">
              Loading comments
            </span>
          </div>
        )}

        {state.kind === 'error' && (
          <div className="rounded-xl border border-ice-400 bg-ice-200 px-5 py-6 text-center">
            <p className="text-sm text-midnight">{state.message}</p>
            {state.retry && (
              <button type="button" onClick={retry} className={`mt-3 text-sm font-display ${LINK}`}>
                Try again
              </button>
            )}
          </div>
        )}

        {state.kind === 'ready' && threads.length === 0 && (
          <p className="py-8 text-center text-sm text-muted">No comments yet. Start the conversation.</p>
        )}

        {state.kind === 'ready' && threads.length > 0 && (
          <ol className="space-y-8">
            {threads.map(({ comment, replies }) => {
              const replying = replyTo?.threadId === comment.id ? replyTo.comment : null;
              return (
                <li key={comment.id}>
                  <CommentItem comment={comment} editor={unlocked} actions={actions} />
                  {(replies.length > 0 || replying) && (
                    <ol className="mt-5 ml-5 pl-4 sm:pl-8 border-l-2 border-ice-400 space-y-6">
                      {replies.map((reply) => (
                        <li key={reply.id}>
                          <CommentItem comment={reply} reply editor={unlocked} actions={actions} />
                        </li>
                      ))}
                      {replying && (
                        <li>
                          <CommentComposer
                            key={replying.id}
                            issueId={issueId}
                            replyTo={{ id: replying.id, username: replying.username }}
                            prefill={replying.parent_id ? `@${replying.username} ` : ''}
                            onPosted={() => posted(true)}
                            onCancel={() => setReplyTo(null)}
                          />
                        </li>
                      )}
                    </ol>
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </div>

      {slot &&
        createPortal(<EditorMenuButton unlocked={unlocked} onUnlock={() => setPrompt({ notice: null })} onLock={lock} />, slot)}

      <ReportDialog comment={reportTarget} onClose={() => setReportTarget(null)} onSubmit={sendReport} />
      <ConfirmDialog request={confirm} onClose={() => setConfirm(null)} />
      {/* Last, so when a moderation action finds the session gone, the prompt opens above its dialog. */}
      <PasswordDialog
        open={prompt !== null}
        notice={prompt?.notice ?? null}
        onClose={() => setPrompt(null)}
        onSubmit={unlock}
      />
      <Toast toast={toast} onDismiss={dismissToast} />
    </section>
  );
}
