import HeroSection from "@/components/sections/HeroSection";
import TrustBar from "@/components/sections/TrustBar";
import ServicesRow from "@/components/sections/ServicesRow";
import AboutPreview from "@/components/sections/AboutPreview";
import StatsSection from "@/components/sections/StatsSection";
import InsightsPreview from "@/components/sections/InsightsPreview";
import ValuesSection from "@/components/sections/ValuesSection";
import ContactCTA from "@/components/sections/ContactCTA";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <ServicesRow />
      <AboutPreview />
      <StatsSection />
      <InsightsPreview />
      <ValuesSection />
      <ContactCTA />
    </>
  );
}
