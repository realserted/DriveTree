"use client";

import { useEffect, useState } from "react";
import {
  Copy,
  FileText,
  Loader2,
  AlertCircle,
  ExternalLink,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/primitives";
import { formatBytes, formatDate } from "@/lib/utils";
import type { DriveFile } from "@/types/drive";

interface DuplicateGroup {
  name: string;
  files: DriveFile[];
}

interface ScanResult {
  totalFiles: number;
  duplicateGroups: number;
  duplicates: DuplicateGroup[];
}

export default function DuplicatesPage() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runScan = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/drive/duplicates");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Scan failed");
      }
      setResult(await res.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runScan();
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Duplicate Finder
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Scan your Google Drive for files with identical names.
          </p>
        </div>
        <Button onClick={runScan} disabled={loading} className="gap-2">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          {loading ? "Scanning..." : "Re-scan"}
        </Button>
      </div>

      {/* Stats bar */}
      {result && !loading && (
        <div className="flex gap-4 rounded-lg border border-border/40 bg-card p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {result.totalFiles}
            </p>
            <p className="text-xs text-muted-foreground">Total files</p>
          </div>
          <div className="border-l border-border/40" />
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {result.duplicateGroups}
            </p>
            <p className="text-xs text-muted-foreground">Duplicate groups</p>
          </div>
          <div className="border-l border-border/40" />
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {result.duplicates.reduce((s, g) => s + g.files.length, 0)}
            </p>
            <p className="text-xs text-muted-foreground">Total duplicates</p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Scanning your Drive for duplicates...
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
          <div>
            <p className="text-sm font-medium text-destructive">Scan failed</p>
            <p className="text-xs text-muted-foreground">{error}</p>
          </div>
        </div>
      )}

      {/* No duplicates */}
      {result && !loading && result.duplicates.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <div className="rounded-2xl bg-emerald-500/10 p-4">
            <Copy className="h-8 w-8 text-emerald-500" />
          </div>
          <p className="text-sm font-medium text-foreground">
            No duplicates found
          </p>
          <p className="text-xs text-muted-foreground">
            Your Drive is clean — no files share the same name.
          </p>
        </div>
      )}

      {/* Duplicate groups */}
      {result &&
        !loading &&
        result.duplicates.map((group) => (
          <div
            key={group.name}
            className="rounded-lg border border-border/40 bg-card"
          >
            <div className="flex items-center gap-3 border-b border-border/40 px-4 py-3">
              <Copy className="h-4 w-4 text-amber-500" />
              <p className="text-sm font-medium text-foreground">
                {group.name}
              </p>
              <Badge variant="outline" className="text-[10px]">
                {group.files.length} copies
              </Badge>
            </div>
            <div className="divide-y divide-border/40">
              {group.files.map((file, idx) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between px-4 py-2.5"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="truncate text-sm text-foreground">
                        {file.name}
                        {idx === 0 && (
                          <span className="ml-2 text-[10px] font-medium text-emerald-600">
                            NEWEST
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatBytes(file.size)}</span>
                        <span>·</span>
                        <span>{formatDate(file.modifiedTime)}</span>
                      </div>
                    </div>
                  </div>
                  {file.webViewLink && (
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="shrink-0"
                    >
                      <a
                        href={file.webViewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
