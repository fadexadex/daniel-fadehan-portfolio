"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Github, Code, ArrowUpRight, Award, User, Lock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-mobile"
import { useRouter } from "next/navigation"

// Project schema that will be used with Supabase
export type Project = {
  id: number
  title: string
  description: string
  longDescription?: string
  image: string
  category: "personal" | "hackathon"
  position?: string // For hackathons, the position achieved
  tags: string[]
  github?: string
  demo?: string // Now optional
  features: string[]
  challenges: string[]
  overview: string
  systemDesign?: string
  databaseDesign?: string
  systemDesignImage?: string // URL to system design diagram
  databaseDesignImage?: string // URL to database design diagram
  additionalDetails?: string
  projectDate?: string // When the project was created/completed
  teamSize?: number // Number of team members (especially for hackathons)
  teamMembers?: string[] // Names of team members (for hackathons)
  duration?: string // How long the project took (e.g., "48 hours", "3 months")
  createdAt?: string
  updatedAt?: string
  is_published?: boolean
}

interface ProjectsProps {
  projects?: Project[]
}

export default function Projects({ projects = [] }: ProjectsProps) {
  const [activeFilter, setActiveFilter] = useState("all")
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const router = useRouter()

  const filters = [
    { name: "All", value: "all" },
    { name: "Personal", value: "personal" },
    { name: "Hackathon", value: "hackathon" },
  ]

  const filteredProjects =
    activeFilter === "all" ? projects : projects.filter((project) => project.category === activeFilter)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "personal":
        return <User className="h-3 w-3" />
      case "hackathon":
        return <Award className="h-3 w-3" />
      default:
        return null
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "personal":
        return "Personal"
      case "hackathon":
        return "Hackathon"
      default:
        return category
    }
  }

  const handleViewDetails = (e: React.MouseEvent, projectId: number) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/projects/${projectId}`)
  }

  return (
    <section id="projects" className="py-20 md:py-32 lg:py-40 bg-muted/30 w-full">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto mb-16 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Projects</h2>
          <div className="h-1 w-20 bg-primary mx-auto mb-8 rounded-full"></div>
          <p className="text-lg text-muted-foreground">
            A showcase of my personal projects and hackathon achievements, demonstrating my technical skills and
            creativity.
          </p>
        </motion.div>

        <div className="flex justify-center mb-12 overflow-x-auto pb-2">
          <div className="inline-flex p-1 bg-muted rounded-lg">
            {filters.map((filter) => (
              <Button
                key={filter.value}
                variant={activeFilter === filter.value ? "default" : "ghost"}
                size={isMobile ? "sm" : "default"}
                onClick={() => setActiveFilter(filter.value)}
                className="rounded-md px-3 md:px-4 whitespace-nowrap"
              >
                {filter.name}
              </Button>
            ))}
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects found in this category.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <AnimatePresence mode="wait">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                  onHoverStart={() => setHoveredProject(project.id)}
                  onHoverEnd={() => setHoveredProject(null)}
                  className="group relative bg-background border border-border rounded-xl overflow-hidden shadow-sm"
                >
                  <Link href={`/projects/${project.id}`} className="absolute inset-0 z-10" aria-label={project.title}>
                    <span className="sr-only">View {project.title} details</span>
                  </Link>
                  <div className="relative overflow-hidden aspect-video">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
                      className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6"
                    >
                      <div className="flex gap-3">
                        {project.github ? (
                          <motion.a
                            href={project.github}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors z-20"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Github className="h-5 w-5" />
                          </motion.a>
                        ) : (
                          <motion.div
                            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white opacity-50 cursor-not-allowed z-20"
                            title="Source code is private"
                          >
                            <Lock className="h-5 w-5" />
                          </motion.div>
                        )}
                        {project.demo && (
                          <motion.a
                            href={project.demo}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors z-20"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="h-5 w-5" />
                          </motion.a>
                        )}
                      </div>
                    </motion.div>
                  </div>
                  <div className="p-4 md:p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg md:text-xl font-bold group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <Badge variant="outline" className="capitalize text-xs flex items-center gap-1">
                        {getCategoryIcon(project.category)}
                        {getCategoryLabel(project.category)}
                      </Badge>
                    </div>

                    {/* Show position for hackathon projects */}
                    {project.category === "hackathon" && project.position && (
                      <div className="mb-2">
                        <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                          {project.position}
                        </Badge>
                      </div>
                    )}

                    {/* Show duration */}
                    {project.duration && (
                      <div className="mb-2 text-xs text-muted-foreground">Duration: {project.duration}</div>
                    )}

                    <p className="text-muted-foreground mb-4 text-sm md:text-base line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, isMobile ? 3 : 5).map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > (isMobile ? 3 : 5) && (
                        <Badge variant="secondary" className="text-xs">
                          +{project.tags.length - (isMobile ? 3 : 5)}
                        </Badge>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 relative z-20 transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                        onClick={(e) => handleViewDetails(e, project.id)}
                      >
                        <span className="text-xs">View Details</span>
                        <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <div className="mt-12 text-center">
          <Button asChild variant="outline">
            <a
              href="https://github.com/fadexadex"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <Code className="h-4 w-4" />
              View All Projects on GitHub
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
