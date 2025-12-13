"use client";

import { PublicNavbar } from "@/components/layout/public-navbar";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
