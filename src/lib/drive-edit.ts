/**
 * Client-side proxy functions for the /api/drive/edit endpoint.
 * Each function calls the unified edit route with a specific action.
 */

async function callEditApi(body: Record<string, unknown>) {
  const res = await fetch("/api/drive/edit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res;
}

/** Update a file's text content (CSV, plain text, etc.) */
export async function updateFileContent(
  fileId: string,
  content: string,
  mimeType: string = "text/plain"
): Promise<{ ok: boolean; error?: string }> {
  const res = await callEditApi({
    action: "updateFileContent",
    fileId,
    content,
    mimeType,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return { ok: false, error: err.error || "Failed to save" };
  }
  return { ok: true };
}

/** Update a DOCX file from HTML content */
export async function updateDocx(
  fileId: string,
  html: string
): Promise<{ ok: boolean; error?: string }> {
  const res = await callEditApi({
    action: "updateDocx",
    fileId,
    html,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return { ok: false, error: err.error || "Failed to save document" };
  }
  return { ok: true };
}

/** Import a file to Google-native format for editing in iframe */
export async function importToGoogleFormat(
  fileId: string,
  mimeType: string,
  fileName: string
): Promise<{ googleFileId: string; editorUrl: string } | null> {
  const res = await callEditApi({
    action: "importToGoogle",
    fileId,
    mimeType,
    fileName,
  });
  if (!res.ok) return null;
  return res.json();
}

/** Sync PDF edit: export Google Doc → PDF, overwrite original, cleanup temp */
export async function syncPdfEdit(
  originalFileId: string,
  googleDocId: string
): Promise<{ blobUrl: string } | null> {
  const res = await callEditApi({
    action: "syncPdfEdit",
    originalFileId,
    googleDocId,
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (data.base64) {
    const bytes = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
    const blob = new Blob([bytes], { type: "application/pdf" });
    return { blobUrl: URL.createObjectURL(blob) };
  }
  return null;
}

/** Sync CSV edit: export Google Sheet → CSV, overwrite original, cleanup temp */
export async function syncCsvEdit(
  originalFileId: string,
  googleSheetId: string
): Promise<{ content: string } | null> {
  const res = await callEditApi({
    action: "syncCsvEdit",
    originalFileId,
    googleSheetId,
  });
  if (!res.ok) return null;
  const data = await res.json();
  return { content: data.content };
}

/** Delete a temporary Google file (cleanup on cancel) */
export async function deleteTempFile(fileId: string): Promise<void> {
  await callEditApi({ action: "deleteTempFile", fileId }).catch(() => {});
}

/** Get the Google editor URL for a native Google Workspace file */
export function getGoogleEditorUrl(fileId: string, mimeType: string): string | null {
  const editorMap: Record<string, string> = {
    "application/vnd.google-apps.document": `https://docs.google.com/document/d/${fileId}/edit`,
    "application/vnd.google-apps.spreadsheet": `https://docs.google.com/spreadsheets/d/${fileId}/edit`,
    "application/vnd.google-apps.presentation": `https://docs.google.com/presentation/d/${fileId}/edit`,
  };
  return editorMap[mimeType] || null;
}
