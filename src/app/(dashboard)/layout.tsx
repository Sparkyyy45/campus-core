// src/app/(dashboard)/layout.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

export const dynamic = "force-dynamic";

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
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Query profile and announcement lists concurrently to avoid sequential waterfall latency
  const [profileResult, announcementsResult, readsResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, role, branch_code")
      .eq("id", user.id)
      .maybeSingle() as any,
    supabase.from("announcements").select("id"),
    supabase
      .from("announcement_reads")
      .select("announcement_id")
      .eq("user_id", user.id),
  ]);

  const { data: profile, error } = profileResult;

  if (error || !profile) {
    // This shouldn't happen if trigger works, but safety first
    console.error("Layout: Profile not found for user", user.id);
    // If no profile, we can't determine role, so logout
    await supabase.auth.signOut();
    redirect("/login");
  }

  // Compute unread announcement count for students by filtering in memory
  let unreadAnnouncementCount = 0;
  if (profile.role === "STUDENT") {
    const announcements = announcementsResult.data || [];
    const reads = new Set(
      (readsResult.data || []).map((r: any) => r.announcement_id)
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
