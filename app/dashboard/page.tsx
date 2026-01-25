"use client"

import { AdminLayout } from "@/components/admin-layout"
import { useStudentStore } from "@/lib/student-store"
import { useMonth } from "@/lib/month-context"
import { Users, IndianRupee, AlertCircle, CheckCircle } from "lucide-react"
import { Suspense } from "react"

/* ---------------- STAT CARD ---------------- */

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string
  value: string | number
  icon: any
  color: string
}) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-bold">{value}</p>
        </div>
        <div className={`rounded-full p-3 ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  )
}

/* ---------------- DASHBOARD CONTENT ---------------- */

function DashboardContent() {
  const { selectedMonth } = useMonth()
  const { getActiveStudents } = useStudentStore()

  const activeStudents = getActiveStudents()
  const totalStudents = activeStudents.length

  // ⏳ TEMP until STEP‑5 payment system
  const paidStudents = 0
  const unpaidStudents = totalStudents
  const totalCollection = 0

  const pendingAmount = activeStudents.reduce(
    (sum, s) => sum + (s.monthlyFee || 0),
    0
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview for <span className="font-semibold">{selectedMonth}</span>
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={totalStudents}
          icon={Users}
          color="bg-blue-600"
        />
        <StatCard
          title="Paid Students"
          value={paidStudents}
          icon={CheckCircle}
          color="bg-green-600"
        />
        <StatCard
          title="Unpaid Students"
          value={unpaidStudents}
          icon={AlertCircle}
          color="bg-red-600"
        />
        <StatCard
          title="Pending Amount"
          value={`₹ ${pendingAmount.toLocaleString("en-IN")}`}
          icon={IndianRupee}
          color="bg-orange-600"
        />
      </div>

      <div className="rounded-xl border bg-muted/30 p-6">
        <h2 className="text-lg font-semibold mb-2">System Status</h2>
        <ul className="list-disc list-inside text-muted-foreground space-y-1">
          <li>Student data is now loaded from MongoDB</li>
          <li>Add Student is connected to backend</li>
          <li>Dashboard & Students are in sync</li>
          <li>Payment system will be activated in next step</li>
        </ul>
      </div>
    </div>
  )
}

/* ---------------- PAGE ---------------- */

export default function DashboardPage() {
  return (
    <AdminLayout title="Dashboard">
      <Suspense fallback={<Loading />}>
        <DashboardContent />
      </Suspense>
    </AdminLayout>
  )
}

/* ---------------- LOADING ---------------- */

function Loading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  )
}
