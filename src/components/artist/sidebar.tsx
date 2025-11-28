"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Palette, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export function ArtistSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const links = [
    {
      href: "/artist",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/artist/portfolio",
      label: "Portfolio",
      icon: Palette,
    },
    {
      href: "/artist/profile",
      label: "Profile",
      icon: User,
    },
    {
      href: "/artist/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <div className="flex h-full flex-col border-r bg-muted/40">
      <div className="flex h-14 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span>Artzyra Artist</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                pathname === link.href
                  ? "bg-muted text-primary"
                  : "text-muted-foreground"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={() => logout()}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
