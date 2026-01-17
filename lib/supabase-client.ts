import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let browserClient: SupabaseClient | null = null

const getUrl = () => process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ""
const getAnonKey = () =>
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || ""

export const getSupabaseBrowserClient = () => {
  if (browserClient) return browserClient
  const url = getUrl()
  const key = getAnonKey()
  if (!url || !key) {
    throw new Error("Supabase client is missing URL or anon key")
  }
  browserClient = createClient(url, key)
  return browserClient
}

export const getSupabaseServiceRoleClient = () => {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return null
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
