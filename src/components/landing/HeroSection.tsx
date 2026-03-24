import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Lock, Eye } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.12),transparent)]" />
        <div className="absolute right-0 top-0 -z-10 h-96 w-96 bg-[radial-gradient(circle,hsl(var(--primary)/0.06),transparent_70%)]" />
        <div className="absolute left-0 bottom-0 -z-10 h-96 w-96 bg-[radial-gradient(circle,hsl(var(--primary)/0.04),transparent_70%)]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6 sm:pb-28 sm:pt-36 lg:pt-44 lg:pb-36">
        <div className="mx-auto max-w-3xl text-center">
          {/* Trust badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
            <Lock className="h-3.5 w-3.5" />
            Trusted by teams who value privacy
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
            Your entire Google Drive,{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              one clean tree.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Stop digging through folders. Browse your Drive as a collapsible
            file tree — find any file in seconds, preview it instantly.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="h-12 gap-2 rounded-full px-8 text-base shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
            >
              <Link href="/login">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 rounded-full px-8 text-base"
            >
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            {[
              { icon: Eye, text: "Read-only access" },
              { icon: Shield, text: "Files never leave Google" },
              { icon: Lock, text: "256-bit encryption" },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <item.icon className="h-4 w-4 text-primary/60" />
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
