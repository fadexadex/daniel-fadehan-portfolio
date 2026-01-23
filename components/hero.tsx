"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function Hero() {
  const aboutSectionRef = useRef<HTMLElement | null>(null)

  const scrollToNextSection = () => {
    // Find the about section element
    if (!aboutSectionRef.current) {
      aboutSectionRef.current = document.getElementById("about")
    }

    // Scroll to the about section with smooth behavior
    if (aboutSectionRef.current) {
      aboutSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section
      id="home"
      className="min-h-[90vh] sm:min-h-screen flex flex-col justify-between w-full relative pt-20 sm:pt-24 md:pt-28 lg:pt-20 pb-8 sm:pb-10"
    >
      {/* Spacer div to ensure content doesn't get too close to navbar */}
      <div className="h-4 sm:h-6 md:h-8 lg:h-4"></div>

      <div className="flex-grow flex items-center">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            {/* Image - takes 5 columns on medium screens and above */}
            <motion.div
              className="md:col-span-5 flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative w-60 h-60 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-2xl overflow-hidden border-4 border-primary/20">
                <Image
                  src="/images/daniel.png"
                  alt="Fadehan Daniel"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-2xl transition-all duration-500 object-top"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-2xl"
                />
              </div>
            </motion.div>

            {/* Text content - takes 7 columns on medium screens and above */}
            <motion.div
              className="md:col-span-7 space-y-6 md:space-y-8 text-center md:text-left"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="mb-4 flex justify-center md:justify-start">
                <span className="hero-badge inline-block px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary rounded-full">
                  Software Engineer
                </span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="hero-title text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-4 md:mb-6"
              >
                Fadehan Daniel
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed"
              >
                I build reliable software systems that scale.
                Specializing in distributed
                systems, API design, and database optimization, and cloud infrastructure.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
              >
                <Button
                  asChild
                  size="lg"
                  className="rounded-full px-8 font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  <Link href="#projects">View My Work</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 font-medium transition-all duration-300 hover:bg-primary/10"
                >
                  <Link href="#contact">Get In Touch</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator with responsive positioning */}
      <div className="mt-10 sm:mt-12 md:mt-8 lg:mt-4 mb-4 sm:mb-8 hidden xs:flex justify-center">
        <motion.button
          className="scroll-indicator-button"
          onClick={scrollToNextSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          whileHover={{ y: 3 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Scroll to about section"
        >
          <ArrowDown className="scroll-indicator-arrow" />
        </motion.button>
      </div>
    </section>
  )
}
