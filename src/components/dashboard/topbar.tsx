// src/components/dashboard/topbar.tsx
"use client";

import { Bell, Search, User, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";

interface TopbarProps {
  userName: string;
  role: string;
  branch?: string;
  unreadAnnouncements?: number;
}

export function Topbar({ userName, role, branch, unreadAnnouncements = 0 }: TopbarProps) {
  return (
    <header className="h-16 border-b border-[#EAEAEA] bg-white px-8 flex items-center justify-between sticky top-0 z-40 font-sans selection:bg-[#EAEAEA]">
      {/* Mobile Menu Toggle */}
      <Sheet>
        <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden mr-3 shrink-0 rounded-[4px]" />}>
          <Menu className="h-4 w-4 stroke-[1.5] text-[#37352F]" />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 bg-white border-r border-[#EAEAEA]">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <Sidebar 
            role={role as "STUDENT" | "ADMIN"} 
            unreadAnnouncements={unreadAnnouncements} 
            userName={userName}
            className="border-none w-full h-full" 
          />
        </SheetContent>
      </Sheet>

      {/* Minimalist Search Bar */}
      <div className="flex-1 max-w-md relative hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#787774] stroke-[1.5]" />
        <Input 
          placeholder="Search knowledge repository..." 
          className="pl-9 h-9 bg-[#F7F7F7] border border-[#EAEAEA] rounded-[4px] text-xs text-[#37352F] placeholder:text-[#787774] focus-visible:ring-1 focus-visible:ring-[#37352F] focus-visible:ring-offset-0 transition-colors"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 ml-auto">
        <Link 
          href="/announcements" 
          className="relative h-8 w-8 rounded-[4px] bg-[#F7F7F7] border border-[#EAEAEA] flex items-center justify-center text-[#787774] hover:text-[#37352F] hover:border-[#37352F] transition-colors"
          title="Announcements"
        >
          <Bell className="h-3.5 w-3.5 stroke-[1.5]" />
          {unreadAnnouncements > 0 && (
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-none bg-[#37352F]" />
          )}
        </Link>
        
        <div className="h-4 w-[1px] bg-[#EAEAEA] mx-1" />
        
        <div className="flex items-center gap-3 pl-1">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-[#37352F] tracking-wide leading-none">{userName}</p>
            <p className="text-[9px] font-mono text-[#787774] uppercase tracking-widest mt-1">
              {branch ? `${branch} • ` : ""}{role}
            </p>
          </div>
          <Link 
            href="/profile" 
            className="h-8 w-8 rounded-[4px] bg-[#F7F7F7] border border-[#EAEAEA] flex items-center justify-center text-[#787774] hover:text-[#37352F] hover:border-[#37352F] transition-colors"
          >
            <User className="h-3.5 w-3.5 stroke-[1.5]" />
          </Link>
        </div>
      </div>
    </header>
  );
}
