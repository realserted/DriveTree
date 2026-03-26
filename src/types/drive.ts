export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  parents?: string[];
  size?: string;
  modifiedTime?: string;
  iconLink?: string;
  thumbnailLink?: string;
  webViewLink?: string;
  webContentLink?: string;
}

export interface FileTreeNode {
  file: DriveFile;
  children: FileTreeNode[];
  isLoaded: boolean;
  isExpanded: boolean;
}

export const GOOGLE_FOLDER_MIME = "application/vnd.google-apps.folder";
export const GOOGLE_DOC_MIME = "application/vnd.google-apps.document";
export const GOOGLE_SHEET_MIME = "application/vnd.google-apps.spreadsheet";
export const GOOGLE_SLIDES_MIME = "application/vnd.google-apps.presentation";

export function isFolder(file: DriveFile): boolean {
  return file.mimeType === GOOGLE_FOLDER_MIME;
}

export function isGoogleDoc(file: DriveFile): boolean {
  return [GOOGLE_DOC_MIME, GOOGLE_SHEET_MIME, GOOGLE_SLIDES_MIME].includes(
    file.mimeType
  );
}

export function isOfficeDoc(file: DriveFile): boolean {
  const officeTypes = [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",       // .xlsx
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
    "application/msword",                    // .doc
    "application/vnd.ms-excel",              // .xls
    "application/vnd.ms-powerpoint",         // .ppt
  ];
  return officeTypes.includes(file.mimeType);
}

export function isVideo(file: DriveFile): boolean {
  return file.mimeType.startsWith("video/");
}

export function isImage(file: DriveFile): boolean {
  return file.mimeType.startsWith("image/");
}

export function isPdf(file: DriveFile): boolean {
  return file.mimeType === "application/pdf";
}

export function isCsv(file: DriveFile): boolean {
  return (
    file.mimeType === "text/csv" ||
    file.name.toLowerCase().endsWith(".csv")
  );
}

export function isWordDoc(file: DriveFile): boolean {
  return (
    file.mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.mimeType === "application/msword"
  );
}

export function isText(file: DriveFile): boolean {
  const textTypes = [
    "text/plain",
    "text/csv",
    "text/markdown",
    "application/json",
    "text/html",
    "text/xml",
    "application/xml",
    "text/javascript",
    "application/javascript",
  ];
  return textTypes.includes(file.mimeType) || file.mimeType.startsWith("text/");
}
