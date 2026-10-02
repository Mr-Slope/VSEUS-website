'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { formatIssueDate, type Issue } from '@/lib/economicreview/issues';
import { EditorError } from '@/lib/economicreview/editor';
import { EditorDialog } from './EditorDialog';

interface DeleteIssueDialogProps {
  /** The issue to delete, or null when closed. */
  issue: Issue | null;
  onClose: () => void;
  /** Resolves once deleted. Rejects with a message to show in the dialog. */
  onConfirm: () => Promise<void>;
}

/**
 * The one step between the delete button and a deleted issue.
 *
 * Focus starts on Cancel rather than Delete, so a stray Enter backs out.
 */
export function DeleteIssueDialog({ issue, onClose, onConfirm }: DeleteIssueDialogProps) {
  return (
    <EditorDialog open={issue !== null} onClose={onClose} title="Delete this issue?" titleId="economicreview-delete-issue-title">
      {issue && <DeleteConfirm issue={issue} onCancel={onClose} onConfirm={onConfirm} />}
    </EditorDialog>
  );
}

function DeleteConfirm({
  issue,
  onCancel,
  onConfirm,
}: {
  issue: Issue;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const date = formatIssueDate(issue.created_at);

  async function handleDelete() {
    setWorking(true);
    setError(null);
    try {
      await onConfirm();
    } catch (e) {
      setWorking(false);
      setError(e instanceof EditorError ? e.message : 'Something went wrong, so the issue was not deleted. Try again.');
    }
  }

  return (
    <div aria-busy={working}>
      <p className="text-sm text-muted leading-relaxed">
        It will disappear from the archive for every reader. This cannot be undone.
      </p>

      <div className="mt-4 rounded-lg border border-ice-400 bg-ice-200 px-4 py-3">
        <p className="font-semibold text-midnight leading-snug">{issue.title}</p>
        {date && <p className="text-xs text-muted mt-1">{date}</p>}
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={working} data-autofocus>
          Cancel
        </Button>
        <Button type="button" variant="danger" onClick={handleDelete} loading={working}>
          Delete issue
        </Button>
      </div>
    </div>
  );
}
