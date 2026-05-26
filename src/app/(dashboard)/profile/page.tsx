import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileClient } from "./profile-client";

export const metadata = {
  title: "Profile | CampusCore",
  description: "Manage your CampusCore profile",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    // Edge case: User authenticated but no profile exists
    redirect("/dashboard");
  }

  return <ProfileClient profile={profile} email={user.email ?? ""} />;
}
