import { z } from "zod"
import { fetchRecentSourceReports, fetchSources } from "@/lib/data/sources"
import { jsonError, jsonOk } from "@/lib/api/http"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const parseResult = z
    .object({
      q: z.string().optional(),
      type: z.string().optional(),
      status: z.string().optional(),
      sort: z.enum(["trustScore", "records", "name", "lastUpdate"]).default("trustScore"),
      limit: z.coerce.number().int().min(1).max(1000).default(100),
      offset: z.coerce.number().int().min(0).default(0),
      includeReports: z.coerce.boolean().default(true),
    })
    .safeParse({
      q: searchParams.get("q") || undefined,
      type: searchParams.get("type") || undefined,
      status: searchParams.get("status") || undefined,
      sort: searchParams.get("sort") || undefined,
      limit: searchParams.get("limit") || undefined,
      offset: searchParams.get("offset") || undefined,
      includeReports: searchParams.get("includeReports") ?? "true",
    })

  if (!parseResult.success) {
    return jsonError("Invalid query parameters", 400, parseResult.error.flatten())
  }

  const params = parseResult.data
  const { data, error } = await fetchSources({
    search: params.q,
    type: params.type,
    status: params.status,
    sort: params.sort,
    limit: params.limit,
    offset: params.offset,
  })

  if (error) {
    return jsonError(error, 500)
  }

  const recentReports = params.includeReports ? await fetchRecentSourceReports() : []

  return jsonOk({
    data,
    recentReports,
    meta: {
      limit: params.limit,
      offset: params.offset,
      count: data.length,
      sort: params.sort,
    },
  })
}
