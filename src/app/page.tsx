import { Hero } from '@/components/home/Hero';
import { StatsBar } from '@/components/home/StatsBar';
import { SponsorStrip } from '@/components/home/SponsorStrip';
import { ServicePillars } from '@/components/home/ServicePillars';
import { MerchStrip } from '@/components/home/MerchStrip';
import { CalendarSection } from '@/components/home/CalendarSection';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { UpcomingEventPopup } from '@/components/home/UpcomingEventPopup';

export default function Home() {
  return (
    <>
      <Hero />
      <StatsBar />
      <SponsorStrip />
      <SectionDivider from="midnight" to="ice" variant="swell" />
      <ServicePillars />
      <SectionDivider from="ice" to="midnight-700" variant="ripple" />
      <MerchStrip />
      <SectionDivider from="midnight-700" to="midnight" variant="dip" size="sm" />
      <CalendarSection />
      <UpcomingEventPopup />
    </>
  );
}
