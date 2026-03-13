import {
  Home,
  HardDrive,
  FolderTree,
  User,
  Settings,
  CreditCard,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
  external?: boolean;
}

export const publicNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Legal", href: "/legal" },
];

export const dashboardNav: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Connect Drives", href: "/dashboard", icon: HardDrive },
  { label: "File Tree Explorer", href: "/dashboard/drives", icon: FolderTree },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export const footerNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Terms of Service", href: "/legal/terms" },
  { label: "Privacy Policy", href: "/legal/privacy" },
];
