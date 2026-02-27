import { z } from "zod"
import { updateReportEvidence } from "@/lib/data/reports"
import { jsonError, jsonOk } from "@/lib/api/http"
import { requireReviewerAccess } from "@/lib/auth/route-access"

type RouteContext = {
  params: { publicId: string; evidenceId: string } | Promise<{ publicId: string; evidenceId: string }>
}

const patchSchema = z.object({
  verificationState: z.enum(["unverified", "verified", "rejected"]),
  note: z.string().max(2000).optional().nullable(),
})

export async function PATCH(request: Request, context: RouteContext) {
  const access = await requireReviewerAccess(request)
  if (!access.ok) {
    return access.response
  }

  const params = await Promise.resolve(context.params)
  const publicId = decodeURIComponent(params.publicId || "")
  const evidenceId = decodeURIComponent(params.evidenceId || "")

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return jsonError("Invalid JSON payload", 400)
  }

  const parsed = patchSchema.safeParse(payload)
  if (!parsed.success) {
    return jsonError("Invalid evidence update payload", 400, parsed.error.flatten())
  }

  const reviewerLabel = access.userEmail || access.userId
  const { data, error } = await updateReportEvidence(publicId, evidenceId, {
    verificationState: parsed.data.verificationState,
    note: parsed.data.note ?? `Evidence marked as '${parsed.data.verificationState}' via admin moderation.`,
    changedBy: reviewerLabel,
  })
  if (error || !data) {
    return jsonError(error || "Could not update evidence", error?.includes("not found") ? 404 : 500)
  }

  return jsonOk({ data, message: "Evidence updated" })
}
