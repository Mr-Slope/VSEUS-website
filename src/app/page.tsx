import { Hero } from '@/components/home/Hero';
import { StatsBar } from '@/components/home/StatsBar';
import { ServicePillars } from '@/components/home/ServicePillars';
import { MerchStrip } from '@/components/home/MerchStrip';
import { CalendarSection } from '@/components/home/CalendarSection';

export default function Home() {
  return (
    <>
      <Hero />
      <StatsBar />
      <ServicePillars />
      <MerchStrip />
      <CalendarSection />
    </>
  );
}
