import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-20%,hsl(var(--primary)/0.12),transparent)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMC44IiBmaWxsPSJoc2woMTUwIDQwJSA1MCUgLyAwLjA4KSIvPjwvc3ZnPg==')] opacity-60" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            Early Access — $1/month
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Google Drive{" "}
            <span className="relative">
              <span className="relative z-10">NEEDS</span>
              <span className="absolute -bottom-1 left-0 right-0 z-0 h-3 bg-emerald-500/20 dark:bg-emerald-500/30" />
            </span>{" "}
            a File Tree.
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Stop digging through folders. See your entire Drive as a clean,
            collapsible tree — find any file in seconds.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="gap-2 rounded-full px-8 text-base">
              <Link href="/login">
                Connect Google Drive
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8 text-base"
            >
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
