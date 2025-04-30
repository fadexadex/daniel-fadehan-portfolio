"use client"

import { motion } from "framer-motion"
import { Layers } from "lucide-react"

export default function TechStack() {
  const stacks = [
    {
      category: "Backend",
      tools: [
        { name: "Node.js", icon: "🟢" },
        { name: "Python", icon: "🐍" },
        { name: "Java", icon: "☕" },
        { name: "Go", icon: "🔵" },
      ],
    },
    {
      category: "Databases",
      tools: [
        { name: "PostgreSQL", icon: "🐘" },
        { name: "MongoDB", icon: "🍃" },
        { name: "Redis", icon: "🔴" },
        { name: "MySQL", icon: "🐬" },
      ],
    },
    {
      category: "DevOps",
      tools: [
        { name: "Docker", icon: "🐳" },
        { name: "Kubernetes", icon: "☸️" },
        { name: "AWS", icon: "☁️" },
        { name: "CI/CD", icon: "🔄" },
      ],
    },
    {
      category: "Tools",
      tools: [
        { name: "Git", icon: "🔀" },
        { name: "Jira", icon: "📊" },
        { name: "Postman", icon: "📬" },
        { name: "VS Code", icon: "💻" },
      ],
    },
  ]

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="container">
        <div className="flex items-center gap-2 mb-8">
          <Layers className="h-6 w-6" />
          <h2 className="text-3xl font-bold tracking-tighter">My Tech Stack</h2>
        </div>
        <p className="text-muted-foreground mb-10">
          Commitment to staying updated with the latest design trends and technologies
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stacks.map((stack, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="border border-border rounded-lg p-6"
            >
              <h3 className="text-xl font-bold mb-4">{stack.category}</h3>
              <div className="grid grid-cols-2 gap-4">
                {stack.tools.map((tool, toolIndex) => (
                  <div key={toolIndex} className="flex items-center gap-2 text-muted-foreground">
                    <span>{tool.icon}</span>
                    <span>{tool.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
