import { Hero } from '@/components/home/Hero';
import { StatsBar } from '@/components/home/StatsBar';
import { ServicePillars } from '@/components/home/ServicePillars';
import { SponsorsRow } from '@/components/home/SponsorsRow';
import { CalendarSection } from '@/components/home/CalendarSection';

export default function Home() {
  return (
    <>
      <Hero />
      <StatsBar />
      <ServicePillars />
      <SponsorsRow />
      <CalendarSection />
    </>
  );
}
