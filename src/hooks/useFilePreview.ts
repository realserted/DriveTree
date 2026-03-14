"use client";

import { useState, useCallback, useRef } from "react";
import mammoth from "mammoth";
import type { DriveFile } from "@/types/drive";
import { isText, isGoogleDoc, isPdf, isImage, isOfficeDoc } from "@/types/drive";

export type PreviewType = "text" | "html" | "pdf" | "image" | null;

export function useFilePreview() {
  const [content, setContent] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<PreviewType>(null);
  const [loading, setLoading] = useState(false);
  const blobUrlRef = useRef<string | null>(null);

  const clearContent = useCallback(() => {
    setContent(null);
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    setBlobUrl(null);
    setPreviewType(null);
  }, []);

  const fetchPreview = useCallback(async (file: DriveFile) => {
    setLoading(true);
    setContent(null);
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    setBlobUrl(null);
    setPreviewType(null);

    try {
      const url = `/api/drive/files/${file.id}/content?mimeType=${encodeURIComponent(file.mimeType)}`;
      const res = await fetch(url);

      if (!res.ok) {
        setContent(null);
        return;
      }

      if (isGoogleDoc(file)) {
        const html = await res.text();
        setContent(html);
        setPreviewType("html");
      } else if (isOfficeDoc(file)) {
        // Convert .docx/.xlsx/.pptx to HTML client-side
        const arrayBuffer = await res.arrayBuffer();
        if (
          file.mimeType ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.mimeType === "application/msword"
        ) {
          const result = await mammoth.convertToHtml({ arrayBuffer });
          setContent(result.value);
          setPreviewType("html");
        } else {
          // For .xlsx/.pptx without a converter, show as PDF fallback
          // or show "not available" — for now, signal html with a message
          setContent(null);
          setPreviewType(null);
        }
      } else if (isPdf(file)) {
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        blobUrlRef.current = objectUrl;
        setBlobUrl(objectUrl);
        setPreviewType("pdf");
      } else if (isImage(file)) {
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        blobUrlRef.current = objectUrl;
        setBlobUrl(objectUrl);
        setPreviewType("image");
      } else if (isText(file)) {
        const text = await res.text();
        setContent(text);
        setPreviewType("text");
      }
    } catch {
      setContent(null);
      setBlobUrl(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const textContent = content;
  const fetchTextContent = fetchPreview;

  return {
    content,
    textContent,
    blobUrl,
    previewType,
    loading,
    fetchPreview,
    fetchTextContent,
    clearContent,
  };
}
