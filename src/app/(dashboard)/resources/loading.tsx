// src/app/(dashboard)/resources/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Compass } from "lucide-react";

export default function ResourcesLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Header Skeleton */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-md bg-muted/60 animate-pulse flex items-center justify-center">
              <Compass className="w-3.5 h-3.5 text-muted-foreground/40" />
            </div>
            <Skeleton className="h-4 w-32 bg-muted/50 rounded-md" />
          </div>
          <Skeleton className="h-8 w-64 bg-muted/60 rounded-lg" />
          <Skeleton className="h-4 w-80 bg-muted/40 rounded-md" />
        </div>
      </header>

      {/* Filter Bar Skeleton */}
      <section className="bg-card p-4 rounded-xl border border-border/60 flex flex-wrap items-center gap-4">
        {/* Search Bar Shimmer */}
        <div className="flex-1 min-w-[240px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30" />
          <Skeleton className="h-9 w-full bg-muted/40 rounded-lg" />
        </div>
        {/* Dropdowns Shimmer */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <Skeleton className="h-9 w-24 sm:w-28 bg-muted/40 rounded-lg" />
          <Skeleton className="h-9 w-36 sm:w-44 bg-muted/40 rounded-lg" />
          <Skeleton className="h-9 w-24 sm:w-28 bg-muted/40 rounded-lg" />
        </div>
      </section>

      {/* Main Grid View Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="group relative flex flex-col justify-between rounded-2xl bg-card border border-border p-5"
          >
            {/* Subtle top indicator highlight */}
            <div className="absolute top-0 left-4 right-4 h-[2px] bg-muted/20 rounded-full" />

            <div>
              {/* Card Top: Type Pill & Subject Code */}
              <div className="flex items-center justify-between gap-2 mb-4 pt-1">
                <Skeleton className="h-5 w-24 bg-muted/50 rounded-md" />
                <Skeleton className="h-5 w-12 bg-muted/40 rounded-md" />
              </div>

              {/* Title & Subject Full Name */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-5/6 bg-muted/50 rounded-md" />
                <Skeleton className="h-5 w-2/3 bg-muted/40 rounded-md" />
                <Skeleton className="h-3 w-1/2 bg-muted/30 rounded-md mt-1" />
              </div>

              {/* Description */}
              <div className="space-y-1.5 mt-4">
                <Skeleton className="h-3 w-full bg-muted/30 rounded-md" />
                <Skeleton className="h-3 w-5/6 bg-muted/20 rounded-md" />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-5 pt-3 border-t border-border/40 flex items-center justify-between gap-2">
              <Skeleton className="h-4 w-12 bg-muted/30 rounded-md" />
              <div className="flex items-center gap-1.5">
                <Skeleton className="h-8 w-28 bg-primary/20 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
