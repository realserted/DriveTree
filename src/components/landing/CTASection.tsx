import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative overflow-hidden border-t border-border/40 py-20 sm:py-28">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_110%,hsl(var(--primary)/0.06),transparent)]" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
            Ready to see your Drive clearly?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground sm:text-lg">
            Connect your Google account in one click. Your tree is ready in
            seconds.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="gap-2 rounded-full px-10 text-base shadow-lg shadow-primary/20">
              <Link href="/login">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            No credit card required &middot; Free tier available
          </p>
        </div>
      </div>
    </section>
  );
}
