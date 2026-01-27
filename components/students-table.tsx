"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2, FileDown } from "lucide-react"
import { useStudentStore } from "@/lib/student-store"
import Link from "next/link"

interface Student {
  _id: string
  name: string
  studentId: string
  className: string
  village: string
  phone: string
  monthlyFee: number
}

interface StudentsTableProps {
  students: Student[]
  selectedMonth: string
  onDeleteStudent: (id: string) => void
}

export function StudentsTable({
  students,
  selectedMonth,
  onDeleteStudent,
}: StudentsTableProps) {
  const { paymentsMap, togglePaymentStatus } = useStudentStore()
  const currentYear = new Date().getFullYear()

  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Roll No.</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Village</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Monthly Fee</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Bill</TableHead>
            <TableHead className="text-center">Delete</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {students.map((student) => {
            const payments = paymentsMap[student._id] || []

            const payment = payments.find(
              (p) =>
                p.month === selectedMonth &&
                p.year === currentYear
            )

            const isPaid = payment?.status === "PAID"
            const mode = payment?.paymentMode // ONLINE | CASH

            return (
              <TableRow key={student._id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.studentId}</TableCell>
                <TableCell>{student.className}</TableCell>
                <TableCell>{student.village}</TableCell>
                <TableCell>{student.phone}</TableCell>
                <TableCell>₹ {student.monthlyFee}</TableCell>

                {/* ✅ PAYMENT */}
                <TableCell className="text-center">
                  <div className="flex flex-col items-center gap-2">

                    {/* PAID / UNPAID */}
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold border transition ${isPaid
                        ? "bg-emerald-100 text-emerald-700 border-emerald-400 shadow-sm"
                        : "bg-rose-100 text-rose-600 border-rose-400"
                        }`}
                    >
                      {isPaid ? "PAID" : "UNPAID"}
                    </div>

                    {/* ONLINE / CASH */}
                    <div className="flex gap-2">
                      <button
                        disabled={!!payment}
                        onClick={() =>
                          togglePaymentStatus(
                            student._id,
                            selectedMonth as any,
                            student.monthlyFee,
                            "ONLINE"
                          )
                        }
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 hover:cursor-pointer
                          ${mode === "ONLINE"
                            ? "bg-slate-800 text-white shadow-md shadow-slate-400/40 ring-2 ring-slate-500 hover:bg-slate-900"
                            : "border-slate-400 text-slate-700 hover:bg-slate-100 hover:cursor-pointer"
                          }`}
                      >
                        ONLINE
                      </button>

                      <button
                        disabled={!!payment}
                        onClick={() =>

                          togglePaymentStatus(
                            student._id,
                            selectedMonth as any,
                            student.monthlyFee,
                            "CASH"
                          )
                        }
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 hover:cursor-pointer
                          ${mode === "CASH"
                            ? "bg-purple-500 text-white shadow-lg shadow-purple-300/60 ring-2 ring-purple-400"
                            : "border-purple-400 text-purple-700 hover:bg-purple-50"

                          }`}
                      >
                        CASH
                      </button>
                    </div>
                  </div>
                </TableCell>

                {/* BILL */}
                <TableCell className="text-center">
                  {isPaid ? (
                    <Button asChild size="sm" variant="outline">
                      <Link
                        href={`/receipt/${student._id}?month=${selectedMonth}&year=${currentYear}`}
                      >
                        <FileDown className="mr-1 h-4 w-4" />
                        Bill
                      </Link>
                    </Button>
                  ) : (
                    <span className="text-red-600 font-semibold">Due</span>
                  )}
                </TableCell>

                {/* DELETE */}
                <TableCell className="text-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeleteStudent(student._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
