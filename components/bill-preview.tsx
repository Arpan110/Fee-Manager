"use client"

import { forwardRef } from "react"
import Image from "next/image"
import type { Student } from "@/lib/student-store"
import type { Month } from "@/lib/month-context"

interface BillPreviewProps {
  student: Student
  month: Month
  status: "paid" | "unpaid"
  receiptNo?: string
  amountInWords?: string
}

export const BillPreview = forwardRef<HTMLDivElement, BillPreviewProps>(
  function BillPreview(
    {
      student,
      month,
      status,
      receiptNo = `RCP-${Date.now()}`,
      amountInWords = "",
    },
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
        className="relative mx-auto w-full max-w-3xl bg-white px-10 py-8 text-[13px] text-black"
      >
        {/* 🌫 WATERMARK */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.06]">
          <div className="relative h-[420px] w-[420px]">
            <Image
              src="/logo.png"
              alt="Watermark"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="relative z-10">

          {/* 🔝 HEADER */}
          <div className="flex justify-center border-b-2 border-blue-800 pb-3">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="text-left leading-tight">
                <h1 className="text-xl font-bold text-blue-900">
                  VIVEK VIKAS MISSION SCHOOL
                </h1>
                <p className="text-[11px] text-gray-700 text-center">
                  KHIRI * KOTULPUR * BANKURA * PIN - 722141
                </p>
                <p className="text-[11px] text-gray-700 text-center">
                  Phone: 8777393801
                </p>
              </div>
            </div>
          </div>

          {/* TITLE */}
          <div className="mt-4 bg-blue-50 py-2 text-center font-semibold text-blue-900">
            FEE RECEIPT
          </div>

          {/* META */}
          <div className="mt-3 flex justify-between text-[12px]">
            <p><b>Receipt No:</b> {receiptNo}</p>
            <p><b>Date:</b> {currentDate}</p>
          </div>

          {/* STUDENT DETAILS */}
          <div className="mt-4 border-t pt-2">
            <p className="mb-2 font-semibold text-blue-900">STUDENT DETAILS</p>
            <div className="grid grid-cols-2 gap-y-1 text-[12px]">
              <p><b>Received from:</b></p><p className="text-end">{student.name}</p>
              <p><b>S/O, D/O:</b></p><p className="text-end">{student.guardian}</p>
              <p><b>Class:</b></p><p className="text-end">{student.className}</p>
              <p><b>Village:</b></p><p className="text-end">{student.village}</p>
              <p><b>Roll No.:</b></p><p className="text-end">{student.studentId}</p>
            </div>
          </div>

          {/* FEE DETAILS */}
          <div className="mt-5 border-t pt-2">
            <p className="mb-2 font-semibold text-blue-900">FEE DETAILS</p>

            <table className="w-full border border-gray-400 text-[12px]">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border px-2 py-1 text-left">Description</th>
                  <th className="border px-2 py-1 text-center">Month</th>
                  <th className="border px-2 py-1 text-right">Amount (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-2 py-1">Fees</td>
                  <td className="border px-2 py-1 text-center">{month}</td>
                  <td className="border px-2 py-1 text-right">
                    {student.monthlyFee.toLocaleString("en-IN")}
                  </td>
                </tr>

                <tr className="bg-blue-50 font-semibold">
                  <td className="border px-2 py-1" colSpan={2}>Total</td>
                  <td className="border px-2 py-1 text-right">
                    {student.monthlyFee.toLocaleString("en-IN")}
                  </td>
                </tr>

                <tr>
                  <td
                    colSpan={3}
                    className="border px-2 py-1 font-semibold text-blue-900"
                  >
                    Amount in Words: {amountInWords} Only
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* PAYMENT STATUS */}
          <div className="mt-52 flex justify-center">
            <div
              className={
                status === "paid"
                  ? "rounded border border-green-600 bg-green-100 px-8 py-3 font-bold text-green-800 text-sm"
                  : "rounded border border-red-600 bg-red-100 px-8 py-3 font-bold text-red-800 text-sm"
              }
            >
              {status === "paid" ? "PAYMENT RECEIVED" : "PAYMENT PENDING"}
            </div>
          </div>

          {/* SIGNATURE */}
          <div className="mt-12 flex justify-end">
            <div className="text-center">
              <div className="relative h-12 w-32">
                <Image
                  src="/signature.png"
                  alt="Signature"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="mt-1 text-[11px]">Receiver's Signature</p>
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-6 border-t pt-2 text-center text-[11px] text-gray-600">
            <p>This is a computer-generated receipt. No signature required.</p>
            <p>Thank you for your payment</p>
          </div>

        </div>
      </div>
    )
  }
)
