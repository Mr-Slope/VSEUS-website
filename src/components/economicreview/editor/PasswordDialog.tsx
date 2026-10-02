'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EditorError } from '@/lib/economicreview/editor';
import { EditorDialog } from './EditorDialog';

interface PasswordDialogProps {
  open: boolean;
  /** Why the password is being asked for again, e.g. after a session ended mid-edit. */
  notice: string | null;
  onClose: () => void;
  /** Resolves once unlocked. Rejects with a message to show beside the field. */
  onSubmit: (password: string) => Promise<void>;
}

/** The prompt behind the tab bar's ⋮ button. */
export function PasswordDialog({ open, notice, onClose, onSubmit }: PasswordDialogProps) {
  return (
    <EditorDialog open={open} onClose={onClose} title="Unlock the editor" titleId="economicreview-editor-password-title">
      <PasswordForm notice={notice} onCancel={onClose} onSubmit={onSubmit} />
    </EditorDialog>
  );
}

function PasswordForm({
  notice,
  onCancel,
  onSubmit,
}: {
  notice: string | null;
  onCancel: () => void;
  onSubmit: (password: string) => Promise<void>;
}) {
  const [password, setPassword] = useState('');
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!password) return setError('Enter the editor password.');

    setWorking(true);
    setError(null);
    try {
      await onSubmit(password);
    } catch (e) {
      setWorking(false);
      setPassword('');
      setError(e instanceof EditorError ? e.message : 'Something went wrong. Try again in a moment.');
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={working}>
      {notice && (
        <p className="mb-4 rounded-lg bg-accent-200 px-3 py-2.5 text-sm text-midnight leading-relaxed">{notice}</p>
      )}
      <p className="text-sm text-muted leading-relaxed mb-5">
        Enter the editor password to manage issues in the archive and moderate reader comments.
      </p>

      <Input
        label="Password"
        id="economicreview-editor-password"
        type="password"
        name="password"
        autoComplete="current-password"
        data-autofocus
        required
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (error) setError(null);
        }}
        error={error ?? undefined}
      />

      <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={working}>
          Cancel
        </Button>
        <Button type="submit" variant="accent" loading={working}>
          Unlock
        </Button>
      </div>
    </form>
  );
}
