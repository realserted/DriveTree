"use client";

import { HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function ConnectDriveCard() {
  async function handleConnect() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/presentations.readonly",
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/60 bg-muted/20 px-8 py-16 text-center">
      <div className="mb-4 rounded-2xl bg-emerald-500/10 p-4">
        <HardDrive className="h-10 w-10 text-emerald-500" />
      </div>
      <h3 className="text-xl font-semibold text-foreground">
        Connect your Google Drive
      </h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        We&apos;ll read your folder structure so you can browse it as a tree.
        Your files stay on Google — we never download or store them.
      </p>
      <Button
        onClick={handleConnect}
        size="lg"
        className="mt-6 gap-2 rounded-full px-8"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
          <path d="M4.433 22l4.924-8.532h9.286L13.72 22H4.433z" fill="#4285F4" />
          <path d="M14.643 13.468H5.357L.433 4.936h9.286l4.924 8.532z" fill="#FBBC05" />
          <path d="M23.567 4.936l-4.924 8.532-4.924-8.532L18.643 0l4.924 4.936z" fill="#34A853" />
          <path d="M9.72 4.936h9.285L13.72 0H4.433l5.286 4.936z" fill="#EA4335" />
        </svg>
        Connect Drive
      </Button>
    </div>
  );
}
