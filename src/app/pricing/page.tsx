import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PricingCard } from "@/components/pricing/PricingCard";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing. Start exploring your Drive for just $1.",
};

const faqs = [
  {
    q: "Do you store my files?",
    a: "No. Your files stay on Google's servers. DriveTree only reads the folder structure and file metadata to display the tree. We never download or store your file contents.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, you can cancel your subscription at any time from your Settings page. You'll retain access until the end of your billing period.",
  },
  {
    q: "What Google permissions do you need?",
    a: "We request access to your Google Drive to read files and folder structure. We cannot share or permanently delete your files.",
  },
  {
    q: "Will the price go up?",
    a: "If you sign up during early access at $1/month, that price is locked for your account forever — even if we raise prices later.",
  },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
              Simple, Transparent Pricing
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Start exploring your Drive today. Upgrade when you need more.
            </p>
          </div>

          {/* Cards */}
          <div className="mx-auto mt-14 grid max-w-4xl gap-8 sm:grid-cols-2">
            <PricingCard
              name="Free"
              price="$0"
              period=""
              description="Try DriveTree with limited access."
              features={[
                "Connect 1 Google Drive",
                "Browse top-level folders only",
                "Basic file info",
              ]}
              cta="Get Started"
              ctaHref="/login"
            />
            <PricingCard
              name="Early Access"
              price="$1"
              period="/month"
              description="Full access. Price locked forever for early adopters."
              features={[
                "Connect 1 Google Drive",
                "Full file tree navigation",
                "File preview & viewer",
                "Search across your Drive",
                "Early adopter pricing locked",
              ]}
              cta="Get Started"
              ctaHref="/login"
              highlighted
              badge="LAUNCH"
            />
          </div>

          {/* FAQ */}
          <div className="mx-auto mt-24 max-w-2xl">
            <h2 className="text-center font-display text-2xl font-bold text-foreground">
              Frequently Asked Questions
            </h2>
            <div className="mt-10 divide-y divide-border/60">
              {faqs.map((faq) => (
                <div key={faq.q} className="py-5">
                  <h3 className="text-sm font-semibold text-foreground">
                    {faq.q}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
