import { Event } from '@/types/event';
import { MOCK_EVENTS } from './mockData';

const EVENTS_KEY = 'vseus_events';
// Tracks on-site registration deltas for seed events (MOCK_EVENTS),
// whose baseline registeredCount is hardcoded and cannot be mutated.
const SEED_COUNTS_KEY = 'vseus_seed_counts';

export function getAdminEvents(): Event[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveAdminEvent(event: Event): void {
  const events = getAdminEvents();
  const idx = events.findIndex((e) => e.id === event.id);
  if (idx !== -1) {
    events[idx] = event;
  } else {
    events.push(event);
  }
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

export function deleteAdminEvent(id: string): void {
  const events = getAdminEvents().filter((e) => e.id !== id);
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

function getSeedCounts(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(SEED_COUNTS_KEY) || '{}'); }
  catch { return {}; }
}

function saveSeedCounts(counts: Record<string, number>) {
  localStorage.setItem(SEED_COUNTS_KEY, JSON.stringify(counts));
}

export function getAllEvents(): Event[] {
  const seedCounts = getSeedCounts();
  const seedIds = new Set(MOCK_EVENTS.map((e) => e.id));
  return [
    ...MOCK_EVENTS.map((e) => ({
      ...e,
      registeredCount: e.registeredCount + (seedCounts[e.id] ?? 0),
    })),
    ...getAdminEvents().filter((e) => !seedIds.has(e.id)),
  ];
}

export function getEventById(id: string): Event | undefined {
  return getAllEvents().find((e) => e.id === id);
}

export function incrementRegisteredCount(eventId: string): void {
  const events = getAdminEvents();
  const idx = events.findIndex((e) => e.id === eventId);
  if (idx !== -1) {
    events[idx] = { ...events[idx], registeredCount: events[idx].registeredCount + 1 };
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    return;
  }
  // Seed event — track delta separately
  const counts = getSeedCounts();
  counts[eventId] = (counts[eventId] ?? 0) + 1;
  saveSeedCounts(counts);
}

export function decrementRegisteredCount(eventId: string): void {
  const events = getAdminEvents();
  const idx = events.findIndex((e) => e.id === eventId);
  if (idx !== -1) {
    events[idx] = { ...events[idx], registeredCount: Math.max(0, events[idx].registeredCount - 1) };
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    return;
  }
  // Seed event — track delta separately
  const counts = getSeedCounts();
  counts[eventId] = Math.max(0, (counts[eventId] ?? 0) - 1);
  saveSeedCounts(counts);
}
