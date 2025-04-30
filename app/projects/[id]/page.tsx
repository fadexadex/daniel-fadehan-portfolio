import { getProjectById } from "@/lib/data"
import { notFound } from "next/navigation"
import { ArrowLeft, Github, ExternalLink, Layout, Database, Award, Calendar, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectOverview } from "@/components/project-overview"
import ScrollToTop from "@/components/scroll-to-top"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"

export default async function ProjectDetail({ params }: { params: { id: string } }) {
  const project = await getProjectById(Number.parseInt(params.id))

  if (!project) {
    notFound()
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "personal":
        return "Personal Project"
      case "hackathon":
        return "Hackathon Project"
      default:
        return category
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-16 w-full overflow-x-hidden">
      {/* Add the ScrollToTop component */}
      <ScrollToTop />

      <div className="container px-4 mx-auto">
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-8 -ml-2 text-muted-foreground">
            <Link href="/#projects">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
            </Link>
          </Button>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="outline" className="capitalize">
              {getCategoryLabel(project.category)}
            </Badge>
            {project.position && (
              <Badge variant="secondary" className="bg-primary/10 text-primary flex items-center gap-1">
                <Award className="h-3 w-3" /> {project.position}
              </Badge>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h1>
          <p className="text-muted-foreground text-lg max-w-3xl mb-6">{project.description}</p>

          <div className="flex flex-wrap gap-4 mb-4">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Project metadata */}
          <div className="flex flex-wrap gap-4 mb-6">
            {project.duration && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Duration: {project.duration}</span>
              </div>
            )}
            {project.project_date && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Completed: {new Date(project.project_date).toLocaleDateString()}</span>
              </div>
            )}
            {project.team_size && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Team Size: {project.team_size}</span>
              </div>
            )}
          </div>

          {/* Team members for hackathon projects */}
          {project.category === "hackathon" && project.team_members && project.team_members.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Team Members:</h3>
              <div className="flex flex-wrap gap-2">
                {project.team_members.map((member, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {member}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-4 mb-8">
            <Button asChild variant="outline">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                View Source
              </a>
            </Button>
            {project.demo && (
              <Button asChild>
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Live Demo
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Project Image - Fixed for better display on laptop screens */}
        <div className="mb-12 flex justify-center">
          <div className="max-w-3xl w-full rounded-xl overflow-hidden border border-border">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={project.image || "/placeholder.svg?height=600&width=1200"}
                alt={project.title}
                fill
                className="object-cover transition-all duration-300 hover:scale-[1.02]"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="mb-12">
          <TabsList
            className="w-full max-w-md mx-auto grid mb-8"
            style={{
              gridTemplateColumns: `repeat(${
                [true, !!project.system_design, !!project.database_design].filter(Boolean).length
              }, 1fr)`,
            }}
          >
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {project.system_design && <TabsTrigger value="system-design">System Design</TabsTrigger>}
            {project.database_design && <TabsTrigger value="database">Database</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <ProjectOverview project={project} />
          </TabsContent>

          {project.system_design && (
            <TabsContent value="system-design">
              <div className="bg-muted/30 p-6 rounded-xl border border-border">
                <div className="flex items-center gap-2 mb-6">
                  <Layout className="h-5 w-5 text-primary" />
                  <h3 className="text-2xl font-semibold">System Architecture</h3>
                </div>

                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    components={{
                      h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-5 mb-3" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
                      p: ({ node, ...props }) => <p className="mb-4" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4" {...props} />,
                      li: ({ node, ordered, ...props }: any) => {
                        // Convert boolean to string or remove attribute if undefined
                        const listItemProps = ordered !== undefined ? { ordered: ordered.toString() } : {}
                        return <li className="mb-1" {...listItemProps} {...props} />
                      },
                      a: ({ node, ...props }) => <a className="text-primary hover:underline" {...props} />,
                      code: ({ node, inline, ...props }) =>
                        inline ? (
                          <code className="bg-muted px-1 py-0.5 rounded text-sm" {...props} />
                        ) : (
                          <code className="block bg-muted p-3 rounded-md text-sm overflow-x-auto my-4" {...props} />
                        ),
                      pre: ({ node, ...props }) => (
                        <pre className="bg-muted p-3 rounded-md overflow-x-auto my-4" {...props} />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-primary/30 pl-4 italic my-4" {...props} />
                      ),
                      table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-4">
                          <table className="min-w-full divide-y divide-border" {...props} />
                        </div>
                      ),
                      th: ({ node, ...props }) => (
                        <th className="px-3 py-2 text-left font-medium bg-muted" {...props} />
                      ),
                      td: ({ node, ...props }) => <td className="px-3 py-2 border-t border-border" {...props} />,
                    }}
                  >
                    {project.system_design}
                  </ReactMarkdown>
                </div>

                {project.system_design_image && (
                  <div className="bg-muted/50 p-6 rounded-lg mt-8">
                    <div className="flex justify-center">
                      <div className="max-w-2xl">
                        <Image
                          src={project.system_design_image || "/placeholder.svg?height=400&width=800"}
                          alt="System Architecture Diagram"
                          width={800}
                          height={400}
                          className="w-full h-auto object-contain"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          )}

          {project.database_design && (
            <TabsContent value="database">
              <div className="bg-muted/30 p-6 rounded-xl border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Database className="h-5 w-5 text-primary" />
                  <h3 className="text-2xl font-semibold">Database Design</h3>
                </div>

                <div className="prose prose-gray dark:prose-invert max-w-none mb-6">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    components={{
                      h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-5 mb-3" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
                      p: ({ node, ...props }) => <p className="mb-4" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4" {...props} />,
                      li: ({ node, ordered, ...props }: any) => {
                        // Convert boolean to string or remove attribute if undefined
                        const listItemProps = ordered !== undefined ? { ordered: ordered.toString() } : {}
                        return <li className="mb-1" {...listItemProps} {...props} />
                      },
                      a: ({ node, ...props }) => <a className="text-primary hover:underline" {...props} />,
                      code: ({ node, inline, ...props }) =>
                        inline ? (
                          <code className="bg-muted px-1 py-0.5 rounded text-sm" {...props} />
                        ) : (
                          <code className="block bg-muted p-3 rounded-md text-sm overflow-x-auto my-4" {...props} />
                        ),
                      pre: ({ node, ...props }) => (
                        <pre className="bg-muted p-3 rounded-md overflow-x-auto my-4" {...props} />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-primary/30 pl-4 italic my-4" {...props} />
                      ),
                      table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-4">
                          <table className="min-w-full divide-y divide-border" {...props} />
                        </div>
                      ),
                      th: ({ node, ...props }) => (
                        <th className="px-3 py-2 text-left font-medium bg-muted" {...props} />
                      ),
                      td: ({ node, ...props }) => <td className="px-3 py-2 border-t border-border" {...props} />,
                    }}
                  >
                    {project.database_design}
                  </ReactMarkdown>
                </div>

                {project.database_design_image && (
                  <div className="bg-muted/50 p-6 rounded-lg">
                    <div className="flex justify-center">
                      <div className="max-w-2xl">
                        <Image
                          src={project.database_design_image || "/placeholder.svg?height=400&width=800"}
                          alt="Database Schema Diagram"
                          width={800}
                          height={400}
                          className="w-full h-auto object-contain"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}
