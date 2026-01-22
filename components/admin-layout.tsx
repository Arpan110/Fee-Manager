"use client"

import { useState, type ReactNode } from "react"
import { AdminSidebar } from "./admin-sidebar"
import { AdminTopbar } from "./admin-topbar"

interface AdminLayoutProps {
  children: ReactNode
  title: string
  showDownloadReport?: boolean
  onDownloadReport?: () => void
  showMonthSelector?: boolean
}

export function AdminLayout({
  children,
  title,
  showDownloadReport = true,
  onDownloadReport,
  showMonthSelector = true,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="lg:ml-64">
        <AdminTopbar
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
          showMonthSelector={showMonthSelector}
        />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
