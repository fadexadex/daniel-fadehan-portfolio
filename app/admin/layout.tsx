import type React from "react"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import "../globals.css"

export const metadata = {
  title: "Admin Dashboard - Portfolio",
  description: "Admin dashboard for portfolio website",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <div className="min-h-screen bg-background">{children}</div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
