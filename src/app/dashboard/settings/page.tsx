"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Moon, Sun, Monitor, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/primitives";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/primitives";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDeleteAccount() {
    setDeleting(true);
    const supabase = createClient();
    // In production, call a server action or API route that uses the service role key
    await supabase.auth.signOut();
    router.push("/");
  }

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ] as const;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-foreground">
        Settings
      </h1>

      {/* Theme */}
      <div className="mt-8 rounded-xl border border-border/60 bg-card p-6">
        <h2 className="text-sm font-semibold text-foreground">Appearance</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose your preferred theme.
        </p>
        <div className="mt-4 flex gap-2">
          {themes.map((t) => (
            <button
              key={t.value}
              onClick={() => setTheme(t.value)}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
                theme === t.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="mt-6 rounded-xl border border-destructive/30 bg-card p-6">
        <h2 className="text-sm font-semibold text-destructive">Danger Zone</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Permanently delete your account and all associated data.
        </p>
        <Button
          variant="destructive"
          size="sm"
          className="mt-4 gap-1.5"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete Account
        </Button>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete your account?</DialogTitle>
            <DialogDescription>
              This action is permanent and cannot be undone. All your data,
              connected drives, and subscription will be deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Yes, delete my account"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
