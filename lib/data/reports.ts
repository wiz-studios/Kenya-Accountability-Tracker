import { getSupabaseServiceRoleClient } from "@/lib/supabase-client"
import type { Report, ReportEvidence, ReportStatus, ReportStatusEvent } from "@/lib/types"
import { fallbackReports } from "@/lib/data/mock-reports"

export type CreateReportInput = {
  reportType: string
  title: string
  description: string
  county: string
  constituency?: string | null
  projectName?: string | null
  involvedParties?: string | null
  estimatedAmount?: number | null
  occurredOn?: string | null
  reportedElsewhere?: string | null
  isAnonymous: boolean
  allowContact: boolean
  submitterName?: string | null
  submitterEmail?: string | null
  submitterPhone?: string | null
}

export type ReviewUpdateInput = {
  status?: ReportStatus
  confidenceScore?: number
  verificationNotes?: string | null
  assignedReviewer?: string | null
}

export type ReportEvidenceInput = {
  label: string
  fileUrl?: string | null
  mimeType?: string | null
  fileSizeBytes?: number | null
  sourceUrl?: string | null
  checksum?: string | null
  verificationState?: "unverified" | "verified" | "rejected"
}

export type EvidenceReviewUpdateInput = {
  verificationState: "unverified" | "verified" | "rejected"
  note?: string | null
  changedBy?: string | null
}

export type ReportFilters = {
  status?: ReportStatus
  county?: string
  reportType?: string
  limit?: number
  offset?: number
}

let inMemoryReports = [...fallbackReports]
const inMemoryEvidenceByPublicId = new Map<string, ReportEvidence[]>()
const inMemoryStatusEventsByPublicId = new Map<string, ReportStatusEvent[]>(
  fallbackReports.map((report, index) => [
    report.publicId,
    [
      {
        id: `status-event-seed-${index + 1}`,
        reportId: report.id,
        fromStatus: null,
        toStatus: report.status,
        note: "Report ingested",
        changedBy: "System",
        insertedAt: report.insertedAt,
      },
    ],
  ]),
)

const mapReportRow = (row: Record<string, any>): Report => ({
  id: row.id?.toString() ?? "",
  publicId: row.public_id ?? row.publicId ?? "",
  reportType: row.report_type ?? row.reportType ?? "",
  title: row.title ?? "",
  description: row.description ?? "",
  county: row.county ?? "",
  constituency: row.constituency ?? null,
  projectName: row.project_name ?? row.projectName ?? null,
  involvedParties: row.involved_parties ?? row.involvedParties ?? null,
  estimatedAmount: row.estimated_amount ?? row.estimatedAmount ?? null,
  occurredOn: row.occurred_on ?? row.occurredOn ?? null,
  reportedElsewhere: row.reported_elsewhere ?? row.reportedElsewhere ?? null,
  status: (row.status ?? "Pending Review") as ReportStatus,
  confidenceScore: row.confidence_score ?? row.confidenceScore ?? 0,
  isAnonymous: row.is_anonymous ?? row.isAnonymous ?? true,
  allowContact: row.allow_contact ?? row.allowContact ?? false,
  submitterName: row.submitter_name ?? row.submitterName ?? null,
  submitterEmail: row.submitter_email ?? row.submitterEmail ?? null,
  submitterPhone: row.submitter_phone ?? row.submitterPhone ?? null,
  sourceTrust: row.source_trust ?? row.sourceTrust ?? 0,
  verificationNotes: row.verification_notes ?? row.verificationNotes ?? null,
  assignedReviewer: row.assigned_reviewer ?? row.assignedReviewer ?? null,
  insertedAt: row.inserted_at ?? row.insertedAt ?? new Date().toISOString(),
  updatedAt: row.updated_at ?? row.updatedAt ?? new Date().toISOString(),
})

const mapEvidenceRow = (row: Record<string, any>): ReportEvidence => ({
  id: row.id?.toString() ?? "",
  reportId: row.report_id ?? row.reportId ?? "",
  label: row.label ?? "",
  fileUrl: row.file_url ?? row.fileUrl ?? null,
  mimeType: row.mime_type ?? row.mimeType ?? null,
  fileSizeBytes: row.file_size_bytes ?? row.fileSizeBytes ?? null,
  sourceUrl: row.source_url ?? row.sourceUrl ?? null,
  checksum: row.checksum ?? null,
  verificationState: (row.verification_state ?? row.verificationState ?? "unverified") as ReportEvidence["verificationState"],
  insertedAt: row.inserted_at ?? row.insertedAt ?? new Date().toISOString(),
})

const mapStatusEventRow = (row: Record<string, any>): ReportStatusEvent => ({
  id: row.id?.toString() ?? "",
  reportId: row.report_id ?? row.reportId ?? "",
  fromStatus: (row.from_status ?? row.fromStatus ?? null) as ReportStatus | null,
  toStatus: (row.to_status ?? row.toStatus ?? "Pending Review") as ReportStatus,
  note: row.note ?? null,
  changedBy: row.changed_by ?? row.changedBy ?? null,
  insertedAt: row.inserted_at ?? row.insertedAt ?? new Date().toISOString(),
})

const parseStorageUri = (value: string): { bucket: string; path: string } | null => {
  if (!value.startsWith("storage://")) return null
  const withoutPrefix = value.replace("storage://", "")
  const slashIndex = withoutPrefix.indexOf("/")
  if (slashIndex <= 0) return null
  const bucket = withoutPrefix.slice(0, slashIndex)
  const path = withoutPrefix.slice(slashIndex + 1)
  if (!bucket || !path) return null
  return { bucket, path }
}

const hydrateEvidenceFileUrl = async (evidence: ReportEvidence): Promise<ReportEvidence> => {
  if (!evidence.fileUrl) return evidence
  const parsed = parseStorageUri(evidence.fileUrl)
  if (!parsed) return evidence

  const supabase = getSupabaseServiceRoleClient()
  if (!supabase) return evidence

  const signedResult = await supabase.storage.from(parsed.bucket).createSignedUrl(parsed.path, 60 * 60)
  if (signedResult.error || !signedResult.data?.signedUrl) {
    return evidence
  }

  return {
    ...evidence,
    fileUrl: signedResult.data.signedUrl,
  }
}

const buildPublicId = () => {
  const year = new Date().getUTCFullYear()
  const serial = crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()
  return `KAT-${year}-${serial}`
}

const appendInMemoryStatusEvent = (
  publicId: string,
  reportId: string,
  input: { fromStatus?: ReportStatus | null; toStatus: ReportStatus; note?: string | null; changedBy?: string | null },
) => {
  const current = inMemoryStatusEventsByPublicId.get(publicId) || []
  const event: ReportStatusEvent = {
    id: `status-event-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    reportId,
    fromStatus: input.fromStatus ?? null,
    toStatus: input.toStatus,
    note: input.note ?? null,
    changedBy: input.changedBy ?? null,
    insertedAt: new Date().toISOString(),
  }
  inMemoryStatusEventsByPublicId.set(publicId, [event, ...current])
  return event
}

const insertSupabaseStatusEvent = async (input: {
  reportId: string
  fromStatus?: ReportStatus | null
  toStatus: ReportStatus
  note?: string | null
  changedBy?: string | null
}) => {
  const supabase = getSupabaseServiceRoleClient()
  if (!supabase) return
  const { error } = await supabase.from("report_status_events").insert({
    report_id: input.reportId,
    from_status: input.fromStatus ?? null,
    to_status: input.toStatus,
    note: input.note ?? null,
    changed_by: input.changedBy ?? null,
  })
  if (error) {
    console.warn("report_status_events insert failed:", error.message)
  }
}

const getSupabaseReportRecordByPublicId = async (publicId: string) => {
  const supabase = getSupabaseServiceRoleClient()
  if (!supabase)
    return {
      reportId: null as string | null,
      currentStatus: null as ReportStatus | null,
      error: "Supabase not configured",
    }

  const { data, error } = await supabase
    .from("reports")
    .select("id,status")
    .eq("public_id", publicId)
    .limit(1)
    .maybeSingle()
  if (error)
    return {
      reportId: null as string | null,
      currentStatus: null as ReportStatus | null,
      error: error.message,
    }
  if (!data?.id)
    return {
      reportId: null as string | null,
      currentStatus: null as ReportStatus | null,
      error: `Report '${publicId}' not found`,
    }

  return {
    reportId: String(data.id),
    currentStatus: (data.status ?? "Pending Review") as ReportStatus,
    error: undefined as string | undefined,
  }
}

export async function fetchReports(filters: ReportFilters = {}): Promise<{ data: Report[]; error?: string }> {
  const supabase = getSupabaseServiceRoleClient()
  const { status, county, reportType, limit = 100, offset = 0 } = filters

  if (!supabase) {
    let filtered = [...inMemoryReports]
    if (status) filtered = filtered.filter((report) => report.status === status)
    if (county) filtered = filtered.filter((report) => report.county === county)
    if (reportType) filtered = filtered.filter((report) => report.reportType === reportType)
    filtered.sort((a, b) => new Date(b.insertedAt).getTime() - new Date(a.insertedAt).getTime())
    return { data: filtered.slice(offset, offset + limit) }
  }

  let query = supabase.from("reports").select("*")
  if (status) query = query.eq("status", status)
  if (county) query = query.eq("county", county)
  if (reportType) query = query.eq("report_type", reportType)
  query = query.order("inserted_at", { ascending: false })

  const { data, error } = await query.range(offset, offset + limit - 1)
  if (error) {
    return { data: [], error: error.message }
  }

  return { data: (data || []).map(mapReportRow) }
}

export async function fetchReportByPublicId(publicId: string): Promise<{ data?: Report; error?: string }> {
  if (!publicId) {
    return { error: "Report id is required" }
  }

  const supabase = getSupabaseServiceRoleClient()

  if (!supabase) {
    const report = inMemoryReports.find((item) => item.publicId === publicId)
    if (!report) {
      return { error: `Report '${publicId}' not found` }
    }
    return { data: report }
  }

  const { data, error } = await supabase.from("reports").select("*").eq("public_id", publicId).limit(1).maybeSingle()
  if (error) {
    return { error: error.message }
  }
  if (!data) {
    return { error: `Report '${publicId}' not found` }
  }

  return { data: mapReportRow(data as Record<string, any>) }
}

export async function createReport(input: CreateReportInput): Promise<{ data?: Report; error?: string }> {
  const publicId = buildPublicId()
  const now = new Date().toISOString()
  const confidenceScore = input.reportType === "corruption" ? 72 : 64
  const sourceTrust = input.isAnonymous ? 68 : 78
  const supabase = getSupabaseServiceRoleClient()

  if (!supabase) {
    const created: Report = {
      id: `report-${Date.now()}`,
      publicId,
      reportType: input.reportType,
      title: input.title,
      description: input.description,
      county: input.county,
      constituency: input.constituency ?? null,
      projectName: input.projectName ?? null,
      involvedParties: input.involvedParties ?? null,
      estimatedAmount: input.estimatedAmount ?? null,
      occurredOn: input.occurredOn ?? null,
      reportedElsewhere: input.reportedElsewhere ?? null,
      status: "Pending Review",
      confidenceScore,
      isAnonymous: input.isAnonymous,
      allowContact: input.allowContact,
      submitterName: input.submitterName ?? null,
      submitterEmail: input.submitterEmail ?? null,
      submitterPhone: input.submitterPhone ?? null,
      sourceTrust,
      verificationNotes: null,
      assignedReviewer: null,
      insertedAt: now,
      updatedAt: now,
    }
    inMemoryReports = [created, ...inMemoryReports]
    appendInMemoryStatusEvent(publicId, created.id, {
      fromStatus: null,
      toStatus: created.status,
      note: "Report submitted",
      changedBy: created.isAnonymous ? "Anonymous Reporter" : created.submitterName || "Reporter",
    })
    return { data: created }
  }

  const { data, error } = await supabase
    .from("reports")
    .insert({
      public_id: publicId,
      report_type: input.reportType,
      title: input.title,
      description: input.description,
      county: input.county,
      constituency: input.constituency ?? null,
      project_name: input.projectName ?? null,
      involved_parties: input.involvedParties ?? null,
      estimated_amount: input.estimatedAmount ?? 0,
      occurred_on: input.occurredOn ?? null,
      reported_elsewhere: input.reportedElsewhere ?? null,
      status: "Pending Review",
      confidence_score: confidenceScore,
      is_anonymous: input.isAnonymous,
      allow_contact: input.allowContact,
      submitter_name: input.submitterName ?? null,
      submitter_email: input.submitterEmail ?? null,
      submitter_phone: input.submitterPhone ?? null,
      source_trust: sourceTrust,
      updated_at: now,
    })
    .select("*")
    .limit(1)
    .maybeSingle()

  if (error) {
    return { error: error.message }
  }
  if (!data) {
    return { error: "Report was not created" }
  }

  await insertSupabaseStatusEvent({
    reportId: String(data.id),
    fromStatus: null,
    toStatus: "Pending Review",
    note: "Report submitted",
    changedBy: input.isAnonymous ? "Anonymous Reporter" : input.submitterName || "Reporter",
  })

  return { data: mapReportRow(data as Record<string, any>) }
}

export async function updateReportReview(publicId: string, input: ReviewUpdateInput): Promise<{ data?: Report; error?: string }> {
  if (!publicId) {
    return { error: "Report id is required" }
  }

  const now = new Date().toISOString()
  const supabase = getSupabaseServiceRoleClient()

  if (!supabase) {
    const reportIndex = inMemoryReports.findIndex((report) => report.publicId === publicId)
    if (reportIndex === -1) return { error: `Report '${publicId}' not found` }

    const current = inMemoryReports[reportIndex]
    const updated: Report = {
      ...current,
      status: input.status ?? current.status,
      confidenceScore: input.confidenceScore ?? current.confidenceScore,
      verificationNotes: input.verificationNotes ?? current.verificationNotes ?? null,
      assignedReviewer: input.assignedReviewer ?? current.assignedReviewer ?? null,
      updatedAt: now,
    }
    inMemoryReports = [...inMemoryReports.slice(0, reportIndex), updated, ...inMemoryReports.slice(reportIndex + 1)]
    if (
      input.status !== undefined ||
      input.verificationNotes !== undefined ||
      input.assignedReviewer !== undefined ||
      input.confidenceScore !== undefined
    ) {
      appendInMemoryStatusEvent(publicId, updated.id, {
        fromStatus: current.status,
        toStatus: updated.status,
        note: input.verificationNotes ?? `Report review updated${input.confidenceScore !== undefined ? " (confidence adjusted)" : ""}.`,
        changedBy: input.assignedReviewer ?? "Reviewer",
      })
    }
    return { data: updated }
  }

  const existing = await supabase.from("reports").select("id,status").eq("public_id", publicId).limit(1).maybeSingle()
  if (existing.error) return { error: existing.error.message }
  if (!existing.data) return { error: `Report '${publicId}' not found` }
  const previousStatus = (existing.data.status ?? "Pending Review") as ReportStatus

  const { data, error } = await supabase
    .from("reports")
    .update({
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.confidenceScore !== undefined ? { confidence_score: input.confidenceScore } : {}),
      ...(input.verificationNotes !== undefined ? { verification_notes: input.verificationNotes } : {}),
      ...(input.assignedReviewer !== undefined ? { assigned_reviewer: input.assignedReviewer } : {}),
      updated_at: now,
    })
    .eq("public_id", publicId)
    .select("*")
    .limit(1)
    .maybeSingle()

  if (error) return { error: error.message }
  if (!data) return { error: `Report '${publicId}' not found` }

  if (
    input.status !== undefined ||
    input.verificationNotes !== undefined ||
    input.assignedReviewer !== undefined ||
    input.confidenceScore !== undefined
  ) {
    await insertSupabaseStatusEvent({
      reportId: String(existing.data.id),
      fromStatus: previousStatus,
      toStatus: (input.status ?? previousStatus) as ReportStatus,
      note: input.verificationNotes ?? `Report review updated${input.confidenceScore !== undefined ? " (confidence adjusted)" : ""}.`,
      changedBy: input.assignedReviewer ?? "Reviewer",
    })
  }

  return { data: mapReportRow(data as Record<string, any>) }
}

export async function fetchReportEvidence(publicId: string): Promise<{ data: ReportEvidence[]; error?: string }> {
  if (!publicId) return { data: [], error: "Report id is required" }

  const supabase = getSupabaseServiceRoleClient()
  if (!supabase) {
    return { data: inMemoryEvidenceByPublicId.get(publicId) || [] }
  }

  const reportIdResult = await getSupabaseReportRecordByPublicId(publicId)
  if (reportIdResult.error || !reportIdResult.reportId) {
    return { data: [], error: reportIdResult.error }
  }

  const { data, error } = await supabase
    .from("evidence")
    .select("*")
    .eq("report_id", reportIdResult.reportId)
    .order("inserted_at", { ascending: false })

  if (error) return { data: [], error: error.message }
  const mapped = (data || []).map((row) => mapEvidenceRow(row as Record<string, any>))
  const hydrated = await Promise.all(mapped.map((entry) => hydrateEvidenceFileUrl(entry)))
  return { data: hydrated }
}

export async function addReportEvidence(
  publicId: string,
  input: ReportEvidenceInput,
): Promise<{ data?: ReportEvidence; error?: string }> {
  if (!publicId) return { error: "Report id is required" }
  if (!input.label?.trim()) return { error: "Evidence label is required" }

  const now = new Date().toISOString()
  const supabase = getSupabaseServiceRoleClient()

  if (!supabase) {
    const report = inMemoryReports.find((item) => item.publicId === publicId)
    if (!report) return { error: `Report '${publicId}' not found` }

    const entry: ReportEvidence = {
      id: `evidence-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      reportId: report.id,
      label: input.label,
      fileUrl: input.fileUrl ?? null,
      mimeType: input.mimeType ?? null,
      fileSizeBytes: input.fileSizeBytes ?? null,
      sourceUrl: input.sourceUrl ?? null,
      checksum: input.checksum ?? null,
      verificationState: input.verificationState ?? "unverified",
      insertedAt: now,
    }
    const existing = inMemoryEvidenceByPublicId.get(publicId) || []
    inMemoryEvidenceByPublicId.set(publicId, [entry, ...existing])
    appendInMemoryStatusEvent(publicId, report.id, {
      fromStatus: report.status,
      toStatus: report.status,
      note: `Evidence added: ${entry.label}`,
      changedBy: "Reporter",
    })
    return { data: entry }
  }

  const reportIdResult = await getSupabaseReportRecordByPublicId(publicId)
  if (reportIdResult.error || !reportIdResult.reportId) {
    return { error: reportIdResult.error }
  }

  const { data, error } = await supabase
    .from("evidence")
    .insert({
      report_id: reportIdResult.reportId,
      label: input.label,
      file_url: input.fileUrl ?? null,
      mime_type: input.mimeType ?? null,
      file_size_bytes: input.fileSizeBytes ?? null,
      source_url: input.sourceUrl ?? null,
      checksum: input.checksum ?? null,
      verification_state: input.verificationState ?? "unverified",
    })
    .select("*")
    .limit(1)
    .maybeSingle()

  if (error) return { error: error.message }
  if (!data) return { error: "Evidence was not created" }
  if (reportIdResult.currentStatus) {
    await insertSupabaseStatusEvent({
      reportId: reportIdResult.reportId,
      fromStatus: reportIdResult.currentStatus,
      toStatus: reportIdResult.currentStatus,
      note: `Evidence added: ${input.label}`,
      changedBy: "Reporter",
    })
  }
  return { data: mapEvidenceRow(data as Record<string, any>) }
}

export async function updateReportEvidence(
  publicId: string,
  evidenceId: string,
  input: EvidenceReviewUpdateInput,
): Promise<{ data?: ReportEvidence; error?: string }> {
  if (!publicId) return { error: "Report id is required" }
  if (!evidenceId) return { error: "Evidence id is required" }

  const supabase = getSupabaseServiceRoleClient()

  if (!supabase) {
    const report = inMemoryReports.find((item) => item.publicId === publicId)
    if (!report) return { error: `Report '${publicId}' not found` }

    const evidenceList = inMemoryEvidenceByPublicId.get(publicId) || []
    const evidenceIndex = evidenceList.findIndex((entry) => entry.id === evidenceId)
    if (evidenceIndex === -1) return { error: `Evidence '${evidenceId}' not found` }

    const current = evidenceList[evidenceIndex]
    const updated: ReportEvidence = {
      ...current,
      verificationState: input.verificationState,
    }
    const nextList = [...evidenceList.slice(0, evidenceIndex), updated, ...evidenceList.slice(evidenceIndex + 1)]
    inMemoryEvidenceByPublicId.set(publicId, nextList)
    appendInMemoryStatusEvent(publicId, report.id, {
      fromStatus: report.status,
      toStatus: report.status,
      note: input.note ?? `Evidence '${updated.label}' marked as ${input.verificationState}.`,
      changedBy: input.changedBy ?? "Reviewer",
    })
    return { data: updated }
  }

  const reportRecord = await getSupabaseReportRecordByPublicId(publicId)
  if (reportRecord.error || !reportRecord.reportId || !reportRecord.currentStatus) {
    return { error: reportRecord.error }
  }

  const { data, error } = await supabase
    .from("evidence")
    .update({
      verification_state: input.verificationState,
    })
    .eq("id", evidenceId)
    .eq("report_id", reportRecord.reportId)
    .select("*")
    .limit(1)
    .maybeSingle()

  if (error) return { error: error.message }
  if (!data) return { error: `Evidence '${evidenceId}' not found` }

  await insertSupabaseStatusEvent({
    reportId: reportRecord.reportId,
    fromStatus: reportRecord.currentStatus,
    toStatus: reportRecord.currentStatus,
    note: input.note ?? `Evidence '${data.label ?? evidenceId}' marked as ${input.verificationState}.`,
    changedBy: input.changedBy ?? "Reviewer",
  })

  return { data: mapEvidenceRow(data as Record<string, any>) }
}

export async function fetchReportTimeline(publicId: string): Promise<{ data: ReportStatusEvent[]; error?: string }> {
  if (!publicId) return { data: [], error: "Report id is required" }

  const supabase = getSupabaseServiceRoleClient()
  if (!supabase) {
    return { data: inMemoryStatusEventsByPublicId.get(publicId) || [] }
  }

  const reportIdResult = await getSupabaseReportRecordByPublicId(publicId)
  if (reportIdResult.error || !reportIdResult.reportId) {
    return { data: [], error: reportIdResult.error }
  }

  const { data, error } = await supabase
    .from("report_status_events")
    .select("*")
    .eq("report_id", reportIdResult.reportId)
    .order("inserted_at", { ascending: false })

  if (error) return { data: [], error: error.message }

  return { data: (data || []).map((row) => mapStatusEventRow(row as Record<string, any>)) }
}
