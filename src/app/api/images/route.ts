import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Image from "@/models/Image";

export async function GET() {
  try {
    await dbConnect();

    // Fetch all images, sorted by newest first, with user info
    const images = await Image.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(100); // Limit to 100 most recent images

    return NextResponse.json({
      success: true,
      data: images,
    });
  } catch (error: any) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}


