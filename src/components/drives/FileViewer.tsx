"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import DOMPurify from "dompurify";
import {
  FileText,
  ExternalLink,
  Download,
  Eye,
  Pencil,
  Sparkles,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/primitives";
import { ScrollArea } from "@/components/ui/primitives";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useFilePreview } from "@/hooks/useFilePreview";
import { formatBytes, formatDate, generateSmartName } from "@/lib/utils";
import type { DriveFile } from "@/types/drive";
import { isGoogleDoc, isImage, isPdf, isText, isOfficeDoc, isVideo } from "@/types/drive";

interface FileViewerProps {
  file: DriveFile | null;
  onFileRenamed?: (updated: DriveFile) => void;
}

function isPreviewable(file: DriveFile): boolean {
  return isGoogleDoc(file) || isOfficeDoc(file) || isPdf(file) || isImage(file) || isText(file) || isVideo(file);
}

export function FileViewer({ file, onFileRenamed }: FileViewerProps) {
  const { content, blobUrl, previewType, loading, fetchPreview, clearContent } =
    useFilePreview();

  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [renameSaving, setRenameSaving] = useState(false);
  const [displayName, setDisplayName] = useState(file?.name ?? "");

  const sanitizedHtml = useMemo(
    () => (content ? DOMPurify.sanitize(content) : ""),
    [content]
  );

  const fileId = file?.id;
  useEffect(() => {
    clearContent();
    setIsRenaming(false);
    setDisplayName(file?.name ?? "");
    if (file && isPreviewable(file)) {
      fetchPreview(file);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileId]);

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
      // keep the input open so user can retry
    } finally {
      setRenameSaving(false);
    }
  }, [file, renameValue, displayName, cancelRename, onFileRenamed]);

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
                <span className="text-xs text-muted-foreground">·</span>
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
          /* Google Docs/Sheets/Slides exported as HTML */
          <ScrollArea className="h-full bg-white">
            <div
              className="prose prose-sm max-w-none p-6 text-black [&_a]:text-blue-600"
              dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            />
          </ScrollArea>
        ) : previewType === "pdf" && blobUrl ? (
          /* PDF rendered from blob */
          <iframe
            src={blobUrl}
            className="h-full w-full border-0"
            title={file.name}
          />
        ) : previewType === "image" && blobUrl ? (
          /* Images rendered from blob */
          <div className="flex h-full items-center justify-center bg-muted/20 p-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={blobUrl}
              alt={file.name}
              className="max-h-full max-w-full rounded-md object-contain shadow-lg"
            />
          </div>
        ) : previewType === "video" && blobUrl ? (
          /* Video rendered from blob */
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
          /* Text/code files */
          <ScrollArea className="h-full">
            <pre className="whitespace-pre-wrap p-4 font-mono text-sm text-foreground">
              {content}
            </pre>
          </ScrollArea>
        ) : (
          /* Unsupported format */
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
