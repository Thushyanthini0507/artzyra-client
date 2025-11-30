import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Missing email or password" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      console.log("Login failed: User not found for email:", email);
      return NextResponse.json(
        { success: false, error: "Debug: User not found" },
        { status: 401 }
      );
    }

    console.log("User found:", user.email, "Role:", user.role);
    console.log("Stored password hash:", user.password?.substring(0, 10) + "...");

    const isMatch = await bcrypt.compare(password, user.password!);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      console.log("Login failed: Password mismatch for user:", email);
      return NextResponse.json(
        { success: false, error: "Invalid credentials" }, // Generic error for security
        { status: 401 }
      );
    }

    // Check if user is approved (specifically for artists)
    if (user.role === "artist" && user.status !== "approved") {
      return NextResponse.json(
        { 
          success: false, 
          error: user.status === "pending" 
            ? "Your account is pending approval from admin." 
            : "Your account has been rejected." 
        },
        { status: 403 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set HttpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return NextResponse.json({
      success: true,
      data: { user: userResponse, token }, // Sending token in body too just in case client needs it for something else, but cookie is primary
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
