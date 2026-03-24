"use client";

import { useState } from "react";
import {
  Folder,
  FolderOpen,
  FileText,
  FileSpreadsheet,
  Image,
  ChevronRight,
  X,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------- messy desktop simulation ---------- */
const messyFiles = [
  "IMG_3847.jpg", "Copy of Budget (2).xlsx", "final_FINAL_v3.docx",
  "Screenshot 2024-11-02.png", "Untitled document.gdoc", "asdf.pdf",
  "New folder", "New folder (2)", "report.pdf", "report (1).pdf",
  "invoice_maybe.xlsx", "IMG_3848.jpg", "todo.txt", "Backup",
  "old stuff", "misc", "djsklfjsd.png", "presentation_old.pptx",
  "receipt_scan.jpg", "Document1.docx", "notes (copy).txt",
  "project_final_REAL.zip", "test.pdf", "Untitled spreadsheet.gsheet",
];

function MessyDesktop() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-red-500/30 bg-muted/80">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-border/40 bg-muted px-4 py-2.5">
        <AlertTriangle className="h-4 w-4 text-red-400" />
        <span className="text-xs font-medium text-red-400">Your Desktop</span>
        <X className="ml-auto h-3 w-3 text-muted-foreground" />
      </div>
      {/* Grid of messy files */}
      <div className="grid grid-cols-4 gap-1.5 p-3 sm:grid-cols-5">
        {messyFiles.map((name, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-1 rounded-lg p-1.5 text-center"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded bg-muted-foreground/10">
              {name.match(/\.(jpg|png)$/i) ? (
                <Image className="h-4 w-4 text-purple-400" />
              ) : name.match(/\.(xlsx|gsheet)$/i) ? (
                <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
              ) : name.match(/^(New folder|Backup|old|misc)/i) ? (
                <Folder className="h-4 w-4 text-amber-400" />
              ) : (
                <FileText className="h-4 w-4 text-blue-400" />
              )}
            </div>
            <span className="w-full truncate text-[9px] leading-tight text-muted-foreground">
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- clean tree simulation ---------- */
interface TreeNode {
  name: string;
  type: "folder" | "file";
  icon?: "doc" | "sheet" | "image" | "pdf";
  children?: TreeNode[];
}

const cleanTree: TreeNode[] = [
  {
    name: "Clients", type: "folder", children: [
      { name: "2024_Contract.pdf", type: "file", icon: "pdf" },
      { name: "Brand_Assets", type: "folder", children: [
        { name: "Logo_Final.png", type: "file", icon: "image" },
      ] },
    ],
  },
  {
    name: "Finance", type: "folder", children: [
      { name: "2025_Budget.xlsx", type: "file", icon: "sheet" },
      { name: "Q4_Invoice.xlsx", type: "file", icon: "sheet" },
    ],
  },
  {
    name: "Projects", type: "folder", children: [
      { name: "Proposal_v2.docx", type: "file", icon: "doc" },
      { name: "Presentation.pptx", type: "file", icon: "doc" },
    ],
  },
];

function CleanTreeNode({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [open, setOpen] = useState(true);
  const isFolder = node.type === "folder";

  const iconEl = (() => {
    if (isFolder) return open ? <FolderOpen className="h-4 w-4 text-amber-400" /> : <Folder className="h-4 w-4 text-amber-400" />;
    switch (node.icon) {
      case "pdf": return <FileText className="h-4 w-4 text-red-400" />;
      case "sheet": return <FileSpreadsheet className="h-4 w-4 text-emerald-500" />;
      case "image": return <Image className="h-4 w-4 text-purple-400" />;
      default: return <FileText className="h-4 w-4 text-blue-400" />;
    }
  })();

  return (
    <div>
      <button
        onClick={() => isFolder && setOpen(!open)}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-tree-hover transition-colors"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {isFolder && (
          <ChevronRight className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-90")} />
        )}
        {!isFolder && <span className="w-3.5" />}
        {iconEl}
        <span className="truncate text-foreground">{node.name}</span>
      </button>
      {isFolder && open && node.children?.map((child) => (
        <CleanTreeNode key={child.name} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

function CleanDesktop() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-emerald-500/30 bg-card shadow-lg shadow-emerald-500/5">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-border/40 bg-muted/50 px-4 py-2.5">
        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        <span className="text-xs font-medium text-emerald-500">DriveTree</span>
        <div className="ml-auto flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/60" />
        </div>
      </div>
      {/* Tree */}
      <div className="p-3">
        {cleanTree.map((node) => (
          <CleanTreeNode key={node.name} node={node} />
        ))}
      </div>
    </div>
  );
}

/* ---------- main section ---------- */
export function BeforeAfterSection() {
  return (
    <section className="relative overflow-hidden border-t border-border/40 bg-muted/30 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Why DriveTree?
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Your desktop shouldn&apos;t look like this
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            Have all your files visible in one place. Connect Google Drive in seconds.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-2">
          {/* Before */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-400" />
              <span className="text-sm font-semibold text-red-400">Before</span>
              <span className="text-sm text-muted-foreground">— chaos everywhere</span>
            </div>
            <MessyDesktop />
          </div>

          {/* After */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold text-emerald-500">After</span>
              <span className="text-sm text-muted-foreground">— clean and organized</span>
            </div>
            <CleanDesktop />
          </div>
        </div>
      </div>
    </section>
  );
}
