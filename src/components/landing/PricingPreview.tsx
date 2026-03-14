import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

export function PricingPreview() {
  return (
    <section className="border-t border-border/40 bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Early Access Pricing
        </h2>
        <p className="mt-4 text-muted-foreground sm:text-lg">
          Lock in founder pricing before it goes up.
        </p>

        <div className="mx-auto mt-12 max-w-sm">
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-8 shadow-xl shadow-black/5">
            {/* Badge */}
            <div className="absolute right-4 top-4 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
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

            <ul className="mt-6 space-y-2.5 text-left">
              {[
                "Full file tree navigation",
                "File preview & viewer",
                "Search across your Drive",
                "Price locked forever",
              ].map((feat) => (
                <li key={feat} className="flex items-center gap-2.5 text-sm text-foreground">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  {feat}
                </li>
              ))}
            </ul>

            <Button asChild size="lg" className="mt-8 w-full gap-2 rounded-full shadow-lg shadow-primary/20">
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
