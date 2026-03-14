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
        "relative flex flex-col rounded-2xl border p-8 transition-shadow duration-300",
        highlighted
          ? "border-primary/30 bg-card shadow-xl shadow-primary/[0.03]"
          : "border-border/60 bg-card hover:shadow-lg hover:shadow-black/[0.03]"
      )}
    >
      {badge && (
        <div className="absolute right-4 top-4 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {badge}
        </div>
      )}

      <p className="text-sm font-medium text-muted-foreground">{name}</p>

      <div className="mt-3 flex items-baseline gap-1">
        <span className="font-display text-5xl font-extrabold text-foreground">
          {price}
        </span>
        {period && <span className="text-muted-foreground">{period}</span>}
      </div>

      <p className="mt-3 text-sm text-muted-foreground">{description}</p>

      <ul className="mt-8 flex flex-1 flex-col gap-3">
        {features.map((feat) => (
          <li key={feat} className="flex items-start gap-2.5 text-sm text-foreground">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {feat}
          </li>
        ))}
      </ul>

      <Button
        asChild
        size="lg"
        className={cn(
          "mt-8 w-full gap-2 rounded-full",
          highlighted
            ? "shadow-lg shadow-primary/20"
            : "bg-foreground text-background hover:bg-foreground/90"
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
