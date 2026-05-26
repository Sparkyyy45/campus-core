// src/components/resources/lazy-pdf-viewer.tsx
"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Lazy-load the PDF viewer so pdfjs-dist is NOT bundled into the main JS payload.
// It only downloads when a student actually opens a document.
const PDFViewer = dynamic(
  () => import("@/components/resources/pdf-viewer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-sm font-medium text-muted-foreground">Loading viewer...</p>
      </div>
    ),
  }
);

export function LazyPDFViewer({ resourceId }: { resourceId: string }) {
  return <PDFViewer resourceId={resourceId} />;
}
