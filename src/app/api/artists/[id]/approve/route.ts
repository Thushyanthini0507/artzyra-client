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

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const artistId = params.id;

    // Find the artist
    const artist = await User.findById(artistId);

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

    // Update artist status to approved
    artist.status = "approved";
    await artist.save();

    return NextResponse.json({
      success: true,
      message: "Artist approved successfully",
      data: {
        _id: artist._id,
        name: artist.name,
        email: artist.email,
        status: artist.status
      }
    });
  } catch (error: any) {
    console.error("Error approving artist:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to approve artist" },
      { status: 500 }
    );
  }
}
