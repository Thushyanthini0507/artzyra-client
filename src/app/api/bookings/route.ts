import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import Booking from "@/models/Booking";
import User from "@/models/User";
import { checkBookingAvailability } from "@/lib/booking-utils";

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

    // Validate required fields
    if (!artistId || !bookingDate || !startTime || !endTime || !location) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate time format and logic
    if (startTime >= endTime) {
      return NextResponse.json(
        { success: false, error: "End time must be after start time" },
        { status: 400 }
      );
    }

    // Validate artist exists
    const artist = await User.findById(artistId);
    if (!artist || artist.role !== "artist") {
      return NextResponse.json({ success: false, error: "Invalid artist" }, { status: 400 });
    }

    // Check if artist is approved
    if (artist.status !== "approved") {
      return NextResponse.json(
        { success: false, error: "Artist is not approved" },
        { status: 400 }
      );
    }

    // Check for existing bookings on the same date for this artist
    const existingBookings = await Booking.find({
      artist: artistId,
      bookingDate: new Date(bookingDate),
    }).populate("artist");

    // Check availability using overlap logic
    const availability = checkBookingAvailability(
      artistId,
      bookingDate,
      startTime,
      endTime,
      existingBookings
    );

    if (!availability.available) {
      return NextResponse.json(
        {
          success: false,
          error: "Artist is unavailable during this time. Please choose a different time slot.",
        },
        { status: 409 } // 409 Conflict
      );
    }

    // Create booking with confirmed status (auto-confirm)
    const booking = await Booking.create({
      customer: userId,
      artist: artistId,
      bookingDate,
      startTime,
      endTime,
      location,
      specialRequests,
      status: "confirmed", // Auto-confirm instead of pending
    });

    return NextResponse.json(
      { success: true, data: booking, message: "Booking confirmed successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Booking creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
