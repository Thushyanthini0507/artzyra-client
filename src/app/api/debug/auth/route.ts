import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    const debugInfo: any = {
      hasToken: !!token,
      isAdmin: await isAdmin(),
    };

    if (token) {
      try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        debugInfo.decodedToken = {
          userId: decoded.userId,
          role: decoded.role,
          exp: decoded.exp,
          iat: decoded.iat,
        };
      } catch (err: any) {
        debugInfo.tokenError = err.message;
      }
    }

    return NextResponse.json({
      success: true,
      data: debugInfo,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
