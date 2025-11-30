import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import Payment from "@/models/Payment";
import Booking from "@/models/Booking";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// ...

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
    const { booking: bookingId, amount, paymentMethod } = body;

    const booking = await Booking.findOne({ _id: bookingId, customer: userId });
    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    const payment = await Payment.create({
      booking: bookingId,
      customer: userId,
      artist: booking.artist,
      amount,
      paymentMethod,
      status: "completed", // Simulating immediate completion
      transactionId: `TXN-${Date.now()}`
    });

    return NextResponse.json({ success: true, data: payment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
