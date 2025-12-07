"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  User,
  DollarSign,
  Settings,
  CalendarDays,
  Star,
  Search,
  Bell,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NotificationMenu } from "@/components/NotificationMenu";

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

export function ArtistLayoutNew({ children }: { children: React.ReactNode }) {
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

  // Get artist profile data (you'll need to fetch this from API)
  const artistName = user?.name || "Artist";
  const artistTitle = "Painter & Illustrator"; // This should come from profile
  const artistImage = user?.profileImage || "";

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Sidebar - Dark Theme */}
      <aside className="w-64 bg-[#1a1a2e] text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-purple-900/30">
          <Link href="/" className="text-2xl font-bold text-white">
            Artzyra
          </Link>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-purple-900/30">
          <div className="flex flex-col items-center gap-3">
            <Avatar className="h-20 w-20 border-2 border-purple-500">
              <AvatarImage src={artistImage} alt={artistName} />
              <AvatarFallback className="bg-purple-600 text-white text-xl">
                {getInitials(artistName)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="font-semibold text-white">{artistName}</p>
              <p className="text-sm text-purple-300">{artistTitle}</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-purple-600 text-white"
                    : "text-purple-200 hover:bg-purple-900/30 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* View Public Profile Button */}
        <div className="p-4 border-t border-purple-900/30">
          <Button
            variant="default"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            asChild
          >
            <Link href={`/artists/${user?.id || ""}`}>View Public Profile</Link>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header Bar */}
        <header className="h-16 border-b bg-background flex items-center justify-between px-6">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search bookings, clients..."
                className="pl-10 w-full"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NotificationMenu />
            <Avatar className="h-10 w-10">
              <AvatarImage src={artistImage} alt={artistName} />
              <AvatarFallback className="bg-purple-600 text-white">
                {getInitials(artistName)}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-background overflow-auto">{children}</main>
      </div>
    </div>
  );
}

