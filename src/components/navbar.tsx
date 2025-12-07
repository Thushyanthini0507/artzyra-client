"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { user, logout, openLogin } = useAuth();
  const router = useRouter();


  const handleLogout = () => {
    logout();
    router.push("/");
  };

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

  return (
    <>
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-xl font-bold">
              <span className="text-[hsl(270.7 91% 65.1%)]">Art</span>
              <span className="text-[hsl(273.5,86.9%,21%)]">zyra</span>
            </Link>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link href={getDashboardLink()}>
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
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
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="font-medium">
                        {user.name}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-sm text-muted-foreground">
                        {user.email}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={openLogin}>
                    Sign In
                  </Button>
                  <Link href="/auth/register/customer">
                    <Button variant="outline">Sign Up</Button>
                  </Link>
                  <Link href="/auth/register/artist">
                    <Button>Become an Artist</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}


