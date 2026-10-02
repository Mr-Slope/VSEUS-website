'use client';

import React, { useId, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Issue } from '@/lib/economicreview/issues';
import {
  checkCover,
  checkPdf,
  COVER_TYPES,
  EditorError,
  megabytes,
  PDF_MAX_BYTES,
  type FileChange,
  type IssueDraft,
} from '@/lib/economicreview/editor';
import { addCourses, MAX_COURSES } from '@/lib/economicreview/courses';
import { EditorDialog } from './EditorDialog';

export type EditTarget = { kind: 'new' } | { kind: 'edit'; issue: Issue };

interface IssueEditorDialogProps {
  /** What is being edited, or null when closed. */
  target: EditTarget | null;
  onClose: () => void;
  /** Resolves once saved. Rejects with a message to show in the form. */
  onSave: (draft: IssueDraft) => Promise<void>;
}

/** Adding a new issue, or editing one already in the archive. */
export function IssueEditorDialog({ target, onClose, onSave }: IssueEditorDialogProps) {
  return (
    <EditorDialog
      open={target !== null}
      onClose={onClose}
      title={target?.kind === 'edit' ? 'Edit issue' : 'Add an issue'}
      titleId="economicreview-issue-editor-title"
      wide
    >
      {target && <IssueForm target={target} onCancel={onClose} onSave={onSave} />}
    </EditorDialog>
  );
}

/** An ISO timestamp as a datetime-local value, in the browser's own time zone. */
function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** The reverse. A datetime-local value carries no offset, so it is read as local time. */
function fromLocalInput(value: string): string | null {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/** The file name at the end of a stored path or URL, for showing what is attached now. */
function fileName(path: string | null): string | null {
  if (!path) return null;
  const last = path.split('?')[0].split('/').pop() ?? '';
  try {
    return decodeURIComponent(last) || null;
  } catch {
    return last || null;
  }
}

interface Errors {
  title?: string;
  date?: string;
  courses?: string;
  cover?: string;
  pdf?: string;
  form?: string;
}

const TEXTAREA_CLASS = [
  'w-full rounded-lg border border-ice-400 bg-offwhite px-4 py-2.5 text-sm text-midnight',
  'placeholder:text-muted/60 outline-none transition-all duration-150',
  'focus:border-blue focus:ring-2 focus:ring-blue/25 resize-y',
].join(' ');

function IssueForm({
  target,
  onCancel,
  onSave,
}: {
  target: EditTarget;
  onCancel: () => void;
  onSave: (draft: IssueDraft) => Promise<void>;
}) {
  const issue = target.kind === 'edit' ? target.issue : null;
  const ids = useId();

  // Read once when the form opens. A new issue defaults to going live now.
  const [openedAt] = useState(() => Date.now());
  const [initialDate] = useState(() => toLocalInput(issue?.created_at ?? new Date(openedAt).toISOString()));

  const [title, setTitle] = useState(issue?.title ?? '');
  const [description, setDescription] = useState(issue?.description ?? '');
  const [date, setDate] = useState(initialDate);
  const [authorName, setAuthorName] = useState(issue?.author_name ?? '');
  const [authorRole, setAuthorRole] = useState(issue?.author_role ?? '');
  const [courses, setCourses] = useState<string[]>(issue?.courses ?? []);
  /** Typed into the course box but not yet added as a chip. Saving adds it. */
  const [courseText, setCourseText] = useState('');
  const [cover, setCover] = useState<FileChange>({ kind: 'keep' });
  const [pdf, setPdf] = useState<FileChange>({ kind: 'keep' });
  const [errors, setErrors] = useState<Errors>({});
  const [working, setWorking] = useState(false);

  // Only drives the hint, so the moment the form opened is close enough to now.
  const chosen = fromLocalInput(date);
  const scheduled = chosen !== null && new Date(chosen).getTime() > openedAt;

  async function pickPdf(file: File) {
    const problem = await checkPdf(file);
    setErrors((e) => ({ ...e, pdf: problem ?? undefined, form: undefined }));
    if (!problem) setPdf({ kind: 'replace', file });
  }

  function pickCover(file: File) {
    const problem = checkCover(file);
    setErrors((e) => ({ ...e, cover: problem ?? undefined, form: undefined }));
    if (!problem) setCover({ kind: 'replace', file });
  }

  /** Turns whatever is in the course box into chips, or explains why it cannot. */
  function commitCourseText() {
    if (!courseText.trim()) return;
    const result = addCourses(courses, courseText);
    if (result.ok) {
      setCourses(result.courses);
      setCourseText('');
    }
    setErrors((e) => ({ ...e, courses: result.ok ? undefined : result.problem, form: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    // An untouched date keeps the stored timestamp exactly, seconds and all.
    const publishedAt = issue && date === initialDate ? issue.created_at : fromLocalInput(date);
    // A course typed but never turned into a chip still counts.
    const courseResult = addCourses(courses, courseText);

    const next: Errors = {};
    if (!trimmedTitle) next.title = 'Give the issue a title.';
    if (!publishedAt) next.date = 'Enter the date and time the issue goes live.';
    if (!courseResult.ok) next.courses = courseResult.problem;
    if (next.title || next.date || !publishedAt || !courseResult.ok) {
      setErrors((e) => ({ ...e, ...next, form: undefined }));
      return;
    }

    setCourses(courseResult.courses);
    setCourseText('');
    setWorking(true);
    setErrors({});
    try {
      await onSave({
        title: trimmedTitle,
        description: description.trim(),
        publishedAt,
        courses: courseResult.courses,
        authorName: authorName.trim() || null,
        authorRole: authorRole.trim() || null,
        cover,
        pdf,
      });
    } catch (e) {
      setWorking(false);
      setErrors({
        form: e instanceof EditorError ? e.message : 'Something went wrong. Check your connection and try again.',
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={working} className="mt-4 flex flex-col gap-5">
      <Input
        label="Title"
        id={`${ids}-title`}
        name="title"
        required
        maxLength={200}
        data-autofocus
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (errors.title) setErrors((x) => ({ ...x, title: undefined }));
        }}
        error={errors.title}
      />

      <div className="flex flex-col gap-1">
        <label htmlFor={`${ids}-description`} className="text-sm font-medium text-midnight">
          Summary
        </label>
        <textarea
          id={`${ids}-description`}
          name="description"
          rows={4}
          maxLength={600}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-describedby={`${ids}-description-hint`}
          className={TEXTAREA_CLASS}
        />
        <p id={`${ids}-description-hint`} className="text-xs text-muted">
          Shown under the title on the card.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Author"
          id={`${ids}-author`}
          name="author"
          autoComplete="off"
          maxLength={120}
          placeholder="e.g. Jane Doe"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          hint="Shown in the byline on the report page."
        />
        <Input
          label="Author's role"
          id={`${ids}-author-role`}
          name="author-role"
          autoComplete="off"
          maxLength={160}
          placeholder="e.g. Senior Editor, VSEUS"
          value={authorRole}
          onChange={(e) => setAuthorRole(e.target.value)}
          hint="Shown after the author's name."
        />
      </div>

      <Input
        label="Goes live"
        id={`${ids}-date`}
        name="published"
        type="datetime-local"
        required
        value={date}
        onChange={(e) => {
          setDate(e.target.value);
          if (errors.date) setErrors((x) => ({ ...x, date: undefined }));
        }}
        error={errors.date}
        hint={
          scheduled
            ? 'Scheduled. Readers will see it from this moment on, in your local time.'
            : 'Shown as the issue date. A future time schedules the issue instead.'
        }
      />

      <CourseField
        courses={courses}
        text={courseText}
        error={errors.courses}
        onTextChange={(value) => {
          setCourseText(value);
          if (errors.courses) setErrors((x) => ({ ...x, courses: undefined }));
        }}
        onCommit={commitCourseText}
        onRemove={(code) => {
          setCourses((list) => list.filter((c) => c !== code));
          setErrors((x) => ({ ...x, courses: undefined }));
        }}
      />

      <FileField
        label="Cover image"
        accept={COVER_TYPES.join(',')}
        hint="JPEG, PNG, WebP, or AVIF. Resized to 1600px on the long edge before upload."
        current={fileName(issue?.image_path ?? null)}
        change={cover}
        error={errors.cover}
        onPick={pickCover}
        onChange={(change) => {
          setCover(change);
          setErrors((x) => ({ ...x, cover: undefined }));
        }}
      />

      <FileField
        label="PDF"
        accept="application/pdf,.pdf"
        hint={`Up to ${megabytes(PDF_MAX_BYTES)}.`}
        current={fileName(issue?.pdf_path ?? null)}
        change={pdf}
        error={errors.pdf}
        onPick={pickPdf}
        onChange={(change) => {
          setPdf(change);
          setErrors((x) => ({ ...x, pdf: undefined }));
        }}
      />

      {errors.form && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
          {errors.form}
        </p>
      )}

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={working}>
          Cancel
        </Button>
        <Button type="submit" variant="accent" loading={working}>
          {issue ? 'Save changes' : 'Add issue'}
        </Button>
      </div>
    </form>
  );
}

interface CourseFieldProps {
  courses: string[];
  text: string;
  error?: string;
  onTextChange: (value: string) => void;
  /** Turn the typed text into chips. */
  onCommit: () => void;
  onRemove: (code: string) => void;
}

/**
 * The ECON courses the issue relates to, as removable chips with a box to
 * type more into. Readers filter the archive by these.
 *
 * Enter or a comma adds what is typed, and so does leaving the box, so a
 * course typed just before saving is not lost. Enter has to be caught here
 * because in a text box it would otherwise submit the form.
 */
function CourseField({ courses, text, error, onTextChange, onCommit, onRemove }: CourseFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const full = courses.length >= MAX_COURSES;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={`${id}-input`} className="text-sm font-medium text-midnight">
        Related courses
      </label>
      <div
        className={[
          'flex flex-wrap items-center gap-1.5 rounded-lg border bg-offwhite px-2 py-1.5 transition-all duration-150',
          error
            ? 'border-red-400 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100'
            : 'border-ice-400 focus-within:border-blue focus-within:ring-2 focus-within:ring-blue/25',
        ].join(' ')}
        onClick={(e) => {
          // A click on the field's padding lands in the box, as it would on a plain input.
          if (e.target === e.currentTarget) inputRef.current?.focus();
        }}
      >
        {courses.length > 0 && (
          <ul aria-label="Courses listed" className="flex flex-wrap gap-1.5">
            {courses.map((code) => (
              <li
                key={code}
                className="inline-flex items-center gap-1 rounded-md bg-ice pl-2.5 pr-1 py-1 font-display text-xs font-semibold text-midnight"
              >
                {code}
                <button
                  type="button"
                  onClick={() => {
                    onRemove(code);
                    // The button is about to disappear. Keep focus in the field rather than losing it to the page.
                    inputRef.current?.focus();
                  }}
                  aria-label={`Remove ${code}`}
                  className="w-5 h-5 rounded flex items-center justify-center text-midnight-700 hover:bg-ice-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
                >
                  <svg aria-hidden="true" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
        <input
          ref={inputRef}
          id={`${id}-input`}
          type="text"
          autoComplete="off"
          spellCheck={false}
          maxLength={120}
          value={text}
          placeholder={full ? `Up to ${MAX_COURSES} courses` : courses.length > 0 ? 'Add another' : 'e.g. 101, 302'}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${id}-hint`}
          onChange={(e) => onTextChange(e.target.value)}
          onBlur={onCommit}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              onCommit();
            } else if (e.key === 'Backspace' && text === '' && courses.length > 0) {
              onRemove(courses[courses.length - 1]);
            }
          }}
          className="min-w-[8rem] flex-1 bg-transparent px-2 py-1 text-sm text-midnight placeholder:text-muted/60 outline-none"
        />
      </div>
      <p id={`${id}-hint`} className={error ? 'text-xs text-red-500' : 'text-xs text-muted'}>
        {error ?? 'Type a course number and press Enter. Readers can filter the archive by these.'}
      </p>
    </div>
  );
}

interface FileFieldProps {
  label: string;
  accept: string;
  hint: string;
  /** Name of the file attached now, if any. */
  current: string | null;
  change: FileChange;
  error?: string;
  onPick: (file: File) => void;
  onChange: (change: FileChange) => void;
}

/**
 * One of the issue's two files: what is attached now, and what saving will do
 * to it. Nothing is uploaded until the form is saved.
 */
function FileField({ label, accept, hint, current, change, error, onPick, onChange }: FileFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const noun = label.toLowerCase();

  let status: React.ReactNode;
  if (change.kind === 'replace') {
    status = (
      <>
        <span className="font-medium">New:</span> {change.file.name}{' '}
        <span className="text-muted">({megabytes(change.file.size)})</span>
      </>
    );
  } else if (change.kind === 'remove') {
    status = <span className="text-muted">Removed when you save</span>;
  } else {
    status = current ?? <span className="text-muted">None</span>;
  }

  return (
    <div className="flex flex-col gap-1" role="group" aria-labelledby={`${id}-label`}>
      <span id={`${id}-label`} className="text-sm font-medium text-midnight">
        {label}
      </span>
      <div
        className={[
          'flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border bg-offwhite px-3 py-2',
          error ? 'border-red-400' : 'border-ice-400',
        ].join(' ')}
      >
        <p className="min-w-0 flex-1 text-sm text-midnight break-all">{status}</p>
        <div className="flex gap-1.5">
          {change.kind === 'keep' ? (
            <>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => inputRef.current?.click()}
                aria-label={current ? `Replace ${noun}` : `Choose ${noun}`}
              >
                {current ? 'Replace' : 'Choose file'}
              </Button>
              {current && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onChange({ kind: 'remove' })}
                  aria-label={`Remove ${noun}`}
                >
                  Remove
                </Button>
              )}
            </>
          ) : (
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange({ kind: 'keep' })}>
              {change.kind === 'replace' ? 'Clear' : 'Undo'}
            </Button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            // Reset so choosing the same file again still fires a change.
            e.target.value = '';
            if (file) onPick(file);
          }}
        />
      </div>
      {error ? <p className="text-xs text-red-500">{error}</p> : <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}
