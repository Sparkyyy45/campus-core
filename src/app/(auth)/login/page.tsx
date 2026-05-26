// src/app/(auth)/login/page.tsx
import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log in | CampusCore SPSU",
  description:
    "Sign in to CampusCore SPSU, the official academic hub for Sir Padampat Singhania University. Access your student portal, lecture notes, roadmaps, announcements, and university resources.",
  keywords: [
    "SPSU campuscore login",
    "CampusCore SPSU",
    "SPSU login",
    "Sir Padampat Singhania University",
    "SPSU portal",
    "SPSU student dashboard",
    "SPSU academic resources",
    "CampusCore student login",
  ],
  openGraph: {
    title: "Log in to CampusCore SPSU",
    description:
      "Enter your college credentials to access Sir Padampat Singhania University's digital workspace. Access notes, PYQs, and notices instantly.",
    type: "website",
  },
};

export default function LoginPage() {
  return <LoginForm />;
}
