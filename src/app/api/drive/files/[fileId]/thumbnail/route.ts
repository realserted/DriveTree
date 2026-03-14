import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAccessToken } from "@/lib/google/oauth";

const DRIVE_API_BASE = "https://www.googleapis.com/drive/v3";

export async function GET(
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

  const accessToken = await getAccessToken(user.id);
  if (!accessToken) {
    return NextResponse.json(
      { error: "No active Google Drive connection." },
      { status: 403 }
    );
  }

  try {
    // Get file metadata with thumbnailLink
    const res = await fetch(
      `${DRIVE_API_BASE}/files/${params.fileId}?fields=thumbnailLink`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to get file metadata" },
        { status: res.status }
      );
    }

    const data = await res.json();
    if (!data.thumbnailLink) {
      return NextResponse.json(
        { error: "No thumbnail available" },
        { status: 404 }
      );
    }

    // Fetch the actual thumbnail image (requires auth)
    const thumbUrl = data.thumbnailLink.replace(/=s\d+/, "=s1600");
    const thumbRes = await fetch(thumbUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!thumbRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch thumbnail" },
        { status: thumbRes.status }
      );
    }

    const body = await thumbRes.arrayBuffer();
    const contentType =
      thumbRes.headers.get("content-type") || "image/png";

    return new NextResponse(body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=600",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to get thumbnail" },
      { status: 500 }
    );
  }
}
