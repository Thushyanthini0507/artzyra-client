import { headers, cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function isAdmin() {
  try {
    // First try to get token from cookies (HTTP-only cookie)
    const cookieStore = await cookies();
    let token = cookieStore.get("token")?.value;

    // If not in cookies, try Authorization header
    if (!token) {
      const headersList = await headers();
      const authHeader = headersList.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      console.log("isAdmin: No token found");
      return false;
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const isAdminUser = decoded.role === "admin";
    
    if (!isAdminUser) {
      console.log("isAdmin: User is not admin, role:", decoded.role);
    }
    
    return isAdminUser;
  } catch (error: any) {
    console.error("isAdmin error:", error.message);
    return false;
  }
}
