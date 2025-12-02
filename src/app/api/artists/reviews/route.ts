import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import Review from "@/models/Review";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

async function getArtist(request: Request) {
  try {
    const headersList = await headers();
    let token = headersList.get("authorization")?.split(" ")[1];

    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get("token")?.value;
    }

    if (!token) return null;

    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "artist") return null;

    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const userId = await getArtist(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Get all reviews for this artist
    const reviews = await Review.find({ artist: userId })
      .populate("customer", "name email")
      .populate("booking", "service")
      .sort({ createdAt: -1 });

    // Calculate average rating
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    return NextResponse.json({
      success: true,
      data: reviews,
      stats: {
        averageRating: parseFloat(averageRating.toFixed(1)),
        totalReviews: reviews.length,
      },
    });
  } catch (error: any) {
    console.error("Error fetching artist reviews:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
