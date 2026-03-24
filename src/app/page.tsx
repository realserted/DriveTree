import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { BeforeAfterSection } from "@/components/landing/BeforeAfterSection";
import { FileTreeDemo } from "@/components/landing/FileTreeDemo";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { IntegrationsSection } from "@/components/landing/IntegrationsSection";
import { SecuritySection } from "@/components/landing/SecuritySection";
import { PricingPreview } from "@/components/landing/PricingPreview";
import { CTASection } from "@/components/landing/CTASection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <BeforeAfterSection />
        <FeaturesSection />
        <FileTreeDemo />
        <IntegrationsSection />
        <SecuritySection />
        <PricingPreview />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
