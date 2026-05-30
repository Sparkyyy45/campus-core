// src/app/demo/roadmap/page.tsx
"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
  Circle,
  Map,
  Trophy,
  Sparkles,
  Compass,
} from "lucide-react";

interface MockRoadmapItem {
  id: string;
  title: string;
  description: string;
}

const MOCK_ROADMAP: MockRoadmapItem[] = [
  {
    id: "demo-rm-1",
    title: "Introduction to Graph Theory & Connectivity",
    description:
      "Understand vertices, edges, connectivity parameters, path routes, Eulerian cycles, and Hamiltonian paths.",
  },
  {
    id: "demo-rm-2",
    title: "Asymptotic Algorithm Complexity (Big-O, Theta, Omega)",
    description:
      "Master time and space complexity evaluations for iterative nested loops and recursive divide-and-conquer procedures.",
  },
  {
    id: "demo-rm-3",
    title: "Double Linked List Pointer Manipulations",
    description:
      "Understand bidirectional node pointer adjustments, head/tail list boundaries, and dynamic heap memory allocations.",
  },
  {
    id: "demo-rm-4",
    title: "Binary Search Tree (BST) Node Deletions",
    description:
      "Implement deletion operations covering zero children, single child, and double children inorder successor re-linking.",
  },
  {
    id: "demo-rm-5",
    title: "Relational Database Normalization (1NF, 2NF, 3NF)",
    description:
      "Learn functional dependency resolution, candidate key computations, and eliminating partial dependencies.",
  },
  {
    id: "demo-rm-6",
    title: "TCP/IP 3-Way Handshake & Connection Protocols",
    description:
      "Analyze SYN, SYN-ACK, ACK packet transmissions and standard client-server socket connection bindings.",
  },
];

export default function DemoRoadmap() {
  const [completedIds, setCompletedIds] = useState<Set<string>>(
    new Set(["demo-rm-1", "demo-rm-2"]) // Default completed items
  );

  const totalItems = MOCK_ROADMAP.length;
  const completedCount = completedIds.size;
  const progress = Math.round((completedCount / totalItems) * 100);

  function handleToggle(id: string) {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast.info("Topic marked as incomplete.");
      } else {
        next.add(id);
        toast.success("Outstanding! Topic checked off. 🌟");
      }
      return next;
    });
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border p-8 sm:p-10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-primary" />
            <span>Syllabus Roadmap</span>
            <span>•</span>
            <span className="text-primary font-semibold">Semester 3</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Academic Milestones
          </h1>

          <p className="text-sm text-muted-foreground font-medium max-w-xl leading-relaxed">
            Track and complete core computer science syllabus topics. Check off
            nodes to dynamically recalculate your semester progress.
          </p>
        </div>
      </div>

      {/* Progress Bar Widget */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {progress === 100 ? (
              <Trophy className="h-5 w-5 text-amber-500" />
            ) : (
              <Sparkles className="h-5 w-5 text-primary" />
            )}
            <span className="font-semibold text-sm">
              {progress === 100
                ? "All topics mastered! Excellent job."
                : "Semester Progress Tracker"}
            </span>
          </div>
          <span className="text-sm font-bold text-primary">
            {completedCount}/{totalItems}{" "}
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

      {/* Checklist items */}
      <div className="space-y-3">
        {MOCK_ROADMAP.map((item, idx) => {
          const isCompleted = completedIds.has(item.id);
          return (
            <button
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className={`w-full text-left flex items-start gap-4 px-5 py-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                isCompleted
                  ? "border-primary/20 bg-primary/5"
                  : "border-border bg-card hover:border-primary/15 hover:bg-muted/30"
              }`}
            >
              {/* Step number and check indicator */}
              <div className="flex items-center gap-3 shrink-0 pt-0.5 select-none">
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

              {/* Content text */}
              <div className="flex-1 min-w-0">
                <p
                  className={`font-semibold text-sm ${
                    isCompleted
                      ? "text-primary line-through decoration-primary/30"
                      : "text-foreground"
                  }`}
                >
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
