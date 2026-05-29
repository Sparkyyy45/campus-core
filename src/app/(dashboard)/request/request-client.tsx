"use client";

import { useState, useTransition } from "react";
import {
  Sparkles,
  BookOpen,
  FileText,
  Send,
  CheckCircle,
  Lightbulb,
  Loader2,
  HelpCircle,
  ArrowRight,
  Palette,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { submitFeedbackRequestAction } from "./actions";
import type { CachedProfile } from "@/lib/supabase/cached";

export function RequestClient({ profile }: { profile: CachedProfile }) {
  const [isPending, startTransition] = useTransition();
  const [type, setType] = useState<"REQUEST" | "RECOMMENDATION">("REQUEST");
  const [subjectName, setSubjectName] = useState("");
  const [message, setMessage] = useState("");
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const firstName = profile.full_name?.split(" ")[0] || "there";

  const handleTemplateClick = (
    templateType: "REQUEST" | "RECOMMENDATION",
    subject: string,
    desc: string
  ) => {
    setType(templateType);
    setSubjectName(subject);
    setMessage(desc);
    setErrorMsg("");
    toast.success("Template filled in! Customize it below ✨");
  };

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
        toast.success(res.success || "Submitted! Thank you so much.");
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
            <span>Interactive Suggestions Hub</span>
            <span>•</span>
            <span className="text-primary font-semibold">
              {profile.branch_code?.toUpperCase()}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Hey {firstName}! 👋
          </h1>

          <p className="text-sm text-muted-foreground font-medium max-w-xl leading-relaxed">
            Need previous year exam papers, study notes, or want a cool new
            feature built for the website? Tell us below and we will handle the
            rest!
          </p>
        </div>

        {/* Floating Interactive Metric Badge */}
        <div className="relative z-10 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-1.5 bg-muted/50 border border-border/80 px-5 py-4 rounded-2xl shrink-0">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Response Status
          </span>
          <div className="text-sm font-black text-emerald-500 flex items-center gap-1.5 dark:text-emerald-400">
            Active ⚡
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
              Submitted Successfully!
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Awesome job, {firstName}! We received your request. Our developers
              are review-checking ideas and adding requested material directly
              to your notes cabinet.
            </p>
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              size="lg"
              onClick={handleReset}
              className="rounded-xl px-8 font-bold border-emerald-500/20 hover:bg-emerald-500/5"
            >
              Request or Recommend Something Else
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

              {/* Dynamic segmented button toggle */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  What do you want to do?
                </Label>
                <div className="grid grid-cols-2 p-1 bg-muted rounded-xl border border-border/60">
                  <button
                    type="button"
                    onClick={() => {
                      setType("REQUEST");
                      setErrorMsg("");
                    }}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs sm:text-sm font-black transition-all cursor-pointer ${
                      type === "REQUEST"
                        ? "bg-card text-foreground shadow-sm border border-border/80"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Request Study Material</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setType("RECOMMENDATION");
                      setErrorMsg("");
                    }}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs sm:text-sm font-black transition-all cursor-pointer ${
                      type === "RECOMMENDATION"
                        ? "bg-card text-foreground shadow-sm border border-border/80"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Lightbulb className="w-4 h-4 text-purple-500 shrink-0" />
                    <span>Recommend Site Feature</span>
                  </button>
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
                      Subject Name 📖
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
                    {type === "REQUEST"
                      ? "Explain what material or PYQ years you need 📝"
                      : "Describe your feature suggestion 💡"}
                  </Label>
                  <Textarea
                    id="message"
                    placeholder={
                      type === "REQUEST"
                        ? "e.g. I really need Dr. Smith's Unit 3 and 4 lecture slides, or PYQs from 2022 to 2024 for our upcoming sessional exams..."
                        : "e.g. It would be awesome if we had a group study chat room on this site, or calendar alerts for exam dates..."
                    }
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isPending}
                    rows={4}
                    className="rounded-xl px-4 py-3 border-border focus-visible:border-primary/50 text-sm focus-visible:ring-primary/20 leading-relaxed min-h-[120px]"
                  />
                  <p className="text-[11px] text-muted-foreground/80 font-medium">
                    {type === "REQUEST"
                      ? "Explain exactly what unit notes or papers are missing."
                      : "Briefly explain why this addition helps students."}
                  </p>
                </div>
              </div>

              {/* Error Box display if errorMsg exists */}
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold leading-relaxed">
                  ⚠️ {errorMsg}
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
                      <span>Sending message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Request</span>
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
                  Your Voice Matters!
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  CampusCore is built directly from student feedback! Every
                  single file uploaded, roadmap designed, and dark themed style
                  comes directly from your class recommendations.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-[10px] text-emerald-500 shrink-0 font-bold">
                      ✓
                    </span>
                    <p className="text-[11px] text-muted-foreground font-medium leading-normal">
                      We check recommendations daily.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-[10px] text-emerald-500 shrink-0 font-bold">
                      ✓
                    </span>
                    <p className="text-[11px] text-muted-foreground font-medium leading-normal">
                      Materials are uploaded in under 24 hours.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border/60 text-[10px] text-muted-foreground/60 leading-normal font-mono flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Locked & Encrypted submission</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Interactive Templates Carousel */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Palette className="w-4 h-4 text-amber-500 shrink-0 animate-pulse" />
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            💡 Quick Ideas Grid (Tap to instantly fill out)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Card 1: PYQ Paper */}
          <div
            onClick={() =>
              handleTemplateClick(
                "REQUEST",
                "Mathematics-III",
                "Hi! I need previous 3 years' exam papers (PYQs) for this mathematics course, with simple answers/solutions if possible!"
              )
            }
            className="cursor-pointer border border-border bg-card/60 hover:bg-card hover:border-amber-500/40 hover:shadow-md rounded-2xl p-4 transition-all duration-300 group flex flex-col justify-between min-h-[140px] relative overflow-hidden"
          >
            <div className="absolute top-0 left-3 right-3 h-[2px] bg-amber-500/20 group-hover:bg-amber-500/60 transition-colors" />
            <div>
              <FileText className="w-5 h-5 text-amber-500 group-hover:-translate-y-0.5 transition-transform shrink-0 mb-2" />
              <h4 className="text-xs font-bold text-foreground">
                Get Past Papers
              </h4>
              <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                Need question papers from last year sessional exams? Tap this.
              </p>
            </div>
            <span className="text-[9px] text-amber-500 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1 mt-3">
              Use Template <ArrowRight className="w-2.5 h-2.5" />
            </span>
          </div>

          {/* Card 2: Lecture Notes */}
          <div
            onClick={() =>
              handleTemplateClick(
                "REQUEST",
                "Computer Networks",
                "Hey! Please upload lecture notes or slide summaries for Unit 3 (IP Addressing) and Unit 4 (Routing Protocols)."
              )
            }
            className="cursor-pointer border border-border bg-card/60 hover:bg-card hover:border-blue-500/40 hover:shadow-md rounded-2xl p-4 transition-all duration-300 group flex flex-col justify-between min-h-[140px] relative overflow-hidden"
          >
            <div className="absolute top-0 left-3 right-3 h-[2px] bg-blue-500/20 group-hover:bg-blue-500/60 transition-colors" />
            <div>
              <BookOpen className="w-5 h-5 text-blue-500 group-hover:-translate-y-0.5 transition-transform shrink-0 mb-2" />
              <h4 className="text-xs font-bold text-foreground">
                Get Class Notes
              </h4>
              <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                Missed a lecture folder or slide stack? Request class notes.
              </p>
            </div>
            <span className="text-[9px] text-blue-500 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1 mt-3">
              Use Template <ArrowRight className="w-2.5 h-2.5" />
            </span>
          </div>

          {/* Card 3: Pitch Black Theme */}
          <div
            onClick={() =>
              handleTemplateClick(
                "RECOMMENDATION",
                "",
                "I want a super premium pitch-black AMOLED dark mode option so it is extremely easy to read notes in bed at night!"
              )
            }
            className="cursor-pointer border border-border bg-card/60 hover:bg-card hover:border-purple-500/40 hover:shadow-md rounded-2xl p-4 transition-all duration-300 group flex flex-col justify-between min-h-[140px] relative overflow-hidden"
          >
            <div className="absolute top-0 left-3 right-3 h-[2px] bg-purple-500/20 group-hover:bg-purple-500/60 transition-colors" />
            <div>
              <Palette className="w-5 h-5 text-purple-500 group-hover:-translate-y-0.5 transition-transform shrink-0 mb-2" />
              <h4 className="text-xs font-bold text-foreground">
                Suggest Dark Mode
              </h4>
              <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                Want a pitch-black layout for night-time note studying? Tap
                this.
              </p>
            </div>
            <span className="text-[9px] text-purple-500 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1 mt-3">
              Use Template <ArrowRight className="w-2.5 h-2.5" />
            </span>
          </div>

          {/* Card 4: Class Planner */}
          <div
            onClick={() =>
              handleTemplateClick(
                "RECOMMENDATION",
                "",
                "Please build a schedule calendar component that alerts us on sessional dates and lab manual submission deadlines!"
              )
            }
            className="cursor-pointer border border-border bg-card/60 hover:bg-card hover:border-emerald-500/40 hover:shadow-md rounded-2xl p-4 transition-all duration-300 group flex flex-col justify-between min-h-[140px] relative overflow-hidden"
          >
            <div className="absolute top-0 left-3 right-3 h-[2px] bg-emerald-500/20 group-hover:bg-emerald-500/60 transition-colors" />
            <div>
              <Calendar className="w-5 h-5 text-emerald-500 group-hover:-translate-y-0.5 transition-transform shrink-0 mb-2" />
              <h4 className="text-xs font-bold text-foreground">
                Suggest Calendar
              </h4>
              <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                Need a dashboard calendar showing midterms and deadlines? Tap
                this.
              </p>
            </div>
            <span className="text-[9px] text-emerald-500 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1 mt-3">
              Use Template <ArrowRight className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
