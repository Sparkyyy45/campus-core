// src/app/(dashboard)/request/page.tsx
import { redirect } from "next/navigation";
import { getCachedUserAndProfile } from "@/lib/supabase/cached";
import { RequestClient } from "./request-client";

export default async function RequestPage() {
  const { user, profile } = await getCachedUserAndProfile();

  if (!user || !profile) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in-up">
      <RequestClient profile={profile} />
    </div>
  );
}
