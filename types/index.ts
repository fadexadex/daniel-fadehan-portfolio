export type Project = {
  id: number
  title: string
  description: string
  long_description?: string
  image: string
  category: "personal" | "hackathon"
  position?: string // For hackathons, the position achieved
  tags: string[]
  github?: string
  demo?: string // Optional
  features: string[]
  challenges: string[]
  overview: string
  system_design?: string
  database_design?: string
  system_design_image?: string // URL to system design diagram
  database_design_image?: string // URL to database design diagram
  project_date?: string // When the project was created/completed
  team_size?: number // Number of team members (especially for hackathons)
  team_members?: string[] // Names of team members (for hackathons)
  duration?: string // How long the project took (e.g., "48 hours", "3 months")
  is_published: boolean
  created_at?: string
  updated_at?: string
}

export type Experience = {
  id: number
  company: string
  position: string
  logo?: string
  period: string
  location: string
  description: string[]
  skills: string[]
  start_date: string
  end_date?: string
  highlights?: string[]
  projects?: string[]
  technologies?: string[]
  industry?: string
  department?: string
  responsibilities?: string[]
  url?: string
  team_size?: number
  achievements?: {
    title: string
    description: string
  }[]
  recommendations?: {
    name: string
    position: string
    text: string
  }[]
  certifications?: {
    name: string
    issuer: string
    date: string
    url?: string
  }[]
  is_published: boolean
  created_at?: string
  updated_at?: string
}

export type AdminUser = {
  id: string
  email: string
  name?: string
  role: string
  created_at?: string
  updated_at?: string
}
