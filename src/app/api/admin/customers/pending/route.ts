import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { isAdmin } from "@/lib/adminAuth";

export async function GET() {
  try {
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    await dbConnect();
    
    // Get pending customers
    const customers = await User.find({ 
      role: "customer",
      status: "pending" 
    })
      .select("-password")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: customers });
  } catch (error: any) {
    console.error("GET /api/admin/customers/pending error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}




