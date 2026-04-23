import { User } from '@/types/user';
import { Registration, QuestionAnswer } from '@/types/event';
import { incrementRegisteredCount, decrementRegisteredCount } from './events';

const USERS_KEY = 'vseus_users';
const SESSION_KEY = 'vseus_session';
const REGISTRATIONS_KEY = 'vseus_registrations';

// Approved VSEUS member student IDs.
// Replace with real IDs before going live — Firebase will hold the authoritative list.
export const APPROVED_STUDENT_IDS = new Set([
  '218945632',
  '219034571',
  '217856123',
  '220112045',
  '216789034',
]);

interface AdminCredential {
  id: string;
  email: string;
  password: string;
  name: string;
  studentId: string;
  role: 'admin';
}

const ADMIN_USERS: AdminCredential[] = [
  {
    id: 'admin-001',
    email: 'admin@vseus.ca',
    password: 'admin123',
    name: 'VSEUS Admin',
    studentId: '000000000',
    role: 'admin',
  },
  {
    id: 'admin-002',
    email: 'president@vseus.ca',
    password: 'admin123',
    name: 'Yash Dhaundiyal',
    studentId: '000000001',
    role: 'admin',
  },
];

function getUsers(): (User & { password: string })[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveUsers(users: (User & { password: string })[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getRegistrations(): Registration[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(REGISTRATIONS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function getRegistrationsByEvent(eventId: string): Registration[] {
  return getRegistrations().filter((r) => r.eventId === eventId);
}

export function getRegistrationById(id: string): Registration | undefined {
  return getRegistrations().find((r) => r.id === id);
}

export function markAttended(registrationId: string): void {
  const regs = getRegistrations();
  const updated = regs.map((r) =>
    r.id === registrationId
      ? { ...r, attended: true, attendedAt: new Date().toISOString() }
      : r
  );
  localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(updated));
}

function saveRegistration(reg: Registration): void {
  const regs = getRegistrations();
  localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify([...regs, reg]));
}

export async function signUp(
  email: string,
  password: string,
  name: string,
  studentId: string
): Promise<User> {
  await new Promise((r) => setTimeout(r, 400));

  if (!APPROVED_STUDENT_IDS.has(studentId)) {
    throw new Error(
      'Your student ID is not in our membership list. Please contact vseus@ubc.ca if you believe this is an error.'
    );
  }

  const users = getUsers();

  if (users.find((u) => u.email === email)) {
    throw new Error('An account with this email already exists.');
  }
  if (users.find((u) => u.studentId === studentId)) {
    throw new Error('This student ID is already linked to an account.');
  }

  const user: User & { password: string } = {
    id: `user-${Date.now()}`,
    email,
    password,
    name,
    studentId,
    role: 'member',
    registeredEvents: [],
    createdAt: new Date().toISOString(),
  };

  saveUsers([...users, user]);

  const { password: _pw, ...publicUser } = user;
  localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
  return publicUser;
}

export async function signIn(email: string, password: string): Promise<User> {
  await new Promise((r) => setTimeout(r, 400));

  const adminMatch = ADMIN_USERS.find(
    (a) => a.email === email && a.password === password
  );
  if (adminMatch) {
    const adminUser: User = {
      id: adminMatch.id,
      email: adminMatch.email,
      name: adminMatch.name,
      studentId: adminMatch.studentId,
      role: adminMatch.role,
      registeredEvents: [],
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(adminUser));
    return adminUser;
  }

  const users = getUsers();
  const match = users.find((u) => u.email === email && u.password === password);

  if (!match) {
    throw new Error('Incorrect email or password.');
  }

  const { password: _pw, ...publicUser } = match;
  localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
  return publicUser;
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY);
}

export function unregisterFromEvent(userId: string, eventId: string): User {
  // Remove registration record
  const regs = getRegistrations().filter(
    (r) => !(r.userId === userId && r.eventId === eventId)
  );
  localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(regs));

  // Remove eventId from user's registeredEvents
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx !== -1) {
    users[idx].registeredEvents = users[idx].registeredEvents.filter((id) => id !== eventId);
    saveUsers(users);
    const { password: _pw, ...publicUser } = users[idx];
    localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
    decrementRegisteredCount(eventId);
    return publicUser;
  }

  const session = getSession();
  if (!session) throw new Error('Not authenticated');
  session.registeredEvents = session.registeredEvents.filter((id) => id !== eventId);
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  decrementRegisteredCount(eventId);
  return session;
}

export function updateTicketEmail(userId: string, ticketEmail: string): User {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx !== -1) {
    users[idx].ticketEmail = ticketEmail;
    saveUsers(users);
    const { password: _pw, ...publicUser } = users[idx];
    localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
    return publicUser;
  }
  // Admin users aren't in the users store — update session only
  const session = getSession();
  if (!session) throw new Error('Not authenticated');
  session.ticketEmail = ticketEmail;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function registerForEvent(
  userId: string,
  eventId: string,
  answers: QuestionAnswer[] = [],
  ticketEmail?: string
): User {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);

  let publicUser: User;

  if (idx !== -1 && !users[idx].registeredEvents.includes(eventId)) {
    users[idx].registeredEvents = [...users[idx].registeredEvents, eventId];
    saveUsers(users);
    const { password: _pw, ...pu } = users[idx];
    publicUser = pu;
    localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
  } else {
    const session = getSession();
    if (!session) throw new Error('Not authenticated');
    if (!session.registeredEvents.includes(eventId)) {
      session.registeredEvents = [...session.registeredEvents, eventId];
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
    publicUser = session;
  }

  // Persist a full registration record
  const reg: Registration = {
    id: `reg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    userId,
    eventId,
    userName: publicUser.name,
    userEmail: publicUser.email,
    userStudentId: publicUser.studentId,
    ticketEmail: ticketEmail ?? publicUser.email,
    registeredAt: new Date().toISOString(),
    answers,
    attended: false,
    attendedAt: null,
  };
  saveRegistration(reg);
  incrementRegisteredCount(eventId);

  return publicUser;
}
