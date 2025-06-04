import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"

const montserrat = Montserrat({ 
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-montserrat"
})

export const metadata: Metadata = {
  title: "NoteBridge - Music Lesson Management Platform",
  description:
    "Connect teachers and students through comprehensive music lesson management, real-time chat, and file sharing.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>{children}</body>
    </html>
  )
}
