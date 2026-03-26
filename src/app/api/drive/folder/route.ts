import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAccessToken } from "@/lib/google/oauth";
import { getFile } from "@/lib/google/drive";
import { GOOGLE_FOLDER_MIME } from "@/types/drive";

/**
 * PUT /api/drive/folder
 * Set the root folder for the user's connected drive.
 * Accepts { folderId: string } — validates it exists and is a folder.
 */
export async function PUT(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { folderId: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { folderId } = body;
  if (!folderId || !/^[a-zA-Z0-9_-]+$/.test(folderId)) {
    return NextResponse.json({ error: "Invalid folder ID." }, { status: 400 });
  }

  const accessToken = await getAccessToken(user.id);
  if (!accessToken) {
    return NextResponse.json(
      { error: "No active Google Drive connection." },
      { status: 403 }
    );
  }

  // Validate the folder exists and is actually a folder
  try {
    const file = await getFile(accessToken, folderId);
    if (file.mimeType !== GOOGLE_FOLDER_MIME) {
      return NextResponse.json(
        { error: "The provided ID is not a folder." },
        { status: 400 }
      );
    }

    // Update the connected drive with the folder
    const { error: updateError } = await supabase
      .from("drivetree_connected_drives")
      .update({
        root_folder_id: folderId,
        root_folder_name: file.name,
      })
      .eq("user_id", user.id)
      .eq("is_active", true);

    if (updateError) {
      console.error("Failed to update folder:", updateError);
      return NextResponse.json(
        { error: "Failed to save folder selection." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      root_folder_id: folderId,
      root_folder_name: file.name,
    });
  } catch (err: any) {
    console.error("[drive/folder] validation error:", err);
    return NextResponse.json(
      { error: "Folder not found or not accessible." },
      { status: 404 }
    );
  }
}

/**
 * DELETE /api/drive/folder
 * Reset to browsing the entire Drive (clear root folder selection).
 */
export async function DELETE() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error: updateError } = await supabase
    .from("drivetree_connected_drives")
    .update({
      root_folder_id: null,
      root_folder_name: null,
    })
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (updateError) {
    console.error("Failed to reset folder:", updateError);
    return NextResponse.json(
      { error: "Failed to reset folder." },
      { status: 500 }
    );
  }

  return NextResponse.json({ root_folder_id: null, root_folder_name: null });
}
