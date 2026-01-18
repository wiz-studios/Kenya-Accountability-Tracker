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
