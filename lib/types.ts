export type Leader = {
  id: string
  name: string
  position: string
  county: string
  constituency: string
  party: string
  term: string
  allegations: number
  projectsOverseen: number
  budgetManaged: number
  accountabilityScore: number
  phone?: string | null
  email?: string | null
  photoUrl?: string | null
  recentActions?: string[] | null
  keyProjects?: string[] | null
  socialTwitter?: string | null
  socialFacebook?: string | null
}

export type Senator = {
  id: string
  name: string
  county: string
  party: string
  role: string
  term: string
  phone?: string
  email?: string
  image?: string
}

export type Project = {
  id: string
  name: string
  county: string
  constituency: string
  sector: string
  status: string
  budgetAllocated: number
  budgetSpent: number
  riskScore: number
  startDate?: string | null
  endDate?: string | null
  latitude?: number | null
  longitude?: number | null
}

export type Expenditure = {
  id: string
  category: string
  amount: number
  date: string
  description: string
  status: string
  riskScore: number
  referenceUrl?: string | null
  source?: string | null
  tags?: string[] | null
}

export type DataSource = {
  id: string
  name: string
  type: string
  description: string
  url: string
  trustScore: number
  status: "active" | "inactive" | "pending"
  frequency: string
  coverage: string
  dataTypes: string[]
  categories: string[]
  lastUpdate: string
  recordsCount: number
}

export type ReportStatus =
  | "Pending Review"
  | "Under Investigation"
  | "Needs More Info"
  | "Verified"
  | "Closed"

export type Report = {
  id: string
  publicId: string
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
  status: ReportStatus
  confidenceScore: number
  isAnonymous: boolean
  allowContact: boolean
  submitterName?: string | null
  submitterEmail?: string | null
  submitterPhone?: string | null
  sourceTrust: number
  verificationNotes?: string | null
  assignedReviewer?: string | null
  insertedAt: string
  updatedAt: string
}

export type ReportEvidence = {
  id: string
  reportId: string
  label: string
  fileUrl?: string | null
  mimeType?: string | null
  fileSizeBytes?: number | null
  sourceUrl?: string | null
  checksum?: string | null
  verificationState: "unverified" | "verified" | "rejected"
  insertedAt: string
}

export type ReportStatusEvent = {
  id: string
  reportId: string
  fromStatus?: ReportStatus | null
  toStatus: ReportStatus
  note?: string | null
  changedBy?: string | null
  insertedAt: string
}
