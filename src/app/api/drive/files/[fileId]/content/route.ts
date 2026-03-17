import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAccessToken } from "@/lib/google/oauth";
import {
  getFileContent,
  exportFile,
  getExportMimeType,
  copyAsGoogle,
  deleteFile,
  getGoogleMimeForOffice,
} from "@/lib/google/drive";

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

  // Validate fileId format
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

  const mimeType = request.nextUrl.searchParams.get("mimeType") || "";
  const format = request.nextUrl.searchParams.get("format") || "";

  try {
    // Office files requested as PDF: copy → convert to Google format → export as PDF → delete copy
    if (format === "pdf") {
      const googleMime = getGoogleMimeForOffice(mimeType);
      console.log("[content] format=pdf, mimeType=", mimeType, "googleMime=", googleMime);
      if (googleMime) {
        let tempId: string | null = null;
        try {
          tempId = await copyAsGoogle(accessToken, params.fileId, googleMime);
          const pdfRes = await exportFile(accessToken, tempId, "application/pdf");

          if (!pdfRes.ok) {
            return NextResponse.json(
              { error: "Failed to export as PDF" },
              { status: pdfRes.status }
            );
          }

          const body = await pdfRes.arrayBuffer();
          return new NextResponse(body, {
            headers: {
              "Content-Type": "application/pdf",
              "Cache-Control": "private, max-age=300",
            },
          });
        } finally {
          // Always clean up the temp file
          if (tempId) {
            deleteFile(accessToken, tempId).catch(() => {});
          }
        }
      }
    }

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
    console.error("[drive/content]", err);
    return NextResponse.json(
      { error: "Failed to get file content" },
      { status: 500 }
    );
  }
}
