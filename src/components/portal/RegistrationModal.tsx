'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Event } from '@/types/event';

interface RegistrationModalProps {
  event: Event | null;
  onClose: () => void;
  onConfirm: (eventId: string) => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function RegistrationModal({ event, onClose, onConfirm }: RegistrationModalProps) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleConfirm() {
    if (!event) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    onConfirm(event.id);
    setDone(true);
    setLoading(false);
  }

  function handleClose() {
    setDone(false);
    onClose();
  }

  const spotsLeft = event?.capacity ? event.capacity - event.registeredCount : null;

  return (
    <Modal open={!!event} onClose={handleClose} title={done ? 'Registered!' : 'Confirm Registration'}>
      {done ? (
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-bold text-navy-900 mb-1">You&apos;re registered!</h3>
          <p className="text-sm text-gray-500 mb-5">
            See you at <span className="font-medium text-navy-700">{event?.title}</span>.
            Check your email for confirmation.
          </p>
          <Button variant="primary" fullWidth onClick={handleClose}>
            Done
          </Button>
        </div>
      ) : (
        event && (
          <div>
            <div className="bg-navy-100 rounded-xl p-4 mb-4 space-y-2">
              <h3 className="font-bold text-navy-900 text-sm">{event.title}</h3>
              <div className="text-xs text-gray-500 space-y-1">
                <p>{formatDate(event.date)} · {event.time}</p>
                <p>{event.location}</p>
                {spotsLeft !== null && (
                  <p className={spotsLeft <= 5 ? 'text-red-600 font-medium' : ''}>
                    {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} remaining
                  </p>
                )}
                {event.isPaid && (
                  <p className="font-semibold text-yellow-700">Cost: ${event.price}</p>
                )}
              </div>
            </div>
            {event.isPaid && (
              <p className="text-xs text-gray-500 mb-4 bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                Payment will be collected at the door or via e-transfer to events@vseus.ca before the event.
              </p>
            )}
            <p className="text-sm text-gray-600 mb-5">
              By registering, you confirm you plan to attend. Please cancel at least 24 hours in advance if your plans change.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" fullWidth onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="primary" fullWidth loading={loading} onClick={handleConfirm}>
                Confirm Registration
              </Button>
            </div>
          </div>
        )
      )}
    </Modal>
  );
}
