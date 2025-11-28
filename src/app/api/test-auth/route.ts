import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();
    
    const email = "test-debug@example.com";
    const password = "password123";
    
    let user = await User.findOne({ email }).select("+password");
    let action = "found";
    
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({
        email,
        password: hashedPassword,
        name: "Debug User",
        role: "customer",
        status: "approved"
      });
      action = "created";
    } else {
      // Update password to ensure we know it
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await user.save();
      action = "updated";
    }

    // Verify immediately
    const isMatch = await bcrypt.compare(password, user.password!);
    
    return NextResponse.json({
      success: true,
      action,
      email,
      passwordUsed: password,
      isMatch,
      mongoId: user._id
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
