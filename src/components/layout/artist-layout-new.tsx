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
  Image,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NotificationMenu } from "@/components/NotificationMenu";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/artist/dashboard",
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
  const { user, logout } = useAuth();

  const getInitials = (name: string | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const artistName = user?.name || "Artist";
  const artistTitle = "Painter & Illustrator"; // This should ideally come from the profile
  const artistImage = user?.profileImage || "";



  return (
    <div className="flex min-h-screen bg-[#13111c]">
      {/* Left Sidebar */}
      <aside className="w-[280px] bg-[#2e026d] flex flex-col fixed h-full z-50">
        {/* Logo */}
        <div className="p-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center">
               <div className="h-4 w-4 bg-[#2e026d] rounded-sm" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              Artzyra
            </span>
          </Link>
        </div>

        {/* User Profile Section */}
        <div className="px-8 pb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border-2 border-white/20">
              <AvatarImage src={artistImage} alt={artistName} />
              <AvatarFallback className="bg-[#5b21b6] text-white">
                {getInitials(artistName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-white text-sm">{artistName}</span>
              <span className="text-xs text-white/60">{artistTitle}</span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 rounded-xl px-6 py-4 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-[#5b21b6] text-white shadow-lg shadow-purple-900/20"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-white/60")} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-6 mt-auto space-y-2">
          <Link href={`/artists/${user?._id || ""}`}>
             <Button className="w-full bg-[#5b21b6] hover:bg-[#4c1d95] text-white rounded-xl h-12 font-medium">
               View Public Profile
             </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="w-full text-white/60 hover:text-white hover:bg-white/5 justify-start px-6 h-12 rounded-xl gap-4"
            onClick={logout}
          >
            <LogOut className="h-5 w-5" />
            <span>Log Out</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-[280px]">
        {/* Top Header Bar */}
        <header className="h-24 flex items-center justify-end px-8 bg-[#13111c] sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5 rounded-full h-10 w-10">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar className="h-10 w-10 border border-white/10 cursor-pointer">
              <AvatarImage src={artistImage} alt={artistName} />
              <AvatarFallback className="bg-[#5b21b6] text-white">
                {getInitials(artistName)}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8 pt-0 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

