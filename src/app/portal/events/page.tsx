'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { MOCK_EVENTS } from '@/lib/mockData';
import { EventCard } from '@/components/portal/EventCard';
import { RegistrationModal } from '@/components/portal/RegistrationModal';
import { Event } from '@/types/event';

const CATEGORIES = ['All', 'Competition', 'Networking', 'Social', 'Workshop', 'Academic'];

export default function PortalEventsPage() {
  const { user, registerEvent } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? MOCK_EVENTS
    : MOCK_EVENTS.filter((e) => e.category === activeCategory);

  function handleRegister(event: Event) {
    setSelectedEvent(event);
  }

  function handleConfirm(eventId: string) {
    registerEvent(eventId);
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-navy-900">Events</h1>
        <p className="text-gray-500 text-sm mt-1">Register for upcoming VSEUS events.</p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'bg-navy-700 text-white'
                : 'bg-white border border-navy-100 text-navy-700 hover:border-navy-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Event grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            isRegistered={user?.registeredEvents.includes(event.id) ?? false}
            onRegister={handleRegister}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-sm">No events in this category right now.</p>
        </div>
      )}

      <RegistrationModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
