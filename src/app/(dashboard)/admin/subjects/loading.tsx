import { Skeleton } from "@/components/ui/skeleton";

export default function SubjectsLoading() {
  return (
    <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto animate-in fade-in duration-500">
      {/* Form Column Placeholder (Left) */}
      <div className="campus-card h-fit space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-5 w-36" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>

      {/* List Column Placeholder (Right) */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex gap-3 flex-wrap items-center">
          <Skeleton className="h-10 w-36 rounded-md" />
          <Skeleton className="h-10 w-36 rounded-md" />
          <Skeleton className="h-4 w-24" />
        </div>

        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-card"
            >
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
