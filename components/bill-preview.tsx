"use client"

import { forwardRef } from "react"
import Image from "next/image"
import type { Student } from "@/lib/student-store"
import type { Month } from "@/lib/month-context"
import { Badge } from "@/components/ui/badge"

interface BillPreviewProps {
  student: Student
  month: Month
  status: "paid" | "unpaid"
  receiptNo?: string
}

export const BillPreview = forwardRef<HTMLDivElement, BillPreviewProps>(
  function BillPreview(
    { student, month, status, receiptNo = `RCP${Date.now()}` },
    ref
  ) {
    const currentDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })

    return (
      <div
        ref={ref}
        className="relative mx-auto w-full max-w-lg overflow-hidden rounded-lg border-2 border-primary/30 bg-card p-6 font-sans print:border-black"
      >
        {/* Watermark Background */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-5">
          <div className="relative h-48 w-48">
            <Image
              src="/logo.png"
              alt="School Logo Watermark"
              fill
              className="object-contain opacity-30"
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="mb-6 border-b-2 border-primary/20 pb-4 text-center">
            <h1 className="text-2xl font-bold text-primary">
              Vivek Vikas Mission School
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              KHIRI * KOTULPUR * BANKURA * PIN - 722141
            </p>
            <p className="text-sm text-muted-foreground">
              Phone: +91 8777393801
            </p>
          </div>

          {/* Receipt Title */}
          <div className="mb-6 text-center">
            <h2 className="inline-block rounded bg-primary/10 px-4 py-1 text-lg font-semibold text-primary">
              FEE RECEIPT
            </h2>
          </div>

          {/* Receipt Details */}
          <div className="mb-6 flex flex-wrap justify-between gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Receipt No:</span>{" "}
              <span className="font-medium">{receiptNo}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Date:</span>{" "}
              <span className="font-medium">{currentDate}</span>
            </div>
          </div>

          {/* Student Info */}
          <div className="mb-6 space-y-2 rounded-lg bg-muted/50 p-4 text-sm">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <div>
                <span className="text-muted-foreground">Received from:</span>{" "}
                <span className="font-semibold">{student.name}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <div>
                <span className="text-muted-foreground">S/O, D/O:</span>{" "}
                <span className="font-medium">{student.guardianName}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <div>
                <span className="text-muted-foreground">Class:</span>{" "}
                <span className="font-medium">{student.class}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Roll/ID:</span>{" "}
                <span className="font-medium">{student.studentId}</span>
              </div>
            </div>
          </div>

          {/* Fee Table */}
          <div className="mb-6">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-primary/20">
                  <th className="py-2 text-left font-semibold text-foreground">
                    Description
                  </th>
                  <th className="py-2 text-center font-semibold text-foreground">
                    Month
                  </th>
                  <th className="py-2 text-right font-semibold text-foreground">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-3 text-foreground">Monthly/Tuition Fee</td>
                  <td className="py-3 text-center text-foreground">{month}</td>
                  <td className="py-3 text-right text-foreground">
                    Rs. {student.monthlyFee.toLocaleString("en-IN")}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-primary/20 font-bold">
                  <td colSpan={2} className="py-3 text-foreground">
                    Total
                  </td>
                  <td className="py-3 text-right text-primary">
                    Rs. {student.monthlyFee.toLocaleString("en-IN")}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Payment Status */}
          <div className="mb-6 flex items-center justify-center">
            <Badge
              className={
                status === "paid"
                  ? "bg-success text-success-foreground px-6 py-2 text-lg"
                  : "bg-destructive text-destructive-foreground px-6 py-2 text-lg"
              }
            >
              {status === "paid" ? "PAID" : "UNPAID"}
            </Badge>
          </div>

          {/* Signature Section */}
          <div className="mt-8 flex justify-between border-t border-dashed border-border pt-6">
            <div className="text-center">
              <div className="relative mb-2 h-12 w-32">
                <Image
                  src="/signature.png"
                  alt="Receiver's signature"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {"Receiver's Signature"}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 border-t border-border pt-4 text-center text-xs text-muted-foreground">
            <p>This is a computer-generated receipt.</p>
            <p>Thank you for your payment.</p>
          </div>
        </div>
      </div>
    )
  }
)
