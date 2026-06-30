'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteEvent } from '@/app/actions/events';

export function DeleteEventButton({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState('');

  function handleDelete() {
    if (!confirm('Delete this event? This cannot be undone.')) return;
    setError('');
    startTransition(async () => {
      try {
        await deleteEvent(eventId);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Delete failed.');
      }
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      title={error || undefined}
      className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
    >
      {pending ? 'Deleting…' : 'Delete'}
    </button>
  );
}
