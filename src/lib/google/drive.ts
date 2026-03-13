import type { DriveFile } from "@/types/drive";

const DRIVE_API_BASE = "https://www.googleapis.com/drive/v3";

const FILE_FIELDS =
  "id,name,mimeType,parents,size,modifiedTime,iconLink,thumbnailLink,webViewLink,webContentLink";

interface DriveListResponse {
  files: DriveFile[];
  nextPageToken?: string;
}

export async function listFiles(
  accessToken: string,
  parentId: string = "root",
  pageToken?: string
): Promise<DriveListResponse> {
  const params = new URLSearchParams({
    q: `'${parentId}' in parents and trashed=false`,
    fields: `nextPageToken,files(${FILE_FIELDS})`,
    orderBy: "folder,name",
    pageSize: "100",
  });

  if (pageToken) params.set("pageToken", pageToken);

  const res = await fetch(`${DRIVE_API_BASE}/files?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Drive API error: ${res.status}`);
  }

  return res.json();
}

export async function getFile(
  accessToken: string,
  fileId: string
): Promise<DriveFile> {
  const params = new URLSearchParams({ fields: FILE_FIELDS });

  const res = await fetch(`${DRIVE_API_BASE}/files/${fileId}?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Drive API error: ${res.status}`);
  }

  return res.json();
}

export async function getFileContent(
  accessToken: string,
  fileId: string
): Promise<Response> {
  return fetch(`${DRIVE_API_BASE}/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function getPreviewUrl(file: DriveFile): string | null {
  const { mimeType, id } = file;

  if (mimeType === "application/vnd.google-apps.document") {
    return `https://docs.google.com/document/d/${id}/preview`;
  }
  if (mimeType === "application/vnd.google-apps.spreadsheet") {
    return `https://docs.google.com/spreadsheets/d/${id}/preview`;
  }
  if (mimeType === "application/vnd.google-apps.presentation") {
    return `https://docs.google.com/presentation/d/${id}/preview`;
  }
  if (mimeType === "application/pdf") {
    return `https://drive.google.com/file/d/${id}/preview`;
  }

  return null;
}
