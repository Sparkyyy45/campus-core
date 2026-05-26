// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CampusCore SPSU — Sir Padampat Singhania University Academic Hub",
    template: "%s | CampusCore SPSU",
  },
  description:
    "CampusCore is the official central academic hub for Sir Padampat Singhania University (SPSU). Access department-verified lecture notes, curated study roadmaps, previous year question papers (PYQs), and student notices all in one Notion-inspired digital workspace.",
  keywords: [
    "SPSU campuscore",
    "Sir Padampat Singhania University academic portal",
    "SPSU student portal",
    "SPSU notes",
    "SPSU PYQs",
    "SPSU roadmaps",
    "college notes SPSU",
    "academic resources SPSU",
    "SPSU dashboard",
    "CampusCore SPSU",
    "SPSU exams",
    "SPSU announcements",
  ],
  authors: [{ name: "CampusCore SPSU" }],
  metadataBase: new URL("https://campuscore.systems"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "CampusCore SPSU — Sir Padampat Singhania University Portal",
    description:
      "Access department-verified lecture notes, curated study roadmaps, previous year question papers (PYQs), and official student announcements at SPSU.",
    siteName: "CampusCore SPSU",
  },
  twitter: {
    card: "summary_large_image",
    title: "CampusCore SPSU — Sir Padampat Singhania University Portal",
    description:
      "Access department-verified lecture notes, study roadmaps, PYQs, and notices in one central student workspace at SPSU.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
