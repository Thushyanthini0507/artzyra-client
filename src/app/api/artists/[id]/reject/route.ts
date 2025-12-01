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
    const body = await request.json();
    const { reason } = body;

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

    // Update artist status to rejected
    artist.status = "rejected";
    await artist.save();

    // Optionally, you could store the rejection reason in a separate field or notification
    // For now, we'll just log it
    if (reason) {
      console.log(`Artist ${artist.email} rejected. Reason: ${reason}`);
    }

    return NextResponse.json({
      success: true,
      message: "Artist rejected",
      data: {
        _id: artist._id,
        name: artist.name,
        email: artist.email,
        status: artist.status
      }
    });
  } catch (error: any) {
    console.error("Error rejecting artist:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to reject artist" },
      { status: 500 }
    );
  }
}
