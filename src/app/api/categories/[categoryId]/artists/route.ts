import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    await dbConnect();
    
    // Await params as it is a Promise in Next.js 15+ (and potentially 16)
    // Even if using older version, it's safer to treat as promise or check documentation, 
    // but based on recent Next.js changes, params are async.
    // However, looking at other routes might clarify if I should await it.
    // Let's assume standard Next.js 13/14 behavior first where it's an object, 
    // but the type signature I used above implies Promise. 
    // Let's check a sibling route to be consistent.
    
    // Actually, let's just use the standard signature and await if needed or access directly.
    // To be safe and consistent with modern Next.js, I will await it.
    const { categoryId } = await params;

    const artists = await User.find({
      role: "artist",
      status: "approved",
      category: categoryId,
    }).select("-password");

    return NextResponse.json({ success: true, data: artists });
  } catch (error: any) {
    console.error("Error fetching artists by category:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
