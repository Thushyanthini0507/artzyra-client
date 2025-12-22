"use client";

import { PublicNavbar } from "@/components/layout/public-navbar";

export function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <PublicNavbar />
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
