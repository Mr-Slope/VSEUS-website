import React from 'react';
import { Event } from '@/types/event';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface EventCardProps {
  event: Event;
  isRegistered: boolean;
  onRegister: (event: Event) => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-CA', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function EventCard({ event, isRegistered, onRegister }: EventCardProps) {
  const spotsLeft = event.capacity - event.registeredCount;
  const isFull = spotsLeft <= 0;

  return (
    <div className="bg-white rounded-2xl border border-navy-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      {event.posterUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.posterUrl}
          alt={`${event.title} poster`}
          className="w-full aspect-video object-cover"
        />
      ) : (
        <div className="h-1.5 bg-navy-700" />
      )}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="category">{event.category}</Badge>
          <div className="flex gap-1.5 flex-shrink-0">
            {event.isPaid ? (
              <Badge variant="paid">${event.price}</Badge>
            ) : (
              <Badge variant="free">Free</Badge>
            )}
            {isRegistered && <Badge variant="registered">Registered</Badge>}
            {isFull && !isRegistered && <Badge variant="full">Full</Badge>}
          </div>
        </div>

        <h3 className="font-bold text-navy-900 mb-1 leading-snug">{event.title}</h3>
        <p className="text-xs text-gray-500 mb-4 flex-1 leading-relaxed line-clamp-3">{event.description}</p>

        <div className="space-y-1.5 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-navy-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(event.date)} · {event.time}
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-navy-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {event.location}
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-navy-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            {isFull ? (
              <span className="text-red-600 font-medium">Full</span>
            ) : (
              <span className={spotsLeft <= 5 ? 'text-orange-600 font-medium' : ''}>
                {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left
              </span>
            )}
          </div>
        </div>

        {isRegistered ? (
          <Button variant="secondary" fullWidth disabled>
            Registered
          </Button>
        ) : isFull ? (
          <Button variant="ghost" fullWidth disabled>
            Event Full
          </Button>
        ) : (
          <Button variant="primary" fullWidth onClick={() => onRegister(event)}>
            Register
          </Button>
        )}
      </div>
    </div>
  );
}
