// src/app/(dashboard)/roadmap/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function RoadmapLoading() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Page header */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Roadmap milestone items */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex items-start gap-4 border border-border rounded-xl p-5"
          >
            {/* Checkbox placeholder */}
            <Skeleton className="h-6 w-6 rounded-md shrink-0 mt-0.5" />
            
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/5" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>

            {/* Order badge */}
            <Skeleton className="h-6 w-8 rounded-md shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
