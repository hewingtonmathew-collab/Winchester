import HeroSection from "@/components/sections/HeroSection";
import TrustBar from "@/components/sections/TrustBar";
import ServicesRow from "@/components/sections/ServicesRow";
import AboutPreview from "@/components/sections/AboutPreview";
import StatsSection from "@/components/sections/StatsSection";
import InsightsPreview from "@/components/sections/InsightsPreview";
import ContactCTA from "@/components/sections/ContactCTA";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export default function HomePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", href: "/" }])} />
      <HeroSection />
      <TrustBar />
      <ServicesRow />
      <AboutPreview />
      <StatsSection />
      <InsightsPreview />
      <ContactCTA />
    </>
  );
}
