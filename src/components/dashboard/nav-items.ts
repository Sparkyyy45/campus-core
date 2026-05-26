// src/components/dashboard/nav-items.ts
import { 
  Home, 
  Compass, 
  BookOpen, 
  FileText, 
  Map, 
  Heart, 
  PlusSquare, 
  Users,
  Settings,
  GraduationCap,
  LayoutDashboard
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: any;
  role?: "STUDENT" | "ADMIN";
  isProfile?: boolean;
}

export const studentNavItems: NavItem[] = [
  {
    title: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Explore",
    href: "/resources",
    icon: Compass,
  },
  {
    title: "Notes",
    href: "/notes",
    icon: BookOpen,
  },
  {
    title: "PYQs",
    href: "/pyqs",
    icon: FileText,
  },
  {
    title: "Roadmap",
    href: "/roadmap",
    icon: Map,
  },
  {
    title: "Notifications",
    href: "/announcements",
    icon: Heart,
  },
];

export const adminNavItems: NavItem[] = [
  {
    title: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Admin Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Create / Upload",
    href: "/admin/resources",
    icon: PlusSquare,
  },
  {
    title: "Manage Subjects",
    href: "/admin/subjects",
    icon: BookOpen,
  },
  {
    title: "Notifications",
    href: "/admin/announcements",
    icon: Heart,
  },
  {
    title: "Roadmaps",
    href: "/admin/roadmaps",
    icon: Map,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
];
