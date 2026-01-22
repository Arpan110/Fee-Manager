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

const SECTION_OPTIONS = ["A", "B", "C", "D", "E"]

export function StudentForm() {
  const router = useRouter()
  const { addStudent, getActiveStudents } = useStudentStore()
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    class: "",
    section: "",
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

  const handleSectionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, section: value }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      studentId: "",
      class: "",
      section: "",
      phone: "",
      guardianName: "",
      monthlyFee: "",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!formData.name.trim()) {
      setError("Full Name is required")
      return
    }
    if (!formData.studentId.trim()) {
      setError("Student ID is required")
      return
    }
    if (!formData.class) {
      setError("Class is required")
      return
    }
    if (!formData.section) {
      setError("Section is required")
      return
    }
    if (!formData.phone.trim()) {
      setError("Phone is required")
      return
    }
    if (!formData.guardianName.trim()) {
      setError("Guardian Name is required")
      return
    }
    if (!formData.monthlyFee || Number(formData.monthlyFee) <= 0) {
      setError("Monthly Fee must be greater than 0")
      return
    }

    // Check for duplicate Student ID
    const activeStudents = getActiveStudents()
    if (activeStudents.some((s) => s.studentId.toLowerCase() === formData.studentId.toLowerCase())) {
      setError("Student ID already exists. Please use a unique ID.")
      return
    }

    // Add student to the store
    addStudent({
      name: formData.name,
      studentId: formData.studentId,
      class: formData.class,
      section: formData.section,
      phone: formData.phone,
      guardianName: formData.guardianName,
      monthlyFee: Number(formData.monthlyFee),
    })

    // Show success message
    setShowSuccess(true)

    // Reset form
    resetForm()

    // Hide success message and redirect after delay
    setTimeout(() => {
      setShowSuccess(false)
      router.push("/students")
    }, 1500)
  }

  return (
    <>
      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-success/30 bg-success/10 p-4">
          <CheckCircle className="h-6 w-6 text-success" />
          <p className="text-base font-medium text-success">
            Student added successfully! Redirecting...
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
          <AlertCircle className="h-6 w-6 text-destructive" />
          <p className="text-base font-medium text-destructive">{error}</p>
        </div>
      )}

      <Card className="max-w-2xl border-l-4 border-l-primary">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-xl text-primary">Student Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter student name"
                  className="h-11 text-base"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentId" className="text-base">
                  Student ID / Roll <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="e.g., STU006"
                  className="h-11 text-base"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class" className="text-base">
                  Class <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.class} onValueChange={handleClassChange} required>
                  <SelectTrigger className="h-11 text-base">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASS_OPTIONS.map((cls) => (
                      <SelectItem key={cls} value={cls}>
                        {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="section" className="text-base">
                  Section <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.section} onValueChange={handleSectionChange} required>
                  <SelectTrigger className="h-11 text-base">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTION_OPTIONS.map((sec) => (
                      <SelectItem key={sec} value={sec}>
                        Section {sec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base">
                  Phone <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="h-11 text-base"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guardianName" className="text-base">
                  Guardian Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="guardianName"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                  placeholder="Enter guardian name"
                  className="h-11 text-base"
                  required
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="monthlyFee" className="text-base">
                  Monthly Fee (Rs.) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="monthlyFee"
                  name="monthlyFee"
                  type="number"
                  value={formData.monthlyFee}
                  onChange={handleChange}
                  placeholder="e.g., 2500"
                  className="h-11 text-base"
                  required
                  min="0"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-4 border-t border-border pt-6">
              <Button type="submit" size="lg" className="text-base" disabled={showSuccess}>
                <Save className="mr-2 h-5 w-5" />
                Save Student
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="bg-transparent text-base"
                onClick={() => router.push("/students")}
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
