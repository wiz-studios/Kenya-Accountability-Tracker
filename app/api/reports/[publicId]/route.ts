import { z } from "zod"
import { fetchReportByPublicId, updateReportReview } from "@/lib/data/reports"
import { jsonError, jsonOk } from "@/lib/api/http"
import { requireReviewerAccess, tryGetReviewerAccess } from "@/lib/auth/route-access"
import type { Report } from "@/lib/types"

type RouteContext = {
  params: { publicId: string } | Promise<{ publicId: string }>
}

const patchSchema = z.object({
  status: z.enum(["Pending Review", "Under Investigation", "Needs More Info", "Verified", "Closed"]).optional(),
  confidenceScore: z.coerce.number().int().min(0).max(100).optional(),
  verificationNotes: z.string().max(2000).optional().nullable(),
})

const toPublicReportView = (report: Report) => ({
  publicId: report.publicId,
  reportType: report.reportType,
  title: report.title,
  county: report.county,
  constituency: report.constituency ?? null,
  projectName: report.projectName ?? null,
  status: report.status,
  confidenceScore: report.confidenceScore,
  verificationNotes: report.verificationNotes ?? null,
  insertedAt: report.insertedAt,
  updatedAt: report.updatedAt,
})

export async function GET(request: Request, context: RouteContext) {
  const params = await Promise.resolve(context.params)
  const publicId = decodeURIComponent(params.publicId || "")
  const { data, error } = await fetchReportByPublicId(publicId)

  if (error) {
    return jsonError(error, 404)
  }
  if (!data) {
    return jsonError(`Report '${publicId}' not found`, 404)
  }

  const access = await tryGetReviewerAccess(request)
  if (access) {
    return jsonOk({ data })
  }

  return jsonOk({ data: toPublicReportView(data) })
}

export async function PATCH(request: Request, context: RouteContext) {
  const access = await requireReviewerAccess(request)
  if (!access.ok) {
    return access.response
  }

  const params = await Promise.resolve(context.params)
  const publicId = decodeURIComponent(params.publicId || "")

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return jsonError("Invalid JSON payload", 400)
  }

  const parsed = patchSchema.safeParse(payload)
  if (!parsed.success) {
    return jsonError("Invalid update payload", 400, parsed.error.flatten())
  }

  if (Object.keys(parsed.data).length === 0) {
    return jsonError("No update fields provided", 400)
  }

  const reviewerLabel = access.userEmail || access.userId
  const { data, error } = await updateReportReview(publicId, {
    ...parsed.data,
    assignedReviewer: reviewerLabel,
  })
  if (error || !data) {
    return jsonError(error || "Could not update report", error?.includes("not found") ? 404 : 500)
  }

  return jsonOk({ data, message: "Report updated" })
}
