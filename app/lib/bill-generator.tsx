import type { Student } from "./student-store"
import type { Month } from "./month-context"

export function generateStudentBillPDF(student: Student, month: Month) {
  const paymentStatus = student.feeStatus[month]
  const receiptNo = `RCP-${student.studentId}-${Date.now().toString().slice(-6)}`
  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Fee Receipt - ${student.name}</title>
      <style>
        * { margin: 0; padding: 0; }
        body {
          font-family: Arial, sans-serif;
          background: white;
          color: #333;
          line-height: 1.4;
        }
        .page {
          width: 8.5in;
          height: 11in;
          margin: 0 auto;
          padding: 40px;
          box-sizing: border-box;
          background: white;
          position: relative;
        }
        .watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0.08;
          z-index: 0;
          pointer-events: none;
          font-size: 120px;
          font-weight: bold;
          color: #333;
        }
        .content {
          position: relative;
          z-index: 1;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #003d82;
          padding-bottom: 15px;
          margin-bottom: 15px;
        }
        .school-name {
          font-size: 24px;
          font-weight: bold;
          color: #003d82;
          line-height: 1.3;
        }
        .school-tagline {
          font-size: 12px;
          color: #666;
          margin-top: 3px;
        }
        .school-address {
          font-size: 11px;
          color: #666;
          margin-top: 2px;
        }
        .receipt-title {
          text-align: center;
          font-size: 18px;
          font-weight: bold;
          color: #003d82;
          margin: 15px 0;
          background: #f0f4ff;
          padding: 8px;
        }
        .receipt-meta {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          margin-bottom: 15px;
          padding: 0 10px;
        }
        .section {
          margin-bottom: 12px;
        }
        .section-title {
          font-size: 12px;
          font-weight: bold;
          color: #003d82;
          margin-bottom: 5px;
          padding-bottom: 3px;
          border-bottom: 1px solid #ddd;
        }
        .info-box {
          background: #f9fafb;
          padding: 10px;
          border-radius: 3px;
          font-size: 12px;
          line-height: 1.5;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 3px 0;
        }
        .info-label {
          font-weight: 600;
          color: #333;
          min-width: 100px;
        }
        .info-value {
          color: #555;
          text-align: right;
          flex: 1;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 12px 0;
        }
        th {
          background: #f0f4ff;
          border: 1px solid #999;
          padding: 7px;
          text-align: left;
          font-size: 11px;
          font-weight: bold;
          color: #003d82;
        }
        td {
          border: 1px solid #999;
          padding: 7px;
          font-size: 11px;
        }
        .amount-right {
          text-align: right;
        }
        .total-row {
          background: #f0f4ff;
          font-weight: bold;
          color: #003d82;
        }
        .status-section {
          text-align: center;
          margin: 15px 0;
        }
        .status-badge {
          display: inline-block;
          padding: 8px 20px;
          border-radius: 3px;
          font-weight: bold;
          font-size: 12px;
        }
        .status-paid {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #22c55e;
        }
        .status-unpaid {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #ef4444;
        }
        .signature-section {
          display: flex;
          justify-content: space-between;
          margin-top: 30px;
          border-top: 2px dashed #999;
          padding-top: 15px;
        }
        .sig-box {
          text-align: center;
          width: 45%;
        }
        .sig-space {
          height: 50px;
          margin-bottom: 5px;
        }
        .sig-label {
          font-size: 10px;
          font-weight: 600;
          color: #333;
        }
        .footer {
          text-align: center;
          font-size: 10px;
          color: #999;
          margin-top: 20px;
          border-top: 1px solid #ddd;
          padding-top: 10px;
        }
        @media print {
          body { margin: 0; padding: 0; }
          .page { margin: 0; padding: 30px; }
          .watermark { opacity: 0.08; }
        }
      </style>
    </head>
    <body>
      <div class="watermark">SCHOOL</div>
      <div class="page">
        <div class="content">
          <div class="header">
            <div class="school-name">VIVEK VIKAS MISSION SCHOOL</div>
            <div class="school-address">KHIRI * KOTULPUR * BANKURA * PIN - 722141</div>
            <div class="school-address">Phone: +91 8777393801</div>
          </div>

          <div class="receipt-title">FEE RECEIPT</div>

          <div class="receipt-meta">
            <div>Receipt No: ${receiptNo}</div>
            <div>Date: ${currentDate}</div>
          </div>

          <div class="section">
            <div class="section-title">STUDENT DETAILS</div>
            <div class="info-box">
              <div class="info-row">
                <span class="info-label">Received from:</span>
                <span class="info-value">${student.name}</span>
              </div>
              <div class="info-row">
                <span class="info-label">S/O, D/O:</span>
                <span class="info-value">${student.guardianName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Class:</span>
                <span class="info-value">${student.class}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Section:</span>
                <span class="info-value">${student.section}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Roll / ID:</span>
                <span class="info-value">${student.studentId}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">FEE DETAILS</div>
            <table>
              <thead>
                <tr>
                  <th style="width: 60%;">Description</th>
                  <th style="width: 20%; text-align: center;">Month</th>
                  <th style="width: 20%; text-align: right;">Amount (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Fees</td>
                  <td style="text-align: center;">${month}</td>
                  <td class="amount-right">${student.monthlyFee.toLocaleString("en-IN")}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="total-row">
                  <td colspan="2">Total</td>
                  <td class="amount-right">${student.monthlyFee.toLocaleString("en-IN")}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div class="status-section">
            <span class="status-badge ${paymentStatus === "paid" ? "status-paid" : "status-unpaid"}">
              ${paymentStatus === "paid" ? "PAYMENT RECEIVED" : "PAYMENT PENDING"}
            </span>
          </div>

          
            <div class="sig-box">
              <div class="sig-space"></div>
              <div class="sig-label">Receiver's Signature</div>
            </div>
          </div>

          <div class="footer">
            <p>This is a computer-generated receipt. No signature required.</p>
            <p style="margin-top: 5px;">Thank you for your payment</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  const printWindow = window.open("", "_blank")
  if (!printWindow) {
    alert("Please disable popup blocker to download the bill")
    return
  }

  printWindow.document.write(htmlContent)
  printWindow.document.close()

  // Trigger PDF download after content loads
  setTimeout(() => {
    printWindow.print()
  }, 250)
}
