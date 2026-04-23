'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAuthContext } from '@/contexts/AuthContext';
import { MOCK_EVENTS } from '@/lib/mockData';
import { Badge } from '@/components/ui/Badge';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-CA', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { saveTicketEmail } = useAuthContext();

  const [ticketEmailInput, setTicketEmailInput] = useState('');
  const [ticketEmailError, setTicketEmailError] = useState('');
  const [ticketEmailSaved, setTicketEmailSaved] = useState(false);

  const registeredEvents = MOCK_EVENTS.filter((e) =>
    user?.registeredEvents.includes(e.id)
  );

  if (!user) return null;

  function handleSaveTicketEmail() {
    const val = ticketEmailInput.trim();
    if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setTicketEmailError('Please enter a valid email address.');
      return;
    }
    setTicketEmailError('');
    saveTicketEmail(val);
    setTicketEmailInput('');
    setTicketEmailSaved(true);
    setTimeout(() => setTicketEmailSaved(false), 3000);
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <h1 className="text-2xl font-black text-navy-900 mb-6">My Profile</h1>

      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-navy-100 p-6 mb-6">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-full bg-navy-700 flex items-center justify-center text-white text-xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-navy-900">{user.name}</h2>
              {user.role === 'admin' && <Badge variant="admin">Admin</Badge>}
            </div>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Student ID', value: user.studentId },
            { label: 'Email', value: user.email },
            { label: 'Role', value: user.role.charAt(0).toUpperCase() + user.role.slice(1) },
            {
              label: 'Member Since',
              value: new Date(user.createdAt).toLocaleDateString('en-CA', {
                month: 'long',
                year: 'numeric',
              }),
            },
          ].map((item) => (
            <div key={item.label} className="bg-navy-100 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
              <p className="text-sm font-semibold text-navy-900">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ticket email */}
      <div className="bg-white rounded-2xl border border-navy-100 p-6 mb-6">
        <h2 className="text-base font-bold text-navy-900 mb-1">Ticket Delivery Email</h2>
        <p className="text-xs text-gray-500 mb-4">
          Event tickets will be sent to this address. Leave blank to use your account email.
        </p>
        {user.ticketEmail && (
          <div className="flex items-center gap-2 mb-3 text-sm text-navy-700 bg-navy-50 border border-navy-100 rounded-lg px-3 py-2">
            <svg className="w-3.5 h-3.5 text-navy-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <span className="font-medium">{user.ticketEmail}</span>
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="email"
            value={ticketEmailInput}
            onChange={(e) => { setTicketEmailInput(e.target.value); setTicketEmailError(''); setTicketEmailSaved(false); }}
            placeholder={user.ticketEmail ? 'Enter new ticket email' : 'Enter ticket email'}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-navy-900 placeholder:text-gray-400 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100 transition-all"
          />
          <button
            onClick={handleSaveTicketEmail}
            className="px-4 py-2 bg-navy-700 text-white text-sm font-semibold rounded-lg hover:bg-navy-900 transition-colors whitespace-nowrap"
          >
            Save
          </button>
        </div>
        {ticketEmailError && <p className="text-xs text-red-600 mt-1.5">{ticketEmailError}</p>}
        {ticketEmailSaved && (
          <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Ticket email updated.
          </p>
        )}
      </div>

      {/* Registered events */}
      <div>
        <h2 className="text-base font-bold text-navy-900 mb-3">
          Registered Events ({registeredEvents.length})
        </h2>
        {registeredEvents.length === 0 ? (
          <div className="bg-white border border-navy-100 rounded-2xl p-8 text-center text-gray-400">
            <p className="text-sm">You haven&apos;t registered for any events yet.</p>
            <a href="/portal/events" className="text-navy-500 text-sm font-medium hover:text-navy-700 mt-2 inline-block">
              Browse events →
            </a>
          </div>
        ) : (
          <div className="space-y-2">
            {registeredEvents.map((e) => (
              <div key={e.id} className="bg-white border border-navy-100 rounded-xl px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm text-navy-900">{e.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{formatDate(e.date)} · {e.time}</p>
                    <p className="text-xs text-gray-400">{e.location}</p>
                  </div>
                  <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full flex-shrink-0">
                    Confirmed
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
