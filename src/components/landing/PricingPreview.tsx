import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function PricingPreview() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Early Access Pricing
        </h2>
        <p className="mt-3 text-muted-foreground sm:text-lg">
          Lock in founder pricing before it goes up.
        </p>

        <div className="mx-auto mt-10 max-w-sm">
          <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500/40 bg-card p-8 shadow-xl shadow-emerald-500/5">
            <div className="absolute right-0 top-0 rounded-bl-xl bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
              LAUNCH
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Early Access
            </p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-display text-5xl font-extrabold text-foreground">
                $1
              </span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Full access. Price locked forever for early adopters.
            </p>
            <Button asChild size="lg" className="mt-6 w-full gap-2 rounded-full">
              <Link href="/login">
                Try It Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
