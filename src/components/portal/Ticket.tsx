'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Registration, Event } from '@/types/event';

interface TicketProps {
  registration: Registration;
  event: Event;
  onUnregister?: () => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function Ticket({ registration, event, onUnregister }: TicketProps) {
  const qrRef = useRef<HTMLImageElement>(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    let cancelled = false;
    import('qrcode').then((QRCode) => {
      QRCode.toDataURL(registration.id, {
        width: 180,
        margin: 2,
        color: { dark: '#0D1B2A', light: '#FFFFFF' },
      }).then((url) => {
        if (!cancelled && qrRef.current) {
          qrRef.current.src = url;
        }
      });
    });
    return () => { cancelled = true; };
  }, [registration.id]);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-navy-100 shadow-sm w-full max-w-sm mx-auto">
      {/* Header strip */}
      <div className="bg-navy-900 px-5 py-4 flex items-center justify-between">
        <span className="text-white font-black text-lg tracking-tight">VSEUS</span>
        <span className="text-xs font-semibold text-navy-900 bg-gold px-2.5 py-0.5 rounded-full">
          {event.category}
        </span>
      </div>

      {/* Event info */}
      <div className="px-5 pt-5 pb-3 border-b border-dashed border-navy-200">
        <h3 className="font-black text-navy-900 text-base leading-snug mb-2">{event.title}</h3>
        <div className="space-y-1 text-xs text-gray-500">
          <p>{formatDate(event.date)} · {event.time}</p>
          <p>{event.location}</p>
        </div>
      </div>

      {/* Attendee info */}
      <div className="px-5 py-3 border-b border-dashed border-navy-200">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-gray-400 uppercase tracking-widest font-semibold text-[10px] mb-0.5">Name</p>
            <p className="text-navy-900 font-semibold">{registration.userName}</p>
          </div>
          <div>
            <p className="text-gray-400 uppercase tracking-widest font-semibold text-[10px] mb-0.5">Student ID</p>
            <p className="text-navy-900 font-semibold">{registration.userStudentId}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-400 uppercase tracking-widest font-semibold text-[10px] mb-0.5">Ticket Email</p>
            <p className="text-navy-900 font-semibold truncate">{registration.ticketEmail}</p>
          </div>
        </div>
      </div>

      {/* QR code */}
      <div className="flex flex-col items-center py-5 px-5 gap-2">
        <img
          ref={qrRef}
          alt="Ticket QR code"
          width={160}
          height={160}
          className="rounded-lg"
        />
        <p className="text-[10px] text-gray-400 font-mono truncate max-w-full">{registration.id}</p>
      </div>

      {/* Unregister */}
      {onUnregister && (
        <div className="px-5 pb-5">
          {confirming ? (
            <div className="border border-red-200 rounded-xl p-4 bg-red-50">
              <p className="text-sm font-semibold text-red-800 mb-1 text-center">
                Leaving so soon?
              </p>
              <p className="text-xs text-red-600 text-center mb-4">
                Are you sure you won&apos;t be joining us for <span className="font-semibold">{event.title}</span>? It&apos;s shaping up to be a great one.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirming(false)}
                  className="flex-1 border border-gray-300 text-gray-600 text-sm font-semibold py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Actually, I&apos;ll stay
                </button>
                <button
                  onClick={onUnregister}
                  className="flex-1 bg-red-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Yes, unregister me
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="w-full text-xs text-red-400/70 border border-red-200/60 py-2.5 rounded-xl font-medium tracking-wide hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200"
            >
              Change of plans? Unregister.
            </button>
          )}
        </div>
      )}
    </div>
  );
}
