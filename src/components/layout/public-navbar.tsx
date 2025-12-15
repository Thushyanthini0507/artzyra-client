"use client";

import Link from "next/link";
import Image from "next/image";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, Settings, Heart, Menu } from "lucide-react";
import { NotificationMenu } from "@/components/NotificationMenu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

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

  const linkClass =
    "text-sm font-medium text-white/90 hover:text-white transition-colors";

  return (
    <>
      <nav
        className={
          isHome
            ? `fixed top-0 w-full z-50 transition-all duration-300 ${
                isScrolled
                  ? "bg-[#2d1b4e] shadow-md"
                  : "bg-transparent border-none"
              }`
            : "fixed top-0 w-full z-50 border-b border-white/5 bg-[#2d1b4e] transition-all duration-300"
        }
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center">
                <div className="relative h-14 w-48">
                  <Image
                    src="/images/logo.png"
                    alt="Artzyra Logo"
                    fill
                    className="object-contain brightness-200 contrast-200"
                    priority
                  />
                </div>
              </Link>

              <div className="hidden md:flex items-center gap-6">
                {/* Show Home and Explore for non-customers */}
                {user?.role !== "customer" && (
                  <>
                    <Link href="/" className={linkClass}>
                      Home
                    </Link>
                    <Link href="/browse" className={linkClass}>
                      Explore
                    </Link>
                  </>
                )}

                {/* Role-based navigation links (customers don't see nav links here) */}

                {user?.role === "artist" && (
                  <>
                    <Link href="/artist/bookings" className={linkClass}>
                      My Bookings
                    </Link>
                    <Link href="/artist/profile" className={linkClass}>
                      My Profile
                    </Link>
                  </>
                )}

                {user?.role === "admin" && (
                  <>
                    <Link href="/admin" className={linkClass}>
                      Dashboard
                    </Link>
                    <Link href="/admin/categories" className={linkClass}>
                      Categories
                    </Link>
                    <Link href="/admin/users" className={linkClass}>
                      Users
                    </Link>
                  </>
                )}

                {/* Guest navigation links */}
                {!user && (
                  <>
                    <Link href="/category" className={linkClass}>
                      Category
                    </Link>
                    <Link href="/about" className={linkClass}>
                      About
                    </Link>
                    <Link href="/auth/register/artist" className={linkClass}>
                      For Artists
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-6">
              {user ? (
                <>
                  {/* Customer-specific links near notifications */}
                  {user.role === "customer" && (
                    <div className="hidden md:flex items-center gap-6">
                      <Link href="/customer/bookings" className={linkClass}>
                        My Bookings
                      </Link>
                      <Link href="/customer/messages" className={linkClass}>
                        Messages
                      </Link>
                    </div>
                  )}

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
                          <AvatarImage 
                            src={user.profileImage} 
                            alt={user.name || "User"} 
                          />
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

                      {/* Customer-specific menu items */}
                      {user.role === "customer" && (
                        <>
                          <DropdownMenuItem asChild>
                            <Link
                              href="/customer/profile"
                              className="cursor-pointer"
                            >
                              <User className="mr-2 h-4 w-4" />
                              Profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href="/customer/settings"
                              className="cursor-pointer"
                            >
                              <Settings className="mr-2 h-4 w-4" />
                              Settings
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href="/customer/favorites"
                              className="cursor-pointer"
                            >
                              <Heart className="mr-2 h-4 w-4" />
                              Favorites
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}

                      {/* Dashboard for all logged-in users */}
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
                  <div className="hidden md:flex items-center gap-4">
                    <Link href="/auth/login">
                      <Button
                        variant={isHome ? "default" : "ghost"}
                        className={
                          isHome && !isScrolled
                            ? "px-6 bg-[#2d1b4e] text-white hover:bg-[#2d1b4e]/90 rounded-full border border-white/10"
                            : "px-6 text-white hover:text-white/90"
                        }
                      >
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/register/customer">
                      <Button className="px-6 bg-[#b39ddb] text-[#2d1b4e] hover:bg-[#b39ddb]/90 rounded-full font-semibold">
                        SignUp
                      </Button>
                    </Link>
                  </div>
                </>
              )}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-white"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[300px] bg-[#2d1b4e] border-l-white/10"
                >
                  <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                  <div className="flex flex-col gap-8 mt-8 px-4">
                    {/* Mobile Menu Links */}
                    <div className="flex flex-col gap-4">
                      {user?.role !== "customer" && (
                        <>
                          <Link href="/" className={linkClass}>
                            Home
                          </Link>
                          <Link href="/browse" className={linkClass}>
                            Explore
                          </Link>
                        </>
                      )}

                      {user?.role === "artist" && (
                        <>
                          <Link href="/artist/bookings" className={linkClass}>
                            My Bookings
                          </Link>
                          <Link href="/artist/profile" className={linkClass}>
                            My Profile
                          </Link>
                        </>
                      )}

                      {user?.role === "admin" && (
                        <>
                          <Link href="/admin" className={linkClass}>
                            Dashboard
                          </Link>
                          <Link href="/admin/categories" className={linkClass}>
                            Categories
                          </Link>
                          <Link href="/admin/users" className={linkClass}>
                            Users
                          </Link>
                        </>
                      )}

                      {!user && (
                        <>
                          <Link href="/category" className={linkClass}>
                            Category
                          </Link>
                          <Link href="/about" className={linkClass}>
                            About
                          </Link>
                          <Link
                            href="/auth/register/artist"
                            className={linkClass}
                          >
                            For Artists
                          </Link>
                        </>
                      )}
                    </div>

                    {/* Mobile Auth Buttons */}
                    {!user && (
                      <div className="flex flex-col gap-4">
                        <Link href="/auth/login" className="w-full">
                          <Button className="w-full bg-white/10 text-white hover:bg-white/20">
                            Login
                          </Button>
                        </Link>
                        <Link href="/auth/register/customer" className="w-full">
                          <Button className="w-full bg-[#b39ddb] text-[#2d1b4e]">
                            SignUp
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
      {!isHome && <div className="h-16" />}
    </>
  );
}
