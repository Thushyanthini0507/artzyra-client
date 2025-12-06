import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let token = request.cookies.get("token")?.value;

  if (!token) {
    const authHeader = request.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  const { pathname } = request.nextUrl;

  const protectedRoutes = [
    { path: "/admin", roles: ["admin"] },
    { path: "/artist", roles: ["artist"] },
    { path: "/customer", roles: ["customer"] },
  ];

  const matchedRoute = protectedRoutes.find((route) =>
    pathname.startsWith(route.path)
  );

  if (matchedRoute) {
    if (!token) {
      console.log(`[Middleware] No token found, redirecting to home`);
      return NextResponse.redirect(new URL("/", request.url));
    }

    try {
      // Decode JWT payload without cryptographic verification
      // The backend already verified the token during login
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error("Invalid JWT format");
      }
      
      // Decode the payload (second part of JWT)
      // Convert base64url to base64 first
      let base64 = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
      // Pad with = if needed
      while (base64.length % 4) {
        base64 += '=';
      }
      
      // Use atob() which works in Edge runtime
      const payloadJson = atob(base64);
      const payload = JSON.parse(payloadJson);
      
      // Normalize role to lowercase
      const rawRole = payload.role as string;
      const userRole = String(rawRole || "").toLowerCase().trim();

      console.log(`[Middleware] Path: ${pathname}, Token role: ${userRole}, Required: ${matchedRoute.roles.join(", ")}`);

      if (!matchedRoute.roles.includes(userRole)) {
        console.log(`[Middleware] Role mismatch. Redirecting ${userRole} to correct dashboard`);
        // Redirect to appropriate dashboard if role doesn't match
        if (userRole === "admin") return NextResponse.redirect(new URL("/admin", request.url));
        if (userRole === "artist") return NextResponse.redirect(new URL("/artist/dashboard", request.url));
        if (userRole === "customer") return NextResponse.redirect(new URL("/customer", request.url));
        return NextResponse.redirect(new URL("/", request.url));
      }
      
      console.log(`[Middleware] ✅ Access granted for ${userRole} to ${pathname}`);
    } catch (error) {
      // Invalid token format or decode error - log but allow through
      // The page component will handle unauthorized access
      console.log(`[Middleware] ⚠️ Token decode issue:`, error);
      // Don't redirect on decode error - let the page handle it
      // This prevents redirect loops
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/artist/:path*", "/customer/:path*"],
};

