"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideHeaderPaths = ["/admin", "/admin/pending-artists"];
  const showHeader = !hideHeaderPaths.includes(pathname);

  return (
    <div className="flex h-screen w-full bg-muted/40">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        {showHeader && <AdminHeader />}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
