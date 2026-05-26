"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ShieldCheck, User, Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { updateUserRoleAction } from "./actions";
import type { Profile } from "@/types/database";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export function UsersClient({ users, currentUserId }: { users: Profile[]; currentUserId: string }) {
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");

  const filtered = users.filter(
    (u) =>
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.roll_no.toLowerCase().includes(search.toLowerCase())
  );

  function handleRoleToggle(userId: string, currentRole: string) {
    if (userId === currentUserId) {
      toast.error("You cannot change your own role.");
      return;
    }
    const newRole = currentRole === "ADMIN" ? "STUDENT" : "ADMIN";
    if (!confirm(`Change this user's role to ${newRole}?`)) return;

    startTransition(async () => {
      const result = await updateUserRoleAction(userId, newRole);
      if (result.error) toast.error(result.error);
      else toast.success(result.success);
    });
  }

  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const studentCount = users.filter((u) => u.role === "STUDENT").length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="campus-card text-center">
          <p className="text-2xl font-bold">{users.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Users</p>
        </div>
        <div className="campus-card text-center">
          <p className="text-2xl font-bold">{studentCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Students</p>
        </div>
        <div className="campus-card text-center">
          <p className="text-2xl font-bold">{adminCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Admins</p>
        </div>
        <div className="campus-card text-center">
          <p className="text-2xl font-bold">{filtered.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Shown</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or roll no..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="campus-card text-center py-12 text-muted-foreground">
          <Users className="h-8 w-8 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No users found.</p>
        </div>
      ) : (
        <div className="campus-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Roll No</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Branch · Sem</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden xl:table-cell">Joined</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((u) => (
                  <tr key={u.id} className={`hover:bg-muted/20 transition-colors ${u.id === currentUserId ? "opacity-60" : ""}`}>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{u.full_name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{u.roll_no.toUpperCase()}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                      {u.branch_code.toUpperCase()} · Sem {u.semester}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        u.role === "ADMIN"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {u.role === "ADMIN"
                          ? <ShieldCheck className="h-3 w-3" />
                          : <User className="h-3 w-3" />
                        }
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs hidden xl:table-cell">
                      {formatDate(u.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {u.id !== currentUserId && (
                        <button
                          onClick={() => handleRoleToggle(u.id, u.role)}
                          disabled={isPending}
                          className={`text-xs font-medium px-2.5 py-1 rounded-md border transition-colors ${
                            u.role === "ADMIN"
                              ? "border-destructive/30 text-destructive hover:bg-destructive/10"
                              : "border-primary/30 text-primary hover:bg-primary/10"
                          }`}
                        >
                          {u.role === "ADMIN" ? "Demote" : "Make Admin"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
