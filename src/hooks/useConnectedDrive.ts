"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";
import type { ConnectedDrive } from "@/types/user";

export function useConnectedDrive() {
  const { user } = useUser();
  const [drive, setDrive] = useState<ConnectedDrive | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDrive = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("drivetree_connected_drives")
      .select(
        "id, user_id, google_email, is_active, connected_at, last_synced_at, root_folder_id, root_folder_name"
      )
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single();

    setDrive(data as ConnectedDrive | null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchDrive();
  }, [fetchDrive]);

  return { drive, loading, refetch: fetchDrive };
}
