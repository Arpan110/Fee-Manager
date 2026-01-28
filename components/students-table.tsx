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

      {/* ✅ MOBILE FIX: horizontal scroll */}
      <div className="w-full overflow-x-auto">
        <Table className="min-w-225">

          <TableHeader>
            <TableRow>
              <TableHead className="px-2 py-2 sm:px-4">Name</TableHead>
              <TableHead className="px-2 py-2 sm:px-4">Roll No.</TableHead>
              <TableHead className="px-2 py-2 sm:px-4">Class</TableHead>
              <TableHead className="px-2 py-2 sm:px-4">Village</TableHead>
              <TableHead className="px-2 py-2 sm:px-4">Phone</TableHead>
              <TableHead className="px-2 py-2 sm:px-4">Monthly Fee</TableHead>
              <TableHead className="text-center px-2 py-2 sm:px-4">Status</TableHead>
              <TableHead className="text-center px-2 py-2 sm:px-4">Bill</TableHead>
              <TableHead className="text-center px-2 py-2 sm:px-4">Delete</TableHead>
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
              const mode = payment?.paymentMode

              return (
                <TableRow key={student._id}>

                  <TableCell className="px-2 py-2 sm:px-4 whitespace-nowrap">
                    {student.name}
                  </TableCell>

                  <TableCell className="px-2 py-2 sm:px-4 whitespace-nowrap">
                    {student.studentId}
                  </TableCell>

                  <TableCell className="px-2 py-2 sm:px-4 whitespace-nowrap">
                    {student.className}
                  </TableCell>

                  <TableCell className="px-2 py-2 sm:px-4">
                    {student.village}
                  </TableCell>

                  <TableCell className="px-2 py-2 sm:px-4 whitespace-nowrap">
                    {student.phone}
                  </TableCell>

                  <TableCell className="px-2 py-2 sm:px-4 whitespace-nowrap">
                    ₹ {student.monthlyFee}
                  </TableCell>

                  {/* ✅ PAYMENT */}
                  <TableCell className="text-center px-2 py-2 sm:px-4">
                    <div className="flex flex-col items-center gap-2">

                      <div
                        className={`px-3 py-1 rounded-full text-[11px] font-bold border
                        ${isPaid
                          ? "bg-emerald-100 text-emerald-700 border-emerald-400"
                          : "bg-rose-100 text-rose-600 border-rose-400"
                        }`}
                      >
                        {isPaid ? "PAID" : "UNPAID"}
                      </div>

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
                          className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition hover:cursor-pointer
                          ${mode === "ONLINE"
                            ? "bg-slate-800 text-white"
                            : "border-slate-400 text-slate-700 hover:bg-slate-100"
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
                          className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition hover:cursor-pointer
                          ${mode === "CASH"
                            ? "bg-purple-500 text-white"
                            : "border-purple-400 text-purple-700 hover:bg-purple-50"
                          }`}
                        >
                          CASH
                        </button>
                      </div>
                    </div>
                  </TableCell>

                  {/* BILL */}
                  <TableCell className="text-center px-2 py-2 sm:px-4 whitespace-nowrap">
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
                  <TableCell className="text-center px-2 py-2 sm:px-4">
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
    </div>
  )
}
