import type { Metadata } from 'next';
import { Barlow, Barlow_Condensed, Barlow_Semi_Condensed, Montserrat } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

// Barlow carries headings and display type; Montserrat carries body copy.
const barlow = Barlow({
  variable: '--font-barlow',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

// Barlow's narrower widths, used sparingly for depth: Condensed for the tallest
// display type (hero headline, stat figures, calendar dates), Semi Condensed for
// the small uppercase eyebrow labels above section headings.
const barlowCondensed = Barlow_Condensed({
  variable: '--font-barlow-condensed',
  subsets: ['latin'],
  weight: ['500', '600', '700', '800', '900'],
});

const barlowSemiCondensed = Barlow_Semi_Condensed({
  variable: '--font-barlow-semi-condensed',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
});

// Also the light italic half of two-part headings (.heading-accent).
const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: 'VSEUS: Vancouver School of Economics Undergraduate Society',
  description:
    'Empowering economics students at the University of British Columbia since 2014. Academic excellence, community connections, career preparedness, and student advocacy.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${barlow.variable} ${barlowCondensed.variable} ${barlowSemiCondensed.variable} ${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
