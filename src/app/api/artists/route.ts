import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Category from "@/models/Category";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search");
    const categoryId = searchParams.get("category");
    const minRate = searchParams.get("minRate");
    const maxRate = searchParams.get("maxRate");

    const query: any = {
      role: "artist",
      status: "approved"
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { bio: { $regex: search, $options: "i" } },
        { skills: { $in: [new RegExp(search, "i")] } }
      ];
    }

    if (categoryId) {
      // If category is an ID, use it directly. If name, find ID first.
      if (categoryId.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = categoryId;
      } else {
        const cat = await Category.findOne({ name: categoryId });
        if (cat) query.category = cat._id;
      }
    }

    if (minRate || maxRate) {
      query.hourlyRate = {};
      if (minRate) query.hourlyRate.$gte = parseFloat(minRate);
      if (maxRate) query.hourlyRate.$lte = parseFloat(maxRate);
    }

    const skip = (page - 1) * limit;

    const artists = await User.find(query)
      .select("-password")
      .populate("category", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: artists,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
