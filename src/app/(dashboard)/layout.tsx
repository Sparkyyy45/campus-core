// src/app/(dashboard)/layout.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import {
  getCachedUserAndProfile,
  getCachedAnnouncementsAndReads,
} from "@/lib/supabase/cached";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await getCachedUserAndProfile();

  if (!user || !profile) {
    redirect("/login");
  }

  // Compute unread announcement count for students by filtering in memory
  let unreadAnnouncementCount = 0;
  if (profile.role === "STUDENT") {
    const { announcements, reads } = await getCachedAnnouncementsAndReads(
      user.id
    );
    unreadAnnouncementCount = announcements.filter(
      (a: any) => !reads.has(a.id)
    ).length;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - Desktop persistent */}
      <Sidebar
        role={profile.role as "STUDENT" | "ADMIN"}
        unreadAnnouncements={unreadAnnouncementCount}
        userName={profile.full_name || undefined}
        branchCode={profile.branch_code || undefined}
        className="hidden lg:flex"
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar
          userName={profile.full_name || "User"}
          role={profile.role}
          branch={profile.branch_code || undefined}
          unreadAnnouncements={unreadAnnouncementCount}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
