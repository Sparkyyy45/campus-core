// src/app/(dashboard)/layout.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

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

  const { data: profile, error } = (await supabase
    .from("profiles")
    .select("full_name, role, branch_code")
    .eq("id", user.id)
    .maybeSingle()) as { data: { full_name: string | null; role: string; branch_code: string | null } | null; error: any };

  if (error || !profile) {
    // This shouldn't happen if trigger works, but safety first
    console.error("Layout: Profile not found for user", user.id);
    // If no profile, we can't determine role, so logout
    await supabase.auth.signOut();
    redirect("/login");
  }

  // Compute unread announcement count for students
  let unreadAnnouncementCount = 0;
  if (profile.role === "STUDENT") {
    const db = supabase as any;
    const [{ count: totalAnn }, { count: readAnn }] = await Promise.all([
      db.from("announcements").select("*", { count: "exact", head: true }),
      db
        .from("announcement_reads")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id),
    ]);
    unreadAnnouncementCount = Math.max(0, (totalAnn ?? 0) - (readAnn ?? 0));
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
