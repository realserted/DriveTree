import { PricingTiers } from "@/components/pricing/PricingTiers";

export function PricingPreview() {
  return (
    <section className="relative border-t border-border/40 bg-muted/30 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Pricing
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            Start free, upgrade when you need more. No hidden fees.
          </p>
        </div>

        <PricingTiers />
      </div>
    </section>
  );
}
