'use client';

import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { SubscribeDialog, type SubscribeMode } from './SubscribeDialog';
import { Toast, type ToastMessage } from './Toast';

/**
 * The masthead's mailing-list controls.
 *
 * Subscribing is the primary action and gets the accent fill. Unsubscribing is
 * a quiet text link: it has to be easy to find, without competing with the
 * thing most visitors came for.
 *
 * This owns the toast rather than the dialog, because the dialog is gone by
 * the time the confirmation appears.
 */
export function SubscribePanel() {
  const [mode, setMode] = useState<SubscribeMode | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const dismissToast = useCallback(() => setToast(null), []);

  const handleComplete = useCallback((message: ToastMessage) => {
    setMode(null);
    setToast(message);
  }, []);

  return (
    <div className="flex flex-col items-start md:items-end gap-2 flex-shrink-0">
      <Button variant="accent" size="lg" onClick={() => setMode('subscribe')}>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
        Subscribe
      </Button>
      <button
        type="button"
        onClick={() => setMode('unsubscribe')}
        className="text-xs text-offwhite/60 hover:text-offwhite underline underline-offset-2 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-midnight"
      >
        Unsubscribe
      </button>

      <SubscribeDialog mode={mode} onClose={() => setMode(null)} onComplete={handleComplete} />
      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  );
}
