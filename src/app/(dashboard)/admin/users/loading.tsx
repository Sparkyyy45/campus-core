import { Skeleton } from "@/components/ui/skeleton";

export default function UsersLoading() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-500">
      {/* Stats Counter Placeholder */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="campus-card text-center space-y-2 py-5">
            <Skeleton className="h-8 w-1/3 mx-auto" />
            <Skeleton className="h-3 w-1/2 mx-auto" />
          </div>
        ))}
      </div>

      {/* Search Input Placeholder */}
      <div className="relative">
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* Table Placeholder */}
      <div className="campus-card overflow-hidden p-0">
        <div className="divide-y divide-border">
          <div className="grid grid-cols-6 gap-4 px-6 py-3 bg-muted/20">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4 justify-self-end" />
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="grid grid-cols-6 gap-4 px-6 py-4 items-center"
            >
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3.5 w-44" />
              </div>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-8 w-20 rounded-md justify-self-end" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
