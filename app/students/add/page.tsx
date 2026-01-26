import { AdminLayout } from "@/components/admin-layout"
import { StudentForm } from "@/components/student-form"

export const metadata = {
  title: "Add New Student",
}

export default function AddStudentPage() {
  return (
    <AdminLayout title="Add New Student" showDownloadReport={false}>
      <div className="space-y-6 flex justify-center mt-30">
        <StudentForm />
      </div>
    </AdminLayout>
  )
}
