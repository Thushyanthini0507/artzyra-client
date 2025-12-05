import { NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

async function getCustomer(request: Request) {
  try {
    const headersList = await headers();
    const token = headersList.get("authorization")?.split(" ")[1];

    if (!token) return null;

    const decoded: any = jwt.verify(token, JWT_SECRET);
    return decoded.role === "customer" ? decoded.userId : null;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const userId = await getCustomer(request);
    if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const user = await User.findById(userId).populate("favorites");
    
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: user.favorites || [] });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getCustomer(request);
    if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { artistId } = await request.json();
    if (!artistId) return NextResponse.json({ success: false, error: "Artist ID required" }, { status: 400 });

    await dbConnect();
    const user = await User.findById(userId);
    
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    const favorites = user.favorites || [];
    const index = favorites.indexOf(artistId);
    const isFavorited = index === -1;

    if (isFavorited) {
      // Add to favorites
      favorites.push(artistId);
    } else {
      // Remove from favorites
      favorites.splice(index, 1);
    }

    user.favorites = favorites;
    await user.save();

    return NextResponse.json({ 
      success: true, 
      data: favorites,
      isFavorited
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
