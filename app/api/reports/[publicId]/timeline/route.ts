import { fetchReportTimeline } from "@/lib/data/reports"
import { jsonError, jsonOk } from "@/lib/api/http"
import { requireReviewerAccess } from "@/lib/auth/route-access"

type RouteContext = {
  params: { publicId: string } | Promise<{ publicId: string }>
}

export async function GET(request: Request, context: RouteContext) {
  const access = await requireReviewerAccess(request)
  if (!access.ok) {
    return access.response
  }

  const params = await Promise.resolve(context.params)
  const publicId = decodeURIComponent(params.publicId || "")
  const { data, error } = await fetchReportTimeline(publicId)
  if (error) {
    return jsonError(error, error.includes("not found") ? 404 : 500)
  }
  return jsonOk({ data })
}
