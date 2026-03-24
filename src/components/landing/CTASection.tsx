import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative overflow-hidden border-t border-border/40 py-24 sm:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_110%,hsl(var(--primary)/0.08),transparent)]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-border/50 bg-white dark:bg-card/80 backdrop-blur-sm p-12 text-center shadow-lg shadow-black/[0.04] sm:p-16">
          {/* Decorative gradient orbs */}
          <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />

          <div className="relative">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ready to see your Drive clearly?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground sm:text-lg">
              Connect your Google account in one click. Your tree is ready in
              seconds — no setup required.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="h-12 gap-2 rounded-full px-10 text-base shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
              >
                <Link href="/login">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              No credit card required &middot; Free tier available &middot; Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
