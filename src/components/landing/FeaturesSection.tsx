import { Search, Shield, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Search,
    title: "Find Files Instantly",
    description:
      "Navigate your entire Drive in a collapsible tree view. No more clicking through endless folders.",
    color: "text-blue-500 dark:text-blue-400",
    bg: "bg-blue-500/10",
    border: "group-hover:border-blue-500/20",
  },
  {
    icon: Shield,
    title: "Nothing Leaves Google",
    description:
      "Your files stay on Google's servers. We only read the folder structure — nothing is downloaded or stored.",
    color: "text-emerald-500 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "group-hover:border-emerald-500/20",
  },
  {
    icon: Zap,
    title: "One-Click Connect",
    description:
      "Sign in with Google and your tree is ready in seconds. No setup, no config, no friction.",
    color: "text-amber-500 dark:text-amber-400",
    bg: "bg-amber-500/10",
    border: "group-hover:border-amber-500/20",
  },
];

export function FeaturesSection() {
  return (
    <section className="border-t border-border/40 bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center mb-14">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built for how you actually work
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            No bloat, no learning curve. Connect your Drive and start browsing.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feat) => (
            <div
              key={feat.title}
              className={cn(
                "group relative rounded-xl border border-border/40 bg-card p-6 transition-all duration-300 hover:shadow-lg hover:shadow-black/[0.03]",
                feat.border
              )}
            >
              <div
                className={cn(
                  "mb-4 inline-flex rounded-lg p-2.5",
                  feat.bg
                )}
              >
                <feat.icon className={cn("h-5 w-5", feat.color)} />
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                {feat.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
