// src/components/resources/pdf-viewer.tsx
"use client";

import { useEffect, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";

interface PDFViewerProps {
  resourceId: string;
}

export function PDFViewer({ resourceId }: PDFViewerProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUrl() {
      try {
        const response = await fetch(`/api/resources/${resourceId}/signed-url`);
        if (!response.ok) throw new Error("Failed to get access URL");
        const data = await response.json();
        setUrl(data.url);
      } catch (err) {
        console.error(err);
        setError("Unable to load resource. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchUrl();
  }, [resourceId]);

  if (loading) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-10">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-sm font-medium text-muted-foreground italic">Fetching secure access...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
        <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold">Error Loading Viewer</h3>
        <p className="text-muted-foreground mt-2 max-w-xs">{error}</p>
      </div>
    );
  }

  if (!url) return null;

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* For MVP, we use the browser's native viewer via iframe with the signed URL */}
      {/* Sprint 2 refinement can replace this with full PDF.js canvas rendering for better UX control */}
      <iframe 
        src={`${url}#toolbar=0`}
        className="w-full h-full border-none"
        title="PDF Viewer"
      />
      
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-foreground/90 text-background px-4 py-2 rounded-full text-xs font-medium backdrop-blur-sm shadow-xl opacity-0 hover:opacity-100 transition-opacity duration-300">
        Secure Preview • Downloads restricted
      </div>
    </div>
  );
}
