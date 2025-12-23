/**
 * Utility functions to parse txt files and extract project information
 */

export interface ParsedProjectData {
  title: string
  description: string
  long_description: string
  tags: string[]
  github: string
  demo: string
  features: string[]
  challenges: string[]
  overview: string
  system_design: string
  additional_details: string
  techStack: {
    frontend: string
    backend: string
    deployment: string
    other?: string
  }
}

/**
 * Extract project name from file content or filename
 */
function extractProjectName(content: string, filename: string): string {
  // Try to find project name in package.json "name" field
  const packageJsonMatch = content.match(/"name"\s*:\s*["']([^"']+)["']/i)
  if (packageJsonMatch) {
    const name = packageJsonMatch[1].trim()
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  // Try to find project name in README title
  const readmeMatch = content.match(/#\s+([^\n]+)/)
  if (readmeMatch) {
    const name = readmeMatch[1].trim()
    if (name.length < 50) return name
  }

  // Extract from filename (e.g., "campor-backend.txt" -> "Campor")
  const filenameMatch = filename.match(/([^-]+)/)
  if (filenameMatch) {
    const name = filenameMatch[1]
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  return "Untitled Project"
}

/**
 * Extract GitHub URL from content
 */
function extractGitHubUrl(content: string): string {
  const githubMatch = content.match(/github\.com[\/:]([^\s\)]+)/i)
  if (githubMatch) {
    return `https://github.com/${githubMatch[1].replace(/\.git$/, "")}`
  }
  return ""
}

/**
 * Extract technologies from package.json dependencies
 */
function extractTechnologies(content: string): string[] {
  const techs: Set<string> = new Set()

  // Extract from package.json dependencies
  const depsMatch = content.match(/"dependencies"\s*:\s*\{([^}]+)\}/s)
  const devDepsMatch = content.match(/"devDependencies"\s*:\s*\{([^}]+)\}/s)

  const extractFromDeps = (depsContent: string) => {
    // Common tech patterns - extract key names
    const depMatches = depsContent.match(/"([^"]+)":\s*"[^"]+"/g)
    if (depMatches) {
      depMatches.forEach((match) => {
        const depMatch = match.match(/"([^"]+)":/)
        if (depMatch) {
          const dep = depMatch[1]
          // Skip scoped packages prefix
          const cleanDep = dep.replace(/^@[^/]+\//, "")
          // Format nicely
          const formatted = cleanDep
            .split(/[-_]/)
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ")
          if (formatted.length > 0 && formatted.length < 30) {
            techs.add(formatted)
          }
        }
      })
    }
  }

  if (depsMatch) extractFromDeps(depsMatch[1])
  if (devDepsMatch) extractFromDeps(devDepsMatch[1])

  // Also look for explicit mentions in README
  const readmeTechs = content.match(/(?:tech|stack|built with|technologies?)[\s:]+([^\n]+)/i)
  if (readmeTechs) {
    readmeTechs[1]
      .split(/[,&|]/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0 && t.length < 30)
      .forEach((t) => techs.add(t))
  }

  return Array.from(techs).slice(0, 30) // Limit to 30 technologies
}

/**
 * Extract features from README or content
 */
function extractFeatures(content: string): string[] {
  const features: string[] = []

  // Look for features section in README
  const featuresMatch = content.match(/##?\s*features?[\s\S]*?(?=##|$)/i)
  if (featuresMatch) {
    const featureLines = featuresMatch[0].match(/[-*]\s*(.+)/g)
    if (featureLines) {
      featureLines.forEach((line) => {
        const feature = line.replace(/[-*]\s*/, "").trim()
        if (feature.length > 10 && feature.length < 200) features.push(feature)
      })
    }
  }

  // Also look for "Core Features" section
  const coreFeaturesMatch = content.match(/##?\s*core features?[\s\S]*?(?=##|$)/i)
  if (coreFeaturesMatch) {
    const featureLines = coreFeaturesMatch[0].match(/[-*]\s*(.+)/g)
    if (featureLines) {
      featureLines.forEach((line) => {
        const feature = line.replace(/[-*]\s*/, "").trim()
        if (feature.length > 10 && feature.length < 200 && !features.includes(feature)) {
          features.push(feature)
        }
      })
    }
  }

  return features.slice(0, 20) // Limit to 20 features
}

/**
 * Extract description from README
 */
function extractDescription(content: string): string {
  // Look for "Overview" section
  const overviewMatch = content.match(/##?\s*overview[\s\S]*?\n+([^\n#]+)/i)
  if (overviewMatch) {
    const desc = overviewMatch[1].trim()
    if (desc.length > 20) return desc.substring(0, 300)
  }

  // Look for description after title
  const descMatch = content.match(/#\s+[^\n]+\n+([^\n#]+)/i)
  if (descMatch) {
    const desc = descMatch[1].trim()
    if (desc.length > 20) return desc.substring(0, 300)
  }

  // Fallback: first paragraph after title
  const paraMatch = content.match(/#\s+[^\n]+\n+\n+([^\n]+)/i)
  if (paraMatch) {
    const desc = paraMatch[1].trim()
    if (desc.length > 20) return desc.substring(0, 300)
  }

  return ""
}

/**
 * Generate system design from file structure and tech stack
 */
function generateSystemDesign(backendContent: string, frontendContent: string): string {
  const backendTechs = extractTechnologies(backendContent)
  const frontendTechs = extractTechnologies(frontendContent)

  let design = "## Architecture Overview\n\n"
  design += "This project uses a modern full-stack architecture with clear separation between frontend and backend.\n\n"

  if (frontendTechs.length > 0) {
    design += "### Frontend Architecture\n\n"
    design += `The frontend is built using ${frontendTechs.slice(0, 3).join(", ")}.\n\n`
    design += "- **Key Technologies**: " + frontendTechs.slice(0, 5).join(", ") + "\n"
    design += "- **State Management**: Context API or similar\n"
    design += "- **Styling**: Tailwind CSS or similar\n\n"
  }

  if (backendTechs.length > 0) {
    design += "### Backend Architecture\n\n"
    design += `The backend is built using ${backendTechs.slice(0, 3).join(", ")}.\n\n`
    design += "- **Framework**: Express.js or similar\n"
    design += "- **Database**: PostgreSQL or similar\n"
    design += "- **Key Technologies**: " + backendTechs.slice(0, 5).join(", ") + "\n\n"
  }

  design += "### Deployment\n\n"
  design += "- Frontend deployed on Vercel or similar platform\n"
  design += "- Backend deployed on cloud platform (Azure, AWS, etc.)\n"
  design += "- Database hosted on managed service\n"

  return design
}

/**
 * Parse backend and frontend txt files to extract project information
 */
export function parseProjectFiles(
  backendContent: string,
  frontendContent: string,
  backendFilename: string = "backend.txt",
  frontendFilename: string = "frontend.txt"
): ParsedProjectData {
  const combinedContent = backendContent + "\n\n" + frontendContent
  const projectName = extractProjectName(combinedContent, backendFilename)

  const tags = [
    ...extractTechnologies(backendContent),
    ...extractTechnologies(frontendContent),
  ].filter((tag, index, self) => self.indexOf(tag) === index) // Remove duplicates

  const github = extractGitHubUrl(combinedContent)
  const description = extractDescription(combinedContent)
  const features = extractFeatures(combinedContent)

  // Generate long description
  const longDescription = `${
    projectName
  } is a full-stack application that combines modern frontend and backend technologies to deliver a comprehensive solution. ${description}`

  // Generate overview
  const overview = `${projectName} leverages cutting-edge technologies to provide a robust and scalable solution.`

  // Generate system design
  const systemDesign = generateSystemDesign(backendContent, frontendContent)

  // Generate additional details
  const additionalDetails = `This project demonstrates proficiency in full-stack development, combining ${tags.slice(0, 5).join(", ")} and other modern technologies to create a production-ready application.`

  return {
    title: projectName,
    description: description || `${projectName} - A modern full-stack application`,
    long_description: longDescription,
    tags: tags.slice(0, 20), // Limit to 20 tags
    github: github,
    demo: "",
    features: features.length > 0 ? features : [`Built with ${tags.slice(0, 3).join(", ")}`],
    challenges: [
      "Integrating multiple third-party services and APIs",
      "Ensuring data consistency across distributed systems",
      "Optimizing performance for real-time features",
      "Implementing secure authentication and authorization",
      "Managing complex state across frontend and backend",
    ],
    overview: overview,
    system_design: systemDesign,
    additional_details: additionalDetails,
    techStack: {
      frontend: extractTechnologies(frontendContent).slice(0, 10).join(", "),
      backend: extractTechnologies(backendContent).slice(0, 10).join(", "),
      deployment: "Vercel (Frontend), Cloud Platform (Backend)",
      other: "Various third-party integrations",
    },
  }
}

/**
 * Convert parsed data to database format matching the projects table schema
 */
export function convertToDatabaseFormat(
  parsed: ParsedProjectData,
  overrides: Partial<ParsedProjectData & { category: string; position?: string; image?: string }> = {}
): any {
  return {
    title: overrides.title || parsed.title,
    description: overrides.description || parsed.description,
    long_description: overrides.long_description || parsed.long_description,
    image: overrides.image || "",
    category: overrides.category || "personal",
    position: overrides.position || null,
    github: overrides.github || parsed.github,
    demo: overrides.demo || parsed.demo || null,
    overview: overrides.overview || parsed.overview,
    system_design: overrides.system_design || parsed.system_design,
    database_design: null,
    system_design_image: null,
    database_design_image: null,
    additional_details: overrides.additional_details || parsed.additional_details,
    project_date: null,
    team_size: null,
    duration: null,
    tags: parsed.tags,
    features: parsed.features,
    challenges: parsed.challenges,
    team_members: [],
    is_published: false,
  }
}

