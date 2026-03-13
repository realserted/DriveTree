import Link from "next/link";
import { cn } from "@/lib/utils";
import { FolderTree } from "lucide-react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizes = {
    sm: { icon: "h-5 w-5", text: "text-lg" },
    md: { icon: "h-6 w-6", text: "text-xl" },
    lg: { icon: "h-8 w-8", text: "text-3xl" },
  };

  return (
    <Link href="/" className={cn("flex items-center gap-2 group", className)}>
      <div className="relative">
        <FolderTree
          className={cn(
            sizes[size].icon,
            "text-emerald-500 transition-transform group-hover:scale-110"
          )}
        />
      </div>
      <span
        className={cn(
          sizes[size].text,
          "font-display font-bold tracking-tight text-foreground"
        )}
      >
        Drive<span className="text-emerald-500">Tree</span>
      </span>
    </Link>
  );
}
