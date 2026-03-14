"use client";

import { useState, useCallback, useRef } from "react";
import mammoth from "mammoth";
import type { DriveFile } from "@/types/drive";
import { isText, isGoogleDoc, isPdf, isImage, isOfficeDoc, isVideo } from "@/types/drive";

export type PreviewType = "text" | "html" | "pdf" | "image" | "video" | "iframe" | null;

const WORD_MIMES = [
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

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
      // .pptx/.xlsx/.xls/.ppt — convert to PDF server-side for slide navigation
      if (isOfficeDoc(file) && !WORD_MIMES.includes(file.mimeType)) {
        const pdfUrl = `/api/drive/files/${file.id}/content?mimeType=${encodeURIComponent(file.mimeType)}&format=pdf`;
        const res = await fetch(pdfUrl);
        if (res.ok) {
          const blob = await res.blob();
          const objectUrl = URL.createObjectURL(blob);
          blobUrlRef.current = objectUrl;
          setBlobUrl(objectUrl);
          setPreviewType("pdf");
        } else {
          // Fallback to thumbnail if conversion fails
          const thumbRes = await fetch(`/api/drive/files/${file.id}/thumbnail`);
          if (thumbRes.ok) {
            const blob = await thumbRes.blob();
            const objectUrl = URL.createObjectURL(blob);
            blobUrlRef.current = objectUrl;
            setBlobUrl(objectUrl);
            setPreviewType("image");
          }
        }
        return;
      }

      // Video — fetch blob and use <video> tag
      if (isVideo(file)) {
        const url = `/api/drive/files/${file.id}/content?mimeType=${encodeURIComponent(file.mimeType)}`;
        const res = await fetch(url);
        if (!res.ok) return;
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        blobUrlRef.current = objectUrl;
        setBlobUrl(objectUrl);
        setPreviewType("video");
        return;
      }

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
        // .docx/.doc — convert to HTML with mammoth
        const arrayBuffer = await res.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setContent(result.value);
        setPreviewType("html");
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
