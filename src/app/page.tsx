import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  LayoutTemplate,
  ShieldCheck,
  Map,
  FileText,
  CheckCircle2,
  Sparkles,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { InteractivePreview } from "@/components/landing/interactive-preview";

export const metadata: Metadata = {
  title: "CampusCore SPSU — Sir Padampat Singhania University Student Portal",
  description:
    "The connected digital academic workspace for Sir Padampat Singhania University (SPSU). Get instant access to faculty-verified lecture notes, past exam question papers (PYQs), interactive roadmaps, and official college announcements.",
  keywords: [
    "SPSU campuscore",
    "CampusCore SPSU portal",
    "SPSU student hub",
    "Sir Padampat Singhania University student portal",
    "SPSU lecture notes",
    "SPSU previous year question papers",
    "SPSU PYQ",
    "SPSU academic workspace",
    "SPSU roadmaps",
    "SPSU announcements",
    "SPSU engineering resources",
    "Sir Padampat Singhania University notes",
  ],
  openGraph: {
    title: "CampusCore SPSU — Sir Padampat Singhania University Student Portal",
    description:
      "A Notion-inspired connected student workspace for Sir Padampat Singhania University (SPSU). Access college lecture notes, PYQs, and semester roadmaps in one place.",
    type: "website",
  },
};

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const schemaJson = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://campuscore.systems/#website",
        url: "https://campuscore.systems",
        name: "CampusCore SPSU",
        description:
          "Sir Padampat Singhania University official student academic hub and resource portal.",
        publisher: {
          "@id": "https://campuscore.systems/#organization",
        },
        inLanguage: "en-IN",
      },
      {
        "@type": "Organization",
        "@id": "https://campuscore.systems/#organization",
        name: "CampusCore SPSU",
        url: "https://campuscore.systems",
        logo: {
          "@type": "ImageObject",
          url: "https://campuscore.systems/favicon.ico",
        },
        sameAs: ["https://www.spsu.ac.in", "https://github.com/campuscore"],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      {/* Premium Minimalist Header */}
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/40 transition-all duration-300">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-7xl relative">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-foreground text-background flex items-center justify-center shadow-inner group transition-transform hover:scale-105">
              <span className="text-sm font-bold font-serif tracking-tighter">
                C
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight leading-none">
                CampusCore
              </span>
              <span className="text-[10px] text-primary font-mono tracking-wider font-semibold uppercase mt-0.5">
                Academic Hub
              </span>
            </div>
          </div>

          {/* Centered Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground absolute left-1/2 -translate-x-1/2">
            <Link
              href="/resources"
              className="hover:text-foreground transition-colors"
            >
              Resources
            </Link>
            <Link
              href="/roadmap"
              className="hover:text-foreground transition-colors"
            >
              Roadmaps
            </Link>
            <Link
              href="/announcements"
              className="hover:text-foreground transition-colors"
            >
              Announcements
            </Link>
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard">
                <Button
                  size="sm"
                  className="h-9 rounded-xl px-4 shadow-sm font-medium hover:scale-[1.02] transition-all"
                >
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <Link
                  href="/login"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
                >
                  Log in
                </Link>
                <Link href="/signup">
                  <Button
                    size="sm"
                    className="h-9 rounded-xl px-4 shadow-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition-all"
                  >
                    Register Account
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Premium Hero Section */}
        <section className="px-6 pt-20 pb-16 md:pt-32 md:pb-24 max-w-6xl mx-auto text-center relative">
          {/* Subtle Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-primary/10 to-accent/20 rounded-full blur-[120px] pointer-events-none -z-10" />

          {/* Version Notice Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-muted/60 border border-border/80 text-xs font-medium text-muted-foreground mb-8 animate-fade-in-up">
            <span className="flex h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-foreground font-semibold">
              Official Academic Portal
            </span>
            <span className="text-border">|</span>
            <span>Sir Padampat Singhania University</span>
          </div>

          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-balance leading-[1.05] mb-6 animate-fade-in-up"
            style={{ animationDelay: "0.05s" }}
          >
            Your academic life, <br />
            <span className="bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
              beautifully organized.
            </span>
          </h1>

          <p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed mb-10 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            CampusCore is the secure digital hub where Sir Padampat Singhania
            University students access faculty-verified notes, study roadmaps,
            and official campus announcements.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 animate-fade-in-up"
            style={{ animationDelay: "0.15s" }}
          >
            <Link
              href={user ? "/dashboard" : "/signup"}
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                className="w-full sm:w-auto h-12 px-8 rounded-xl text-base shadow-lg shadow-primary/10 hover:scale-[1.02] transition-all duration-200 font-medium"
              >
                Create Student Account <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link
              href={user ? "/admin" : "/login?type=admin"}
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-12 px-8 rounded-xl text-base hover:bg-muted/50 border-border/80 transition-all duration-200"
              >
                <ShieldCheck className="mr-2 h-4 w-4 text-primary" /> Admin
                Portal
              </Button>
            </Link>
          </div>

          {/* Subtle Trust Indicators */}
          <div
            className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-medium text-muted-foreground/80 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />{" "}
              <span>Granular Security Firewalls</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />{" "}
              <span>Zero-Trust PDF Isolation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />{" "}
              <span>Hardened Edge Routing Proxy</span>
            </div>
          </div>

          {/* Interactive Live Demonstration App Preview */}
          <InteractivePreview />
        </section>

        {/* Premium Value Prop Bento Grid */}
        <section className="border-t border-border/60 bg-muted/10 py-24 px-6 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-3">
              <div className="text-xs font-bold text-primary tracking-widest uppercase">
                Uncompromised Clarity
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-balance">
                Everything you need. Nothing you don&apos;t.
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
                Built specifically for high-performing engineering students to
                eliminate fragmented Google Drives and chat group noise.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: FileText,
                  badge: "Module 01",
                  title: "Verified Resources",
                  desc: "Access carefully curated notes, lab manuals, and PYQs uploaded directly by faculty and verified department heads.",
                  metrics: "SHA-256 integrity checks",
                },
                {
                  icon: Map,
                  badge: "Module 02",
                  title: "Structured Roadmaps",
                  desc: "Follow semester-specific learning paths. Track your completion progress in real-time and secure foundational prerequisites.",
                  metrics: "Live reactive storage",
                },
                {
                  icon: ShieldCheck,
                  badge: "Module 03",
                  title: "Official Bulletins",
                  desc: "Stay updated with priority-pinned notices. Filter out background noise with dedicated, timestamped administrative alerts.",
                  metrics: "Zero anonymous access",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="bg-card border border-border/80 rounded-2xl p-8 shadow-sm hover:shadow-md hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                        <feature.icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-mono tracking-wider font-semibold px-2.5 py-1 rounded-md bg-muted text-muted-foreground border border-border/60">
                        {feature.badge}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                      {feature.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border/40 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Sparkles className="h-3 w-3 text-primary shrink-0" />
                    <span>{feature.metrics}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Feature Focus Section */}
        <section className="py-24 px-6 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
                <LayoutTemplate className="h-3.5 w-3.5" /> Synchronous
                Architecture
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-balance leading-tight">
                Engineered for student success.
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                CampusCore is built for speed and reliability, ensuring zero lag
                and instantaneous document previewing. Every study material and
                notice is verified and digitally signed by authorized department
                representatives before publishing.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {[
                  {
                    title: "Secure Institutional Login",
                    desc: "Protected by robust student authentication.",
                  },
                  {
                    title: "Faculty Verified Resources",
                    desc: "Double-checked for syllabus relevance.",
                  },
                  {
                    title: "Mobile-Responsive Hub",
                    desc: "Study seamlessly on mobile, tablet, or desktop.",
                  },
                  {
                    title: "Instant Document Previews",
                    desc: "Open study guides instantly without local downloads.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-foreground">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Complement Container */}
            <div className="flex-1 w-full relative">
              <div className="aspect-square rounded-full bg-primary/5 absolute -inset-4 blur-3xl z-0" />
              <div className="bg-card border border-border rounded-2xl p-8 shadow-xl relative z-10 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-border/60">
                  <div className="text-xs font-bold font-mono">
                    ACADEMIC_PORTAL_STATUS
                  </div>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <div className="space-y-4 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Database Status
                    </span>
                    <span className="text-emerald-600 font-semibold">
                      SPSU Node Online
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Faculty Verification
                    </span>
                    <span className="text-foreground">Signatures Synced</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Document Encryptor
                    </span>
                    <span className="text-primary font-semibold">
                      Secure Sandbox Active
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-3">
                  <Layers className="h-5 w-5 text-primary shrink-0" />
                  <p className="text-[11px] text-muted-foreground leading-relaxed font-sans">
                    Fully integrated with official university departments and
                    course syllabi rules.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Premium CTA Section */}
        <section className="border-t border-border/60 py-24 px-6 bg-foreground text-background text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="max-w-3xl mx-auto space-y-8 relative z-10">
            <div className="h-14 w-14 rounded-2xl bg-background text-foreground flex items-center justify-center mx-auto shadow-2xl">
              <span className="text-2xl font-bold font-serif tracking-tighter">
                C
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              Access your academic portal today.
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto text-balance">
              Get immediate, authorized access to faculty-verified notes,
              curated roadmaps, and official campus notices.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="h-13 px-10 rounded-xl text-base font-semibold bg-background text-foreground hover:bg-muted shadow-xl hover:scale-[1.02] transition-all duration-200"
                >
                  Register Student Account
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="ghost"
                  className="h-13 px-6 rounded-xl text-base text-muted-foreground hover:text-background hover:bg-white/10 transition-all duration-200"
                >
                  Sign in existing
                </Button>
              </Link>
            </div>

            <div className="pt-6 text-xs text-muted-foreground/60 flex items-center justify-center gap-4">
              <span>Official Institutional Access</span>
              <span>•</span>
              <span>Secure Student Credentials</span>
            </div>
          </div>
        </section>
      </main>

      {/* Premium Footer */}
      <footer className="border-t border-border/40 py-12 px-6 bg-background">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5 opacity-90">
            <div className="h-6 w-6 rounded-lg bg-foreground text-background flex items-center justify-center">
              <span className="text-xs font-bold font-serif">C</span>
            </div>
            <span className="text-sm font-bold tracking-tight">CampusCore</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-muted-foreground">
            <Link
              href="/login"
              className="hover:text-foreground transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="hover:text-foreground transition-colors"
            >
              Register
            </Link>
            <Link
              href="/admin"
              className="hover:text-foreground transition-colors"
            >
              Admin Portal
            </Link>
            <Link
              href="/resources"
              className="hover:text-foreground transition-colors"
            >
              Resources
            </Link>
            <Link
              href="/dashboard"
              className="hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
          </div>

          <p className="text-xs text-muted-foreground font-mono">
            © 2026 Sir Padampat Singhania University. Powered by CampusCore.
          </p>
        </div>
      </footer>
    </div>
  );
}
