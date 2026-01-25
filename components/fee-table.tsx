// "use client"

// import { useEffect, useRef, useState } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { BillPreview } from "../../../components/bill-preview"
// import { useStudentStore } from "../../../lib/student-store"
// import { useMonth } from "../../../lib/month-context"

// interface Payment {
//   _id: string
//   month: string
//   year: number
//   status: "PAID" | "UNPAID"
//   amount: number
// }

// /* 🔢 Number → Words */
// function numberToWords(num: number): string {
//   if (num === 0) return "Zero"

//   const a = [
//     "", "One", "Two", "Three", "Four", "Five", "Six",
//     "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
//     "Thirteen", "Fourteen", "Fifteen", "Sixteen",
//     "Seventeen", "Eighteen", "Nineteen"
//   ]

//   const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]

//   const inWords = (n: number): string => {
//     if (n < 20) return a[n]
//     if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "")
//     if (n < 1000)
//       return a[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + inWords(n % 100) : "")
//     if (n < 100000)
//       return inWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + inWords(n % 1000) : "")
//     if (n < 10000000)
//       return inWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + inWords(n % 100000) : "")
//     return ""
//   }

//   return inWords(num)
// }

// export default function ReceiptPage() {
//   const params = useParams()
//   const studentId = params.studentId as string
//   const router = useRouter()
//   const { selectedMonth } = useMonth()
//   const { getStudentById } = useStudentStore()

//   const [student, setStudent] = useState<any>(null)
//   const [payments, setPayments] = useState<Payment[]>([])
//   const [loading, setLoading] = useState(true)

//   const billRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     async function loadData() {
//       try {
//         const s = getStudentById(studentId)
//         if (!s) return setLoading(false)

//         setStudent(s)
//         const res = await fetch(`/api/payments/${studentId}`)
//         const data = await res.json()
//         setPayments(data)
//       } catch (e) {
//         console.error(e)
//       } finally {
//         setLoading(false)
//       }
//     }

//     if (studentId) loadData()
//   }, [studentId, getStudentById])

//   if (loading) return <div className="p-6">Loading...</div>
//   if (!student) return <div className="p-6 text-red-600">Student not found</div>

//   const currentYear = new Date().getFullYear()
//   const paid = payments.some(
//     (p) =>
//       p.month === selectedMonth &&
//       p.year === currentYear &&
//       p.status === "PAID"
//   )

//   const status = paid ? "paid" : "unpaid"

//   /* 🖨 PRINT → SAVE AS PDF */
//   const handleDownloadPDF = () => {
//     if (!billRef.current) return

//     const clone = billRef.current.cloneNode(true) as HTMLElement
//     clone.querySelectorAll(".bill-watermark").forEach((el) => el.remove())

//     const win = window.open("", "_blank")
//     if (!win) return alert("Popup blocked")

//     win.document.write(`
//       <html>
//         <head>
//           <title>Fee Receipt</title>
//           <script src="https://cdn.tailwindcss.com"></script>
//           <style>body{background:white;padding:30px}</style>
//         </head>
//         <body>
//           ${clone.outerHTML}
//         </body>
//       </html>
//     `)

//     win.document.close()
//     win.onload = () => {
//       win.focus()
//       win.print()
//     }
//   }

//   return (
//     <div className="p-6 space-y-4 bg-gray-50 min-h-screen">
//       <div className="flex justify-between items-center print:hidden">
//         <button
//           onClick={() => router.back()}
//           className="px-4 py-2 border rounded bg-white"
//         >
//           ⬅ Back
//         </button>

//         <button
//           onClick={handleDownloadPDF}
//           className="px-4 py-2 bg-black text-white rounded"
//         >
//           ⬇ Download PDF
//         </button>
//       </div>

//       <div ref={billRef}>
//         <BillPreview
//           student={student}
//           month={selectedMonth as any}
//           status={status}
//           amountInWords={numberToWords(student.monthlyFee)}
//         />
//       </div> 
//     </div>
//   )
// }
