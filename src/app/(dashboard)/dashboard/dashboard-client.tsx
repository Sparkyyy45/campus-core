"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  BookOpen,
  FileText,
  Bell,
  Check,
  Clock,
  ArrowUpRight,
  Compass,
  Flame,
  Sparkles,
  GraduationCap,
  Calendar,
  Zap,
  Trophy,
} from "lucide-react";
import Link from "next/link";

interface DashboardClientProps {
  firstName: string;
  semester: number;
  branchFullName: string;
  role: string;
  initialStreak: number;
  unreadCount: number;
  pinnedAnnouncements: { id: string; title: string; content: string }[];
  roadmapTotal: number;
  roadmapDone: number;
  roadmapPct: number;
  greeting: string;
  greetingEmoji: string;
}

type FocusMode = "focus" | "grind" | "casual";

const FOCUS_MODES: Record<
  FocusMode,
  {
    label: string;
    emoji: string;
    mantra: string;
    gradient: string;
    accent: string;
    shadow: string;
    glowingOrb: string;
  }
> = {
  focus: {
    label: "Deep Focus Mode",
    emoji: "🚀",
    mantra: "Phone away. Clock is ticking. You are building your future today!",
    gradient:
      "from-blue-600/15 via-indigo-600/5 to-transparent border-blue-500/30",
    accent:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    shadow: "shadow-blue-500/5",
    glowingOrb: "bg-blue-500/10 shadow-[0_0_50px_20px_rgba(59,130,246,0.15)]",
  },
  grind: {
    label: "PYQ Grind Mode",
    emoji: "✍️",
    mantra:
      "Scanning archives. Let's master the exact questions that came in previous exams!",
    gradient:
      "from-amber-600/15 via-orange-600/5 to-transparent border-amber-500/30",
    accent:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    shadow: "shadow-amber-500/5",
    glowingOrb: "bg-amber-500/10 shadow-[0_0_50px_20px_rgba(245,158,11,0.15)]",
  },
  casual: {
    label: "Smart Review Mode",
    emoji: "🧠",
    mantra:
      "No pressure. Just browse some notes. Let's get 1% better every single day!",
    gradient:
      "from-emerald-600/15 via-teal-600/5 to-transparent border-emerald-500/30",
    accent:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    shadow: "shadow-emerald-500/5",
    glowingOrb:
      "bg-emerald-500/10 shadow-[0_0_50px_20px_rgba(16,185,129,0.15)]",
  },
};

interface FlameParticle {
  id: number;
  emoji: string;
  left: number;
  delay: number;
}

export function DashboardClient({
  firstName,
  semester,
  branchFullName,
  role,
  initialStreak,
  unreadCount,
  pinnedAnnouncements,
  roadmapTotal,
  roadmapDone,
  roadmapPct,
  greeting,
  greetingEmoji,
}: DashboardClientProps) {
  const [activeMode, setActiveMode] = useState<FocusMode>("focus");
  const [streak, setStreak] = useState(initialStreak);
  const [claimedStreak, setClaimedStreak] = useState(false);
  const [checkInDone, setCheckInDone] = useState<boolean | null>(null);
  const [particles, setParticles] = useState<FlameParticle[]>([]);

  const mode = FOCUS_MODES[activeMode];

  function handleClaimStreak() {
    if (claimedStreak) {
      toast.info("Streak already boosted for today! Come back tomorrow 🔥");
      return;
    }
    setStreak((prev) => prev + 1);
    setClaimedStreak(true);
    toast.success("Streak Boosted! You are on fire 🔥");

    // Spawn 12 colorful dopamine fire/sparkle particles
    const emojis = ["🔥", "✨", "⚡", "🚀", "💥", "🎓"];
    const newParticles = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: Math.random() * 80 + 10, // Percent left
      delay: Math.random() * 0.4, // Staggered entry
    }));
    setParticles(newParticles);
  }

  // Clear particles after animation completes
  useEffect(() => {
    if (particles.length > 0) {
      const timer = setTimeout(() => setParticles([]), 1500);
      return () => clearTimeout(timer);
    }
  }, [particles]);

  function handleCheckIn(learned: boolean) {
    setCheckInDone(learned);
    if (learned) {
      toast.success(
        "Outstanding! Your future self will thank you for today's effort! 🌟🏆"
      );
    } else {
      toast.info(
        "Rest is important too! Re-charge and crush it tomorrow! 💤🔌"
      );
    }
  }

  const quickCards = [
    {
      title: "Lecture Notes",
      subtitle: "Class Notes & PDFs",
      description:
        "Get core class notes, slides, and handouts uploaded by teachers and senior students.",
      icon: BookOpen,
      href: "/notes",
      badge: "Study Materials",
      hue: {
        bg: "bg-blue-500/10",
        text: "text-blue-600 dark:text-blue-400",
        border: "border-blue-500/20",
        hoverBorder:
          "hover:border-blue-500/40 hover:shadow-blue-500/10 hover:shadow-lg",
        gradient:
          "from-blue-50/60 to-blue-100/10 dark:from-blue-950/20 dark:to-blue-900/5",
      },
    },
    {
      title: "Past Papers (PYQs)",
      subtitle: "Previous Year Questions",
      description:
        "Practice with actual midterm and end-term exam papers from previous semesters.",
      icon: FileText,
      href: "/pyqs",
      badge: "Exam Archive",
      hue: {
        bg: "bg-amber-500/10",
        text: "text-amber-600 dark:text-amber-400",
        border: "border-amber-500/20",
        hoverBorder:
          "hover:border-amber-500/40 hover:shadow-amber-500/10 hover:shadow-lg",
        gradient:
          "from-amber-50/60 to-amber-100/10 dark:from-amber-950/20 dark:to-amber-900/5",
      },
    },
    {
      title: "Academic Roadmap",
      subtitle: `${roadmapDone}/${roadmapTotal} Chapters Completed`,
      description:
        "Track your subject syllabus, check off topics, and see exactly what's left to cover.",
      icon: Compass,
      href: "/roadmap",
      badge: `${roadmapPct}% Checked`,
      hue: {
        bg: "bg-emerald-500/10",
        text: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-500/20",
        hoverBorder:
          "hover:border-emerald-500/40 hover:shadow-emerald-500/10 hover:shadow-lg",
        gradient:
          "from-emerald-50/60 to-emerald-100/10 dark:from-emerald-950/20 dark:to-emerald-900/5",
      },
    },
    {
      title: "College Notices",
      subtitle:
        unreadCount > 0 ? `${unreadCount} unread notices` : "All caught up",
      description:
        "Read important news, exam registrations, schedules, and alerts from your college.",
      icon: Bell,
      href: "/announcements",
      badge: "Notice Board",
      hue: {
        bg: "bg-purple-500/10",
        text: "text-purple-600 dark:text-purple-400",
        border: "border-purple-500/20",
        hoverBorder:
          "hover:border-purple-500/40 hover:shadow-purple-500/10 hover:shadow-lg",
        gradient:
          "from-purple-50/60 to-purple-100/10 dark:from-purple-950/20 dark:to-purple-900/5",
      },
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 🧪 Creative Design Spell Animations Injection Block */}
      <style>{`
        @keyframes float-slower {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.05); }
        }
        @keyframes float-faster {
          0%, 100% { transform: translateY(0px) scale(1.05); }
          50% { transform: translateY(-10px) scale(1); }
        }
        @keyframes glow-pulse {
          0%, 100% { filter: drop-shadow(0 0 15px rgba(245,158,11,0.3)); }
          50% { filter: drop-shadow(0 0 25px rgba(245,158,11,0.6)); }
        }
        @keyframes particle-float-up {
          0% { transform: translateY(15px) scale(0.5); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.8; }
          100% { transform: translateY(-70px) scale(1.2); opacity: 0; }
        }
        .animate-float-slower {
          animation: float-slower 9s ease-in-out infinite;
        }
        .animate-float-faster {
          animation: float-faster 7s ease-in-out infinite;
        }
        .animate-glow-pulse {
          animation: glow-pulse 3s ease-in-out infinite;
        }
        .animate-particle {
          animation: particle-float-up 1.2s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }
      `}</style>

      {/* 🌟 Redesigned Header: Glassmorphism layout with floating glass orbs */}
      <section
        className={`relative overflow-hidden rounded-3xl border bg-card p-6 sm:p-8 shadow-sm transition-all duration-700 ${mode.gradient}`}
      >
        {/* Soft Glowing Orbs (Floating & pulsating dynamically based on focus mode) */}
        <div
          className={`absolute -right-20 -top-20 w-80 h-80 rounded-full transition-all duration-700 pointer-events-none blur-3xl animate-float-slower ${mode.glowingOrb}`}
        />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none animate-float-faster" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider font-mono">
                Student Workspace
              </span>
            </div>

            {/* Interactive Mode Picker Selector */}
            <div className="flex flex-wrap items-center gap-1.5 bg-muted/80 p-1 rounded-2xl border border-border/80 relative z-20">
              {(Object.keys(FOCUS_MODES) as FocusMode[]).map((key) => {
                const isSelected = activeMode === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveMode(key);
                      toast.success(
                        `Mode changed to: ${FOCUS_MODES[key].label}! ${FOCUS_MODES[key].emoji}`
                      );
                    }}
                    className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-card text-foreground shadow-sm scale-[1.03]"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{FOCUS_MODES[key].emoji}</span>
                    <span className="hidden sm:inline">
                      {FOCUS_MODES[key].label.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground transition-all">
              {greeting}, {firstName}! {greetingEmoji}
            </h1>

            {/* Dynamic Interactive Encouragement Mantra Block */}
            <div
              className={`p-4 rounded-2xl border transition-all duration-500 flex items-start gap-3 ${mode.accent} ${mode.shadow}`}
            >
              <span className="text-xl shrink-0 mt-0.5">{mode.emoji}</span>
              <div className="space-y-1">
                <p className="text-xs font-mono font-bold uppercase tracking-wider opacity-70">
                  Focus Goal
                </p>
                <p className="text-xs sm:text-sm font-bold leading-relaxed">
                  {mode.mantra}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground/80 max-w-2xl leading-relaxed pt-1">
              Currently syncing study materials for **Semester {semester}** in
              **{branchFullName}**.
            </p>
          </div>
        </div>
      </section>

      {/* 📊 Dopamine-Driven Interactive Streaks & Notices Widgets */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Streak Boost Widget */}
        <div className="bg-card border border-border hover:border-border/80 rounded-2xl p-6 flex flex-col justify-between space-y-5 transition-all duration-300 hover:shadow-md relative overflow-hidden">
          {/* Confetti Particle Sparkles render block */}
          {particles.map((p) => (
            <span
              key={p.id}
              className="absolute text-xl pointer-events-none select-none animate-particle"
              style={{
                left: `${p.left}%`,
                bottom: "40px",
                animationDelay: `${p.delay}s`,
              }}
            >
              {p.emoji}
            </span>
          ))}

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
                Habit Builder
              </span>
              <h3 className="font-bold text-sm text-foreground">
                Your Study Streak
              </h3>
            </div>
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-500 ${
                claimedStreak
                  ? "bg-red-500/20 text-red-500 scale-120 animate-glow-pulse"
                  : "bg-amber-500/10 text-amber-500"
              }`}
            >
              <Flame
                className={`w-5 h-5 ${claimedStreak ? "animate-pulse" : ""}`}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-black tracking-tight text-foreground flex items-baseline gap-1.5 transition-all">
              {streak}
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider font-mono">
                Days Hot
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {claimedStreak
                ? "Daily streak claimed! Keep the flame burning bright tomorrow!"
                : "You haven't checked in today. Click below to claim your study streak boost!"}
            </p>
          </div>

          {/* Dopamine claim button */}
          <button
            onClick={handleClaimStreak}
            className={`w-full py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm border ${
              claimedStreak
                ? "bg-muted text-muted-foreground cursor-not-allowed border-border/40"
                : "bg-amber-500 hover:bg-amber-500/90 text-white hover:scale-[1.01] border-amber-600/20"
            }`}
          >
            <Zap
              className={`w-3.5 h-3.5 ${claimedStreak ? "" : "animate-bounce"}`}
            />
            {claimedStreak ? "Streak Boosted!" : "Claim Daily Boost! 🔥"}
          </button>
        </div>

        {/* Notices Summary Widget */}
        <div className="bg-card border border-border hover:border-border/80 rounded-2xl p-6 flex flex-col justify-between space-y-5 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
                College Bulletins
              </span>
              <h3 className="font-bold text-sm text-foreground">
                Updates & Notices
              </h3>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
              <Bell className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-black tracking-tight text-foreground flex items-baseline gap-1.5">
              {unreadCount}
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider font-mono">
                Unread
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {unreadCount > 0
                ? `You have ${unreadCount} new announcements from the department that need your review.`
                : "You are fully up to date with all announcements! No new actions required."}
            </p>
          </div>
          <Link
            href="/announcements"
            className="w-full py-2.5 bg-foreground hover:bg-foreground/90 text-background rounded-xl font-bold text-xs tracking-wider transition-all duration-300 hover:scale-[1.01] flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Open Notice Board</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 📌 Pinned Notices / Quick Announcements */}
      {pinnedAnnouncements.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h2 className="text-xs font-bold font-mono tracking-widest uppercase text-muted-foreground flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-amber-500" /> Pinned
              Announcements
            </h2>
            <Link
              href="/announcements"
              className="text-xs text-primary font-bold hover:underline"
            >
              See all notices
            </Link>
          </div>

          <div className="space-y-3">
            {pinnedAnnouncements.map((a) => (
              <div
                key={a.id}
                className="group bg-card border border-border/80 hover:border-border rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-xs transition-all duration-200"
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 shrink-0 mt-0.5">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <h3 className="text-sm font-bold tracking-wide text-foreground truncate group-hover:text-primary transition-colors">
                      {a.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed">
                      {a.content}
                    </p>
                  </div>
                </div>

                <Link
                  href="/announcements"
                  className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 shrink-0 pt-1 sm:pt-0"
                >
                  <span>Read Notice</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 🚀 Curated Study Bento Grid Portals */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-border/60 pb-3">
          <h2 className="text-xs font-bold font-mono tracking-widest uppercase text-muted-foreground">
            Study Directory
          </h2>
          <span className="text-xs text-muted-foreground/60 font-mono">
            Click on any directory below to start studying
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className={`group relative overflow-hidden bg-card border border-border rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:shadow-md transition-all duration-300 ${card.hue.hoverBorder}`}
            >
              {/* Background gradient block for custom card premium depth */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.hue.gradient} opacity-45 pointer-events-none`}
              />

              <div className="relative z-10 flex items-start justify-between gap-4">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.hue.bg} ${card.hue.text} border ${card.hue.border} transition-colors duration-300 shrink-0`}
                >
                  <card.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </div>
                <span
                  className={`text-[10px] font-bold font-mono tracking-wider uppercase border ${card.hue.border} ${card.hue.bg} ${card.hue.text} px-2.5 py-0.5 rounded-full`}
                >
                  {card.badge}
                </span>
              </div>

              <div className="relative z-10 space-y-2">
                <h3 className="text-lg font-extrabold text-foreground tracking-tight flex items-center gap-1.5 group-hover:text-primary transition-colors">
                  {card.title}
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </h3>
                <p className="text-xs font-bold text-muted-foreground/60 font-mono">
                  {card.subtitle}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                  {card.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 🏆 Level-Up Progress Card */}
      {roadmapTotal > 0 && (
        <section className="relative overflow-hidden bg-muted/30 border border-border rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0">
                  <Check className="h-4 w-4 stroke-[2.5]" />
                </div>
                <h3 className="text-xs font-bold tracking-wider uppercase text-muted-foreground font-mono">
                  Syllabus Roadmap Progress
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
                You have completed **{roadmapDone} out of {roadmapTotal}** key
                milestones for Semester {semester}. You are doing great! Keep
                leveling up!
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0 self-start md:self-center">
              <div className="text-right">
                <div className="text-2xl font-black text-emerald-600 font-mono">
                  {roadmapPct}%
                </div>
                <div className="text-[9px] font-bold font-mono text-muted-foreground/60 uppercase tracking-widest">
                  Completed
                </div>
              </div>
              <Link
                href="/roadmap"
                className="bg-foreground hover:bg-foreground/90 text-background text-xs font-bold tracking-wide px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 group"
              >
                <span>Track Progress</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* Smooth custom glowing progress tracker bar */}
          <div className="relative h-2 w-full bg-muted border border-border/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${roadmapPct}%` }}
            />
          </div>
        </section>
      )}

      {/* ⚡ Highly Addictive "Daily Check-In" Micro-Quiz Section */}
      <section className="bg-card border border-border rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-5 hover:shadow-xs transition-all">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 shrink-0">
            <Trophy className="w-5 h-5 animate-bounce" />
          </div>
          <div className="text-left space-y-0.5">
            <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
              Daily Check-In
            </p>
            <p className="text-sm font-bold text-foreground">
              Did you study or learn anything new today?
            </p>
            <p className="text-xs text-muted-foreground">
              A quick review, reading announcements, or downloading PYQs counts!
            </p>
          </div>
        </div>

        {checkInDone === null ? (
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => handleCheckIn(true)}
              className="flex-1 sm:flex-none text-xs font-bold px-4 py-2 bg-emerald-500 hover:bg-emerald-500/90 text-white rounded-xl transition-all hover:scale-[1.02]"
            >
              Yes! 👍
            </button>
            <button
              onClick={() => handleCheckIn(false)}
              className="flex-1 sm:flex-none text-xs font-bold px-4 py-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-xl transition-all hover:scale-[1.02]"
            >
              Resting 😴
            </button>
          </div>
        ) : (
          <div className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 shrink-0 flex items-center gap-1.5 animate-in zoom-in duration-300">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Check-in registered!</span>
          </div>
        )}
      </section>

      {/* 💡 Supportive Encouraging Tip Section */}
      <div className="bg-card border border-dashed border-border p-5 rounded-2xl flex items-center gap-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div className="text-left">
          <p className="text-xs font-bold text-foreground">
            Study Tip of the Day
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            Reviewing past year questions (PYQs) before diving deep into lecture
            notes is the fastest way to understand what topics are most
            important for exams!
          </p>
        </div>
      </div>
    </div>
  );
}
