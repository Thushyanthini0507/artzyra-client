import { NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import Review from "@/models/Review";
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

export async function POST(request: Request) {
  try {
    const userId = await getCustomer(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const { artist, booking, rating, comment } = body;

    // Verify booking exists and belongs to customer
    const bookingRecord = await Booking.findOne({ 
      _id: booking, 
      customer: userId, 
      artist: artist,
      status: "completed" 
    });

    if (!bookingRecord) {
      return NextResponse.json({ success: false, error: "Invalid booking or booking not completed" }, { status: 400 });
    }

    const review = await Review.create({
      customer: userId,
      artist,
      booking,
      rating,
      comment
    });

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
