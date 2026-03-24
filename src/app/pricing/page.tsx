import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PricingTiers } from "@/components/pricing/PricingTiers";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing. Start with a 30-day free trial, then upgrade to Starter or Pro.",
};

const faqs = [
  {
    q: "Do you store my files?",
    a: "No. Your files stay on Google\u2019s servers. DriveTree only reads the folder structure and file metadata to display the tree. We never download or store your file contents.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, you can cancel your subscription at any time from your Settings page. You\u2019ll retain access until the end of your billing period.",
  },
  {
    q: "What happens after the free trial?",
    a: "After 30 days your account switches to a limited free view. Upgrade to Starter or Pro to keep full access \u2014 no data is lost.",
  },
  {
    q: "What Google permissions do you need?",
    a: "We request read-only access to your Google Drive to display files and folder structure. We cannot edit, share, or permanently delete your files.",
  },
  {
    q: "Can I switch plans later?",
    a: "Absolutely. You can upgrade or downgrade at any time. Changes take effect at the start of your next billing cycle.",
  },
  {
    q: "What cloud storage providers are supported?",
    a: "Google Drive is supported today. OneDrive, Dropbox, iCloud, and Amazon Drive are on the roadmap for Starter and Pro tiers.",
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
              Start free for 30 days. Upgrade when you need more power.
            </p>
          </div>

          {/* Pricing tiers */}
          <PricingTiers />

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
