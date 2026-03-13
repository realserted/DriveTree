import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  ctaHref: string;
  highlighted?: boolean;
  badge?: string;
}

export function PricingCard({
  name,
  price,
  period = "/month",
  description,
  features,
  cta,
  ctaHref,
  highlighted = false,
  badge,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-2xl border p-8",
        highlighted
          ? "border-2 border-emerald-500/40 bg-card shadow-xl shadow-emerald-500/5"
          : "border-border/60 bg-card"
      )}
    >
      {badge && (
        <div className="absolute right-0 top-0 rounded-bl-xl bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
          {badge}
        </div>
      )}

      <p className="text-sm font-medium text-muted-foreground">{name}</p>

      <div className="mt-2 flex items-baseline gap-1">
        <span className="font-display text-5xl font-extrabold text-foreground">
          {price}
        </span>
        {period && <span className="text-muted-foreground">{period}</span>}
      </div>

      <p className="mt-3 text-sm text-muted-foreground">{description}</p>

      <ul className="mt-6 flex flex-1 flex-col gap-3">
        {features.map((feat) => (
          <li key={feat} className="flex items-start gap-2.5 text-sm text-foreground">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            {feat}
          </li>
        ))}
      </ul>

      <Button
        asChild
        size="lg"
        className={cn(
          "mt-8 w-full gap-2 rounded-full",
          !highlighted && "bg-foreground text-background hover:bg-foreground/90"
        )}
      >
        <Link href={ctaHref}>
          {cta}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
