"use client";

import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className="  justify-center  w-full">
        <AppSidebar role="admin" />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </SidebarProvider>
  );
}
