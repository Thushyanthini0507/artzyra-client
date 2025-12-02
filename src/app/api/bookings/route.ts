import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import Booking from "@/models/Booking";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

async function getCustomer(request: Request) {
  try {
    const headersList = await headers();
    let token = headersList.get("authorization")?.split(" ")[1];

    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get("token")?.value;
    }

    if (!token) return null;

    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "customer") return null;

    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getCustomer(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const { artist: artistId, bookingDate, startTime, endTime, location, specialRequests } = body;

    // Validate artist exists
    const artist = await User.findById(artistId);
    if (!artist || artist.role !== "artist") {
      return NextResponse.json({ success: false, error: "Invalid artist" }, { status: 400 });
    }

    const booking = await Booking.create({
      customer: userId,
      artist: artistId,
      bookingDate,
      startTime,
      endTime,
      location,
      specialRequests,
      status: "pending"
    });

    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
