"use client"

import { motion } from "framer-motion"
import { Code, Database, Server, Terminal } from "lucide-react"

export default function Services() {
  const services = [
    {
      icon: <Server className="h-10 w-10" />,
      title: "Backend Development",
      description: "Building robust, scalable, and secure server-side applications with modern technologies.",
    },
    {
      icon: <Database className="h-10 w-10" />,
      title: "Database Design",
      description: "Creating efficient database schemas and optimizing queries for performance.",
    },
    {
      icon: <Code className="h-10 w-10" />,
      title: "API Development",
      description: "Designing and implementing RESTful and GraphQL APIs for seamless integration.",
    },
    {
      icon: <Terminal className="h-10 w-10" />,
      title: "DevOps",
      description: "Setting up CI/CD pipelines, containerization, and cloud infrastructure.",
    },
  ]

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-muted/30">
      <div className="container">
        <h2 className="text-3xl font-bold tracking-tighter text-center mb-4">My Services</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Formulating comprehensive strategies to meet your development goals and exceed expectations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="border border-border rounded-lg p-6 text-center"
            >
              <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
