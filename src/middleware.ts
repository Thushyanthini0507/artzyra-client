import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function middleware(request: NextRequest) {
  let token = request.cookies.get("token")?.value;

  if (!token) {
    const authHeader = request.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  const { pathname } = request.nextUrl;

  // Define protected routes and allowed roles
  const protectedRoutes = [
    { path: "/admin", roles: ["admin"] },
    { path: "/artist", roles: ["artist"] },
    { path: "/customer", roles: ["customer"] },
    { path: "/deliverer", roles: ["deliverer"] },
  ];

  const matchedRoute = protectedRoutes.find((route) =>
    pathname.startsWith(route.path)
  );

  if (matchedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
      );
      const userRole = payload.role as string;

      if (!matchedRoute.roles.includes(userRole)) {
        // Redirect to appropriate dashboard if role doesn't match
        if (userRole === "admin") return NextResponse.redirect(new URL("/admin", request.url));
        if (userRole === "artist") return NextResponse.redirect(new URL("/artist", request.url));
        if (userRole === "customer") return NextResponse.redirect(new URL("/customer", request.url));
        if (userRole === "deliverer") return NextResponse.redirect(new URL("/deliverer", request.url));
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      // Invalid token
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/artist/:path*", "/customer/:path*", "/deliverer/:path*"],
};
