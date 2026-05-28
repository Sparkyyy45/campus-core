"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";
import Link from "next/link";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("campuscore-cookie-consent");
    if (!consent) {
      // Small timeout to allow the layout to settle before animating the slide-in popup
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("campuscore-cookie-consent", "accepted");
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem("campuscore-cookie-consent", "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-6 right-6 left-6 md:left-auto md:w-96 z-50 animate-in slide-in-from-bottom-12 fade-in duration-500">
      <div className="campus-card border-primary/20 bg-card/90 backdrop-blur-md shadow-xl p-5 relative overflow-hidden flex flex-col gap-4">
        {/* Subtle decorative glow */}
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary">
            <Cookie className="h-5 w-5 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
              Cookie Consent
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We leverage browser caching and standard authentication cookies to
              optimize access speeds and keep your student session secure.
            </p>
          </div>
          <button
            onClick={handleDecline}
            className="absolute top-4 right-4 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close cookie banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 mt-1">
          <Link
            href="/privacy"
            className="text-2xs font-semibold text-primary hover:underline"
          >
            Read Privacy Policy
          </Link>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8 px-3 text-muted-foreground font-bold hover:bg-muted hover:text-foreground"
              onClick={handleDecline}
            >
              Essential Only
            </Button>
            <Button
              size="sm"
              className="text-xs h-8 px-4 font-bold bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
              onClick={handleAccept}
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CookieConsent;
