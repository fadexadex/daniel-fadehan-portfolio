import { supabase } from "@/lib/supabase"
import type { Project, Experience } from "@/types"
import { cache } from "react"

// Cache the getProjects function using React's cache
export const getProjects = cache(async (): Promise<Project[]> => {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_published", true)
      .order("id", { ascending: true })

    if (error) {
      console.error("Error fetching projects:", error)
      return []
    }

    return data as Project[]
  } catch (error) {
    console.error("Error fetching projects:", error)
    return []
  }
})

export const getProjectById = cache(async (id: number): Promise<Project | null> => {
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching project with id ${id}:`, error)
    return null
  }

  return data as Project
})

// Cache the getExperiences function using React's cache
export const getExperiences = cache(async (): Promise<Experience[]> => {
  try {
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .eq("is_published", true)
      .order("start_date", { ascending: false })

    if (error) {
      console.error("Error fetching experiences:", error)
      return []
    }

    return data as Experience[]
  } catch (error) {
    console.error("Error fetching experiences:", error)
    return []
  }
})

export const getExperienceById = cache(async (id: number): Promise<Experience | null> => {
  const { data, error } = await supabase.from("experiences").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching experience with id ${id}:`, error)
    return null
  }

  return data as Experience
})

// Replace the revalidateData function with a simpler version that doesn't use revalidatePath
export function revalidateData(path = "/") {
  // This is a no-op function now, but we keep it to avoid breaking existing code
  console.log(`Would revalidate path: ${path} (disabled)`)
}

// Function to get all messages for admin dashboard
export async function getMessages() {
  try {
    const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching messages:", error)
      return []
    }

    return data
  } catch (error) {
    console.error("Error fetching messages:", error)
    return []
  }
}

// Function to mark a message as read
export async function markMessageAsRead(id: number) {
  try {
    const { error } = await supabase
      .from("messages")
      .update({ read: true, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) {
      console.error(`Error marking message ${id} as read:`, error)
      return false
    }

    return true
  } catch (error) {
    console.error(`Error marking message ${id} as read:`, error)
    return false
  }
}

// Function to delete a message
export async function deleteMessage(id: number) {
  try {
    const { error } = await supabase.from("messages").delete().eq("id", id)

    if (error) {
      console.error(`Error deleting message ${id}:`, error)
      return false
    }

    return true
  } catch (error) {
    console.error(`Error deleting message ${id}:`, error)
    return false
  }
}
