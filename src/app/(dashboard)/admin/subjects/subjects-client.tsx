"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Trash2, Plus, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createSubjectAction, deleteSubjectAction } from "./actions";
import type { Subject } from "@/types/database";

const BRANCHES = ["cs", "it", "ec", "me", "ce", "ee"];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export function SubjectsClient({ subjects }: { subjects: Subject[] }) {
  const [isPending, startTransition] = useTransition();
  const [branch, setBranch] = useState<string>("");
  const [semester, setSemester] = useState<string>("");

  const filtered = subjects.filter(
    (s) =>
      (!branch || s.branch_code === branch) &&
      (!semester || s.semester === Number(semester))
  );

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      const result = await createSubjectAction(formData);
      if (result.error) toast.error(result.error);
      else toast.success(result.success);
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteSubjectAction(id);
      if (result.error) toast.error(result.error);
      else toast.success(result.success);
    });
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Create Form */}
      <div className="campus-card h-fit">
        <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
          <Plus className="h-4 w-4 text-primary" />
          Add New Subject
        </h2>
        <form action={handleCreate} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Subject Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Data Structures"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="branch_code">Branch</Label>
            <select
              name="branch_code"
              id="branch_code"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Select branch</option>
              {BRANCHES.map((b) => (
                <option key={b} value={b}>
                  {b.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="semester">Semester</Label>
            <select
              name="semester"
              id="semester"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Select semester</option>
              {SEMESTERS.map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Adding..." : "Add Subject"}
          </Button>
        </form>
      </div>

      {/* Subject List */}
      <div className="lg:col-span-2 space-y-4">
        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <Select
            onValueChange={(v: string | null) =>
              setBranch(!v || v === "all" ? "" : v)
            }
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All branches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All branches</SelectItem>
              {BRANCHES.map((b) => (
                <SelectItem key={b} value={b}>
                  {b.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(v: string | null) =>
              setSemester(!v || v === "all" ? "" : v)
            }
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All semesters" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All semesters</SelectItem>
              {SEMESTERS.map((s) => (
                <SelectItem key={s} value={String(s)}>
                  Sem {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground self-center">
            {filtered.length} subject{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="campus-card text-center py-12 text-muted-foreground">
            <GraduationCap className="h-8 w-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm">
              No subjects found. Add one to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">{s.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {s.branch_code.toUpperCase()} · Semester {s.semester}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(s.id)}
                  disabled={isPending}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Delete subject"
                  aria-label="Delete subject"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
