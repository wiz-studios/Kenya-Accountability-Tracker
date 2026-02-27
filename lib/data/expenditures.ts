import { getSupabaseServiceRoleClient } from "@/lib/supabase-client"
import type { Expenditure } from "@/lib/types"
import { stateHouseExpenditures } from "@/lib/state-house"

export type ExpenditureFilters = {
  search?: string
  category?: string
  status?: string
  minRisk?: number
  limit?: number
  offset?: number
}

const mapExpenditureRow = (row: Record<string, any>): Expenditure => ({
  id: row.id?.toString() ?? "",
  category: row.category ?? "",
  amount: row.amount ?? 0,
  date: row.date ?? "",
  description: row.description ?? "",
  status: row.status ?? "",
  riskScore: row.risk_score ?? row.riskScore ?? 0,
  referenceUrl: row.reference_url ?? row.referenceUrl ?? null,
  source: row.source ?? null,
  tags: row.tags ?? [],
})

const fallbackExpenditures: Expenditure[] = stateHouseExpenditures.map((item, index) => ({
  id: `expenditure-${index + 1}`,
  category: "State House",
  amount: item.amountMillions * 1_000_000,
  date: item.date,
  description: item.issue,
  status: item.status,
  riskScore: item.risk,
  referenceUrl: item.reference ?? null,
  source: item.source ?? null,
  tags: ["statehouse", "audit"],
}))

export async function fetchExpenditures(
  filters: ExpenditureFilters = {},
): Promise<{ data: Expenditure[]; error?: string }> {
  const supabase = getSupabaseServiceRoleClient()
  const { search, category, status, minRisk = 0, limit = 60, offset = 0 } = filters

  if (!supabase) {
    let filtered = [...fallbackExpenditures]
    if (search) {
      const needle = search.toLowerCase()
      filtered = filtered.filter((item) => item.description.toLowerCase().includes(needle))
    }
    if (category) {
      filtered = filtered.filter((item) => item.category === category)
    }
    if (status) {
      filtered = filtered.filter((item) => item.status === status)
    }
    if (minRisk) {
      filtered = filtered.filter((item) => item.riskScore >= minRisk)
    }
    filtered.sort((a, b) => b.riskScore - a.riskScore)
    return { data: filtered.slice(offset, offset + limit) }
  }

  let query = supabase.from("expenditures").select("*", { count: "exact" })

  if (search) {
    query = query.ilike("description", `%${search}%`)
  }
  if (category) {
    query = query.eq("category", category)
  }
  if (status) {
    query = query.eq("status", status)
  }
  if (minRisk) {
    query = query.gte("risk_score", minRisk)
  }

  query = query.order("risk_score", { ascending: false })

  const { data, error } = await query.range(offset, offset + limit - 1)

  if (error) {
    return { data: [], error: error.message }
  }

  return { data: (data || []).map(mapExpenditureRow) }
}
