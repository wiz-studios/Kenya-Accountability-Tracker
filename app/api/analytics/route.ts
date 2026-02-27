import { getAnalyticsSnapshot } from "@/lib/data/analytics"
import { jsonError, jsonOk } from "@/lib/api/http"

export async function GET() {
  try {
    const data = await getAnalyticsSnapshot()
    return jsonOk({ data })
  } catch (error) {
    return jsonError("Failed to compute analytics snapshot", 500, error instanceof Error ? error.message : error)
  }
}
