import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { FileTreeDemo } from "@/components/landing/FileTreeDemo";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { PricingPreview } from "@/components/landing/PricingPreview";
import { CTASection } from "@/components/landing/CTASection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <FileTreeDemo />
        <PricingPreview />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
