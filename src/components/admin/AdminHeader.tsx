"use client";

import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell, Settings } from "lucide-react";

export function AdminHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 items-center gap-4 border-b border-white/10 bg-gradient-to-r from-[#1e1b29] to-[#13111c] px-6 backdrop-blur-md shadow-lg">
      <div className="flex-1">
        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
          Admin Portal
        </h2>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Notifications Button */}
        <Button 
          variant="ghost" 
          size="icon"
          className="relative h-10 w-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300"
        >
          <Bell className="h-5 w-5 text-gray-400 hover:text-purple-400 transition-colors" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
        </Button>

        {/* Settings Button */}
        <Button 
          variant="ghost" 
          size="icon"
          className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300"
        >
          <Settings className="h-5 w-5 text-gray-400 hover:text-purple-400 transition-colors hover:rotate-90 duration-300" />
        </Button>

        {/* User Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-xl p-0 border-2 border-transparent hover:border-purple-500/50 transition-all duration-300">
              <Avatar className="h-10 w-10 rounded-xl ring-2 ring-purple-500/20 hover:ring-purple-500/50 transition-all duration-300">
                <AvatarImage src={user?.profileImage} alt={user?.name} className="rounded-xl" />
                <AvatarFallback className="rounded-xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 text-purple-400 font-semibold">
                  {user?.name?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-64 bg-[#1e1b29] border-white/10 backdrop-blur-md shadow-xl" 
            align="end" 
            forceMount
          >
            <DropdownMenuLabel className="font-normal p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 rounded-xl ring-2 ring-purple-500/30">
                  <AvatarImage src={user?.profileImage} alt={user?.name} className="rounded-xl" />
                  <AvatarFallback className="rounded-xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 text-purple-400 font-semibold">
                    {user?.name?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400">
                    {user?.email}
                  </p>
                  <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-md w-fit">
                    Admin
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem 
              onClick={logout}
              className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer m-2 rounded-lg"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
