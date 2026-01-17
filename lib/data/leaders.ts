import { getSupabaseServiceRoleClient } from "@/lib/supabase-client"
import type { Leader } from "@/lib/types"

export type LeaderFilters = {
  search?: string
  county?: string
  constituency?: string
  position?: string
  party?: string
  limit?: number
  offset?: number
  sort?: "score" | "allegations" | "budget" | "name"
}

const mapLeaderRow = (row: Record<string, any>): Leader => ({
  id: row.id?.toString() ?? "",
  name: row.name ?? "",
  position: row.position ?? "",
  county: row.county ?? "",
  constituency: row.constituency ?? "",
  party: row.party ?? "",
  term: row.term ?? "",
  allegations: row.allegations_count ?? row.allegations ?? 0,
  projectsOverseen: row.projects_overseen ?? row.projectsOverseen ?? 0,
  budgetManaged: row.budget_managed ?? row.budgetManaged ?? 0,
  accountabilityScore: row.accountability_score ?? row.accountabilityScore ?? 0,
  phone: row.phone ?? null,
  email: row.email ?? null,
  photoUrl: row.photo_url ?? row.photoUrl ?? null,
  recentActions: row.recent_actions ?? row.recentActions ?? [],
  keyProjects: row.key_projects ?? row.keyProjects ?? [],
  socialTwitter: row.social_twitter ?? row.socialTwitter ?? null,
  socialFacebook: row.social_facebook ?? row.socialFacebook ?? null,
})

export async function fetchLeaders(filters: LeaderFilters = {}): Promise<{ data: Leader[]; error?: string }> {
  const supabase = getSupabaseServiceRoleClient()
  if (!supabase) {
    return { data: [], error: "Supabase is not configured (missing URL or service role key)" }
  }

  const { search, county, constituency, position, party, limit = 60, offset = 0, sort = "score" } = filters

  let query = supabase.from("leaders").select("*", { count: "exact" })

  if (search) {
    query = query.ilike("name", `%${search}%`)
  }
  if (county) {
    query = query.eq("county", county)
  }
  if (constituency) {
    query = query.eq("constituency", constituency)
  }
  if (position) {
    query = query.eq("position", position)
  }
  if (party) {
    query = query.eq("party", party)
  }

  switch (sort) {
    case "allegations":
      query = query.order("allegations_count", { ascending: true })
      break;
    case "budget":
      query = query.order("budget_managed", { ascending: false })
      break;
    case "name":
      query = query.order("name", { ascending: true })
      break;
    default:
      query = query.order("accountability_score", { ascending: false })
  }

  const { data, error } = await query.range(offset, offset + limit - 1)

  if (error) {
    return { data: [], error: error.message }
  }

  return { data: (data || []).map(mapLeaderRow) }
}
