// src/app/(auth)/reset-password/page.tsx
import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Set New Password | CampusCore SPSU",
  description:
    "Configure a new secure password for your CampusCore student account at Sir Padampat Singhania University (SPSU). Protect your access to official academic notes and roadmap dashboards.",
  keywords: [
    "SPSU password update",
    "SPSU change password",
    "SPSU portal security",
    "CampusCore password change",
    "SPSU student account reset",
  ],
  openGraph: {
    title: "Change CampusCore SPSU Password",
    description:
      "Configure a secure new password for your SPSU academic portal to protect your student resource workspace.",
    type: "website",
  },
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
