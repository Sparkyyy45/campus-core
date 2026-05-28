"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Pin, PinOff, Trash2, Plus, Bell, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createAnnouncementAction,
  togglePinAction,
  deleteAnnouncementAction,
} from "./actions";
import type { Announcement } from "@/types/database";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function AnnouncementsClient({
  announcements,
}: {
  announcements: Announcement[];
}) {
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      const result = await createAnnouncementAction(formData);
      if (result.error) toast.error(result.error);
      else {
        toast.success(result.success);
        setShowForm(false);
      }
    });
  }

  function handleTogglePin(id: string, is_pinned: boolean) {
    startTransition(async () => {
      const result = await togglePinAction(id, is_pinned);
      if (result.error) toast.error(result.error);
      else toast.success(result.success);
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteAnnouncementAction(id);
      if (result.error) toast.error(result.error);
      else toast.success(result.success);
    });
  }

  return (
    <div className="space-y-6">
      {/* Create button */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {announcements.length} announcement
          {announcements.length !== 1 ? "s" : ""}
        </p>
        <Button
          onClick={() => setShowForm(!showForm)}
          size="sm"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Announcement
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="campus-card border-primary/30">
          <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-primary" />
            New Announcement
          </h2>
          <form action={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Mid-sem schedule released"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Write the full announcement here..."
                rows={4}
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_pinned"
                name="is_pinned"
                className="h-4 w-4 rounded border-border"
              />
              <Label htmlFor="is_pinned" className="cursor-pointer text-sm">
                Pin to top (students will see this prominently)
              </Label>
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={isPending} className="gap-2">
                <Bell className="h-4 w-4" />
                {isPending ? "Posting..." : "Post Announcement"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Announcements List */}
      {announcements.length === 0 ? (
        <div className="campus-card text-center py-12 text-muted-foreground">
          <Bell className="h-8 w-8 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No announcements yet. Create the first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <div
              key={a.id}
              className={`campus-card flex gap-4 ${a.is_pinned ? "border-primary/30 bg-primary/5" : ""}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-1">
                  {a.is_pinned && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      <Pin className="h-2.5 w-2.5" /> Pinned
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-sm">{a.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap line-clamp-3">
                  {a.content}
                </p>
                <p className="text-xs text-muted-foreground/60 mt-2">
                  {formatDate(a.created_at)}
                </p>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  onClick={() => handleTogglePin(a.id, a.is_pinned)}
                  disabled={isPending}
                  title={a.is_pinned ? "Unpin" : "Pin"}
                  aria-label={a.is_pinned ? "Unpin" : "Pin"}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  {a.is_pinned ? (
                    <PinOff className="h-4 w-4" />
                  ) : (
                    <Pin className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  disabled={isPending}
                  title="Delete"
                  aria-label="Delete announcement"
                  className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
