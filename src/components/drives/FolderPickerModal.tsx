"use client";

import { useState } from "react";
import { X, FolderOpen, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FolderPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFolderName: string | null;
  onSaved: (folderId: string | null, folderName: string | null) => void;
}

/** Extract a Google Drive folder ID from a URL like https://drive.google.com/drive/folders/FOLDER_ID */
function extractFolderId(input: string): string | null {
  const trimmed = input.trim();
  // Direct folder ID (no slashes, looks like an ID)
  if (/^[a-zA-Z0-9_-]{10,}$/.test(trimmed)) return trimmed;
  // URL format
  const match = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  return match?.[1] ?? null;
}

export function FolderPickerModal({
  open,
  onOpenChange,
  currentFolderName,
  onSaved,
}: FolderPickerModalProps) {
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleSave() {
    setError(null);
    const folderId = extractFolderId(url);
    if (!folderId) {
      setError("Invalid folder URL. Please paste a Google Drive folder link.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/drive/folder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folderId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to set folder.");
        return;
      }

      const data = await res.json();
      onSaved(data.root_folder_id, data.root_folder_name);
      setUrl("");
      onOpenChange(false);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleClose() {
    setUrl("");
    setError(null);
    onOpenChange(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border/60 bg-card p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {currentFolderName ? "Change Google Drive Folder" : "Add Google Drive Folder"}
          </h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          {currentFolderName
            ? "Replace the current Google Drive folder with a new one. This will overwrite the existing configuration."
            : "Select a Google Drive folder to browse. Only files in this folder will be shown."}
        </p>

        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            Open Google Drive and navigate to the folder you want to use
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            Copy the folder URL from your browser&apos;s address bar
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            Paste it below and click Connect
          </div>
        </div>

        <div className="mt-5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
            <FolderOpen className="h-3.5 w-3.5" />
            GOOGLE DRIVE FOLDER URL
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError(null);
            }}
            placeholder="https://drive.google.com/drive/folders/..."
            className="w-full rounded-lg border border-border/60 bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
          />
          {error && (
            <p className="mt-1.5 text-xs text-red-400">{error}</p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={handleClose} disabled={saving}>
            CANCEL
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving || !url.trim()}
            className="gap-1.5"
          >
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {currentFolderName ? "UPDATE DRIVE" : "CONNECT"}
          </Button>
        </div>
      </div>
    </div>
  );
}
