import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

type Params = {
  params: Promise<{ studentId: string }>;
};

export async function GET(req: Request, { params }: Params) {
  try {
    const { studentId } = await params;

    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return NextResponse.json({ error: "Invalid studentId" }, { status: 400 });
    }

    const payments = await Payment.find({
      studentId: new mongoose.Types.ObjectId(studentId),
    }).sort({ createdAt: -1 });

    return NextResponse.json(payments);
  } catch (error) {
    console.error("GET payments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request, { params }: Params) {
  try {
    const { studentId } = await params;

    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return NextResponse.json({ error: "Invalid studentId" }, { status: 400 });
    }

    const body = await req.json();
    const { month, year, amount, status } = body;

    if (!month || !year || !amount) {
      return NextResponse.json(
        { error: "month, year, amount are required" },
        { status: 400 }
      );
    }

    const payment = await Payment.create({
      studentId: new mongoose.Types.ObjectId(studentId),
      month,
      year,
      amount,
      status: status || "PAID",
      ...(status === "PAID" && { paidAt: new Date() }),
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error("POST payment error:", error);
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    );
  }
}
