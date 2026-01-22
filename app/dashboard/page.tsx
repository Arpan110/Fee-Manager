"use client"

import { AdminLayout } from "@/components/admin-layout"
import { StatsCard } from "@/components/stats-card"
import { useMonth } from "@/lib/month-context"
import { useStudentStore } from "@/lib/student-store"
import { Users, CheckCircle, XCircle, IndianRupee } from "lucide-react"

function DashboardContent() {
  const { selectedMonth } = useMonth()
  const { getActiveStudents, getStudentStats } = useStudentStore()
  
  const stats = getStudentStats(selectedMonth)
  const activeStudents = getActiveStudents()

  // Calculate total collection for the month
  const totalCollection = activeStudents
    .filter((s) => s.feeStatus[selectedMonth] === "paid")
    .reduce((sum, s) => sum + s.monthlyFee, 0)

  // Calculate pending amount
  const pendingAmount = activeStudents
    .filter((s) => s.feeStatus[selectedMonth] === "unpaid")
    .reduce((sum, s) => sum + s.monthlyFee, 0)

  // Calculate average fee
  const averageFee = stats.total > 0
    ? Math.round(activeStudents.reduce((sum, s) => sum + s.monthlyFee, 0) / stats.total)
    : 0

  // Collection rate
  const collectionRate = stats.total > 0 ? Math.round((stats.paid / stats.total) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Month Info Banner */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <p className="text-base text-foreground">
          Viewing fee data for:{" "}
          <span className="font-semibold text-primary">{selectedMonth}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Students"
          value={stats.total}
          icon={Users}
          description="Enrolled students"
          variant="default"
        />
        <StatsCard
          title="Paid This Month"
          value={stats.paid}
          icon={CheckCircle}
          description={`Fees received for ${selectedMonth}`}
          variant="success"
        />
        <StatsCard
          title="Unpaid This Month"
          value={stats.unpaid}
          icon={XCircle}
          description={`Pending fees for ${selectedMonth}`}
          variant="danger"
        />
        <StatsCard
          title="Collection"
          value={`Rs. ${totalCollection.toLocaleString("en-IN")}`}
          icon={IndianRupee}
          description={`Total collected in ${selectedMonth}`}
          variant="default"
        />
      </div>

      {/* Quick Summary Card */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Quick Summary - {selectedMonth}
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">Collection Rate</p>
            <p className="text-2xl font-bold text-primary">{collectionRate}%</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">Pending Amount</p>
            <p className="text-2xl font-bold text-destructive">
              Rs. {pendingAmount.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">Average Fee</p>
            <p className="text-2xl font-bold text-foreground">
              Rs. {averageFee.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AdminLayout title="Dashboard">
      <DashboardContent />
    </AdminLayout>
  )
}
