import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAccessToken } from "@/lib/google/oauth";
import { getFile } from "@/lib/google/drive";

export async function GET(
  _request: NextRequest,
  { params }: { params: { fileId: string } }
) {
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
    const file = await getFile(accessToken, params.fileId);
    return NextResponse.json(file);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to get file" },
      { status: 500 }
    );
  }
}
