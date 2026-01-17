import { getSupabaseServiceRoleClient } from "@/lib/supabase-client"
import type { Expenditure } from "@/lib/types"

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

export async function fetchExpenditures(
  filters: ExpenditureFilters = {},
): Promise<{ data: Expenditure[]; error?: string }> {
  const supabase = getSupabaseServiceRoleClient()
  if (!supabase) {
    return { data: [], error: "Supabase is not configured (missing URL or service role key)" }
  }

  const { search, category, status, minRisk = 0, limit = 60, offset = 0 } = filters

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
