import Link from "next/link";
import {
  Scale,
  ArrowLeft,
  Calendar,
  BookOpen,
  AlertTriangle,
} from "lucide-react";

export const metadata = {
  title: "Terms of Service | CampusCore SPSU",
  description:
    "Official terms of service and academic resource code of conduct for CampusCore SPSU.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background text-[#37352F] antialiased">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-50" />

      {/* Navigation Header */}
      <header className="border-b border-[#EAEAEA] bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-[#787774] hover:text-[#37352F] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Portal
          </Link>
          <div className="flex items-center gap-2 font-medium tracking-tight">
            <span className="h-6 w-6 rounded-md bg-[#37352F] text-white flex items-center justify-center font-bold text-xs">
              C
            </span>
            <span>CampusCore</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-12 md:py-16 relative">
        <div className="space-y-8">
          {/* Header section */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-xs font-medium">
              <Scale className="h-3.5 w-3.5" />
              Terms of Service
            </div>
            <h1 className="text-3.5xl font-bold tracking-tight text-[#37352F]">
              Academic Portal Terms & Conditions
            </h1>
            <p className="text-sm text-[#787774] flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Effective Date: May 27, 2026 · SPSU Student Code of Conduct Rules
              Apply
            </p>
          </div>

          <hr className="border-[#EAEAEA]" />

          {/* Warning Banner */}
          <div className="p-5 rounded-xl bg-amber-50/50 border border-amber-200/50 text-sm leading-relaxed text-[#6E531C] space-y-2">
            <div className="flex items-center gap-2 font-semibold text-[#8B6A26]">
              <AlertTriangle className="h-4.5 w-4.5" />
              Important Academic Disclaimer:
            </div>
            <p>
              CampusCore is an official academic resource tool hosted
              exclusively for current students and faculty of Sir Padampat
              Singhania University (SPSU). Usage is strictly regulated by the
              University&apos;s IT policies and academic integrity regulations.
            </p>
          </div>

          {/* Detailed Clauses */}
          <div className="space-y-8">
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-[#37352F] tracking-tight">
                1. Eligibility & Account Security
              </h2>
              <p className="text-sm text-[#5F5E5B] leading-relaxed">
                To access CampusCore, you must be a registered student or active
                faculty member of SPSU. During standard signup, you are required
                to verify your enrollment with your official student email and
                valid roll number.
              </p>
              <ul className="list-disc list-inside text-sm text-[#5F5E5B] space-y-1.5 pl-2 leading-relaxed">
                <li>
                  You are solely responsible for maintaining the confidentiality
                  of your credentials.
                </li>
                <li>
                  Sharing your account credentials with anyone outside SPSU is
                  strictly prohibited and constitutes a violation of IT
                  policies.
                </li>
                <li>
                  If you notice unauthorized access to your account, notify the
                  IT Helpdesk immediately.
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-[#37352F] tracking-tight">
                2. Acceptable Use Policy
              </h2>
              <p className="text-sm text-[#5F5E5B] leading-relaxed">
                CampusCore provides lecture notes, roadmaps, and previous year
                exam questions (PYQs) to support your education. When utilizing
                these materials:
              </p>
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-[#EAEAEA] space-y-2">
                  <h3 className="text-sm font-semibold text-[#37352F] flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-amber-600" />
                    Allowed Actions
                  </h3>
                  <p className="text-xs text-[#787774] leading-relaxed">
                    Downloading and previewing resources for personal exam
                    preparation, research, and classroom discussions.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-red-100 bg-red-50/20 space-y-2">
                  <h3 className="text-sm font-semibold text-red-800 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    Prohibited Actions
                  </h3>
                  <p className="text-xs text-red-700 leading-relaxed">
                    Using automated scraping tools, web downloaders, or scripts
                    to bulk-download resources. Violating this triggers
                    automated IP banning under our rate limit policies.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-[#37352F] tracking-tight">
                3. Intellectual Property Rights
              </h2>
              <p className="text-sm text-[#5F5E5B] leading-relaxed">
                All lecture files, presentation slides, notes, and study
                roadmaps uploaded by instructors belong exclusively to SPSU,
                respective faculty, or their respective copyright holders.
              </p>
              <ul className="list-disc list-inside text-sm text-[#5F5E5B] space-y-1.5 pl-2 leading-relaxed">
                <li>
                  You may not republish, sell, host publicly (e.g. on public
                  GitHub repos, Scribd, or StuDocu), or distribute these files
                  outside the university portal.
                </li>
                <li>
                  If you are an author of a resource and believe your copyright
                  has been infringed, please write to us for correction or
                  removal.
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-[#37352F] tracking-tight">
                4. Limitations of Liability
              </h2>
              <p className="text-sm text-[#5F5E5B] leading-relaxed">
                The resources provided are meant to act as supplementary study
                aids. While we strive to verify all uploads through respective
                department heads, SPSU does not guarantee that the materials are
                100% complete, error-free, or match the exact syllabus of every
                exam.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-[#37352F] tracking-tight">
                5. Account Termination
              </h2>
              <p className="text-sm text-[#5F5E5B] leading-relaxed">
                We reserve the right to temporarily suspend or permanently
                terminate portal access to any user found violating these terms,
                bypassing security headers, or attempting admin privilege
                escalation.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#EAEAEA] bg-white py-8">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-xs text-[#787774] gap-4">
          <p>
            © {new Date().getFullYear()} Sir Padampat Singhania University. All
            rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-[#37352F] underline">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-[#37352F] underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
