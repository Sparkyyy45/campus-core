"use client";

import { useState, useTransition } from "react";
import { updateProfileName, deleteAccountAction } from "./actions";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  GraduationCap,
  Building,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ShieldAlert,
} from "lucide-react";
import { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export function ProfileClient({
  profile,
  email,
}: {
  profile: Profile;
  email: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showDelete, setShowDelete] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [isDeleting, startDeleteTransition] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteAccount = () => {
    if (confirmEmail !== email) return;
    setDeleteError(null);
    startDeleteTransition(async () => {
      const result = await deleteAccountAction();
      if (result?.error) {
        setDeleteError(result.error);
      } else {
        window.location.href = "/login?message=account-deleted";
      }
    });
  };

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
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Academic Details
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
              <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Building className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Branch
                </p>
                <p className="font-semibold">
                  {profile.branch_code?.toUpperCase() ?? "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
              <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Semester
                </p>
                <p className="font-semibold">{profile.semester ?? "N/A"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
              <div className="h-10 w-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Roll Number
                </p>
                <p className="font-semibold">{profile.roll_no ?? "N/A"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
              <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div className="truncate">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Email
                </p>
                <p className="font-semibold truncate" title={email}>
                  {email}
                </p>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5" />
            Academic details are locked. Contact administration if they are
            incorrect.
          </p>
        </div>

        <hr className="border-border" />

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Edit Profile
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="text-sm font-medium text-foreground"
              >
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

      {/* Danger Zone */}
      <div className="campus-card border-rose-200/60 bg-rose-50/5 space-y-6">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-rose-800">Danger Zone</h2>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Permanently delete your CampusCore account and purge all your
              personal records. This action is irreversible.
            </p>
          </div>
        </div>

        {!showDelete ? (
          <Button
            type="button"
            variant="destructive"
            onClick={() => setShowDelete(true)}
            className="bg-rose-600 hover:bg-rose-700 text-white"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Account
          </Button>
        ) : (
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/30 space-y-4">
            <p className="text-sm font-medium text-rose-800">
              Are you absolutely sure? This will delete your profile, downloads,
              and statistics.
            </p>
            <div className="space-y-2">
              <label
                htmlFor="confirmEmail"
                className="text-xs font-semibold text-rose-800 uppercase tracking-wider block"
              >
                Type <span className="font-mono underline">{email}</span> to
                confirm:
              </label>
              <input
                id="confirmEmail"
                type="email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                className="flex h-10 w-full rounded-md border border-rose-200 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                placeholder={email}
              />
            </div>

            {deleteError && (
              <div className="p-3 rounded-md bg-rose-50 border border-rose-100 text-rose-600 text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {deleteError}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="destructive"
                disabled={confirmEmail !== email || isDeleting}
                onClick={handleDeleteAccount}
                className="bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50"
              >
                {isDeleting
                  ? "Deleting Permanently..."
                  : "Confirm Permanent Deletion"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isDeleting}
                onClick={() => {
                  setShowDelete(false);
                  setConfirmEmail("");
                  setDeleteError(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
