import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { footerNav } from "@/config/nav";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-10 sm:flex-row sm:justify-between sm:px-6">
        <Logo size="sm" />
        <nav className="flex flex-wrap items-center gap-4">
          {footerNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} DriveTree. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
