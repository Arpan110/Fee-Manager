"use client"

import { MonthSelector } from "./month-selector"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

interface AdminTopbarProps {
  title: string
  onMenuClick?: () => void
  showMonthSelector?: boolean
}

export function AdminTopbar({
  title,
  onMenuClick,
  showMonthSelector = true,
}: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground lg:text-2xl">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-2 lg:gap-4">
        {showMonthSelector && <MonthSelector />}
      </div>
    </header>
  )
}
