"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { AdminLayout } from "@/components/admin-layout"
import { StudentsTable } from "@/components/students-table"
import { useMonth } from "@/lib/month-context"
import { useStudentStore } from "@/lib/student-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { UserPlus, Search, FileDown, Printer } from "lucide-react"
import Image from "next/image"
import Loading from "./loading"

/* ---------------- REPORT PREVIEW ---------------- */

function MonthReportPreview({ students, month }: any) {
  const paidStudents = students.filter((s: any) => s.status === "paid")
  const unpaidStudents = students.filter((s: any) => s.status === "unpaid")

  const onlineStudents = paidStudents.filter((s: any) => s.mode === "ONLINE")
  const cashStudents = paidStudents.filter((s: any) => s.mode === "CASH")

  const totalCollection = paidStudents.reduce((s: number, a: any) => s + a.monthlyFee, 0)
  const onlineCollection = onlineStudents.reduce((s: number, a: any) => s + a.monthlyFee, 0)
  const cashCollection = cashStudents.reduce((s: number, a: any) => s + a.monthlyFee, 0)

  return (
    <div
      id="report-content"
      className="relative bg-white p-8 min-h-full print:p-6"
    >
      {/* WATERMARK */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-5">
        <Image src="/logo.png" alt="logo" width={350} height={350} />
      </div>

      <div className="relative z-10">

        {/* HEADER */}
        <div className="mb-6 border-b-2 border-blue-800 pb-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <Image src="/logo.png" alt="logo" width={70} height={70} />
            <div>
              <h1 className="text-2xl font-bold text-blue-900">
                Vivek Vikas Mission School
              </h1>
              <p className="text-sm text-gray-600">
                KHIRI • KOTULPUR • BANKURA • PIN - 722141
              </p>
              <p className="text-sm text-gray-600">Phone: 8777393801</p>
            </div>
          </div>
        </div>

        {/* TITLE */}
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold">MONTHLY FEE COLLECTION REPORT</h2>
          <p className="font-semibold text-blue-700">{month}</p>
          <p className="text-sm text-gray-500">
            Date: {new Date().toLocaleDateString("en-IN")}
          </p>
        </div>

        {/* STATS */}
        <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat title="Total Students" value={students.length} />
          <Stat title="Paid" value={paidStudents.length} color="text-green-600" />
          <Stat title="Unpaid" value={unpaidStudents.length} color="text-red-600" />
          <Stat
            title="Total Collection"
            value={`₹ ${totalCollection.toLocaleString("en-IN")}`}
            color="text-blue-700"
          />
        </div>

        {/* ONLINE / CASH */}
        <div className="mb-6 flex justify-center gap-6">
          <SmallStat
            title="Online Paid"
            value={onlineStudents.length}
            amount={`₹ ${onlineCollection.toLocaleString("en-IN")}`}
            color="text-indigo-600"
          />
          <SmallStat
            title="Cash Paid"
            value={cashStudents.length}
            amount={`₹ ${cashCollection.toLocaleString("en-IN")}`}
            color="text-orange-600"
          />
        </div>

        {/* TABLE */}
        <div className="w-full overflow-x-auto">
        <table className="min-w-175 w-full border border-gray-400 border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-400 p-2">SL.No.</th>
              <th className="border border-gray-400 p-2">Name</th>
              <th className="border border-gray-400 p-2">Roll No.</th>
              <th className="border border-gray-400 p-2">Class</th>
              <th className="border border-gray-400 p-2">Village</th>
              <th className="border border-gray-400 p-2 text-right">Fee</th>
              <th className="border border-gray-400 p-2 text-center">Status</th>
              <th className="border border-gray-400 p-2 text-center">Mode</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s: any, i: number) => (
              <tr key={s.studentId} className="break-inside-avoid">
                <td className="border border-gray-400 p-2">{i + 1}</td>
                <td className="border border-gray-400 p-2">{s.name}</td>
                <td className="border border-gray-400 p-2">{s.studentId}</td>
                <td className="border border-gray-400 p-2">{s.class}</td>
                <td className="border border-gray-400 p-2">{s.village}</td>
                <td className="border border-gray-400 p-2 text-right">₹ {s.monthlyFee}</td>
                <td className={`border border-gray-400 p-2 text-center font-bold ${s.status === "paid" ? "text-green-600" : "text-red-600"}`}>
                  {s.status.toUpperCase()}
                </td>
                <td className="border border-gray-400 p-2 text-center font-semibold">
                  {s.mode || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {/* SIGNATURE */}
        <div className="mt-20 flex justify-end break-inside-avoid">
          <div className="text-center">
            <Image
              src="/signature.png"
              alt="signature"
              width={150}
              height={80}
            />
            <p className="mt-1 border-t pt-1 text-sm font-semibold">
              Principal Signature
            </p>
          </div>
        </div>


      </div>
    </div>
  )
}

/* ---------- SMALL COMPONENTS ---------- */

function Stat({ title, value, color = "" }: any) {
  return (
    <div className="rounded-lg border p-3 text-center">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  )
}

function SmallStat({ title, value, amount, color }: any) {
  return (
    <div className="rounded-lg border px-4 py-2 text-center min-w-35">
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
      <p className="text-xs font-semibold text-gray-600">{amount}</p>
    </div>
  )
}

/* ---------------- STUDENTS PAGE ---------------- */

function StudentsContent() {
  const { selectedMonth } = useMonth()
  const { getActiveStudents, deleteStudent, paymentsMap } = useStudentStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [showReport, setShowReport] = useState(false)

  const currentYear = new Date().getFullYear()
  const activeStudents = getActiveStudents()

  const filteredStudents = activeStudents.filter(
    (s: any) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone?.includes(searchQuery)
  )

  const reportData = filteredStudents.map((s: any) => {
    const payments = paymentsMap[s._id] || []
    const paid = payments.find(
      (p: any) => p.month === selectedMonth && p.year === currentYear && p.status === "PAID"
    )

    return {
      name: s.name,
      studentId: s.studentId,
      class: s.className,
      village: s.village,
      monthlyFee: s.monthlyFee,
      status: paid ? "paid" : "unpaid",
      mode: paid?.paymentMode || null,
    }
  })

  /* ✅ PRINT */
  const handlePrintReport = () => {
    const printContent = document.getElementById("report-content")
    if (!printContent) return

    const win = window.open("", "_blank")
    if (!win) return

    win.document.write(`
      <html>
        <head>
          <title>Monthly Report</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              table { page-break-inside: auto; }
              tr { page-break-inside: avoid; }
              thead { display: table-header-group; }
            }
          </style>
        </head>
        <body>
          ${printContent.outerHTML}
        </body>
      </html>
    `)

    win.document.close()
    win.focus()
    win.onload = () => win.print()
  }

  return (
    <div className="space-y-6">

      <div className="rounded-lg border p-4">
        Showing data for <b>{selectedMonth}</b>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by name, ID, phone, class..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button asChild>
            <Link href="/students/add">
              <UserPlus className="mr-2 h-5 w-5" />
              Add Student
            </Link>
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowReport(true)}
            className="cursor-pointer hover:bg-gray-100 hover:border-primary hover:shadow-sm transition"
          >
            <FileDown className="mr-2 h-5 w-5" />
            Download Report
          </Button>
        </div>
      </div>

      <StudentsTable
        students={filteredStudents}
        selectedMonth={selectedMonth}
        onDeleteStudent={deleteStudent}
      />

      {/* MODAL */}
      <Dialog open={showReport} onOpenChange={setShowReport}>
        <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="border-b px-6 py-4 flex items-center justify-between">
            <DialogTitle className="text-xl text-primary">
              Monthly Report - {selectedMonth}
            </DialogTitle>

            <Button
              size="sm"
              variant="outline"
              onClick={handlePrintReport}
              className="cursor-pointer hover:bg-gray-100"
            >
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            <MonthReportPreview students={reportData} month={selectedMonth} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function StudentsPage() {
  return (
    <AdminLayout title="Students">
      <Suspense fallback={<Loading />}>
        <StudentsContent />
      </Suspense>
    </AdminLayout>
  )
}
