'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getSupabase } from '@/lib/economicreview/supabase';
import { PUBLICATION } from '@/lib/economicreview/content';
import type { ToastMessage } from './Toast';

export type SubscribeMode = 'subscribe' | 'unsubscribe';

interface SubscribeDialogProps {
  /** The open dialog, or null when closed. */
  mode: SubscribeMode | null;
  onClose: () => void;
  /** Called when the list actually changed, or was already in the asked-for state. */
  onComplete: (toast: ToastMessage) => void;
}

/** Postgres unique-violation. On `subscribers.email` it means "already on the list". */
const UNIQUE_VIOLATION = '23505';

/** One row of the get_subscription_by_email RPC. */
interface SubscriptionRow {
  email: string;
  subscribed: boolean;
}

type Phase = { kind: 'form' } | { kind: 'working' } | { kind: 'error'; message: string };

/**
 * Joining and leaving the Review's mailing list, in a native modal dialog.
 *
 * `showModal()` is doing real work here: it traps focus, handles Escape, and
 * restores focus to whatever opened it when it closes. That covers the parts
 * of a modal that are easy to get wrong, without pulling in a dialog library
 * for one form.
 *
 * Everything happens against the database and nothing else. The site sends no
 * mail of its own, so the dialog never claims that anything was sent: it
 * reports only what it actually did to the list.
 *
 * Outcomes are split by what the reader can do about them. A change that
 * succeeded closes the dialog and confirms with a toast, since there is
 * nothing left to do here. Anything still fixable, such as an address that is
 * not on the list, stays in the dialog next to the field that needs editing.
 *
 * Reads of `subscribers` are blocked by row level security so the list cannot
 * be harvested, which is why looking an address up goes through the
 * `get_subscription_by_email` security-definer function rather than a select.
 * Switching an address on or off goes through `set_subscription_status` for
 * the same reason: Postgres applies the read policy to an update's where
 * clause, so a plain `.update().eq('email', ...)` matches no rows and still
 * reports no error. The function returns false when no row matched, so a miss
 * surfaces as a failure instead of a false success.
 */
export function SubscribeDialog({ mode, onClose, onComplete }: SubscribeDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const [email, setEmail] = useState('');
  const [phase, setPhase] = useState<Phase>({ kind: 'form' });

  const subscribing = mode === 'subscribe';
  const title = subscribing
    ? `Subscribe to the ${PUBLICATION.name}`
    : `Unsubscribe from the ${PUBLICATION.name}`;

  // Drive the real dialog element from the `mode` prop.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (mode && !el.open) {
      setEmail('');
      setPhase({ kind: 'form' });
      el.showModal();
    } else if (!mode && el.open) {
      el.close();
    }
  }, [mode]);

  const failed = (message: string) => setPhase({ kind: 'error', message });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    /*
      The form carries noValidate so a bad address is reported in the page's
      own voice rather than by a browser tooltip. The validity flags still come
      from the email input, so there is no hand-rolled address grammar here.
    */
    const field = event.currentTarget.elements.namedItem('email') as HTMLInputElement | null;
    const address = email.trim();
    if (field && !field.validity.valid) {
      return failed(
        field.validity.valueMissing
          ? 'Enter your email address.'
          : 'That does not look like an email address. Check it and try again.',
      );
    }
    if (!address) return failed('Enter your email address.');

    const supabase = getSupabase();
    if (!supabase) {
      return failed(
        `Subscriptions are unavailable right now. Please email ${PUBLICATION.email} and we will sort it out by hand.`,
      );
    }

    setPhase({ kind: 'working' });

    try {
      if (subscribing) {
        let alreadyListed = false;

        const { error: insertError } = await supabase
          .from('subscribers')
          .insert([{ email: address, subscribed: true }]);

        if (insertError?.code === UNIQUE_VIOLATION) {
          /*
            The address is already a row, which covers both someone subscribing
            twice and someone who unsubscribed earlier coming back. Either way
            the wanted end state is the same, so switch it back on rather than
            treating a repeat as a failure.
          */
          alreadyListed = true;
          const { data: found, error: updateError } = await supabase.rpc('set_subscription_status', {
            user_email: address,
            is_subscribed: true,
          });
          if (updateError) throw updateError;
          if (!found) throw new Error('set_subscription_status matched no row');
        } else if (insertError) {
          throw insertError;
        }

        onComplete({
          tone: 'success',
          title: 'You are subscribed',
          body: alreadyListed
            ? `That address was already on our list and is set to receive the ${PUBLICATION.name}.`
            : `You are on the list for the ${PUBLICATION.name}. New issues go out every Friday during term.`,
        });
      } else {
        const { data, error: lookupError } = await supabase.rpc('get_subscription_by_email', {
          user_email: address,
        });
        if (lookupError) throw lookupError;

        const rows = (data ?? []) as SubscriptionRow[];
        if (rows.length === 0) {
          // Most likely a typo, so keep them here with the field to correct.
          return failed('That address is not on our subscriber list. Check the spelling and try again.');
        }

        if (!rows[0].subscribed) {
          // Nothing to change, and what they wanted is already true.
          onComplete({
            tone: 'info',
            title: 'Already unsubscribed',
            body: 'That address is not on the list, so nothing needed changing.',
          });
        } else {
          const { data: found, error: updateError } = await supabase.rpc('set_subscription_status', {
            user_email: address,
            is_subscribed: false,
          });
          if (updateError) throw updateError;
          if (!found) throw new Error('set_subscription_status matched no row');

          onComplete({
            tone: 'success',
            title: 'You are unsubscribed',
            body: `That address has been taken off the ${PUBLICATION.name} list.`,
          });
        }
      }
    } catch {
      failed(
        `Something went wrong, so nothing was changed. Check your connection and try again, or email ${PUBLICATION.email}.`,
      );
    }
  }

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        // showModal centres the dialog, so a click landing on the element
        // itself rather than its contents is a click on the backdrop.
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby="economicreview-subscribe-title"
      className={[
        'm-auto w-[calc(100%-2rem)] max-w-md max-h-[90dvh] overflow-y-auto',
        'rounded-2xl border border-ice-400 bg-offwhite p-0 text-midnight',
        'shadow-2xl shadow-midnight/30',
        'backdrop:bg-midnight/70 backdrop:backdrop-blur-sm',
      ].join(' ')}
    >
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4 mb-1">
          <h2
            id="economicreview-subscribe-title"
            className="text-xl font-bold text-midnight leading-snug"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mt-1 -mr-1 p-1.5 rounded-lg text-muted hover:text-midnight hover:bg-ice transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <p className="text-sm text-muted leading-relaxed mb-5">
            {subscribing
              ? 'A short digest of markets, economics, and policy, published every Friday during term.'
              : 'Enter the address you subscribed with and we will take it off the list.'}
          </p>

          <Input
            label="Email address"
            id="economicreview-subscribe-email"
            type="email"
            name="email"
            // Without this, showModal() lands focus on the close button and
            // the reader has to tab into the one field the dialog exists for.
            autoFocus
            autoComplete="email"
            placeholder="you@student.ubc.ca"
            value={email}
            required
            onChange={(e) => {
              setEmail(e.target.value);
              // Clear a stale complaint as soon as they start fixing it.
              if (phase.kind === 'error') setPhase({ kind: 'form' });
            }}
            error={phase.kind === 'error' ? phase.message : undefined}
          />

          {subscribing && (
            <p className="text-xs text-muted/80 mt-3 leading-relaxed">
              By subscribing you agree to our{' '}
              <Link
                href="/economicreview/terms"
                className="text-midnight underline decoration-accent decoration-2 underline-offset-2"
                onClick={onClose}
              >
                terms and conditions
              </Link>
              .
            </p>
          )}

          <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
            <Button type="button" variant="ghost" onClick={onClose} disabled={phase.kind === 'working'}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" loading={phase.kind === 'working'}>
              {subscribing ? 'Subscribe' : 'Unsubscribe'}
            </Button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
