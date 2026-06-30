import React from 'react';
import { redirect } from 'next/navigation';
import { EventsBrowser } from '@/components/portal/EventsBrowser';
import { getSessionUser } from '@/lib/session';
import { getMyRegisteredEventIds, listEvents } from '@/db/queries';

export default async function PortalEventsPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) redirect('/auth/login');

  const [events, registeredEventIds] = await Promise.all([
    listEvents(),
    getMyRegisteredEventIds(sessionUser.id),
  ]);

  return <EventsBrowser events={events} registeredEventIds={registeredEventIds} />;
}
