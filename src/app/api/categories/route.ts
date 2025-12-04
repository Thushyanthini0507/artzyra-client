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
    console.log("POST /api/categories: Request received");
    
    // Check admin authentication
    console.log("POST /api/categories: Checking admin authentication...");
    const adminCheck = await isAdmin();
    console.log("POST /api/categories: Admin check result:", adminCheck);
    
    if (!adminCheck) {
      console.log("POST /api/categories: Admin check failed - returning 403");
      return NextResponse.json(
        { success: false, error: "Unauthorized - Admin access required. Please ensure you are logged in as an admin." },
        { status: 403 }
      );
    }
    
    console.log("POST /api/categories: Admin authenticated, proceeding with category creation");

    // Connect to database
    await dbConnect();
    console.log("POST /api/categories: Database connected");

    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log("POST /api/categories: Request body parsed:", { name: body.name, hasDescription: !!body.description, hasImage: !!body.image });
    } catch (parseError: any) {
      console.error("POST /api/categories: Failed to parse request body:", parseError);
      return NextResponse.json(
        { success: false, error: "Invalid request body. Please ensure the request is properly formatted." },
        { status: 400 }
      );
    }

    const { name, description, image } = body;

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      console.log("POST /api/categories: Validation failed - name is missing or invalid");
      return NextResponse.json(
        { success: false, error: "Category name is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    // Check for duplicate category name
    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      console.log("POST /api/categories: Duplicate category found:", name);
      return NextResponse.json(
        { success: false, error: `Category "${name}" already exists` },
        { status: 400 }
      );
    }

    // Create category
    console.log("POST /api/categories: Creating category with data:", { name: name.trim(), description, hasImage: !!image });
    const category = await Category.create({ 
      name: name.trim(), 
      description: description?.trim() || undefined, 
      image: image || undefined 
    });
    console.log("POST /api/categories: Category created successfully:", category._id);

    return NextResponse.json(
      { success: true, data: category, message: "Category created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/categories: Category creation error:", error);
    console.error("POST /api/categories: Error stack:", error.stack);
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
