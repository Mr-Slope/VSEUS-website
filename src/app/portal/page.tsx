'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { DashboardStats } from '@/components/portal/DashboardStats';
import { MOCK_EVENTS } from '@/lib/mockData';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-CA', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export default function PortalDashboard() {
  const { user } = useAuth();

  const registeredEvents = MOCK_EVENTS.filter((e) =>
    user?.registeredEvents.includes(e.id)
  );

  const upcomingEvents = MOCK_EVENTS.filter(
    (e) => !user?.registeredEvents.includes(e.id)
  ).slice(0, 3);

  const stats = [
    {
      label: 'Events Registered',
      value: user?.registeredEvents.length ?? 0,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'Upcoming Events',
      value: MOCK_EVENTS.length,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      label: 'Member Since',
      value: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-CA', { month: 'short', year: 'numeric' })
        : 'N/A',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-navy-900">
          Welcome back, {user?.name.split(' ')[0]}
        </h1>
        <p className="text-gray-500 text-sm mt-1">Here&apos;s what&apos;s happening with VSEUS.</p>
      </div>

      <DashboardStats stats={stats} />

      {/* Registered events */}
      {registeredEvents.length > 0 && (
        <section className="mt-8">
          <h2 className="text-base font-bold text-navy-900 mb-3">Your Registered Events</h2>
          <div className="space-y-2">
            {registeredEvents.map((e) => (
              <div key={e.id} className="bg-white border border-green-100 rounded-xl px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-navy-900">{e.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{formatDate(e.date)} · {e.time} · {e.location}</p>
                </div>
                <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full flex-shrink-0">
                  Registered
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Events to explore */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-navy-900">Upcoming Events</h2>
          <Link href="/portal/events" className="text-sm text-navy-500 font-medium hover:text-navy-700">
            View all →
          </Link>
        </div>
        <div className="space-y-2">
          {upcomingEvents.map((e) => (
            <div key={e.id} className="bg-white border border-navy-100 rounded-xl px-4 py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-navy-900">{e.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{formatDate(e.date)} · {e.location}</p>
              </div>
              <Link
                href="/portal/events"
                className="text-xs font-medium text-navy-500 hover:text-navy-700 bg-navy-100 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
              >
                Register
              </Link>
            </div>
          ))}
          {upcomingEvents.length === 0 && (
            <p className="text-sm text-gray-400 py-4 text-center">
              You&apos;re registered for all upcoming events!
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
