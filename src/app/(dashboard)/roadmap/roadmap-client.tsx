"use client";

import { useTransition, useState, useMemo } from "react";
import { toast } from "sonner";
import { CheckCircle2, Circle, Map, Trophy, Sparkles } from "lucide-react";
import { toggleRoadmapCompletionAction } from "./actions";
import type { Roadmap } from "@/types/database";

export function RoadmapClient({
  roadmaps,
  completedIds: initialCompletedIds,
}: {
  roadmaps: Roadmap[];
  completedIds: string[];
}) {
  const [isPending, startTransition] = useTransition();
  const [completedIds, setCompletedIds] = useState<Set<string>>(
    new Set(initialCompletedIds)
  );

  const progress = useMemo(() => {
    if (roadmaps.length === 0) return 0;
    return Math.round((completedIds.size / roadmaps.length) * 100);
  }, [completedIds, roadmaps.length]);

  function handleToggle(roadmapId: string) {
    const isCompleted = completedIds.has(roadmapId);

    // Optimistic update
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (isCompleted) next.delete(roadmapId);
      else next.add(roadmapId);
      return next;
    });

    startTransition(async () => {
      const result = await toggleRoadmapCompletionAction(
        roadmapId,
        isCompleted
      );
      if (result.error) {
        toast.error(result.error);
        // Revert
        setCompletedIds((prev) => {
          const next = new Set(prev);
          if (isCompleted) next.add(roadmapId);
          else next.delete(roadmapId);
          return next;
        });
      }
    });
  }

  if (roadmaps.length === 0) {
    return (
      <div className="campus-card text-center py-16 text-muted-foreground">
        <Map className="h-10 w-10 mx-auto mb-4 opacity-30" />
        <p className="text-sm font-medium">No roadmap items yet.</p>
        <p className="text-xs mt-1">
          Your admin hasn&apos;t created a roadmap for your branch/semester yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="campus-card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {progress === 100 ? (
              <Trophy className="h-5 w-5 text-amber-500" />
            ) : (
              <Sparkles className="h-5 w-5 text-primary" />
            )}
            <span className="font-semibold text-sm">
              {progress === 100 ? "All done! 🎉" : "Your Progress"}
            </span>
          </div>
          <span className="text-sm font-bold text-primary">
            {completedIds.size}/{roadmaps.length}{" "}
            <span className="font-normal text-muted-foreground">
              ({progress}%)
            </span>
          </span>
        </div>
        <div className="h-3 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-teal-400 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Roadmap Items */}
      <div className="space-y-2">
        {roadmaps.map((item, idx) => {
          const isCompleted = completedIds.has(item.id);
          return (
            <button
              key={item.id}
              onClick={() => handleToggle(item.id)}
              disabled={isPending}
              className={`w-full text-left flex items-start gap-4 px-5 py-4 rounded-xl border transition-all duration-200 ${
                isCompleted
                  ? "border-primary/20 bg-primary/5"
                  : "border-border bg-card hover:border-primary/15 hover:bg-muted/30"
              }`}
            >
              {/* Step Number & Check */}
              <div className="flex items-center gap-3 shrink-0 pt-0.5">
                <span
                  className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {idx + 1}
                </span>
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground/40" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className={`font-medium text-sm ${
                    isCompleted
                      ? "text-primary line-through decoration-primary/30"
                      : "text-foreground"
                  }`}
                >
                  {item.title}
                </p>
                {item.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
