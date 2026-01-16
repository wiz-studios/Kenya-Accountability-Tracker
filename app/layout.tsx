import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, Fraunces } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
})
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700"],
})

export const metadata: Metadata = {
  title: "Kenya Accountability Tracker",
  description: "Monitoring public projects and leadership accountability across Kenya",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${fraunces.variable}`}>
        <Navigation />
        {children}
      </body>
    </html>
  )
}
