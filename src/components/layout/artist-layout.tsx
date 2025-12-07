"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Calendar, User, DollarSign, Settings, CalendarDays, Star } from "lucide-react";
import { NotificationMenu } from "@/components/NotificationMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/artist",
    icon: LayoutDashboard,
  },
  {
    title: "Bookings",
    href: "/artist/bookings",
    icon: CalendarDays,
  },
  {
    title: "Calendar",
    href: "/artist/calendar",
    icon: Calendar,
  },
  {
    title: "Profile",
    href: "/artist/profile",
    icon: User,
  },
  {
    title: "Reviews",
    href: "/artist/reviews",
    icon: Star,
  },
  {
    title: "Earnings",
    href: "/artist/earnings",
    icon: DollarSign,
  },
  {
    title: "Settings",
    href: "/artist/settings",
    icon: Settings,
  },
];

export function ArtistLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const getInitials = (name: string | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <div className="flex flex-1">
        <aside className="w-64 border-r bg-background">
          <nav className="flex flex-col gap-2 p-4">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="flex-1 flex flex-col">
          {/* Header Bar with Notification Menu */}
          <header className="h-16 border-b bg-background flex items-center justify-end px-6 gap-4">
            <NotificationMenu />
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
          </header>
          <main className="flex-1 p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
