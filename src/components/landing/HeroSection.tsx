import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.08),transparent)]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 sm:pb-24 sm:pt-32 lg:pt-40 lg:pb-32">
        <div className="mx-auto max-w-3xl text-center">
          {/* Headline */}
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
            Your entire Google Drive,{" "}
            <span className="text-primary">one clean tree.</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Stop digging through folders. Browse your Drive as a collapsible
            file tree — find any file in seconds, preview it instantly.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="gap-2 rounded-full px-8 text-base shadow-lg shadow-primary/20">
              <Link href="/login">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="text-base text-muted-foreground"
            >
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          {/* Social proof */}
          <p className="mt-12 text-sm text-muted-foreground">
            Read-only access &middot; Your files never leave Google &middot; Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
