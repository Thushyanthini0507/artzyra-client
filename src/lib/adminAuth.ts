import { headers, cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function isAdmin() {
  try {
    console.log("[isAdmin] Starting admin check...");
    
    // First try to get token from cookies (HTTP-only cookie)
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    console.log("[isAdmin] All cookies:", allCookies.map(c => ({ name: c.name, hasValue: !!c.value })));
    
    let token = cookieStore.get("token")?.value;
    console.log("[isAdmin] Token from cookie:", token ? `${token.substring(0, 20)}...` : "NOT FOUND");

    // If not in cookies, try Authorization header
    if (!token) {
      const headersList = await headers();
      const authHeader = headersList.get("authorization");
      console.log("[isAdmin] Authorization header:", authHeader ? `${authHeader.substring(0, 30)}...` : "NOT FOUND");
      
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
        console.log("[isAdmin] Token from header:", token ? `${token.substring(0, 20)}...` : "NOT FOUND");
      }
    }

    if (!token) {
      console.log("[isAdmin] No token found in cookies or headers");
      return false;
    }

    console.log("[isAdmin] Verifying token with JWT_SECRET...");
    const decoded: any = jwt.verify(token, JWT_SECRET);
    console.log("[isAdmin] Token decoded successfully. User ID:", decoded.userId, "Role:", decoded.role);
    
    const isAdminUser = decoded.role === "admin";
    
    if (!isAdminUser) {
      console.log("[isAdmin] User is not admin, role:", decoded.role);
    } else {
      console.log("[isAdmin] User IS admin!");
    }
    
    return isAdminUser;
  } catch (error: any) {
    console.error("[isAdmin] Error during admin check:", error.message);
    console.error("[isAdmin] Error stack:", error.stack);
    return false;
  }
}
