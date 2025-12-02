import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import Review from "@/models/Review";
import Booking from "@/models/Booking"; // Ensure Booking is registered
import User from "@/models/User"; // Ensure User is registered

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

export async function GET(request: Request) {
  try {
    const userId = await getCustomer(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const reviews = await Review.find({ customer: userId })
      .populate("artist", "name")
      .populate("booking", "service")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: reviews });
  } catch (error: any) {
    console.error("Error fetching customer reviews:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
