import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { isAdmin } from "@/lib/adminAuth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;
    await dbConnect();

    const artist = await User.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    ).select("-password");

    if (!artist) {
      return NextResponse.json(
        { success: false, error: "Artist not found" },
        { status: 404 }
      );
    }

    if (artist.role !== "artist") {
      return NextResponse.json(
        { success: false, error: "User is not an artist" },
        { status: 400 }
      );
    }

    console.log(`Artist ${id} approved by admin`);
    return NextResponse.json({
      success: true,
      data: artist,
      message: "Artist approved successfully",
    });
  } catch (error: any) {
    console.error("PUT /api/artists/[id]/approve error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
