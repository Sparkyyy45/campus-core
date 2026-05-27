// src/app/(dashboard)/resources/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { 
  Filter, 
  BookOpen, 
  FileText, 
  Download, 
  Eye, 
  Layers, 
  Sparkles, 
  Search,
  ArrowUpRight,
  Compass
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ResourceFilters } from "@/components/dashboard/resource-filters";
import { getCachedSubjects, getCachedResourceTypes, getCachedResources } from "@/lib/db-cache";

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

  // STAGE 1: Fetch profile and resource types concurrently
  const [profileResult, resourceTypesRaw] = await Promise.all([
    db.from("profiles").select("branch_code, semester").eq("id", user.id).single(),
    getCachedResourceTypes()
  ]);

  const profile = profileResult.data;

  const rawSelectedType = sp.type as string | undefined;
  const selectedType = rawSelectedType === "pyqs" ? "pyq" : rawSelectedType;
  const selectedSubject = sp.subject as string | undefined;
  const searchTerm = sp.q as string | undefined;
  const selectedSemester = sp.semester 
    ? parseInt(sp.semester as string) 
    : profile?.semester || 1;

  const resourceTypes = ((resourceTypesRaw || []) as { id: string; name: string; is_pyq: boolean }[]).map(t => ({
    id: t.id,
    name: t.name,
    slug: t.name.toLowerCase(),
    is_pyq: t.is_pyq
  }));

  // STAGE 2: Fetch cached resources + subjects concurrently
  // Resources are cached for 5 min per branch+semester combo — during exam peaks,
  // 300 students in the same cohort all serve from cache instead of hitting Supabase.
  const [allResources, subjects] = await Promise.all([
    getCachedResources(profile?.branch_code || "", selectedSemester),
    getCachedSubjects(profile?.branch_code || "", selectedSemester),
  ]);

  // Apply client-side filters on the cached result set
  let resources = (allResources || []) as unknown as Resource[];

  if (selectedType) {
    const typeObj = resourceTypes.find(t => t.slug === selectedType);
    if (typeObj) {
      resources = resources.filter(r => r.resource_type_id === typeObj.id);
    }
  }

  if (selectedSubject) {
    resources = resources.filter(r => r.subject_id === selectedSubject);
  }

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    resources = resources.filter(r => r.title.toLowerCase().includes(term));
  }

  // Helper to determine custom tag visual appearance
  const getTypeAppearance = (typeName?: string, isPyq?: boolean) => {
    const name = (typeName || "").toLowerCase();
    if (name === "notes") {
      return {
        bg: "bg-blue-50 text-blue-600 border-blue-100",
        pillBg: "bg-blue-500/10 text-blue-600 border-blue-200",
        icon: BookOpen,
        label: "Lecture Notes"
      };
    }
    if (isPyq || name === "pyq") {
      return {
        bg: "bg-amber-50 text-amber-600 border-amber-100",
        pillBg: "bg-amber-500/10 text-amber-600 border-amber-200",
        icon: FileText,
        label: "Past Paper"
      };
    }
    return {
      bg: "bg-teal-50 text-teal-600 border-teal-100",
      pillBg: "bg-teal-500/10 text-teal-600 border-teal-200",
      icon: Layers,
      label: typeName || "Resource"
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
            <span className="text-primary font-semibold">{profile?.branch_code?.toUpperCase()}</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground capitalize">
            {selectedType ? `${selectedType === 'pyq' ? 'Past Papers (PYQs)' : selectedType + ' Archive'}` : "Resource Explorer"}
          </h1>
          
          <p className="text-sm text-muted-foreground font-medium max-w-xl leading-relaxed">
            Browse high-fidelity instructional handouts, official term assessment papers, and curated study modules synced for Semester {selectedSemester}.
          </p>
        </div>

        {/* Dynamic Metric Indicator Pill */}
        <div className="relative z-10 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 bg-muted/50 border border-border/80 px-5 py-4 rounded-2xl shrink-0">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Indexed Files</span>
          <div className="text-2xl sm:text-3xl font-black text-foreground flex items-center gap-1.5">
            {resources.length}
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
      {resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.map((res) => {
            const appearance = getTypeAppearance(res.resource_types?.name, res.resource_types?.is_pyq);
            const IconComponent = appearance.icon;
            const sizeMb = res.file_size_bytes ? (res.file_size_bytes / 1024 / 1024).toFixed(1) : "0.0";

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
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${appearance.pillBg} uppercase tracking-wider flex items-center gap-1`}>
                      <IconComponent className="w-3 h-3 shrink-0" />
                      {appearance.label}
                    </span>

                    <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md border border-border/60 uppercase tracking-wide">
                      {res.subjects?.name ? res.subjects.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 4) : "GEN"}
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
                    {res.description || "No specific module synopsis provided by the instructing faculty."}
                  </p>
                </div>

                {/* Footer Actions */}
                <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-muted-foreground font-semibold">
                    {sizeMb} MB
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Link href={`/resources/${res.id}/view`} prefetch={false}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-3 text-xs font-bold hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        View
                      </Button>
                    </Link>

                    <a 
                      href={`/api/resources/${res.id}/signed-url?download=true`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button 
                        size="sm" 
                        className="h-8 px-3 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xs group-hover:scale-[1.02] transition-transform"
                      >
                        <Download className="w-3.5 h-3.5 mr-1" />
                        Get
                      </Button>
                    </a>
                  </div>
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
            <h3 className="text-base font-bold text-foreground tracking-tight">No indexed matching resources</h3>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
              We couldn&apos;t identify records adhering to your active subject or resource class parameters. Try clearing explicit filters.
            </p>
          </div>
          <Link href="/resources" className="inline-block mt-2">
            <Button variant="outline" size="sm" className="text-xs font-bold h-8">
              Reset Query Parameters
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
