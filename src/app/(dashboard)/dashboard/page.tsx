// src/app/(dashboard)/dashboard/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { 
  BookOpen, 
  FileText, 
  Bell, 
  TrendingUp, 
  Check, 
  Clock, 
  ArrowUpRight, 
  Compass,
  Flame
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const db = supabase as any;

  // STAGE 1: Fetch user profile, pinned announcements, total announcements count, and user's read announcements concurrently
  const [profileResult, pinnedResult, totalAnnResult, readAnnResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, branch_code, semester, role")
      .eq("id", user.id)
      .single() as any,
    db
      .from("announcements")
      .select("id, title, content")
      .eq("is_pinned", true)
      .order("created_at", { ascending: false })
      .limit(3) as any,
    db.from("announcements").select("*", { count: "exact", head: true }),
    db.from("announcement_reads").select("*", { count: "exact", head: true }).eq("user_id", user.id),
  ]);

  const profile = profileResult.data;
  const pinnedAnnouncements = pinnedResult.data;
  const totalAnn = totalAnnResult.count;
  const readAnn = readAnnResult.count;

  const firstName = profile?.full_name?.split(" ")[0] ?? "Student";

  const unreadCount = Math.max(0, (totalAnn ?? 0) - (readAnn ?? 0));

  // STAGE 2: Fetch roadmap progress concurrently if profile exists
  let roadmapTotal = 0;
  let roadmapDone = 0;
  if (profile) {
    const [rmTotalResult, rmDoneResult] = await Promise.all([
      db
        .from("roadmaps")
        .select("*", { count: "exact", head: true })
        .eq("branch_code", profile.branch_code)
        .eq("semester", profile.semester),
      db
        .from("roadmap_completions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id),
    ]);
    roadmapTotal = rmTotalResult.count ?? 0;
    roadmapDone = Math.min(rmDoneResult.count ?? 0, roadmapTotal);
  }

  const roadmapPct = roadmapTotal > 0 ? Math.round((roadmapDone / roadmapTotal) * 100) : 0;

  const quickCards = [
    {
      title: "Lecture Notes",
      subtitle: "High-yield PDFs & Handouts",
      description: "Subject-wise verified lecture notes uploaded directly by core faculty and expert seniors.",
      icon: BookOpen,
      href: "/notes",
      badge: "Notes Archive",
      hue: {
        bg: "bg-[#EBF5FF]",
        text: "text-[#0066CC]",
        border: "border-[#D6EBF2]",
        hoverBorder: "hover:border-[#0066CC]/40",
        leftBorder: "border-l-[3px] border-l-[#0066CC]/30 hover:border-l-[#0066CC]"
      }
    },
    {
      title: "Past Papers (PYQs)",
      subtitle: "Real Exam Archives",
      description: "Access structured mid-semester and end-semester question papers to decode examination patterns.",
      icon: FileText,
      href: "/pyqs",
      badge: "Exam Papers",
      hue: {
        bg: "bg-[#FFF5EB]",
        text: "text-[#C25400]",
        border: "border-[#FFE1CC]",
        hoverBorder: "hover:border-[#C25400]/40",
        leftBorder: "border-l-[3px] border-l-[#C25400]/30 hover:border-l-[#C25400]"
      }
    },
    {
      title: "Academic Roadmap",
      subtitle: `${roadmapDone}/${roadmapTotal} Core Milestones`,
      description: "Track complete roadmap checkpoints mapped explicitly for your active branch and academic term.",
      icon: Compass,
      href: "/roadmap",
      badge: `${roadmapPct}% Tracked`,
      hue: {
        bg: "bg-[#EDFDF4]",
        text: "text-[#15803D]",
        border: "border-[#DCFCE7]",
        hoverBorder: "hover:border-[#15803D]/40",
        leftBorder: "border-l-[3px] border-l-[#15803D]/30 hover:border-l-[#15803D]"
      }
    },
    {
      title: "Announcements",
      subtitle: unreadCount > 0 ? `${unreadCount} Actionable Bulletins` : "Zero Pending Actions",
      description: "Stay fully synchronized with crucial academic calendar directives and official institution despatches.",
      icon: Bell,
      href: "/announcements",
      badge: "Notice Board",
      hue: {
        bg: "bg-[#F4F0FF]",
        text: "text-[#6E56CF]",
        border: "border-[#E9D7FE]",
        hoverBorder: "hover:border-[#6E56CF]/40",
        leftBorder: "border-l-[3px] border-l-[#6E56CF]/30 hover:border-l-[#6E56CF]"
      }
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-16 font-sans text-[#37352F] selection:bg-[#EAEAEA]">
      {/* Top Breadcrumb & Minimalist Hero Section */}
      <div className="border-b border-[#EAEAEA] pb-8 pt-2 space-y-4">
        <div className="flex items-center gap-2 text-[11px] tracking-widest text-[#787774] uppercase font-mono">
          <span>CampusCore</span>
          <span>/</span>
          <span>Workspace</span>
          <span>/</span>
          <span className="text-[#37352F] font-semibold">Overview</span>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-[#37352F]">
            Welcome back, {firstName}.
          </h1>
          <p className="text-xs sm:text-sm text-[#787774] tracking-wide max-w-2xl leading-relaxed">
            Access your highly curated study content, explore continuous university archives, and complete localized academic roadmap objectives.
          </p>
        </div>

        {/* Tailored hued flat metadata line for professional visibility */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
          <div className="flex items-center gap-1.5 bg-[#EBF5FF] text-[#0066CC] px-2.5 py-1 rounded-[4px] border border-[#D6EBF2]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0066CC] opacity-75 shrink-0" />
            <span className="text-[10px] uppercase tracking-widest font-mono text-[#0066CC]/80">Branch:</span>
            <span className="font-semibold font-mono">{profile?.branch_code?.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#FFF5EB] text-[#C25400] px-2.5 py-1 rounded-[4px] border border-[#FFE1CC]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C25400] opacity-75 shrink-0" />
            <span className="text-[10px] uppercase tracking-widest font-mono text-[#C25400]/80">Term:</span>
            <span className="font-semibold font-mono">Semester {profile?.semester}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#EDFDF4] text-[#15803D] px-2.5 py-1 rounded-[4px] border border-[#DCFCE7]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#15803D] opacity-75 shrink-0" />
            <span className="text-[10px] uppercase tracking-widest font-mono text-[#15803D]/80">Access:</span>
            <span className="font-semibold font-mono">{profile?.role}</span>
          </div>
        </div>
      </div>

      {/* Secondary Quick Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Study Streak Widget */}
        <div className="bg-white border border-[#EAEAEA] border-l-[3px] border-l-[#C25400]/30 hover:border-l-[#C25400] rounded-[4px] p-6 flex flex-col justify-between space-y-4 transition-all duration-200 hover:border-[#787774]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-widest text-[#787774] uppercase">
              Study Streak
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-[#FFF5EB] border border-[#FFE1CC] text-[#C25400] shrink-0">
              <Flame className="w-3.5 h-3.5 stroke-[1.5]" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-light tracking-tight text-[#37352F]">
              5 <span className="text-xs font-normal text-[#C25400] tracking-wide uppercase ml-1 font-mono font-medium">Days</span>
            </div>
            <p className="text-xs text-[#787774] mt-1 tracking-wide">
              Consistent daily viewing log active.
            </p>
          </div>
          <div className="pt-3 border-t border-[#EAEAEA] flex items-center justify-between text-[11px] text-[#787774]">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3 stroke-[1.5]" /> Verified rhythm</span>
            <span className="font-mono text-[#15803D] flex items-center gap-1 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-[#15803D] animate-pulse" />
              Active
            </span>
          </div>
        </div>

        {/* Memos & Notices Tracker Widget */}
        <div className="bg-white border border-[#EAEAEA] border-l-[3px] border-l-[#0066CC]/30 hover:border-l-[#0066CC] rounded-[4px] p-6 flex flex-col justify-between space-y-4 transition-all duration-200 hover:border-[#787774]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-widest text-[#787774] uppercase">
              Broadcast Hub
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-[#EBF5FF] border border-[#D6EBF2] text-[#0066CC] shrink-0">
              <Bell className="w-3.5 h-3.5 stroke-[1.5]" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-light tracking-tight text-[#37352F]">
              {unreadCount} <span className="text-xs font-normal text-[#0066CC] tracking-wide uppercase ml-1 font-mono font-medium">Unread</span>
            </div>
            <p className="text-xs text-[#787774] mt-1 tracking-wide">
              {unreadCount > 0 ? "Pending directives require review." : "All core communications reviewed."}
            </p>
          </div>
          <Link href="/announcements" className="pt-3 border-t border-[#EAEAEA] flex items-center justify-between text-[11px] text-[#37352F] hover:text-[#0066CC] hover:underline font-medium transition-colors">
            <span>Open notice repository</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[1.5]" />
          </Link>
        </div>
      </div>

      {/* Core Learning Modules Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#EAEAEA] pb-3">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#37352F]">
            Knowledge Base Portals
          </h2>
          <span className="text-xs text-[#787774] font-mono">
            Structured study directories
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className={`group bg-white border border-[#EAEAEA] ${card.hue.leftBorder} rounded-[4px] p-8 flex flex-col justify-between space-y-8 ${card.hue.hoverBorder} transition-all duration-200`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-[4px] ${card.hue.bg} border ${card.hue.border} ${card.hue.text} transition-colors duration-200 shrink-0`}>
                  <card.icon className="h-4 w-4 stroke-[1.5]" />
                </div>
                <span className={`text-[10px] font-mono tracking-wider uppercase border ${card.hue.border} ${card.hue.bg} ${card.hue.text} px-2.5 py-0.5 rounded-[4px] font-medium`}>
                  {card.badge}
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-medium text-[#37352F] tracking-wide flex items-center gap-1.5">
                  {card.title}
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[1.5] text-[#787774] group-hover:text-[#37352F] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </h3>
                <p className="text-xs font-mono text-[#787774]">
                  {card.subtitle}
                </p>
                <p className="text-xs text-[#787774] leading-relaxed pt-2">
                  {card.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Monochromatic Roadmap Section with Emerald Hued Completion Indicator */}
      {roadmapTotal > 0 && (
        <section className="bg-[#F7F7F7] border border-[#EAEAEA] rounded-[4px] p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-[#EDFDF4] border border-[#DCFCE7] text-[#15803D] shrink-0">
                  <Check className="h-3 w-3 stroke-[2]" />
                </div>
                <h3 className="text-sm font-semibold tracking-wider uppercase text-[#37352F]">
                  Semester Track Progress
                </h3>
              </div>
              <p className="text-xs text-[#787774] tracking-wide max-w-xl leading-relaxed pt-1">
                Completed {roadmapDone} of {roadmapTotal} verified roadmap deliverables mapped for current term evaluation.
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <div className="text-xl font-mono font-semibold text-[#15803D]">{roadmapPct}%</div>
                <div className="text-[10px] font-mono text-[#787774] uppercase tracking-widest">Index Status</div>
              </div>
              <Link
                href="/roadmap"
                className="bg-[#37352F] hover:bg-[#2C2C2C] text-white text-xs tracking-wider px-4 py-2.5 rounded-[4px] transition-colors inline-flex items-center gap-1.5"
              >
                <span>View Roadmap</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[1.5]" />
              </Link>
            </div>
          </div>

          {/* Hued Emerald Visibility Progress Line */}
          <div className="h-1.5 w-full bg-[#EAEAEA] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#15803D] transition-all duration-500 ease-out rounded-full"
              style={{ width: `${roadmapPct}%` }}
            />
          </div>
        </section>
      )}

      {/* Pinned Communications Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
          <h2 className="text-xs font-mono tracking-widest uppercase text-[#787774]">
            Official Bulletins
          </h2>
          <Link href="/announcements" className="text-xs text-[#37352F] hover:underline tracking-wide flex items-center gap-1 font-medium">
            <span>View complete log</span>
            <span>→</span>
          </Link>
        </div>

        {(pinnedAnnouncements ?? []).length > 0 ? (
          <div className="space-y-3">
            {(pinnedAnnouncements ?? []).map((a: { id: string; title: string; content: string }) => (
              <div
                key={a.id}
                className="group bg-white border border-[#EAEAEA] border-l-[3px] border-l-[#6E56CF]/30 hover:border-l-[#6E56CF] rounded-[4px] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#787774] transition-all duration-200"
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-[#F4F0FF] border border-[#E9D7FE] text-[#6E56CF] shrink-0 mt-0.5">
                    <Bell className="h-3.5 w-3.5 stroke-[1.5]" />
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <h3 className="text-xs font-semibold tracking-wide text-[#37352F] truncate group-hover:text-[#6E56CF] transition-colors">
                      {a.title}
                    </h3>
                    <p className="text-xs text-[#787774] line-clamp-2 leading-relaxed">
                      {a.content}
                    </p>
                  </div>
                </div>

                <Link
                  href="/announcements"
                  className="text-xs font-mono text-[#6E56CF] hover:underline inline-flex items-center gap-1 shrink-0 pt-2 sm:pt-0 font-medium"
                >
                  <span>Read</span>
                  <ArrowUpRight className="w-3 h-3 stroke-[1.5]" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#EAEAEA] rounded-[4px] p-8 text-center space-y-2">
            <p className="text-xs font-medium text-[#37352F]">No priority dispatches listed</p>
            <p className="text-xs text-[#787774] max-w-md mx-auto">
              The active critical circular queue is clear. Standard documents remain completely accessible under the main institutional index.
            </p>
          </div>
        )}
      </section>

      {/* Minimalist Footer Telemetry Pill with hued live status dot */}
      <div className="border border-dashed border-[#EAEAEA] bg-[#F7F7F7] p-6 rounded-[4px] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-white border border-[#EAEAEA] text-[#37352F]">
            <TrendingUp className="h-3 w-3 stroke-[1.5]" />
          </div>
          <div className="text-left">
            <div className="text-[11px] font-mono tracking-widest text-[#37352F] uppercase flex items-center gap-1.5 font-medium">
              <span>Telemetry Active</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#15803D] animate-pulse" />
            </div>
            <p className="text-[11px] text-[#787774]">
              Local runtime context synchronizing autonomously.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-[#787774] uppercase tracking-wider bg-white px-2 py-1 rounded-[4px] border border-[#EAEAEA]">
          Notion Engine v2.1
        </span>
      </div>
    </div>
  );
}
