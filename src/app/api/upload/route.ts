import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dbConnect from "@/lib/db";
import Image from "@/models/Image";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

// Generate Cloudinary signature for signed uploads
function generateCloudinarySignature(params: Record<string, string | number>): string {
  if (!CLOUDINARY_API_SECRET) {
    throw new Error("CLOUDINARY_API_SECRET is required for signed uploads");
  }

  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return crypto
    .createHash("sha1")
    .update(sortedParams + CLOUDINARY_API_SECRET)
    .digest("hex");
}

async function getUserId(request: Request) {
  try {
    const headersList = await headers();
    let token = headersList.get("authorization")?.split(" ")[1];

    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get("token")?.value;
    }

    if (!token) return null;

    const decoded: any = jwt.verify(token, JWT_SECRET);
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Please log in to upload images" },
        { status: 401 }
      );
    }

    // Validate Cloudinary configuration
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      console.error("Cloudinary configuration missing");
      return NextResponse.json(
        { success: false, error: "Image upload service not configured" },
        { status: 500 }
      );
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file selected" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "File must be an image" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "File size must be less than 10MB" },
        { status: 400 }
      );
    }

    // Convert file to base64 for Cloudinary upload
    // Cloudinary accepts base64 data URI format
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataURI = `data:${file.type};base64,${base64}`;

    // Prepare Cloudinary upload parameters
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    
    // Build form data for Cloudinary
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append("file", dataURI);
    cloudinaryFormData.append("folder", "artzyra/may");

    // Use upload preset for unsigned uploads (recommended and easier)
    if (uploadPreset) {
      cloudinaryFormData.append("upload_preset", uploadPreset);
    } else {
      // If no preset, use signed upload with API secret
      const timestamp = Math.round(new Date().getTime() / 1000);
      cloudinaryFormData.append("timestamp", timestamp.toString());
      cloudinaryFormData.append("api_key", CLOUDINARY_API_KEY!);
      cloudinaryFormData.append("signature", generateCloudinarySignature({
        timestamp,
        folder: "artzyra/may",
      }));
    }

    // Upload to Cloudinary
    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: cloudinaryFormData,
      }
    );

    if (!cloudinaryResponse.ok) {
      const errorData = await cloudinaryResponse.json();
      console.error("Cloudinary upload error:", errorData);
      return NextResponse.json(
        { success: false, error: "Failed to upload image to Cloudinary" },
        { status: 500 }
      );
    }

    const cloudinaryData = await cloudinaryResponse.json();

    // Save image metadata to MongoDB
    await dbConnect();
    const image = await Image.create({
      user: userId,
      cloudinaryUrl: cloudinaryData.secure_url,
      cloudinaryPublicId: cloudinaryData.public_id,
      originalFilename: file.name,
      width: cloudinaryData.width,
      height: cloudinaryData.height,
      fileSize: file.size,
    });

    // Populate user info
    await image.populate("user", "name email");

    return NextResponse.json(
      {
        success: true,
        data: image,
        message: "Image uploaded successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

