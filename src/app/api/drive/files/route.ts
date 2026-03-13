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
    return NextResponse.json(
      { error: err.message || "Failed to list files" },
      { status: 500 }
    );
  }
}
