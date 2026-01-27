import type { Student } from "./student-store"
import type { Month } from "./month-context"

// Convert number to words
function numberToWords(num: number): string {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"]
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"]
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]
  const scales = ["", "Thousand", "Lakh", "Crore"]

  if (num === 0) return "Zero"

  let parts: string[] = []
  let scaleIndex = 0

  while (num > 0) {
    let part = num % 1000
    if (part !== 0) {
      let partWords = ""
      const hundreds = Math.floor(part / 100)
      const remainder = part % 100

      if (hundreds > 0) {
        partWords += ones[hundreds] + " Hundred"
      }

      if (remainder >= 10 && remainder < 20) {
        if (partWords) partWords += " "
        partWords += teens[remainder - 10]
      } else {
        const ten = Math.floor(remainder / 10)
        const one = remainder % 10

        if (ten > 0) {
          if (partWords) partWords += " "
          partWords += tens[ten]
        }

        if (one > 0) {
          if (partWords) partWords += " "
          partWords += ones[one]
        }
      }

      if (scaleIndex > 0) {
        partWords += " " + scales[scaleIndex]
      }

      parts.unshift(partWords)
    }

    num = Math.floor(num / 1000)
    scaleIndex++
  }

  return parts.join(" ")
}

// Convert image URLs to base64
async function urlToBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url)
    if (!response.ok) return ""
    const blob = await response.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.readAsDataURL(blob)
    })
  } catch {
    return ""
  }
}

export async function generateStudentBillPDF(
  student: Student,
  month: Month,
  paymentStatus: "paid" | "unpaid"
) {
  const receiptNo = `RCP-${student.studentId}-${Date.now().toString().slice(-6)}`
  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  const logoBase64 = await urlToBase64("/logo.png")
  const signatureBase64 = await urlToBase64("/signature.png")

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Fee Receipt</title>
<style>
body { font-family: Arial, sans-serif; }
.page { width: 8.5in; height: 11in; padding: 40px; }
.status-paid { color: green; font-weight: bold; }
.status-unpaid { color: red; font-weight: bold; }
</style>
</head>

<body>
<div class="page">

<h2>VIVEK VIKAS MISSION SCHOOL</h2>
<p>KHIRI * KOTULPUR * BANKURA</p>

<hr/>

<p><b>Receipt No:</b> ${receiptNo}</p>
<p><b>Date:</b> ${currentDate}</p>

<h3>Student Details</h3>
<p><b>Name:</b> ${student.name}</p>
<p><b>Guardian:</b> ${student.guardian}</p>
<p><b>Class:</b> ${student.className}</p>
<p><b>Village:</b> ${student.village}</p>
<p><b>ID:</b> ${student.studentId}</p>

<h3>Fee Details</h3>
<p>Month: ${month}</p>
<p>Amount: ₹ ${student.monthlyFee.toLocaleString("en-IN")}</p>
<p><b>In words:</b> ${numberToWords(student.monthlyFee)} Rupees Only</p>

<h3 class="${paymentStatus === "paid" ? "status-paid" : "status-unpaid"}">
${paymentStatus === "paid" ? "PAYMENT RECEIVED" : "PAYMENT PENDING"}
</h3>

</div>
</body>
</html>
`

  const win = window.open("", "_blank")
  if (!win) {
    alert("Please allow popups")
    return
  }

  win.document.write(htmlContent)
  win.document.close()

  win.onload = () => win.print()
}
