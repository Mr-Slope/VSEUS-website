'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllEvents } from '@/lib/events';
import { Event } from '@/types/event';

export default function AdminDashboard() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    setEvents(getAllEvents());
  }, []);

  const totalRegistrations = events.reduce((sum, e) => sum + e.registeredCount, 0);

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-navy-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">VSEUS portal overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Events', value: events.length },
          { label: 'Total Registrations', value: totalRegistrations },
          { label: 'Paid Events', value: events.filter((e) => e.isPaid).length },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-navy-100 px-5 py-4">
            <p className="text-3xl font-black text-navy-700">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Events overview */}
      <div className="bg-white rounded-2xl border border-navy-100 overflow-hidden mb-6">
        <div className="flex items-center justify-between px-5 py-4 border-b border-navy-100">
          <h2 className="font-bold text-navy-900 text-sm">Events Overview</h2>
          <Link href="/admin/events/new" className="text-xs font-semibold text-navy-500 hover:text-navy-700">
            + New Event
          </Link>
        </div>
        <div className="divide-y divide-navy-100">
          {events.map((e) => {
            const pct = Math.round((e.registeredCount / e.capacity) * 100);
            return (
              <div key={e.id} className="px-5 py-3 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-navy-900 truncate">{e.title}</p>
                  <p className="text-xs text-gray-500">{e.date} · {e.category}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-navy-700">
                    {e.registeredCount}/{e.capacity}
                  </p>
                  <div className="w-20 h-1.5 bg-navy-100 rounded-full mt-1 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${pct >= 90 ? 'bg-red-500' : pct >= 60 ? 'bg-gold' : 'bg-navy-500'}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-3">
        <Link
          href="/admin/events/new"
          className="flex-1 bg-navy-700 text-white text-sm font-semibold text-center py-3 rounded-xl hover:bg-navy-900 transition-colors"
        >
          Create New Event
        </Link>
        <Link
          href="/admin/events"
          className="flex-1 bg-white border border-navy-100 text-navy-700 text-sm font-semibold text-center py-3 rounded-xl hover:bg-navy-100 transition-colors"
        >
          Manage Events
        </Link>
      </div>
    </div>
  );
}
