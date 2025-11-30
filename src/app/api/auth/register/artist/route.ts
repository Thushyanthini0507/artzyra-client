import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { email, password, name, shopName, phone, bio, category, skills, hourlyRate, availability } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category is required for artist registration" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Parse skills from comma-separated string to array
    const skillsArray = typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : skills;

    const userData = {
      email,
      password: hashedPassword,
      name,
      role: "artist",
      status: "pending", // Artists need admin approval
      phone,
      bio,
      category,
      skills: skillsArray,
      hourlyRate: parseFloat(hourlyRate),
      availability,
    };

    const user = await User.create(userData);

    // Remove password from response
    const userResponse = (user as any).toObject();
    delete userResponse.password;

    return NextResponse.json(
      { success: true, data: userResponse },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Artist registration error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
