// src/app/(auth)/signup/page.tsx
import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Create Account | CampusCore SPSU",
  description:
    "Register a student account at CampusCore SPSU, the official academic workspace for Sir Padampat Singhania University. Access verified lecture notes, laboratory manuals, past year papers (PYQs), and notices.",
  keywords: [
    "SPSU campuscore signup",
    "CampusCore SPSU register",
    "SPSU registration portal",
    "Sir Padampat Singhania University registration",
    "SPSU login signup",
    "SPSU student dashboard registration",
    "CampusCore register student",
  ],
  openGraph: {
    title: "Create CampusCore SPSU Account",
    description:
      "Join the official Sir Padampat Singhania University academic hub. Create your student account to access premium curated notes, PYQs, and roadmaps.",
    type: "website",
  },
};

export default function SignupPage() {
  return <SignupForm />;
}
