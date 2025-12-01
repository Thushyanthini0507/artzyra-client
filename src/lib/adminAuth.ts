import { headers, cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function isAdmin() {
  try {
    const headersList = await headers();
    let token = headersList.get("authorization")?.split(" ")[1];

    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get("token")?.value;
    }

    if (!token) return false;

    const decoded: any = jwt.verify(token, JWT_SECRET);
    return decoded.role === "admin";
  } catch (error) {
    return false;
  }
}
