"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"

import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { useStudentStore } from "@/lib/student-store"
import { useMonth } from "@/lib/month-context"

import {
  ArrowLeft,
  User,
  Phone,
  GraduationCap,
  Users,
  CreditCard,
  Hash,
  FileDown,
} from "lucide-react"

export default function StudentDetailPage() {
  const params = useParams()
  const id = params.id as string

  const { getStudentById, paymentsMap } = useStudentStore()
  const { selectedMonth } = useMonth()

  const student = getStudentById(id)
  const billRef = useRef<HTMLDivElement>(null)

  if (!student) {
    return (
      <AdminLayout title="Student Details" showMonthSelector>
        <div className="p-10 text-center">
          <p className="text-xl text-red-600">Student not found</p>
          <Button asChild className="mt-4">
            <Link href="/students">Back</Link>
          </Button>
        </div>
      </AdminLayout>
    )
  }

  const payments = paymentsMap[student._id] || []
  const currentYear = new Date().getFullYear()

  const paid = payments.find(
    (p) =>
      p.month === selectedMonth &&
      p.year === currentYear &&
      p.status === "PAID"
  )

  const paymentStatus = paid ? "paid" : "unpaid"

  // ✅ SAME UI DOWNLOAD
  const handleDownloadPDF = () => {
    if (!billRef.current) return

    const win = window.open("", "_blank")
    if (!win) return

    win.document.write(`
      <html>
        <head>
          <title>Fee Receipt</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { background: white; padding: 30px; }
          </style>
        </head>
        <body>
          ${billRef.current.outerHTML}
        </body>
      </html>
    `)

    win.document.close()
    win.onload = () => win.print()
  }

  const infoItems = [
    { icon: User, label: "Name", value: student.name },
    { icon: Hash, label: "Student ID", value: student.studentId },
    { icon: GraduationCap, label: "Class", value: student.className },
    { icon: GraduationCap, label: "Section", value: student.section },
    { icon: Phone, label: "Phone", value: student.phone },
    { icon: Users, label: "Guardian", value: student.guardian },
    {
      icon: CreditCard,
      label: "Monthly Fee",
      value: `Rs. ${student.monthlyFee.toLocaleString("en-IN")}`,
    },
  ]

  return (
    <AdminLayout title="Student Details" showMonthSelector>
      <div className="space-y-6">

        {/* BACK */}
        <Button asChild variant="outline">
          <Link href="/students">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to students
          </Link>
        </Button>

        {/* STUDENT INFO */}
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {infoItems.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* RECEIPT */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Fee Receipt - {selectedMonth}</CardTitle>
            <Button onClick={handleDownloadPDF} size="sm">
              <FileDown className="h-4 w-4 mr-2" /> Download PDF
            </Button>
          </CardHeader>

          <CardContent>
            <div
              ref={billRef}
              className="relative rounded-lg border bg-white p-8"
            >
              {/* WATERMARK */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <Image
                  src="/logo.png"
                  alt="logo"
                  width={400}
                  height={400}
                  className="object-contain"
                />
              </div>

              <div className="relative z-10 space-y-4">

                {/* HEADER */}
                <div className="border-b pb-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <Image src="/logo.png" alt="logo" width={60} height={60} />
                    <h1 className="text-xl font-bold text-blue-900">
                      Vivek Vikas Mission School
                    </h1>
                  </div>
                  <p className="text-xs">KHIRI • KOTULPUR • BANKURA • 722141</p>
                  <p className="text-xs">Phone: 8777393801</p>
                </div>

                {/* STATUS */}
                <div className="flex justify-center pt-4">
                  <Badge
                    className={
                      paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }
                  >
                    {paymentStatus === "paid"
                      ? "PAYMENT RECEIVED"
                      : "PAYMENT PENDING"}
                  </Badge>
                </div>

                {/* BASIC DETAILS */}
                <div className="text-sm text-center space-y-1">
                  <p><b>Name:</b> {student.name}</p>
                  <p><b>Class:</b> {student.className} {student.section}</p>
                  <p><b>Month:</b> {selectedMonth}</p>
                  <p><b>Amount:</b> Rs. {student.monthlyFee.toLocaleString("en-IN")}</p>
                </div>

              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
