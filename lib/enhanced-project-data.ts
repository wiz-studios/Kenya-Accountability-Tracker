export interface EnhancedProject {
  id: string | number
  name: string
  description: string
  county: string
  countyId: string
  constituency: string
  constituencyId: string
  sector: string
  budget: number
  spent: number
  status: string
  startDate: string
  expectedCompletion: string
  actualStatus: string
  progress: number
  contractor: string
  supervisor: string
  issues: string[]
  lastUpdate: string
  source: string
  urgency: "high" | "medium" | "low"
  images: string[]
  documents: string[]
  mp: string
  governor: string
  beneficiaries?: number
  employmentCreated?: number
  coordinates?: {
    lat: number
    lng: number
  }
}

// Enhanced project data with proper location mapping
export const enhancedProjectData: EnhancedProject[] = [
  {
    id: 1,
    name: "Nairobi BRT System Phase 1",
    description:
      "Bus Rapid Transit system connecting Thika Road to Ngong Road with dedicated lanes and modern stations",
    county: "Nairobi",
    countyId: "nairobi",
    constituency: "Westlands",
    constituencyId: "westlands",
    sector: "Transport",
    budget: 45200000000,
    spent: 12800000000,
    status: "Stalled",
    startDate: "2019-03-15",
    expectedCompletion: "2022-12-31",
    actualStatus: "28% Complete",
    progress: 28,
    contractor: "China Communications Construction Company",
    supervisor: "KeNHA",
    issues: ["Contractor disputes", "Environmental concerns", "Budget overruns", "Land acquisition delays"],
    lastUpdate: "2025-05-15",
    source: "Ministry of Transport",
    urgency: "high",
    images: ["/placeholder.svg?height=300&width=400"],
    documents: ["Project Proposal.pdf", "Environmental Impact Assessment.pdf", "Contract Agreement.pdf"],
    mp: "Hon. Timothy Wanyonyi",
    governor: "Johnson Sakaja",
    beneficiaries: 2500000,
    employmentCreated: 15000,
    coordinates: { lat: -1.2676, lng: 36.8108 },
  },
  {
    id: 2,
    name: "Kisumu Water Treatment Plant Expansion",
    description: "Expansion of water treatment capacity to serve 500,000 residents with clean drinking water",
    county: "Kisumu",
    countyId: "kisumu",
    constituency: "Kisumu Central",
    constituencyId: "kisumu-central",
    sector: "Water",
    budget: 8700000000,
    spent: 3200000000,
    status: "Delayed",
    startDate: "2020-06-01",
    expectedCompletion: "2023-08-30",
    actualStatus: "37% Complete",
    progress: 37,
    contractor: "Aqua Engineering Ltd",
    supervisor: "Lake Victoria South Water Services Board",
    issues: ["Land acquisition delays", "Technical challenges", "Funding shortfall"],
    lastUpdate: "2025-04-20",
    source: "County Government",
    urgency: "medium",
    images: ["/placeholder.svg?height=300&width=400"],
    documents: ["Feasibility Study.pdf", "Technical Drawings.pdf"],
    mp: "Hon. Joshua Oron",
    governor: "Prof. Anyang' Nyong'o",
    beneficiaries: 500000,
    employmentCreated: 2500,
    coordinates: { lat: -0.0917, lng: 34.768 },
  },
  {
    id: 3,
    name: "Mombasa Port Modernization Phase 2",
    description: "Expansion of container handling capacity and construction of new berths for larger vessels",
    county: "Mombasa",
    countyId: "mombasa",
    constituency: "Mvita",
    constituencyId: "mvita",
    sector: "Transport",
    budget: 23100000000,
    spent: 18500000000,
    status: "Behind Schedule",
    startDate: "2018-01-10",
    expectedCompletion: "2024-06-30",
    actualStatus: "80% Complete",
    progress: 80,
    contractor: "China Road and Bridge Corporation",
    supervisor: "Kenya Ports Authority",
    issues: ["Equipment procurement delays", "Weather disruptions"],
    lastUpdate: "2025-05-30",
    source: "Kenya Ports Authority",
    urgency: "low",
    images: ["/placeholder.svg?height=300&width=400"],
    documents: ["Progress Report May 2025.pdf", "Equipment List.pdf"],
    mp: "Hon. Abdulswamad Nassir",
    governor: "Abdulswamad Nassir",
    beneficiaries: 1200000,
    employmentCreated: 8500,
    coordinates: { lat: -4.05, lng: 39.6833 },
  },
  {
    id: 4,
    name: "Nakuru Level 5 Hospital Expansion",
    description: "Construction of modern healthcare facility with specialized departments and equipment",
    county: "Nakuru",
    countyId: "nakuru",
    constituency: "Nakuru Town East",
    constituencyId: "nakuru-town-east",
    sector: "Health",
    budget: 3200000000,
    spent: 480000000,
    status: "Stalled",
    startDate: "2021-02-15",
    expectedCompletion: "2024-02-15",
    actualStatus: "15% Complete",
    progress: 15,
    contractor: "Local Construction Ltd",
    supervisor: "Ministry of Health",
    issues: ["Funding shortfall", "Design changes", "Contractor issues"],
    lastUpdate: "2025-03-10",
    source: "County Government",
    urgency: "high",
    images: ["/placeholder.svg?height=300&width=400"],
    documents: ["Hospital Design.pdf", "Medical Equipment List.pdf"],
    mp: "Hon. David Gikaria",
    governor: "Susan Kihika",
    beneficiaries: 800000,
    employmentCreated: 1200,
    coordinates: { lat: -0.3031, lng: 36.1034 },
  },
  {
    id: 5,
    name: "Eldoret Sports Complex",
    description: "Multi-purpose sports facility with stadium, swimming pool, and training facilities",
    county: "Uasin Gishu",
    countyId: "uasin-gishu",
    constituency: "Kapseret",
    constituencyId: "kapseret",
    sector: "Sports",
    budget: 2800000000,
    spent: 2240000000,
    status: "Completed",
    startDate: "2020-01-15",
    expectedCompletion: "2023-12-31",
    actualStatus: "100% Complete",
    progress: 100,
    contractor: "Sports Infrastructure Ltd",
    supervisor: "Ministry of Sports",
    issues: [],
    lastUpdate: "2024-01-15",
    source: "County Government",
    urgency: "low",
    images: ["/placeholder.svg?height=300&width=400"],
    documents: ["Completion Certificate.pdf", "Facility Manual.pdf"],
    mp: "Hon. Oscar Sudi",
    governor: "Jonathan Bii",
    beneficiaries: 300000,
    employmentCreated: 800,
    coordinates: { lat: 0.2345, lng: 35.5678 },
  },
  {
    id: 6,
    name: "Thika Superhighway Maintenance",
    description: "Major maintenance and upgrade of the Thika Superhighway including new interchanges",
    county: "Kiambu",
    countyId: "kiambu",
    constituency: "Juja",
    constituencyId: "juja",
    sector: "Transport",
    budget: 15600000000,
    spent: 9360000000,
    status: "Delayed",
    startDate: "2022-03-01",
    expectedCompletion: "2025-03-01",
    actualStatus: "60% Complete",
    progress: 60,
    contractor: "Highway Construction Consortium",
    supervisor: "KeNHA",
    issues: ["Weather delays", "Material shortages", "Traffic management challenges"],
    lastUpdate: "2025-05-20",
    source: "Kenya National Highways Authority",
    urgency: "medium",
    images: ["/placeholder.svg?height=300&width=400"],
    documents: ["Highway Plans.pdf", "Traffic Impact Study.pdf"],
    mp: "Hon. George Koimburi",
    governor: "Kimani Wamatangi",
    beneficiaries: 1800000,
    employmentCreated: 5500,
    coordinates: { lat: -1.1, lng: 37.0167 },
  },
]

// Utility functions for project data
export function getProjectsByLocation(countyId?: string, constituencyId?: string): EnhancedProject[] {
  if (constituencyId) {
    return enhancedProjectData.filter((project) => project.constituencyId === constituencyId)
  } else if (countyId) {
    return enhancedProjectData.filter((project) => project.countyId === countyId)
  }
  return enhancedProjectData
}

export function getProjectStats(projects: EnhancedProject[]) {
  const totalProjects = projects.length
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0)
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0)
  const totalBeneficiaries = projects.reduce((sum, p) => sum + (p.beneficiaries || 0), 0)
  const totalEmployment = projects.reduce((sum, p) => sum + (p.employmentCreated || 0), 0)
  const averageProgress = Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects || 0)

  const statusCounts = projects.reduce(
    (acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return {
    totalProjects,
    totalBudget,
    totalSpent,
    totalBeneficiaries,
    totalEmployment,
    averageProgress,
    statusCounts,
  }
}

export function searchProjects(query: string): EnhancedProject[] {
  const lowerQuery = query.toLowerCase()
  return enhancedProjectData.filter(
    (project) =>
      project.name.toLowerCase().includes(lowerQuery) ||
      project.description.toLowerCase().includes(lowerQuery) ||
      project.county.toLowerCase().includes(lowerQuery) ||
      project.constituency.toLowerCase().includes(lowerQuery) ||
      project.sector.toLowerCase().includes(lowerQuery) ||
      project.contractor.toLowerCase().includes(lowerQuery),
  )
}
