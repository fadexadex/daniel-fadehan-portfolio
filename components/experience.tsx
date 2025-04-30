"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import Image from "next/image"
import { ChevronRight, ExternalLink } from "lucide-react"
import Link from "next/link"
import type { Experience as ExperienceType } from "@/types"

interface ExperienceProps {
  experiences?: ExperienceType[]
}

export default function Experience({ experiences = [] }: ExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  // Subtle background parallax effect
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"])

  return (
    <section id="experience" className="py-20 md:py-32 lg:py-40 relative overflow-hidden">
      {/* Subtle background element with parallax */}
      <motion.div className="absolute inset-0 opacity-5 pointer-events-none" style={{ y: backgroundY }}>
        <div className="absolute top-0 left-0 w-full h-full bg-primary/5 transform -skew-y-6"></div>
        <div className="absolute top-1/4 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full"></div>
        <div className="absolute bottom-0 left-1/4 w-1/3 h-1/3 bg-primary/5 rounded-full"></div>
      </motion.div>

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto mb-16 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Work Experience</h2>
          <div className="h-1 w-20 bg-primary mx-auto mb-8 rounded-full"></div>
          <p className="text-lg text-muted-foreground">
            My professional journey as a backend engineer, showcasing my growth and achievements.
          </p>
        </motion.div>

        {experiences.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No experience data available at the moment.</p>
          </div>
        ) : (
          <div ref={containerRef} className="relative max-w-4xl mx-auto space-y-12 md:space-y-16">
            {experiences.map((exp, index) => (
              <ExperienceCard key={exp.id || index} experience={exp} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function ExperienceCard({
  experience,
  index,
}: {
  experience: ExperienceType
  index: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { once: true, amount: 0.3 })

  // Alternate animation direction based on index
  const initialX = index % 2 === 0 ? -50 : 50

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: initialX, y: 20 }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: initialX, y: 20 }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1], // Custom easing for smooth animation
        delay: 0.1,
      }}
      className="bg-background/50 backdrop-blur-sm rounded-xl border border-border shadow-sm overflow-hidden"
    >
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-6">
          {/* Company Logo */}
          <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
            <Image
              src={experience.logo || "/placeholder.svg?height=80&width=80"}
              alt={experience.company}
              width={60}
              height={60}
              className="object-cover"
            />
          </div>

          {/* Position and Company Info */}
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <h3 className="text-xl md:text-2xl font-bold">{experience.position}</h3>
              {experience.url && (
                <Link
                  href={experience.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  Visit Website <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 text-muted-foreground">
              <span className="font-medium">{experience.company}</span>
              <span className="hidden md:inline-block">•</span>
              <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full inline-block w-fit">
                {experience.period}
              </span>
              {experience.location && (
                <>
                  <span className="hidden md:inline-block">•</span>
                  <span className="text-sm">{experience.location}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Department and Industry */}
        {(experience.department || experience.industry) && (
          <div className="mb-4 flex flex-wrap gap-2">
            {experience.department && (
              <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                {experience.department}
              </span>
            )}
            {experience.industry && (
              <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                {experience.industry}
              </span>
            )}
            {experience.team_size && (
              <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                Team of {experience.team_size}
              </span>
            )}
          </div>
        )}

        {/* Key Responsibilities */}
        <div className="space-y-3 mb-6">
          <h4 className="text-sm font-medium">Key Responsibilities & Achievements</h4>
          {experience.description &&
            experience.description.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-3"
              >
                <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-muted-foreground">{item}</p>
              </motion.div>
            ))}
        </div>

        {/* Notable Projects */}
        {experience.projects && experience.projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-6"
          >
            <h4 className="text-sm font-medium mb-2">Notable Projects</h4>
            <div className="flex flex-wrap gap-2">
              {experience.projects.map((project, i) => (
                <span key={i} className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                  {project}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Skills */}
        {experience.skills && experience.skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-6"
          >
            <h4 className="text-sm font-medium mb-2">Technologies & Skills</h4>
            <div className="flex flex-wrap gap-2">
              {experience.skills.map((skill, i) => (
                <span key={i} className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recommendations */}
        {experience.recommendations && experience.recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-6 p-4 bg-muted/30 rounded-lg border border-border"
          >
            <blockquote className="text-sm italic text-muted-foreground">
              "{experience.recommendations[0].text}"
            </blockquote>
            <div className="mt-2 text-xs">
              <span className="font-medium">— {experience.recommendations[0].author}</span>,{" "}
              {experience.recommendations[0].position}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
