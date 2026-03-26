import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAccessToken } from "@/lib/google/oauth";
// @ts-expect-error — html-to-docx lacks TS types
import HTMLtoDOCX from "html-to-docx";

const DRIVE_API = "https://www.googleapis.com/drive/v3";

/**
 * POST /api/drive/edit
 *
 * Unified edit endpoint. Expects JSON body with an `action` field:
 *   - updateFileContent: overwrite file content (text or base64 binary)
 *   - updateDocx: convert HTML to DOCX and overwrite file
 *   - importToGoogle: create a Google-native copy for in-browser editing
 *   - syncPdfEdit: export temp Google Doc as PDF, overwrite original, delete temp
 *   - syncCsvEdit: export temp Google Sheet as CSV, overwrite original, delete temp
 */
export async function POST(request: NextRequest) {
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

  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const action = body.action as string;

  switch (action) {
    case "updateFileContent":
      return handleUpdateFileContent(headers, body);
    case "updateDocx":
      return handleUpdateDocx(headers, body);
    case "importToGoogle":
      return handleImportToGoogle(headers, body);
    case "syncPdfEdit":
      return handleSyncPdfEdit(headers, body);
    case "syncCsvEdit":
      return handleSyncCsvEdit(headers, body);
    case "deleteTempFile":
      return handleDeleteTempFile(headers, body);
    default:
      return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  }
}

/* ── Update file content (text or base64 binary) ─────────────────────────── */

async function handleUpdateFileContent(
  headers: Record<string, string>,
  params: Record<string, unknown>
) {
  const fileId = params.fileId as string;
  const content = params.content as string;
  const mimeType = (params.mimeType as string) || "text/plain";
  const isBase64 = (params.isBase64 as boolean) || false;

  if (!fileId || content === undefined) {
    return NextResponse.json({ error: "Missing fileId or content." }, { status: 400 });
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(fileId)) {
    return NextResponse.json({ error: "Invalid file ID." }, { status: 400 });
  }

  const bodyData = isBase64 ? Buffer.from(content, "base64") : content;

  const res = await fetch(
    `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
    {
      method: "PATCH",
      headers: {
        ...headers,
        "Content-Type": mimeType,
        ...(isBase64 ? { "Content-Length": String((bodyData as Buffer).length) } : {}),
      },
      body: bodyData,
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("Drive file update failed:", err);
    return NextResponse.json({ error: "Failed to update file." }, { status: res.status });
  }

  return NextResponse.json(await res.json());
}

/* ── Update DOCX (HTML → DOCX conversion) ────────────────────────────────── */

async function handleUpdateDocx(
  headers: Record<string, string>,
  params: Record<string, unknown>
) {
  const fileId = params.fileId as string;
  const html = params.html as string;

  if (!fileId || !html) {
    return NextResponse.json({ error: "Missing fileId or html." }, { status: 400 });
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(fileId)) {
    return NextResponse.json({ error: "Invalid file ID." }, { status: 400 });
  }

  const fullHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #000; }
table { border-collapse: collapse; width: 100%; }
td, th { border: 1px solid #ccc; padding: 6px 10px; }
</style></head><body>${html}</body></html>`;

  const docxResult = await HTMLtoDOCX(fullHtml, null, {
    table: { row: { cantSplit: true } },
    footer: false,
    header: false,
  });

  const bodyData = Buffer.isBuffer(docxResult)
    ? docxResult
    : Buffer.from(await (docxResult as Blob).arrayBuffer());

  const res = await fetch(
    `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
    {
      method: "PATCH",
      headers: {
        ...headers,
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Length": String(bodyData.length),
      },
      body: new Uint8Array(bodyData),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("Drive docx update failed:", err);
    return NextResponse.json({ error: "Failed to update document." }, { status: res.status });
  }

  return NextResponse.json(await res.json());
}

/* ── Import to Google-native format for in-browser editing ────────────────── */

async function handleImportToGoogle(
  headers: Record<string, string>,
  params: Record<string, unknown>
) {
  const fileId = params.fileId as string;
  const mimeType = params.mimeType as string;
  const fileName = params.fileName as string;

  if (!fileId || !mimeType) {
    return NextResponse.json({ error: "Missing fileId or mimeType." }, { status: 400 });
  }

  const conversionMap: Record<string, { googleMime: string; editorBase: string }> = {
    "text/csv": {
      googleMime: "application/vnd.google-apps.spreadsheet",
      editorBase: "https://docs.google.com/spreadsheets/d",
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      googleMime: "application/vnd.google-apps.document",
      editorBase: "https://docs.google.com/document/d",
    },
    "application/msword": {
      googleMime: "application/vnd.google-apps.document",
      editorBase: "https://docs.google.com/document/d",
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
      googleMime: "application/vnd.google-apps.spreadsheet",
      editorBase: "https://docs.google.com/spreadsheets/d",
    },
    "application/vnd.ms-excel": {
      googleMime: "application/vnd.google-apps.spreadsheet",
      editorBase: "https://docs.google.com/spreadsheets/d",
    },
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
      googleMime: "application/vnd.google-apps.presentation",
      editorBase: "https://docs.google.com/presentation/d",
    },
    "application/vnd.ms-powerpoint": {
      googleMime: "application/vnd.google-apps.presentation",
      editorBase: "https://docs.google.com/presentation/d",
    },
    "application/pdf": {
      googleMime: "application/vnd.google-apps.document",
      editorBase: "https://docs.google.com/document/d",
    },
  };

  const conversion = conversionMap[mimeType];
  if (!conversion) {
    return NextResponse.json(
      { error: "Unsupported file type for Google import." },
      { status: 400 }
    );
  }

  const cleanName = fileName ? fileName.replace(/\.[^.]+$/, "") : fileId;
  const editName = `${cleanName} (Edit)`;

  // Check for existing edit copy to avoid duplicates
  const searchQ = `name='${editName.replace(/'/g, "\\'")}' and mimeType='${conversion.googleMime}' and trashed=false`;
  const listRes = await fetch(
    `${DRIVE_API}/files?q=${encodeURIComponent(searchQ)}&fields=files(id)&pageSize=1`,
    { headers }
  );

  if (listRes.ok) {
    const listData = await listRes.json();
    if (listData.files?.length > 0) {
      const editorUrl = `${conversion.editorBase}/${listData.files[0].id}/edit?hl=en`;
      return NextResponse.json({
        googleFileId: listData.files[0].id,
        editorUrl,
      });
    }
  }

  // Create new copy converted to Google native format
  const copyRes = await fetch(`${DRIVE_API}/files/${fileId}/copy`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      mimeType: conversion.googleMime,
      name: editName,
    }),
  });

  if (!copyRes.ok) {
    const err = await copyRes.json().catch(() => ({}));
    console.error("Drive import copy failed:", err);
    return NextResponse.json(
      { error: "Failed to import file to Google format." },
      { status: copyRes.status }
    );
  }

  const copied = await copyRes.json();
  const editorUrl = `${conversion.editorBase}/${copied.id}/edit?hl=en`;

  return NextResponse.json({ googleFileId: copied.id, editorUrl });
}

/* ── Sync PDF edit: export Google Doc as PDF → overwrite original → cleanup ── */

async function handleSyncPdfEdit(
  headers: Record<string, string>,
  params: Record<string, unknown>
) {
  const originalFileId = params.originalFileId as string;
  const googleDocId = params.googleDocId as string;

  if (!originalFileId || !googleDocId) {
    return NextResponse.json(
      { error: "Missing originalFileId or googleDocId." },
      { status: 400 }
    );
  }

  // 1. Export the Google Doc as PDF
  const exportRes = await fetch(
    `${DRIVE_API}/files/${googleDocId}/export?mimeType=${encodeURIComponent("application/pdf")}`,
    { headers }
  );
  if (!exportRes.ok) {
    return NextResponse.json(
      { error: "Failed to export edited document as PDF." },
      { status: exportRes.status }
    );
  }

  const pdfBuffer = Buffer.from(await exportRes.arrayBuffer());

  // 2. Overwrite the original PDF
  const updateRes = await fetch(
    `https://www.googleapis.com/upload/drive/v3/files/${originalFileId}?uploadType=media`,
    {
      method: "PATCH",
      headers: {
        ...headers,
        "Content-Type": "application/pdf",
        "Content-Length": String(pdfBuffer.length),
      },
      body: pdfBuffer,
    }
  );

  if (!updateRes.ok) {
    console.error("Failed to update original PDF");
    return NextResponse.json(
      { error: "Failed to save changes back to original PDF." },
      { status: updateRes.status }
    );
  }

  // 3. Delete the temporary Google Doc copy
  await fetch(`${DRIVE_API}/files/${googleDocId}`, {
    method: "DELETE",
    headers,
  }).catch(() => {});

  // 4. Return PDF as base64 for immediate preview
  const base64 = pdfBuffer.toString("base64");
  return NextResponse.json({ synced: true, base64, contentType: "application/pdf" });
}

/* ── Sync CSV edit: export Sheet as CSV → overwrite original → cleanup ────── */

async function handleSyncCsvEdit(
  headers: Record<string, string>,
  params: Record<string, unknown>
) {
  const originalFileId = params.originalFileId as string;
  const googleSheetId = params.googleSheetId as string;

  if (!originalFileId || !googleSheetId) {
    return NextResponse.json(
      { error: "Missing originalFileId or googleSheetId." },
      { status: 400 }
    );
  }

  // 1. Export the Google Sheet as CSV
  const exportRes = await fetch(
    `${DRIVE_API}/files/${googleSheetId}/export?mimeType=${encodeURIComponent("text/csv")}`,
    { headers }
  );
  if (!exportRes.ok) {
    return NextResponse.json(
      { error: "Failed to export edited sheet as CSV." },
      { status: exportRes.status }
    );
  }

  const csvText = await exportRes.text();

  // 2. Overwrite the original CSV
  const updateRes = await fetch(
    `https://www.googleapis.com/upload/drive/v3/files/${originalFileId}?uploadType=media`,
    {
      method: "PATCH",
      headers: { ...headers, "Content-Type": "text/csv" },
      body: csvText,
    }
  );

  if (!updateRes.ok) {
    console.error("Failed to update original CSV");
    return NextResponse.json(
      { error: "Failed to save changes back to original CSV." },
      { status: updateRes.status }
    );
  }

  // 3. Delete the temporary Google Sheet copy
  await fetch(`${DRIVE_API}/files/${googleSheetId}`, {
    method: "DELETE",
    headers,
  }).catch(() => {});

  // 4. Return CSV content for immediate preview
  return NextResponse.json({ synced: true, content: csvText });
}

/* ── Delete a temporary Google file (cleanup on cancel) ────────────────────── */

async function handleDeleteTempFile(
  headers: Record<string, string>,
  params: Record<string, unknown>
) {
  const fileId = params.fileId as string;
  if (!fileId || !/^[a-zA-Z0-9_-]+$/.test(fileId)) {
    return NextResponse.json({ error: "Invalid file ID." }, { status: 400 });
  }

  await fetch(`${DRIVE_API}/files/${fileId}`, {
    method: "DELETE",
    headers,
  }).catch(() => {});

  return NextResponse.json({ deleted: true });
}
