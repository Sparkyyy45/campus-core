// src/app/(dashboard)/resources/[id]/view/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LazyPDFViewer } from "@/components/resources/lazy-pdf-viewer";
import { ChevronLeft, Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ResourceViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { id } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: resource } = (await supabase
    .from("resources")
    .select(`
      id, 
      title, 
      description,
      subjects (name),
      resource_types (name)
    `)
    .eq("id", id)
    .single()) as { data: any };

  if (!resource) redirect("/resources");

  const derivedSubjectCode = resource.subjects?.name 
    ? resource.subjects.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 4) 
    : "GEN";

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] -m-6 md:-m-8">
      {/* Viewer Header */}
      <div className="h-14 border-b border-border bg-card px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/resources">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-sm font-semibold text-foreground line-clamp-1">{resource.title}</h1>
            <p className="text-[11px] text-muted-foreground uppercase tracking-tight">
              {derivedSubjectCode} • {resource.resource_types?.name || "General"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a 
            href={`/api/resources/${id}/signed-url?download=true`} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="gap-1.5 h-9 flex px-2.5 sm:px-3 text-xs font-bold transition-all">
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Download</span>
              <span className="inline sm:hidden">Get</span>
            </Button>
          </a>
        </div>
      </div>

      {/* PDF Viewer Area */}
      <div className="flex-1 bg-muted/30 overflow-hidden relative">
        <LazyPDFViewer resourceId={id} />
      </div>
    </div>
  );
}
