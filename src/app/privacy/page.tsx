import Link from "next/link";
import {
  Shield,
  ArrowLeft,
  Calendar,
  FileText,
  Trash2,
  Eye,
} from "lucide-react";

export const metadata = {
  title: "Privacy Policy | CampusCore SPSU",
  description:
    "Official privacy policy and user data management framework for CampusCore SPSU.",
};

export default function PrivacyPolicyPage() {
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
          <div className="flex items-center">
            <span className="text-base font-extrabold tracking-tight text-[#37352F]">
              CampusCore
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-12 md:py-16 relative">
        <div className="space-y-8">
          {/* Header section */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium">
              <Shield className="h-3.5 w-3.5" />
              Privacy Policy
            </div>
            <h1 className="text-3.5xl font-bold tracking-tight text-[#37352F]">
              Your Privacy & Data Safety
            </h1>
            <p className="text-sm text-[#787774] flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Effective Date: May 27, 2026 · Compliant with India&apos;s DPDP
              Act 2023
            </p>
          </div>

          <hr className="border-[#EAEAEA]" />

          {/* Intro Box */}
          <div className="p-5 rounded-xl bg-muted/50 border border-[#EAEAEA] text-sm leading-relaxed text-[#5F5E5B] space-y-2">
            <p className="font-semibold text-[#37352F]">
              Notion-inspired Data Commitment:
            </p>
            <p>
              CampusCore is the official academic portal of Sir Padampat
              Singhania University (SPSU). We believe in total transparency. We
              only collect data that is strictly essential for verifying your
              student identity and delivering academic notes, question papers,
              and official roadmaps.
            </p>
          </div>

          {/* Detailed Clauses */}
          <div className="space-y-8">
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-[#37352F] tracking-tight">
                1. What Information We Collect
              </h2>
              <p className="text-sm text-[#5F5E5B] leading-relaxed">
                When you create an account or verify your details through Google
                OAuth on CampusCore, we collect:
              </p>
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-[#EAEAEA] space-y-2">
                  <h3 className="text-sm font-semibold text-[#37352F] flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    Identity Details
                  </h3>
                  <p className="text-xs text-[#787774] leading-relaxed">
                    Full name, official student email address, enrollment roll
                    number, branch, year of admission, and current semester.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-[#EAEAEA] space-y-2">
                  <h3 className="text-sm font-semibold text-[#37352F] flex items-center gap-2">
                    <Eye className="h-4 w-4 text-green-500" />
                    Activity Logs
                  </h3>
                  <p className="text-xs text-[#787774] leading-relaxed">
                    Resource download counts, time-stamped downloads, and
                    announcements marked read to personalize your notifications.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-[#37352F] tracking-tight">
                2. Purpose of Processing
              </h2>
              <p className="text-sm text-[#5F5E5B] leading-relaxed">
                Your data is processed strictly for academic operations:
              </p>
              <ul className="list-disc list-inside text-sm text-[#5F5E5B] space-y-1.5 pl-2 leading-relaxed">
                <li>
                  Gating access to department-verified materials based on branch
                  and semester.
                </li>
                <li>
                  Generating secure, signed preview URLs for lecturers&apos;
                  resources.
                </li>
                <li>
                  Compiling anonymous analytics to help departments understand
                  which study guides are most requested.
                </li>
                <li>
                  Preventing malicious script automation via the built-in rate
                  limit firewall.
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-[#37352F] tracking-tight">
                3. Right to Erasure (Account Deletion)
              </h2>
              <div className="p-5 rounded-xl border border-[#EAEAEA] space-y-3">
                <p className="text-sm text-[#5F5E5B] leading-relaxed">
                  In compliance with the **Digital Personal Data Protection
                  (DPDP) Act 2023 (India)** and global privacy rules (GDPR), you
                  possess absolute authority over your records. You have the
                  right to request deletion of your data at any time.
                </p>
                <div className="flex items-start gap-3 p-3.5 rounded-lg bg-red-50 border border-red-100">
                  <Trash2 className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-red-700">
                      Permanent Purge Safeguard
                    </p>
                    <p className="text-xs text-red-600 leading-relaxed">
                      You can instantly initiate a full purge by visiting your
                      **Profile Settings → Danger Zone**. This permanently
                      deletes your login credentials, profile structure, and all
                      personal academic download tracks from the database.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-[#37352F] tracking-tight">
                4. Third-Party Integrations
              </h2>
              <p className="text-sm text-[#5F5E5B] leading-relaxed">
                We work only with vetted, enterprise-grade storage and server
                vendors to protect your data. No information is sold, traded, or
                shared with third parties.
              </p>
              <ul className="list-disc list-inside text-sm text-[#5F5E5B] space-y-1.5 pl-2 leading-relaxed">
                <li>
                  **Supabase**: For secure, encrypted authentication and RLS
                  PostgreSQL hosting.
                </li>
                <li>
                  **Cloudinary**: For private asset delivery via secure
                  time-limited URLs.
                </li>
                <li>
                  **Sentry**: For real-time, anonymous crash monitoring and
                  application diagnostic checks.
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-[#37352F] tracking-tight">
                5. Contact and Grievances
              </h2>
              <p className="text-sm text-[#5F5E5B] leading-relaxed">
                For questions regarding this policy, data corrections, or
                general compliance grievances, contact the SPSU Student Welfare
                or IT Helpdesk:
              </p>
              <p className="text-sm font-medium text-[#37352F] pt-1">
                Main Developer: Suyash Yadav (suyashydv23@gmail.com)
              </p>
              <p className="text-sm font-medium text-[#37352F] pt-1">
                Email:{" "}
                <Link
                  href="mailto:campuscore@spsu.ac.in"
                  className="underline hover:text-blue-600"
                >
                  campuscore@spsu.ac.in
                </Link>
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
