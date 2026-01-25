import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  await connectDB();
  const { studentId, month, year } = await req.json();

  let payment = await Payment.findOne({ studentId, month, year });

  if (!payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  payment.status = payment.status === "PAID" ? "UNPAID" : "PAID";
  payment.paidAt = payment.status === "PAID" ? new Date() : undefined;

  await payment.save();

  return NextResponse.json(payment);
}
