import { PublicNavbar } from "./public-navbar";
import { PublicFooter } from "./public-footer";

export function PublicLayout({ 
  children, 
  showFooter = true 
}: { 
  children: React.ReactNode;
  showFooter?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1">{children}</main>
      {showFooter && <PublicFooter />}
    </div>
  );
}
