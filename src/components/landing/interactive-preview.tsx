"use client";

import React, { useState } from "react";
import {
  Search,
  FileText,
  Map as MapIcon,
  ShieldCheck,
  Sparkles,
  Download,
  Pin,
  Layers,
  Clock,
  Bell,
  Check,
} from "lucide-react";

export function InteractivePreview() {
  const [activeTab, setActiveTab] = useState<
    "resources" | "roadmaps" | "announcements" | "admin"
  >("resources");

  // Interactive state for the Roadmap preview tab to show actual live interactivity
  const [roadmapItems, setRoadmapItems] = useState([
    {
      id: 1,
      text: "Advanced Data Structures & Heaps",
      completed: true,
      tag: "Core",
    },
    {
      id: 2,
      text: "Computer Networks & Subnetting",
      completed: true,
      tag: "Systems",
    },
    {
      id: 3,
      text: "Operating Systems Memory Management",
      completed: false,
      tag: "Systems",
    },
    {
      id: 4,
      text: "Database Normalization & ACID Properties",
      completed: false,
      tag: "Data",
    },
  ]);

  const toggleRoadmapItem = (id: number) => {
    setRoadmapItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const completedCount = roadmapItems.filter((i) => i.completed).length;
  const completionPercent = Math.round(
    (completedCount / roadmapItems.length) * 100
  );

  // Search state simulation for resources
  const [searchQuery, setSearchQuery] = useState("");
  const resourcesList = [
    {
      title: "Computer Networks Complete Notes.pdf",
      author: "Dr. Sharma",
      sem: "Sem 4",
      verified: true,
      downloads: 1420,
    },
    {
      title: "Operating Systems PYQs (Solved).pdf",
      author: "Prof. Verma",
      sem: "Sem 4",
      verified: true,
      downloads: 980,
    },
    {
      title: "Database Systems Lab Manual.pdf",
      author: "Admin Portal",
      sem: "Sem 4",
      verified: true,
      downloads: 650,
    },
  ].filter(
    (res) =>
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="w-full max-w-5xl mx-auto mt-16 animate-fade-in-up"
      style={{ animationDelay: "0.2s" }}
    >
      {/* Interactive indicator badge */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
        </span>
        <span className="text-xs font-semibold tracking-wide text-primary uppercase bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
          Live Interactive Demonstration
        </span>
      </div>

      {/* OS Window Frame */}
      <div className="bg-card rounded-2xl border border-border shadow-2xl overflow-hidden aspect-auto md:aspect-[16/10] flex flex-col transition-all duration-300 animate-pulse-glow">
        {/* Titlebar */}
        <div className="h-11 border-b border-border flex items-center justify-between px-4 bg-muted/30 select-none">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive/60 hover:opacity-100 transition-opacity" />
              <div className="w-3 h-3 rounded-full bg-amber-500/60 hover:opacity-100 transition-opacity" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/60 hover:opacity-100 transition-opacity" />
            </div>
            <div className="h-4 w-[1px] bg-border mx-2" />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono bg-background px-2.5 py-1 rounded border border-border/60">
              <Sparkles className="h-3 w-3 text-primary animate-pulse" />
              <span>app.campuscore.edu/workspace</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <span className="px-2 py-0.5 rounded bg-primary/5 text-primary border border-primary/10 font-medium">
              Student Persona
            </span>
            <span>Role-Based Secure JWT</span>
          </div>
        </div>

        {/* Workspace App Layout */}
        <div className="flex-1 flex flex-col md:flex-row bg-background overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 bg-muted/10 border-b md:border-b-0 md:border-r border-border p-4 flex flex-row md:flex-col gap-1.5 overflow-x-auto select-none">
            <div className="hidden md:block px-3 py-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
              Core Modules
            </div>

            {[
              {
                id: "resources",
                label: "Resource Library",
                icon: FileText,
                desc: "Verified files & notes",
              },
              {
                id: "roadmaps",
                label: "Academic Roadmaps",
                icon: MapIcon,
                desc: "Curriculum progression",
              },
              {
                id: "announcements",
                label: "Bulletin Board",
                icon: Bell,
                desc: "Official campus notices",
              },
              {
                id: "admin",
                label: "Admin Workflow",
                icon: ShieldCheck,
                desc: "Signature & auth control",
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all shrink-0 md:shrink ${
                    isActive
                      ? "bg-card text-primary font-medium shadow-sm border border-border/80 translate-x-0 md:translate-x-1"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg transition-colors ${isActive ? "bg-primary/10 text-primary" : "bg-transparent"}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium leading-none">
                      {tab.label}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1 hidden md:block">
                      {tab.desc}
                    </div>
                  </div>
                </button>
              );
            })}

            <div className="mt-auto hidden md:block pt-4 border-t border-border/60">
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                <div className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1">
                  <Layers className="h-3.5 w-3.5 text-primary" /> Notion-Style
                  UI
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Clean typographic hierarchy tailored for uncompromised study
                  session focus.
                </p>
              </div>
            </div>
          </div>

          {/* Tab Content Panels */}
          <div className="flex-1 p-6 overflow-y-auto bg-background flex flex-col">
            {/* 1. RESOURCES TAB */}
            {activeTab === "resources" && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      Verified Resource Library
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Search curated PDFs uploaded by professors and authorized
                      batch seniors.
                    </p>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Filter notes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                </div>

                {/* Resource item row simulation */}
                <div className="space-y-3">
                  {resourcesList.length > 0 ? (
                    resourcesList.map((res, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card hover:border-primary/40 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-red-500/10 text-red-600 shrink-0">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                              {res.title}
                              {res.verified && (
                                <span
                                  className="p-0.5 rounded-full bg-primary/10 text-primary"
                                  title="Verified Material"
                                >
                                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-2">
                              <span>
                                Uploaded by{" "}
                                <strong className="text-foreground/80">
                                  {res.author}
                                </strong>
                              </span>
                              <span>•</span>
                              <span className="px-1.5 py-0.2 rounded bg-muted text-[10px]">
                                {res.sem}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-muted-foreground hidden sm:inline">
                            {res.downloads} downloads
                          </span>
                          <button className="p-2 rounded-lg bg-muted/60 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all shrink-0">
                            <Download className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-xs text-muted-foreground">
                      No matching verified resources found. Try searching for
                      &quot;Notes&quot; or &quot;Sharma&quot;.
                    </div>
                  )}
                </div>

                {/* Live Toast Notice */}
                <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Supabase Postgres pool connected smoothly</span>
                  </div>
                  <span className="font-mono text-[10px]">
                    Cloudinary API Ready
                  </span>
                </div>
              </div>
            )}

            {/* 2. ROADMAPS TAB */}
            {activeTab === "roadmaps" && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      Semester 4 Curated Roadmap
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Click items to mark them complete and track your
                      systematic progress.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 bg-muted/40 px-3 py-1.5 rounded-xl border border-border">
                    <div className="text-xs font-semibold text-foreground">
                      Progress:
                    </div>
                    <div className="w-24 bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all duration-500"
                        style={{ width: `${completionPercent}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-primary w-8 text-right">
                      {completionPercent}%
                    </span>
                  </div>
                </div>

                {/* Roadmap Nodes Interactive Grid */}
                <div className="relative pl-4 border-l-2 border-border/60 space-y-4 my-2">
                  {roadmapItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleRoadmapItem(item.id)}
                      className={`relative flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                        item.completed
                          ? "bg-primary/5 border-primary/20 text-foreground"
                          : "bg-card border-border hover:border-border/80 text-foreground/80"
                      }`}
                    >
                      {/* Left node indicator connecting to the track */}
                      <div
                        className={`absolute -left-[23px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 transition-all ${
                          item.completed
                            ? "bg-primary border-background"
                            : "bg-background border-border"
                        }`}
                      />

                      <div className="flex items-center gap-3">
                        <div
                          className={`h-5 w-5 rounded-md flex items-center justify-center transition-all ${
                            item.completed
                              ? "bg-primary text-primary-foreground"
                              : "border border-border bg-muted/30"
                          }`}
                        >
                          {item.completed && (
                            <Check className="h-3 w-3 stroke-[3]" />
                          )}
                        </div>
                        <span
                          className={`text-xs font-medium transition-all ${item.completed ? "line-through text-muted-foreground" : ""}`}
                        >
                          {item.text}
                        </span>
                      </div>

                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
                        {item.tag}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="text-[11px] text-muted-foreground bg-primary/5 p-3 rounded-xl border border-primary/10 flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>
                    Interactive state fully preserved locally. Feel free to
                    toggle tasks to test responsiveness!
                  </span>
                </div>
              </div>
            )}

            {/* 3. ANNOUNCEMENTS TAB */}
            {activeTab === "announcements" && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="pb-4 border-b border-border/60">
                  <h3 className="text-lg font-bold text-foreground">
                    Official Announcement Stream
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Priority messages pinned by department heads. Zero anonymous
                    clutter.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      pinned: true,
                      dept: "Dean of Academics",
                      date: "Today, 09:30 AM",
                      title:
                        "Revised Mid-Term Examination Schedule & Admit Card Protocol",
                      content:
                        "All students are requested to download their digitally signed admit cards via the resource console. Unsigned documents will require direct verification at the admin window.",
                      priority: "Critical Update",
                    },
                    {
                      pinned: false,
                      dept: "Computer Science Dept",
                      date: "Yesterday",
                      title:
                        "Guest Lecture: High-Performance Distributed Systems",
                      content:
                        "Attendance is compulsory for Semester 4 and 6 students. Link to prerequisite reading materials has been embedded in your corresponding Roadmap tab.",
                      priority: "Notice",
                    },
                  ].map((ann, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border transition-all ${
                        ann.pinned
                          ? "bg-primary/5 border-primary/20 shadow-sm"
                          : "bg-card border-border"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          {ann.pinned && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                              <Pin className="h-2.5 w-2.5" /> PINNED
                            </span>
                          )}
                          <span className="text-xs font-semibold text-foreground">
                            {ann.dept}
                          </span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {ann.date}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-foreground mb-1">
                        {ann.title}
                      </h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {ann.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. ADMIN TAB */}
            {activeTab === "admin" && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="pb-4 border-b border-border/60 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      Admin Access Security
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Strict security barrier blocking unauthenticated
                      modification attempts.
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-destructive/10 text-destructive border border-destructive/20">
                    Restricted Mode
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-border bg-card">
                    <div className="text-xs font-semibold text-muted-foreground mb-1">
                      Rate Limiter Defense
                    </div>
                    <div className="text-base font-bold text-foreground">
                      10 requests / min
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1">
                      Active Sliding-Window Algorithm
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-card">
                    <div className="text-xs font-semibold text-muted-foreground mb-1">
                      Signature Hash Verification
                    </div>
                    <div className="text-base font-bold text-emerald-600">
                      SHA-256 Validated
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1">
                      Cloudinary SDK Synchronized
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-dashed border-border bg-muted/20 text-center space-y-2">
                  <ShieldCheck className="h-8 w-8 text-muted-foreground mx-auto" />
                  <div className="text-xs font-bold text-foreground">
                    Protected Upload Actions Route
                  </div>
                  <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
                    Students are prevented from bypassing file integrity checks.
                    Admin operations require authenticated Supabase session
                    headers.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
