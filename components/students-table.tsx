"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Download, Trash2, User, Phone, GraduationCap, IndianRupee } from "lucide-react"
import type { Student } from "@/lib/student-store"
import type { Month } from "@/lib/month-context"
import { generateStudentBillPDF } from "@/lib/bill-generator"

interface StudentsTableProps {
  students: Student[]
  selectedMonth: Month
  onTogglePayment: (studentId: string, month: Month) => void
  onDeleteStudent: (studentId: string) => void
}

export function StudentsTable({
  students,
  selectedMonth,
  onTogglePayment,
  onDeleteStudent,
}: StudentsTableProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<Student | null>(null)

  const handleDelete = (student: Student) => {
    setDeleteConfirm(student)
  }

  const confirmDelete = () => {
    if (deleteConfirm) {
      onDeleteStudent(deleteConfirm.id)
      setDeleteConfirm(null)
    }
  }

  if (students.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <User className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-lg text-muted-foreground">No students found.</p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden overflow-x-auto rounded-lg border border-border md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[70px] text-center text-base font-semibold">
                
              </TableHead>
              <TableHead className="text-base font-semibold">Name</TableHead>
              <TableHead className="text-base font-semibold">Roll No.</TableHead>
              <TableHead className="text-base font-semibold">Class</TableHead>
              <TableHead className="text-base font-semibold">Section</TableHead>
              <TableHead className="hidden text-base font-semibold lg:table-cell">
                Phone
              </TableHead>
              <TableHead className="text-right text-base font-semibold">
                Monthly Fee
              </TableHead>
              <TableHead className="text-center text-base font-semibold">
                Status
              </TableHead>
              <TableHead className="text-center text-base font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => {
              const status = student.feeStatus[selectedMonth]
              return (
                <TableRow key={student.id} className="hover:bg-muted/30">
                  <TableCell className="text-center">
                    <Switch
                      checked={status === "paid"}
                      onCheckedChange={() => onTogglePayment(student.id, selectedMonth)}
                    />
                  </TableCell>
                  <TableCell className="text-base font-medium">
                    {student.name}
                  </TableCell>
                  <TableCell className="text-base">{student.studentId}</TableCell>
                  <TableCell className="text-base">{student.class}</TableCell>
                  <TableCell className="text-base font-medium">{student.section}</TableCell>
                  <TableCell className="hidden text-base lg:table-cell">
                    {student.phone}
                  </TableCell>
                  <TableCell className="text-right text-base">
                    Rs. {student.monthlyFee.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={
                        status === "paid"
                          ? "bg-success text-success-foreground"
                          : "bg-destructive text-destructive-foreground"
                      }
                    >
                      {status === "paid" ? "Paid" : "Unpaid"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                        onClick={async () => {
                          await generateStudentBillPDF(student, selectedMonth)
                        }}
                      >
                        <Download className="mr-1 h-4 w-4" />
                        Bill
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleDelete(student)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="space-y-4 md:hidden">
        {students.map((student) => {
          const status = student.feeStatus[selectedMonth]
          return (
            <Card key={student.id} className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                {/* Toggle + Name Row - Always at top */}
                <div className="mb-3 flex items-center gap-3 border-b border-border pb-3">
                  <Switch
                    checked={status === "paid"}
                    onCheckedChange={() => onTogglePayment(student.id, selectedMonth)}
                  />
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-foreground">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.studentId}</p>
                  </div>
                  <Badge
                    className={
                      status === "paid"
                        ? "bg-success text-success-foreground"
                        : "bg-destructive text-destructive-foreground"
                    }
                  >
                    {status === "paid" ? "Paid" : "Unpaid"}
                  </Badge>
                </div>

                {/* Student Details */}
                <div className="mb-3 grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <span className="text-sm">{student.class} - {student.section}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="text-sm">{student.phone}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">
                      Rs. {student.monthlyFee.toLocaleString("en-IN")} / month
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={async () => {
                      await generateStudentBillPDF(student, selectedMonth)
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Bill
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleDelete(student)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deleteConfirm?.name}</span>? This action
              will remove the student from the list. The record will be preserved in the
              database for administrative purposes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
