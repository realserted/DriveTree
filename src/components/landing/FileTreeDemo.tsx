"use client";

import { useState, useEffect } from "react";
import {
  Folder,
  FolderOpen,
  FileText,
  FileSpreadsheet,
  Image,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoNode {
  name: string;
  type: "folder" | "file";
  icon?: "pdf" | "sheet" | "image" | "doc";
  children?: DemoNode[];
}

const DEMO_TREE: DemoNode[] = [
  {
    name: "Clients",
    type: "folder",
    children: [
      { name: "Contract.pdf", type: "file", icon: "pdf" },
      { name: "Invoice_Q4.xlsx", type: "file", icon: "sheet" },
      { name: "Logo_Final.png", type: "file", icon: "image" },
    ],
  },
  {
    name: "Marketing",
    type: "folder",
    children: [
      { name: "Campaign_Brief.doc", type: "file", icon: "doc" },
      { name: "Ad_Creatives", type: "folder", children: [] },
    ],
  },
  {
    name: "Taxes",
    type: "folder",
    children: [{ name: "2025_Filing.pdf", type: "file", icon: "pdf" }],
  },
];

function FileIcon({ icon }: { icon?: string }) {
  switch (icon) {
    case "pdf":
      return <FileText className="h-4 w-4 text-red-400" />;
    case "sheet":
      return <FileSpreadsheet className="h-4 w-4 text-emerald-500" />;
    case "image":
      return <Image className="h-4 w-4 text-purple-400" />;
    case "doc":
      return <FileText className="h-4 w-4 text-blue-400" />;
    default:
      return <FileText className="h-4 w-4 text-muted-foreground" />;
  }
}

function DemoTreeNode({
  node,
  depth = 0,
  autoExpand,
}: {
  node: DemoNode;
  depth?: number;
  autoExpand?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (autoExpand) {
      const timer = setTimeout(() => setExpanded(true), depth * 400 + 600);
      return () => clearTimeout(timer);
    }
  }, [autoExpand, depth]);

  const isFolder = node.type === "folder";

  return (
    <div>
      <button
        onClick={() => isFolder && setExpanded(!expanded)}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
          isFolder
            ? "cursor-pointer hover:bg-tree-hover"
            : "cursor-default text-muted-foreground hover:bg-tree-hover"
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {isFolder ? (
          <>
            <ChevronRight
              className={cn(
                "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                expanded && "rotate-90"
              )}
            />
            {expanded ? (
              <FolderOpen className="h-4 w-4 text-amber-400" />
            ) : (
              <Folder className="h-4 w-4 text-amber-400" />
            )}
          </>
        ) : (
          <>
            <span className="w-3.5" />
            <FileIcon icon={node.icon} />
          </>
        )}
        <span className="truncate">{node.name}</span>
      </button>

      {isFolder && expanded && node.children && (
        <div className="animate-tree-expand overflow-hidden">
          {node.children.map((child) => (
            <DemoTreeNode
              key={child.name}
              node={child}
              depth={depth + 1}
              autoExpand={autoExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTreeDemo() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Find Files Instantly
          </h2>
          <p className="mt-3 text-muted-foreground sm:text-lg">
            Your entire Google Drive — one collapsible tree.
          </p>
        </div>

        {/* Demo card */}
        <div className="mx-auto max-w-md">
          <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-xl shadow-black/5">
            {/* Title bar */}
            <div className="flex items-center gap-2 border-b border-border/40 bg-muted/50 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400/70" />
                <div className="h-3 w-3 rounded-full bg-amber-400/70" />
                <div className="h-3 w-3 rounded-full bg-emerald-400/70" />
              </div>
              <span className="ml-2 text-xs font-medium text-muted-foreground">
                My Drive
              </span>
            </div>

            {/* Tree */}
            <div className="p-3">
              {DEMO_TREE.map((node) => (
                <DemoTreeNode key={node.name} node={node} autoExpand />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
