// src/app/(dashboard)/dashboard/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-16 animate-in fade-in duration-300">
      {/* Hero breadcrumb + header skeleton */}
      <div className="border-b border-[#EAEAEA] pb-8 pt-2 space-y-4">
        <Skeleton className="h-3 w-40" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-7 w-28 rounded-[4px]" />
          <Skeleton className="h-7 w-32 rounded-[4px]" />
          <Skeleton className="h-7 w-24 rounded-[4px]" />
        </div>
      </div>

      {/* Study Streak + Broadcast Hub row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white border border-[#EAEAEA] rounded-[4px] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-7 rounded-[4px]" />
            </div>
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-3 w-48" />
            <div className="pt-3 border-t border-[#EAEAEA]">
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>

      {/* Knowledge Base Portals grid */}
      <div className="space-y-6">
        <div className="flex items-baseline justify-between border-b border-[#EAEAEA] pb-3">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-36" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-[#EAEAEA] rounded-[4px] p-8 space-y-8">
              <div className="flex items-start justify-between gap-4">
                <Skeleton className="h-10 w-10 rounded-[4px]" />
                <Skeleton className="h-5 w-20 rounded-[4px]" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-full mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
