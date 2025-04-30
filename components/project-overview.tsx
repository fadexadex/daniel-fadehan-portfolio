"use client"

import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import type { Project } from "@/types"

export function ProjectOverview({ project }: { project: Project }) {
  return (
    <>
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <h3 className="text-2xl font-semibold mb-4">Project Overview</h3>
        <p className="text-muted-foreground whitespace-pre-line">{project.overview}</p>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Key Features</h3>
        <ul className="space-y-2">
          {project.features.map((feature, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-start gap-2"
            >
              <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{feature}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Challenges & Solutions</h3>
        <ul className="space-y-2">
          {project.challenges.map((challenge, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-start gap-2"
            >
              <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{challenge}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </>
  )
}
