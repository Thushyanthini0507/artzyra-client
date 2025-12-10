"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { LayoutDashboard, CalendarDays, Heart, Mail, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/customer",
    icon: LayoutDashboard,
  },
  {
    title: "My Bookings",
    href: "/customer/bookings",
    icon: CalendarDays,
  },
  {
    title: "My Favorites",
    href: "/customer/favorites",
    icon: Heart,
  },
  {
    title: "Messages",
    href: "/customer/messages",
    icon: Mail,
  },
  {
    title: "Profile",
    href: "/customer/profile",
    icon: User,
  },
];

export function CustomerLayout({ children }: { children: React.ReactNode }) {
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

  const getUserFirstName = (name: string | undefined) => {
    if (!name) return "User";
    return name.split(" ")[0];
  };

  return (
    <div className="flex min-h-screen bg-[#13111c]">
      {/* Left Sidebar */}
      <aside className="w-64 bg-[#13111c] border-r border-white/10 flex flex-col">
        {/* Logo */}
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-[#5b21b6] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <span className="text-xl font-bold text-white">Artzyra</span>
          </Link>
        </div>

        {/* User Greeting */}
        <div className="px-4 mb-6">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#1e1b29] border border-white/5">
            <Avatar className="h-10 w-10 border-2 border-[#5b21b6]">
              {user?.profileImage && (
                <AvatarImage src={user.profileImage} alt={user.name} />
              )}
              <AvatarFallback className="bg-[#5b21b6] text-white">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="font-medium text-white truncate">Hello, {getUserFirstName(user?.name)}</p>
              <p className="text-xs text-gray-400 truncate">Welcome back!</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4">
          <div className="flex flex-col gap-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href === "/customer" && pathname === "/customer/dashboard");
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-[#2e1065] text-white shadow-lg shadow-purple-900/20"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className={cn("h-5 w-5", isActive ? "text-[#a78bfa]" : "text-gray-500")} />
                  {item.title}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Create New Booking Button and Logout */}
        <div className="p-4 mt-auto space-y-4">
          <Link href="/customer/bookings/create">
            <Button className="w-full bg-[#5b21b6] hover:bg-[#4c1d95] text-white rounded-xl py-6 shadow-lg shadow-purple-900/20">
              Create New Booking
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="w-full text-gray-400 hover:text-white hover:bg-white/5 justify-start px-4" 
            onClick={async () => {
              await logout();
              router.push("/");
            }}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#13111c]">
        {children}
      </div>
    </div>
  );
}
