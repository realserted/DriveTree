"use client";

import { useEffect } from "react";
import {
  FileText,
  ExternalLink,
  Download,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/primitives";
import { ScrollArea } from "@/components/ui/primitives";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useFilePreview } from "@/hooks/useFilePreview";
import { formatBytes, formatDate } from "@/lib/utils";
import type { DriveFile } from "@/types/drive";
import { isGoogleDoc, isImage, isPdf, isText } from "@/types/drive";
import { getPreviewUrl } from "@/lib/google/drive";

interface FileViewerProps {
  file: DriveFile | null;
}

export function FileViewer({ file }: FileViewerProps) {
  const { textContent, loading, fetchTextContent, clearContent } =
    useFilePreview();

  useEffect(() => {
    clearContent();
    if (file && isText(file)) {
      fetchTextContent(file);
    }
  }, [file, fetchTextContent, clearContent]);

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

  const previewUrl = getPreviewUrl(file);

  return (
    <div className="flex h-full flex-col">
      {/* File info bar */}
      <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {file.name}
            </p>
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

      {/* Preview content */}
      <div className="flex-1 overflow-hidden">
        {/* Google Docs / PDF — iframe embed */}
        {(isGoogleDoc(file) || isPdf(file)) && previewUrl ? (
          <iframe
            src={previewUrl}
            className="h-full w-full border-0"
            title={file.name}
            sandbox="allow-scripts allow-same-origin"
          />
        ) : /* Images */
        isImage(file) ? (
          <div className="flex h-full items-center justify-center bg-muted/20 p-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={file.thumbnailLink?.replace("=s220", "=s800") || ""}
              alt={file.name}
              className="max-h-full max-w-full rounded-md object-contain shadow-lg"
            />
          </div>
        ) : /* Text files */
        isText(file) ? (
          loading ? (
            <LoadingSpinner className="py-12" text="Loading file content..." />
          ) : (
            <ScrollArea className="h-full">
              <pre className="whitespace-pre-wrap p-4 font-mono text-sm text-foreground">
                {textContent || "Unable to load file content."}
              </pre>
            </ScrollArea>
          )
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
