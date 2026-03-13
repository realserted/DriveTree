import { Search, Shield, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Search,
    title: "Find Files Instantly",
    description:
      "Navigate your entire Drive in a collapsible tree view. No more clicking through endless folders.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Shield,
    title: "Nothing Leaves Google",
    description:
      "Your files stay on Google's servers. We only read the folder structure — nothing is downloaded or stored.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Zap,
    title: "One-Click Connect",
    description:
      "Sign in with Google and your tree is ready in seconds. No setup, no config, no friction.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

export function FeaturesSection() {
  return (
    <section className="border-t border-border/40 bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feat, i) => (
            <div
              key={feat.title}
              className="group rounded-xl border border-border/40 bg-card p-6 transition-all hover:border-border hover:shadow-lg hover:shadow-black/5"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div
                className={cn(
                  "mb-4 inline-flex rounded-lg p-2.5",
                  feat.bg
                )}
              >
                <feat.icon className={cn("h-5 w-5", feat.color)} />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
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
