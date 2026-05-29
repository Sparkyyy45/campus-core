"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Upload, Trash2, Plus, Eye, EyeOff, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createResourceAction,
  deleteResourceAction,
  updateResourceStatusAction,
} from "./actions";
import type { Subject, ResourceType } from "@/types/database";

type ResourceRow = {
  id: string;
  title: string;
  branch_code: string;
  semester: number;
  status: string;
  created_at: string;
  cloudinary_public_id: string;
  subjects: { name: string } | null;
  resource_types: { name: string } | null;
};

const BRANCHES = ["cs", "it", "ec", "me", "ce", "ee"];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export function ResourcesAdminClient({
  resources,
  subjects,
  resourceTypes,
}: {
  resources: ResourceRow[];
  subjects: Subject[];
  resourceTypes: ResourceType[];
}) {
  const [isPending, startTransition] = useTransition();
  const [showUpload, setShowUpload] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  const filteredSubjects = subjects.filter(
    (s) =>
      (!selectedBranch || s.branch_code === selectedBranch) &&
      (!selectedSemester || s.semester === Number(selectedSemester))
  );

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      const result = await createResourceAction(formData);
      if (result.error) toast.error(result.error);
      else {
        toast.success(result.success);
        setShowUpload(false);
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this resource? This cannot be undone.")) return;
    startTransition(async () => {
      const result = await deleteResourceAction(id);
      if (result.error) toast.error(result.error);
      else toast.success(result.success);
    });
  }

  function handleToggleStatus(id: string, current: string) {
    const next = current === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    startTransition(async () => {
      const result = await updateResourceStatusAction(
        id,
        next as "DRAFT" | "PUBLISHED"
      );
      if (result.error) toast.error(result.error);
      else toast.success(result.success);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {resources.length} resources total
        </p>
        <Button
          onClick={() => setShowUpload(!showUpload)}
          size="sm"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Resource Link
        </Button>
      </div>

      {/* Upload Form */}
      {showUpload && (
        <div className="campus-card border-primary/30 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm flex items-center gap-2">
              <Upload className="h-4 w-4 text-primary" />
              Add New Resource Link
            </h2>
            <button
              onClick={() => {
                setShowUpload(false);
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Metadata form */}
          <form action={handleCreate} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g. Data Structures Unit 3 Notes"
                  required
                />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="cloudinary_url">
                  Google Drive or Document Link *
                </Label>
                <Input
                  id="cloudinary_url"
                  name="cloudinary_url"
                  type="url"
                  placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                  required
                />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description..."
                  rows={2}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="branch_code">Branch *</Label>
                <select
                  name="branch_code"
                  id="branch_code"
                  required
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                <Label htmlFor="semester">Semester *</Label>
                <select
                  name="semester"
                  id="semester"
                  required
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select semester</option>
                  {SEMESTERS.map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="subject_id">Subject *</Label>
                <select
                  name="subject_id"
                  id="subject_id"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select subject</option>
                  {filteredSubjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="resource_type_id">Type *</Label>
                <select
                  name="resource_type_id"
                  id="resource_type_id"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select type</option>
                  {resourceTypes.map((rt) => (
                    <option key={rt.id} value={rt.id}>
                      {rt.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="exam_year">Exam Year (PYQs only)</Label>
                <Input
                  id="exam_year"
                  name="exam_year"
                  type="number"
                  placeholder="e.g. 2023"
                  min={2000}
                  max={2099}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="status">Status</Label>
                <select
                  name="status"
                  id="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="PUBLISHED">Published (live)</option>
                  <option value="DRAFT">Draft (hidden)</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isPending} className="gap-2">
                <Plus className="h-4 w-4" />
                {isPending ? "Saving..." : "Save Resource"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowUpload(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Resources Table */}
      {resources.length === 0 ? (
        <div className="campus-card text-center py-12 text-muted-foreground">
          <FileText className="h-8 w-8 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No resources yet. Upload the first one!</p>
        </div>
      ) : (
        <div className="campus-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                    Title
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                    Subject
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">
                    Branch · Sem
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {resources.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium truncate max-w-[200px]">
                      {r.title}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {r.subjects?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                      {r.branch_code.toUpperCase()} · Sem {r.semester}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          r.status === "PUBLISHED"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggleStatus(r.id, r.status)}
                          disabled={isPending}
                          title={
                            r.status === "PUBLISHED"
                              ? "Move to draft"
                              : "Publish"
                          }
                          aria-label={
                            r.status === "PUBLISHED"
                              ? "Move to draft"
                              : "Publish"
                          }
                          className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        >
                          {r.status === "PUBLISHED" ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          disabled={isPending}
                          title="Delete"
                          aria-label="Delete resource"
                          className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
