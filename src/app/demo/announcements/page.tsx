// src/app/demo/announcements/page.tsx
"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Bell, Pin, Eye, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MockAnnouncement {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
}

const MOCK_ANNOUNCEMENTS: MockAnnouncement[] = [
  {
    id: "demo-ann-1",
    title: "Mid-Term Examination Schedule Released",
    content:
      "The academic registry has officially published the mid-term examinations timetable for the CSE branch. Slots are allocated in the main auditorium and block B labs. Please verify your specific seat/slot codes to prevent scheduling conflicts.",
    isPinned: true,
    createdAt: "2 hours ago",
  },
  {
    id: "demo-ann-2",
    title: "Lab Records & Project Submission Guidelines",
    content:
      "All third-semester students are required to submit their signed laboratory files for Data Structures (CSE-201) and Database Systems (CSE-203) by next Friday. Ensure all execution outcomes and compiler logs are neatly printed and bound.",
    isPinned: false,
    createdAt: "1 day ago",
  },
  {
    id: "demo-ann-3",
    title: "Guest Lecture: Scaling Globally Distributed Cloud Databases",
    content:
      "The computer science department is hosting a guest lecture on scaling globally distributed database clusters and Row-Level Security by an SPSU distinguished alumnus. Attendance is mandatory for all CSE undergraduates. Location: Seminar Hall 1, 10:00 AM.",
    isPinned: false,
    createdAt: "3 days ago",
  },
];

export default function DemoAnnouncements() {
  const [readIds, setReadIds] = useState<Set<string>>(new Set(["demo-ann-3"])); // Default 1 read
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const unreadCount = MOCK_ANNOUNCEMENTS.filter(
    (a) => !readIds.has(a.id)
  ).length;
  const pinned = MOCK_ANNOUNCEMENTS.filter((a) => a.isPinned);
  const regular = MOCK_ANNOUNCEMENTS.filter((a) => !a.isPinned);

  function handleMarkRead(id: string) {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    toast.success("Notice marked as read.");
  }

  function handleMarkAllRead() {
    setReadIds(new Set(MOCK_ANNOUNCEMENTS.map((a) => a.id)));
    toast.success("All announcements marked as read!");
  }

  function handleCardClick(id: string) {
    setExpandedId(expandedId === id ? null : id);
    if (!readIds.has(id)) {
      handleMarkRead(id);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border p-8 sm:p-10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-primary" />
            <span>Notice Board</span>
            <span>•</span>
            <span className="text-primary font-semibold">
              Official Bulletins
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            University Announcements
          </h1>

          <p className="text-sm text-muted-foreground font-medium max-w-xl leading-relaxed">
            Read important news, exam slot schedules, guest lecture calendars,
            and laboratory alerts from your university department.
          </p>
        </div>
      </div>

      {/* Unread indicators and controls */}
      {unreadCount > 0 && (
        <div className="flex items-center justify-between px-1 relative z-10 select-none">
          <p className="text-sm text-muted-foreground font-semibold">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              {unreadCount} unread notices
            </span>
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllRead}
            className="text-xs font-bold hover:bg-muted/60 cursor-pointer"
          >
            <CheckCheck className="h-3.5 w-3.5 mr-1.5" />
            Mark all as read
          </Button>
        </div>
      )}

      {/* Pinned Bulletins */}
      {pinned.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-bold font-mono tracking-widest uppercase text-muted-foreground flex items-center gap-1.5 select-none border-b border-border/60 pb-2">
            <Pin className="h-3.5 w-3.5 text-amber-500" /> Pinned
          </h2>
          <div className="space-y-3">
            {pinned.map((a) => (
              <AnnouncementCard
                key={a.id}
                announcement={a}
                isRead={readIds.has(a.id)}
                isExpanded={expandedId === a.id}
                onCardClick={() => handleCardClick(a.id)}
                onMarkRead={() => handleMarkRead(a.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Regular bulletins */}
      {regular.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-bold font-mono tracking-widest uppercase text-muted-foreground border-b border-border/60 pb-2 select-none">
            Recent Announcements
          </h2>
          <div className="space-y-3">
            {regular.map((a) => (
              <AnnouncementCard
                key={a.id}
                announcement={a}
                isRead={readIds.has(a.id)}
                isExpanded={expandedId === a.id}
                onCardClick={() => handleCardClick(a.id)}
                onMarkRead={() => handleMarkRead(a.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

interface CardProps {
  announcement: MockAnnouncement;
  isRead: boolean;
  isExpanded: boolean;
  onCardClick: () => void;
  onMarkRead: () => void;
}

function AnnouncementCard({
  announcement,
  isRead,
  isExpanded,
  onCardClick,
  onMarkRead,
}: CardProps) {
  return (
    <div
      onClick={onCardClick}
      className={`rounded-xl border px-5 py-4 transition-all duration-200 cursor-pointer select-none ${
        isRead
          ? "border-border bg-card opacity-70 hover:opacity-100"
          : "border-primary/15 bg-primary/[0.03] shadow-xs hover:border-primary/30"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {!isRead && (
              <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
            )}
            {announcement.isPinned && (
              <Pin className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            )}
            <h3
              className={`font-semibold text-sm truncate ${
                isRead ? "text-muted-foreground" : "text-foreground"
              }`}
            >
              {announcement.title}
            </h3>
          </div>
          <p
            className={`text-xs text-muted-foreground mt-1 transition-all leading-relaxed ${
              isExpanded ? "block" : "line-clamp-2"
            }`}
          >
            {announcement.content}
          </p>
          <div className="flex items-center gap-2 mt-2 select-none">
            <p className="text-[11px] text-muted-foreground/60 font-semibold">
              {announcement.createdAt}
            </p>
            <span className="text-[10px] text-primary/70 font-mono">
              • {isExpanded ? "Click to collapse" : "Click to expand details"}
            </span>
          </div>
        </div>

        {!isRead && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkRead();
            }}
            className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors shrink-0 cursor-pointer"
            title="Mark as read"
          >
            <Eye className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function CheckCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
      className="h-3.5 w-3.5"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
