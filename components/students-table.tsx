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
import { Trash2, CheckCircle, XCircle, FileDown } from "lucide-react"
import { useStudentStore } from "@/lib/student-store"
import Link from "next/link"

interface Student {
  _id: string
  name: string
  studentId: string
  className: string
  section: string
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
            <TableHead>Student ID</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Section</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="text-right">Monthly Fee</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Bill</TableHead>
            <TableHead className="text-center">Delete</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                No students found.
              </TableCell>
            </TableRow>
          ) : (
            students.map((student) => {
              const payments = paymentsMap[student._id] || []

              const isPaid = payments.some(
                (p) =>
                  p.month === selectedMonth &&
                  p.year === currentYear &&
                  p.status === "PAID"
              )

              return (
                <TableRow key={student._id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell>{student.className}</TableCell>
                  <TableCell>{student.section}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell className="text-right">
                    ₹ {student.monthlyFee.toLocaleString("en-IN")}
                  </TableCell>

                  {/* ✅ PAYMENT STATUS */}
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        !isPaid &&
                        togglePaymentStatus(
                          student._id,
                          selectedMonth as any,
                          student.monthlyFee
                        )
                      }
                      className={
                        isPaid
                          ? "border-green-600 text-green-700 bg-green-50"
                          : "border-red-500 text-red-600 hover:bg-red-50"
                      }
                    >
                      {isPaid ? (
                        <>
                          <CheckCircle className="mr-1 h-4 w-4" /> PAID
                        </>
                      ) : (
                        <>
                          <XCircle className="mr-1 h-4 w-4" /> UNPAID
                        </>
                      )}
                    </Button>
                  </TableCell>

                  {/* 📄 DOWNLOAD BILL */}
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
                      <span className="text-xs text-muted-foreground">
                        Pay first
                      </span>
                    )}
                  </TableCell>

                  {/* 🗑 DELETE */}
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
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
