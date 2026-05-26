// src/app/(dashboard)/pyqs/page.tsx
import ResourcesPage from "../resources/page";

export default async function PYQsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  // Inject type=pyq into searchParams
  const params = Promise.resolve({ ...sp, type: "pyqs" });
  return <ResourcesPage searchParams={params} />;
}
