import { NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import Booking from "@/models/Booking";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

async function getCustomer(request: Request) {
  try {
    const headersList = await headers();
    const token = headersList.get("authorization")?.split(" ")[1];

    if (!token) return null;

    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "customer") return null;

    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ bookingId: string }> }) {
  try {
    const userId = await getCustomer(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { bookingId } = await params;

    const booking = await Booking.findOne({ _id: bookingId, customer: userId });

    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    if (booking.status !== "pending") {
      return NextResponse.json({ success: false, error: "Cannot cancel non-pending booking" }, { status: 400 });
    }

    booking.status = "cancelled";
    await booking.save();

    return NextResponse.json({ success: true, data: booking });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
