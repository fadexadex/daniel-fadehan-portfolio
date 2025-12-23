"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminHeader from "@/components/admin/admin-header"
import ProjectsManagement from "@/components/admin/projects-management"
import ProjectGenerator from "@/components/admin/project-generator"
import ExperienceManagement from "@/components/admin/experience-management"
import MessagesManagement from "@/components/admin/messages-management"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("projects")
  const [projectsSubTab, setProjectsSubTab] = useState("manage")

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    router.push("/admin/login")
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminHeader />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>
          <TabsContent value="projects" className="space-y-6">
            <Tabs value={projectsSubTab} onValueChange={setProjectsSubTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 max-w-md">
                <TabsTrigger value="manage">Manage Projects</TabsTrigger>
                <TabsTrigger value="generate">Generate from Files</TabsTrigger>
              </TabsList>
              <TabsContent value="manage">
                <ProjectsManagement />
              </TabsContent>
              <TabsContent value="generate">
                <ProjectGenerator />
              </TabsContent>
            </Tabs>
          </TabsContent>
          <TabsContent value="experience">
            <ExperienceManagement />
          </TabsContent>
          <TabsContent value="messages">
            <MessagesManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
