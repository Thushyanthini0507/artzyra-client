"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { LayoutDashboard, CalendarDays, Heart, Mail, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
    <div className="flex min-h-screen bg-background">
      {/* Left Sidebar */}
      <aside className="w-80 border-r bg-background flex flex-col">
        {/* User Greeting */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-3 mb-2">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Hello, {getUserFirstName(user?.name)}</p>
              <p className="text-sm text-muted-foreground">Welcome back!</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <div className="flex flex-col gap-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href === "/customer" && pathname === "/customer/dashboard");
              
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
          </div>
        </nav>

        {/* Create New Booking Button and Logout */}
        <div className="p-4 border-t space-y-2">
          <Link href="/customer/bookings/create">
            <Button className="w-full">Create New Booking</Button>
          </Link>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={async () => {
              await logout();
              router.push("/");
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
