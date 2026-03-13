"use client";

import Link from "next/link";
import { Settings, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useUser } from "@/hooks/useUser";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";

export function DashboardTopbar() {
  const { user } = useUser();
  const { theme, setTheme } = useTheme();

  const avatarUrl = user?.user_metadata?.avatar_url;
  const name = user?.user_metadata?.full_name || user?.email || "";
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="flex h-16 items-center justify-end gap-2 border-b border-border/40 bg-background px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>

      <Button variant="ghost" size="icon" asChild>
        <Link href="/dashboard/settings">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Link>
      </Button>

      <Link href="/dashboard/profile">
        <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-border transition-all hover:ring-primary">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
      </Link>
    </header>
  );
}
