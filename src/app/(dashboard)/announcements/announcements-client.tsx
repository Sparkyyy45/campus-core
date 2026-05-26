"use client";

import { useTransition, useState } from "react";
import { toast } from "sonner";
import {
  Bell,
  Pin,
  CheckCheck,
  Circle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  markAnnouncementReadAction,
  markAllAnnouncementsReadAction,
} from "./actions";
import type { Announcement } from "@/types/database";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function AnnouncementsClient({
  announcements,
  readIds: initialReadIds,
}: {
  announcements: Announcement[];
  readIds: string[];
}) {
  const [isPending, startTransition] = useTransition();
  const [readIds, setReadIds] = useState<Set<string>>(
    new Set(initialReadIds)
  );

  const unreadCount = announcements.filter((a) => !readIds.has(a.id)).length;

  // Separate pinned vs rest
  const pinned = announcements.filter((a) => a.is_pinned);
  const regular = announcements.filter((a) => !a.is_pinned);

  function handleMarkRead(id: string) {
    setReadIds((prev) => new Set(prev).add(id));
    startTransition(async () => {
      const result = await markAnnouncementReadAction(id);
      if (result.error) {
        toast.error(result.error);
        setReadIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    });
  }

  function handleMarkAllRead() {
    const allIds = new Set(announcements.map((a) => a.id));
    setReadIds(allIds);
    startTransition(async () => {
      const result = await markAllAnnouncementsReadAction();
      if (result.error) toast.error(result.error);
    });
  }

  if (announcements.length === 0) {
    return (
      <div className="campus-card text-center py-16 text-muted-foreground">
        <Bell className="h-10 w-10 mx-auto mb-4 opacity-30" />
        <p className="text-sm font-medium">No announcements yet.</p>
        <p className="text-xs mt-1">Check back later for updates.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      {unreadCount > 0 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              {unreadCount} unread
            </span>
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllRead}
            disabled={isPending}
            className="text-xs"
          >
            <CheckCheck className="h-3.5 w-3.5 mr-1.5" />
            Mark all as read
          </Button>
        </div>
      )}

      {/* Pinned Section */}
      {pinned.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Pin className="h-3 w-3" /> Pinned
          </h2>
          <div className="space-y-2">
            {pinned.map((a) => (
              <AnnouncementCard
                key={a.id}
                announcement={a}
                isRead={readIds.has(a.id)}
                onMarkRead={() => handleMarkRead(a.id)}
                isPending={isPending}
              />
            ))}
          </div>
        </section>
      )}

      {/* All Announcements */}
      {regular.length > 0 && (
        <section>
          {pinned.length > 0 && (
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
              Recent
            </h2>
          )}
          <div className="space-y-2">
            {regular.map((a) => (
              <AnnouncementCard
                key={a.id}
                announcement={a}
                isRead={readIds.has(a.id)}
                onMarkRead={() => handleMarkRead(a.id)}
                isPending={isPending}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function AnnouncementCard({
  announcement,
  isRead,
  onMarkRead,
  isPending,
}: {
  announcement: Announcement;
  isRead: boolean;
  onMarkRead: () => void;
  isPending: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-5 py-4 transition-all duration-200 ${
        isRead
          ? "border-border bg-card opacity-70"
          : "border-primary/15 bg-primary/[0.03] shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {!isRead && (
              <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
            )}
            {announcement.is_pinned && (
              <Pin className="h-3 w-3 text-amber-500 shrink-0" />
            )}
            <h3
              className={`font-semibold text-sm truncate ${
                isRead ? "text-muted-foreground" : "text-foreground"
              }`}
            >
              {announcement.title}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {announcement.content}
          </p>
          <p className="text-[11px] text-muted-foreground/60 mt-2">
            {timeAgo(announcement.created_at)}
          </p>
        </div>
        {!isRead && (
          <button
            onClick={onMarkRead}
            disabled={isPending}
            className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors shrink-0"
            title="Mark as read"
          >
            <Eye className="h-4 w-4" />
          </button>
        )}
        {isRead && (
          <div className="p-2 text-muted-foreground/40 shrink-0" title="Read">
            <CheckCheck className="h-4 w-4" />
          </div>
        )}
      </div>
    </div>
  );
}
