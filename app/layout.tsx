import type React from "react"
import { Space_Grotesk, Montserrat } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

// Font configurations
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})

export const metadata = {
  title: "Fadehan Daniel | Backend Engineer",
  description: "Portfolio of Fadehan Daniel, a backend engineer specializing in scalable systems and APIs",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${spaceGrotesk.variable} ${montserrat.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
       <link
          rel="icon"
          href="https://pyeklitbktoezqmbwbvx.supabase.co/storage/v1/object/public/portfolio//logo_icon.ico"
          type="image/x-icon"
        />
      </head>
      <body className={`${montserrat.className} overflow-x-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
