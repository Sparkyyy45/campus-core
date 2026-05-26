"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <div className="h-16 w-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">Something went wrong!</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        We encountered an unexpected error while processing your request. Please try again.
      </p>
      <div className="flex items-center gap-4">
        <Button onClick={() => reset()} size="lg">
          Try again
        </Button>
        <Link href="/dashboard" className={buttonVariants({ variant: "outline", size: "lg" })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go back home
        </Link>
      </div>
    </div>
  );
}
