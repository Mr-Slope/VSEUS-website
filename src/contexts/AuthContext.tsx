'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types/user';
import { getSession, signIn, signOut, signUp, registerForEvent } from '@/lib/mockAuth';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string, studentId: string) => Promise<void>;
  registerEvent: (eventId: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getSession());
    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const u = await signIn(email, password);
    setUser(u);
  }

  function logout() {
    signOut();
    setUser(null);
  }

  async function register(email: string, password: string, name: string, studentId: string) {
    const u = await signUp(email, password, name, studentId);
    setUser(u);
  }

  function registerEvent(eventId: string) {
    if (!user) return;
    const updated = registerForEvent(user.id, eventId);
    setUser(updated);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, registerEvent }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider');
  return ctx;
}
