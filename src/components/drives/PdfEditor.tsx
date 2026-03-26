"use client";

import { useState, useCallback } from "react";
import { Save, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PdfEditorProps {
  fileId: string;
  fileName: string;
  mimeType: string;
  /** Called to import the file to Google format and get an editor URL */
  onImport: () => Promise<{ googleFileId: string; editorUrl: string } | null>;
  /** Called to sync edits back to original and return new PDF blob */
  onSync: (googleDocId: string) => Promise<{ blobUrl: string } | null>;
  /** Original blob URL for preview fallback */
  blobUrl: string | null;
}

export function PdfEditor({
  fileId,
  fileName,
  onImport,
  onSync,
  blobUrl,
}: PdfEditorProps) {
  const [editing, setEditing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [googleDocId, setGoogleDocId] = useState<string | null>(null);
  const [editorUrl, setEditorUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState(blobUrl);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleStartEdit = useCallback(async () => {
    setImporting(true);
    try {
      const result = await onImport();
      if (result) {
        setGoogleDocId(result.googleFileId);
        setEditorUrl(result.editorUrl);
        setEditing(true);
      }
    } finally {
      setImporting(false);
    }
  }, [onImport]);

  const handleSaveAndPreview = useCallback(async () => {
    if (!googleDocId) return;
    setSyncing(true);
    setSyncStatus(null);
    try {
      const result = await onSync(googleDocId);
      if (result) {
        setPreviewUrl(result.blobUrl);
        setEditing(false);
        setGoogleDocId(null);
        setEditorUrl(null);
        setSyncStatus("Saved!");
        setTimeout(() => setSyncStatus(null), 2000);
      } else {
        setSyncStatus("Failed to save");
      }
    } catch {
      setSyncStatus("Failed to save");
    } finally {
      setSyncing(false);
    }
  }, [googleDocId, onSync]);

  const handleCancel = useCallback(() => {
    setEditing(false);
    setEditorUrl(null);
  }, []);

  // Editing mode: show Google editor iframe
  if (editing && editorUrl) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2 border-b border-border/40 px-3 py-2 bg-muted/20 shrink-0">
          <Button
            size="sm"
            onClick={handleSaveAndPreview}
            disabled={syncing}
            className="gap-1.5 text-xs"
          >
            {syncing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            {syncing ? "Saving..." : "Save & Preview"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            disabled={syncing}
            className="text-xs"
          >
            Cancel
          </Button>
          <a
            href={editorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="h-3 w-3" />
            Open in new tab
          </a>
        </div>
        <iframe
          src={editorUrl}
          className="flex-1 w-full border-0"
          title={`Editing ${fileName}`}
        />
      </div>
    );
  }

  // Preview mode: show PDF with edit button
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border/40 px-3 py-2 bg-muted/20 shrink-0">
        <Button
          size="sm"
          variant="outline"
          onClick={handleStartEdit}
          disabled={importing}
          className="gap-1.5 text-xs"
        >
          {importing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          {importing ? "Importing..." : "Edit PDF"}
        </Button>
        {syncStatus && (
          <span
            className={`text-xs font-medium ${
              syncStatus === "Saved!" ? "text-emerald-500" : "text-red-400"
            }`}
          >
            {syncStatus}
          </span>
        )}
      </div>
      {previewUrl ? (
        <iframe
          src={previewUrl}
          className="flex-1 w-full border-0"
          title={fileName}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
          No PDF preview available
        </div>
      )}
    </div>
  );
}
