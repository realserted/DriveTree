import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="border-t border-border/40 bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Ready to see your Drive clearly?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground sm:text-lg">
          Connect your Google account in one click. Your tree is ready in
          seconds.
        </p>
        <div className="mt-8">
          <Button asChild size="lg" className="gap-2 rounded-full px-10 text-base">
            <Link href="/login">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
