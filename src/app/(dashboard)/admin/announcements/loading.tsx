import { Skeleton } from "@/components/ui/skeleton";

export default function AnnouncementsLoading() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-9 w-40 rounded-lg" />
      </div>

      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="campus-card flex gap-4 p-5">
            <div className="flex-1 space-y-3">
              <div className="flex items-start gap-2">
                {i === 1 && <Skeleton className="h-5 w-16 rounded-full" />}
                <Skeleton className="h-5 w-1/3" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              <Skeleton className="h-3.5 w-24" />
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
