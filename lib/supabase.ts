import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, supabaseKey)
}

// Create a client-side supabase client
export const createClientSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(supabaseUrl, supabaseKey)
}

// Singleton pattern for client-side Supabase client
let clientSupabaseClient: ReturnType<typeof createClientSupabaseClient> | null = null

export const getClientSupabaseClient = () => {
  if (!clientSupabaseClient) {
    clientSupabaseClient = createClientSupabaseClient()
  }
  return clientSupabaseClient
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)
