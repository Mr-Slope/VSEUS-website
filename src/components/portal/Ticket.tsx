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
  const [walletToast, setWalletToast] = useState('');
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

  function showWalletToast(message: string) {
    setWalletToast(message);
    setTimeout(() => setWalletToast(''), 3000);
  }

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

      {/* Wallet buttons */}
      <div className="px-5 pb-5 space-y-2">
        <button
          onClick={() => showWalletToast('Apple Wallet integration coming soon.')}
          className="w-full flex items-center justify-center gap-2 bg-black text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-900 transition-colors"
        >
          {/* Apple logo */}
          <svg className="w-4 h-4" viewBox="0 0 814 1000" fill="currentColor">
            <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 405.9 0 300.5 0 204.7C0 57.8 92.5 0 183.1 0c49.9 0 91.5 32.6 121.5 32.6 28.6 0 74.9-35.1 131.9-35.1 21.3 0 108.2 1.9 166 99.9zm-116.6-125c-20.1 23.7-54.9 41.2-82.6 41.2-3.8 0-7.7-.5-11.5-1.2.3-27.7 19.1-57.8 38.4-78.5 21.8-23.7 57.5-41.6 87.5-42.1.3 4.8.7 9.5.7 14.4 0 24.8-5.8 50.8-32.5 66.2z"/>
          </svg>
          Add to Apple Wallet
        </button>
        <button
          onClick={() => showWalletToast('Google Wallet integration coming soon.')}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
        >
          {/* Google "G" */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Save to Google Wallet
        </button>

        {walletToast && (
          <p className="text-center text-xs text-gray-500 animate-pulse">{walletToast}</p>
        )}
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
