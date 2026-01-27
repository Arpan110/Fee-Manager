"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Save, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import { useStudentStore } from "@/lib/student-store"

const CLASS_OPTIONS = [
  "PP1",
  "PP2",
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
]

export function StudentForm() {
  const router = useRouter()
  const { addStudent, getActiveStudents } = useStudentStore()
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    class: "",
    village: "",
    phone: "",
    guardianName: "",
    monthlyFee: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleClassChange = (value: string) => {
    setFormData((prev) => ({ ...prev, class: value }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      studentId: "",
      class: "",
      village: "",
      phone: "",
      guardianName: "",
      monthlyFee: "",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name.trim()) return setError("Full Name is required")
    if (!formData.studentId.trim()) return setError("Student ID is required")
    if (!formData.class) return setError("Class is required")
    if (!formData.village.trim()) return setError("Village is required")
    if (!formData.phone.trim()) return setError("Phone is required")
    if (!formData.guardianName.trim()) return setError("Guardian Name is required")
    if (!formData.monthlyFee || Number(formData.monthlyFee) <= 0)
      return setError("Monthly Fee must be greater than 0")

    const activeStudents = getActiveStudents()
    if (
      activeStudents.some(
        (s) =>
          s.studentId.toLowerCase() === formData.studentId.toLowerCase()
      )
    ) {
      return setError("Student ID already exists. Please use a unique ID.")
    }

    addStudent({
      name: formData.name,
      studentId: formData.studentId,
      className: formData.class,
      village: formData.village,
      phone: formData.phone,
      guardian: formData.guardianName,
      monthlyFee: Number(formData.monthlyFee),
    })

    setShowSuccess(true)
    resetForm()

    setTimeout(() => {
      setShowSuccess(false)
      router.push("/students")
    }, 1500)
  }

  return (
    <>
      {showSuccess && (
        <div className="fixed top-10 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-lg border border-success/30 bg-success/10 px-6 py-4 shadow-lg backdrop-blur">
          <CheckCircle className="h-6 w-6 text-success" />
          <p className="text-base font-medium text-success">
            Student added successfully! Redirecting...
          </p>
        </div>
      )}

      {error && (
        <div className="fixed top-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-6 py-4 shadow-lg backdrop-blur">
          <AlertCircle className="h-6 w-6 text-destructive" />
          <p className="text-base font-medium text-destructive">{error}</p>
        </div>
      )}

      <Card className="max-w-2xl border-l-4 border-l-primary">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-xl text-primary">
            Student Information
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input name="name" value={formData.name} onChange={handleChange} />
              </div>

              <div className="space-y-2 ml-8">
                <Label>Roll No.</Label>
                <Input name="studentId" value={formData.studentId} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label>Class *</Label>
                <Select value={formData.class} onValueChange={handleClassChange}>
                  <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                  <SelectContent>
                    {CLASS_OPTIONS.map((cls) => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 ml-8">
                <Label>Village *</Label>
                <Input name="village" value={formData.village} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label>Phone *</Label>
                <Input name="phone" value={formData.phone} onChange={handleChange} />
              </div>

              <div className="space-y-2 ml-8">
                <Label>Guardian Name *</Label>
                <Input name="guardianName" value={formData.guardianName} onChange={handleChange} />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label>Monthly Fee *</Label>
                <Input type="number" name="monthlyFee" value={formData.monthlyFee} onChange={handleChange} />
              </div>
            </div>

            <div className="flex justify-between border-t pt-6">
              <Button type="button" variant="outline" onClick={() => router.push("/students")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" /> Save Student
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
