'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getEventById } from '@/lib/events';
import { getRegistrationsByEvent } from '@/lib/mockAuth';
import { Event, Registration } from '@/types/event';

export default function EventMetricsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [event, setEvent] = useState<Event | null | undefined>(undefined);
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  useEffect(() => {
    const e = getEventById(id);
    setEvent(e ?? null);
    setRegistrations(getRegistrationsByEvent(id));
  }, [id]);

  if (event === undefined) {
    return <div className="p-8 text-sm text-gray-400">Loading...</div>;
  }

  if (event === null) {
    return (
      <div className="p-8">
        <p className="text-sm text-gray-500 mb-3">Event not found.</p>
        <Link href="/admin/events" className="text-sm text-navy-500 hover:text-navy-700 font-medium">
          Back to Events
        </Link>
      </div>
    );
  }

  const fillRate = Math.round((event.registeredCount / event.capacity) * 100);

  const revenue = event.isPaid && event.price
    ? event.price * registrations.length
    : null;

  const attendedCount = registrations.filter((r) => r.attended).length;
  const attendanceRate = registrations.length > 0
    ? Math.round((attendedCount / registrations.length) * 100)
    : 0;

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      {/* Back + Scan button */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-navy-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Events
        </Link>
        <Link
          href={`/admin/events/${id}/scan`}
          className="flex items-center gap-2 bg-navy-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-navy-900 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
          </svg>
          Scan Tickets
        </Link>
      </div>

      {/* Header */}
      <div className="flex gap-5 mb-6 items-start">
        {event.posterUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.posterUrl}
            alt="poster"
            className="w-28 h-28 rounded-xl object-cover flex-shrink-0 border border-navy-100"
          />
        )}
        <div>
          <span className="inline-block text-xs font-semibold bg-navy-100 text-navy-700 px-2.5 py-0.5 rounded-full mb-2">
            {event.category}
          </span>
          <h1 className="text-2xl font-black text-navy-900 leading-tight">{event.title}</h1>
          <p className="text-sm text-gray-500 mt-1">{event.date} · {event.time} · {event.location}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-navy-100 px-5 py-4">
          <p className="text-3xl font-black text-navy-700">
            {event.registeredCount}
            <span className="text-navy-300 text-xl">/{event.capacity}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">Registrations</p>
        </div>

        <div className="bg-white rounded-xl border border-navy-100 px-5 py-4">
          <p className="text-3xl font-black text-navy-700">{fillRate}%</p>
          <div className="w-full h-1.5 bg-navy-100 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${fillRate >= 90 ? 'bg-red-500' : fillRate >= 60 ? 'bg-gold' : 'bg-navy-500'}`}
              style={{ width: `${Math.min(fillRate, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Fill Rate</p>
        </div>

        <div className="bg-white rounded-xl border border-navy-100 px-5 py-4">
          {revenue !== null ? (
            <p className="text-3xl font-black text-navy-700">${revenue}</p>
          ) : (
            <p className="text-3xl font-black text-navy-700">Free</p>
          )}
          <p className="text-xs text-gray-500 mt-1">Projected Revenue</p>
        </div>

        <div className="bg-white rounded-xl border border-navy-100 px-5 py-4">
          <p className="text-3xl font-black text-green-600">{attendedCount}</p>
          {registrations.length > 0 && (
            <p className="text-xs text-gray-400 mt-0.5">{attendanceRate}% show rate</p>
          )}
          <p className="text-xs text-gray-500 mt-1">Attended</p>
        </div>
      </div>

      {/* Registrant table */}
      <div className="bg-white rounded-2xl border border-navy-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-navy-100">
          <h2 className="font-bold text-navy-900 text-sm">
            Registrants
            <span className="ml-2 text-gray-400 font-normal">({registrations.length})</span>
          </h2>
        </div>

        {registrations.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            No registrations yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy-50 text-left">
                  <th className="px-5 py-3 font-semibold text-navy-700 text-xs uppercase tracking-wide whitespace-nowrap">Name</th>
                  <th className="px-5 py-3 font-semibold text-navy-700 text-xs uppercase tracking-wide whitespace-nowrap">Email</th>
                  <th className="px-5 py-3 font-semibold text-navy-700 text-xs uppercase tracking-wide whitespace-nowrap">Student ID</th>
                  <th className="px-5 py-3 font-semibold text-navy-700 text-xs uppercase tracking-wide whitespace-nowrap">Registered At</th>
                  <th className="px-5 py-3 font-semibold text-navy-700 text-xs uppercase tracking-wide whitespace-nowrap">Attended</th>
                  {event.questions.map((q) => (
                    <th key={q.id} className="px-5 py-3 font-semibold text-navy-700 text-xs uppercase tracking-wide whitespace-nowrap max-w-[160px]">
                      {q.text.length > 30 ? q.text.slice(0, 30) + '…' : q.text}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-navy-900 font-medium whitespace-nowrap">{reg.userName}</td>
                    <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{reg.userEmail}</td>
                    <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{reg.userStudentId}</td>
                    <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(reg.registeredAt).toLocaleString('en-CA', { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      {reg.attended ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {reg.attendedAt
                            ? new Date(reg.attendedAt).toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' })
                            : 'Yes'}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                    {event.questions.map((q) => {
                      const ans = reg.answers.find((a) => a.questionId === q.id);
                      return (
                        <td key={q.id} className="px-5 py-3 text-gray-600 max-w-[200px]">
                          <span className="line-clamp-2">{ans?.answer ?? '—'}</span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
