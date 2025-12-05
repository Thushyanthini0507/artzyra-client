import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Booking from "@/models/Booking";
import { isAdmin } from "@/lib/adminAuth";

export async function GET(request: Request) {
  try {
    console.log("[Admin Dashboard] Checking admin authorization...");
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      console.log("[Admin Dashboard] Unauthorized - not an admin");
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    console.log("[Admin Dashboard] Admin authorized, fetching stats...");

    await dbConnect();
    console.log("[Admin Dashboard] Database connected");

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

    const stats = {
      totalCustomers,
      totalArtists,
      pendingArtists,
      totalBookings,
      pendingBookings
    };

    console.log("[Admin Dashboard] Stats fetched:", stats);

    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    console.error("[Admin Dashboard] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
