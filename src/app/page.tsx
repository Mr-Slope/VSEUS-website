import { Hero } from '@/components/home/Hero';
import { StatsBar } from '@/components/home/StatsBar';
import { SponsorStrip } from '@/components/home/SponsorStrip';
import { ServicePillars } from '@/components/home/ServicePillars';
import { MerchStrip } from '@/components/home/MerchStrip';
import { CalendarSection } from '@/components/home/CalendarSection';
import { UpcomingEventPopup } from '@/components/home/UpcomingEventPopup';

export default function Home() {
  return (
    <>
      <Hero />
      <StatsBar />
      <SponsorStrip />
      <ServicePillars />
      <MerchStrip />
      <CalendarSection />
      <UpcomingEventPopup />
    </>
  );
}
