import { connectDB } from "@/lib/db"
import Student from "@/models/Student"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await connectDB()
    const students = await Student.find({ isDeleted: false })
    return NextResponse.json(students)
  } catch (error) {
    console.error("GET /students error:", error)
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()

    // ✅ SAFETY LOG (important for debugging)
    console.log("Incoming student body:", body)

    // ✅ MAP FIELDS (protect against frontend mismatch)
    const student = await Student.create({
      name: body.name,
      studentId: body.studentId,
      className: body.className || body.class,          // handles both
      section: body.section,
      phone: body.phone,
      guardian: body.guardian || body.guardianName,    // handles both
      monthlyFee: Number(body.monthlyFee),
      isDeleted: false,
    })

    return NextResponse.json(student, { status: 201 })
  } catch (error: any) {
    console.error("POST /students error:", error)

    return NextResponse.json(
      { error: error.message || "Failed to create student" },
      { status: 500 }
    )
  }
}
