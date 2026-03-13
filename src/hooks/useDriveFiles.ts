"use client";

import { useState, useCallback } from "react";
import type { DriveFile, FileTreeNode } from "@/types/drive";
import { GOOGLE_FOLDER_MIME } from "@/types/drive";

export function useDriveFiles() {
  const [tree, setTree] = useState<FileTreeNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChildren = useCallback(
    async (parentId: string = "root"): Promise<DriveFile[]> => {
      const res = await fetch(
        `/api/drive/files?parentId=${encodeURIComponent(parentId)}`
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to fetch files");
      }
      const data = await res.json();
      return data.files;
    },
    []
  );

  const loadRoot = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const files = await fetchChildren("root");
      const nodes: FileTreeNode[] = files.map((file) => ({
        file,
        children: [],
        isLoaded: false,
        isExpanded: false,
      }));
      setTree(nodes);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchChildren]);

  const toggleFolder = useCallback(
    async (nodeId: string) => {
      const updateNodes = async (
        nodes: FileTreeNode[]
      ): Promise<FileTreeNode[]> => {
        const result: FileTreeNode[] = [];
        for (const node of nodes) {
          if (node.file.id === nodeId) {
            if (
              !node.isLoaded &&
              node.file.mimeType === GOOGLE_FOLDER_MIME
            ) {
              // Fetch children on first expand
              const files = await fetchChildren(node.file.id);
              const children: FileTreeNode[] = files.map((f) => ({
                file: f,
                children: [],
                isLoaded: false,
                isExpanded: false,
              }));
              result.push({
                ...node,
                children,
                isLoaded: true,
                isExpanded: true,
              });
            } else {
              result.push({ ...node, isExpanded: !node.isExpanded });
            }
          } else {
            result.push({
              ...node,
              children: await updateNodes(node.children),
            });
          }
        }
        return result;
      };

      setTree((prev) => {
        updateNodes(prev).then(setTree);
        return prev;
      });
    },
    [fetchChildren]
  );

  return { tree, loading, error, loadRoot, toggleFolder };
}
