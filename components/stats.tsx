"use client"

import { motion } from "framer-motion"

export default function Stats() {
  const stats = [
    { value: "10+", label: "Happy Clients" },
    { value: "5+", label: "Years of Experience" },
    { value: "30+", label: "Completed Projects" },
  ]

  return (
    <section className="py-12 md:py-16 border-t border-border">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center text-center"
            >
              <h3 className="text-3xl font-bold">{stat.value}</h3>
              <p className="text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
