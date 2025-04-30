"use client"

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a singleton instance for the browser
let supabaseBrowser: ReturnType<typeof createClient> | undefined

export const getSupabaseBrowser = () => {
  if (!supabaseBrowser) {
    supabaseBrowser = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseBrowser
}
