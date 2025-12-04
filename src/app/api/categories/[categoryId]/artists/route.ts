import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Booking from "@/models/Booking";
import { checkBookingAvailability } from "@/lib/booking-utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    await dbConnect();
    const { categoryId } = await params;

    // Get query parameters for date and time filtering
    const { searchParams } = new URL(request.url);
    const bookingDate = searchParams.get("bookingDate");
    const startTime = searchParams.get("startTime");
    const endTime = searchParams.get("endTime");

    // Find all approved artists in this category
    const allArtists = await User.find({
      role: "artist",
      status: "approved",
      category: categoryId,
    }).select("-password");

    // If date/time filters are provided, filter out unavailable artists
    if (bookingDate && startTime && endTime) {
      const availableArtists = [];

      for (const artist of allArtists) {
        // Get existing bookings for this artist on the selected date
        const existingBookings = await Booking.find({
          artist: artist._id,
          bookingDate: new Date(bookingDate),
        }).populate("artist");

        // Check if artist is available
        const availability = checkBookingAvailability(
          artist._id.toString(),
          bookingDate,
          startTime,
          endTime,
          existingBookings
        );

        if (availability.available) {
          availableArtists.push(artist);
        }
      }

      return NextResponse.json({ success: true, data: availableArtists });
    }

    // If no date/time filters, return all artists
    return NextResponse.json({ success: true, data: allArtists });
  } catch (error: any) {
    console.error("Error fetching artists by category:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
