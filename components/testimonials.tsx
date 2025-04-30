"use client"

import { motion } from "framer-motion"
import { Quote } from "lucide-react"
import Image from "next/image"

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Thompson",
      position: "CTO, Tech Solutions",
      avatar: "/placeholder.svg?height=80&width=80",
      quote:
        "I am thrilled with the backend systems developed for my business. The ability to handle my growth without any issues is exactly what I needed.",
    },
    {
      name: "John Anderson",
      position: "Product Manager",
      avatar: "/placeholder.svg?height=80&width=80",
      quote:
        "Working with this developer was a game-changer for our online business. The API design skills are exceptional.",
    },
    {
      name: "Mark Davis",
      position: "Startup Founder",
      avatar: "/placeholder.svg?height=80&width=80",
      quote:
        "The codebase is clean and technical expertise in scaling systems is impressive. Would definitely work together again.",
    },
    {
      name: "Laura Adams",
      position: "Tech Lead",
      avatar: "/placeholder.svg?height=80&width=80",
      quote:
        "A rare talent when it comes to backend architecture. The solutions provided were elegant, maintainable, and perfectly matched our needs.",
    },
  ]

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-muted/30">
      <div className="container">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <Quote className="h-6 w-6" />
          <h2 className="text-3xl font-bold tracking-tighter">Words From Happy Clients</h2>
        </div>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Discover what satisfied clients have to say about their experiences working with me
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="border border-border rounded-lg p-6 relative"
            >
              <div className="flex items-start gap-4">
                <Image
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-bold">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                </div>
              </div>
              <blockquote className="mt-4 text-muted-foreground">"{testimonial.quote}"</blockquote>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
