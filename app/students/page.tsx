"use client"

import { useState, useRef, Suspense } from "react"
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
import { UserPlus, Search, FileDown, Printer, X } from "lucide-react"
import Loading from "./loading"

/* ---------------- REPORT PREVIEW ---------------- */

function MonthReportPreview({
  students,
  month,
  onClose,
  onPrint,
}: {
  students: {
    name: string
    studentId: string
    class: string
    section: string
    phone: string
    monthlyFee: number
    status: string
  }[]
  month: string
  onClose: () => void
  onPrint: () => void
}) {
  const paidCount = students.filter((s) => s.status === "paid").length
  const unpaidCount = students.filter((s) => s.status === "unpaid").length

  const totalCollection = students
    .filter((s) => s.status === "paid")
    .reduce((sum, s) => sum + s.monthlyFee, 0)

  const pendingAmount = students
    .filter((s) => s.status === "unpaid")
    .reduce((sum, s) => sum + s.monthlyFee, 0)

  return (
    <div className="flex flex-col">
      <div id="report-content" className="flex-1 overflow-y-auto bg-white p-6 print:p-0">
        <div className="mb-6 border-b-2 border-primary pb-4 text-center">
          <h1 className="text-2xl font-bold text-primary">
            Vivek Vikas Mission School
          </h1>
          <p className="text-sm text-muted-foreground">
            KHIRI * KOTULPUR * BANKURA * PIN - 722141
          </p>
          <p className="text-sm text-muted-foreground">
            Phone: +91 8777393801
          </p>
        </div>

        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold text-foreground">
            MONTHLY FEE COLLECTION REPORT
          </h2>
          <p className="text-lg font-medium text-primary">{month}</p>
          <p className="text-sm text-muted-foreground">
            Generated on:{" "}
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border p-3 text-center">
            <p className="text-sm text-muted-foreground">Total Students</p>
            <p className="text-2xl font-bold">{students.length}</p>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <p className="text-sm text-muted-foreground">Paid</p>
            <p className="text-2xl font-bold text-green-600">{paidCount}</p>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <p className="text-sm text-muted-foreground">Unpaid</p>
            <p className="text-2xl font-bold text-red-600">{unpaidCount}</p>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <p className="text-sm text-muted-foreground">Collection</p>
            <p className="text-xl font-bold text-primary">
              ₹ {totalCollection.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        <div className="mb-6 overflow-x-auto">
          <table className="w-full border-collapse border text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="border p-2">S.No</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">ID</th>
                <th className="border p-2">Class</th>
                <th className="border p-2">Section</th>
                <th className="border p-2 text-right">Fee</th>
                <th className="border p-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={s.studentId}>
                  <td className="border p-2">{i + 1}</td>
                  <td className="border p-2">{s.name}</td>
                  <td className="border p-2">{s.studentId}</td>
                  <td className="border p-2">{s.class}</td>
                  <td className="border p-2">{s.section}</td>
                  <td className="border p-2 text-right">
                    ₹ {s.monthlyFee.toLocaleString("en-IN")}
                  </td>
                  <td className="border p-2 text-center font-semibold text-red-600">
                    {s.status.toUpperCase()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t px-6 py-4 print:hidden">
        <Button variant="outline" onClick={onClose}>
          <X className="mr-2 h-4 w-4" /> Close
        </Button>
        <Button onClick={onPrint}>
          <Printer className="mr-2 h-4 w-4" /> Print Report
        </Button>
      </div>
    </div>
  )
}

/* ---------------- STUDENTS PAGE ---------------- */

function StudentsContent() {
  const { selectedMonth } = useMonth()
  const { getActiveStudents, deleteStudent } = useStudentStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [showReport, setShowReport] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  const activeStudents = getActiveStudents()

  const filteredStudents = activeStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.phone.includes(searchQuery) ||
      student.className.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const reportData = filteredStudents.map((s) => ({
    name: s.name,
    studentId: s.studentId,
    class: s.className,
    section: s.section,
    phone: s.phone,
    monthlyFee: s.monthlyFee,
    status: "unpaid", // later from DB
  }))

  const handlePrintReport = () => {
    const printContent = document.getElementById("report-content")
    if (!printContent) return
    const win = window.open("", "_blank")
    if (!win) return
    win.document.write(`<html><body>${printContent.innerHTML}</body></html>`)
    win.document.close()
    win.print()
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
          <Button variant="outline" onClick={() => setShowReport(true)}>
            <FileDown className="mr-2 h-5 w-5" />
            Download Report
          </Button>
        </div>
      </div>

      {/* ✅ FIXED TABLE USAGE */}
      <StudentsTable
        students={filteredStudents}
        selectedMonth={selectedMonth}
        onDeleteStudent={deleteStudent}
      />

      <Dialog open={showReport} onOpenChange={setShowReport}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="border-b px-6 py-4">
            <DialogTitle className="text-xl text-primary">
              Monthly Fee Report - {selectedMonth}
            </DialogTitle>
          </DialogHeader>

          <div ref={reportRef} className="flex-1 overflow-y-auto">
            <MonthReportPreview
              students={reportData}
              month={selectedMonth}
              onClose={() => setShowReport(false)}
              onPrint={handlePrintReport}
            />
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
