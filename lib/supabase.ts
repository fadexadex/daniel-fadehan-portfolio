import { createClient } from "@supabase/supabase-js"

// Fetch options that opt out of Next.js Data Cache so Supabase responses
// are never stale — force-dynamic on pages handles the Full Route Cache,
// but the Data Cache needs to be opted out separately.
const uncachedFetch: typeof fetch = (url, options = {}) =>
  fetch(url, { ...options, cache: "no-store" })

// Create a single supabase client for interacting with your database
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, supabaseKey, { global: { fetch: uncachedFetch } })
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
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey, { global: { fetch: uncachedFetch } })
