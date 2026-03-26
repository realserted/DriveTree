"use client";

import { useState, useEffect, useCallback } from "react";
import { FolderOpen, Settings, ExternalLink } from "lucide-react";
import { FileTree } from "./FileTree";
import { FileViewer } from "./FileViewer";
import { FolderPickerModal } from "./FolderPickerModal";
import { useDriveFiles } from "@/hooks/useDriveFiles";
import { useConnectedDrive } from "@/hooks/useConnectedDrive";
import type { FileTreeNode } from "@/types/drive";
import type { DriveFile } from "@/types/drive";
import { cn } from "@/lib/utils";

export function FileExplorerLayout() {
  const { drive, loading: driveLoading, refetch: refetchDrive } = useConnectedDrive();
  const { tree, loading, error, loadRoot, toggleFolder } = useDriveFiles(
    drive?.root_folder_id
  );
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);
  const [loadingFolderId, setLoadingFolderId] = useState<string | undefined>();
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const [folderModalOpen, setFolderModalOpen] = useState(false);

  useEffect(() => {
    if (!driveLoading && drive) {
      loadRoot();
    }
  }, [driveLoading, drive, loadRoot]);

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

  const handleFolderSaved = useCallback(
    (_folderId: string | null, _folderName: string | null) => {
      refetchDrive();
      setSelectedFile(null);
    },
    [refetchDrive]
  );

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
    <>
      <div className="flex h-full overflow-hidden rounded-xl border border-border/60 bg-card">
        {/* Left: File Tree */}
        <div
          className="flex-shrink-0 border-r border-border/40 flex flex-col"
          style={{ width: `${sidebarWidth}px` }}
        >
          {/* Drive Folder Info */}
          <div className="border-b border-border/40 px-3 py-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <FolderOpen className="h-4 w-4 shrink-0 text-amber-500" />
                <span className="text-xs font-medium text-foreground truncate">
                  {drive?.root_folder_name || "Entire Drive"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {drive?.root_folder_id && (
                  <a
                    href={`https://drive.google.com/drive/folders/${drive.root_folder_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    title="Open in Google Drive"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                <button
                  onClick={() => setFolderModalOpen(true)}
                  className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Change Drive Folder"
                >
                  <Settings className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* File Tree */}
          <div className="flex-1 overflow-hidden">
            <FileTree
              tree={tree}
              loading={loading || driveLoading}
              error={error}
              selectedId={selectedFile?.id}
              loadingId={loadingFolderId}
              onToggleFolder={handleToggleFolder}
              onSelectFile={handleSelectFile}
            />
          </div>
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

      <FolderPickerModal
        open={folderModalOpen}
        onOpenChange={setFolderModalOpen}
        currentFolderName={drive?.root_folder_name ?? null}
        onSaved={handleFolderSaved}
      />
    </>
  );
}
