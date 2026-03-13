import type { Metadata } from "next";
import { FileExplorerLayout } from "@/components/drives/FileExplorerLayout";

export const metadata: Metadata = {
  title: "File Tree Explorer",
};

export default function DrivesPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-4">
        <h1 className="font-display text-2xl font-bold text-foreground">
          File Tree Explorer
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse your Google Drive as a collapsible tree.
        </p>
      </div>
      <div className="flex-1 min-h-0">
        <FileExplorerLayout />
      </div>
    </div>
  );
}
