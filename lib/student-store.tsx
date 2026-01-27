"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react"
import type { Month } from "./month-context"

/* ===================== TYPES ===================== */

export interface Student {
  _id: string
  name: string
  studentId: string
  className: string
  village: string
  phone: string
  guardian: string
  monthlyFee: number
  isDeleted: boolean
}

export interface Payment {
  _id: string
  studentId: string
  month: string
  year: number
  status: "PAID" | "UNPAID"
  paymentMode?: "ONLINE" | "CASH"   // ✅ NEW
  amount: number
  paidAt?: string
}

interface StudentStore {
  students: Student[]
  paymentsMap: Record<string, Payment[]>

  addStudent: (student: Omit<Student, "_id" | "isDeleted">) => Promise<void>
  deleteStudent: (id: string) => Promise<void>

  togglePaymentStatus: (
    studentId: string,
    month: Month,
    amount: number,
    mode: "ONLINE" | "CASH"          // ✅ NEW
  ) => Promise<void>

  getStudentById: (id: string) => Student | undefined
  getActiveStudents: () => Student[]
  getStudentStats: (month: Month) => {
    total: number
    paid: number
    unpaid: number
    online: number
    cash: number
  }
}

/* ===================== CONTEXT ===================== */

const StudentStoreContext = createContext<StudentStore | null>(null)

/* ===================== PROVIDER ===================== */

export function StudentStoreProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>([])
  const [paymentsMap, setPaymentsMap] = useState<Record<string, Payment[]>>({})

  /* ---------- FETCH PAYMENTS FOR ONE STUDENT ---------- */
  const fetchPaymentsForStudent = useCallback(async (studentId: string) => {
    try {
      const res = await fetch(`/api/payments/${studentId}`)
      const data = await res.json()

      setPaymentsMap((prev) => ({
        ...prev,
        [studentId]: data,
      }))
    } catch (err) {
      console.error("Failed to fetch payments", err)
    }
  }, [])

  /* ---------- FETCH STUDENTS ---------- */
  const fetchStudents = useCallback(async () => {
    try {
      const res = await fetch("/api/students")
      const data = await res.json()

      setStudents(data)

      data.forEach((s: Student) => {
        fetchPaymentsForStudent(s._id)
      })
    } catch (err) {
      console.error("Failed to fetch students", err)
    }
  }, [fetchPaymentsForStudent])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  /* ---------- ADD STUDENT ---------- */
  const addStudent = useCallback(
    async (studentData: Omit<Student, "_id" | "isDeleted">) => {
      try {
        await fetch("/api/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(studentData),
        })

        await fetchStudents()
      } catch (err) {
        console.error("Add student failed", err)
      }
    },
    [fetchStudents]
  )

  /* ---------- DELETE STUDENT ---------- */
  const deleteStudent = useCallback(
    async (id: string) => {
      try {
        await fetch(`/api/students/${id}`, { method: "DELETE" })
        await fetchStudents()
      } catch (err) {
        console.error("Delete failed", err)
      }
    },
    [fetchStudents]
  )

  /* ---------- PAYMENT (ONLINE / CASH) ---------- */
  const togglePaymentStatus = useCallback(
    async (
      studentId: string,
      month: Month,
      amount: number,
      mode: "ONLINE" | "CASH"
    ) => {
      try {
        await fetch(`/api/payments/${studentId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            month,
            year: new Date().getFullYear(),
            amount,
            status: "PAID",
            paymentMode: mode, // ✅ NEW
          }),
        })

        await fetchPaymentsForStudent(studentId)
      } catch (err) {
        console.error("Payment toggle failed", err)
      }
    },
    [fetchPaymentsForStudent]
  )

  /* ---------- HELPERS ---------- */
  const getStudentById = useCallback(
    (id: string) => students.find((s) => s._id === id && !s.isDeleted),
    [students]
  )

  const getActiveStudents = useCallback(
    () => students.filter((s) => !s.isDeleted),
    [students]
  )

  const getStudentStats = useCallback(
    (month: Month) => {
      const active = students.filter((s) => !s.isDeleted)
      const total = active.length

      let paid = 0
      let online = 0
      let cash = 0

      active.forEach((s) => {
        const payments = paymentsMap[s._id] || []
        const found = payments.find(
          (p) =>
            p.month === month &&
            p.year === new Date().getFullYear() &&
            p.status === "PAID"
        )

        if (found) {
          paid++
          if (found.paymentMode === "ONLINE") online++
          if (found.paymentMode === "CASH") cash++
        }
      })

      return { total, paid, unpaid: total - paid, online, cash }
    },
    [students, paymentsMap]
  )

  /* ---------- PROVIDER ---------- */
  return (
    <StudentStoreContext.Provider
      value={{
        students,
        paymentsMap,
        addStudent,
        deleteStudent,
        togglePaymentStatus,
        getStudentById,
        getActiveStudents,
        getStudentStats,
      }}
    >
      {children}
    </StudentStoreContext.Provider>
  )
}

/* ===================== HOOK ===================== */

export function useStudentStore() {
  const context = useContext(StudentStoreContext)
  if (!context) {
    throw new Error("useStudentStore must be used within StudentStoreProvider")
  }
  return context
}
