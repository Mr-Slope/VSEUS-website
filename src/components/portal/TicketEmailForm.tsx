'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';

export function TicketEmailForm({ currentTicketEmail }: { currentTicketEmail?: string }) {
  const { saveTicketEmail } = useAuthContext();
  const router = useRouter();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSave() {
    const val = input.trim();
    if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    startTransition(async () => {
      try {
        await saveTicketEmail(val);
        setInput('');
        setSaved(true);
        router.refresh();
        setTimeout(() => setSaved(false), 3000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not save.');
      }
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-navy-100 p-6 mb-6">
      <h2 className="text-base font-bold text-navy-900 mb-1">Ticket Delivery Email</h2>
      <p className="text-xs text-gray-500 mb-4">
        Event tickets will be sent to this address.
      </p>
      {currentTicketEmail && (
        <div className="flex items-center gap-2 mb-3 text-sm text-navy-700 bg-navy-50 border border-navy-100 rounded-lg px-3 py-2">
          <svg className="w-3.5 h-3.5 text-navy-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
          <span className="font-medium">{currentTicketEmail}</span>
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="email"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(''); setSaved(false); }}
          placeholder={currentTicketEmail ? 'Enter new ticket email' : 'Enter ticket email'}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-navy-900 placeholder:text-gray-400 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100 transition-all"
        />
        <button
          onClick={handleSave}
          disabled={pending}
          className="px-4 py-2 bg-navy-700 text-white text-sm font-semibold rounded-lg hover:bg-navy-900 transition-colors whitespace-nowrap disabled:opacity-50"
        >
          {pending ? 'Saving…' : 'Save'}
        </button>
      </div>
      {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
      {saved && (
        <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Ticket email updated.
        </p>
      )}
    </div>
  );
}
