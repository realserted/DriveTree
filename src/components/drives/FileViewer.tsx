"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import DOMPurify from "dompurify";
import {
  FileText,
  ExternalLink,
  Download,
  Eye,
  Pencil,
  PenLine,
  Sparkles,
  Check,
  X,
  Save,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/primitives";
import { ScrollArea } from "@/components/ui/primitives";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useFilePreview } from "@/hooks/useFilePreview";
import { formatBytes, formatDate, generateSmartName } from "@/lib/utils";
import {
  updateFileContent,
  updateDocx,
  importToGoogleFormat,
  syncPdfEdit,
  syncCsvEdit,
  deleteTempFile,
  getGoogleEditorUrl,
} from "@/lib/drive-edit";
import { CsvEditor } from "./CsvEditor";
import { DocxEditor } from "./DocxEditor";
// PdfEditor no longer used — PDF editing uses google-iframe flow
import type { DriveFile } from "@/types/drive";
import {
  isGoogleDoc,
  isImage,
  isPdf,
  isText,
  isOfficeDoc,
  isVideo,
  isCsv,
  isWordDoc,
  GOOGLE_SHEET_MIME,
} from "@/types/drive";

interface FileViewerProps {
  file: DriveFile | null;
  onFileRenamed?: (updated: DriveFile) => void;
}

function isPreviewable(file: DriveFile): boolean {
  return (
    isGoogleDoc(file) ||
    isOfficeDoc(file) ||
    isPdf(file) ||
    isImage(file) ||
    isText(file) ||
    isVideo(file) ||
    isCsv(file)
  );
}

function isEditable(file: DriveFile): boolean {
  return (
    isGoogleDoc(file) ||
    isCsv(file) ||
    isWordDoc(file) ||
    isPdf(file) ||
    isOfficeDoc(file)
  );
}

type EditMode = "none" | "csv" | "docx" | "google-iframe";

export function FileViewer({ file, onFileRenamed }: FileViewerProps) {
  const { content, blobUrl, previewType, loading, fetchPreview, clearContent } =
    useFilePreview();

  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [renameSaving, setRenameSaving] = useState(false);
  const [displayName, setDisplayName] = useState(file?.name ?? "");

  // Edit state
  const [editMode, setEditMode] = useState<EditMode>("none");
  const [editorUrl, setEditorUrl] = useState<string | null>(null);
  const [tempGoogleFileId, setTempGoogleFileId] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [csvContent, setCsvContent] = useState<string | null>(null);

  const sanitizedHtml = useMemo(
    () => (content ? DOMPurify.sanitize(content) : ""),
    [content]
  );

  const fileId = file?.id;
  useEffect(() => {
    clearContent();
    setIsRenaming(false);
    setEditMode("none");
    setEditorUrl(null);
    setDisplayName(file?.name ?? "");
    if (file && isPreviewable(file)) {
      fetchPreview(file);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileId]);

  // ── Rename handlers ──────────────────────────────────────────
  const startRename = useCallback(() => {
    if (!file) return;
    setRenameValue(displayName);
    setIsRenaming(true);
  }, [file, displayName]);

  const applySmartName = useCallback(() => {
    if (!file) return;
    setRenameValue(generateSmartName(displayName, file.modifiedTime));
  }, [file, displayName]);

  const cancelRename = useCallback(() => {
    setIsRenaming(false);
    setRenameValue("");
  }, []);

  const saveRename = useCallback(async () => {
    if (!file || !renameValue.trim() || renameValue.trim() === displayName) {
      cancelRename();
      return;
    }
    setRenameSaving(true);
    try {
      const res = await fetch(`/api/drive/files/${file.id}/rename`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: renameValue.trim() }),
      });
      if (!res.ok) throw new Error("Rename failed");
      const updated: DriveFile = await res.json();
      setDisplayName(updated.name);
      setIsRenaming(false);
      onFileRenamed?.(updated);
    } catch {
      // keep input open for retry
    } finally {
      setRenameSaving(false);
    }
  }, [file, renameValue, displayName, cancelRename, onFileRenamed]);

  // ── Edit handlers ────────────────────────────────────────────
  const handleStartEdit = useCallback(async () => {
    if (!file) return;

    // Google native docs (Docs, Sheets, Slides): open Google editor in iframe
    // Must check before isCsv/isWordDoc since Google-native files may have .csv/.doc names
    if (isGoogleDoc(file)) {
      const url = getGoogleEditorUrl(file.id, file.mimeType);
      if (url) {
        setEditorUrl(url);
        setEditMode("google-iframe");
      }
      return;
    }

    // CSV: import to Google Sheets, edit, sync back, auto-delete temp on save or cancel
    if (isCsv(file)) {
      const result = await importToGoogleFormat(file.id, file.mimeType, file.name);
      if (result) {
        setTempGoogleFileId(result.googleFileId);
        setEditorUrl(result.editorUrl);
        setEditMode("google-iframe");
      }
      return;
    }

    // DOCX: inline rich text editor
    if (isWordDoc(file)) {
      setEditMode("docx");
      return;
    }

    // PDF: import to Google Docs, edit, auto-sync back on exit
    if (isPdf(file)) {
      const result = await importToGoogleFormat(file.id, file.mimeType, file.name);
      if (result) {
        setTempGoogleFileId(result.googleFileId);
        setEditorUrl(result.editorUrl);
        setEditMode("google-iframe");
      }
      return;
    }

    // Office files (xlsx, pptx): import to Google format
    if (isOfficeDoc(file)) {
      const result = await importToGoogleFormat(file.id, file.mimeType, file.name);
      if (result) {
        setTempGoogleFileId(result.googleFileId);
        setEditorUrl(result.editorUrl);
        setEditMode("google-iframe");
      }
    }
  }, [file]);

  const handleCsvSave = useCallback(
    async (csvContent: string) => {
      if (!file) return { ok: false, error: "No file" };
      return updateFileContent(file.id, csvContent, "text/csv");
    },
    [file]
  );

  const handleDocxSave = useCallback(
    async (html: string) => {
      if (!file) return { ok: false, error: "No file" };
      return updateDocx(file.id, html);
    },
    [file]
  );

  const exitEditMode = useCallback(async () => {
    // If there's a temp imported file (CSV/PDF/Office), sync changes back and delete it
    if (file && tempGoogleFileId) {
      setSyncing(true);
      try {
        if (isCsv(file)) {
          await syncCsvEdit(file.id, tempGoogleFileId);
        } else if (isPdf(file)) {
          await syncPdfEdit(file.id, tempGoogleFileId);
        } else {
          // For other imported types, just delete the temp file
          await deleteTempFile(tempGoogleFileId).catch(() => {});
        }
      } catch {
        // If sync fails, still delete the temp file
        await deleteTempFile(tempGoogleFileId).catch(() => {});
      } finally {
        setSyncing(false);
      }
    }
    setEditMode("none");
    setEditorUrl(null);
    setTempGoogleFileId(null);
    setCsvContent(null);
    // Re-fetch preview after a short delay so Google propagates the changes
    if (file && isPreviewable(file)) {
      clearContent();
      setTimeout(() => fetchPreview(file), 1500);
    }
  }, [file, tempGoogleFileId, clearContent, fetchPreview]);

  // ── Render: no file selected ─────────────────────────────────
  if (!file) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
        <div className="rounded-2xl bg-muted/50 p-4">
          <Eye className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <p className="text-sm text-muted-foreground">
          Select a file from the tree to preview it
        </p>
      </div>
    );
  }

  // ── Render: edit modes ───────────────────────────────────────

  // CSV editor
  if (editMode === "csv" && (csvContent || content)) {
    return (
      <div className="flex h-full flex-col">
        <EditBar fileName={displayName} onExit={exitEditMode} />
        <div className="flex-1 overflow-hidden">
          <CsvEditor initialContent={csvContent || content || ""} onSave={handleCsvSave} />
        </div>
      </div>
    );
  }

  // DOCX editor
  if (editMode === "docx" && sanitizedHtml) {
    return (
      <div className="flex h-full flex-col">
        <EditBar fileName={displayName} onExit={exitEditMode} />
        <div className="flex-1 overflow-hidden">
          <DocxEditor initialHtml={sanitizedHtml} onSave={handleDocxSave} />
        </div>
      </div>
    );
  }

  // Google editor iframe (native Google docs + imported CSV/Office files)
  if (editMode === "google-iframe" && editorUrl) {
    return (
      <div className="flex h-full flex-col">
        <EditBar
          fileName={displayName}
          onExit={exitEditMode}
          editorUrl={editorUrl}
          syncing={syncing}
        />
        <iframe
          src={editorUrl}
          className="flex-1 w-full border-0"
          title={`Editing ${displayName}`}
        />
      </div>
    );
  }

  // PDF edit mode is now handled by google-iframe above

  // ── Render: preview mode ─────────────────────────────────────
  return (
    <div className="flex h-full flex-col">
      {/* File info bar */}
      <div className="border-b border-border/40 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-sm font-medium text-foreground">
                  {displayName}
                </p>
                {!isRenaming && (
                  <button
                    onClick={startRename}
                    className="shrink-0 rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    title="Rename file"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {formatBytes(file.size)}
                </span>
                <span className="text-xs text-muted-foreground">&middot;</span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(file.modifiedTime)}
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {file.mimeType.split("/").pop()?.split(".").pop()}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isEditable(file) && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={handleStartEdit}
              >
                <PenLine className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
            )}
            {file.webContentLink && (
              <Button asChild variant="ghost" size="sm" className="gap-1.5">
                <a
                  href={file.webContentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Download</span>
                </a>
              </Button>
            )}
            {file.webViewLink && (
              <Button asChild variant="ghost" size="sm" className="gap-1.5">
                <a
                  href={file.webViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Open in Drive</span>
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Inline rename input */}
        {isRenaming && (
          <div className="mt-2 flex items-center gap-2">
            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveRename();
                if (e.key === "Escape") cancelRename();
              }}
              autoFocus
              disabled={renameSaving}
              className="flex-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            />
            <Button
              variant="outline"
              size="sm"
              className="gap-1 text-xs"
              onClick={applySmartName}
              disabled={renameSaving}
              title="Auto-generate a smart name with date prefix"
            >
              <Sparkles className="h-3 w-3" />
              Smart
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={saveRename}
              disabled={renameSaving || !renameValue.trim()}
              className="h-7 w-7 p-0 text-emerald-600 hover:text-emerald-700"
              title="Save"
            >
              <Check className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={cancelRename}
              disabled={renameSaving}
              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
              title="Cancel"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* Preview content */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <LoadingSpinner className="py-12" text="Loading preview..." />
        ) : previewType === "html" && content ? (
          <ScrollArea className="h-full bg-white">
            <div
              className="prose prose-sm max-w-none p-6 text-black [&_a]:text-blue-600"
              dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            />
          </ScrollArea>
        ) : previewType === "pdf" && blobUrl ? (
          <iframe
            src={blobUrl}
            className="h-full w-full border-0"
            title={file.name}
          />
        ) : previewType === "image" && blobUrl ? (
          <div className="flex h-full items-center justify-center bg-muted/20 p-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={blobUrl}
              alt={file.name}
              className="max-h-full max-w-full rounded-md object-contain shadow-lg"
            />
          </div>
        ) : previewType === "video" && blobUrl ? (
          <div className="flex h-full items-center justify-center bg-black p-4">
            <video
              src={blobUrl}
              controls
              className="max-h-full max-w-full rounded-md"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        ) : previewType === "text" && content ? (
          <ScrollArea className="h-full">
            <pre className="whitespace-pre-wrap p-4 font-mono text-sm text-foreground">
              {content}
            </pre>
          </ScrollArea>
        ) : previewType === "iframe" && file ? (
          <iframe
            src={
              file.mimeType === GOOGLE_SHEET_MIME
                ? `https://docs.google.com/spreadsheets/d/${file.id}/preview`
                : `https://drive.google.com/file/d/${file.id}/preview`
            }
            className="h-full w-full border-0"
            title={file.name}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-2xl bg-muted/50 p-4">
              <FileText className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Preview not available
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                This file type can&apos;t be previewed.{" "}
                {file.webViewLink && "Open it in Google Drive instead."}
              </p>
            </div>
            {file.webViewLink && (
              <Button asChild variant="outline" size="sm" className="gap-1.5">
                <a
                  href={file.webViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open in Google Drive
                </a>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** Shared bar shown during edit mode with file name and exit button */
function EditBar({
  fileName,
  onExit,
  editorUrl,
  syncing,
}: {
  fileName: string;
  onExit: () => void;
  editorUrl?: string;
  syncing?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border/40 px-4 py-2.5 bg-muted/20">
      <div className="flex items-center gap-2">
        <PenLine className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-foreground">
          Editing: {fileName}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {editorUrl && (
          <a
            href={editorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            Open in new tab
          </a>
        )}
        <Button variant="ghost" size="sm" onClick={onExit} disabled={syncing} className="text-xs">
          {syncing ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <X className="h-3.5 w-3.5 mr-1" />}
          {syncing ? "Saving..." : "Exit Edit"}
        </Button>
      </div>
    </div>
  );
}
