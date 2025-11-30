import { NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import Booking from "@/models/Booking";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

async function getUser(request: Request) {
  try {
    const headersList = await headers();
    const token = headersList.get("authorization")?.split(" ")[1];

    if (!token) return null;

    const decoded: any = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ bookingId: string }> }) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { bookingId } = await params;
    
    const booking = await Booking.findById(bookingId)
      .populate("customer", "name email phone")
      .populate("artist", "name email phone shopName");

    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    // Check ownership
    const isOwner = 
      booking.customer._id.toString() === user.userId || 
      booking.artist._id.toString() === user.userId || 
      user.role === "admin";

    if (!isOwner) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
