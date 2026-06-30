import React from 'react';
import Link from 'next/link';
import { listEvents } from '@/db/queries';

// Reads live data from the DB on each request.
export const dynamic = 'force-dynamic';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-CA', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function EventsPage() {
  const events = await listEvents();

  return (
    <div className="min-h-screen">
      <section className="bg-navy-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-2">What&apos;s On</p>
          <h1 className="text-4xl font-black text-white">Upcoming Events</h1>
          <p className="text-white/70 mt-2 text-sm">Sign in to register for events.</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const spotsLeft = event.capacity - event.registeredCount;
              const isFull = spotsLeft <= 0;

              return (
                <div key={event.id} className="bg-white border border-navy-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                  {event.posterUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={event.posterUrl}
                      alt={`${event.title} poster`}
                      className="w-full aspect-video object-cover"
                    />
                  ) : (
                    <div className="h-2 bg-navy-700" />
                  )}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="text-xs font-medium bg-navy-100 text-navy-700 px-2.5 py-0.5 rounded-full">
                        {event.category}
                      </span>
                      {event.isPaid ? (
                        <span className="text-xs font-semibold text-yellow-700 bg-yellow-50 border border-yellow-200 px-2.5 py-0.5 rounded-full">
                          ${event.price}
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full">
                          Free
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-navy-900 mb-1 leading-snug">{event.title}</h3>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{event.description}</p>

                    <div className="space-y-1.5 text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 flex-shrink-0 text-navy-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(event.date)} · {event.time}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 flex-shrink-0 text-navy-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        {event.location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 flex-shrink-0 text-navy-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        </svg>
                        {isFull ? (
                          <span className="text-red-600 font-medium">Full</span>
                        ) : (
                          <span>{spotsLeft} spots left</span>
                        )}
                      </div>
                    </div>

                    <Link
                      href="/auth/login"
                      className="block w-full text-center bg-navy-700 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-navy-900 transition-colors"
                    >
                      Sign in to Register
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
