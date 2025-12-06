import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Define public routes
  const publicRoutes = ["/", "/auth/login", "/auth/register", "/auth/signup", "/browse"];
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Protected routes
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Role-based access
  try {
    // Decode JWT payload without cryptographic verification
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    
    // Decode the payload
    let base64 = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    
    const payloadJson = atob(base64);
    const payload = JSON.parse(payloadJson);
    const userRole = String(payload.role || "").toLowerCase().trim();

    // Role-based route protection
    if (pathname.startsWith("/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (pathname.startsWith("/artist") && userRole !== "artist") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (pathname.startsWith("/customer") && userRole !== "customer") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch (error) {
    // Invalid token - redirect to login
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*", "/artist/:path*", "/customer/:path*", "/auth/:path*"],
};

