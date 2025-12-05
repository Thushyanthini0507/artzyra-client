import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import { isAdmin } from "@/lib/adminAuth";

export async function GET() {
  try {
    await dbConnect();
    
    const categories = await Category.find({}).sort({ name: 1 });
    
    return NextResponse.json(
      { success: true, data: categories },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Categories fetch error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const adminCheck = await isAdmin();
    
    if (!adminCheck) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Admin access required. Please ensure you are logged in as an admin." },
        { status: 403 }
      );
    }

    await dbConnect();

    let body;
    try {
      body = await request.json();
    } catch (parseError: any) {
      return NextResponse.json(
        { success: false, error: "Invalid request body. Please ensure the request is properly formatted." },
        { status: 400 }
      );
    }

    const { name, description, image } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Category name is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    // Check for duplicate category name
    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: `Category "${name}" already exists` },
        { status: 400 }
      );
    }

    const category = await Category.create({ 
      name: name.trim(), 
      description: description?.trim() || undefined, 
      image: image || undefined 
    });

    return NextResponse.json(
      { success: true, data: category, message: "Category created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Internal Server Error",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
