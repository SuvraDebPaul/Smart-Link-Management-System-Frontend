import { AnalyticsPreviewSection } from "@/components/landing/analytics-preview-section";
import { ApiSection } from "@/components/landing/api-section";
import { BioPagePreviewSection } from "@/components/landing/bio-page-preview-section";
import { CustomDomainSection } from "@/components/landing/custom-domain-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { PricingSection } from "@/components/landing/pricing-section";
import { StatsSection } from "@/components/landing/stats-section";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <LandingNavbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <AnalyticsPreviewSection />
      <BioPagePreviewSection />
      <CustomDomainSection />
      <ApiSection />
      <PricingSection />
      <FaqSection />
      <LandingFooter />
    </main>
  );
}
