'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
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

  const registeredEvents = MOCK_EVENTS.filter((e) =>
    user?.registeredEvents.includes(e.id)
  );

  if (!user) return null;

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
