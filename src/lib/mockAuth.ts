import { User } from '@/types/user';
import { ADMIN_USER } from './mockData';

const USERS_KEY = 'vseus_users';
const SESSION_KEY = 'vseus_session';

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

export async function signUp(
  email: string,
  password: string,
  name: string,
  studentId: string
): Promise<User> {
  await new Promise((r) => setTimeout(r, 400));

  const users = getUsers();

  if (users.find((u) => u.email === email)) {
    throw new Error('An account with this email already exists.');
  }
  if (users.find((u) => u.studentId === studentId)) {
    throw new Error('This student ID is already registered.');
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

  if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
    const adminUser: User = {
      id: ADMIN_USER.id,
      email: ADMIN_USER.email,
      name: ADMIN_USER.name,
      studentId: ADMIN_USER.studentId,
      role: ADMIN_USER.role,
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

export function registerForEvent(userId: string, eventId: string): User {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);

  if (idx !== -1 && !users[idx].registeredEvents.includes(eventId)) {
    users[idx].registeredEvents = [...users[idx].registeredEvents, eventId];
    saveUsers(users);
    const { password: _pw, ...publicUser } = users[idx];
    localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
    return publicUser;
  }

  const session = getSession();
  if (!session) throw new Error('Not authenticated');

  if (!session.registeredEvents.includes(eventId)) {
    session.registeredEvents = [...session.registeredEvents, eventId];
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
  return session;
}
