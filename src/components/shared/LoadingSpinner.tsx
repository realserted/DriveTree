import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  className?: string;
  text?: string;
}

export function LoadingSpinner({ className, text }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}
