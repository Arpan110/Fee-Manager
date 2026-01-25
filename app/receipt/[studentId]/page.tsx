"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { BillPreview } from "../../../components/bill-preview"
import { useStudentStore } from "../../../lib/student-store"
import { useMonth } from "../../../lib/month-context"

interface Payment {
  _id: string
  month: string
  year: number
  status: "PAID" | "UNPAID"
  amount: number
}

export default function ReceiptPage() {
  const params = useParams()
  const studentId = params.studentId as string
  const router = useRouter()
  const { selectedMonth } = useMonth()
  const { getStudentById } = useStudentStore()

  const [student, setStudent] = useState<any>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  const billRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const s = getStudentById(studentId)
        if (!s) return setLoading(false)

        setStudent(s)
        const res = await fetch(`/api/payments/${studentId}`)
        const data = await res.json()
        setPayments(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    if (studentId) loadData()
  }, [studentId, getStudentById])

  if (loading) return <div className="p-6">Loading...</div>
  if (!student) return <div className="p-6 text-red-600">Student not found</div>

  const currentYear = new Date().getFullYear()
  const paid = payments.some(
    (p) =>
      p.month === selectedMonth &&
      p.year === currentYear &&
      p.status === "PAID"
  )

  const status = paid ? "paid" : "unpaid"

  // ✅ CORRECT PRINT → PDF FUNCTION
  const handleDownloadPDF = () => {
    if (!billRef.current) return

    // clone bill only
    const clone = billRef.current.cloneNode(true) as HTMLElement

    // remove watermark/background
    clone.querySelectorAll(".bill-watermark").forEach((el) => el.remove())

    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      alert("Popup blocked")
      return
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Fee Receipt</title>

          <!-- ✅ Tailwind CDN (VERY IMPORTANT) -->
          <script src="https://cdn.tailwindcss.com"></script>

          <style>
            body {
              background: white;
              padding: 30px;
            }
          </style>
        </head>
        <body>
          ${clone.outerHTML}
        </body>
      </html>
    `)

    printWindow.document.close()

    printWindow.onload = () => {
      printWindow.focus()
      printWindow.print()
    }
  }

  return (
    <div className="p-6 space-y-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center print:hidden">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border rounded bg-white"
        >
          ⬅ Back
        </button>

        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-black text-white rounded"
        >
          ⬇ Download PDF
        </button>
      </div>

      <div ref={billRef}>
        <BillPreview
          student={student}
          month={selectedMonth as any}
          status={status}
        />
      </div>
    </div>
  )
}
