"use client";

import Link from "next/link";
import { HardDrive, ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/primitives";
import { formatDate } from "@/lib/utils";
import type { ConnectedDrive } from "@/types/user";

interface DriveListProps {
  drives: ConnectedDrive[];
  onDisconnect: (driveId: string) => void;
}

export function DriveList({ drives, onDisconnect }: DriveListProps) {
  if (drives.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">
        Connected Drives
      </h3>
      {drives.map((drive) => (
        <div
          key={drive.id}
          className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
        >
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
      ))}
    </div>
  );
}
