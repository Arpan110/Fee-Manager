"use client"

import { useEffect } from "react"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react"
import type { Month } from "./month-context"

export interface Student {
  id: string
  name: string
  studentId: string
  class: string
  section: string
  phone: string
  guardianName: string
  monthlyFee: number
  feeStatus: Record<Month, "paid" | "unpaid">
  isDeleted: boolean
}

interface StudentStore {
  students: Student[]
  addStudent: (student: Omit<Student, "id" | "feeStatus" | "isDeleted">) => void
  deleteStudent: (id: string) => void
  togglePaymentStatus: (id: string, month: Month) => void
  getStudentById: (id: string) => Student | undefined
  getActiveStudents: () => Student[]
  getStudentStats: (month: Month) => { total: number; paid: number; unpaid: number }
  isHydrated: boolean
}

const StudentStoreContext = createContext<StudentStore | null>(null)

// Initial mock data
const initialStudents: Student[] = [
  {
    id: "1",
    name: "Rahul Sharma",
    studentId: "STU001",
    class: "Class 10",
    section: "A",
    phone: "9876543210",
    guardianName: "Rajesh Sharma",
    monthlyFee: 2500,
    isDeleted: false,
    feeStatus: {
      January: "paid",
      February: "paid",
      March: "paid",
      April: "unpaid",
      May: "unpaid",
      June: "unpaid",
      July: "unpaid",
      August: "unpaid",
      September: "unpaid",
      October: "unpaid",
      November: "unpaid",
      December: "unpaid",
    },
  },
  {
    id: "2",
    name: "Priya Patel",
    studentId: "STU002",
    class: "Class 9",
    section: "B",
    phone: "9876543211",
    guardianName: "Amit Patel",
    monthlyFee: 2200,
    isDeleted: false,
    feeStatus: {
      January: "paid",
      February: "paid",
      March: "paid",
      April: "paid",
      May: "unpaid",
      June: "unpaid",
      July: "unpaid",
      August: "unpaid",
      September: "unpaid",
      October: "unpaid",
      November: "unpaid",
      December: "unpaid",
    },
  },
  {
    id: "3",
    name: "Amit Kumar",
    studentId: "STU003",
    class: "Class 8",
    section: "A",
    phone: "9876543212",
    guardianName: "Suresh Kumar",
    monthlyFee: 2000,
    isDeleted: false,
    feeStatus: {
      January: "paid",
      February: "unpaid",
      March: "unpaid",
      April: "unpaid",
      May: "unpaid",
      June: "unpaid",
      July: "unpaid",
      August: "unpaid",
      September: "unpaid",
      October: "unpaid",
      November: "unpaid",
      December: "unpaid",
    },
  },
  {
    id: "4",
    name: "Sneha Gupta",
    studentId: "STU004",
    class: "Class 10",
    section: "C",
    phone: "9876543213",
    guardianName: "Vijay Gupta",
    monthlyFee: 2500,
    isDeleted: false,
    feeStatus: {
      January: "paid",
      February: "paid",
      March: "paid",
      April: "paid",
      May: "paid",
      June: "unpaid",
      July: "unpaid",
      August: "unpaid",
      September: "unpaid",
      October: "unpaid",
      November: "unpaid",
      December: "unpaid",
    },
  },
  {
    id: "5",
    name: "Ravi Singh",
    studentId: "STU005",
    class: "Class 7",
    section: "B",
    phone: "9876543214",
    guardianName: "Deepak Singh",
    monthlyFee: 1800,
    isDeleted: false,
    feeStatus: {
      January: "unpaid",
      February: "unpaid",
      March: "unpaid",
      April: "unpaid",
      May: "unpaid",
      June: "unpaid",
      July: "unpaid",
      August: "unpaid",
      September: "unpaid",
      October: "unpaid",
      November: "unpaid",
      December: "unpaid",
    },
  },
]

function getInitialStudents(): Student[] {
  if (typeof window === "undefined") {
    return initialStudents
  }
  
  const stored = localStorage.getItem("students")
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return initialStudents
    }
  }
  return initialStudents
}

export function StudentStoreProvider({ children }: { children: ReactNode }) {
  // Initialize with localStorage data or mock data immediately
  const [students, setStudents] = useState<Student[]>(() => getInitialStudents())
  const [isHydrated, setIsHydrated] = useState(false)

  // Mark as hydrated after first render (client-side only)
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Save to localStorage whenever students change (only on client)
  useEffect(() => {
    if (typeof window !== "undefined" && isHydrated) {
      localStorage.setItem("students", JSON.stringify(students))
    }
  }, [students, isHydrated])

  const updateStudents = useCallback((newStudents: Student[]) => {
    setStudents(newStudents)
  }, [])

  const addStudent = useCallback(
    (studentData: Omit<Student, "id" | "feeStatus" | "isDeleted">) => {
      const newStudent: Student = {
        ...studentData,
        id: `${Date.now()}`,
        isDeleted: false,
        feeStatus: {
          January: "unpaid",
          February: "unpaid",
          March: "unpaid",
          April: "unpaid",
          May: "unpaid",
          June: "unpaid",
          July: "unpaid",
          August: "unpaid",
          September: "unpaid",
          October: "unpaid",
          November: "unpaid",
          December: "unpaid",
        },
      }
      updateStudents([...students, newStudent])
    },
    [students, updateStudents]
  )

  const deleteStudent = useCallback(
    (id: string) => {
      updateStudents(
        students.map((student) =>
          student.id === id ? { ...student, isDeleted: true } : student
        )
      )
    },
    [students, updateStudents]
  )

  const togglePaymentStatus = useCallback(
    (id: string, month: Month) => {
      updateStudents(
        students.map((student) =>
          student.id === id
            ? {
                ...student,
                feeStatus: {
                  ...student.feeStatus,
                  [month]: student.feeStatus[month] === "paid" ? "unpaid" : "paid",
                },
              }
            : student
        )
      )
    },
    [students, updateStudents]
  )

  const getStudentById = useCallback(
    (id: string) => {
      return students.find((s) => s.id === id && !s.isDeleted)
    },
    [students]
  )

  const getActiveStudents = useCallback(() => {
    return students.filter((s) => !s.isDeleted)
  }, [students])

  const getStudentStats = useCallback(
    (month: Month) => {
      const active = students.filter((s) => !s.isDeleted)
      const total = active.length
      const paid = active.filter((s) => s.feeStatus[month] === "paid").length
      const unpaid = total - paid
      return { total, paid, unpaid }
    },
    [students]
  )

  return (
    <StudentStoreContext.Provider
      value={{
        students,
        addStudent,
        deleteStudent,
        togglePaymentStatus,
        getStudentById,
        getActiveStudents,
        getStudentStats,
        isHydrated,
      }}
    >
      {children}
    </StudentStoreContext.Provider>
  )
}

export function useStudentStore() {
  const context = useContext(StudentStoreContext)
  if (!context) {
    throw new Error("useStudentStore must be used within StudentStoreProvider")
  }
  return context
}
