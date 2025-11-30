import { NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

async function isAdmin(request: Request) {
  try {
    const headersList = await headers();
    const token = headersList.get("authorization")?.split(" ")[1];

    if (!token) return false;

    const decoded: any = jwt.verify(token, JWT_SECRET);
    return decoded.role === "admin";
  } catch (error) {
    return false;
  }
}

export async function GET(request: Request) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    const pendingArtists = await User.find({ 
      role: "artist", 
      status: "pending" 
    }).select("-password").sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: pendingArtists });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
