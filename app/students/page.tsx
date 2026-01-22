"use client"

import { useState, useRef } from "react"
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
import { Suspense } from "react"
import Loading from "./loading"

function MonthReportPreview({
  students,
  month,
  onClose,
  onPrint,
}: {
  students: { name: string; studentId: string; class: string; section: string; phone: string; monthlyFee: number; status: string }[]
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
      {/* Report Content - Print Friendly */}
      <div id="report-content" className="flex-1 overflow-y-auto bg-white p-6 print:p-0">
        {/* Header */}
        <div className="mb-6 border-b-2 border-primary pb-4 text-center">
          <h1 className="text-2xl font-bold text-primary">Vivek Vikas Mission School</h1>
          <p className="text-sm text-muted-foreground">KHIRI * KOTULPUR * BANKURA * PIN - 722141</p>
          <p className="text-sm text-muted-foreground">Phone: +91 8777393801</p>
        </div>

        {/* Report Title */}
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold text-foreground">MONTHLY FEE COLLECTION REPORT</h2>
          <p className="text-lg font-medium text-primary">{month}</p>
          <p className="text-sm text-muted-foreground">
            Generated on: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
            <p className="text-sm text-muted-foreground">Total Students</p>
            <p className="text-2xl font-bold text-foreground">{students.length}</p>
          </div>
          <div className="rounded-lg border border-success/30 bg-success/10 p-3 text-center">
            <p className="text-sm text-muted-foreground">Paid</p>
            <p className="text-2xl font-bold text-success">{paidCount}</p>
          </div>
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-center">
            <p className="text-sm text-muted-foreground">Unpaid</p>
            <p className="text-2xl font-bold text-destructive">{unpaidCount}</p>
          </div>
          <div className="rounded-lg border border-primary/30 bg-primary/10 p-3 text-center">
            <p className="text-sm text-muted-foreground">Collection</p>
            <p className="text-xl font-bold text-primary">Rs. {totalCollection.toLocaleString("en-IN")}</p>
          </div>
        </div>

        {/* Student Table */}
        <div className="mb-6 overflow-x-auto">
          <table className="w-full border-collapse border border-border text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="border border-border p-2 text-left">S.No</th>
                <th className="border border-border p-2 text-left">Name</th>
                <th className="border border-border p-2 text-left">ID</th>
                <th className="border border-border p-2 text-left">Class</th>
                <th className="border border-border p-2 text-left">Section</th>
                <th className="border border-border p-2 text-right">Fee</th>
                <th className="border border-border p-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, index) => (
                <tr key={s.studentId} className={index % 2 === 0 ? "bg-white" : "bg-muted/20"}>
                  <td className="border border-border p-2">{index + 1}</td>
                  <td className="border border-border p-2 font-medium">{s.name}</td>
                  <td className="border border-border p-2">{s.studentId}</td>
                  <td className="border border-border p-2">{s.class}</td>
                  <td className="border border-border p-2">{s.section}</td>
                  <td className="border border-border p-2 text-right">Rs. {s.monthlyFee.toLocaleString("en-IN")}</td>
                  <td className={`border border-border p-2 text-center font-medium ${s.status === "paid" ? "text-success" : "text-destructive"}`}>
                    {s.status.toUpperCase()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-muted/50 font-semibold">
                <td colSpan={4} className="border border-border p-2 text-right">Total Collection:</td>
                <td className="border border-border p-2 text-right">Rs. {totalCollection.toLocaleString("en-IN")}</td>
                <td className="border border-border p-2 text-center">{paidCount} Paid</td>
              </tr>
              <tr className="bg-muted/30 font-semibold">
                <td colSpan={4} className="border border-border p-2 text-right">Pending Amount:</td>
                <td className="border border-border p-2 text-right text-destructive">Rs. {pendingAmount.toLocaleString("en-IN")}</td>
                <td className="border border-border p-2 text-center text-destructive">{unpaidCount} Unpaid</td>
              </tr>
            </tfoot>
          </table>
        </div>

        
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 border-t border-border px-6 py-4 print:hidden">
        <Button variant="outline" onClick={onClose} className="bg-transparent">
          <X className="mr-2 h-4 w-4" />
          Close
        </Button>
        <Button onClick={onPrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print Report
        </Button>
      </div>
    </div>
  )
}

function StudentsContent() {
  const { selectedMonth } = useMonth()
  const { getActiveStudents, togglePaymentStatus, deleteStudent } = useStudentStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [showReport, setShowReport] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  const activeStudents = getActiveStudents()

  const filteredStudents = activeStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.phone.includes(searchQuery) ||
      student.class.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const reportData = filteredStudents.map((s) => ({
    name: s.name,
    studentId: s.studentId,
    class: s.class,
    section: s.section,
    phone: s.phone,
    monthlyFee: s.monthlyFee,
    status: s.feeStatus[selectedMonth],
  }))

  const handlePrintReport = () => {
    const printContent = document.getElementById("report-content")
    if (printContent) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Monthly Report - ${selectedMonth}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f5f5f5; }
              .text-center { text-align: center; }
              .text-right { text-align: right; }
              .text-success { color: #22c55e; }
              .text-destructive { color: #ef4444; }
              .text-primary { color: #3b82f6; }
              .font-bold { font-weight: bold; }
              .font-semibold { font-weight: 600; }
              .font-medium { font-weight: 500; }
              h1 { margin: 0; color: #3b82f6; }
              h2 { margin: 10px 0; }
              .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 15px; margin-bottom: 20px; }
              .summary { display: flex; gap: 20px; margin-bottom: 20px; justify-content: center; }
              .summary-card { border: 1px solid #ddd; padding: 10px 20px; border-radius: 8px; text-align: center; }
              .signatures { display: flex; justify-content: space-between; margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; }
              .signature-box { text-align: center; }
              .signature-line { width: 150px; border-bottom: 1px solid #333; height: 40px; margin-bottom: 5px; }
              @media print { body { padding: 0; } }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Month Info Banner */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <p className="text-base text-foreground">
          Showing payment status for:{" "}
          <span className="font-semibold text-primary">{selectedMonth}</span>
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, ID, phone, class..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 pl-10 text-base"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/students/add">
              <UserPlus className="mr-2 h-5 w-5" />
              Add Student
            </Link>
          </Button>
          <Button variant="outline" className="bg-transparent" onClick={() => setShowReport(true)}>
            <FileDown className="mr-2 h-5 w-5" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Students Table */}
      <StudentsTable
        students={filteredStudents}
        selectedMonth={selectedMonth}
        onTogglePayment={togglePaymentStatus}
        onDeleteStudent={deleteStudent}
      />

      {/* Report Preview Dialog */}
      <Dialog open={showReport} onOpenChange={setShowReport}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="border-b border-border px-6 py-4">
            <DialogTitle className="text-xl text-primary">Monthly Fee Report - {selectedMonth}</DialogTitle>
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
