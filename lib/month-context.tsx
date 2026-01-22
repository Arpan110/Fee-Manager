"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const

export type Month = (typeof MONTHS)[number]

interface MonthContextType {
  selectedMonth: Month
  setSelectedMonth: (month: Month) => void
}

const MonthContext = createContext<MonthContextType | undefined>(undefined)

export function MonthProvider({ children }: { children: ReactNode }) {
  const currentMonth = MONTHS[new Date().getMonth()]
  const [selectedMonth, setSelectedMonth] = useState<Month>(currentMonth)

  return (
    <MonthContext.Provider value={{ selectedMonth, setSelectedMonth }}>
      {children}
    </MonthContext.Provider>
  )
}

export function useMonth() {
  const context = useContext(MonthContext)
  if (!context) {
    throw new Error("useMonth must be used within a MonthProvider")
  }
  return context
}
