"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MONTHS, useMonth } from "@/lib/month-context"
import { CalendarDays } from "lucide-react"

export function MonthSelector() {
  const { selectedMonth, setSelectedMonth } = useMonth()

  return (
    <div className="flex items-center gap-2">
      <CalendarDays className="hidden h-5 w-5 text-primary sm:block" />
      <Select value={selectedMonth} onValueChange={setSelectedMonth}>
        <SelectTrigger className="w-[130px] border-primary/30 bg-card text-foreground sm:w-[160px]">
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent>
          {MONTHS.map((month) => (
            <SelectItem key={month} value={month}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
