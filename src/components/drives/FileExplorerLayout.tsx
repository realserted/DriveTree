"use client";

import { useState, useEffect, useCallback } from "react";
import { FileTree } from "./FileTree";
import { FileViewer } from "./FileViewer";
import { useDriveFiles } from "@/hooks/useDriveFiles";
import type { FileTreeNode } from "@/types/drive";
import type { DriveFile } from "@/types/drive";
import { cn } from "@/lib/utils";

export function FileExplorerLayout() {
  const { tree, loading, error, loadRoot, toggleFolder } = useDriveFiles();
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);
  const [loadingFolderId, setLoadingFolderId] = useState<string | undefined>();
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    loadRoot();
  }, [loadRoot]);

  const handleToggleFolder = useCallback(
    async (nodeId: string) => {
      setLoadingFolderId(nodeId);
      await toggleFolder(nodeId);
      setLoadingFolderId(undefined);
    },
    [toggleFolder]
  );

  const handleSelectFile = useCallback((node: FileTreeNode) => {
    setSelectedFile(node.file);
  }, []);

  // Resize handler
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const startX = e.clientX;
    const startWidth = sidebarWidth;

    function onMouseMove(e: MouseEvent) {
      const delta = e.clientX - startX;
      const newWidth = Math.max(240, Math.min(600, startWidth + delta));
      setSidebarWidth(newWidth);
    }

    function onMouseUp() {
      setIsResizing(false);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }, [sidebarWidth]);

  return (
    <div className="flex h-full overflow-hidden rounded-xl border border-border/60 bg-card">
      {/* Left: File Tree */}
      <div
        className="flex-shrink-0 border-r border-border/40"
        style={{ width: `${sidebarWidth}px` }}
      >
        <FileTree
          tree={tree}
          loading={loading}
          error={error}
          selectedId={selectedFile?.id}
          loadingId={loadingFolderId}
          onToggleFolder={handleToggleFolder}
          onSelectFile={handleSelectFile}
        />
      </div>

      {/* Resize handle */}
      <div
        className={cn(
          "w-1 cursor-col-resize bg-transparent transition-colors hover:bg-primary/20",
          isResizing && "bg-primary/30"
        )}
        onMouseDown={handleMouseDown}
      />

      {/* Right: File Viewer */}
      <div className="flex-1 overflow-hidden">
        <FileViewer file={selectedFile} />
      </div>
    </div>
  );
}
