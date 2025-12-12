"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { cn, getInitials, getUserFirstName } from "@/lib/utils";
import { LayoutDashboard, CalendarDays, Heart, Mail, LogOut, User, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { NotificationCenter } from "@/components/shared/NotificationCenter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const sidebarItems = [
  { title: "Dashboard", href: "/customer", icon: LayoutDashboard },
  { title: "My Bookings", href: "/customer/bookings", icon: CalendarDays },
  { title: "Favorites", href: "/customer/favorites", icon: Heart },
  { title: "Messages", href: "/customer/messages", icon: Mail },
  { title: "Profile", href: "/customer/profile", icon: User },
];

export function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-[#13111c]">

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#13111c]">
        {/* Top Header with Actions */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#13111c] gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-[#5b21b6] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="text-xl font-bold text-white">Artzyra</span>
          </Link>

          {/* Navigation Icons */}
          <div className="flex items-center gap-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href === "/customer" && pathname === "/customer/dashboard");
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.title}
                  className={cn(
                    "flex items-center justify-center rounded-lg h-10 w-10 transition-all duration-200",
                    isActive
                      ? "bg-[#5b21b6] text-white shadow-lg shadow-purple-900/30"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <NotificationCenter />
            
            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10 border-2 border-[#5b21b6] cursor-pointer hover:border-[#7c3aed] transition-colors">
                    {user?.profileImage && (
                      <AvatarImage src={user.profileImage} alt={user.name} />
                    )}
                    <AvatarFallback className="bg-[#fcd34d] text-black font-bold">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#1e1b29] border-white/10" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-white">{user?.name}</p>
                    <p className="text-xs leading-none text-gray-400">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem 
                  className="text-gray-300 focus:bg-white/5 focus:text-white cursor-pointer"
                  onClick={() => router.push("/customer/profile")}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-gray-300 focus:bg-white/5 focus:text-white cursor-pointer"
                  onClick={() => router.push("/customer/settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem 
                  className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer"
                  onClick={async () => {
                    await logout();
                    router.push("/");
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
