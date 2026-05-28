// src/app/(dashboard)/admin/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Users,
  BookOpen,
  Bell,
  Map,
  TrendingUp,
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  Download,
  Activity,
  HardDrive,
  Calendar,
} from "lucide-react";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = (await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()) as { data: { role: string } | null; error: unknown };
  if (profile?.role !== "ADMIN") redirect("/dashboard");

  const db = supabase as any;

  // ── Core counts ──
  const [
    { count: studentCount },
    { count: adminCount },
    { count: resourceCount },
    { count: draftCount },
    { count: announcementCount },
    { count: roadmapCount },
    { count: downloadCount },
  ] = await Promise.all([
    db
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "STUDENT"),
    db
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "ADMIN"),
    db
      .from("resources")
      .select("*", { count: "exact", head: true })
      .eq("status", "PUBLISHED"),
    db
      .from("resources")
      .select("*", { count: "exact", head: true })
      .eq("status", "DRAFT"),
    db.from("announcements").select("*", { count: "exact", head: true }),
    db.from("roadmaps").select("*", { count: "exact", head: true }),
    db.from("resource_downloads").select("*", { count: "exact", head: true }),
  ]);

  // ── Analytics queries (run concurrently) ──
  // eslint-disable-next-line react-hooks/purity
  const sevenDaysAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000
  ).toISOString();

  const [
    recentDownloadsResult,
    downloads7dResult,
    sizeDataResult,
    allDownloadsResult,
  ] = await Promise.all([
    db
      .from("resource_downloads")
      .select("user_id")
      .gte("downloaded_at", sevenDaysAgo) as any,
    db
      .from("resource_downloads")
      .select("*", { count: "exact", head: true })
      .gte("downloaded_at", sevenDaysAgo),
    db.from("resources").select("file_size_bytes") as any,
    db.from("resource_downloads").select("resource_id") as any,
  ]);

  const recentDownloads = recentDownloadsResult.data as
    | { user_id: string }[]
    | null;
  const activeUsers7d = new Set(
    (recentDownloads ?? []).map((d: { user_id: string }) => d.user_id)
  ).size;
  const downloads7d = downloads7dResult.count;

  const sizeData = sizeDataResult.data as
    | { file_size_bytes: number | null }[]
    | null;
  const totalBytes = (sizeData ?? []).reduce(
    (sum: number, r: { file_size_bytes: number | null }) =>
      sum + (r.file_size_bytes ?? 0),
    0
  );
  const storageMB = (totalBytes / (1024 * 1024)).toFixed(1);
  const storageLabel =
    totalBytes > 1024 * 1024 * 1024
      ? `${(totalBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
      : `${storageMB} MB`;

  // ── Top downloaded resources (top 5) ──
  const allDownloads = allDownloadsResult.data as
    | { resource_id: string }[]
    | null;
  const downloadCounts: Record<string, number> = {};
  (allDownloads ?? []).forEach((d: { resource_id: string }) => {
    downloadCounts[d.resource_id] = (downloadCounts[d.resource_id] ?? 0) + 1;
  });
  const topResourceIds = Object.entries(downloadCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  let topResources: { id: string; title: string; downloads: number }[] = [];
  if (topResourceIds.length > 0) {
    const { data: resourceRows } = (await db
      .from("resources")
      .select("id, title")
      .in(
        "id",
        topResourceIds.map(([id]) => id)
      )) as {
      data: { id: string; title: string }[] | null;
    };
    const nameIndex: Record<string, string> = {};
    (resourceRows ?? []).forEach((r: { id: string; title: string }) => {
      nameIndex[r.id] = r.title;
    });
    topResources = topResourceIds.map(([id, count]) => ({
      id,
      title: nameIndex[id] ?? "Unknown",
      downloads: count,
    }));
  }

  const primaryStats = [
    {
      label: "Students",
      value: String(studentCount ?? 0),
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      href: "/admin/users",
    },
    {
      label: "Published Resources",
      value: String(resourceCount ?? 0),
      icon: BookOpen,
      color: "text-teal-600",
      bg: "bg-teal-50",
      href: "/admin/resources",
    },
    {
      label: "Total Downloads",
      value: String(downloadCount ?? 0),
      icon: Download,
      color: "text-purple-600",
      bg: "bg-purple-50",
      href: "/admin/resources",
    },
    {
      label: "Announcements",
      value: String(announcementCount ?? 0),
      icon: Bell,
      color: "text-amber-600",
      bg: "bg-amber-50",
      href: "/admin/announcements",
    },
  ];

  const secondaryStats = [
    {
      label: "7-Day Active Users",
      value: String(activeUsers7d),
      icon: Activity,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Downloads (7 Days)",
      value: String(downloads7d ?? 0),
      icon: Calendar,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Draft Resources",
      value: String(draftCount ?? 0),
      icon: BookOpen,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Est. Storage Used",
      value: storageLabel,
      icon: HardDrive,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  ];

  const quickLinks = [
    {
      label: "Upload Resource",
      href: "/admin/resources",
      icon: BookOpen,
      desc: "Add notes, PYQs, and more",
    },
    {
      label: "Post Announcement",
      href: "/admin/announcements",
      icon: Bell,
      desc: "Broadcast to all students",
    },
    {
      label: "Manage Subjects",
      href: "/admin/subjects",
      icon: GraduationCap,
      desc: "Add or remove subjects",
    },
    {
      label: "Add Roadmap",
      href: "/admin/roadmaps",
      icon: Map,
      desc: "Create learning paths",
    },
    {
      label: "Manage Users",
      href: "/admin/users",
      icon: Users,
      desc: "View users and edit roles",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">
              Admin Control Center
            </span>
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Manage resources, subjects, and monitor student engagement.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted">
            <Users className="h-3 w-3" /> {adminCount ?? 0} admin
            {(adminCount ?? 0) !== 1 ? "s" : ""}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted">
            <Map className="h-3 w-3" /> {roadmapCount ?? 0} roadmap items
          </span>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {primaryStats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="campus-card flex items-center gap-4 hover:border-primary/20 transition-colors group"
          >
            <div
              className={`h-11 w-11 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}
            >
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Secondary Stats (Analytics Row) */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5" /> Analytics
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {secondaryStats.map((stat) => (
            <div
              key={stat.label}
              className="campus-card flex items-center gap-3"
            >
              <div
                className={`h-9 w-9 rounded-lg ${stat.bg} flex items-center justify-center shrink-0`}
              >
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-lg font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Downloaded Resources */}
      {topResources.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-1.5">
            <Download className="h-3.5 w-3.5" /> Most Downloaded
          </h2>
          <div className="campus-card divide-y divide-border">
            {topResources.map((r, idx) => (
              <div
                key={r.id}
                className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
              >
                <span className="text-xs font-bold text-muted-foreground w-5 text-center">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{r.title}</p>
                </div>
                <span className="text-xs font-semibold text-primary whitespace-nowrap">
                  {r.downloads} {r.downloads === 1 ? "download" : "downloads"}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
          Quick Actions
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="campus-card flex items-center gap-4 group hover:border-primary/20 transition-colors"
            >
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                <link.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{link.label}</p>
                <p className="text-xs text-muted-foreground">{link.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
