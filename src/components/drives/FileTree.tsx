"use client";

import { useState, useMemo } from "react";
import { Search, FolderTree } from "lucide-react";
import { ScrollArea } from "@/components/ui/primitives";
import { FileTreeNodeComponent } from "./FileTreeNode";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { FileTreeNode } from "@/types/drive";
import { cn } from "@/lib/utils";

interface FileTreeProps {
  tree: FileTreeNode[];
  loading: boolean;
  error: string | null;
  selectedId?: string;
  loadingId?: string;
  onToggleFolder: (nodeId: string) => void;
  onSelectFile: (node: FileTreeNode) => void;
}

function filterTree(nodes: FileTreeNode[], query: string): FileTreeNode[] {
  if (!query) return nodes;
  const lower = query.toLowerCase();
  return nodes.reduce<FileTreeNode[]>((acc, node) => {
    const nameMatch = node.file.name.toLowerCase().includes(lower);
    const filteredChildren = filterTree(node.children, query);
    if (nameMatch || filteredChildren.length > 0) {
      acc.push({
        ...node,
        children: filteredChildren,
        isExpanded: filteredChildren.length > 0 ? true : node.isExpanded,
      });
    }
    return acc;
  }, []);
}

export function FileTree({
  tree,
  loading,
  error,
  selectedId,
  loadingId,
  onToggleFolder,
  onSelectFile,
}: FileTreeProps) {
  const [search, setSearch] = useState("");

  const filteredTree = useMemo(
    () => filterTree(tree, search),
    [tree, search]
  );

  return (
    <div className="flex h-full flex-col">
      {/* Search */}
      <div className="border-b border-border/40 p-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files..."
            className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Tree content */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {loading && tree.length === 0 ? (
            <LoadingSpinner className="py-12" text="Loading your Drive..." />
          ) : error ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          ) : filteredTree.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <FolderTree className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                {search ? "No files match your search" : "No files found"}
              </p>
            </div>
          ) : (
            filteredTree.map((node) => (
              <FileTreeNodeComponent
                key={node.file.id}
                node={node}
                selectedId={selectedId}
                loadingId={loadingId}
                onToggleFolder={onToggleFolder}
                onSelectFile={onSelectFile}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
