import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <span className="hidden font-bold sm:inline-block">
                Artzyra
              </span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                href="/about"
              >
                About
              </Link>
              <Link
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                href="/services"
              >
                Services
              </Link>
              <Link
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                href="/contact"
              >
                Contact
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              {/* Search could go here */}
            </div>
            <nav className="flex items-center space-x-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register/customer">
                <Button size="sm">Sign Up</Button>
              </Link>
              <Link href="/auth/register/artist">
                <Button variant="outline" size="sm">
                  Join as Artist
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by Artzyra. The source code is available on GitHub.
          </p>
        </div>
      </footer>
    </div>
  );
}
