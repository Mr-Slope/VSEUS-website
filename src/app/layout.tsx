import type { Metadata } from 'next';
import { Barlow, Montserrat } from 'next/font/google';
import './globals.css';
import { TransitionProvider } from '@/contexts/TransitionContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

// Barlow carries headings and display type; Montserrat carries body copy.
const barlow = Barlow({
  variable: '--font-barlow',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'VSEUS: Vancouver School of Economics Undergraduate Society',
  description:
    'Empowering economics students at the University of British Columbia since 2014. Academic excellence, community connections, career preparedness, and student advocacy.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${barlow.variable} ${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <TransitionProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </TransitionProvider>
      </body>
    </html>
  );
}
