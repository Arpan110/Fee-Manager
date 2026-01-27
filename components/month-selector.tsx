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
        {/* ✅ TRIGGER (main box) */}
        <SelectTrigger className="w-[130px] sm:w-40 border-primary/30 bg-card text-foreground 
                                   cursor-pointer hover:bg-gray-100 hover:border-primary 
                                   transition">
          <SelectValue placeholder="Select month" />
        </SelectTrigger>

        {/* ✅ DROPDOWN */}
        <SelectContent>
          {MONTHS.map((month) => (
            <SelectItem
              key={month}
              value={month}
              className="cursor-pointer hover:bg-gray-100"
            >
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
