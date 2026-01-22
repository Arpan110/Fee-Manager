"use client"

import { useState, useRef } from "react"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Download, Eye, Printer, X } from "lucide-react"
import { MONTHS, type Month } from "@/lib/month-context"
import type { Student } from "@/lib/student-store"
import { BillPreview } from "./bill-preview"

interface FeeTableProps {
  student: Student
  onStatusChange?: (month: Month) => void
}

export function FeeTable({ student, onStatusChange }: FeeTableProps) {
  const [previewMonth, setPreviewMonth] = useState<Month | null>(null)
  const billRef = useRef<HTMLDivElement>(null)

  const handlePrintBill = (month: Month) => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      const status = student.feeStatus[month]
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Fee Receipt - ${student.name} - ${month}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 15px; margin-bottom: 20px; }
            .header h1 { margin: 0; color: #3b82f6; font-size: 24px; }
            .receipt-no { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 14px; }
            .student-info { border: 1px solid #ddd; padding: 15px; margin-bottom: 20px; border-radius: 8px; }
            .student-info p { margin: 5px 0; }
            .fee-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .fee-table th, .fee-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            .fee-table th { background: #f5f5f5; }
            .total-row { font-weight: bold; background: #f0f9ff; }
            .status { text-align: center; padding: 10px; border-radius: 8px; margin-bottom: 20px; }
            .status.paid { background: #dcfce7; color: #16a34a; }
            .status.unpaid { background: #fee2e2; color: #dc2626; }
            .signatures { display: flex; justify-content: space-between; margin-top: 50px; }
            .signature-box { text-align: center; }
            .signature-line { width: 150px; border-bottom: 1px solid #333; height: 40px; margin-bottom: 5px; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>VIDYA BHARATI SCHOOL</h1>
            <p style="margin: 5px 0; color: #666;">123 Education Lane, Knowledge City - 123456</p>
            <p style="margin: 5px 0; color: #666;">Phone: +91 98765 43210</p>
          </div>
          
          <h2 style="text-align: center; margin-bottom: 20px;">FEE RECEIPT</h2>
          
          <div class="receipt-no">
            <span><strong>Receipt No:</strong> RCP${Date.now()}</span>
            <span><strong>Date:</strong> ${new Date().toLocaleDateString("en-IN")}</span>
          </div>
          
          <div class="student-info">
            <p><strong>Student Name:</strong> ${student.name}</p>
            <p><strong>Student ID:</strong> ${student.studentId}</p>
            <p><strong>Class:</strong> ${student.class}</p>
            <p><strong>Guardian:</strong> ${student.guardianName}</p>
          </div>
          
          <table class="fee-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Month</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Monthly Tuition Fee</td>
                <td>${month}</td>
                <td style="text-align: right;">Rs. ${student.monthlyFee.toLocaleString("en-IN")}</td>
              </tr>
              <tr class="total-row">
                <td colspan="2">TOTAL</td>
                <td style="text-align: right;">Rs. ${student.monthlyFee.toLocaleString("en-IN")}</td>
              </tr>
            </tbody>
          </table>
          
          <div class="status ${status}">
            <strong>Payment Status: ${status.toUpperCase()}</strong>
          </div>
          
          <div class="signatures">
            <div class="signature-box">
              <div class="signature-line"></div>
              <p>Guardian's Signature</p>
            </div>
            <div class="signature-box">
              <div class="signature-line"></div>
              <p>Receiver's Signature</p>
            </div>
          </div>
        </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden overflow-x-auto rounded-lg border border-border md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[80px] text-center text-base font-semibold">
                
              </TableHead>
              <TableHead className="text-base font-semibold">Month</TableHead>
              <TableHead className="text-center text-base font-semibold">
                Status
              </TableHead>
              <TableHead className="text-center text-base font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MONTHS.map((month) => {
              const status = student.feeStatus[month]
              return (
                <TableRow key={month} className="hover:bg-muted/30">
                  <TableCell className="text-center">
                    <Switch
                      checked={status === "paid"}
                      onCheckedChange={() => onStatusChange?.(month)}
                    />
                  </TableCell>
                  <TableCell className="text-base font-medium">{month}</TableCell>
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
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                        onClick={() => setPreviewMonth(month)}
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                        onClick={() => handlePrintBill(month)}
                      >
                        <Download className="mr-1 h-4 w-4" />
                        Bill
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
      <div className="space-y-3 md:hidden">
        {MONTHS.map((month) => {
          const status = student.feeStatus[month]
          return (
            <Card key={month} className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                {/* Toggle + Month Row */}
                <div className="mb-3 flex items-center gap-3 border-b border-border pb-3">
                  <Switch
                    checked={status === "paid"}
                    onCheckedChange={() => onStatusChange?.(month)}
                  />
                  <span className="flex-1 text-base font-medium">{month}</span>
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

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => setPreviewMonth(month)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Bill
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => handlePrintBill(month)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Bill Preview Dialog */}
      <Dialog open={!!previewMonth} onOpenChange={() => setPreviewMonth(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary">
              Fee Receipt - {previewMonth}
            </DialogTitle>
          </DialogHeader>
          {previewMonth && (
            <div className="mt-4">
              <BillPreview
                ref={billRef}
                student={student}
                month={previewMonth}
                status={student.feeStatus[previewMonth]}
              />
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="outline"
                  className="bg-transparent"
                  onClick={() => setPreviewMonth(null)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Close
                </Button>
                <Button onClick={() => handlePrintBill(previewMonth)}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print Bill
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
