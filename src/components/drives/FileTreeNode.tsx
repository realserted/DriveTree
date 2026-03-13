"use client";

import {
  Folder,
  FolderOpen,
  FileText,
  FileSpreadsheet,
  Presentation,
  Image,
  File,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { FileTreeNode as TreeNode } from "@/types/drive";
import {
  GOOGLE_FOLDER_MIME,
  GOOGLE_DOC_MIME,
  GOOGLE_SHEET_MIME,
  GOOGLE_SLIDES_MIME,
} from "@/types/drive";

interface FileTreeNodeProps {
  node: TreeNode;
  depth?: number;
  selectedId?: string;
  loadingId?: string;
  onToggleFolder: (nodeId: string) => void;
  onSelectFile: (node: TreeNode) => void;
}

function getMimeIcon(mimeType: string) {
  if (mimeType === GOOGLE_FOLDER_MIME) return null; // handled separately
  if (mimeType === GOOGLE_DOC_MIME)
    return <FileText className="h-4 w-4 text-blue-500" />;
  if (mimeType === GOOGLE_SHEET_MIME)
    return <FileSpreadsheet className="h-4 w-4 text-emerald-500" />;
  if (mimeType === GOOGLE_SLIDES_MIME)
    return <Presentation className="h-4 w-4 text-amber-500" />;
  if (mimeType === "application/pdf")
    return <FileText className="h-4 w-4 text-red-400" />;
  if (mimeType.startsWith("image/"))
    return <Image className="h-4 w-4 text-purple-400" />;
  return <File className="h-4 w-4 text-muted-foreground" />;
}

export function FileTreeNodeComponent({
  node,
  depth = 0,
  selectedId,
  loadingId,
  onToggleFolder,
  onSelectFile,
}: FileTreeNodeProps) {
  const isFolder = node.file.mimeType === GOOGLE_FOLDER_MIME;
  const isSelected = selectedId === node.file.id;
  const isLoading = loadingId === node.file.id;

  function handleClick() {
    if (isFolder) {
      onToggleFolder(node.file.id);
    } else {
      onSelectFile(node);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          "flex w-full items-center gap-1.5 rounded-md py-1.5 pr-2 text-left text-sm transition-colors",
          isSelected
            ? "bg-tree-selected text-foreground"
            : "text-foreground/80 hover:bg-tree-hover"
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {/* Expand chevron */}
        {isFolder ? (
          isLoading ? (
            <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" />
          ) : (
            <ChevronRight
              className={cn(
                "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
                node.isExpanded && "rotate-90"
              )}
            />
          )
        ) : (
          <span className="w-3.5 shrink-0" />
        )}

        {/* Icon */}
        {isFolder ? (
          node.isExpanded ? (
            <FolderOpen className="h-4 w-4 shrink-0 text-amber-400" />
          ) : (
            <Folder className="h-4 w-4 shrink-0 text-amber-400" />
          )
        ) : (
          getMimeIcon(node.file.mimeType)
        )}

        {/* Name */}
        <span className="truncate">{node.file.name}</span>
      </button>

      {/* Children */}
      {isFolder && node.isExpanded && node.children.length > 0 && (
        <div className="animate-tree-expand overflow-hidden">
          {node.children.map((child) => (
            <FileTreeNodeComponent
              key={child.file.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              loadingId={loadingId}
              onToggleFolder={onToggleFolder}
              onSelectFile={onSelectFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}
