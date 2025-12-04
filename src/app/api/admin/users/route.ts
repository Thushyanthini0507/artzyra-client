import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { isAdmin } from "@/lib/adminAuth";

export async function GET(request: Request) {
  try {
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      console.log("GET /api/admin/users: Unauthorized - not admin");
      return NextResponse.json({ success: false, error: "Unauthorized - Admin access required" }, { status: 403 });
    }

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");

    const query: any = {};
    if (role) query.role = role;

    const users = await User.find(query).select("-password").sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      console.log("PUT /api/admin/users: Unauthorized - not admin");
      return NextResponse.json({ success: false, error: "Unauthorized - Admin access required" }, { status: 403 });
    }

    await dbConnect();
    const body = await request.json();
    const { userId, status } = body;

    if (!userId || !status) {
      return NextResponse.json({ success: false, error: "Missing required fields: userId and status" }, { status: 400 });
    }

    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status. Must be: pending, approved, or rejected" }, { status: 400 });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    console.log(`User ${userId} status updated to ${status} by admin`);
    return NextResponse.json({ success: true, data: user, message: `User ${status} successfully` });
  } catch (error: any) {
    console.error("PUT /api/admin/users error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
