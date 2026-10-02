/**
 * Writing to the Vancouver Economic Review archive.
 *
 * Everything the archive's editor changes goes through here: signing in and
 * out, adding, editing and deleting issues, and the files that go with them.
 *
 * None of this is the security boundary. The site is a static export, so any
 * check made in the browser can be skipped by anyone with dev tools. What
 * decides who may write is row level security in the Review's Supabase
 * project: only accounts listed in `newsletter_editors` can change a row or
 * touch the `newsletters` Storage bucket. See
 * supabase/migrations/20260921120000_newsletter_editors.sql in the
 * economicsgazette repository. The checks here exist so the editor gets a
 * clear message before the database says no.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabase } from './supabase';
import { downloadNameFor, slugFor, type Issue } from './issues';
import { PUBLICATION } from './content';
import { sameCourses } from './courses';

/**
 * The editor account's sign-in email.
 *
 * Supabase password sign-in needs an email, so the password prompt supplies
 * this one. It only names the account. Whether that account may write is
 * decided by the allowlist in the database, never by this value.
 */
const EDITOR_EMAIL = PUBLICATION.email;

const BUCKET = 'newsletters';

/** Largest PDF accepted. Three times the biggest issue so far, and the bucket's own limit. */
export const PDF_MAX_BYTES = 25 * 1024 * 1024;

/** Largest cover accepted before resizing. A full-size phone photo is well under this. */
export const COVER_MAX_BYTES = 20 * 1024 * 1024;

/** Types a cover may start as. Every one of them is stored as a JPEG. */
export const COVER_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

/**
 * Covers are shrunk to this long edge before upload, the same rule as covers
 * committed to public/. They show in a card a few hundred pixels wide, and a
 * static export has no image optimization to do it later.
 */
const COVER_LONG_EDGE = 1600;

/** The only object names this editor ever creates, and so the only ones it will delete. */
const OWNED_PATH = /^(pdfs\/[a-z0-9-]+\.pdf|covers\/[a-z0-9-]+\.jpg)$/;

export type EditorErrorKind =
  /** Something the editor can fix in the form, including a wrong password. */
  | 'invalid'
  /** Signed out, or the session expired. */
  | 'session'
  /** Signed in, but the account is not an editor. */
  | 'forbidden'
  /** The issue is gone, most likely deleted in another tab. */
  | 'missing'
  /** Editor access has not been set up on this build or in Supabase. */
  | 'setup'
  /** Anything else, usually the connection. */
  | 'failed';

/** A failure with a message written for the editor, safe to show as is. */
export class EditorError extends Error {
  readonly kind: EditorErrorKind;

  constructor(message: string, kind: EditorErrorKind) {
    super(message);
    this.name = 'EditorError';
    this.kind = kind;
  }
}

const SESSION_ENDED = 'Your editor session has ended. Enter the password again to keep editing.';
const NOT_AN_EDITOR = 'This account is not on the editor list, so editing stays locked.';

function client(): SupabaseClient {
  const supabase = getSupabase();
  if (!supabase) {
    throw new EditorError('The archive is not configured on this build, so it cannot be edited.', 'setup');
  }
  return supabase;
}

interface DatabaseFailure {
  code?: string;
}

function fromDatabase(error: DatabaseFailure, fallback: string): EditorError {
  // PostgREST's codes for a missing, malformed, or expired token.
  if (error.code === 'PGRST301' || error.code === 'PGRST302' || error.code === 'PGRST303') {
    return new EditorError(SESSION_ENDED, 'session');
  }
  // Row level security, or a revoked grant.
  if (error.code === '42501') return new EditorError(NOT_AN_EDITOR, 'forbidden');
  return new EditorError(fallback, 'failed');
}

interface StorageFailure {
  status?: number;
  statusCode?: string;
  code?: string;
  message?: string;
}

function fromStorage(error: StorageFailure, fallback: string): EditorError {
  const status = error.status ?? Number(error.statusCode);
  if (status === 401 || error.code === 'InvalidJWT') return new EditorError(SESSION_ENDED, 'session');
  if (status === 403 || /row-level security/i.test(error.message ?? '')) {
    return new EditorError(NOT_AN_EDITOR, 'forbidden');
  }
  if (status === 413 || error.code === 'EntityTooLarge') {
    return new EditorError('That file is larger than storage accepts.', 'invalid');
  }
  if (status === 415 || error.code === 'InvalidMimeType') {
    return new EditorError('Storage does not accept that type of file.', 'invalid');
  }
  return new EditorError(fallback, 'failed');
}

// ---------------------------------------------------------------------------
// Session
// ---------------------------------------------------------------------------

async function isEditor(supabase: SupabaseClient): Promise<boolean> {
  const { data, error } = await supabase.rpc('is_newsletter_editor');
  if (error) {
    if (error.code === 'PGRST202') {
      throw new EditorError('Editor access has not been set up in Supabase yet.', 'setup');
    }
    throw fromDatabase(error, 'Could not check editor access. Try again in a moment.');
  }
  return data === true;
}

/**
 * Signs in with the editor password, and stays signed in only if the account
 * is on the allowlist. An account that signs in but is not an editor is
 * signed straight back out, so it never holds a session here.
 */
export async function signIn(password: string): Promise<void> {
  const supabase = client();
  const { error } = await supabase.auth.signInWithPassword({ email: EDITOR_EMAIL, password });

  if (error) {
    if (error.code === 'email_not_confirmed') {
      throw new EditorError('The editor account has not been confirmed in Supabase yet.', 'setup');
    }
    if (error.code === 'invalid_credentials' || error.status === 400) {
      throw new EditorError('That password is not right.', 'invalid');
    }
    if (error.status === 429) {
      throw new EditorError('Too many attempts. Wait a minute, then try again.', 'failed');
    }
    throw new EditorError('Could not reach the sign-in service. Check your connection and try again.', 'failed');
  }

  let allowed = false;
  try {
    allowed = await isEditor(supabase);
  } finally {
    if (!allowed) await supabase.auth.signOut({ scope: 'local' });
  }
  if (!allowed) throw new EditorError(NOT_AN_EDITOR, 'forbidden');
}

/**
 * Ends the editor session with Supabase, not just in the page.
 *
 * Local scope ends this browser's session only. The editor account is shared,
 * so a global sign-out would also cut off a colleague mid-edit. supabase-js
 * drops the session from memory even when the request fails, so this tab is
 * locked either way.
 */
export async function signOut(): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  await supabase.auth.signOut({ scope: 'local' });
}

/**
 * Whether this tab still holds a live editor session, for instance after the
 * editor looked at another tab of the section and came back. Sessions live in
 * memory only, so after a reload this is always false.
 */
export async function hasEditorSession(): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  const { data } = await supabase.auth.getSession();
  if (!data.session) return false;
  try {
    return await isEditor(supabase);
  } catch {
    return false;
  }
}

/** Calls back whenever the session ends, including when a token refresh fails. Returns the unsubscribe. */
export function onSessionEnded(callback: () => void): () => void {
  const supabase = getSupabase();
  if (!supabase) return () => {};
  const { data } = supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') callback();
  });
  return () => data.subscription.unsubscribe();
}

// ---------------------------------------------------------------------------
// Files
// ---------------------------------------------------------------------------

export function megabytes(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Why a file cannot be used as an issue's PDF, or null if it can. Reads the first bytes, so it is async. */
export async function checkPdf(file: File): Promise<string | null> {
  const namedPdf = file.type === 'application/pdf' || (file.type === '' && /\.pdf$/i.test(file.name));
  if (!namedPdf) return 'Choose a PDF file.';
  if (file.size === 0) return 'That file is empty.';
  if (file.size > PDF_MAX_BYTES) {
    return `That PDF is ${megabytes(file.size)}. The limit is ${megabytes(PDF_MAX_BYTES)}.`;
  }
  // The type above comes from the file name. A real PDF also says so in its first bytes.
  const head = await file.slice(0, 1024).text();
  if (!head.includes('%PDF-')) return 'That file does not look like a PDF. Export it again and retry.';
  return null;
}

/** Why a file cannot be used as a cover, or null if it can. Checked before any resizing. */
export function checkCover(file: File): string | null {
  if (!COVER_TYPES.includes(file.type)) return 'Choose a JPEG, PNG, WebP, or AVIF image.';
  if (file.size === 0) return 'That file is empty.';
  if (file.size > COVER_MAX_BYTES) {
    return `That image is ${megabytes(file.size)}. The limit is ${megabytes(COVER_MAX_BYTES)}.`;
  }
  return null;
}

/** The cover as a JPEG no larger than COVER_LONG_EDGE on its long side. */
async function resizeCover(file: File): Promise<Blob> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new EditorError('That image could not be read. Try saving it as a JPEG or PNG first.', 'invalid');
  }

  const scale = Math.min(1, COVER_LONG_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) {
    bitmap.close();
    throw new EditorError('This browser could not process the image.', 'failed');
  }
  // JPEG has no transparency, and transparent areas would otherwise turn black.
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);
  context.imageSmoothingQuality = 'high';
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85));
  if (!blob) throw new EditorError('This browser could not process the image.', 'failed');
  return blob;
}

type Folder = 'pdfs' | 'covers';

/**
 * A fresh object name, e.g. "pdfs/2026-09-26-markets-in-motion-3f9a1c0b7d2e.pdf".
 *
 * Nothing from the uploaded file's own name is used, so the path is always in
 * one of the two folders the storage policy allows, with the extension it
 * expects. The random suffix keeps two uploads from ever colliding, and
 * uploads never overwrite, so a collision could only fail, not replace.
 */
function objectPath(folder: Folder, title: string, publishedAt: string): string {
  // en-CA formats as YYYY-MM-DD. Vancouver, like the date shown on the card.
  const date = new Date(publishedAt).toLocaleDateString('en-CA', { timeZone: 'America/Vancouver' });
  const slug = slugFor(title).slice(0, 60).replace(/-+$/, '') || 'issue';
  const unique = crypto.randomUUID().replace(/-/g, '').slice(0, 12);
  return `${folder}/${date}-${slug}-${unique}.${folder === 'pdfs' ? 'pdf' : 'jpg'}`;
}

interface Uploaded {
  path: string;
  url: string;
}

async function upload(
  supabase: SupabaseClient,
  folder: Folder,
  body: Blob,
  draft: Pick<IssueDraft, 'title' | 'publishedAt'>,
): Promise<Uploaded> {
  const path = objectPath(folder, draft.title, draft.publishedAt);
  /*
    supabase-js sends a Blob as multipart form data, where the type that counts
    is the Blob's own and the contentType option is ignored. Some systems give
    a PDF no type at all, which the bucket's type allowlist would refuse, so
    the body is rewrapped with the type this folder holds.
  */
  const type = folder === 'pdfs' ? 'application/pdf' : 'image/jpeg';
  const { error } = await supabase.storage.from(BUCKET).upload(path, new Blob([body], { type }), {
    contentType: type,
    upsert: false,
  });
  if (error) {
    throw fromStorage(error, `The ${folder === 'pdfs' ? 'PDF' : 'cover'} did not upload. Check your connection and try again.`);
  }

  /*
    A PDF link on another origin ignores the `download` attribute, so the
    query parameter asks Storage to send it as an attachment instead, named
    after the issue. The URL holds only slug characters, which keeps
    assetUrl()'s encodeURI from double-encoding anything.
  */
  const { publicUrl } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(path, folder === 'pdfs' ? { download: downloadNameFor(draft.title) } : undefined).data;
  return { path, url: publicUrl };
}

async function uploadPdf(supabase: SupabaseClient, file: File, draft: IssueDraft): Promise<Uploaded> {
  const problem = await checkPdf(file);
  if (problem) throw new EditorError(problem, 'invalid');
  return upload(supabase, 'pdfs', file, draft);
}

async function uploadCover(supabase: SupabaseClient, file: File, draft: IssueDraft): Promise<Uploaded> {
  const problem = checkCover(file);
  if (problem) throw new EditorError(problem, 'invalid');
  return upload(supabase, 'covers', await resizeCover(file), draft);
}

/**
 * The object path behind a URL this editor uploaded, or null for anything else.
 *
 * Only a URL inside the Review's bucket, naming an object of the shape
 * objectPath() produces, qualifies. Older files under public/, such as
 * "/newsletter_pdfs/...", and anything hosted elsewhere never match, so
 * nothing here can ever delete them.
 */
function ownedObjectPath(supabase: SupabaseClient, url: string | null): string | null {
  if (!url) return null;
  // Built locally, no request: ".../storage/v1/object/public/newsletters/".
  const prefix = supabase.storage.from(BUCKET).getPublicUrl('').data.publicUrl;
  if (!url.startsWith(prefix)) return null;
  const path = url.slice(prefix.length).split('?')[0];
  return OWNED_PATH.test(path) ? path : null;
}

/**
 * Deletes an uploaded file that its issue no longer uses.
 *
 * Best effort. A file left behind costs a little storage, and failing a save
 * that already went through would be worse. Anything another issue still
 * points at is left alone.
 */
async function discard(supabase: SupabaseClient, url: string | null, issueId: string): Promise<void> {
  const path = ownedObjectPath(supabase, url);
  if (!path || !url) return;

  try {
    const [asPdf, asCover] = await Promise.all([
      supabase.from('newsletters').select('id', { count: 'exact', head: true }).eq('pdf_path', url).neq('id', issueId),
      supabase.from('newsletters').select('id', { count: 'exact', head: true }).eq('image_path', url).neq('id', issueId),
    ]);
    // A failed or uncounted check keeps the file.
    if (asPdf.count !== 0 || asCover.count !== 0) return;
    await supabase.storage.from(BUCKET).remove([path]);
  } catch {
    // Best effort, see above.
  }
}

/** Removes files uploaded for a save that then failed. Nothing refers to them yet. */
async function removeUploads(supabase: SupabaseClient, uploads: Uploaded[]): Promise<void> {
  if (uploads.length === 0) return;
  try {
    await supabase.storage.from(BUCKET).remove(uploads.map((u) => u.path));
  } catch {
    // Best effort.
  }
}

// ---------------------------------------------------------------------------
// Issues
// ---------------------------------------------------------------------------

/** What the form wants done with one of an issue's files. */
export type FileChange = { kind: 'keep' } | { kind: 'replace'; file: File } | { kind: 'remove' };

export interface IssueDraft {
  title: string;
  description: string;
  /** ISO timestamp, stored as created_at: the publication date, as everywhere else. */
  publishedAt: string;
  /** Stored codes, cleaned as in courses.ts. */
  courses: string[];
  /** Trimmed, and null when left blank. */
  authorName: string | null;
  authorRole: string | null;
  cover: FileChange;
  pdf: FileChange;
}

type Row = Pick<
  Issue,
  'title' | 'description' | 'image_path' | 'pdf_path' | 'courses' | 'author_name' | 'author_role' | 'created_at'
>;

/**
 * An update or delete that matched nothing. Row level security filters rows
 * rather than raising an error, so this is either an account that is no
 * longer an editor or an issue that is gone. Asking which gives the editor
 * the right next step.
 */
async function explainNoRows(supabase: SupabaseClient): Promise<EditorError> {
  try {
    if (!(await isEditor(supabase))) return new EditorError(NOT_AN_EDITOR, 'forbidden');
  } catch (error) {
    if (error instanceof EditorError) return error;
  }
  return new EditorError('This issue no longer exists. It may have been deleted in another tab.', 'missing');
}

export async function createIssue(draft: IssueDraft): Promise<void> {
  const supabase = client();
  const uploads: Uploaded[] = [];

  try {
    const cover = draft.cover.kind === 'replace' ? await uploadCover(supabase, draft.cover.file, draft) : null;
    if (cover) uploads.push(cover);
    const pdf = draft.pdf.kind === 'replace' ? await uploadPdf(supabase, draft.pdf.file, draft) : null;
    if (pdf) uploads.push(pdf);

    const row: Row = {
      title: draft.title,
      description: draft.description,
      created_at: draft.publishedAt,
      image_path: cover?.url ?? null,
      pdf_path: pdf?.url ?? null,
      courses: draft.courses,
      author_name: draft.authorName,
      author_role: draft.authorRole,
    };
    const { error } = await supabase.from('newsletters').insert(row);
    if (error) throw fromDatabase(error, 'The issue was not added. Check your connection and try again.');
  } catch (error) {
    await removeUploads(supabase, uploads);
    throw error;
  }
}

/**
 * Saves only what changed, and reports whether anything did.
 *
 * Untouched fields are left out of the update entirely. That matters most for
 * created_at: the form edits it to the minute, and rewriting an untouched
 * timestamp would quietly drop its seconds.
 */
export async function updateIssue(issue: Issue, draft: IssueDraft): Promise<boolean> {
  const supabase = client();
  const patch: Partial<Row> = {};
  if (draft.title !== issue.title) patch.title = draft.title;
  if (draft.description !== issue.description) patch.description = draft.description;
  if (draft.publishedAt !== issue.created_at) patch.created_at = draft.publishedAt;
  if (!sameCourses(draft.courses, issue.courses)) patch.courses = draft.courses;
  if (draft.authorName !== issue.author_name) patch.author_name = draft.authorName;
  if (draft.authorRole !== issue.author_role) patch.author_role = draft.authorRole;
  if (draft.cover.kind === 'remove') patch.image_path = null;
  if (draft.pdf.kind === 'remove') patch.pdf_path = null;

  const uploads: Uploaded[] = [];
  try {
    if (draft.cover.kind === 'replace') {
      const cover = await uploadCover(supabase, draft.cover.file, draft);
      uploads.push(cover);
      patch.image_path = cover.url;
    }
    if (draft.pdf.kind === 'replace') {
      const pdf = await uploadPdf(supabase, draft.pdf.file, draft);
      uploads.push(pdf);
      patch.pdf_path = pdf.url;
    }

    if (Object.keys(patch).length === 0) return false;

    const { data, error } = await supabase.from('newsletters').update(patch).eq('id', issue.id).select('id');
    if (error) throw fromDatabase(error, 'The changes were not saved. Check your connection and try again.');
    if (!data || data.length === 0) throw await explainNoRows(supabase);
  } catch (error) {
    await removeUploads(supabase, uploads);
    throw error;
  }

  // The row points at its new files now, so replaced uploads can go. Older
  // files under public/ are never touched, see ownedObjectPath().
  if (draft.cover.kind !== 'keep') await discard(supabase, issue.image_path, issue.id);
  if (draft.pdf.kind !== 'keep') await discard(supabase, issue.pdf_path, issue.id);
  return true;
}

export async function deleteIssue(issue: Issue): Promise<void> {
  const supabase = client();
  const { data, error } = await supabase.from('newsletters').delete().eq('id', issue.id).select('id');
  if (error) throw fromDatabase(error, 'The issue was not deleted. Check your connection and try again.');
  if (!data || data.length === 0) throw await explainNoRows(supabase);

  // Only files uploaded through the editor are removed with the row.
  await discard(supabase, issue.image_path, issue.id);
  await discard(supabase, issue.pdf_path, issue.id);
}
