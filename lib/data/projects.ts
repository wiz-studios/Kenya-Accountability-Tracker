import { getSupabaseServiceRoleClient } from "@/lib/supabase-client"
import type { Project } from "@/lib/types"

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

export async function fetchProjects(filters: ProjectFilters = {}): Promise<{ data: Project[]; error?: string }> {
  const supabase = getSupabaseServiceRoleClient()
  if (!supabase) {
    return { data: [], error: "Supabase is not configured (missing URL or service role key)" }
  }

  const { search, county, constituency, sector, status, limit = 60, offset = 0, sort = "risk" } = filters

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
