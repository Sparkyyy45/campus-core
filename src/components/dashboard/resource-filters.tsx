// src/components/dashboard/resource-filters.tsx
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";

interface ResourceFiltersProps {
  subjects: { id: string; name: string }[] | null;
  resourceTypes: { id: string; name: string; slug: string }[] | null;
  currentSemester: number;
  currentSubject?: string;
  currentType?: string;
}

export function ResourceFilters({
  subjects,
  resourceTypes,
  currentSemester,
  currentSubject,
  currentType,
}: ResourceFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div
      className={`flex flex-wrap items-center gap-4 bg-card p-4 rounded-xl border border-border transition-opacity ${isPending ? "opacity-70" : "opacity-100"}`}
    >
      <div className="flex-1 min-w-[240px] relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for notes or exam papers..."
          className="pl-9"
          defaultValue={searchParams.get("q") || ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateFilters("q", e.currentTarget.value);
            }
          }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
        <select
          className="flex-1 sm:flex-initial bg-background border border-border rounded-lg px-2.5 sm:px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none cursor-pointer"
          value={currentSemester}
          onChange={(e) => updateFilters("semester", e.target.value)}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
            <option key={sem} value={sem}>
              Sem {sem}
            </option>
          ))}
        </select>

        <select
          className="flex-1 sm:flex-initial bg-background border border-border rounded-lg px-2.5 sm:px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none min-w-[120px] sm:min-w-[150px] max-w-[200px] sm:max-w-none cursor-pointer"
          value={currentSubject || ""}
          onChange={(e) => updateFilters("subject", e.target.value)}
        >
          <option value="">All Subjects</option>
          {subjects?.map((subject) => {
            const abbreviation = subject.name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .toUpperCase()
              .slice(0, 4);
            return (
              <option key={subject.id} value={subject.id}>
                {abbreviation}: {subject.name}
              </option>
            );
          })}
        </select>

        <select
          className="flex-1 sm:flex-initial bg-background border border-border rounded-lg px-2.5 sm:px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none cursor-pointer"
          value={currentType || ""}
          onChange={(e) => updateFilters("type", e.target.value)}
        >
          <option value="">All Types</option>
          {resourceTypes?.map((type) => (
            <option key={type.id} value={type.slug}>
              {type.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
