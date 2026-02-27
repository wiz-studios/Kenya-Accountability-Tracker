import { z } from "zod"
import { createReport, fetchReports } from "@/lib/data/reports"
import { jsonError, jsonOk } from "@/lib/api/http"
import { requireReviewerAccess } from "@/lib/auth/route-access"
import { createEvidenceUploadToken } from "@/lib/auth/evidence-upload-token"
import { checkIpRateLimit, jsonRateLimitError, parsePositiveInt } from "@/lib/api/rate-limit"

const REPORT_SUBMISSION_LIMIT = parsePositiveInt(process.env.REPORT_SUBMISSION_RATE_LIMIT, 5)
const REPORT_SUBMISSION_WINDOW_MS = parsePositiveInt(process.env.REPORT_SUBMISSION_WINDOW_SECONDS, 15 * 60) * 1000

const createReportSchema = z.object({
  reportType: z.string().min(1),
  title: z.string().min(5).max(200),
  description: z.string().min(20).max(4000),
  county: z.string().min(2),
  constituency: z.string().optional().nullable(),
  projectName: z.string().optional().nullable(),
  involvedParties: z.string().optional().nullable(),
  estimatedAmount: z.coerce.number().nonnegative().optional().nullable(),
  occurredOn: z.string().optional().nullable(),
  reportedElsewhere: z.string().optional().nullable(),
  isAnonymous: z.boolean().default(true),
  allowContact: z.boolean().default(false),
  submitterName: z.string().optional().nullable(),
  submitterEmail: z.string().email().optional().nullable(),
  submitterPhone: z.string().optional().nullable(),
})

export async function GET(request: Request) {
  const access = await requireReviewerAccess(request)
  if (!access.ok) {
    return access.response
  }

  const { searchParams } = new URL(request.url)

  const parseResult = z
    .object({
      status: z
        .enum(["Pending Review", "Under Investigation", "Needs More Info", "Verified", "Closed"])
        .optional(),
      county: z.string().optional(),
      reportType: z.string().optional(),
      limit: z.coerce.number().int().min(1).max(1000).default(100),
      offset: z.coerce.number().int().min(0).default(0),
    })
    .safeParse({
      status: searchParams.get("status") || undefined,
      county: searchParams.get("county") || undefined,
      reportType: searchParams.get("reportType") || undefined,
      limit: searchParams.get("limit") || undefined,
      offset: searchParams.get("offset") || undefined,
    })

  if (!parseResult.success) {
    return jsonError("Invalid query parameters", 400, parseResult.error.flatten())
  }

  const params = parseResult.data
  const { data, error } = await fetchReports(params)
  if (error) {
    return jsonError(error, 500)
  }

  return jsonOk({
    data,
    meta: {
      limit: params.limit,
      offset: params.offset,
      count: data.length,
    },
  })
}

export async function POST(request: Request) {
  const rateLimitCheck = checkIpRateLimit(request, {
    namespace: "report-submit",
    limit: REPORT_SUBMISSION_LIMIT,
    windowMs: REPORT_SUBMISSION_WINDOW_MS,
  })
  if (!rateLimitCheck.allowed) {
    return jsonRateLimitError("Too many report submissions. Please try again later.", rateLimitCheck)
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return jsonError("Invalid JSON payload", 400)
  }

  const parsed = createReportSchema.safeParse(payload)
  if (!parsed.success) {
    return jsonError("Invalid report payload", 400, parsed.error.flatten())
  }

  const { data, error } = await createReport(parsed.data)
  if (error || !data) {
    return jsonError(error || "Could not create report", 500)
  }

  const uploadToken = createEvidenceUploadToken(data.publicId)

  return jsonOk(
    {
      data,
      uploadToken,
      message: "Report submitted successfully",
    },
    { status: 201, headers: rateLimitCheck.headers },
  )
}
