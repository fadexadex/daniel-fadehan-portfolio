"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getClientSupabaseClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { X, Plus, Loader2, Upload, Eye, Code, Database, Layout } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"

type ProjectFormProps = {
  project: any | null
  onClose: (refreshData?: boolean) => void
}

export default function ProjectForm({ project, onClose }: ProjectFormProps) {
  const isEditing = !!project
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    long_description: "",
    image: "",
    category: "personal",
    position: "",
    tags: [] as string[],
    github: "",
    demo: "",
    features: [] as string[],
    challenges: [] as string[],
    overview: "",
    system_design: "",
    database_design: "",
    system_design_image: "",
    database_design_image: "",
    additional_details: "",
    project_date: "",
    team_size: 0,
    team_members: [] as string[],
    duration: "",
    is_published: false,
  })

  const [loading, setLoading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [systemImageUploading, setSystemImageUploading] = useState(false)
  const [databaseImageUploading, setDatabaseImageUploading] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [newFeature, setNewFeature] = useState("")
  const [newChallenge, setNewChallenge] = useState("")
  const [newTeamMember, setNewTeamMember] = useState("")
  const [previewMode, setPreviewMode] = useState(false)
  const [activeTab, setActiveTab] = useState("edit")
  const [markdownTab, setMarkdownTab] = useState("system_design")
  const [previewTab, setPreviewTab] = useState("system_design")

  const supabase = getClientSupabaseClient()
  const { toast } = useToast()

  useEffect(() => {
    if (project) {
      // Convert arrays from database format if needed
      setFormData({
        ...project,
        tags: Array.isArray(project.tags) ? project.tags : [],
        features: Array.isArray(project.features) ? project.features : [],
        challenges: Array.isArray(project.challenges) ? project.challenges : [],
        team_members: Array.isArray(project.team_members) ? project.team_members : [],
        project_date: project.project_date ? new Date(project.project_date).toISOString().split("T")[0] : "",
        team_size: project.team_size || 0,
      })
    }
  }, [project])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
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

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const handleAddFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }))
      setNewFeature("")
    }
  }

  const handleRemoveFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== feature),
    }))
  }

  const handleAddChallenge = () => {
    if (newChallenge.trim() && !formData.challenges.includes(newChallenge.trim())) {
      setFormData((prev) => ({
        ...prev,
        challenges: [...prev.challenges, newChallenge.trim()],
      }))
      setNewChallenge("")
    }
  }

  const handleRemoveChallenge = (challenge: string) => {
    setFormData((prev) => ({
      ...prev,
      challenges: prev.challenges.filter((c) => c !== challenge),
    }))
  }

  const handleAddTeamMember = () => {
    if (newTeamMember.trim() && !formData.team_members.includes(newTeamMember.trim())) {
      setFormData((prev) => ({
        ...prev,
        team_members: [...prev.team_members, newTeamMember.trim()],
      }))
      setNewTeamMember("")
    }
  }

  const handleRemoveTeamMember = (member: string) => {
    setFormData((prev) => ({
      ...prev,
      team_members: prev.team_members.filter((m) => m !== member),
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    let uploadingStateSetter
    switch (field) {
      case "image":
        uploadingStateSetter = setImageUploading
        break
      case "system_design_image":
        uploadingStateSetter = setSystemImageUploading
        break
      case "database_design_image":
        uploadingStateSetter = setDatabaseImageUploading
        break
      default:
        return
    }

    uploadingStateSetter(true)

    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `projects/${fileName}`

      const { error: uploadError, data } = await supabase.storage.from("portfolio").upload(filePath, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("portfolio").getPublicUrl(filePath)

      setFormData((prev) => ({ ...prev, [field]: publicUrl }))

      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      uploadingStateSetter(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.image || !formData.github) {
        throw new Error("Please fill in all required fields")
      }

      if (formData.features.length === 0) {
        throw new Error("Please add at least one feature")
      }

      if (formData.challenges.length === 0) {
        throw new Error("Please add at least one challenge")
      }

      if (!formData.overview) {
        throw new Error("Please provide a project overview")
      }

      const projectData = {
        ...formData,
        // Convert empty strings to null for optional fields
        position: formData.position || null,
        demo: formData.demo || null,
        system_design: formData.system_design || null,
        database_design: formData.database_design || null,
        system_design_image: formData.system_design_image || null,
        database_design_image: formData.database_design_image || null,
        additional_details: formData.additional_details || null,
        project_date: formData.project_date || null,
        team_size: formData.team_size || null,
        team_members: formData.team_members.length > 0 ? formData.team_members : null,
        duration: formData.duration || null,
      }

      if (isEditing) {
        const { error } = await supabase.from("projects").update(projectData).eq("id", project.id)

        if (error) throw error

        toast({
          title: "Project updated",
          description: "Your project has been updated successfully.",
        })
      } else {
        const { error } = await supabase.from("projects").insert([projectData])

        if (error) throw error

        toast({
          title: "Project created",
          description: "Your project has been created successfully.",
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

  // Custom components for markdown rendering
  const markdownComponents = {
    h1: ({ node, ...props }: any) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
    h2: ({ node, ...props }: any) => <h2 className="text-xl font-bold mt-5 mb-3" {...props} />,
    h3: ({ node, ...props }: any) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
    p: ({ node, ...props }: any) => <p className="mb-4" {...props} />,
    ul: ({ node, ...props }: any) => <ul className="list-disc pl-6 mb-4" {...props} />,
    ol: ({ node, ...props }: any) => <ol className="list-decimal pl-6 mb-4" {...props} />,
    li: ({ node, ordered, ...props }: any) => {
      // Convert boolean to string or remove attribute if undefined
      const listItemProps = ordered !== undefined ? { ordered: ordered.toString() } : {}
      return <li className="mb-1" {...listItemProps} {...props} />
    },
    a: ({ node, ...props }: any) => <a className="text-primary hover:underline" {...props} />,
    code: ({ node, inline, ...props }: any) =>
      inline ? (
        <code className="bg-muted px-1 py-0.5 rounded text-sm" {...props} />
      ) : (
        <code className="block bg-muted p-3 rounded-md text-sm overflow-x-auto my-4" {...props} />
      ),
    pre: ({ node, ...props }: any) => <pre className="bg-muted p-3 rounded-md overflow-x-auto my-4" {...props} />,
    blockquote: ({ node, ...props }: any) => (
      <blockquote className="border-l-4 border-primary/30 pl-4 italic my-4" {...props} />
    ),
    table: ({ node, ...props }: any) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full divide-y divide-border" {...props} />
      </div>
    ),
    th: ({ node, ...props }: any) => <th className="px-3 py-2 text-left font-medium bg-muted" {...props} />,
    td: ({ node, ...props }: any) => <td className="px-3 py-2 border-t border-border" {...props} />,
  }

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Project" : "Add New Project"}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="edit" className="w-full" value={activeTab} onValueChange={setActiveTab}>
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
                    <Label htmlFor="title">Title *</Label>
                    <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
                  </div>

                  <div>
                    <Label htmlFor="description">Short Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="hackathon">Hackathon</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.category === "hackathon" && (
                    <div>
                      <Label htmlFor="position">Position (e.g., "1st Place")</Label>
                      <Input id="position" name="position" value={formData.position} onChange={handleChange} />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="github">GitHub URL *</Label>
                    <Input id="github" name="github" value={formData.github} onChange={handleChange} required />
                  </div>

                  <div>
                    <Label htmlFor="demo">Demo URL</Label>
                    <Input id="demo" name="demo" value={formData.demo} onChange={handleChange} />
                  </div>

                  <div>
                    <Label htmlFor="project_date">Project Date</Label>
                    <Input
                      id="project_date"
                      name="project_date"
                      type="date"
                      value={formData.project_date}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="duration">Duration (e.g., "3 months")</Label>
                    <Input id="duration" name="duration" value={formData.duration} onChange={handleChange} />
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
                        Make this project visible on the portfolio
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Main Image *</Label>
                    <div className="mt-2">
                      {formData.image && (
                        <div className="mb-2">
                          <img
                            src={formData.image || "/placeholder.svg"}
                            alt="Project"
                            className="h-40 w-full object-cover rounded-md"
                          />
                        </div>
                      )}
                      <Label
                        htmlFor="image-upload"
                        className="flex items-center justify-center w-full h-12 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        {imageUploading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <>
                            <Upload className="h-5 w-5 mr-2" />
                            <span>{formData.image ? "Change Image" : "Upload Image"}</span>
                          </>
                        )}
                      </Label>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, "image")}
                        disabled={imageUploading}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Tags *</Label>
                    <div className="flex flex-wrap gap-2 mt-2 mb-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddTag()
                          }
                        }}
                      />
                      <Button type="button" size="sm" onClick={handleAddTag}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {formData.category === "hackathon" && (
                    <>
                      <div>
                        <Label htmlFor="team_size">Team Size</Label>
                        <Input
                          id="team_size"
                          name="team_size"
                          type="number"
                          min="1"
                          value={formData.team_size}
                          onChange={handleNumberChange}
                        />
                      </div>

                      <div>
                        <Label>Team Members</Label>
                        <div className="flex flex-wrap gap-2 mt-2 mb-2">
                          {formData.team_members.map((member) => (
                            <Badge key={member} variant="outline" className="flex items-center gap-1">
                              {member}
                              <button
                                type="button"
                                onClick={() => handleRemoveTeamMember(member)}
                                className="ml-1 text-muted-foreground hover:text-foreground"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            value={newTeamMember}
                            onChange={(e) => setNewTeamMember(e.target.value)}
                            placeholder="Add a team member"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                handleAddTeamMember()
                              }
                            }}
                          />
                          <Button type="button" size="sm" onClick={handleAddTeamMember}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="overview">Project Overview *</Label>
                  <Textarea
                    id="overview"
                    name="overview"
                    value={formData.overview}
                    onChange={handleChange}
                    required
                    rows={5}
                  />
                </div>

                <div>
                  <Label>Features *</Label>
                  <div className="space-y-2 mt-2 mb-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                        <span>{feature}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(feature)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a feature"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddFeature()
                        }
                      }}
                    />
                    <Button type="button" size="sm" onClick={handleAddFeature}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Challenges *</Label>
                  <div className="space-y-2 mt-2 mb-2">
                    {formData.challenges.map((challenge, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                        <span>{challenge}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveChallenge(challenge)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newChallenge}
                      onChange={(e) => setNewChallenge(e.target.value)}
                      placeholder="Add a challenge"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddChallenge()
                        }
                      }}
                    />
                    <Button type="button" size="sm" onClick={handleAddChallenge}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* System Design Markdown Editor */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <Code className="h-5 w-5 text-primary" />
                      <Label className="text-lg font-medium">System Design</Label>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => {
                        setPreviewTab("system_design")
                        setActiveTab("preview")
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" /> Preview
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Edit System Design</Label>
                      <div className="text-xs text-muted-foreground">Markdown supported</div>
                    </div>
                    <Textarea
                      id="system_design"
                      name="system_design"
                      value={formData.system_design}
                      onChange={handleChange}
                      rows={10}
                      className="font-mono text-sm"
                      placeholder={
                        "# System Architecture\n\nDescribe your system architecture here...\n\n## Front-end\n- Component 1\n- Component 2\n\n## Back-end\n- API Layer\n- Database Layer"
                      }
                    />
                  </div>

                  <div className="mt-4">
                    <Label>System Design Image</Label>
                    <div className="mt-2">
                      {formData.system_design_image && (
                        <div className="mb-2">
                          <img
                            src={formData.system_design_image || "/placeholder.svg"}
                            alt="System Design"
                            className="h-40 w-full object-cover rounded-md"
                          />
                        </div>
                      )}
                      <Label
                        htmlFor="system-design-image-upload"
                        className="flex items-center justify-center w-full h-12 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        {systemImageUploading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <>
                            <Upload className="h-5 w-5 mr-2" />
                            <span>
                              {formData.system_design_image
                                ? "Change System Design Image"
                                : "Upload System Design Image"}
                            </span>
                          </>
                        )}
                      </Label>
                      <Input
                        id="system-design-image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, "system_design_image")}
                        disabled={systemImageUploading}
                      />
                    </div>
                  </div>
                </div>

                {/* Database Design Markdown Editor - Completely Separate */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-primary" />
                      <Label className="text-lg font-medium">Database Design</Label>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => {
                        setPreviewTab("database_design")
                        setActiveTab("preview")
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" /> Preview
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Edit Database Design</Label>
                      <div className="text-xs text-muted-foreground">Markdown supported</div>
                    </div>
                    <Textarea
                      id="database_design"
                      name="database_design"
                      value={formData.database_design}
                      onChange={handleChange}
                      rows={10}
                      className="font-mono text-sm"
                      placeholder={
                        "# Database Schema\n\nDescribe your database schema here...\n\n## Tables\n- Users\n- Products\n- Orders"
                      }
                    />
                  </div>

                  <div className="mt-4">
                    <Label>Database Design Image</Label>
                    <div className="mt-2">
                      {formData.database_design_image && (
                        <div className="mb-2">
                          <img
                            src={formData.database_design_image || "/placeholder.svg"}
                            alt="Database Design"
                            className="h-40 w-full object-cover rounded-md"
                          />
                        </div>
                      )}
                      <Label
                        htmlFor="database-design-image-upload"
                        className="flex items-center justify-center w-full h-12 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        {databaseImageUploading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <>
                            <Upload className="h-5 w-5 mr-2" />
                            <span>
                              {formData.database_design_image
                                ? "Change Database Design Image"
                                : "Upload Database Design Image"}
                            </span>
                          </>
                        )}
                      </Label>
                      <Input
                        id="database-design-image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, "database_design_image")}
                        disabled={databaseImageUploading}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="additional_details">Additional Details</Label>
                  <Textarea
                    id="additional_details"
                    name="additional_details"
                    value={formData.additional_details}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6 py-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Preview</h3>
              <Tabs value={previewTab} onValueChange={setPreviewTab} className="w-auto">
                <TabsList>
                  <TabsTrigger value="full" className="text-sm">
                    Full Preview
                  </TabsTrigger>
                  <TabsTrigger value="system_design" className="text-sm">
                    System Design
                  </TabsTrigger>
                  <TabsTrigger value="database_design" className="text-sm">
                    Database Design
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {previewTab === "full" && (
              <div className="border rounded-lg p-6 space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">{formData.title || "Project Title"}</h2>
                  <p className="text-muted-foreground">{formData.description || "Project description"}</p>

                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {formData.image && (
                    <div className="mt-4">
                      <img
                        src={formData.image || "/placeholder.svg"}
                        alt={formData.title}
                        className="w-full h-auto max-h-[400px] rounded-lg object-cover"
                      />
                    </div>
                  )}

                  <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-2">Overview</h3>
                    <p className="whitespace-pre-line">{formData.overview || "Project overview"}</p>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-2">Features</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {formData.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-2">Challenges</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {formData.challenges.map((challenge, index) => (
                        <li key={index}>{challenge}</li>
                      ))}
                    </ul>
                  </div>

                  {formData.system_design && (
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold mb-2">System Design</h3>
                      <div className="prose prose-gray dark:prose-invert max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw, rehypeSanitize]}
                          components={markdownComponents}
                        >
                          {formData.system_design}
                        </ReactMarkdown>
                      </div>
                      {formData.system_design_image && (
                        <img
                          src={formData.system_design_image || "/placeholder.svg"}
                          alt="System Design"
                          className="mt-4 w-full h-auto max-h-[400px] rounded-lg object-contain"
                        />
                      )}
                    </div>
                  )}

                  {formData.database_design && (
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold mb-2">Database Design</h3>
                      <div className="prose prose-gray dark:prose-invert max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw, rehypeSanitize]}
                          components={markdownComponents}
                        >
                          {formData.database_design}
                        </ReactMarkdown>
                      </div>
                      {formData.database_design_image && (
                        <img
                          src={formData.database_design_image || "/placeholder.svg"}
                          alt="Database Design"
                          className="mt-4 w-full h-auto max-h-[400px] rounded-lg object-contain"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {previewTab === "system_design" && (
              <div className="border rounded-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Layout className="h-5 w-5 text-primary" />
                  <h3 className="text-2xl font-semibold">System Architecture</h3>
                </div>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    components={markdownComponents}
                  >
                    {formData.system_design}
                  </ReactMarkdown>
                </div>
                {formData.system_design_image && (
                  <div className="bg-muted/50 p-6 rounded-lg mt-8">
                    <img
                      src={formData.system_design_image || "/placeholder.svg"}
                      alt="System Architecture Diagram"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                )}
              </div>
            )}

            {previewTab === "database_design" && (
              <div className="border rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Database className="h-5 w-5 text-primary" />
                  <h3 className="text-2xl font-semibold">Database Design</h3>
                </div>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    components={markdownComponents}
                  >
                    {formData.database_design}
                  </ReactMarkdown>
                </div>
                {formData.database_design_image && (
                  <div className="bg-muted/50 p-6 rounded-lg mt-8">
                    <img
                      src={formData.database_design_image || "/placeholder.svg"}
                      alt="Database Schema Diagram"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onClose()} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Update Project" : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
