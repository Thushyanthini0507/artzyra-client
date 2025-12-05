import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";

const defaultCategories = [
  {
    name: "Classic Dance",description: "Traditional and classical dance forms",},
  { name: "DJ", description: "Disc Jockey services for events and parties" },
  { name: "Dancer", description: "Professional dance performances" },
  { name: "Design", description: "Graphic, UI/UX, and other design services" },
  { name: "Musician", description: "Live music performances and composition" },
  { name: "Painter", description: "Fine art painting and murals" },
  { name: "Photographer", description: "Professional photography services" },
  { name: "Video Editer", description: "Professional services" },
  { name: "Web Developer", description: "Professional services" },
];

export async function POST() {
  try {
    await dbConnect();
    
    // Clear existing categories to ensure we have exactly the requested list
    await Category.deleteMany({});

    // Insert default categories
    const categories = await Category.insertMany(defaultCategories);

    return NextResponse.json(
      { 
        success: true, 
        message: `Successfully seeded ${categories.length} categories`,
        data: categories 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Seed categories error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
