"use client";

import { useState, useTransition } from "react";
import {
  Sparkles,
  BookOpen,
  Send,
  CheckCircle,
  Lightbulb,
  Loader2,
  HelpCircle,
  MessageSquare,
  Bug,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { submitFeedbackRequestAction } from "./actions";
import type { CachedProfile } from "@/lib/supabase/cached";

type FeedbackType = "REQUEST" | "BUG" | "RECOMMENDATION" | "EXPERIENCE";

export function RequestClient({ profile }: { profile: CachedProfile }) {
  const [isPending, startTransition] = useTransition();
  const [type, setType] = useState<FeedbackType>("REQUEST");
  const [subjectName, setSubjectName] = useState("");
  const [message, setMessage] = useState("");
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const firstName = profile.full_name?.split(" ")[0] || "there";

  const getCategoryDetails = (category: FeedbackType) => {
    switch (category) {
      case "REQUEST":
        return {
          title: "Request Study Material",
          icon: BookOpen,
          iconColor: "text-blue-500",
          borderColor: "hover:border-blue-500/40",
          activeColor: "bg-blue-500/5 border-blue-500/40 text-blue-500",
          messageLabel:
            "Explain what notes, slides, or question papers you need",
          messagePlaceholder:
            "e.g. I really need Unit 3 and 4 lecture slides from Dr. Smith, or PYQs from 2023 to 2024 for our upcoming sessional exams...",
          messageHelp: "Explain exactly what unit notes or papers are missing.",
        };
      case "BUG":
        return {
          title: "Report a Bug",
          icon: Bug,
          iconColor: "text-red-500",
          borderColor: "hover:border-red-500/40",
          activeColor: "bg-red-500/5 border-red-500/40 text-red-500",
          messageLabel: "Describe the bug or issue you encountered",
          messagePlaceholder:
            "e.g. When I try to download a PDF file from the Roadmap section on my phone, the button doesn't respond, or the subject selection dropdown is cut off...",
          messageHelp:
            "Explain where the issue happened and what went wrong so we can fix it.",
        };
      case "RECOMMENDATION":
        return {
          title: "Suggest Feature",
          icon: Lightbulb,
          iconColor: "text-purple-500",
          borderColor: "hover:border-purple-500/40",
          activeColor: "bg-purple-500/5 border-purple-500/40 text-purple-500",
          messageLabel: "Describe your feature suggestion",
          messagePlaceholder:
            "e.g. It would be awesome if we had a dashboard calendar showing our midterms, assignment deadlines, and sessional schedules...",
          messageHelp:
            "Share any visual or functional additions you want to see built.",
        };
      case "EXPERIENCE":
        return {
          title: "Share Experience",
          icon: MessageSquare,
          iconColor: "text-emerald-500",
          borderColor: "hover:border-emerald-500/40",
          activeColor:
            "bg-emerald-500/5 border-emerald-500/40 text-emerald-500",
          messageLabel: "Tell us about your experience using the site",
          messagePlaceholder:
            "e.g. The new direct file opening system is so fast! I love how clean the home page looks and the custom dashboard widgets are super handy...",
          messageHelp:
            "Share what you like about the site or what we can make more fun.",
        };
    }
  };

  const currentCategory = getCategoryDetails(type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (type === "REQUEST" && !subjectName.trim()) {
      setErrorMsg("Please tell us which subject this request is for.");
      return;
    }

    if (!message.trim() || message.trim().length < 5) {
      setErrorMsg("Please write a message at least 5 characters long.");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("subject_name", type === "REQUEST" ? subjectName : "");
      formData.append("message", message);

      const res = await submitFeedbackRequestAction(formData);

      if (res.error) {
        setErrorMsg(res.error);
        toast.error(res.error);
      } else {
        setSubmittedSuccess(true);
        toast.success(
          res.success || "Submitted! Sent directly to the Admin inbox"
        );
      }
    });
  };

  const handleReset = () => {
    setSubjectName("");
    setMessage("");
    setSubmittedSuccess(false);
    setErrorMsg("");
  };

  return (
    <div className="space-y-8">
      {/* Visual Header Block */}
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border p-8 sm:p-10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5 text-primary" />
            <span>Student Hub & Inbox Alert System</span>
            <span>•</span>
            <span className="text-primary font-semibold">
              {profile.branch_code?.toUpperCase()}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Hey {firstName}
          </h1>

          <p className="text-sm text-muted-foreground font-medium max-w-xl leading-relaxed">
            Need notes, found a bug, want a new feature built, or just want to
            tell us about your experience? Write it below and it will be sent
            directly to the support team inbox.
          </p>
        </div>

        {/* Floating Response Status Badge */}
        <div className="relative z-10 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-1.5 bg-muted/50 border border-border/80 px-5 py-4 rounded-2xl shrink-0">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Inbox Alert
          </span>
          <div className="text-sm font-black text-emerald-500 flex items-center gap-1.5 dark:text-emerald-400">
            Active
          </div>
        </div>
      </div>

      {submittedSuccess ? (
        /* Satisfying Success Screen Component */
        <div className="rounded-3xl bg-card border border-border p-8 sm:p-12 shadow-md relative overflow-hidden text-center max-w-2xl mx-auto space-y-6 animate-scale-up">
          <div className="absolute -right-16 -top-16 w-36 h-36 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-36 h-36 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="mx-auto w-20 h-20 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 flex items-center justify-center border border-emerald-500/25 dark:border-emerald-400/25 relative">
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping opacity-75" />
            <CheckCircle className="w-10 h-10 text-emerald-500 dark:text-emerald-400 relative z-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-foreground">
              Sent Successfully
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Awesome job, {firstName}! Your submission was completed and
              directed to the **Support Team**. Our development team is working
              hard to resolve bugs, review feature ideas, and upload notes.
            </p>
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              size="lg"
              onClick={handleReset}
              className="rounded-xl px-8 font-bold border-emerald-500/20 hover:bg-emerald-500/5 cursor-pointer"
            >
              Submit Another Request or Feedback
            </Button>
          </div>
        </div>
      ) : (
        /* The High-Fidelity Request Form Card */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden"
            >
              {/* Soft decorative shader */}
              <div className="absolute -left-12 -top-12 w-32 h-32 bg-primary/5 rounded-full blur-xl pointer-events-none" />

              {/* Four-Category Bento-style Button Grid */}
              <div className="space-y-3">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  What would you like to share?
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 p-1 bg-muted rounded-2xl border border-border/60">
                  {(
                    [
                      {
                        val: "REQUEST",
                        label: "Request Notes",
                        icon: BookOpen,
                        color: "text-blue-500",
                      },
                      {
                        val: "BUG",
                        label: "Report Bug",
                        icon: Bug,
                        color: "text-red-500",
                      },
                      {
                        val: "RECOMMENDATION",
                        label: "Suggest Feature",
                        icon: Lightbulb,
                        color: "text-purple-500",
                      },
                      {
                        val: "EXPERIENCE",
                        label: "Feedback",
                        icon: MessageSquare,
                        color: "text-emerald-500",
                      },
                    ] as const
                  ).map((cat) => {
                    const CatIcon = cat.icon;
                    const isActive = type === cat.val;
                    return (
                      <button
                        key={cat.val}
                        type="button"
                        onClick={() => {
                          setType(cat.val);
                          setErrorMsg("");
                        }}
                        className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3 px-2 rounded-xl text-xs font-black transition-all cursor-pointer select-none text-center sm:text-left ${
                          isActive
                            ? "bg-card text-foreground shadow-sm border border-border/80 scale-[1.02]"
                            : "text-muted-foreground hover:text-foreground border border-transparent"
                        }`}
                      >
                        <CatIcon
                          className={`w-4 h-4 shrink-0 ${cat.color} ${isActive ? "scale-110" : ""}`}
                        />
                        <span className="truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Input fields with micro-transitions */}
              <div className="space-y-5">
                {type === "REQUEST" ? (
                  <div className="space-y-2 animate-fade-in">
                    <Label
                      htmlFor="subject_name"
                      className="text-xs font-bold text-muted-foreground uppercase tracking-widest"
                    >
                      Subject Name
                    </Label>
                    <Input
                      id="subject_name"
                      placeholder="e.g. Computer Networks, Mathematics-III, Chemistry..."
                      value={subjectName}
                      onChange={(e) => setSubjectName(e.target.value)}
                      disabled={isPending}
                      className="rounded-xl px-4 py-6 border-border focus-visible:border-primary/50 text-sm focus-visible:ring-primary/20"
                    />
                    <p className="text-[11px] text-muted-foreground/80 font-medium">
                      Tip: Type the subject name clearly so we can locate the
                      exact folder.
                    </p>
                  </div>
                ) : null}

                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className="text-xs font-bold text-muted-foreground uppercase tracking-widest"
                  >
                    {currentCategory.messageLabel}
                  </Label>
                  <Textarea
                    id="message"
                    placeholder={currentCategory.messagePlaceholder}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isPending}
                    rows={4}
                    className="rounded-xl px-4 py-3 border-border focus-visible:border-primary/50 text-sm focus-visible:ring-primary/20 leading-relaxed min-h-[120px]"
                  />
                  <p className="text-[11px] text-muted-foreground/80 font-medium">
                    {currentCategory.messageHelp}
                  </p>
                </div>
              </div>

              {/* Error Box display if errorMsg exists */}
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold leading-relaxed">
                  Error: {errorMsg}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-xl py-6 font-black text-sm flex items-center justify-center gap-2 cursor-pointer bg-primary text-primary-foreground transition-all duration-300 shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.01]"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending alert...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send to Support Email</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Right sidebar quick details card */}
          <div className="space-y-6">
            <div className="rounded-3xl bg-card border border-border p-6 shadow-sm relative overflow-hidden flex flex-col justify-between h-full min-h-[300px]">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none" />
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-black text-foreground">
                  Direct Inbox Routing
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  We have upgraded this suggestion box! Now, everything you send
                  here goes straight to the **Support Team** instantly via live
                  email dispatch.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-[10px] text-emerald-500 shrink-0 font-bold">
                      ✓
                    </span>
                    <p className="text-[11px] text-muted-foreground font-medium leading-normal">
                      Alerts go directly to our lead developer.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-[10px] text-emerald-500 shrink-0 font-bold">
                      ✓
                    </span>
                    <p className="text-[11px] text-muted-foreground font-medium leading-normal">
                      Fast responses and fixes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border/60 text-[10px] text-muted-foreground/60 leading-normal font-mono flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Instant dispatch alert active</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
