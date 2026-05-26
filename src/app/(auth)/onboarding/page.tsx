import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingClient } from "./onboarding-client";

export const metadata = {
  title: "Complete Profile | CampusCore",
  description: "Finish setting up your CampusCore account.",
};

type OnboardingPageProps = {
  searchParams?: { next?: string };
};

function getSafeRedirect(path: string | undefined): string {
  if (path && path.startsWith("/")) return path;
  return "/dashboard";
}

export default async function OnboardingPage({
  searchParams,
}: OnboardingPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const safeNext = getSafeRedirect(searchParams?.next);

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (profile) {
    redirect(safeNext);
  }

  const defaultName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    "";

  return (
    <OnboardingClient
      defaultName={defaultName}
      email={user.email ?? ""}
      nextPath={safeNext}
    />
  );
}
