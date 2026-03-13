"use client";

import { useState, useCallback } from "react";
import type { DriveFile } from "@/types/drive";
import { isText } from "@/types/drive";

export function useFilePreview() {
  const [textContent, setTextContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTextContent = useCallback(async (file: DriveFile) => {
    if (!isText(file)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/drive/files/${file.id}/content`);
      if (res.ok) {
        const text = await res.text();
        setTextContent(text);
      }
    } catch {
      setTextContent(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearContent = useCallback(() => {
    setTextContent(null);
  }, []);

  return { textContent, loading, fetchTextContent, clearContent };
}
