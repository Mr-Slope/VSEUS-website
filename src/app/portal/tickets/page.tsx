import React from 'react';
import { redirect } from 'next/navigation';
import { TicketsView } from '@/components/portal/TicketsView';
import { getSessionUser } from '@/lib/session';
import { getMyTickets } from '@/db/queries';

export default async function MyTicketsPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) redirect('/auth/login');

  const tickets = await getMyTickets(sessionUser.id);

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-navy-900">My Tickets</h1>
        <p className="text-gray-500 text-sm mt-1">Your QR code tickets for registered events.</p>
      </div>
      <TicketsView tickets={tickets} />
    </div>
  );
}
