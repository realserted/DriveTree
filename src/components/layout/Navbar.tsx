"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { publicNav } from "@/config/nav";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {publicNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <div className="ml-3">
            <Button asChild size="sm">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden rounded-md p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile nav */}
      <div
        className={cn(
          "md:hidden overflow-hidden border-b border-border/40 bg-background transition-all duration-200",
          mobileOpen ? "max-h-64 py-4" : "max-h-0 py-0"
        )}
      >
        <div className="flex flex-col gap-1 px-4">
          {publicNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Button asChild size="sm" className="mt-2 w-full">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
