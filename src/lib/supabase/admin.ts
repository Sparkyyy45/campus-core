import { createClient } from "./server";

export async function verifyAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase: null, user: null };
  const { data: profile } = (await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()) as { data: { role: string } | null; error: unknown };
  if (profile?.role !== "ADMIN") return { supabase: null, user: null };
  return { supabase, user };
}
