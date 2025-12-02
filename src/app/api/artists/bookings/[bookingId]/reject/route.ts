import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import Booking from "@/models/Booking";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

async function getArtist(request: Request) {
  try {
    const headersList = await headers();
    let token = headersList.get("authorization")?.split(" ")[1];

    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get("token")?.value;
    }

    if (!token) return null;

    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "artist") return null;

    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const userId = await getArtist(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { bookingId } = await params;

    // Find booking and verify it belongs to this artist
    const booking = await Booking.findOne({ _id: bookingId, artist: userId });
    
    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    if (booking.status !== "pending") {
      return NextResponse.json({ success: false, error: "Booking is not pending" }, { status: 400 });
    }

    // Update booking status to rejected
    booking.status = "rejected";
    await booking.save();

    return NextResponse.json({ success: true, data: booking });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
