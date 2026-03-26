"use client";

import { useEffect, useState } from "react";
import { ConnectDriveCard } from "@/components/drives/ConnectDriveCard";
import { DriveList } from "@/components/drives/DriveList";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";
import type { ConnectedDrive } from "@/types/user";

export default function DashboardPage() {
  const { user } = useUser();
  const [drives, setDrives] = useState<ConnectedDrive[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();

    supabase
      .from("drivetree_connected_drives")
      .select("id, user_id, google_email, is_active, connected_at, last_synced_at, root_folder_id, root_folder_name")
      .eq("user_id", user.id)
      .then(({ data }) => {
        setDrives((data as ConnectedDrive[]) || []);
        setLoading(false);
      });
  }, [user]);

  async function handleDisconnect(driveId: string) {
    const supabase = createClient();
    await supabase.from("drivetree_connected_drives").delete().eq("id", driveId);
    setDrives((prev) => prev.filter((d) => d.id !== driveId));
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl font-bold text-foreground">
        Connect Drives
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Link your Google Drive to browse files as a tree.
      </p>

      <div className="mt-8 space-y-8">
        {loading ? (
          <LoadingSpinner className="py-12" text="Loading drives..." />
        ) : (
          <>
            <DriveList
              drives={drives}
              onDisconnect={handleDisconnect}
              onDriveUpdated={() => {
                const supabase = createClient();
                supabase
                  .from("drivetree_connected_drives")
                  .select("id, user_id, google_email, is_active, connected_at, last_synced_at, root_folder_id, root_folder_name")
                  .eq("user_id", user!.id)
                  .then(({ data }) => setDrives((data as ConnectedDrive[]) || []));
              }}
            />
            {drives.length === 0 && <ConnectDriveCard />}
          </>
        )}
      </div>
    </div>
  );
}
