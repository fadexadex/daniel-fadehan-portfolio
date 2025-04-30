"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getClientSupabaseClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { X, Plus, Loader2, Upload } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ExperienceFormProps = {
  experience: any | null
  onClose: (refreshData?: boolean) => void
}

export default function ExperienceForm({ experience, onClose }: ExperienceFormProps) {
  const isEditing = !!experience
  const [formData, setFormData] = useState({
    company: "",
    logo: "",
    position: "",
    period: "",
    location: "",
    description: [] as string[],
    skills: [] as string[],
    url: "",
    start_date: "",
    end_date: "",
    highlights: [] as string[],
    projects: [] as string[],
    technologies: [] as string[],
    team_size: 0,
    industry: "",
    department: "",
    responsibilities: [] as string[],
    achievements: [] as { description: string; metrics?: string }[],
    recommendations: [] as { text: string; author: string; position: string }[],
    certifications: [] as { name: string; issuer: string; date: string; url?: string }[],
    is_published: false,
  })

  const [loading, setLoading] = useState(false)
  const [logoUploading, setLogoUploading] = useState(false)
  const [newDescription, setNewDescription] = useState("")
  const [newSkill, setNewSkill] = useState("")
  const [newHighlight, setNewHighlight] = useState("")
  const [newProject, setNewProject] = useState("")
  const [newTechnology, setNewTechnology] = useState("")
  const [newResponsibility, setNewResponsibility] = useState("")
  const [previewMode, setPreviewMode] = useState(false)

  const supabase = getClientSupabaseClient()
  const { toast } = useToast()

  useEffect(() => {
    if (experience) {
      // Convert arrays and JSON from database format if needed
      setFormData({
        ...experience,
        description: Array.isArray(experience.description) ? experience.description : [],
        skills: Array.isArray(experience.skills) ? experience.skills : [],
        highlights: Array.isArray(experience.highlights) ? experience.highlights : [],
        projects: Array.isArray(experience.projects) ? experience.projects : [],
        technologies: Array.isArray(experience.technologies) ? experience.technologies : [],
        responsibilities: Array.isArray(experience.responsibilities) ? experience.responsibilities : [],
        achievements: experience.achievements ? experience.achievements : [],
        recommendations: experience.recommendations ? experience.recommendations : [],
        certifications: experience.certifications ? experience.certifications : [],
        start_date: experience.start_date ? new Date(experience.start_date).toISOString().split("T")[0] : "",
        team_size: experience.team_size || 0,
      })
    }
  }, [experience])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number.parseInt(value) || 0 }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleAddDescription = () => {
    if (newDescription.trim() && !formData.description.includes(newDescription.trim())) {
      setFormData((prev) => ({
        ...prev,
        description: [...prev.description, newDescription.trim()],
      }))
      setNewDescription("")
    }
  }

  const handleRemoveDescription = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      description: prev.description.filter((d) => d !== item),
    }))
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }))
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  const handleAddHighlight = () => {
    if (newHighlight.trim() && !formData.highlights.includes(newHighlight.trim())) {
      setFormData((prev) => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()],
      }))
      setNewHighlight("")
    }
  }

  const handleRemoveHighlight = (highlight: string) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((h) => h !== highlight),
    }))
  }

  const handleAddProject = () => {
    if (newProject.trim() && !formData.projects.includes(newProject.trim())) {
      setFormData((prev) => ({
        ...prev,
        projects: [...prev.projects, newProject.trim()],
      }))
      setNewProject("")
    }
  }

  const handleRemoveProject = (project: string) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p !== project),
    }))
  }

  const handleAddTechnology = () => {
    if (newTechnology.trim() && !formData.technologies.includes(newTechnology.trim())) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()],
      }))
      setNewTechnology("")
    }
  }

  const handleRemoveTechnology = (technology: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== technology),
    }))
  }

  const handleAddResponsibility = () => {
    if (newResponsibility.trim() && !formData.responsibilities.includes(newResponsibility.trim())) {
      setFormData((prev) => ({
        ...prev,
        responsibilities: [...prev.responsibilities, newResponsibility.trim()],
      }))
      setNewResponsibility("")
    }
  }

  const handleRemoveResponsibility = (responsibility: string) => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((r) => r !== responsibility),
    }))
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLogoUploading(true)

    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `experiences/${fileName}`

      const { error: uploadError, data } = await supabase.storage.from("portfolio").upload(filePath, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("portfolio").getPublicUrl(filePath)

      setFormData((prev) => ({ ...prev, logo: publicUrl }))

      toast({
        title: "Logo uploaded",
        description: "Your logo has been uploaded successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLogoUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate required fields
      if (
        !formData.company ||
        !formData.position ||
        !formData.period ||
        !formData.logo ||
        !formData.start_date ||
        !formData.end_date
      ) {
        throw new Error("Please fill in all required fields")
      }

      if (formData.description.length === 0) {
        throw new Error("Please add at least one description item")
      }

      const experienceData = {
        ...formData,
        // Convert empty strings to null for optional fields
        location: formData.location || null,
        url: formData.url || null,
        skills: formData.skills.length > 0 ? formData.skills : null,
        highlights: formData.highlights.length > 0 ? formData.highlights : null,
        projects: formData.projects.length > 0 ? formData.projects : null,
        technologies: formData.technologies.length > 0 ? formData.technologies : null,
        team_size: formData.team_size || null,
        industry: formData.industry || null,
        department: formData.department || null,
        responsibilities: formData.responsibilities.length > 0 ? formData.responsibilities : null,
        achievements: formData.achievements.length > 0 ? formData.achievements : null,
        recommendations: formData.recommendations.length > 0 ? formData.recommendations : null,
        certifications: formData.certifications.length > 0 ? formData.certifications : null,
      }

      if (isEditing) {
        const { error } = await supabase.from("experiences").update(experienceData).eq("id", experience.id)

        if (error) throw error

        toast({
          title: "Experience updated",
          description: "Your experience has been updated successfully.",
        })
      } else {
        const { error } = await supabase.from("experiences").insert([experienceData])

        if (error) throw error

        toast({
          title: "Experience created",
          description: "Your experience has been created successfully.",
        })
      }

      onClose(true)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Experience" : "Add New Experience"}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit" onClick={() => setPreviewMode(false)}>
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" onClick={() => setPreviewMode(true)}>
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-6 py-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="company">Company *</Label>
                    <Input id="company" name="company" value={formData.company} onChange={handleChange} required />
                  </div>

                  <div>
                    <Label htmlFor="position">Position *</Label>
                    <Input id="position" name="position" value={formData.position} onChange={handleChange} required />
                  </div>

                  <div>
                    <Label htmlFor="period">Period (e.g., "2020 - 2022") *</Label>
                    <Input id="period" name="period" value={formData.period} onChange={handleChange} required />
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" value={formData.location} onChange={handleChange} />
                  </div>

                  <div>
                    <Label htmlFor="url">Company URL</Label>
                    <Input id="url" name="url" value={formData.url} onChange={handleChange} />
                  </div>

                  <div>
                    <Label htmlFor="start_date">Start Date *</Label>
                    <Input
                      id="start_date"
                      name="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="end_date">End Date (or "Present") *</Label>
                    <Input id="end_date" name="end_date" value={formData.end_date} onChange={handleChange} required />
                  </div>

                  <div>
                    <Label htmlFor="is_published">Published</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <input
                        type="checkbox"
                        id="is_published"
                        name="is_published"
                        checked={formData.is_published}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="is_published" className="text-sm font-normal">
                        Make this experience visible on the portfolio
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Company Logo *</Label>
                    <div className="mt-2">
                      {formData.logo && (
                        <div className="mb-2">
                          <img
                            src={formData.logo || "/placeholder.svg"}
                            alt="Company Logo"
                            className="h-20 w-20 object-contain rounded-md"
                          />
                        </div>
                      )}
                      <Label
                        htmlFor="logo-upload"
                        className="flex items-center justify-center w-full h-12 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        {logoUploading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <>
                            <Upload className="h-5 w-5 mr-2" />
                            <span>{formData.logo ? "Change Logo" : "Upload Logo"}</span>
                          </>
                        )}
                      </Label>
                      <Input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                        disabled={logoUploading}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Input id="industry" name="industry" value={formData.industry} onChange={handleChange} />
                  </div>

                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" name="department" value={formData.department} onChange={handleChange} />
                  </div>

                  <div>
                    <Label htmlFor="team_size">Team Size</Label>
                    <Input
                      id="team_size"
                      name="team_size"
                      type="number"
                      min="0"
                      value={formData.team_size}
                      onChange={handleNumberChange}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Description *</Label>
                  <div className="space-y-2 mt-2 mb-2">
                    {formData.description.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                        <span>{item}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDescription(item)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Add a description item"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddDescription()
                        }
                      }}
                    />
                    <Button type="button" size="sm" onClick={handleAddDescription}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Skills</Label>
                  <div className="flex flex-wrap gap-2 mt-2 mb-2">
                    {formData.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-1 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddSkill()
                        }
                      }}
                    />
                    <Button type="button" size="sm" onClick={handleAddSkill}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Highlights</Label>
                  <div className="space-y-2 mt-2 mb-2">
                    {formData.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                        <span>{highlight}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveHighlight(highlight)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newHighlight}
                      onChange={(e) => setNewHighlight(e.target.value)}
                      placeholder="Add a highlight"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddHighlight()
                        }
                      }}
                    />
                    <Button type="button" size="sm" onClick={handleAddHighlight}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Projects</Label>
                  <div className="flex flex-wrap gap-2 mt-2 mb-2">
                    {formData.projects.map((project) => (
                      <Badge key={project} variant="outline" className="flex items-center gap-1">
                        {project}
                        <button
                          type="button"
                          onClick={() => handleRemoveProject(project)}
                          className="ml-1 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newProject}
                      onChange={(e) => setNewProject(e.target.value)}
                      placeholder="Add a project"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddProject()
                        }
                      }}
                    />
                    <Button type="button" size="sm" onClick={handleAddProject}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Technologies</Label>
                  <div className="flex flex-wrap gap-2 mt-2 mb-2">
                    {formData.technologies.map((technology) => (
                      <Badge key={technology} variant="secondary" className="flex items-center gap-1">
                        {technology}
                        <button
                          type="button"
                          onClick={() => handleRemoveTechnology(technology)}
                          className="ml-1 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newTechnology}
                      onChange={(e) => setNewTechnology(e.target.value)}
                      placeholder="Add a technology"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddTechnology()
                        }
                      }}
                    />
                    <Button type="button" size="sm" onClick={handleAddTechnology}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Responsibilities</Label>
                  <div className="space-y-2 mt-2 mb-2">
                    {formData.responsibilities.map((responsibility, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                        <span>{responsibility}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveResponsibility(responsibility)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newResponsibility}
                      onChange={(e) => setNewResponsibility(e.target.value)}
                      placeholder="Add a responsibility"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddResponsibility()
                        }
                      }}
                    />
                    <Button type="button" size="sm" onClick={handleAddResponsibility}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6 py-4">
            <div className="border rounded-lg p-6 space-y-6">
              <div className="flex items-center gap-4">
                {formData.logo && (
                  <img
                    src={formData.logo || "/placeholder.svg"}
                    alt={formData.company}
                    className="w-16 h-16 object-contain rounded-md"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold">{formData.position || "Position Title"}</h2>
                  <p className="text-lg">{formData.company || "Company Name"}</p>
                  <p className="text-sm text-muted-foreground">{formData.period || "Period"}</p>
                </div>
              </div>

              {formData.location && <p className="text-sm text-muted-foreground">Location: {formData.location}</p>}

              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {formData.description.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              {formData.skills.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {formData.highlights.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Highlights</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {formData.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              )}

              {formData.projects.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Projects</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.projects.map((project) => (
                      <Badge key={project} variant="outline">
                        {project}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onClose()} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Update Experience" : "Create Experience"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
