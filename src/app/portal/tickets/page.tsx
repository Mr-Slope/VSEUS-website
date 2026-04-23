'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { getRegistrations } from '@/lib/mockAuth';
import { getEventById } from '@/lib/events';
import { Ticket } from '@/components/portal/Ticket';
import { Registration, Event } from '@/types/event';

interface TicketEntry {
  registration: Registration;
  event: Event;
}

export default function MyTicketsPage() {
  const { user, unregisterEvent } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<TicketEntry[]>([]);

  function loadTickets() {
    if (!user) return;
    const regs = getRegistrations().filter((r) => r.userId === user.id);
    const entries: TicketEntry[] = [];
    for (const reg of regs) {
      const event = getEventById(reg.eventId);
      if (event) entries.push({ registration: reg, event });
    }
    setTickets(entries);
  }

  useEffect(() => {
    loadTickets();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function handleUnregister(eventId: string) {
    unregisterEvent(eventId);
    loadTickets();
    router.refresh();
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-navy-900">My Tickets</h1>
        <p className="text-gray-500 text-sm mt-1">Your QR code tickets for registered events.</p>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-white border border-navy-100 rounded-2xl py-16 text-center">
          <svg className="w-10 h-10 text-navy-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a3 3 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
          </svg>
          <p className="text-sm text-gray-400 font-medium">No tickets yet</p>
          <p className="text-xs text-gray-400 mt-1">Register for an event to get your ticket here.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {tickets.map(({ registration, event }) => (
            <div key={registration.id}>
              {registration.attended && (
                <div className="flex items-center gap-1.5 mb-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs font-semibold text-green-700">
                    Attended
                    {registration.attendedAt && (
                      <span className="font-normal text-green-600 ml-1">
                        · {new Date(registration.attendedAt).toLocaleString('en-CA', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    )}
                  </span>
                </div>
              )}
              <Ticket
                registration={registration}
                event={event}
                onUnregister={() => handleUnregister(registration.eventId)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
