'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllEvents, deleteAdminEvent } from '@/lib/events';
import { MOCK_EVENTS } from '@/lib/mockData';
import { Event } from '@/types/event';
import { Badge } from '@/components/ui/Badge';

const SEED_IDS = new Set(MOCK_EVENTS.map((e) => e.id));

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    setEvents(getAllEvents());
  }, []);

  function handleDelete(id: string) {
    if (confirm('Delete this event? This cannot be undone.')) {
      deleteAdminEvent(id);
      setEvents(getAllEvents());
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-navy-900">Manage Events</h1>
          <p className="text-gray-500 text-sm mt-1">{events.length} events total</p>
        </div>
        <Link
          href="/admin/events/new"
          className="flex items-center gap-1.5 bg-navy-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-navy-900 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Event
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-navy-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-100 text-left">
                <th className="px-5 py-3 font-semibold text-navy-700 text-xs uppercase tracking-wide">Event</th>
                <th className="px-5 py-3 font-semibold text-navy-700 text-xs uppercase tracking-wide">Date</th>
                <th className="px-5 py-3 font-semibold text-navy-700 text-xs uppercase tracking-wide">Category</th>
                <th className="px-5 py-3 font-semibold text-navy-700 text-xs uppercase tracking-wide">Registrations</th>
                <th className="px-5 py-3 font-semibold text-navy-700 text-xs uppercase tracking-wide">Type</th>
                <th className="px-5 py-3 font-semibold text-navy-700 text-xs uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {events.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-navy-900">{e.title}</p>
                    <p className="text-xs text-gray-500 truncate max-w-xs">{e.location}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-600 whitespace-nowrap">
                    {e.date}
                    <br />
                    <span className="text-xs text-gray-400">{e.time}</span>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant="category">{e.category}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <span className="font-semibold text-navy-700">{e.registeredCount}</span>
                    <span className="text-gray-400">/{e.capacity}</span>
                  </td>
                  <td className="px-5 py-3">
                    {e.isPaid ? (
                      <Badge variant="paid">${e.price}</Badge>
                    ) : (
                      <Badge variant="free">Free</Badge>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/events/${e.id}`}
                        className="text-xs text-navy-500 hover:text-navy-700 font-medium px-2 py-1 rounded hover:bg-navy-50 transition-colors"
                      >
                        Metrics
                      </Link>
                      {SEED_IDS.has(e.id) ? (
                        <span className="text-xs text-gray-300 font-medium px-2 py-1 cursor-not-allowed" title="Seed events cannot be deleted">
                          Delete
                        </span>
                      ) : (
                        <button
                          onClick={() => handleDelete(e.id)}
                          className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {events.length === 0 && (
            <div className="py-16 text-center text-gray-400 text-sm">
              No events yet.{' '}
              <Link href="/admin/events/new" className="text-navy-500 font-medium hover:text-navy-700">
                Create one →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
