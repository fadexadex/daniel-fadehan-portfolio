"use client"

import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"

export default function About() {
  const skills = [
    {
      category: "Languages",
      items: [
        { name: "JavaScript", level: 90 },
        { name: "TypeScript", level: 85 },
        { name: "Python", level: 80 },
      ],
    },
    {
      category: "Frameworks",
      items: [
        { name: "Node.js", level: 95 },
        { name: "Express", level: 90 },
        { name: "React.js", level: 80 },
        { name: "NestJS", level: 80 },
        { name: "Flask", level: 75 },
      ],
    },
    {
      category: "Databases",
      items: [
        { name: "PostgreSQL", level: 90 },
        { name: "MongoDB", level: 90 },
        { name: "Redis", level: 90 },
        { name: "MySQL", level: 80 },
        { name: "Algolia", level: 70 },
      ],
    },
    {
      category: "Cloud",
      items: [
        { name: "Railway", level: 85 },
        { name: "Azure", level: 85 },
        { name: "Render", level: 85 },
        { name: "Docker", level: 80 },
        { name: "CI/CD", level: 80 },
      ],
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section id="about" className="py-20 md:py-32 lg:py-40">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto mb-16 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">About Me</h2>
          <div className="h-1 w-20 bg-primary mx-auto mb-8 rounded-full"></div>
          <p className="text-lg text-muted-foreground">
          I'm a passionate software engineer with over 2 years of experience building reliable systems and APIs. I specialize in engineering efficient solutions to meet complex user and system requirements.  
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold font-heading">My Journey</h3>
            <p className="text-muted-foreground">
             I began my journey into software engineering when I took my first programming boot camp. I fell in love with building systems and decided to make a career out of it. Over the past few years, I have had the opportunity to work alongside extremely talented engineers in hackathons, early-stage startups, and open-source projects.
            </p>
            <p className="text-muted-foreground">
              My approach combines technical excellence with a deep understanding of business needs. I believe that the
              best technical solutions are those that not only solve the immediate problem but also provide a foundation
              for future growth.
            </p>
            <p className="text-muted-foreground">
              When I'm not coding, you can find me exploring new technologies, playing the piano, or
              gaming.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Tabs defaultValue={skills[0].category.toLowerCase()} className="w-full">
              <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 mb-8 gap-1">
                {skills.map((skill) => (
                  <TabsTrigger key={skill.category} value={skill.category.toLowerCase()}>
                    {skill.category}
                  </TabsTrigger>
                ))}
              </TabsList>
              {skills.map((skill) => (
                <TabsContent key={skill.category} value={skill.category.toLowerCase()} className="mt-0">
                  <Card className="p-6 bg-background/40 backdrop-blur-sm">
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="space-y-6"
                    >
                      {skill.items.map((item, index) => (
                        <motion.div key={item.name} variants={itemVariants} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{item.name}</span>
                            <span className="text-xs text-muted-foreground">{item.level}%</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${item.level}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              viewport={{ once: true }}
                              className="h-full bg-primary rounded-full"
                            />
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
