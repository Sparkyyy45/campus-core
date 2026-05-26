"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Trash2, Plus, Map, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createRoadmapAction, deleteRoadmapAction, reorderRoadmapAction } from "./actions";
import type { Roadmap } from "@/types/database";

const BRANCHES = ["cs", "it", "ec", "me", "ce", "ee"];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export function RoadmapsClient({ roadmaps }: { roadmaps: Roadmap[] }) {
  const [isPending, startTransition] = useTransition();
  const [filterBranch, setFilterBranch] = useState("");
  const [filterSem, setFilterSem] = useState("");

  const filtered = roadmaps.filter(
    (r) =>
      (!filterBranch || r.branch_code === filterBranch) &&
      (!filterSem || r.semester === Number(filterSem))
  );

  // Group by branch+semester
  const grouped: Record<string, Roadmap[]> = {};
  filtered.forEach((r) => {
    const key = `${r.branch_code.toUpperCase()} · Sem ${r.semester}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(r);
  });

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      const result = await createRoadmapAction(formData);
      if (result.error) toast.error(result.error);
      else toast.success(result.success);
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteRoadmapAction(id);
      if (result.error) toast.error(result.error);
      else toast.success(result.success);
    });
  }

  function handleReorder(id: string, direction: "up" | "down", currentIdx: number) {
    startTransition(async () => {
      const result = await reorderRoadmapAction(id, direction, currentIdx);
      if (result.error) toast.error(result.error);
    });
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Create Form */}
      <div className="campus-card h-fit">
        <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
          <Plus className="h-4 w-4 text-primary" />
          Add Roadmap Item
        </h2>
        <form action={handleCreate} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" name="title" placeholder="e.g. Master Data Structures" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" placeholder="What should a student achieve?" rows={3} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="branch_code">Branch *</Label>
            <select name="branch_code" id="branch_code" required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <option value="">Select branch</option>
              {BRANCHES.map((b) => <option key={b} value={b}>{b.toUpperCase()}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="semester">Semester *</Label>
            <select name="semester" id="semester" required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <option value="">Select semester</option>
              {SEMESTERS.map((s) => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="order_idx">Order (0 = first)</Label>
            <Input id="order_idx" name="order_idx" type="number" min={0} defaultValue={0} />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Adding..." : "Add Item"}
          </Button>
        </form>
      </div>

      {/* Roadmap List */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex gap-3 flex-wrap">
          <Select onValueChange={(v: string | null) => setFilterBranch(!v || v === "all" ? "" : v)}>
            <SelectTrigger className="w-36"><SelectValue placeholder="All branches" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All branches</SelectItem>
              {BRANCHES.map((b) => <SelectItem key={b} value={b}>{b.toUpperCase()}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select onValueChange={(v: string | null) => setFilterSem(!v || v === "all" ? "" : v)}>
            <SelectTrigger className="w-36"><SelectValue placeholder="All semesters" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All semesters</SelectItem>
              {SEMESTERS.map((s) => <SelectItem key={s} value={String(s)}>Sem {s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {Object.keys(grouped).length === 0 ? (
          <div className="campus-card text-center py-12 text-muted-foreground">
            <Map className="h-8 w-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No roadmap items yet.</p>
          </div>
        ) : (
          Object.entries(grouped).map(([groupKey, items]) => (
            <div key={groupKey} className="campus-card">
              <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-widest mb-3">{groupKey}</h3>
              <div className="space-y-2">
                {items.map((r, idx) => (
                  <div key={r.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border bg-background hover:bg-muted/20 transition-colors">
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => handleReorder(r.id, "up", r.order_idx)}
                        disabled={isPending || idx === 0}
                        className="p-0.5 rounded text-muted-foreground hover:text-foreground disabled:opacity-30"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleReorder(r.id, "down", r.order_idx)}
                        disabled={isPending || idx === items.length - 1}
                        className="p-0.5 rounded text-muted-foreground hover:text-foreground disabled:opacity-30"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{r.title}</p>
                      {r.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{r.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(r.id)}
                      disabled={isPending}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
