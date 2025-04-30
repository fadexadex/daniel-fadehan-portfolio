"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"
import type { Experience } from "@/types"
import ExperienceForm from "./experience-form"
import { getSupabaseBrowser } from "@/lib/supabase-browser"

export default function ExperienceManagement() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const supabase = getSupabaseBrowser()

  const fetchExperiences = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from("experiences").select("*").order("start_date", { ascending: false })

      if (error) throw error
      setExperiences(data || [])
    } catch (error: any) {
      toast({
        title: "Error fetching experiences",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExperiences()
  }, [])

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from("experiences").delete().eq("id", id)

      if (error) throw error

      setExperiences(experiences.filter((exp) => exp.id !== id))
      toast({
        title: "Experience deleted",
        description: "The experience has been successfully deleted.",
      })
    } catch (error: any) {
      toast({
        title: "Error deleting experience",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setDeleteId(null)
    }
  }

  const handleTogglePublish = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from("experiences").update({ is_published: !currentStatus }).eq("id", id)

      if (error) throw error

      setExperiences(experiences.map((exp) => (exp.id === id ? { ...exp, is_published: !currentStatus } : exp)))

      toast({
        title: `Experience ${!currentStatus ? "published" : "unpublished"}`,
        description: `The experience has been ${!currentStatus ? "published" : "unpublished"} successfully.`,
      })
    } catch (error: any) {
      toast({
        title: "Error updating experience",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleFormClose = (refreshData = false) => {
    setIsFormOpen(false)
    setEditingExperience(null)
    if (refreshData) {
      fetchExperiences()
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Experience Management</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingExperience(null)}>
              <Plus className="mr-2 h-4 w-4" /> Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingExperience ? "Edit Experience" : "Add New Experience"}</DialogTitle>
            </DialogHeader>
            <ExperienceForm experience={editingExperience} onClose={handleFormClose} />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : experiences.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No experiences found. Add your first experience!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiences.map((experience) => (
            <Card key={experience.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center overflow-hidden">
                    {experience.logo ? (
                      <img
                        src={experience.logo || "/placeholder.svg"}
                        alt={experience.company}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className="text-gray-400 text-xs text-center">No logo</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">{experience.company}</h3>
                      <Badge variant={experience.is_published ? "default" : "outline"}>
                        {experience.is_published ? (
                          <Eye className="h-3 w-3 mr-1" />
                        ) : (
                          <EyeOff className="h-3 w-3 mr-1" />
                        )}
                        {experience.is_published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{experience.position}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{experience.period}</p>
                    {experience.location && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{experience.location}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {experience.description && experience.description.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                        {experience.description[0]}
                      </p>
                      {experience.description.length > 1 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          +{experience.description.length - 1} more points
                        </p>
                      )}
                    </div>
                  )}

                  {experience.skills && experience.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {experience.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {experience.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{experience.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(experience)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => setDeleteId(experience.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={experience.is_published}
                      onCheckedChange={() => handleTogglePublish(experience.id, experience.is_published)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the experience.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
