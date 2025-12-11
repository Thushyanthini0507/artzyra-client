"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, LogOut } from "lucide-react";
import { NotificationMenu } from "@/components/NotificationMenu";

export function PublicNavbar() {
  const { user, openLogin, logout } = useAuth();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getInitials = (name: string | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    switch (user.role) {
      case "admin":
        return "/admin";
      case "artist":
        return "/artist";
      case "customer":
        return "/customer";
      default:
        return "/";
    }
  };

  const linkClass = "text-sm font-medium text-white/90 hover:text-white transition-colors";

  return (
    <>
      <nav
        className={
        isHome
          ? `fixed top-0 w-full z-50 transition-all duration-300 ${
              isScrolled ? "bg-[#2d1b4e] shadow-md" : "bg-transparent border-none"
            }`
          : "fixed top-0 w-full z-50 border-b border-white/5 bg-[#2d1b4e] transition-all duration-300"
      }
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="text-2xl font-bold text-white"
              >
                Artzyra
              </Link>

              <div className="hidden md:flex items-center gap-6">
                <Link href="/" className={linkClass}>
                  Home
                </Link>
                <Link href="/browse" className={linkClass}>
                  Explore
                </Link>
                <Link href="/category" className={linkClass}>
                  Category
                </Link>
                <Link href="/about" className={linkClass}>
                  About
                </Link>
                <Link href="/auth/register/artist" className={linkClass}>
                  For Artists
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {user ? (
                <>
                  {(user.role === "customer" || user.role === "artist") && (
                    <NotificationMenu />
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-10 w-10 rounded-full"
                      >
                        <Avatar>
                          <AvatarFallback>
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">
                            {user.name || user.email || "User"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          href={getDashboardLink()}
                          className="cursor-pointer"
                        >
                          <User className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={logout}
                        className="cursor-pointer text-red-600"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button
                    variant={isHome ? "default" : "ghost"}
                    onClick={openLogin}
                    className={
                    isHome && !isScrolled
                      ? "px-6 bg-[#2d1b4e] text-white hover:bg-[#2d1b4e]/90 rounded-full border border-white/10"
                      : "px-6 text-white hover:text-white/90"
                  }
                  >
                    Login
                  </Button>
                  <Link href="/auth/register/customer">
                    <Button
                      className="px-6 bg-[#b39ddb] text-[#2d1b4e] hover:bg-[#b39ddb]/90 rounded-full font-semibold"
                    >
                      SignUp
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      {!isHome && <div className="h-16" />}
    </>
  );
}
