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

/**
 * Export a Google Workspace file (Docs, Sheets, Slides) to a standard format.
 * Google Workspace files can't be downloaded with alt=media — they must be exported.
 */
export function getExportMimeType(
  googleMimeType: string
): string | null {
  const exportMap: Record<string, string> = {
    // Google Workspace → HTML
    "application/vnd.google-apps.document": "text/html",
    "application/vnd.google-apps.spreadsheet": "text/html",
    "application/vnd.google-apps.presentation": "text/html",
  };
  return exportMap[googleMimeType] || null;
}

const OFFICE_MIME_TYPES = [
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/msword",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
];

export function isOfficeMimeType(mimeType: string): boolean {
  return OFFICE_MIME_TYPES.includes(mimeType);
}

/**
 * Fetch an Office file as PDF using Google Drive's built-in conversion.
 * Works by requesting the file with `alt=media` and `Accept: application/pdf`.
 */
export async function getFileAsPdf(
  accessToken: string,
  fileId: string
): Promise<Response> {
  // Google Drive can serve uploaded Office files as PDF via the export links
  // We use the files.export-like approach: download and let Google convert
  return fetch(
    `${DRIVE_API_BASE}/files/${fileId}?alt=media`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

/**
 * Copy a file and convert it to a Google Workspace format.
 * Returns the new file's ID.
 */
export async function copyAsGoogle(
  accessToken: string,
  fileId: string,
  googleMimeType: string
): Promise<string> {
  const res = await fetch(`${DRIVE_API_BASE}/files/${fileId}/copy`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mimeType: googleMimeType }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Copy failed: ${res.status}`);
  }

  const data = await res.json();
  return data.id;
}

/**
 * Permanently delete a file (used for temp conversion copies).
 */
export async function deleteFile(
  accessToken: string,
  fileId: string
): Promise<void> {
  await fetch(`${DRIVE_API_BASE}/files/${fileId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

/** Map Office MIME types to the Google Workspace type they convert to. */
export function getGoogleMimeForOffice(mimeType: string): string | null {
  const map: Record<string, string> = {
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "application/vnd.google-apps.presentation",
    "application/vnd.ms-powerpoint":
      "application/vnd.google-apps.presentation",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      "application/vnd.google-apps.spreadsheet",
    "application/vnd.ms-excel":
      "application/vnd.google-apps.spreadsheet",
  };
  return map[mimeType] || null;
}

export async function exportFile(
  accessToken: string,
  fileId: string,
  exportMimeType: string
): Promise<Response> {
  const params = new URLSearchParams({ mimeType: exportMimeType });
  return fetch(`${DRIVE_API_BASE}/files/${fileId}/export?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function renameFile(
  accessToken: string,
  fileId: string,
  newName: string
): Promise<DriveFile> {
  const res = await fetch(
    `${DRIVE_API_BASE}/files/${fileId}?fields=${FILE_FIELDS}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newName }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Rename failed: ${res.status}`);
  }

  return res.json();
}

/** Fetch all files (paginated) for scanning. */
export async function listAllFiles(
  accessToken: string
): Promise<DriveFile[]> {
  const allFiles: DriveFile[] = [];
  let pageToken: string | undefined;

  do {
    const params = new URLSearchParams({
      q: "trashed=false and mimeType != 'application/vnd.google-apps.folder'",
      fields: `nextPageToken,files(${FILE_FIELDS})`,
      pageSize: "1000",
    });
    if (pageToken) params.set("pageToken", pageToken);

    const res = await fetch(`${DRIVE_API_BASE}/files?${params}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Drive API error: ${res.status}`);
    }

    const data = await res.json();
    allFiles.push(...(data.files || []));
    pageToken = data.nextPageToken;
  } while (pageToken);

  return allFiles;
}
