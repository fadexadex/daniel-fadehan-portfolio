"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Upload, FileJson, CheckCircle2, Database, AlertCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { getSupabaseBrowser } from "@/lib/supabase-browser"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ProjectData {
  id?: number
  title: string
  description: string
  long_description?: string | null
  image: string
  category: "personal" | "hackathon"
  position?: string | null
  tags: string[] | string // Can be array or stringified array
  github: string
  demo?: string | null
  features: string[] | string // Can be array or stringified array
  challenges: string[] | string // Can be array or stringified array
  overview: string
  system_design?: string | null
  database_design?: string | null
  system_design_image?: string | null
  database_design_image?: string | null
  additional_details?: string | null
  project_date?: string | null
  team_size?: number | null
  team_members?: string[] | string | null // Can be array or stringified array
  duration?: string | null
  is_published?: boolean
  created_at?: string | null
  updated_at?: string | null
}

export default function ProjectGenerator() {
  const [jsonFile, setJsonFile] = useState<File | null>(null)
  const [projectData, setProjectData] = useState<ProjectData | null>(null)
  const [editableData, setEditableData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [inserting, setInserting] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const jsonInputRef = useRef<HTMLInputElement>(null)
  const supabase = getSupabaseBrowser()

  /**
   * Parse stringified arrays to actual arrays
   */
  const parseArrayField = (value: string | string[] | null | undefined): string[] => {
    if (!value) return []
    if (Array.isArray(value)) return value
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        // If it's not valid JSON, return empty array
        return []
      }
    }
    return []
  }

  /**
   * Convert project data to database format
   */
  const convertToDbFormat = (data: ProjectData): any => {
    return {
      title: data.title,
      description: data.description,
      long_description: data.long_description || null,
      image: data.image,
      category: data.category,
      position: data.position || null,
      github: data.github,
      demo: data.demo || null,
      overview: data.overview,
      system_design: data.system_design || null,
      database_design: data.database_design || null,
      system_design_image: data.system_design_image || null,
      database_design_image: data.database_design_image || null,
      additional_details: data.additional_details || null,
      project_date: data.project_date || null,
      team_size: data.team_size || null,
      duration: data.duration || null,
      tags: parseArrayField(data.tags),
      features: parseArrayField(data.features),
      challenges: parseArrayField(data.challenges),
      team_members: parseArrayField(data.team_members),
      is_published: data.is_published ?? false,
    }
  }

  /**
   * Validate project data structure
   */
  const validateProjectData = (data: any): { valid: boolean; error?: string } => {
    if (!data || typeof data !== "object") {
      return { valid: false, error: "Invalid JSON format" }
    }

    const requiredFields = ["title", "description", "image", "category", "github", "overview"]
    for (const field of requiredFields) {
      if (!data[field]) {
        return { valid: false, error: `Missing required field: ${field}` }
      }
    }

    if (!["personal", "hackathon"].includes(data.category)) {
      return { valid: false, error: "Category must be 'personal' or 'hackathon'" }
    }

    return { valid: true }
  }

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith(".json")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a .json file",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setValidationError(null)
    setProjectData(null)
    setEditableData(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const parsed = JSON.parse(content)

        // Handle array of projects (take first one)
        let project: ProjectData
        if (Array.isArray(parsed)) {
          if (parsed.length === 0) {
            throw new Error("JSON array is empty")
          }
          project = parsed[0]
        } else {
          project = parsed
        }

        // Validate the data
        const validation = validateProjectData(project)
        if (!validation.valid) {
          setValidationError(validation.error || "Invalid project data")
          toast({
            title: "Validation error",
            description: validation.error,
            variant: "destructive",
          })
          setLoading(false)
          return
        }

        setJsonFile(file)
        setProjectData(project)
        const dbFormat = convertToDbFormat(project)
        setEditableData(dbFormat)

        toast({
          title: "JSON file loaded successfully",
          description: "Review and edit the project data before inserting into database",
        })
      } catch (error: any) {
        setValidationError(error.message || "Failed to parse JSON")
        toast({
          title: "Error parsing JSON",
          description: error.message,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    reader.readAsText(file)
  }

  const handleInsert = async () => {
    if (!editableData) {
      toast({
        title: "No data to insert",
        description: "Please upload a JSON file first",
        variant: "destructive",
      })
      return
    }

    setInserting(true)
    try {
      // Ensure arrays are properly formatted
      const dataToInsert: any = {
        ...editableData,
        tags: Array.isArray(editableData.tags) ? editableData.tags : [],
        features: Array.isArray(editableData.features) ? editableData.features : [],
        challenges: Array.isArray(editableData.challenges) ? editableData.challenges : [],
        team_members: Array.isArray(editableData.team_members) ? editableData.team_members : [],
      }

      const { data, error } = await supabase.from("projects").insert([dataToInsert] as any).select()

      if (error) {
        console.error("Supabase error:", error)
        throw error
      }

      toast({
        title: "Project inserted successfully",
        description: `Project "${editableData.title}" has been added to the database`,
      })

      // Reset form
      setJsonFile(null)
      setProjectData(null)
      setEditableData(null)
      setValidationError(null)
      if (jsonInputRef.current) jsonInputRef.current.value = ""
    } catch (error: any) {
      console.error("Insert error:", error)
      toast({
        title: "Error inserting project",
        description: error.message || "Failed to insert project into database",
        variant: "destructive",
      })
    } finally {
      setInserting(false)
    }
  }

  const updateEditableField = (field: string, value: any) => {
    setEditableData((prev: any) => ({
      ...prev,
      [field]: value,
    }))
  }

  const updateArrayField = (field: string, value: string) => {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) {
        setEditableData((prev: any) => ({
          ...prev,
          [field]: parsed,
        }))
      } else {
        toast({
          title: "Invalid array format",
          description: "Please provide a valid JSON array",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Invalid JSON",
        description: "Please provide valid JSON array format",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Project JSON Uploader</h2>
        <p className="text-muted-foreground">
          Upload a JSON file following the project format. The JSON can be a single project object or an array
          containing one project.
        </p>
      </div>

      {/* JSON File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileJson className="h-5 w-5" />
            Project JSON File
          </CardTitle>
          <CardDescription>Upload a JSON file with project data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="json-file">Project .json file</Label>
            <Input
              id="json-file"
              type="file"
              accept=".json"
              ref={jsonInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileUpload(file)
              }}
              className="mt-2"
              disabled={loading}
            />
          </div>
          {jsonFile && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>{jsonFile.name}</span>
              <span className="text-xs">({(jsonFile.size / 1024).toFixed(1)} KB)</span>
            </div>
          )}
          {loading && (
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading and validating JSON...</span>
            </div>
          )}
          {validationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Project Data Preview/Edit */}
      {editableData && (
        <Card>
          <CardHeader>
            <CardTitle>Project Data</CardTitle>
            <CardDescription>Review and edit the project data before inserting into database</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="edit">Edit</TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <div className="grid gap-2">
                    <Label className="font-semibold">Title</Label>
                    <p className="text-sm">{editableData.title}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label className="font-semibold">Description</Label>
                    <p className="text-sm">{editableData.description}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label className="font-semibold">Category</Label>
                    <p className="text-sm capitalize">{editableData.category}</p>
                  </div>
                  {editableData.position && (
                    <div className="grid gap-2">
                      <Label className="font-semibold">Position</Label>
                      <p className="text-sm">{editableData.position}</p>
                    </div>
                  )}
                  <div className="grid gap-2">
                    <Label className="font-semibold">GitHub</Label>
                    <p className="text-sm break-all">{editableData.github || "Not provided"}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label className="font-semibold">Demo</Label>
                    <p className="text-sm break-all">{editableData.demo || "Not provided"}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label className="font-semibold">Tags ({Array.isArray(editableData.tags) ? editableData.tags.length : 0})</Label>
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(editableData.tags) &&
                        editableData.tags.slice(0, 10).map((tag: string, i: number) => (
                          <span key={i} className="text-xs bg-muted px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      {Array.isArray(editableData.tags) && editableData.tags.length > 10 && (
                        <span className="text-xs text-muted-foreground">+{editableData.tags.length - 10} more</span>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label className="font-semibold">Features ({Array.isArray(editableData.features) ? editableData.features.length : 0})</Label>
                    <ul className="text-sm list-disc list-inside space-y-1">
                      {Array.isArray(editableData.features) &&
                        editableData.features.slice(0, 5).map((feature: string, i: number) => (
                          <li key={i}>{feature}</li>
                        ))}
                      {Array.isArray(editableData.features) && editableData.features.length > 5 && (
                        <li className="text-muted-foreground">+{editableData.features.length - 5} more</li>
                      )}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="edit" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-title">Title *</Label>
                    <Input
                      id="edit-title"
                      value={editableData.title || ""}
                      onChange={(e) => updateEditableField("title", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-description">Description *</Label>
                    <Textarea
                      id="edit-description"
                      value={editableData.description || ""}
                      onChange={(e) => updateEditableField("description", e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-long-description">Long Description</Label>
                    <Textarea
                      id="edit-long-description"
                      value={editableData.long_description || ""}
                      onChange={(e) => updateEditableField("long_description", e.target.value)}
                      rows={5}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="edit-image">Image URL *</Label>
                      <Input
                        id="edit-image"
                        value={editableData.image || ""}
                        onChange={(e) => updateEditableField("image", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-category">Category *</Label>
                      <Input
                        id="edit-category"
                        value={editableData.category || ""}
                        onChange={(e) => updateEditableField("category", e.target.value)}
                        placeholder="personal or hackathon"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="edit-github">GitHub URL *</Label>
                      <Input
                        id="edit-github"
                        value={editableData.github || ""}
                        onChange={(e) => updateEditableField("github", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-demo">Demo URL</Label>
                      <Input
                        id="edit-demo"
                        value={editableData.demo || ""}
                        onChange={(e) => updateEditableField("demo", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-position">Position</Label>
                    <Input
                      id="edit-position"
                      value={editableData.position || ""}
                      onChange={(e) => updateEditableField("position", e.target.value)}
                      placeholder="e.g., 1st Place, Live Product"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-overview">Overview *</Label>
                    <Textarea
                      id="edit-overview"
                      value={editableData.overview || ""}
                      onChange={(e) => updateEditableField("overview", e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-tags">Tags (JSON array)</Label>
                    <Textarea
                      id="edit-tags"
                      value={JSON.stringify(Array.isArray(editableData.tags) ? editableData.tags : [], null, 2)}
                      onChange={(e) => updateArrayField("tags", e.target.value)}
                      rows={3}
                      placeholder='["React", "TypeScript", "Node.js"]'
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-features">Features (JSON array)</Label>
                    <Textarea
                      id="edit-features"
                      value={JSON.stringify(Array.isArray(editableData.features) ? editableData.features : [], null, 2)}
                      onChange={(e) => updateArrayField("features", e.target.value)}
                      rows={4}
                      placeholder='["Feature 1", "Feature 2"]'
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-challenges">Challenges (JSON array)</Label>
                    <Textarea
                      id="edit-challenges"
                      value={JSON.stringify(Array.isArray(editableData.challenges) ? editableData.challenges : [], null, 2)}
                      onChange={(e) => updateArrayField("challenges", e.target.value)}
                      rows={4}
                      placeholder='["Challenge 1", "Challenge 2"]'
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-system-design">System Design</Label>
                    <Textarea
                      id="edit-system-design"
                      value={editableData.system_design || ""}
                      onChange={(e) => updateEditableField("system_design", e.target.value)}
                      rows={8}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-additional-details">Additional Details</Label>
                    <Textarea
                      id="edit-additional-details"
                      value={editableData.additional_details || ""}
                      onChange={(e) => updateEditableField("additional_details", e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex justify-end gap-4">
              <Button variant="outline" onClick={() => setEditableData(null)}>
                Cancel
              </Button>
              <Button onClick={handleInsert} disabled={inserting}>
                {inserting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Inserting...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Insert into Database
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
