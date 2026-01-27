"use client"

import { AdminLayout } from "@/components/admin-layout"
import { useMonth } from "@/lib/month-context"
import { useStudentStore } from "@/lib/student-store"

import {
  Users,
  CheckCircle,
  XCircle,
  IndianRupee,
  CreditCard,
  Wallet,
} from "lucide-react"

export default function DashboardPage() {
  const { selectedMonth } = useMonth()
  const { getActiveStudents, paymentsMap } = useStudentStore()

  const students = getActiveStudents()
  const currentYear = new Date().getFullYear()

  let paidCount = 0
  let unpaidCount = 0
  let onlineCount = 0
  let cashCount = 0

  let totalCollection = 0
  let onlineCollection = 0
  let cashCollection = 0
  let pendingAmount = 0

  students.forEach((s) => {
    const payments = paymentsMap[s._id] || []
    const paid = payments.find(
      (p) =>
        p.month === selectedMonth &&
        p.year === currentYear &&
        p.status === "PAID"
    )

    if (paid) {
      paidCount++
      totalCollection += paid.amount

      if (paid.paymentMode === "ONLINE") {
        onlineCount++
        onlineCollection += paid.amount
      }

      if (paid.paymentMode === "CASH") {
        cashCount++
        cashCollection += paid.amount
      }
    } else {
      unpaidCount++
      pendingAmount += s.monthlyFee
    }
  })

  const collectionRate =
    students.length === 0
      ? 0
      : Math.round((paidCount / students.length) * 100)

  const onlinePercent =
    paidCount === 0 ? 0 : Math.round((onlineCount / paidCount) * 100)

  const cashPercent =
    paidCount === 0 ? 0 : Math.round((cashCount / paidCount) * 100)

  const avgFee =
    students.length === 0
      ? 0
      : Math.round(
          students.reduce((sum, s) => sum + s.monthlyFee, 0) / students.length
        )

  return (
    <AdminLayout title="Dashboard" showMonthSelector>
      <div className="space-y-6">

        {/* MONTH BAR */}
        <div className="rounded-lg border bg-blue-50 p-4 text-blue-900">
          Viewing fee data for: <b>{selectedMonth}</b>
        </div>

        {/* TOP CARDS */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <Card title="Total Students" value={students.length} icon={Users} />

          <Card
            title="Paid This Month"
            value={paidCount}
            subtitle={`Fees received for ${selectedMonth}`}
            icon={CheckCircle}
            iconColor="text-green-600"
          />

          <Card
            title="Unpaid This Month"
            value={unpaidCount}
            subtitle={`Pending fees for ${selectedMonth}`}
            icon={XCircle}
            iconColor="text-red-600"
          />

          <Card
            title="Total Collection"
            value={`₹ ${totalCollection.toLocaleString("en-IN")}`}
            subtitle={`All modes in ${selectedMonth}`}
            icon={IndianRupee}
            iconColor="text-blue-600"
          />
        </div>

        {/* ONLINE / CASH CARDS */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <Card
            title="Online Paid"
            value={onlineCount}
            subtitle={`${onlinePercent}% of paid`}
            icon={CreditCard}
            iconColor="text-emerald-600"
          />

          <Card
            title="Cash Paid"
            value={cashCount}
            subtitle={`${cashPercent}% of paid`}
            icon={Wallet}
            iconColor="text-purple-600"
          />

          <Card
            title="Online Collection"
            value={`₹ ${onlineCollection.toLocaleString("en-IN")}`}
            subtitle="Total online received"
            icon={IndianRupee}
            iconColor="text-emerald-600"
          />

          <Card
            title="Cash Collection"
            value={`₹ ${cashCollection.toLocaleString("en-IN")}`}
            subtitle="Total cash received"
            icon={IndianRupee}
            iconColor="text-purple-600"
          />
        </div>

        {/* QUICK SUMMARY */}
        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">
            Quick Summary - {selectedMonth}
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-muted-foreground">Collection Rate</p>
              <p className="text-2xl font-bold text-blue-600">
                {collectionRate}%
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-muted-foreground">Pending Amount</p>
              <p className="text-2xl font-bold text-red-600">
                ₹ {pendingAmount.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-muted-foreground">Average Fee</p>
              <p className="text-2xl font-bold">
                ₹ {avgFee.toLocaleString("en-IN")}
              </p>
            </div>

          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

/* -------- SMALL CARD COMPONENT -------- */

function Card({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-blue-600",
}: {
  title: string
  value: any
  subtitle?: string
  icon: any
  iconColor?: string
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-white p-5">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="mt-1 text-2xl font-bold">{value}</p>
        {subtitle && (
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 ${iconColor}`}
      >
        <Icon className="h-6 w-6" />
      </div>
    </div>
  )
}
