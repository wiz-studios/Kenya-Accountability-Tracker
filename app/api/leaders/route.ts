import { fetchLeaders } from "@/lib/data/leaders"
import { z } from "zod"
import { jsonError, jsonOk } from "@/lib/api/http"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const parseResult = z
    .object({
      q: z.string().optional(),
      county: z.string().optional(),
      constituency: z.string().optional(),
      position: z.string().optional(),
      party: z.string().optional(),
      limit: z.coerce.number().int().min(1).max(2000).default(60),
      offset: z.coerce.number().int().min(0).default(0),
      sort: z.enum(["score", "allegations", "budget", "name"]).default("score"),
    })
    .safeParse({
      q: searchParams.get("q") || undefined,
      county: searchParams.get("county") || undefined,
      constituency: searchParams.get("constituency") || undefined,
      position: searchParams.get("position") || undefined,
      party: searchParams.get("party") || undefined,
      limit: searchParams.get("limit") || undefined,
      offset: searchParams.get("offset") || undefined,
      sort: searchParams.get("sort") || undefined,
    })

  if (!parseResult.success) {
    return jsonError("Invalid query parameters", 400, parseResult.error.flatten())
  }

  const params = parseResult.data
  const { data, error } = await fetchLeaders({
    search: params.q,
    county: params.county,
    constituency: params.constituency,
    position: params.position,
    party: params.party,
    limit: params.limit,
    offset: params.offset,
    sort: params.sort,
  })

  if (error) {
    return jsonError(error, 500)
  }

  return jsonOk({
    data,
    meta: {
      limit: params.limit,
      offset: params.offset,
      count: data.length,
      sort: params.sort,
    },
  })
}
