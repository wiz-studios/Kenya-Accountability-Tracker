import { getSupabaseServiceRoleClient } from "@/lib/supabase-client"
import type { DataSource } from "@/lib/types"
import { fallbackDataSources, fallbackRecentSourceReports } from "@/lib/data/mock-data-sources"

export type SourceFilters = {
  search?: string
  type?: string
  status?: string
  sort?: "trustScore" | "records" | "name" | "lastUpdate"
  limit?: number
  offset?: number
}

const mapSourceRow = (row: Record<string, any>): DataSource => ({
  id: row.id?.toString() ?? "",
  name: row.name ?? "",
  type: row.type ?? "",
  description: row.description ?? "",
  url: row.url ?? "Internal",
  trustScore: row.trust_score ?? row.trustScore ?? 0,
  status: (row.status ?? "active") as DataSource["status"],
  frequency: row.update_frequency ?? row.frequency ?? "Unknown",
  coverage: row.coverage ?? "National",
  dataTypes: row.data_types ?? row.dataTypes ?? [],
  categories: row.categories ?? [],
  lastUpdate: row.last_update ?? row.lastUpdate ?? "",
  recordsCount: row.records_count ?? row.recordsCount ?? 0,
})

const sortSources = (sources: DataSource[], sortBy: SourceFilters["sort"] = "trustScore") => {
  return [...sources].sort((a, b) => {
    switch (sortBy) {
      case "records":
        return b.recordsCount - a.recordsCount
      case "name":
        return a.name.localeCompare(b.name)
      case "lastUpdate":
        return new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime()
      default:
        return b.trustScore - a.trustScore
    }
  })
}

export async function fetchSources(filters: SourceFilters = {}): Promise<{ data: DataSource[]; error?: string }> {
  const supabase = getSupabaseServiceRoleClient()
  const { search, type, status, sort = "trustScore", limit = 100, offset = 0 } = filters

  if (!supabase) {
    let filtered = [...fallbackDataSources]
    if (search) {
      const needle = search.toLowerCase()
      filtered = filtered.filter(
        (source) =>
          source.name.toLowerCase().includes(needle) || source.description.toLowerCase().includes(needle),
      )
    }
    if (type) {
      filtered = filtered.filter((source) => source.type === type)
    }
    if (status) {
      filtered = filtered.filter((source) => source.status === status)
    }
    const sorted = sortSources(filtered, sort)
    return { data: sorted.slice(offset, offset + limit) }
  }

  let query = supabase.from("data_sources").select("*")

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
  }
  if (type) {
    query = query.eq("type", type)
  }
  if (status) {
    query = query.eq("status", status)
  }

  switch (sort) {
    case "records":
      query = query.order("records_count", { ascending: false })
      break
    case "name":
      query = query.order("name", { ascending: true })
      break
    case "lastUpdate":
      query = query.order("last_update", { ascending: false })
      break
    default:
      query = query.order("trust_score", { ascending: false })
  }

  const { data, error } = await query.range(offset, offset + limit - 1)
  if (error) {
    return { data: [], error: error.message }
  }

  return { data: (data || []).map(mapSourceRow) }
}

export async function fetchRecentSourceReports(): Promise<
  { title: string; source: string; date: string; type: string; findings: string; url: string }[]
> {
  return fallbackRecentSourceReports
}
