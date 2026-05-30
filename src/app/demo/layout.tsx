// src/app/demo/layout.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Map,
  Bell,
  MessageSquare,
  Menu,
  LogOut,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [unreadAnnouncements, setUnreadAnnouncements] = useState(1);

  const navItems = [
    {
      title: "Dashboard",
      href: "/demo",
      icon: LayoutDashboard,
    },
    {
      title: "Resources",
      href: "/demo/resources",
      icon: BookOpen,
    },
    {
      title: "Roadmaps",
      href: "/demo/roadmap",
      icon: Map,
    },
    {
      title: "Announcements",
      href: "/demo/announcements",
      icon: Bell,
      showBadge: true,
    },
    {
      title: "Request & Feedback",
      href: "/demo/request",
      icon: MessageSquare,
    },
    {
      title: "Demo Profile",
      href: "#",
      icon: User,
      isProfile: true,
    },
  ];

  return (
    <div className="flex h-screen bg-[#FBFBFA] overflow-hidden select-none font-sans antialiased text-[#37352F]">
      {/* Sidebar Sandbox */}
      <aside
        className={cn(
          "relative flex flex-col bg-white border-r border-[#EAEAEA] transition-all duration-300 select-none z-30 shrink-0",
          isCollapsed ? "w-[76px]" : "w-[250px]"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center px-6 border-b border-[#EAEAEA]">
          <Link href="/demo" className="flex items-center gap-1 w-full px-2">
            {!isCollapsed ? (
              <>
                <span className="text-lg font-black tracking-tighter text-[#37352F]">
                  CampusCore
                </span>
                <span className="h-1 w-1 rounded-full bg-primary" />
              </>
            ) : (
              <span className="text-base font-black tracking-tighter text-[#37352F]">
                CC
              </span>
            )}
          </Link>
        </div>

        {/* Directory Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          {!isCollapsed && (
            <div className="px-3 pb-2">
              <span className="text-[9px] font-mono tracking-widest uppercase text-[#787774]">
                Sandbox Directory
              </span>
            </div>
          )}

          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const showNotificationDot =
              item.showBadge && unreadAnnouncements > 0;

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
                onClick={
                  item.showBadge ? () => setUnreadAnnouncements(0) : undefined
                }
              >
                {item.isProfile ? (
                  <Avatar className="h-4 w-4 rounded-[4px] border border-[#EAEAEA] shrink-0">
                    <AvatarFallback className="bg-white text-[#37352F] font-mono text-[8px] rounded-[4px]">
                      DS
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

        {/* Action Footer */}
        <div className="p-4 border-t border-[#EAEAEA] bg-white space-y-1">
          <Link href="/">
            <button
              className={cn(
                "flex items-center gap-3 w-full rounded-[4px] px-3 py-2.5 text-xs font-normal tracking-wider text-[#787774] hover:text-[#37352F] hover:bg-[#F7F7F7]/50 transition-colors duration-150 cursor-pointer border border-transparent mb-1",
                isCollapsed && "justify-center px-0"
              )}
              title="Exit Sandbox"
            >
              <LogOut className="h-4 w-4 shrink-0 stroke-[1.5]" />
              {!isCollapsed && <span className="truncate">Exit Sandbox</span>}
            </button>
          </Link>

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

      {/* Main Sandbox Contents Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Sticky Demo Sandbox Header Banner */}
        <div className="bg-[#37352F] text-[#F7F7F7] px-6 py-2.5 flex items-center justify-between text-xs tracking-wider font-mono border-b border-[#EAEAEA] shadow-md z-20 relative shrink-0">
          <div className="flex items-center gap-2 truncate">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="truncate">
              Demo Sandbox Mode — Exploring Sir Padampat Singhania University
              Student Portal
            </span>
          </div>
          <Link href="/signup" className="shrink-0 ml-4">
            <button className="bg-white text-[#37352F] font-bold px-3 py-1.5 rounded-[4px] border border-[#EAEAEA] hover:bg-[#F7F7F7] transition-all text-[9px] uppercase font-sans tracking-wider cursor-pointer">
              Create Free Account
            </button>
          </Link>
        </div>

        {/* Render child sandbox route */}
        <div className="flex-1 overflow-y-auto relative">{children}</div>
      </div>
    </div>
  );
}
