import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import About from "@/components/about"
import Projects from "@/components/projects"
import Experience from "@/components/experience"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import { getProjects, getExperiences } from "@/lib/data"

// Revalidate this page every hour
export const revalidate = 3600

export default async function Home() {
  // Fetch data from Supabase
  const projects = await getProjects()
  const experiences = await getExperiences()

  return (
    <main className="min-h-screen bg-background transition-colors duration-300 overflow-x-hidden w-full">
      <Navbar />
      <Hero />
      <About />
      <Projects projects={projects} />
      <Experience experiences={experiences} />
      <Contact />
      <Footer />
    </main>
  )
}
