import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAccessToken } from "@/lib/google/oauth";
import { listAllFiles } from "@/lib/google/drive";
import type { DriveFile } from "@/types/drive";

export interface DuplicateGroup {
  name: string;
  files: DriveFile[];
}

export async function GET() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = await getAccessToken(user.id);
  if (!accessToken) {
    return NextResponse.json(
      { error: "No active Google Drive connection." },
      { status: 403 }
    );
  }

  try {
    const allFiles = await listAllFiles(accessToken);

    // Group files by name (case-insensitive)
    const nameMap = new Map<string, DriveFile[]>();
    for (const file of allFiles) {
      const key = file.name.toLowerCase().trim();
      const group = nameMap.get(key);
      if (group) {
        group.push(file);
      } else {
        nameMap.set(key, [file]);
      }
    }

    // Only keep groups with 2+ files
    const duplicates: DuplicateGroup[] = [];
    nameMap.forEach((files) => {
      if (files.length >= 2) {
        duplicates.push({
          name: files[0].name,
          files: files.sort(
            (a: DriveFile, b: DriveFile) =>
              new Date(b.modifiedTime ?? 0).getTime() -
              new Date(a.modifiedTime ?? 0).getTime()
          ),
        });
      }
    });

    // Sort groups by number of duplicates (most first)
    duplicates.sort((a, b) => b.files.length - a.files.length);

    return NextResponse.json({
      totalFiles: allFiles.length,
      duplicateGroups: duplicates.length,
      duplicates,
    });
  } catch (err: any) {
    console.error("[drive/duplicates]", err);
    return NextResponse.json(
      { error: "Failed to scan for duplicates" },
      { status: 500 }
    );
  }
}
