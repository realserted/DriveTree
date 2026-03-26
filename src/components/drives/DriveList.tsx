"use client";

import { useState } from "react";
import Link from "next/link";
import { HardDrive, ExternalLink, Trash2, FolderOpen, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/primitives";
import { FolderPickerModal } from "./FolderPickerModal";
import { formatDate } from "@/lib/utils";
import type { ConnectedDrive } from "@/types/user";

interface DriveListProps {
  drives: ConnectedDrive[];
  onDisconnect: (driveId: string) => void;
  onDriveUpdated?: () => void;
}

export function DriveList({ drives, onDisconnect, onDriveUpdated }: DriveListProps) {
  const [folderModalDriveId, setFolderModalDriveId] = useState<string | null>(null);
  const activeDrive = drives.find((d) => d.id === folderModalDriveId);

  if (drives.length === 0) return null;

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Connected Drives
        </h3>
        {drives.map((drive) => (
          <div
            key={drive.id}
            className="rounded-xl border border-border/60 bg-card p-5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-blue-500/10 p-2.5">
                  <HardDrive className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{drive.google_email}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant={drive.is_active ? "success" : "destructive"}>
                      {drive.is_active ? "Active" : "Expired"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Last synced: {formatDate(drive.last_synced_at ?? undefined)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm" className="gap-1.5">
                  <Link href="/dashboard/drives">
                    Open File Tree
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDisconnect(drive.id)}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Folder info */}
            <div className="mt-4 flex items-center justify-between rounded-lg border border-border/40 bg-muted/20 px-3 py-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <FolderOpen className="h-4 w-4 shrink-0 text-amber-500" />
                <span className="text-sm text-foreground truncate">
                  {drive.root_folder_name || "Entire Drive"}
                </span>
                {drive.root_folder_id && (
                  <a
                    href={`https://drive.google.com/drive/folders/${drive.root_folder_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    title="Open in Google Drive"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFolderModalDriveId(drive.id)}
                className="gap-1.5 text-xs"
              >
                <Settings className="h-3.5 w-3.5" />
                Change Folder
              </Button>
            </div>
          </div>
        ))}
      </div>

      <FolderPickerModal
        open={!!folderModalDriveId}
        onOpenChange={(open) => {
          if (!open) setFolderModalDriveId(null);
        }}
        currentFolderName={activeDrive?.root_folder_name ?? null}
        onSaved={() => {
          setFolderModalDriveId(null);
          onDriveUpdated?.();
        }}
      />
    </>
  );
}
