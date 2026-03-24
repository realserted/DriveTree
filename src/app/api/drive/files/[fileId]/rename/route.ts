import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAccessToken } from "@/lib/google/oauth";
import { renameFile } from "@/lib/google/drive";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(params.fileId)) {
    return NextResponse.json({ error: "Invalid file ID" }, { status: 400 });
  }

  const accessToken = await getAccessToken(user.id);
  if (!accessToken) {
    return NextResponse.json(
      { error: "No active Google Drive connection." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const newName = body.name?.trim();

    if (!newName || typeof newName !== "string" || newName.length > 255) {
      return NextResponse.json(
        { error: "Invalid file name" },
        { status: 400 }
      );
    }

    const updatedFile = await renameFile(accessToken, params.fileId, newName);
    return NextResponse.json(updatedFile);
  } catch (err: any) {
    console.error("[drive/rename]", err);
    return NextResponse.json(
      { error: "Failed to rename file" },
      { status: 500 }
    );
  }
}
