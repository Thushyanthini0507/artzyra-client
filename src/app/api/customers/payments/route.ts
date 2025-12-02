import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import Payment from "@/models/Payment";
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

    // Ensure models are registered
    // This is sometimes needed if models haven't been compiled yet in the dev server
    const _ = Booking; 
    const __ = User;

    const payments = await Payment.find({ customer: userId })
      .populate({
        path: "booking",
        select: "service artist totalAmount",
        populate: {
          path: "artist",
          select: "name"
        }
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: payments });
  } catch (error: any) {
    console.error("Error fetching customer payments:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
