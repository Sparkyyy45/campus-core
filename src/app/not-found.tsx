import Link from "next/link";
import { Search, ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
        <Search className="h-8 w-8" />
      </div>
      <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">404</h1>
      <h2 className="text-xl font-semibold text-foreground mb-4">Page not found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
      </p>
      <Link href="/dashboard" className={buttonVariants({ size: "lg" })}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>
    </div>
  );
}
