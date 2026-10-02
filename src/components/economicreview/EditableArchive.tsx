'use client';

import React, { Suspense, useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { IssueArchive, IssueArchiveSkeleton } from './IssueArchive';
import { TAB_BAR_ACTIONS_ID } from './SectionTabs';
import { Toast, type ToastMessage } from './Toast';
import { EditorMenuButton } from './editor/EditorMenuButton';
import { PasswordDialog } from './editor/PasswordDialog';
import { IssueEditorDialog, type EditTarget } from './editor/IssueEditorDialog';
import { DeleteIssueDialog } from './editor/DeleteIssueDialog';
import { formatIssueDate, isScheduled, type Issue } from '@/lib/economicreview/issues';
import {
  createIssue,
  deleteIssue,
  EditorError,
  hasEditorSession,
  onSessionEnded,
  signIn,
  signOut,
  updateIssue,
  type IssueDraft,
} from '@/lib/economicreview/editor';

/*
  The slot is a fixed element in the section layout, so there is nothing to
  subscribe to. The server snapshot is null, which keeps the button out of the
  static HTML and adds it once the page hydrates.
*/
const subscribeToNothing = () => () => {};
const findSlot = () => document.getElementById(TAB_BAR_ACTIONS_ID);
const noSlotOnServer = () => null;

/**
 * The archive, plus the editor that adds, edits, and deletes its issues.
 *
 * Everything to do with editing lives here, inside the archive page, rather
 * than in the section layout. Mission, Team, and Terms stay the static pages
 * they were and load none of it. The one visible piece outside the page is
 * the ⋮ button, which is portalled into an empty slot in the tab bar.
 *
 * `unlocked` only decides what is shown. The database decides what may be
 * written: with the editor locked a write would fail at row level security,
 * and with it unlocked a write succeeds only because the signed-in account is
 * on the editor allowlist. See lib/economicreview/editor.ts.
 */
export function EditableArchive() {
  const slot = useSyncExternalStore(subscribeToNothing, findSlot, noSlotOnServer);

  const [unlocked, setUnlocked] = useState(false);
  /** Open with an optional explanation, or null when closed. */
  const [prompt, setPrompt] = useState<{ notice: string | null } | null>(null);
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Issue | null>(null);
  const [revision, setRevision] = useState(0);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const dismissToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    let cancelled = false;

    // An editor who went to another tab of the section and came back is still
    // signed in, in memory. After a reload there is nothing to pick up.
    hasEditorSession().then((live) => {
      if (!cancelled && live) setUnlocked(true);
    });

    // A refresh that fails ends the session. Hide the controls when it does.
    const stop = onSessionEnded(() => setUnlocked(false));

    return () => {
      cancelled = true;
      stop();
    };
  }, []);

  async function unlock(password: string) {
    await signIn(password);
    setUnlocked(true);
    setPrompt(null);
    setToast({
      tone: 'success',
      title: 'Editor unlocked',
      body: 'Add an issue from the ⋮ menu, or use the buttons on a card to edit or delete it.',
    });
  }

  async function lock() {
    await signOut();
    setUnlocked(false);
    setEditTarget(null);
    setDeleteTarget(null);
    setToast({ tone: 'info', title: 'Editor locked', body: 'You are signed out. Editing needs the password again.' });
  }

  /**
   * Runs one write. If the session has ended, or the account is no longer an
   * editor, the editor locks and asks for the password again on top of the
   * open dialog, so nothing typed into the form is lost. The error still
   * reaches that dialog, which shows it and stays open.
   */
  async function write(action: () => Promise<void>) {
    try {
      await action();
    } catch (error) {
      if (error instanceof EditorError && (error.kind === 'session' || error.kind === 'forbidden')) {
        await signOut();
        setUnlocked(false);
        setPrompt({ notice: error.message });
      }
      throw error;
    }
  }

  async function save(draft: IssueDraft) {
    const target = editTarget;
    if (!target) return;

    let changed = true;
    await write(async () => {
      if (target.kind === 'new') await createIssue(draft);
      else changed = await updateIssue(target.issue, draft);
    });

    setEditTarget(null);
    if (!changed) {
      setToast({ tone: 'info', title: 'Nothing to save', body: 'None of the fields were changed.' });
      return;
    }

    setRevision((n) => n + 1);
    const when = formatIssueDate(draft.publishedAt);
    setToast(
      target.kind === 'new'
        ? {
            tone: 'success',
            title: 'Issue added',
            body: isScheduled({ created_at: draft.publishedAt })
              ? `"${draft.title}" is scheduled for ${when}.`
              : `"${draft.title}" is now in the archive.`,
          }
        : { tone: 'success', title: 'Changes saved', body: `"${draft.title}" has been updated.` },
    );
  }

  async function remove() {
    const issue = deleteTarget;
    if (!issue) return;

    await write(() => deleteIssue(issue));

    setDeleteTarget(null);
    setRevision((n) => n + 1);
    setToast({ tone: 'success', title: 'Issue deleted', body: `"${issue.title}" has been removed from the archive.` });
  }

  return (
    <>
      {/*
        The archive reads its search and course filter from the address, and
        without a boundary that would push everything up to the page into the
        browser and fail the build. The fallback is what the static HTML carries.
      */}
      <Suspense fallback={<IssueArchiveSkeleton />}>
        <IssueArchive
          includeScheduled={unlocked}
          revision={revision}
          onEdit={unlocked ? (issue) => setEditTarget({ kind: 'edit', issue }) : undefined}
          onDelete={unlocked ? setDeleteTarget : undefined}
        />
      </Suspense>

      {slot &&
        createPortal(
          <EditorMenuButton
            unlocked={unlocked}
            onUnlock={() => setPrompt({ notice: null })}
            onAdd={() => setEditTarget({ kind: 'new' })}
            onLock={lock}
          />,
          slot,
        )}

      <IssueEditorDialog target={editTarget} onClose={() => setEditTarget(null)} onSave={save} />
      <DeleteIssueDialog issue={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={remove} />
      {/* Opened last when a save is interrupted, so the top layer puts it above that form. */}
      <PasswordDialog
        open={prompt !== null}
        notice={prompt?.notice ?? null}
        onClose={() => setPrompt(null)}
        onSubmit={unlock}
      />
      <Toast toast={toast} onDismiss={dismissToast} />
    </>
  );
}
