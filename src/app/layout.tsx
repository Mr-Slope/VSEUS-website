import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/contexts/AuthContext';
import { TransitionProvider } from '@/contexts/TransitionContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'VSEUS: Vancouver School of Economics Undergraduate Society',
  description:
    'Empowering economics students at the University of British Columbia since 2014. Academic excellence, community connections, career preparedness, and student advocacy.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          <AuthProvider>
            <TransitionProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </TransitionProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
