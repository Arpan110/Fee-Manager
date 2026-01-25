import { connectDB } from "@/lib/db"
import Student from "@/models/Student"
import { NextResponse } from "next/server"
import mongoose from "mongoose"

type Params = {
  params: Promise<{ id: string }>
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const { id } = await params

    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid student id" }, { status: 400 })
    }

    const student = await Student.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    )

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Student deleted successfully",
      student,
    })
  } catch (error) {
    console.error("DELETE student error:", error)
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    )
  }
}
