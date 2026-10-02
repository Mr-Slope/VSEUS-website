/**
 * The conversation under each issue in the reader.
 *
 * Readers comment, reply, like, and report with no account, under a display
 * name they choose. That makes the database the only place rules can hold, so
 * every one of them lives there: the tables are closed to the API and the site
 * talks only to the functions in the Review's Supabase project, which check
 * every request. See supabase/migrations/20260930120000_newsletter_comments.sql
 * in the economicsgazette repository. Nothing here is a safeguard; the checks
 * in this file exist so a reader hears about a problem before the database
 * says no, in words written for them.
 *
 * Each browser keeps a random key in localStorage and sends it with every
 * action. The database stores only a hash of it. It is how a reader can delete
 * their own comment later, and what the rate limits count.
 */
import { getSupabase } from './supabase';
import { NotConfiguredError } from './issues';

/**
 * The version of the comment terms on /economicreview/comment-terms. Change it
 * whenever those terms change: each comment records the version in force when
 * it was posted.
 */
export const COMMENT_TERMS_VERSION = '2026-09-30';

export const COMMENT_TERMS_PATH = '/economicreview/comment-terms';

/** Mirrors the limits in the database. */
export const USERNAME_MIN = 2;
export const USERNAME_MAX = 30;
export const BODY_MIN = 2;
export const BODY_MAX = 2000;

export type CommentStatus = 'visible' | 'hidden' | 'deleted' | 'removed';

export interface Comment {
  id: string;
  parent_id: string | null;
  /** Empty for a deleted or removed comment kept as a placeholder for its replies. */
  username: string;
  body: string;
  /** Readers only ever see `visible` and the two placeholders. Editors also see `hidden`. */
  status: CommentStatus;
  created_at: string;
  likes: number;
  /** Whether this browser has liked it. */
  liked: boolean;
  /** Whether this browser posted it. */
  mine: boolean;
  /** Always 0 unless an editor is signed in. */
  reports: number;
}

export interface Thread {
  comment: Comment;
  /** Oldest first, so a thread reads as the exchange it was. */
  replies: Comment[];
}

export const REPORT_REASONS = [
  { value: 'spam', label: 'Spam or advertising' },
  { value: 'harassment', label: 'Harassment or a personal attack' },
  { value: 'hate', label: 'Hate speech or discrimination' },
  { value: 'personal_info', label: "Shares someone's personal information" },
  { value: 'misinformation', label: 'False or misleading claims about a person' },
  { value: 'off_topic', label: 'Off topic' },
  { value: 'other', label: 'Something else' },
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number]['value'];

export type CommentErrorKind =
  /** Something the reader can fix in what they typed. */
  | 'invalid'
  /** Posting too quickly. The message says how long to wait. */
  | 'rate'
  /** Comments are switched off, or not set up on this project yet. */
  | 'closed'
  /** The comment or issue is gone, most likely removed a moment ago. */
  | 'missing'
  /** An editor action from someone who is no longer signed in as one. */
  | 'forbidden'
  /** Anything else, usually the connection. */
  | 'failed';

/** A failure with a message written for the reader, safe to show as is. */
export class CommentError extends Error {
  readonly kind: CommentErrorKind;

  constructor(message: string, kind: CommentErrorKind) {
    super(message);
    this.name = 'CommentError';
    this.kind = kind;
  }
}

/** See REQUEST_TIMEOUT_MS in issues.ts: a request that hangs should fail at a known point. */
const REQUEST_TIMEOUT_MS = 12_000;

const KEY_STORAGE = 'economicreview:comment-key';
const NAME_STORAGE = 'economicreview:comment-name';

/*
  Storage can throw outright (private windows, blocked site data), so every
  read and write is guarded. Without it the key lives for this page view only,
  which still works: the reader just cannot delete the comment after leaving.
*/
let memoryKey: string | null = null;

function readStorage(name: string): string | null {
  try {
    return window.localStorage.getItem(name);
  } catch {
    return null;
  }
}

function writeStorage(name: string, value: string): void {
  try {
    window.localStorage.setItem(name, value);
  } catch {
    // Kept in memory only, see above.
  }
}

/** This browser's key, created on first use. */
export function browserKey(): string {
  const stored = readStorage(KEY_STORAGE);
  if (stored && /^[A-Za-z0-9-]{32,64}$/.test(stored)) return stored;
  memoryKey ??= crypto.randomUUID();
  writeStorage(KEY_STORAGE, memoryKey);
  return memoryKey;
}

/** The display name used last time, to save typing it again. */
export function savedName(): string {
  return readStorage(NAME_STORAGE) ?? '';
}

export function saveName(name: string): void {
  writeStorage(NAME_STORAGE, name);
}

function waitFor(seconds: number): string {
  if (seconds <= 60) return `${seconds} second${seconds === 1 ? '' : 's'}`;
  const minutes = Math.ceil(seconds / 60);
  if (minutes <= 90) return `${minutes} minutes`;
  return `${Math.ceil(minutes / 60)} hours`;
}

interface DatabaseFailure {
  code?: string;
  message?: string;
  details?: string | null;
}

/** The database's refusals, keyed by the message it raises, in the reader's terms. */
function fromDatabase(error: DatabaseFailure, fallback: string): CommentError {
  // The functions do not exist: the migration has not been run on this project.
  if (error.code === 'PGRST202' || error.code === '42883') {
    return new CommentError('Comments are not open on this site yet.', 'closed');
  }
  if (error.code === '42501') {
    return new CommentError('Your editor session has ended. Unlock the editor again to moderate.', 'forbidden');
  }

  switch (error.message) {
    case 'rate_limited': {
      const seconds = Number.parseInt(error.details ?? '', 10);
      return new CommentError(
        Number.isFinite(seconds)
          ? `You are posting quickly. Try again in ${waitFor(seconds)}.`
          : 'You are posting quickly. Try again in a little while.',
        'rate',
      );
    }
    case 'conversation_busy':
      return new CommentError('This conversation is very busy right now. Try again in a few minutes.', 'rate');
    case 'duplicate':
      return new CommentError('That comment has already been posted.', 'invalid');
    case 'invalid_username':
      return new CommentError(
        `Choose a display name of ${USERNAME_MIN} to ${USERNAME_MAX} characters, without links, email addresses, or symbols like < > @ /.`,
        'invalid',
      );
    case 'reserved_username':
      return new CommentError(
        'That display name could be mistaken for the Review or its staff. Choose another.',
        'invalid',
      );
    case 'invalid_body':
      return new CommentError(`Comments can be ${BODY_MIN} to ${BODY_MAX} characters long.`, 'invalid');
    case 'too_many_links':
      return new CommentError('Comments can include up to two links.', 'invalid');
    case 'repetitive':
      return new CommentError('Your comment repeats one character many times. Edit it and try again.', 'invalid');
    case 'blocked_term':
      return new CommentError(
        'Your comment or display name includes language our community guidelines do not allow. Edit it and try again.',
        'invalid',
      );
    case 'terms_required':
      return new CommentError('Agree to the comment terms to post.', 'invalid');
    case 'comments_closed':
      return new CommentError('Comments are closed for now.', 'closed');
    case 'own_comment':
      return new CommentError('You cannot report your own comment. You can delete it instead.', 'invalid');
    case 'issue_not_found':
    case 'parent_not_found':
    case 'comment_not_found':
      return new CommentError('That comment is no longer available. It may have just been removed.', 'missing');
    default:
      return new CommentError(fallback, 'failed');
  }
}

/** Runs one database function with the shared timeout, mapping any refusal. */
async function call<T>(fn: string, args: Record<string, unknown>, fallback: string): Promise<T> {
  const supabase = getSupabase();
  if (!supabase) throw new NotConfiguredError();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const { data, error } = await supabase.rpc(fn, args).abortSignal(controller.signal);
    if (error) throw fromDatabase(error, fallback);
    return data as T;
  } catch (error) {
    if (error instanceof CommentError) throw error;
    throw new CommentError(fallback, 'failed');
  } finally {
    clearTimeout(timer);
  }
}

/** An issue's comments, oldest first. Editors, while signed in, also get hidden ones. */
export async function fetchComments(issueId: string): Promise<Comment[]> {
  const rows = await call<Comment[]>(
    'list_newsletter_comments',
    { p_newsletter: issueId, p_key: browserKey() },
    'The comments did not load.',
  );
  return (rows ?? []).map((row) => ({ ...row, likes: Number(row.likes), reports: Number(row.reports) }));
}

/**
 * Groups comments into threads, newest thread first or by likes. Replies stay
 * in the order they were written whichever way the threads are sorted.
 */
export function toThreads(comments: Comment[], sort: 'newest' | 'oldest' | 'liked'): Thread[] {
  const replies = new Map<string, Comment[]>();
  for (const comment of comments) {
    if (!comment.parent_id) continue;
    const list = replies.get(comment.parent_id) ?? [];
    list.push(comment);
    replies.set(comment.parent_id, list);
  }

  const threads = comments
    .filter((comment) => !comment.parent_id)
    .map((comment) => ({ comment, replies: replies.get(comment.id) ?? [] }));

  const time = (thread: Thread) => new Date(thread.comment.created_at).getTime();
  if (sort === 'newest') threads.sort((a, b) => time(b) - time(a));
  else if (sort === 'oldest') threads.sort((a, b) => time(a) - time(b));
  else threads.sort((a, b) => b.comment.likes - a.comment.likes || time(b) - time(a));

  return threads;
}

/** Published comments only: the placeholders are not counted. */
export function countComments(comments: Comment[]): number {
  return comments.filter((comment) => comment.status === 'visible').length;
}

export async function postComment(input: {
  issueId: string;
  parentId: string | null;
  username: string;
  body: string;
}): Promise<string> {
  return call<string>(
    'post_newsletter_comment',
    {
      p_newsletter: input.issueId,
      p_parent: input.parentId,
      p_username: input.username,
      p_body: input.body,
      p_key: browserKey(),
      p_terms_version: COMMENT_TERMS_VERSION,
    },
    'Your comment was not posted. Check your connection and try again.',
  );
}

export async function toggleLike(commentId: string): Promise<{ liked: boolean; likes: number }> {
  const rows = await call<{ liked: boolean; likes: number }[]>(
    'toggle_newsletter_comment_like',
    { p_comment: commentId, p_key: browserKey() },
    'That like did not go through. Try again.',
  );
  const row = rows?.[0];
  return { liked: Boolean(row?.liked), likes: Number(row?.likes ?? 0) };
}

/** Resolves to true when this report was the one that hid the comment. */
export async function reportComment(commentId: string, reason: ReportReason): Promise<boolean> {
  return call<boolean>(
    'report_newsletter_comment',
    { p_comment: commentId, p_key: browserKey(), p_reason: reason },
    'Your report was not sent. Try again, or email us.',
  );
}

export async function deleteOwnComment(commentId: string): Promise<void> {
  await call<null>(
    'delete_own_newsletter_comment',
    { p_comment: commentId, p_key: browserKey() },
    'Your comment was not deleted. Try again.',
  );
}

/** Editors only. The database refuses anyone not on the editor allowlist. */
export async function moderateComment(commentId: string, action: 'remove' | 'hide' | 'restore'): Promise<void> {
  await call<null>(
    'moderate_newsletter_comment',
    { p_comment: commentId, p_action: action },
    'That change did not go through. Try again.',
  );
}
