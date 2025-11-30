import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ status: "ok", database: "connected" });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", database: "disconnected", error: error.message },
      { status: 500 }
    );
  }
}
