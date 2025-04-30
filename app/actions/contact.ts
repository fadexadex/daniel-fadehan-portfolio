"use server"

import { supabase } from "@/lib/supabase"
// Remove the revalidateData import

type ContactFormData = {
  name: string
  email: string
  message: string
}

export async function submitContactForm(formData: ContactFormData) {
  try {
    // Validate form data
    if (!formData.name || !formData.email || !formData.message) {
      return { success: false, message: "All fields are required" }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      return { success: false, message: "Please enter a valid email address" }
    }

    // Insert message into database
    const { error } = await supabase.from("messages").insert([
      {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        read: false,
      },
    ])

    if (error) {
      console.error("Error saving message:", error)
      return { success: false, message: "Failed to send message. Please try again later." }
    }

    // No need to revalidate the admin dashboard page

    return { success: true, message: "Your message has been sent successfully!" }
  } catch (error) {
    console.error("Error in submitContactForm:", error)
    return { success: false, message: "An unexpected error occurred. Please try again later." }
  }
}
