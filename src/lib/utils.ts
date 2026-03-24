import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number | string | undefined): string {
  if (!bytes) return "—";
  const b = typeof bytes === "string" ? parseInt(bytes, 10) : bytes;
  if (isNaN(b) || b === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(b) / Math.log(k));
  return `${parseFloat((b / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getFileExtension(name: string): string {
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

/**
 * Generate a smart file name from the original name and modification date.
 * Example: "Invoice.pdf" + "2026-03-08T..." → "2026-03-08_Invoice.pdf"
 */
export function generateSmartName(
  fileName: string,
  modifiedTime?: string
): string {
  const ext = getFileExtension(fileName);
  const baseName = ext
    ? fileName.slice(0, -(ext.length + 1))
    : fileName;

  // Clean the base name: trim, collapse spaces → underscores, remove risky chars
  const cleaned = baseName
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_\-().]/g, "");

  // Format the date prefix
  const date = modifiedTime ? new Date(modifiedTime) : new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const prefix = `${yyyy}-${mm}-${dd}`;

  return ext ? `${prefix}_${cleaned}.${ext}` : `${prefix}_${cleaned}`;
}
