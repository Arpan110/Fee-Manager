"use client"

import { forwardRef } from "react"
import Image from "next/image"
import type { Student } from "@/lib/student-store"
import type { Month } from "@/lib/month-context"
import { Badge } from "@/components/ui/badge"

/* ================= PRINT OVERRIDE ================= */

const PrintStyles = () => (
  <style jsx global>{`
    @media print {

      body {
        background: white !important;
      }

      /* ❌ FORCE REMOVE watermark / scribble / background */
      .bill-watermark {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
      }

      /* ✅ clean official receipt look */
      .bill-root {
        border: 2px solid #3b82f6 !important;
        box-shadow: none !important;
        background: white !important;
        max-width: 800px !important;
        padding: 32px !important;
      }
    }
  `}</style>
)

/* ================= TYPES ================= */

interface BillPreviewProps {
  student: Student
  month: Month
  status: "paid" | "unpaid"
  receiptNo?: string
}

/* ================= COMPONENT ================= */

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
      <>
        <PrintStyles />

        <div
          ref={ref}
          className="bill-root relative mx-auto w-full max-w-lg overflow-hidden rounded-lg border-2 border-primary/30 bg-white p-6 font-sans"
        >
          {/* ❌ WATERMARK (SCREEN ONLY) */}
          <div className="bill-watermark pointer-events-none absolute inset-0 flex items-center justify-center opacity-5">
            <div className="relative h-48 w-48">
              <Image
                src="/logo.png"
                alt="School Logo Watermark"
                fill
                className="object-contain opacity-30"
              />
            </div>
          </div>

          {/* ✅ CLEAN RECEIPT CONTENT */}
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

            {/* Title */}
            <div className="mb-6 text-center">
              <h2 className="inline-block rounded bg-primary/10 px-4 py-1 text-lg font-semibold text-primary">
                FEE RECEIPT
              </h2>
            </div>

            {/* Meta */}
            <div className="mb-6 flex justify-between text-sm">
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
              <div>
                <span className="text-muted-foreground">Received from:</span>{" "}
                <span className="font-semibold">{student.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Guardian:</span>{" "}
                <span className="font-medium">{student.guardian}</span>
              </div>
              <div className="flex gap-4">
                <div>
                  <span className="text-muted-foreground">Class:</span>{" "}
                  <span className="font-medium">{student.className}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Roll/ID:</span>{" "}
                  <span className="font-medium">{student.studentId}</span>
                </div>
              </div>
            </div>

            {/* Table */}
            <table className="w-full text-sm border-collapse mb-6">
              <thead>
                <tr className="border-b-2 border-primary/20">
                  <th className="py-2 text-left">Description</th>
                  <th className="py-2 text-center">Month</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3">Monthly / Tuition Fee</td>
                  <td className="py-3 text-center">{month}</td>
                  <td className="py-3 text-right">
                    Rs. {student.monthlyFee.toLocaleString("en-IN")}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 font-bold">
                  <td colSpan={2} className="py-3">
                    Total
                  </td>
                  <td className="py-3 text-right text-primary">
                    Rs. {student.monthlyFee.toLocaleString("en-IN")}
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* Status */}
            <div className="mb-6 flex justify-center">
              <Badge className="bg-green-600 text-white px-6 py-2 text-lg">
                {status === "paid" ? "PAID" : "UNPAID"}
              </Badge>
            </div>

            {/* Signature */}
            <div className="mt-8 border-t border-dashed pt-6 text-center">
              <div className="relative mx-auto mb-2 h-12 w-32">
                <Image
                  src="/signature.png"
                  alt="Receiver's signature"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Receiver's Signature
              </p>
            </div>

            {/* Footer */}
            <div className="mt-6 border-t pt-4 text-center text-xs text-muted-foreground">
              <p>This is a computer-generated receipt.</p>
              <p>Thank you for your payment.</p>
            </div>
          </div>
        </div>
      </>
    )
  }
)
