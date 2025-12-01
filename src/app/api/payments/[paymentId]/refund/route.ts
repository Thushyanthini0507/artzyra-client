import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Payment from "@/models/Payment";
import { isAdmin } from "@/lib/adminAuth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { paymentId } = await params;
    await dbConnect();

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return NextResponse.json({ success: false, error: "Payment not found" }, { status: 404 });
    }

    if (payment.status === "refunded") {
      return NextResponse.json({ success: false, error: "Payment already refunded" }, { status: 400 });
    }

    payment.status = "refunded";
    await payment.save();

    return NextResponse.json({ success: true, data: payment });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
