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
  Users,
  BookOpen,
  Clock,
  Fingerprint,
  Lock,
  GraduationCap,
  MessageSquare,
  Star,
  Zap,
  ChevronDown,
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

      {/* Integrated Header */}
      <header className="absolute top-0 left-0 right-0 w-full z-50 py-8">
        <div className="container mx-auto px-6 flex items-center justify-between max-w-7xl">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl md:text-3xl font-black tracking-tighter bg-gradient-to-r from-foreground via-foreground/90 to-foreground/75 bg-clip-text text-transparent group-hover:opacity-85 transition-opacity">
              CampusCore
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/demo">
              <Button
                size="sm"
                variant="ghost"
                className="text-xs font-bold h-9 px-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-all duration-200 cursor-pointer text-foreground"
              >
                View Demo
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="sm"
                className="text-xs font-bold h-9 px-4 rounded-xl transition-all duration-200 cursor-pointer"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Premium Hero Section */}
        <section className="px-6 pt-20 pb-16 md:pt-32 md:pb-24 max-w-6xl mx-auto text-center relative">
          {/* Subtle Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-primary/10 to-accent/20 rounded-full blur-[120px] pointer-events-none -z-10" />

          {/* Version Notice Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-muted/40 border border-border/50 text-xs font-medium text-muted-foreground mb-8 animate-fade-in-up hover:bg-muted/60 transition-colors cursor-default backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-foreground font-semibold">
              Official Academic Portal
            </span>
            <span className="text-border">|</span>
            <span>Sir Padampat Singhania University</span>
          </div>

          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-balance leading-[1.05] mb-6 animate-fade-in-up"
            style={{ animationDelay: "0.05s" }}
          >
            Your academic life, <br />
            <span className="bg-gradient-to-br from-foreground via-foreground/80 to-muted-foreground bg-clip-text text-transparent">
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
                className="w-full sm:w-auto h-13 px-8 rounded-xl text-base shadow-lg shadow-primary/10 hover:scale-[1.02] transition-all duration-200 font-semibold"
              >
                Create Student Account <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/demo" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-13 px-8 rounded-xl text-base hover:bg-muted/50 border-border/80 transition-all duration-200 font-semibold text-foreground cursor-pointer bg-background"
              >
                View Demo
              </Button>
            </Link>
          </div>

          {/* Removed Avatar Social Proof as requested */}
          <div className="mt-14" />

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

        {/* Metrics & Impact Section */}
        <section className="py-20 px-6 bg-muted/30 border-y border-border/40">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
              {[
                { label: "Verified Students", value: "1,200+", icon: Users },
                { label: "Study Materials", value: "450+", icon: BookOpen },
                { label: "Course Roadmaps", value: "50+", icon: Map },
                { label: "Platform Uptime", value: "99.9%", icon: Zap },
              ].map((stat, i) => (
                <div key={i} className="space-y-3">
                  <div className="mx-auto h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div className="text-3xl md:text-4xl font-black tracking-tighter text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 px-6 max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <div className="text-xs font-bold text-primary tracking-widest uppercase">
              Seamless Onboarding
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-balance">
              Three steps to academic clarity.
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
              No complex setup. Just authenticate your student identity and
              start exploring.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-transparent via-border to-transparent -z-10" />

            {[
              {
                step: "01",
                title: "Verify Identity",
                desc: "Sign up securely using your official university roll number and credentials.",
                icon: Fingerprint,
              },
              {
                step: "02",
                title: "Select Branch",
                desc: "Choose your engineering branch and current semester to personalize your feed.",
                icon: Layers,
              },
              {
                step: "03",
                title: "Access Resources",
                desc: "Instantly unlock faculty-verified notes, roadmaps, and previous year papers.",
                icon: Lock,
              },
            ].map((step, i) => (
              <div
                key={i}
                className="relative bg-card border border-border/60 rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="mx-auto h-16 w-16 rounded-2xl bg-background border border-border/80 shadow-sm flex items-center justify-center mb-6 relative group">
                  <step.icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                  <span className="absolute -top-3 -right-3 h-7 w-7 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center border-2 border-background">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Grid (Wall of Love) */}
        <section className="py-24 px-6 bg-muted/20 border-y border-border/40">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-3">
              <div className="text-xs font-bold text-primary tracking-widest uppercase">
                Wall of Love
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-balance">
                Trusted by top SPSU students.
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  quote:
                    "CampusCore completely changed how I prepare for mid-terms. Having all the PYQs in one verified place saves me hours of asking around.",
                  author: "Aditi S.",
                  role: "CSE, 6th Semester",
                },
                {
                  quote:
                    "The roadmaps feature is incredible. I finally know exactly which prerequisites I need to clear before taking advanced electives.",
                  author: "Rahul M.",
                  role: "ECE, 4th Semester",
                },
                {
                  quote:
                    "No more scrolling through WhatsApp groups to find that one PDF from last month. It's clean, fast, and beautifully designed.",
                  author: "Priya K.",
                  role: "CSE, 8th Semester",
                },
              ].map((testimonial, i) => (
                <div
                  key={i}
                  className="bg-background border border-border/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className="h-4 w-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-foreground leading-relaxed mb-6 italic">
                      &quot;{testimonial.quote}&quot;
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground">
                        {testimonial.author}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-6 max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              Everything you need to know about the CampusCore platform.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Is CampusCore officially affiliated with SPSU?",
                a: "Yes, CampusCore is designed specifically for SPSU students and faculty. All academic resources (notes, roadmaps, PYQs) are verified by respective department heads before publishing to ensure strict syllabus compliance.",
              },
              {
                q: "Can I upload my own study notes?",
                a: "Currently, only verified faculty members and authorized department representatives can upload official materials. This strict policy ensures 100% accuracy and eliminates misinformation during exam season.",
              },
              {
                q: "Is my personal data secure?",
                a: "Absolutely. We enforce granular security firewalls and strictly comply with India's DPDP Act 2023. We only store minimal data necessary for academic authentication.",
              },
              {
                q: "How do I get an account?",
                a: "Simply click 'Create Student Account', verify your official SPSU roll number, and set up your profile. It takes less than 60 seconds.",
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group bg-card border border-border/60 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden cursor-pointer"
              >
                <summary className="flex items-center justify-between p-6 text-base font-semibold text-foreground hover:bg-muted/30 transition-colors">
                  <span>{faq.q}</span>
                  <ChevronDown className="h-5 w-5 text-muted-foreground group-open:rotate-180 transition-transform duration-300" />
                </summary>
                <div className="px-6 pb-6 pt-2 text-sm text-muted-foreground leading-relaxed border-t border-border/40 bg-muted/10">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Premium CTA Section */}
        <section className="border-t border-border/60 py-24 px-6 bg-foreground text-background text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="max-w-3xl mx-auto space-y-8 relative z-10">
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-black tracking-tighter text-background">
                CampusCore
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
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
              <Link href="/demo">
                <Button
                  size="lg"
                  variant="ghost"
                  className="h-13 px-6 rounded-xl text-base text-muted-foreground hover:text-background hover:bg-white/10 transition-all duration-200"
                >
                  View Demo
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
        <section
          id="privacy-section"
          className="border-t border-border/40 py-20 px-6 max-w-4xl mx-auto"
        >
          <div className="space-y-6 text-center mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
              Privacy & Data Protection
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Your Data is Completely Safe
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              We design with privacy at the core. CampusCore strictly complies
              with India&apos;s Digital Personal Data Protection (DPDP) Act
              2023. We only collect details essential to serving university
              notes and securing student resources.
            </p>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto border border-border/60 rounded-2xl p-6 bg-card text-left">
            {/* Accordion 1 */}
            <details
              className="group border-b border-border/40 pb-4 [&_summary::-webkit-details-marker]:hidden cursor-pointer"
              open
            >
              <summary className="flex items-center justify-between text-sm font-semibold text-foreground transition-colors hover:text-primary">
                <span>1. What Personal Information We Process</span>
                <span className="ml-1.5 shrink-0 rounded-lg bg-muted p-1 text-muted-foreground group-open:rotate-180 transition-transform duration-200">
                  <svg
                    className="h-4 w-4 stroke-[1.5]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
              </summary>
              <div className="mt-3 leading-relaxed text-xs text-muted-foreground space-y-2 pl-1 transition-all duration-300">
                <p>
                  To verify your enrollment at Sir Padampat Singhania University
                  (SPSU) and tailor your experience, we process:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>
                    <strong>Student Identity Details:</strong> Full name,
                    official university email address, registry roll number,
                    branch/department, admission year, and current semester.
                  </li>
                  <li>
                    <strong>Activity Logs:</strong> Timestamped downloads of
                    notes/PYQs and checklist completions on interactive
                    roadmaps.
                  </li>
                </ul>
              </div>
            </details>

            {/* Accordion 2 */}
            <details className="group border-b border-border/40 py-4 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
              <summary className="flex items-center justify-between text-sm font-semibold text-foreground transition-colors hover:text-primary">
                <span>2. Explicit Academic Processing Purpose</span>
                <span className="ml-1.5 shrink-0 rounded-lg bg-muted p-1 text-muted-foreground group-open:rotate-180 transition-transform duration-200">
                  <svg
                    className="h-4 w-4 stroke-[1.5]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
              </summary>
              <div className="mt-3 leading-relaxed text-xs text-muted-foreground space-y-2 pl-1">
                <p>
                  We strictly process your data for the following essential
                  university operations:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>
                    Restricting document access to registered, authenticated
                    students based on their actual semester and department
                    requirements.
                  </li>
                  <li>
                    Generating secure, signed, and time-limited preview links
                    for faculty notes via private Cloudinary buckets to prevent
                    external hotlinking.
                  </li>
                  <li>
                    Compiling aggregate, fully anonymous resource analytics to
                    highlight the most highly demanded syllabus study guides
                    before examinations.
                  </li>
                </ul>
              </div>
            </details>

            {/* Accordion 3 */}
            <details className="group border-b border-border/40 py-4 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
              <summary className="flex items-center justify-between text-sm font-semibold text-foreground transition-colors hover:text-primary">
                <span>3. Right to Erasure & Complete Purge</span>
                <span className="ml-1.5 shrink-0 rounded-lg bg-muted p-1 text-muted-foreground group-open:rotate-180 transition-transform duration-200">
                  <svg
                    className="h-4 w-4 stroke-[1.5]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
              </summary>
              <div className="mt-3 leading-relaxed text-xs text-muted-foreground space-y-2 pl-1">
                <p>
                  Under India&apos;s DPDP Act 2023, you hold absolute authority
                  over your data. You can request a complete, permanent, and
                  instantaneous deletion of your account and metadata at any
                  time.
                </p>
                <p>
                  Initiating deletion inside your{" "}
                  <strong>Profile Settings Danger Zone</strong> instantly runs a
                  cascade deletion trigger across Supabase PostgreSQL databases,
                  wiping your auth session, student profile, roadmap checklist
                  states, and download traces permanently and irreversibly.
                </p>
              </div>
            </details>

            {/* Accordion 4 */}
            <details className="group border-b border-border/40 py-4 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
              <summary className="flex items-center justify-between text-sm font-semibold text-foreground transition-colors hover:text-primary">
                <span>4. Safe Third-Party Infrastructure</span>
                <span className="ml-1.5 shrink-0 rounded-lg bg-muted p-1 text-muted-foreground group-open:rotate-180 transition-transform duration-200">
                  <svg
                    className="h-4 w-4 stroke-[1.5]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
              </summary>
              <div className="mt-3 leading-relaxed text-xs text-muted-foreground space-y-2 pl-1">
                <p>
                  We utilize only secure, world-class storage and application
                  services under strict data protection protocols. No data is
                  traded or shared:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>
                    <strong>Supabase:</strong> Encrypted authentication, active
                    Row-Level Security (RLS), and database hosting.
                  </li>
                  <li>
                    <strong>Cloudinary:</strong> Private study document delivery
                    via secure 1-hour signed URLs.
                  </li>
                  <li>
                    <strong>Resend:</strong> Routing student suggestions
                    directly to the development team securely.
                  </li>
                  <li>
                    <strong>Sentry:</strong> Fully anonymous, diagnostic
                    instrumentation to identify errors and ensure portal uptime.
                  </li>
                </ul>
              </div>
            </details>

            {/* Accordion 5 */}
            <details className="group pt-4 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
              <summary className="flex items-center justify-between text-sm font-semibold text-foreground transition-colors hover:text-primary">
                <span>5. Contacts, Grievances, & Support</span>
                <span className="ml-1.5 shrink-0 rounded-lg bg-muted p-1 text-muted-foreground group-open:rotate-180 transition-transform duration-200">
                  <svg
                    className="h-4 w-4 stroke-[1.5]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
              </summary>
              <div className="mt-3 leading-relaxed text-xs text-muted-foreground space-y-2 pl-1">
                <p>
                  For data correction requests, compliance queries, or policy
                  grievances, please reach out. All security inquiries are
                  handled directly:
                </p>
                <p className="font-semibold text-foreground">Security Team</p>
              </div>
            </details>
          </div>
        </section>
      </main>

      {/* Premium Footer */}
      <footer className="border-t border-border/40 py-12 px-6 bg-background">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity"
          >
            <span className="text-lg font-black tracking-tighter bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              CampusCore
            </span>
            <span className="h-1 w-1 rounded-full bg-primary" />
          </Link>

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
              href="/demo"
              className="hover:text-foreground transition-colors"
            >
              View Demo
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
