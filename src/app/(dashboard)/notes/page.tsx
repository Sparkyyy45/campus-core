// src/app/(dashboard)/notes/page.tsx
import ResourcesPage from "../resources/page";

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  // Inject type=notes into searchParams
  const params = Promise.resolve({ ...sp, type: "notes" });
  return <ResourcesPage searchParams={params} />;
}
