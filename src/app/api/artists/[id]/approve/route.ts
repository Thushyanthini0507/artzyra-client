import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { isAdmin } from "@/lib/adminAuth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const artist = await User.findById(id);
    if (!artist) {
      return NextResponse.json({ success: false, error: "Artist not found" }, { status: 404 });
    }

    if (artist.role !== "artist") {
      return NextResponse.json({ success: false, error: "User is not an artist" }, { status: 400 });
    }

    artist.status = "approved";
    await artist.save();

    return NextResponse.json({ success: true, data: artist });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
