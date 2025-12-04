import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { isAdmin } from "@/lib/adminAuth";

export async function PUT(
  request: Request,
  { params }: { params: { id: string; action: string } }
) {
  try {
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const { id, action } = params;

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { success: false, error: "Invalid action. Must be 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    const status = action === "approve" ? "approved" : "rejected";

    await dbConnect();

    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Customer not found" },
        { status: 404 }
      );
    }

    if (user.role !== "customer") {
      return NextResponse.json(
        { success: false, error: "User is not a customer" },
        { status: 400 }
      );
    }

    console.log(`Customer ${id} ${action}d by admin`);
    return NextResponse.json({
      success: true,
      data: user,
      message: `Customer ${action}d successfully`,
    });
  } catch (error: any) {
    console.error("PUT /api/admin/customers/[id]/[action] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

