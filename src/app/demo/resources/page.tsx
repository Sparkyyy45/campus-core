// src/app/demo/resources/page.tsx
"use client";

import React, { useState } from "react";
import {
  BookOpen,
  FileText,
  Eye,
  Layers,
  Sparkles,
  Search,
  Compass,
  X,
  FileCheck,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface MockResource {
  id: string;
  title: string;
  description: string;
  subject: string;
  type: "notes" | "pyq";
  sizeMb: string;
  facultySignature: string;
  verificationDate: string;
  contentSnippet: string[];
}

const MOCK_RESOURCES: MockResource[] = [
  {
    id: "demo-res-1",
    title: "Data Structures & Algorithms - Complete Lab Manual",
    description:
      "Comprehensive collection of C++ lab assignments, tree traversals, heap sort, graphs, and search algorithm complexities.",
    subject: "Data Structures & Algorithms (CSE-201)",
    type: "notes",
    sizeMb: "2.4",
    facultySignature: "Professor",
    verificationDate: "April 12, 2026",
    contentSnippet: [
      "CHAPTER 1: Introduction to Time Complexities & Big-O Notation",
      "CHAPTER 2: Dynamic Memory Allocation & Pointer Arithmetics",
      "CHAPTER 3: Double Linked Lists, Stack, and Queue implementations",
      "CHAPTER 4: Binary Trees, BST Insertion, Deletion, and Traversals (Pre, In, Post)",
      "CHAPTER 5: Graph Representation (Adjacency Matrix/List) & BFS/DFS algorithms",
    ],
  },
  {
    id: "demo-res-2",
    title: "Object-Oriented Programming End-Term PYQ (2025)",
    description:
      "Official end-term question paper containing inheritance, polymorphic constructors, templates, and exception handling blocks.",
    subject: "Object-Oriented Programming (CSE-202)",
    type: "pyq",
    sizeMb: "1.1",
    facultySignature: "Professor",
    verificationDate: "June 05, 2025",
    contentSnippet: [
      "SECTION A: 10 MCQ Questions on Encapsulation and Access Modifiers (10 Marks)",
      "SECTION B: Short Answer Questions on Virtual Functions and Abstract Classes (15 Marks)",
      "SECTION C: Programming Problem: Write a templated safe array bounds checker (15 Marks)",
      "SECTION D: Deep Dive: Analyze memory leak potentials inside virtual destructors (20 Marks)",
    ],
  },
  {
    id: "demo-res-3",
    title: "Database Management Systems - Normalization Study Guide",
    description:
      "Faculty-annotated lecture summary detailing 1NF, 2NF, 3NF, BCNF rules, and SQL schema dependency diagrams.",
    subject: "Database Management Systems (CSE-203)",
    type: "notes",
    sizeMb: "3.8",
    facultySignature: "Professor",
    verificationDate: "May 19, 2026",
    contentSnippet: [
      "TOPIC 1: Functional Dependencies & Closure Axioms",
      "TOPIC 2: First Normal Form (1NF) & Eliminating Multi-Valued Attributes",
      "TOPIC 3: Second Normal Form (2NF) & Full Functional Dependency Check",
      "TOPIC 4: Third Normal Form (3NF) & Transitive Dependency Elimination",
      "TOPIC 5: Boyce-Codd Normal Form (BCNF) & Anomalies Elimination",
    ],
  },
  {
    id: "demo-res-4",
    title: "Discrete Mathematics Mid-Term Solved Paper (2024)",
    description:
      "Solved past paper from CSE department covering set theory, combinatorics, recurrence relations, and graph theories.",
    subject: "Discrete Mathematics (CSE-204)",
    type: "pyq",
    sizeMb: "0.9",
    facultySignature: "Professor",
    verificationDate: "October 18, 2024",
    contentSnippet: [
      "QUESTION 1: Solve recurrence relation a_n = 5a_{n-1} - 6a_{n-2} with initial conditions (10 Marks)",
      "QUESTION 2: Prove whether the given graph holds Eulerian or Hamiltonian circuits (10 Marks)",
      "QUESTION 3: Deduce logic equivalences using truth table validations (10 Marks)",
      "QUESTION 4: Demonstrate combinations and permutations with pigeonhole principle bounds (10 Marks)",
    ],
  },
];

export default function DemoResources() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "notes" | "pyq">(
    "all"
  );
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [previewResource, setPreviewResource] = useState<MockResource | null>(
    null
  );

  // Filter list
  const filteredResources = MOCK_RESOURCES.filter((res) => {
    const matchesSearch =
      res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "all" ? true : res.type === selectedType;
    const matchesSubject =
      selectedSubject === "all" ? true : res.subject.includes(selectedSubject);
    return matchesSearch && matchesType && matchesSubject;
  });

  const subjectsList = Array.from(
    new Set(MOCK_RESOURCES.map((r) => r.subject.split(" (")[0]))
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8 pb-16">
      {/* Directory Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border p-8 sm:p-10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-primary" />
            <span>Academic Sandbox</span>
            <span>•</span>
            <span className="text-primary font-semibold">CSE Branch</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Resource Directory
          </h1>

          <p className="text-sm text-muted-foreground font-medium max-w-xl leading-relaxed">
            Browse verified study guides, syllabus documents, and exam previous
            year papers (PYQs) preloaded inside the sandbox.
          </p>
        </div>

        <div className="relative z-10 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 bg-muted/50 border border-border/80 px-5 py-4 rounded-2xl shrink-0">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Mock Files
          </span>
          <div className="text-2xl sm:text-3xl font-black text-foreground flex items-center gap-1.5">
            {filteredResources.length}
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar controls */}
      <section className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4 relative z-10">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search syllabus documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/50 text-[#37352F] placeholder-muted-foreground"
            />
          </div>

          {/* Subject Dropdown */}
          <div className="w-full md:w-64">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/50 text-[#37352F] cursor-pointer"
            >
              <option value="all">All Subjects</option>
              {subjectsList.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab filters */}
        <div className="flex items-center gap-1.5 border-t border-border/60 pt-4 overflow-x-auto select-none">
          {[
            { id: "all", label: "All Materials" },
            { id: "notes", label: "Lecture Notes" },
            { id: "pyq", label: "Past Papers" },
          ].map((tab) => {
            const isSelected = selectedType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id as any)}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all border shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-foreground text-background border-foreground shadow-2xs"
                    : "bg-background text-muted-foreground hover:text-foreground border-border hover:bg-muted/40"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid Content */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResources.map((res) => {
            const sizeMb = res.sizeMb;
            const isPyq = res.type === "pyq";
            const appearance = isPyq
              ? {
                  pillBg: "bg-amber-500/10 text-amber-600 border-amber-200",
                  icon: FileText,
                  label: "Past Paper",
                }
              : {
                  pillBg: "bg-blue-500/10 text-blue-600 border-blue-200",
                  icon: BookOpen,
                  label: "Lecture Notes",
                };
            const IconComponent = appearance.icon;

            return (
              <div
                key={res.id}
                className="group relative flex flex-col justify-between rounded-2xl bg-card border border-border p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
              >
                <div className="absolute top-0 left-4 right-4 h-[2px] bg-primary/10 rounded-full group-hover:bg-primary/40 transition-colors" />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-4 pt-1">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${appearance.pillBg} uppercase tracking-wider flex items-center gap-1`}
                    >
                      <IconComponent className="w-3 h-3 shrink-0" />
                      {appearance.label}
                    </span>

                    <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md border border-border/60 uppercase tracking-wide">
                      {res.subject
                        .split(" (")[0]
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 4)}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-foreground text-base tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                      {res.title}
                    </h3>
                    <p className="text-xs font-semibold text-muted-foreground/90 line-clamp-1">
                      {res.subject}
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground mt-3 line-clamp-2 leading-relaxed font-medium">
                    {res.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-muted-foreground font-semibold">
                    {sizeMb} MB
                  </span>

                  <Button
                    size="sm"
                    onClick={() => setPreviewResource(res)}
                    className="h-8 px-4 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xs group-hover:scale-[1.02] transition-transform flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Open Sandbox Viewer
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center max-w-md mx-auto space-y-4 shadow-2xs">
          <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground border border-border/60">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground tracking-tight">
              No matching files found
            </h3>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
              We couldn&apos;t identify records adhering to your search query.
              Clear filters to start over.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setSelectedSubject("all");
              setSelectedType("all");
            }}
            className="text-xs font-bold h-8 cursor-pointer"
          >
            Reset Query Parameters
          </Button>
        </div>
      )}

      {/* 🌟 PREMIUM SIMULATED DOCUMENT VIEWERS VIEWPORT MODAL */}
      {previewResource && (
        <div className="fixed inset-0 bg-[#37352F]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200 select-none">
          <div className="bg-white border border-[#EAEAEA] rounded-2xl w-full max-w-3xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 font-sans text-[#37352F]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#EAEAEA] bg-[#F7F7F7] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono tracking-widest text-[#787774] uppercase">
                  SECURE_PREVIEW_SANDBOX
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <button
                onClick={() => setPreviewResource(null)}
                className="text-[#787774] hover:text-[#37352F] transition-colors p-1.5 hover:bg-[#EAEAEA] rounded-lg cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Document Meta Section */}
            <div className="px-6 py-5 border-b border-[#EAEAEA] bg-white space-y-3 shrink-0">
              <h2 className="text-lg font-black tracking-tight leading-snug">
                {previewResource.title}
              </h2>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                <span className="font-semibold text-muted-foreground">
                  Subject:{" "}
                  <span className="text-[#37352F]">
                    {previewResource.subject}
                  </span>
                </span>
                <span className="text-border">|</span>
                <span className="font-semibold text-muted-foreground">
                  File Size:{" "}
                  <span className="text-[#37352F]">
                    {previewResource.sizeMb} MB
                  </span>
                </span>
              </div>

              {/* Faculty Verification Seal Banner */}
              <div className="bg-emerald-50 border border-emerald-200/60 rounded-xl p-3.5 flex items-start gap-3">
                <FileCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-emerald-800">
                    Faculty Signature Verified & Authorized
                  </p>
                  <p className="text-[11px] text-emerald-700 leading-relaxed">
                    Signed by{" "}
                    <strong>{previewResource.facultySignature}</strong> on{" "}
                    {previewResource.verificationDate} in compliance with SPSU
                    syllabus standards.
                  </p>
                </div>
              </div>
            </div>

            {/* Simulated Document Preview Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#FBFBFA] space-y-8 relative">
              {/* Glowing Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03]">
                <span className="text-6xl font-black tracking-widest uppercase rotate-[-30deg] border-4 border-dashed border-[#37352F] p-8">
                  CampusCore
                </span>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-white border border-[#EAEAEA] rounded-xl p-6 shadow-xs space-y-4">
                  <div className="flex justify-between border-b border-[#F1F1F1] pb-2 text-[10px] font-mono text-[#787774]">
                    <span>PAGE 1 OF 3</span>
                    <span>SPSU SYLLABUS DIRECTORY</span>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <p className="font-bold text-[#37352F]">
                      *** OFFICIAL FACULTY SYLLABUS NOTES ARCHIVE ***
                    </p>
                    <p className="text-[#5F5E5B] leading-relaxed">
                      This study resource contains verified reference keys and
                      department lecture summaries compiled for Semester 3 CSE
                      exams.
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-[#EAEAEA] rounded-xl p-6 shadow-xs space-y-4">
                  <div className="flex justify-between border-b border-[#F1F1F1] pb-2 text-[10px] font-mono text-[#787774]">
                    <span>PAGE 2 OF 3</span>
                    <span>CHAPTER REFERENCE SCHEMAS</span>
                  </div>

                  <div className="space-y-4">
                    <p className="font-bold text-xs text-[#37352F]">
                      Index of Major Topics:
                    </p>
                    <div className="space-y-2">
                      {previewResource.contentSnippet.map((line, index) => (
                        <div
                          key={index}
                          className="p-3 rounded-lg bg-[#F7F7F7] border border-[#EAEAEA] text-xs font-mono text-[#5F5E5B] leading-relaxed"
                        >
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Simulated Barrier Lock */}
                <div className="bg-[#37352F] text-[#F7F7F7] rounded-xl p-6 shadow-lg text-center space-y-4 relative overflow-hidden">
                  {/* Glowing light bars */}
                  <div className="absolute -inset-10 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent_60%)] pointer-events-none" />

                  <ShieldAlert className="h-8 w-8 text-amber-400 mx-auto animate-bounce" />

                  <div className="space-y-1.5 relative z-10 max-w-md mx-auto">
                    <h3 className="text-sm font-bold tracking-wide uppercase font-mono">
                      Secure Preview Lock Active
                    </h3>
                    <p className="text-[11px] text-muted-foreground/80 leading-relaxed">
                      Full PDF offline downloads are blocked inside the preview
                      sandbox to prevent copyright automation. Log in to an
                      active student account to download high-resolution source
                      materials.
                    </p>
                  </div>

                  <Link href="/signup" className="inline-block relative z-10">
                    <button className="bg-white hover:bg-neutral-100 text-[#37352F] font-bold text-xs px-5 py-2.5 rounded-xl transition-all hover:scale-[1.01] cursor-pointer">
                      Register Student Account & Download
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#EAEAEA] bg-[#F7F7F7] flex justify-end shrink-0">
              <Button
                onClick={() => setPreviewResource(null)}
                variant="outline"
                size="sm"
                className="text-xs font-bold h-8 cursor-pointer"
              >
                Close Sandbox Viewer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
