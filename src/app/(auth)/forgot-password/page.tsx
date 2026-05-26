// src/app/(auth)/forgot-password/page.tsx
import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset Password | CampusCore SPSU",
  description:
    "Recover your CampusCore account at Sir Padampat Singhania University (SPSU). Request a secure password reset link using your registered college email address to regain access to notes, roadmaps, and announcements.",
  keywords: [
    "SPSU password reset",
    "SPSU forgot password",
    "SPSU login help",
    "CampusCore account recovery",
    "SPSU student portal password recovery",
  ],
  openGraph: {
    title: "Reset CampusCore SPSU Password",
    description:
      "Request a secure, single-use password reset link using your official college email address to recover your SPSU digital portal.",
    type: "website",
  },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
