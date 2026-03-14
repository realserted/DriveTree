import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAccessToken } from "@/lib/google/oauth";
import { getFileContent, exportFile, getExportMimeType } from "@/lib/google/drive";

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

  const mimeType = request.nextUrl.searchParams.get("mimeType") || "";

  try {
    // Google Workspace files need to be exported, not downloaded
    const exportMime = getExportMimeType(mimeType);
    const response = exportMime
      ? await exportFile(accessToken, params.fileId, exportMime)
      : await getFileContent(accessToken, params.fileId);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch file content" },
        { status: response.status }
      );
    }

    const contentType =
      response.headers.get("content-type") || "application/octet-stream";
    const body = await response.arrayBuffer();

    return new NextResponse(body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to get file content" },
      { status: 500 }
    );
  }
}
