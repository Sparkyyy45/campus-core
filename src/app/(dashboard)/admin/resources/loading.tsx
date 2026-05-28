import { Skeleton } from "@/components/ui/skeleton";

export default function ResourcesLoading() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-9 w-44 rounded-lg" />
      </div>

      {/* Filters Placeholder */}
      <div className="flex gap-3 flex-wrap bg-card border border-border p-4 rounded-2xl">
        <Skeleton className="h-10 w-36 rounded-md" />
        <Skeleton className="h-10 w-36 rounded-md" />
        <Skeleton className="h-10 w-44 rounded-md" />
        <Skeleton className="h-10 w-48 rounded-md" />
      </div>

      {/* Table Placeholder */}
      <div className="campus-card overflow-hidden p-0">
        <div className="px-6 py-4 border-b border-border">
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="divide-y divide-border">
          <div className="grid grid-cols-5 gap-4 px-6 py-3 bg-muted/20">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/6" />
            <Skeleton className="h-4 w-1/6 justify-self-end" />
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="grid grid-cols-5 gap-4 px-6 py-4 items-center"
            >
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <div className="flex gap-2 justify-self-end">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
