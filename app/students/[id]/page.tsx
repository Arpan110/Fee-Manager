"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { AdminLayout } from "@/components/admin-layout"
import { FeeTable } from "@/components/fee-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useStudentStore } from "@/lib/student-store"
import { useMonth } from "@/lib/month-context"
import { use } from "react"
import {
  ArrowLeft,
  User,
  Phone,
  GraduationCap,
  Users,
  CreditCard,
  Hash,
  FileDown,
  Printer,
} from "lucide-react"

function StudentDetailContent({ id }: { id: string }) {
  const { getStudentById, togglePaymentStatus } = useStudentStore()
  const { selectedMonth } = useMonth()
  const student = getStudentById(id)
  const billRef = useRef<HTMLDivElement>(null)

  const handlePrintBill = () => {
    const billContent = billRef.current
    if (!billContent || !student) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Fee Receipt - ${student.name}</title>
        <style>
          * { margin: 0; padding: 0; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: white; }
          .page { width: 8.5in; height: 11in; margin: 0 auto; padding: 20px; box-sizing: border-box; position: relative; }
          .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.08; z-index: 0; width: 300px; height: 300px; }
          .watermark img { width: 100%; height: 100%; object-fit: contain; }
          .content { position: relative; z-index: 1; }
          .header { text-align: center; border-bottom: 3px solid #1e3a8a; padding-bottom: 15px; margin-bottom: 20px; }
          .logo-section { display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 10px; }
          .logo { width: 80px; height: 80px; flex-shrink: 0; }
          .logo img { width: 100%; height: 100%; object-fit: contain; }
          .institution-name { font-size: 28px; font-weight: bold; color: #1e3a8a; line-height: 1.2; }
          .institution-details { font-size: 12px; color: #666; margin-top: 5px; }
          .receipt-title { background: #f0f4ff; padding: 10px; border-radius: 4px; font-size: 18px; font-weight: bold; color: #1e3a8a; margin-bottom: 15px; text-align: center; }
          .receipt-meta { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 15px; padding: 0 10px; }
          .section { margin-bottom: 20px; }
          .section-title { font-size: 12px; font-weight: bold; color: #1e3a8a; margin-bottom: 8px; padding-bottom: 5px; border-bottom: 2px solid #e0e7ff; }
          .info-box { background: #f9fafb; padding: 12px; border-radius: 4px; font-size: 12px; line-height: 1.6; }
          .info-row { display: flex; justify-content: space-between; padding: 4px 0; }
          .info-label { font-weight: 600; color: #374151; min-width: 120px; }
          .info-value { color: #111827; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th { background: #f0f4ff; border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 11px; font-weight: bold; color: #1e3a8a; }
          td { border: 1px solid #ddd; padding: 8px; font-size: 11px; }
          .amount-right { text-align: right; }
          .total-row { background: #eff6ff; font-weight: bold; }
          .status-badge { display: inline-block; padding: 6px 12px; border-radius: 4px; font-weight: bold; font-size: 12px; text-align: center; margin: 15px 0; }
          .status-paid { background: #dcfce7; color: #166534; }
          .status-unpaid { background: #fee2e2; color: #991b1b; }
          .signature-section { margin-top: 40px; display: flex; justify-content: space-between; padding: 0 20px; }
          .sig-box { text-align: center; width: 45%; }
          .sig-image { height: 60px; margin-bottom: 5px; display: flex; align-items: center; justify-content: center; }
          .sig-image img { max-height: 100%; max-width: 100%; object-fit: contain; }
          .sig-line { border-bottom: 1px solid #333; margin-bottom: 5px; }
          .sig-label { font-size: 10px; font-weight: 600; color: #333; }
          .footer { text-align: center; font-size: 10px; color: #999; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; }
          @page { margin: 0; }
          @media print { body { margin: 0; padding: 0; } .page { margin: 0; padding: 20px; width: 100%; height: 100%; } }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="watermark">
            <img src="/logo.png" alt="Institution Logo" />
          </div>
          <div class="content">
            ${billContent.innerHTML}
          </div>
        </div>
      </body>
      </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
    setTimeout(() => printWindow.print(), 250)
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="rounded-full bg-muted p-6">
          <User className="h-12 w-12 text-muted-foreground" />
        </div>
        <p className="mt-4 text-xl text-muted-foreground">Student not found</p>
        <p className="mt-2 text-sm text-muted-foreground">
          The student may have been deleted or the ID is incorrect.
        </p>
        <Button asChild variant="outline" className="mt-4 bg-transparent">
          <Link href="/students">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Students
          </Link>
        </Button>
      </div>
    )
  }

  const paymentStatus = student.feeStatus[selectedMonth]

  const infoItems = [
    { icon: User, label: "Name", value: student.name },
    { icon: Hash, label: "Student ID", value: student.studentId },
    { icon: GraduationCap, label: "Class", value: student.class },
    { icon: GraduationCap, label: "Section", value: student.section },
    { icon: Phone, label: "Phone", value: student.phone },
    { icon: Users, label: "Guardian", value: student.guardianName },
    { icon: CreditCard, label: "Monthly Fee", value: `Rs. ${student.monthlyFee.toLocaleString("en-IN")}` },
  ]

  const handleDownloadPDF = () => {
    const billContent = billRef.current
    if (!billContent || !student) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Fee Receipt - ${student.name}</title>
        <style>
          * { margin: 0; padding: 0; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: white; }
          .page { width: 8.5in; height: 11in; margin: 0 auto; padding: 20px; box-sizing: border-box; position: relative; }
          .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.08; z-index: 0; width: 300px; height: 300px; }
          .watermark img { width: 100%; height: 100%; object-fit: contain; }
          .content { position: relative; z-index: 1; }
          .header { text-align: center; border-bottom: 3px solid #1e3a8a; padding-bottom: 15px; margin-bottom: 20px; }
          .logo-section { display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 10px; }
          .logo { width: 80px; height: 80px; flex-shrink: 0; }
          .logo img { width: 100%; height: 100%; object-fit: contain; }
          .institution-name { font-size: 28px; font-weight: bold; color: #1e3a8a; line-height: 1.2; }
          .institution-details { font-size: 12px; color: #666; margin-top: 5px; }
          .receipt-title { background: #f0f4ff; padding: 10px; border-radius: 4px; font-size: 18px; font-weight: bold; color: #1e3a8a; margin-bottom: 15px; text-align: center; }
          .receipt-meta { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 15px; padding: 0 10px; }
          .section { margin-bottom: 20px; }
          .section-title { font-size: 12px; font-weight: bold; color: #1e3a8a; margin-bottom: 8px; padding-bottom: 5px; border-bottom: 2px solid #e0e7ff; }
          .info-box { background: #f9fafb; padding: 12px; border-radius: 4px; font-size: 12px; line-height: 1.6; }
          .info-row { display: flex; justify-content: space-between; padding: 4px 0; }
          .info-label { font-weight: 600; color: #374151; min-width: 120px; }
          .info-value { color: #111827; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th { background: #f0f4ff; border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 11px; font-weight: bold; color: #1e3a8a; }
          td { border: 1px solid #ddd; padding: 8px; font-size: 11px; }
          .amount-right { text-align: right; }
          .total-row { background: #eff6ff; font-weight: bold; }
          .status-badge { display: inline-block; padding: 6px 12px; border-radius: 4px; font-weight: bold; font-size: 12px; text-align: center; margin: 15px 0; }
          .status-paid { background: #dcfce7; color: #166534; }
          .status-unpaid { background: #fee2e2; color: #991b1b; }
          .signature-section { margin-top: 40px; display: flex; justify-content: space-between; padding: 0 20px; }
          .sig-box { text-align: center; width: 45%; }
          .sig-image { height: 60px; margin-bottom: 5px; display: flex; align-items: center; justify-content: center; }
          .sig-image img { max-height: 100%; max-width: 100%; object-fit: contain; }
          .sig-line { border-bottom: 1px solid #333; margin-bottom: 5px; }
          .sig-label { font-size: 10px; font-weight: 600; color: #333; }
          .footer { text-align: center; font-size: 10px; color: #999; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; }
          @page { margin: 0; }
          @media print { body { margin: 0; padding: 0; } .page { margin: 0; padding: 20px; width: 100%; height: 100%; } }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="watermark">
            <img src="/logo.png" alt="Institution Logo" />
          </div>
          <div class="content">
            ${billContent.innerHTML}
          </div>
        </div>
      </body>
      </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
    setTimeout(() => printWindow.print(), 250)
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button asChild variant="outline" className="bg-transparent">
        <Link href="/students">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Students
        </Link>
      </Button>

      {/* Student Information Card */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-primary">Student Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {infoItems.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="font-medium text-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Status Card */}
      <Card>
        <CardHeader className="border-b border-border">
          <CardTitle className="text-primary">Payment Status - {selectedMonth}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Status</p>
              <Badge
                className={
                  paymentStatus === "paid"
                    ? "mt-2 bg-success text-success-foreground"
                    : "mt-2 bg-destructive text-destructive-foreground"
                }
              >
                {paymentStatus === "paid" ? "PAID" : "UNPAID"}
              </Badge>
            </div>
            <Button
              onClick={() => togglePaymentStatus(student.id, selectedMonth)}
              variant="outline"
              className="bg-transparent"
            >
              {paymentStatus === "paid" ? "Mark as Unpaid" : "Mark as Paid"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Student Bill - Receipt Style */}
      <Card>
        <CardHeader className="border-b border-border flex flex-row items-center justify-between">
          <CardTitle className="text-primary">Fee Receipt - {selectedMonth}</CardTitle>
          <Button
            onClick={handleDownloadPDF}
            size="sm"
            className="gap-2"
          >
            <FileDown className="h-4 w-4" />
            Download Bill (PDF)
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <div
            ref={billRef}
            className="rounded-lg border border-border bg-white p-8 print:p-0 print:border-0"
          >
            {/* Watermark */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10 print:opacity-10">
              <Image
                src="/logo.png"
                alt="Institution Logo"
                width={400}
                height={400}
                className="h-96 w-96 object-contain"
              />
            </div>

            <div className="relative z-10 space-y-4">
              {/* Header with Logo */}
              <div className="border-b-2 border-blue-900 pb-4 text-center">
                <div className="mb-3 flex items-center justify-center gap-3">
                  <Image
                    src="/logo.png"
                    alt="Institution Logo"
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                  <div>
                    <h1 className="text-xl font-bold text-blue-900">Vivek Vikas Mission School</h1>
                    <p className="text-xs text-gray-600">Excellence in Education</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600">
                  Reg. Office: 123, Education Complex, City - 123456
                </p>
                <p className="text-xs text-gray-600">Phone: +91 98765 43210</p>
              </div>

              {/* Receipt Title */}
              <div className="bg-blue-50 py-2 text-center">
                <p className="text-lg font-bold text-blue-900">FEE RECEIPT</p>
              </div>

              {/* Receipt Metadata */}
              <div className="flex justify-between text-xs text-gray-700">
                <div>
                  <p>
                    <span className="font-semibold">Receipt No:</span> {`RCP-${student.id}-${new Date().getTime()}`}
                  </p>
                </div>
                <div className="text-right">
                  <p>
                    <span className="font-semibold">Date:</span>{" "}
                    {new Date().toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Student Details */}
              <div className="space-y-2 bg-gray-50 p-3 text-xs">
                <p>
                  <span className="font-semibold">Received from:</span> {student.name}
                </p>
                <p>
                  <span className="font-semibold">S/O, D/O:</span> {student.guardianName}
                </p>
                <div className="flex gap-6">
                  <p>
                    <span className="font-semibold">Class:</span> {student.class}
                  </p>
                  <p>
                    <span className="font-semibold">Section:</span> {student.section}
                  </p>
                  <p>
                    <span className="font-semibold">Roll No:</span> {student.studentId}
                  </p>
                </div>
              </div>

              {/* Fee Details Table */}
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="border-y-2 border-blue-900">
                    <th className="py-2 text-left font-semibold text-blue-900">Description</th>
                    <th className="py-2 text-center font-semibold text-blue-900">Month/Period</th>
                    <th className="py-2 text-right font-semibold text-blue-900">Amount (Rs.)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-300">
                    <td className="py-2">Monthly Tuition Fee</td>
                    <td className="py-2 text-center">{selectedMonth}</td>
                    <td className="py-2 text-right font-medium">
                      {student.monthlyFee.toLocaleString("en-IN")}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-blue-900">
                    <td colSpan={2} className="py-2 font-bold text-blue-900">
                      Total
                    </td>
                    <td className="py-2 text-right font-bold text-blue-900">
                      {student.monthlyFee.toLocaleString("en-IN")}
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* Payment Status */}
              <div className="flex justify-center">
                <div
                  className={`rounded px-6 py-2 text-sm font-bold ${
                    paymentStatus === "paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {paymentStatus === "paid" ? "PAYMENT RECEIVED" : "PAYMENT PENDING"}
                </div>
              </div>

              {/* Signature Section */}
              <div className="mt-8 flex justify-between border-t-2 border-dashed border-gray-400 pt-6">
                <div className="text-center">
                  <div className="h-16 w-32 flex items-center justify-center mb-2">
                    <Image
                      src="/signature.png"
                      alt="Guardian Signature"
                      width={120}
                      height={60}
                      className="object-contain"
                    />
                  </div>
                  <p className="text-xs font-semibold">Guardian Signature</p>
                </div>
                <div className="text-center">
                  <div className="h-16 w-32 flex items-center justify-center mb-2">
                    <Image
                      src="/signature.png"
                      alt="Receiver Signature"
                      width={120}
                      height={60}
                      className="object-contain"
                    />
                  </div>
                  <p className="text-xs font-semibold">Receiver Signature</p>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-300 pt-3 text-center text-xs text-gray-600">
                <p>This is a computer-generated receipt. No signature required.</p>
                <p className="mt-1">Thank you for your payment</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Month-wise Fee Status */}
      <Card>
        <CardHeader className="border-b border-border">
          <CardTitle className="text-primary">Month-wise Fee Status</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <FeeTable
            student={student}
            onStatusChange={(month) => togglePaymentStatus(student.id, month)}
          />
        </CardContent>
      </Card>
    </div>
  )
}

type StudentDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function StudentDetailPage({
  params,
}: StudentDetailPageProps) {
  const { id } = await params

  // Redirect "add" route to the proper add student page
  if (id === "add") {
    const { redirect } = await import("next/navigation")
    redirect("/students/add")
  }

  return (
    <AdminLayout title="Student Details" showDownloadReport={false} showMonthSelector={true}>
      <StudentDetailContent id={id} />
    </AdminLayout>
  )
}
