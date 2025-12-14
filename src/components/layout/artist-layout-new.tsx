"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  User,
  DollarSign,
  Settings,
  CalendarDays,
  Bell,
  LogOut,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

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
  const router = useRouter();
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

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#13111c] via-[#1a1625] to-[#13111c]">
      {/* Left Sidebar */}
      <aside className="w-[280px] bg-gradient-to-b from-[#1a1625] to-[#13111c] border-r border-white/10 flex flex-col fixed h-full z-50">
        {/* Logo Section with Glassmorphism */}
        <div className="flex h-24 items-center px-8 border-b border-white/10 backdrop-blur-md bg-white/5">
          <Link href="/" className="flex items-center gap-3 group">
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

        {/* User Profile Section */}
        <div className="px-6 py-6 border-b border-white/5">
          <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10">
            <Avatar className="h-10 w-10 border border-white/20">
              <AvatarImage src={artistImage} alt={artistName} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white">
                {getInitials(artistName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold text-white text-sm truncate">{artistName}</span>
              <span className="text-xs text-white/60 truncate">{artistTitle}</span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

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

                <Icon 
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

        {/* Bottom Actions */}
        <div className="p-6 mt-auto space-y-3 border-t border-white/10 backdrop-blur-md bg-white/5">
          <Link href={`/artists/${user?._id || ""}`}>
             <Button className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white rounded-xl h-12 font-medium shadow-lg shadow-purple-900/20 border border-white/10">
               View Public Profile
             </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="w-full text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 justify-start px-6 h-12 rounded-xl gap-3 transition-all duration-300 group"
            onClick={logout}
          >
            <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>Log Out</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-[280px]">
        {/* Top Header Bar */}
        <header className="h-24 flex items-center justify-end px-8 bg-[#13111c]/80 backdrop-blur-md sticky top-0 z-40 border-b border-white/5">
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleRefresh}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white border-none shadow-lg shadow-emerald-900/20 rounded-xl h-10 px-4 gap-2 transition-all duration-300"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>

            <div className="h-8 w-[1px] bg-white/10 mx-2" />

            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5 rounded-full h-10 w-10 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
            </Button>
            
            <Avatar className="h-10 w-10 border border-white/10 cursor-pointer hover:border-purple-500/50 transition-colors">
              <AvatarImage src={artistImage} alt={artistName} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white">
                {getInitials(artistName)}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8 pt-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
