import { getSupabaseServiceRoleClient } from "@/lib/supabase-client"
import type { Leader } from "@/lib/types"
import { senatorsData } from "@/lib/senators-data"

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

const fallbackLeaders: Leader[] = [
  {
    id: "leader-gov-nairobi",
    name: "Johnson Sakaja",
    position: "County Governor",
    county: "Nairobi",
    constituency: "County-wide",
    party: "UDA",
    term: "2022-2027",
    allegations: 2,
    projectsOverseen: 15,
    budgetManaged: 37500000000,
    accountabilityScore: 68,
  },
  {
    id: "leader-gov-kisumu",
    name: "Prof. Anyang' Nyong'o",
    position: "County Governor",
    county: "Kisumu",
    constituency: "County-wide",
    party: "ODM",
    term: "2017-2027",
    allegations: 0,
    projectsOverseen: 12,
    budgetManaged: 15800000000,
    accountabilityScore: 85,
  },
  {
    id: "leader-gov-nakuru",
    name: "Susan Kihika",
    position: "County Governor",
    county: "Nakuru",
    constituency: "County-wide",
    party: "UDA",
    term: "2022-2027",
    allegations: 1,
    projectsOverseen: 18,
    budgetManaged: 12400000000,
    accountabilityScore: 74,
  },
  ...senatorsData.map((senator) => ({
    id: `leader-sen-${senator.id}`,
    name: senator.name,
    position: "Senator",
    county: senator.county,
    constituency: "County-wide",
    party: senator.party,
    term: senator.term,
    allegations: 0,
    projectsOverseen: 0,
    budgetManaged: 0,
    accountabilityScore: 70,
    phone: senator.phone ?? null,
    email: senator.email ?? null,
  })),
]

const applyFilters = (data: Leader[], filters: LeaderFilters): Leader[] => {
  const { search, county, constituency, position, party, sort = "score" } = filters

  let filtered = [...data]

  if (search) {
    const needle = search.toLowerCase()
    filtered = filtered.filter((leader) => leader.name.toLowerCase().includes(needle))
  }
  if (county) {
    filtered = filtered.filter((leader) => leader.county === county)
  }
  if (constituency) {
    filtered = filtered.filter((leader) => leader.constituency === constituency)
  }
  if (position) {
    filtered = filtered.filter((leader) => leader.position === position)
  }
  if (party) {
    filtered = filtered.filter((leader) => leader.party === party)
  }

  filtered.sort((a, b) => {
    if (sort === "allegations") return a.allegations - b.allegations
    if (sort === "budget") return b.budgetManaged - a.budgetManaged
    if (sort === "name") return a.name.localeCompare(b.name)
    return b.accountabilityScore - a.accountabilityScore
  })

  return filtered
}

export async function fetchLeaders(filters: LeaderFilters = {}): Promise<{ data: Leader[]; error?: string }> {
  const supabase = getSupabaseServiceRoleClient()
  const { search, county, constituency, position, party, limit = 60, offset = 0, sort = "score" } = filters

  if (!supabase) {
    const filtered = applyFilters(fallbackLeaders, filters)
    return { data: filtered.slice(offset, offset + limit) }
  }

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
