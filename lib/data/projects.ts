import { getSupabaseServiceRoleClient } from "@/lib/supabase-client"
import type { Project } from "@/lib/types"
import { enhancedProjectData } from "@/lib/enhanced-project-data"

export type ProjectFilters = {
  search?: string
  county?: string
  constituency?: string
  sector?: string
  status?: string
  limit?: number
  offset?: number
  sort?: "risk" | "budget" | "name"
}

const mapProjectRow = (row: Record<string, any>): Project => ({
  id: row.id?.toString() ?? "",
  name: row.name ?? "",
  county: row.county ?? "",
  constituency: row.constituency ?? "",
  sector: row.sector ?? "",
  status: row.status ?? "",
  budgetAllocated: row.budget_allocated ?? row.budgetAllocated ?? 0,
  budgetSpent: row.budget_spent ?? row.budgetSpent ?? 0,
  riskScore: row.risk_score ?? row.riskScore ?? 0,
  startDate: row.start_date ?? row.startDate ?? null,
  endDate: row.end_date ?? row.endDate ?? null,
  latitude: row.latitude ?? null,
  longitude: row.longitude ?? null,
})

const toNumber = (value: unknown): number => (typeof value === "number" ? value : Number(value) || 0)

const fallbackProjects: Project[] = enhancedProjectData.map((project) => ({
  id: String(project.id),
  name: project.name,
  county: project.county,
  constituency: project.constituency,
  sector: project.sector,
  status: project.status,
  budgetAllocated: project.budget,
  budgetSpent: project.spent,
  riskScore:
    project.status === "Stalled"
      ? 90
      : project.status === "Delayed"
        ? 70
        : project.status === "Behind Schedule"
          ? 65
          : project.status === "Cancelled"
            ? 95
            : 25,
  startDate: project.startDate,
  endDate: project.expectedCompletion,
  latitude: project.coordinates?.lat ?? null,
  longitude: project.coordinates?.lng ?? null,
}))

const applyFilters = (data: Project[], filters: ProjectFilters): Project[] => {
  const { search, county, constituency, sector, status, sort = "risk" } = filters

  let filtered = [...data]

  if (search) {
    const needle = search.toLowerCase()
    filtered = filtered.filter((project) => project.name.toLowerCase().includes(needle))
  }
  if (county) {
    filtered = filtered.filter((project) => project.county === county)
  }
  if (constituency) {
    filtered = filtered.filter((project) => project.constituency === constituency)
  }
  if (sector) {
    filtered = filtered.filter((project) => project.sector === sector)
  }
  if (status) {
    filtered = filtered.filter((project) => project.status === status)
  }

  filtered.sort((a, b) => {
    if (sort === "budget") return b.budgetAllocated - a.budgetAllocated
    if (sort === "name") return a.name.localeCompare(b.name)
    return b.riskScore - a.riskScore
  })

  return filtered
}

export async function fetchProjects(filters: ProjectFilters = {}): Promise<{ data: Project[]; error?: string }> {
  const supabase = getSupabaseServiceRoleClient()
  const { search, county, constituency, sector, status, limit = 60, offset = 0, sort = "risk" } = filters

  if (!supabase) {
    const filtered = applyFilters(fallbackProjects, filters)
    return { data: filtered.slice(offset, offset + limit) }
  }

  let query = supabase.from("projects").select("*", { count: "exact" })

  if (search) {
    query = query.ilike("name", `%${search}%`)
  }
  if (county) {
    query = query.eq("county", county)
  }
  if (constituency) {
    query = query.eq("constituency", constituency)
  }
  if (sector) {
    query = query.eq("sector", sector)
  }
  if (status) {
    query = query.eq("status", status)
  }

  switch (sort) {
    case "budget":
      query = query.order("budget_allocated", { ascending: false })
      break;
    case "name":
      query = query.order("name", { ascending: true })
      break;
    default:
      query = query.order("risk_score", { ascending: false })
  }

  const { data, error } = await query.range(offset, offset + limit - 1)

  if (error) {
    return { data: [], error: error.message }
  }

  return { data: (data || []).map(mapProjectRow) }
}

export async function fetchProjectById(projectId: string): Promise<{ data?: Project; error?: string }> {
  const supabase = getSupabaseServiceRoleClient()

  if (!projectId) {
    return { error: "Project id is required" }
  }

  if (!supabase) {
    const match = fallbackProjects.find((project) => project.id === projectId)
    if (!match) {
      return { error: `Project '${projectId}' not found` }
    }
    return { data: match }
  }

  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  let query = supabase.from("projects").select("*").limit(1)

  if (uuidPattern.test(projectId)) {
    query = query.eq("id", projectId)
  } else {
    query = query.eq("name", projectId)
  }

  const { data, error } = await query.maybeSingle()

  if (error) {
    return { error: error.message }
  }
  if (!data) {
    return { error: `Project '${projectId}' not found` }
  }

  return { data: mapProjectRow(data as Record<string, any>) }
}

export function getProjectFacets(projects: Project[]) {
  const counties = Array.from(new Set(projects.map((project) => project.county))).sort()
  const constituencies = Array.from(new Set(projects.map((project) => project.constituency))).sort()
  const sectors = Array.from(new Set(projects.map((project) => project.sector))).sort()
  const statuses = Array.from(new Set(projects.map((project) => project.status))).sort()
  const totals = projects.reduce(
    (acc, project) => {
      acc.budgetAllocated += toNumber(project.budgetAllocated)
      acc.budgetSpent += toNumber(project.budgetSpent)
      acc.avgRisk += toNumber(project.riskScore)
      return acc
    },
    { budgetAllocated: 0, budgetSpent: 0, avgRisk: 0 },
  )

  return {
    counties,
    constituencies,
    sectors,
    statuses,
    summary: {
      totalProjects: projects.length,
      totalBudgetAllocated: totals.budgetAllocated,
      totalBudgetSpent: totals.budgetSpent,
      averageRiskScore: projects.length ? Math.round(totals.avgRisk / projects.length) : 0,
    },
  }
}
