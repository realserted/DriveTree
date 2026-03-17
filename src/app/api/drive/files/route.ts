import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAccessToken } from "@/lib/google/oauth";
import { listFiles } from "@/lib/google/drive";

export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parentId =
    request.nextUrl.searchParams.get("parentId") || "root";

  // Validate parentId to prevent Drive API query injection
  if (!/^[a-zA-Z0-9_-]+$/.test(parentId) && parentId !== "root") {
    return NextResponse.json({ error: "Invalid parentId" }, { status: 400 });
  }

  const accessToken = await getAccessToken(user.id);
  if (!accessToken) {
    return NextResponse.json(
      { error: "No active Google Drive connection. Please reconnect." },
      { status: 403 }
    );
  }

  try {
    const data = await listFiles(accessToken, parentId);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[drive/files]", err);
    return NextResponse.json(
      { error: "Failed to list files" },
      { status: 500 }
    );
  }
}
