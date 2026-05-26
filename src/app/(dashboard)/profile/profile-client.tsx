"use client";

import { useState, useTransition } from "react";
import { updateProfileName } from "./actions";
import { Button } from "@/components/ui/button";
import { User, Mail, GraduationCap, Building, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export function ProfileClient({ profile, email }: { profile: Profile; email: string }) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await updateProfileName(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <User className="h-8 w-8 text-primary" />
          Your Profile
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage your personal information and view your academic details.
        </p>
      </div>

      <div className="campus-card space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Academic Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
              <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Building className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Branch</p>
                <p className="font-semibold">{profile.branch_code?.toUpperCase() ?? "N/A"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
              <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Semester</p>
                <p className="font-semibold">{profile.semester ?? "N/A"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
              <div className="h-10 w-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Roll Number</p>
                <p className="font-semibold">{profile.roll_no ?? "N/A"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
              <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div className="truncate">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Email</p>
                <p className="font-semibold truncate" title={email}>{email}</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5" />
            Academic details are locked. Contact administration if they are incorrect.
          </p>
        </div>

        <hr className="border-border" />

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Edit Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium text-foreground">
                Display Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                defaultValue={profile.full_name ?? ""}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter your full name"
              />
            </div>

            {error && (
              <div className="p-3 rounded-md bg-rose-50 text-rose-600 text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 rounded-md bg-teal-50 text-teal-600 text-sm flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Profile updated successfully.
              </div>
            )}

            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
