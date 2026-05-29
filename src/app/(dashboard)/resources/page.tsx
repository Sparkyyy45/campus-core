// src/app/(dashboard)/resources/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  BookOpen,
  FileText,
  Eye,
  Layers,
  Sparkles,
  Search,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ResourceFilters } from "@/components/dashboard/resource-filters";

export const dynamic = "force-dynamic";

interface Resource {
  id: string;
  title: string;
  description: string | null;
  cloudinary_url: string;
  file_size_bytes: number | null;
  resource_type_id?: string;
  subject_id?: string;
  subjects: { name: string; code: string } | null;
  resource_types: { name: string; is_pyq: boolean } | null;
}

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await createClient();
  const sp = await searchParams;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const db = supabase as any;

  // STAGE 1: Fetch profile and active resource types concurrently
  const [profileResult, resourceTypesResult] = await Promise.all([
    db
      .from("profiles")
      .select("branch_code, semester")
      .eq("id", user.id)
      .single(),
    db.from("resource_types").select("id, name, is_pyq").eq("is_active", true),
  ]);

  const profile = profileResult.data;
  const resourceTypesRaw = resourceTypesResult.data || [];

  const rawSelectedType = sp.type as string | undefined;
  const selectedType = rawSelectedType === "pyqs" ? "pyq" : rawSelectedType;
  const selectedSubject = sp.subject as string | undefined;
  const searchTerm = sp.q as string | undefined;
  const selectedSemester = sp.semester
    ? parseInt(sp.semester as string)
    : profile?.semester || 1;

  const resourceTypes = (
    (resourceTypesRaw || []) as { id: string; name: string; is_pyq: boolean }[]
  ).map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.name.toLowerCase(),
    is_pyq: t.is_pyq,
  }));

  // STAGE 2: Fetch resources + subjects concurrently directly from Supabase
  const [resourcesResult, subjectsResult] = await Promise.all([
    db
      .from("resources")
      .select(
        `
        id, 
        title, 
        description, 
        cloudinary_url, 
        file_size_bytes,
        resource_type_id,
        subject_id,
        subjects (name),
        resource_types (name, is_pyq)
      `
      )
      .eq("branch_code", profile?.branch_code || "")
      .eq("semester", selectedSemester)
      .eq("status", "PUBLISHED")
      .order("created_at", { ascending: false }),
    db
      .from("subjects")
      .select("id, name")
      .eq("branch_code", profile?.branch_code || "")
      .eq("semester", selectedSemester),
  ]);

  const allResources = resourcesResult.data || [];
  const subjects = subjectsResult.data || [];

  // Apply client-side filters on the cached result set
  let resources = (allResources || []) as unknown as Resource[];

  if (selectedType) {
    const typeObj = resourceTypes.find((t) => t.slug === selectedType);
    if (typeObj) {
      resources = resources.filter((r) => r.resource_type_id === typeObj.id);
    }
  }

  if (selectedSubject) {
    resources = resources.filter((r) => r.subject_id === selectedSubject);
  }

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    resources = resources.filter((r) => r.title.toLowerCase().includes(term));
  }

  // Enforce server-side pagination (9 items per page)
  const currentPage = Math.max(1, parseInt((sp.page as string) || "1", 10));
  const ITEMS_PER_PAGE = 9;
  const totalResources = resources.length;
  const totalPages = Math.max(1, Math.ceil(totalResources / ITEMS_PER_PAGE));
  const activePage = Math.min(currentPage, totalPages);

  const paginatedResources = resources.slice(
    (activePage - 1) * ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE
  );

  const getPageLink = (pageNum: number) => {
    const params = new URLSearchParams();
    if (rawSelectedType) params.set("type", rawSelectedType);
    if (selectedSubject) params.set("subject", selectedSubject);
    if (searchTerm) params.set("q", searchTerm);
    if (sp.semester) params.set("semester", sp.semester as string);
    params.set("page", String(pageNum));
    return `?${params.toString()}`;
  };

  // Helper to determine custom tag visual appearance
  const getTypeAppearance = (typeName?: string, isPyq?: boolean) => {
    const name = (typeName || "").toLowerCase();
    if (name === "notes") {
      return {
        bg: "bg-blue-50 text-blue-600 border-blue-100",
        pillBg: "bg-blue-500/10 text-blue-600 border-blue-200",
        icon: BookOpen,
        label: "Lecture Notes",
      };
    }
    if (isPyq || name === "pyq") {
      return {
        bg: "bg-amber-50 text-amber-600 border-amber-100",
        pillBg: "bg-amber-500/10 text-amber-600 border-amber-200",
        icon: FileText,
        label: "Past Paper",
      };
    }
    return {
      bg: "bg-teal-50 text-teal-600 border-teal-100",
      pillBg: "bg-teal-500/10 text-teal-600 border-teal-200",
      icon: Layers,
      label: typeName || "Resource",
    };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-fade-in-up">
      {/* Premium Minimalist Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border p-8 sm:p-10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Subtle decorative mesh background */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-primary" />
            <span>Academic Directory</span>
            <span>•</span>
            <span className="text-primary font-semibold">
              {profile?.branch_code?.toUpperCase()}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground capitalize">
            {selectedType
              ? `${selectedType === "pyq" ? "Past Papers (PYQs)" : selectedType + " Archive"}`
              : "Resource Explorer"}
          </h1>

          <p className="text-sm text-muted-foreground font-medium max-w-xl leading-relaxed">
            Get your lecture notes, past exam papers, and other study materials
            for Semester {selectedSemester}.
          </p>
        </div>

        {/* Dynamic Metric Indicator Pill */}
        <div className="relative z-10 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 bg-muted/50 border border-border/80 px-5 py-4 rounded-2xl shrink-0">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Indexed Files
          </span>
          <div className="text-2xl sm:text-3xl font-black text-foreground flex items-center gap-1.5">
            {totalResources}
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Interactive Filters Bar */}
      <section className="relative z-20">
        <ResourceFilters
          subjects={subjects}
          resourceTypes={resourceTypes}
          currentSemester={selectedSemester}
          currentSubject={selectedSubject}
          currentType={selectedType}
        />
      </section>

      {/* Main Grid View */}
      {paginatedResources.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedResources.map((res) => {
              const appearance = getTypeAppearance(
                res.resource_types?.name,
                res.resource_types?.is_pyq
              );
              const IconComponent = appearance.icon;
              const sizeMb = res.file_size_bytes
                ? (res.file_size_bytes / 1024 / 1024).toFixed(1)
                : "0.0";

              return (
                <div
                  key={res.id}
                  className="group relative flex flex-col justify-between rounded-2xl bg-card border border-border p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                >
                  {/* Subtle top indicator highlight */}
                  <div className="absolute top-0 left-4 right-4 h-[2px] bg-primary/10 rounded-full group-hover:bg-primary/40 transition-colors" />

                  <div>
                    {/* Card Top: Type Pill & Subject Code */}
                    <div className="flex items-center justify-between gap-2 mb-4 pt-1">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${appearance.pillBg} uppercase tracking-wider flex items-center gap-1`}
                      >
                        <IconComponent className="w-3 h-3 shrink-0" />
                        {appearance.label}
                      </span>

                      <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md border border-border/60 uppercase tracking-wide">
                        {res.subjects?.name
                          ? res.subjects.name
                              .split(" ")
                              .map((w) => w[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 4)
                          : "GEN"}
                      </span>
                    </div>

                    {/* Title & Subject Full Name */}
                    <div className="space-y-1">
                      <h3 className="font-bold text-foreground text-base tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                        {res.title}
                      </h3>
                      <p className="text-xs font-semibold text-muted-foreground/90 line-clamp-1">
                        {res.subjects?.name || "General Curriculum"}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground mt-3 line-clamp-2 leading-relaxed font-medium">
                      {res.description ||
                        "No description provided for this file."}
                    </p>
                  </div>

                  {/* Footer Actions */}
                  <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-muted-foreground font-semibold">
                      {sizeMb} MB
                    </span>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={`/api/resources/${res.id}/signed-url?download=true`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          size="sm"
                          className="h-8 px-4 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xs group-hover:scale-[1.02] transition-transform flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Open Document
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Premium Glassmorphic Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border border-border/60 bg-card/60 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xs">
              <div className="flex-1 flex justify-between sm:hidden">
                {activePage > 1 ? (
                  <Link href={getPageLink(activePage - 1)}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs font-bold"
                    >
                      Previous
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="text-xs font-bold opacity-50"
                  >
                    Previous
                  </Button>
                )}
                {activePage < totalPages ? (
                  <Link href={getPageLink(activePage + 1)}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs font-bold"
                    >
                      Next
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="text-xs font-bold opacity-50"
                  >
                    Next
                  </Button>
                )}
              </div>

              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">
                    Showing{" "}
                    <span className="font-bold text-foreground">
                      {(activePage - 1) * ITEMS_PER_PAGE + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-bold text-foreground">
                      {Math.min(activePage * ITEMS_PER_PAGE, totalResources)}
                    </span>{" "}
                    of{" "}
                    <span className="font-bold text-foreground">
                      {totalResources}
                    </span>{" "}
                    resources
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Previous page */}
                  {activePage > 1 ? (
                    <Link href={getPageLink(activePage - 1)}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-xs font-bold"
                        aria-label="Previous page"
                      >
                        &larr;
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="h-8 w-8 p-0 opacity-50 text-xs font-bold"
                      aria-label="Previous page"
                    >
                      &larr;
                    </Button>
                  )}

                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => {
                      const isCurrent = p === activePage;
                      return (
                        <Link key={p} href={getPageLink(p)}>
                          <Button
                            variant={isCurrent ? "default" : "outline"}
                            size="sm"
                            className={`h-8 w-8 p-0 text-xs font-bold transition-all ${
                              isCurrent
                                ? "bg-primary text-primary-foreground shadow-xs"
                                : "hover:bg-primary/10 hover:text-primary"
                            }`}
                            aria-current={isCurrent ? "page" : undefined}
                            aria-label={`Page ${p}`}
                          >
                            {p}
                          </Button>
                        </Link>
                      );
                    }
                  )}

                  {/* Next page */}
                  {activePage < totalPages ? (
                    <Link href={getPageLink(activePage + 1)}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-xs font-bold"
                        aria-label="Next page"
                      >
                        &rarr;
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="h-8 w-8 p-0 opacity-50 text-xs font-bold"
                      aria-label="Next page"
                    >
                      &rarr;
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center max-w-md mx-auto space-y-4 shadow-2xs">
          <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground border border-border/60">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground tracking-tight">
              No indexed matching resources
            </h3>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
              We couldn&apos;t identify records adhering to your active subject
              or resource class parameters. Try clearing explicit filters.
            </p>
          </div>
          <Link href="/resources" className="inline-block mt-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-bold h-8"
            >
              Reset Query Parameters
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
