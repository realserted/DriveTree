"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Free Trial",
    audience: "For individuals",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Try DriveTree free for 30 days",
    cta: "Start Free Trial",
    ctaVariant: "outline" as const,
    highlighted: false,
    features: [
      "1 Drive connection",
      "100 file limit",
      "Smart rename (no bulk)",
      "Basic folder organization",
      "Smart search",
      "File preview",
      "30-day access",
    ],
  },
  {
    name: "Starter",
    audience: "For personal use",
    monthlyPrice: 6,
    yearlyPrice: 4,
    description: "Everything in Free, plus more power",
    cta: "Get Started",
    ctaVariant: "default" as const,
    highlighted: true,
    badge: "Best Value",
    features: [
      "All Free Trial features",
      "1 cloud storage sign-in",
      "500 file limit",
      "Smart rename & bulk rename",
      "File cleanup & duplicates",
      "File preview",
      "Basic organization tools",
    ],
  },
  {
    name: "Pro",
    audience: "For professionals",
    monthlyPrice: 10,
    yearlyPrice: 8,
    description: "Unlimited power for heavy users",
    cta: "Try Free",
    ctaVariant: "default" as const,
    highlighted: false,
    features: [
      "All Starter features",
      "Unlimited Drive connections",
      "Bulk rename (500 files)",
      "Auto scan & categorize documents",
      "File cleanup & organization",
      "Smart folder templates",
      "Media organizer",
      "File tree export (Excel, CSV, PDF)",
    ],
  },
  {
    name: "Team",
    audience: "For teams & companies",
    monthlyPrice: 20,
    yearlyPrice: 16,
    description: "$20/mo base + $10/seat per member",
    cta: "Contact Sales",
    ctaVariant: "outline" as const,
    highlighted: false,
    features: [
      "All Pro features",
      "Standardized folder templates",
      "Enforced/custom naming rules",
      "Admin oversight & permissions",
      "Team seats & file sharing",
      "Auto-generate folders (Clients/Projects)",
      "Bulk rename (2,500 files)",
      "Missing document detection",
      "Password-protected files",
      "Team chat",
      "File audit log",
      "Compliance scanning",
      "Document classification",
    ],
  },
];

export function PricingTiers() {
  const [yearly, setYearly] = useState(true);

  return (
    <div className="mt-12 text-center">
      {/* Billing toggle */}
      <div className="inline-flex items-center gap-3 rounded-full border border-border/60 bg-card px-1.5 py-1.5">
        <button
          onClick={() => setYearly(false)}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-medium transition-all",
            !yearly
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Monthly
        </button>
        <button
          onClick={() => setYearly(true)}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-medium transition-all",
            yearly
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Yearly
          <span className="ml-1.5 text-xs opacity-80">Save 20%</span>
        </button>
      </div>

      {/* Pricing cards */}
      <div className="mx-auto mt-12 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={cn(
              "relative flex flex-col rounded-2xl border bg-white dark:bg-card p-6 text-left transition-all duration-300",
              tier.highlighted
                ? "border-2 border-primary/40 shadow-xl shadow-primary/5 lg:-my-2 lg:py-8"
                : "border-border/50 shadow-sm shadow-black/[0.02] hover:shadow-lg hover:shadow-black/[0.06]"
            )}
          >
            {/* Badge */}
            {tier.badge && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/25">
                <Sparkles className="h-3 w-3" />
                {tier.badge}
              </div>
            )}

            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {tier.audience}
            </p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {tier.name}
            </p>

            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-display text-5xl font-extrabold text-foreground">
                ${yearly ? tier.yearlyPrice : tier.monthlyPrice}
              </span>
              {tier.monthlyPrice > 0 && (
                <span className="text-muted-foreground">/month</span>
              )}
            </div>
            {yearly && tier.monthlyPrice > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                Billed annually
              </p>
            )}
            <p className="mt-2 text-sm text-muted-foreground">
              {tier.description}
            </p>

            <Button
              asChild
              variant={tier.ctaVariant}
              size="lg"
              className={cn(
                "mt-8 w-full gap-2 rounded-full",
                tier.highlighted && "shadow-lg shadow-primary/20"
              )}
            >
              <Link href="/login">
                {tier.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <ul className="mt-8 flex-1 space-y-3 border-t border-border/40 pt-6">
              {tier.features.map((feat) => (
                <li
                  key={feat}
                  className="flex items-start gap-2.5 text-sm text-foreground"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {feat}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-10 text-sm text-muted-foreground">
        All plans include Google OAuth sign-in, 256-bit encryption, and
        read-only access.
      </p>
    </div>
  );
}
