import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Booking from "@/models/Booking";
import { isAdmin } from "@/lib/adminAuth";

export async function GET(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const [
      totalCustomers,
      totalArtists,
      pendingArtists,
      totalBookings,
      pendingBookings
    ] = await Promise.all([
      User.countDocuments({ role: "customer" }),
      User.countDocuments({ role: "artist" }),
      User.countDocuments({ role: "artist", status: "pending" }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: "pending" })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalCustomers,
        totalArtists,
        pendingArtists,
        totalBookings,
        pendingBookings
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
