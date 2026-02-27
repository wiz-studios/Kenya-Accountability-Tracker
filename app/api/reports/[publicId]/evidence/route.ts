import { z } from "zod"
import { addReportEvidence, fetchReportEvidence } from "@/lib/data/reports"
import { getSupabaseServiceRoleClient } from "@/lib/supabase-client"
import { jsonError, jsonOk } from "@/lib/api/http"
import { requireReviewerAccess, tryGetReviewerAccess } from "@/lib/auth/route-access"
import { verifyEvidenceUploadToken } from "@/lib/auth/evidence-upload-token"
import { checkIpRateLimit, jsonRateLimitError, parsePositiveInt } from "@/lib/api/rate-limit"

type RouteContext = {
  params: { publicId: string } | Promise<{ publicId: string }>
}

const evidenceMetaSchema = z.object({
  label: z.string().min(1).max(200),
  sourceUrl: z.string().url().optional().nullable(),
  verificationState: z.enum(["unverified", "verified", "rejected"]).optional(),
})

const sanitizeFileName = (value: string) => value.replace(/[^a-zA-Z0-9._-]/g, "_")
const EVIDENCE_UPLOAD_LIMIT = parsePositiveInt(process.env.EVIDENCE_UPLOAD_RATE_LIMIT, 12)
const EVIDENCE_UPLOAD_WINDOW_MS = parsePositiveInt(process.env.EVIDENCE_UPLOAD_WINDOW_SECONDS, 15 * 60) * 1000

export async function GET(request: Request, context: RouteContext) {
  const access = await requireReviewerAccess(request)
  if (!access.ok) {
    return access.response
  }

  const params = await Promise.resolve(context.params)
  const publicId = decodeURIComponent(params.publicId || "")
  const { data, error } = await fetchReportEvidence(publicId)
  if (error) {
    return jsonError(error, error.includes("not found") ? 404 : 500)
  }
  return jsonOk({ data })
}

export async function POST(request: Request, context: RouteContext) {
  const rateLimitCheck = checkIpRateLimit(request, {
    namespace: "evidence-upload",
    limit: EVIDENCE_UPLOAD_LIMIT,
    windowMs: EVIDENCE_UPLOAD_WINDOW_MS,
  })
  if (!rateLimitCheck.allowed) {
    return jsonRateLimitError("Too many evidence uploads. Please try again later.", rateLimitCheck)
  }

  const params = await Promise.resolve(context.params)
  const publicId = decodeURIComponent(params.publicId || "")
  const reviewerAccess = await tryGetReviewerAccess(request)

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return jsonError("Expected multipart/form-data payload", 400)
  }

  const file = formData.get("file")
  const label = String(formData.get("label") || (file instanceof File ? file.name : "")).trim()
  const sourceUrlRaw = formData.get("sourceUrl")
  const verificationState = String(formData.get("verificationState") || "").trim() || undefined
  const uploadTokenRaw =
    request.headers.get("x-report-upload-token") ||
    request.headers.get("x-upload-token") ||
    String(formData.get("uploadToken") || "")

  if (!reviewerAccess) {
    const tokenCheck = verifyEvidenceUploadToken(publicId, uploadTokenRaw || null)
    if (!tokenCheck.ok) {
      return jsonError(tokenCheck.error, 401)
    }
  }

  const metaParsed = evidenceMetaSchema.safeParse({
    label,
    sourceUrl: sourceUrlRaw ? String(sourceUrlRaw) : undefined,
    verificationState,
  })
  if (!metaParsed.success) {
    return jsonError("Invalid evidence payload", 400, metaParsed.error.flatten())
  }

  let fileUrl: string | null = null
  let mimeType: string | null = null
  let fileSizeBytes: number | null = null

  if (file instanceof File) {
    mimeType = file.type || "application/octet-stream"
    fileSizeBytes = file.size

    const supabase = getSupabaseServiceRoleClient()
    if (supabase) {
      const bucket = process.env.SUPABASE_EVIDENCE_BUCKET || "report-evidence"
      const filePath = `${publicId}/${Date.now()}-${sanitizeFileName(file.name)}`
      const arrayBuffer = await file.arrayBuffer()

      const uploadResult = await supabase.storage.from(bucket).upload(filePath, arrayBuffer, {
        contentType: mimeType,
        upsert: false,
      })
      if (uploadResult.error) {
        return jsonError(`Evidence upload failed: ${uploadResult.error.message}`, 500)
      }

      // Persist a storage URI; signed URLs are generated at read-time.
      fileUrl = `storage://${bucket}/${filePath}`
    } else {
      // Fallback mode stores metadata and a synthetic file path.
      fileUrl = `/evidence/${encodeURIComponent(publicId)}/${encodeURIComponent(file.name)}`
    }
  }

  const { data, error } = await addReportEvidence(publicId, {
    label: metaParsed.data.label,
    sourceUrl: metaParsed.data.sourceUrl ?? null,
    verificationState: metaParsed.data.verificationState,
    fileUrl,
    mimeType,
    fileSizeBytes,
  })

  if (error || !data) {
    return jsonError(error || "Could not add evidence", error?.includes("not found") ? 404 : 500)
  }

  return jsonOk({ data, message: "Evidence added" }, { status: 201, headers: rateLimitCheck.headers })
}
