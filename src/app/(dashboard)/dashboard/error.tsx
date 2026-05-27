"use client";

import { AlertCircle, RotateCcw } from "lucide-react";
import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="max-w-md mx-auto flex flex-col items-center justify-center py-24 text-center space-y-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-50 border border-red-100">
        <AlertCircle className="h-6 w-6 text-red-500" />
      </div>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-[#37352F] tracking-tight">
          Something went wrong
        </h2>
        <p className="text-sm text-[#787774] max-w-sm leading-relaxed">
          A temporary issue prevented this page from loading. This usually resolves on retry.
        </p>
      </div>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#37352F] hover:bg-[#2C2C2C] text-white text-sm font-medium rounded-lg transition-colors"
      >
        <RotateCcw className="h-4 w-4" />
        Try Again
      </button>
    </div>
  );
}
