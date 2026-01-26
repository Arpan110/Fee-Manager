import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { StudentStoreProvider } from '@/lib/student-store'
import { MonthProvider } from '@/lib/month-context'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Fee Manager',
  description: 'Month-wise Student Fee Management System',
 icons: {
    icon: [
      {
        url: '/fevicon.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/fevicon.png',
        type: 'image/svg+xml',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <StudentStoreProvider>
          <MonthProvider>
            {children}
          </MonthProvider>
        </StudentStoreProvider>
        <Analytics />
      </body>
    </html>
  )
}
