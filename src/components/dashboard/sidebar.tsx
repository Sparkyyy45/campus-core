// src/components/dashboard/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { GraduationCap, LogOut, Menu, User } from "lucide-react";
import { studentNavItems, adminNavItems } from "./nav-items";
import { useState } from "react";
import { logoutAction } from "@/app/auth/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SidebarProps {
  role: "STUDENT" | "ADMIN";
  unreadAnnouncements?: number;
  userName?: string;
  branchCode?: string;
  className?: string;
}

export function Sidebar({
  role,
  unreadAnnouncements = 0,
  userName,
  className,
}: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const baseItems = role === "ADMIN" ? adminNavItems : studentNavItems;
  const displayName =
    userName || (role === "ADMIN" ? "Administrator" : "Campus Student");
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const navItems = [
    ...baseItems,
    {
      title: "Profile",
      href: "/profile",
      icon: User,
      isProfile: true,
    },
  ];

  return (
    <aside
      className={cn(
        "relative flex flex-col bg-white border-r border-[#EAEAEA] transition-all duration-300 select-none z-30 shrink-0 font-sans",
        isCollapsed ? "w-[76px]" : "w-[250px]",
        className
      )}
    >
      {/* Brand Header — Minimalist Line-Art Concept */}
      <div className="flex h-20 items-center px-6 border-b border-[#EAEAEA]">
        <Link href="/dashboard" className="flex items-center gap-3 w-full">
          <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] bg-[#F7F7F7] border border-[#EAEAEA] text-[#37352F]">
            <GraduationCap className="h-4 w-4 stroke-[1.5]" />
          </div>
          {!isCollapsed && (
            <span className="text-xs font-semibold tracking-widest text-[#37352F] uppercase font-mono">
              CampusCore
            </span>
          )}
        </Link>
      </div>

      {/* Navigation Directory */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
        {!isCollapsed && (
          <div className="px-3 pb-2">
            <span className="text-[9px] font-mono tracking-widest uppercase text-[#787774]">
              Main Directory
            </span>
          </div>
        )}

        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" &&
              item.href !== "/admin" &&
              pathname.startsWith(item.href));
          const showNotificationDot =
            item.href === "/announcements" && unreadAnnouncements > 0;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-[4px] px-3 py-2.5 text-xs tracking-wider transition-colors duration-150 select-none cursor-pointer",
                isActive
                  ? "font-medium text-[#37352F] bg-[#F7F7F7] border border-[#EAEAEA]"
                  : "font-normal text-[#787774] hover:text-[#37352F] hover:bg-[#F7F7F7]/50 border border-transparent"
              )}
              title={isCollapsed ? item.title : undefined}
            >
              {item.isProfile ? (
                <Avatar className="h-4 w-4 rounded-[4px] border border-[#EAEAEA] shrink-0">
                  <AvatarFallback className="bg-white text-[#37352F] font-mono text-[8px] rounded-[4px]">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <item.icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive
                      ? "stroke-[2] text-[#37352F]"
                      : "stroke-[1.5] text-[#787774] group-hover:text-[#37352F]"
                  )}
                />
              )}

              {!isCollapsed && (
                <span className="flex-1 truncate">{item.title}</span>
              )}

              {/* Minimalist notification square */}
              {showNotificationDot && (
                <span
                  className={cn(
                    "flex h-1.5 w-1.5 rounded-none bg-[#37352F] shrink-0",
                    !isCollapsed && "ml-auto"
                  )}
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Action Footer */}
      <div className="p-4 border-t border-[#EAEAEA] bg-white space-y-1">
        <form action={logoutAction} className="w-full">
          <button
            type="submit"
            className={cn(
              "flex items-center gap-3 w-full rounded-[4px] px-3 py-2.5 text-xs font-normal tracking-wider text-[#787774] hover:text-[#37352F] hover:bg-[#F7F7F7]/50 transition-colors duration-150 cursor-pointer border border-transparent",
              isCollapsed && "justify-center px-0"
            )}
            title="Sign out"
          >
            <LogOut className="h-4 w-4 shrink-0 stroke-[1.5]" />
            {!isCollapsed && <span className="truncate">Sign Out</span>}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "hidden lg:flex items-center gap-3 w-full rounded-[4px] px-3 py-2.5 text-xs font-normal tracking-wider text-[#787774] hover:text-[#37352F] hover:bg-[#F7F7F7]/50 transition-colors duration-150 cursor-pointer border border-transparent",
            isCollapsed && "lg:justify-center lg:px-0"
          )}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu className="h-4 w-4 shrink-0 stroke-[1.5]" />
          {!isCollapsed && <span className="truncate">Toggle Layout</span>}
        </button>

        {/* Developer Attribution Tag */}
        {!isCollapsed && (
          <div className="pt-3 border-t border-[#F1F1F1] mt-2 text-center select-none">
            <span className="text-[9px] font-mono tracking-widest text-[#787774]/70 uppercase block">
              Designed & built by
            </span>
            <span className="text-[10px] font-semibold tracking-wide text-[#37352F] block mt-0.5">
              Suyash Yadav
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
