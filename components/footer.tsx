import Link from "next/link"
import { Github, Linkedin, Mail, Twitter } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-10 md:py-12 border-t border-border">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="#home" className="text-xl font-bold">
              <span className="text-primary">Fadex</span>
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link href="https://github.com/fadexadex" className="text-muted-foreground hover:text-foreground transition-colors">
              <span className="sr-only">Github</span>
              <Github className="h-5 w-5" />
            </Link>
            <Link href="https://www.linkedin.com/in/danielfadehan/" className="text-muted-foreground hover:text-foreground transition-colors">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link href="https://x.com/f_adex_" className="text-muted-foreground hover:text-foreground transition-colors">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="mailto:adexxing021@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors">
              <span className="sr-only">Email</span>
              <Mail className="h-5 w-5" />
            </Link>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">&copy; {currentYear} Fadehan Daniel. All Rights Reserved.</p>
          <p className="text-xs text-muted-foreground mt-1">
            Designed and built with <span className="text-red-500">♥</span> using Next.js and Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
}
