"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Palette,
  Calendar,
  CreditCard,
  Tags,
  BarChart3,
  LogOut,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Pending Artists",
    href: "/admin/pending-artists",
    icon: Palette,
  },
  {
    title: "Bookings",
    href: "/admin/bookings",
    icon: Calendar,
  },
  {
    title: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: Tags,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Profile",
    href: "/admin/profile",
    icon: Users,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="flex h-full w-64 flex-col bg-gradient-to-b from-[#1a1625] to-[#13111c] border-r border-white/10">
      {/* Logo Section with Glassmorphism */}
      <div className="flex h-20 items-center px-6 border-b border-white/10 backdrop-blur-md bg-white/5">
        <Link href="/" className="flex items-center gap-2 font-semibold group">
          <div className="relative h-12 w-40">
            <Image
              src="/images/logo.png"
              alt="Artzyra Logo"
              fill
              className="object-contain brightness-200 contrast-200"
              priority
            />
          </div>
        </Link>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 overflow-auto py-6">
        <nav className="grid items-start px-3 text-sm font-medium gap-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 relative overflow-hidden",
                  isActive
                    ? "bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 text-white border-l-4 border-purple-500 shadow-lg shadow-purple-500/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent hover:border-purple-500/50"
                )}
              >
                {/* Active indicator glow */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent animate-pulse" />
                )}
                
                <item.icon 
                  className={cn(
                    "h-5 w-5 transition-all duration-300 relative z-10",
                    isActive 
                      ? "text-purple-400" 
                      : "text-gray-500 group-hover:text-purple-400 group-hover:scale-110"
                  )} 
                />
                <span className="relative z-10 font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Section */}
      <div className="border-t border-white/10 p-4 backdrop-blur-md bg-white/5">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-400 hover:text-red-400 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-red-500/20 border border-transparent hover:border-red-500/30 transition-all duration-300 rounded-xl h-12"
          onClick={logout}
        >
          <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
          <span className="font-medium">Logout</span>
        </Button>
      </div>
    </div>
  );
}
