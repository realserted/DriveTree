import { Search, Shield, Zap, FolderTree, Eye, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: FolderTree,
    title: "Instant Tree View",
    description:
      "See your entire Drive hierarchy at a glance. Expand, collapse, and navigate folders without ever leaving the page.",
    color: "text-blue-500 dark:text-blue-400",
    bg: "bg-blue-500/10",
    border: "group-hover:border-blue-500/30",
  },
  {
    icon: Eye,
    title: "Preview Anything",
    description:
      "PDFs, images, videos, Google Docs, spreadsheets, presentations — preview them all inline without downloading.",
    color: "text-violet-500 dark:text-violet-400",
    bg: "bg-violet-500/10",
    border: "group-hover:border-violet-500/30",
  },
  {
    icon: Search,
    title: "Find Files Fast",
    description:
      "Search across every file and folder in your Drive. Results appear as you type — no waiting.",
    color: "text-amber-500 dark:text-amber-400",
    bg: "bg-amber-500/10",
    border: "group-hover:border-amber-500/30",
  },
  {
    icon: Shield,
    title: "Nothing Leaves Google",
    description:
      "Your files stay on Google\u2019s servers. We only read folder structure and metadata \u2014 zero file storage on our end.",
    color: "text-emerald-500 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "group-hover:border-emerald-500/30",
  },
  {
    icon: Zap,
    title: "One-Click Connect",
    description:
      "Sign in with Google and your tree is ready in seconds. No manual setup, no config files, no friction.",
    color: "text-orange-500 dark:text-orange-400",
    bg: "bg-orange-500/10",
    border: "group-hover:border-orange-500/30",
  },
  {
    icon: RefreshCw,
    title: "Smart Rename & Cleanup",
    description:
      "Rename files with smart suggestions and find duplicates cluttering your Drive. Keep everything organized.",
    color: "text-cyan-500 dark:text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "group-hover:border-cyan-500/30",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative border-t border-border/40 bg-muted/30 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Features
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built for how you actually work
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            No bloat, no learning curve. Connect your Drive and start browsing.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feat) => (
            <div
              key={feat.title}
              className={cn(
                "group relative rounded-2xl border border-border/50 bg-white dark:bg-card/80 backdrop-blur-sm p-7 shadow-sm shadow-black/[0.02] transition-all duration-300",
                "hover:shadow-lg hover:shadow-black/[0.06] hover:-translate-y-0.5",
                feat.border
              )}
            >
              <div
                className={cn(
                  "mb-5 inline-flex rounded-xl p-3",
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
