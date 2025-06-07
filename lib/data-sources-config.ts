// Comprehensive data sources configuration for Kenya project tracking
export interface DataSourceConfig {
  id: string
  name: string
  type: "government" | "private" | "ngo" | "media" | "crowdsourced"
  url: string
  apiEndpoint?: string
  authMethod: "api_key" | "oauth" | "basic" | "none"
  dataFormat: "json" | "xml" | "csv" | "pdf" | "html"
  updateFrequency: "real-time" | "hourly" | "daily" | "weekly" | "monthly"
  trustScore: number
  extractionMethod: "api" | "scraping" | "manual" | "file_upload"
  fieldMapping: Record<string, string>
  validationRules: ValidationRule[]
  accessRestrictions?: string[]
  lastSuccessfulSync?: string
  status: "active" | "inactive" | "error" | "pending"
}

export interface ValidationRule {
  field: string
  type: "required" | "format" | "range" | "enum" | "custom"
  rule: string | number | string[]
  errorMessage: string
}

export const dataSourcesConfig: DataSourceConfig[] = [
  {
    id: "kenya-open-data",
    name: "Kenya Open Data Portal",
    type: "government",
    url: "https://opendata.go.ke",
    apiEndpoint: "https://opendata.go.ke/api/3/action",
    authMethod: "api_key",
    dataFormat: "json",
    updateFrequency: "daily",
    trustScore: 95,
    extractionMethod: "api",
    fieldMapping: {
      project_id: "id",
      project_name: "title",
      budget: "allocated_budget",
      status: "project_status",
      start_date: "commencement_date",
      location: "county",
      contractor: "implementing_agency",
    },
    validationRules: [
      { field: "project_id", type: "required", rule: "", errorMessage: "Project ID is required" },
      { field: "budget", type: "range", rule: 1000000, errorMessage: "Budget must be at least 1M KSh" },
      {
        field: "status",
        type: "enum",
        rule: ["Active", "Stalled", "Completed", "Cancelled"],
        errorMessage: "Invalid status",
      },
    ],
    status: "active",
  },
  {
    id: "auditor-general",
    name: "Office of the Auditor General",
    type: "government",
    url: "https://oagkenya.go.ke",
    authMethod: "none",
    dataFormat: "pdf",
    updateFrequency: "monthly",
    trustScore: 98,
    extractionMethod: "scraping",
    fieldMapping: {
      project_name: "project_title",
      findings: "audit_findings",
      recommendations: "audit_recommendations",
      amount_questioned: "questioned_amount",
    },
    validationRules: [{ field: "project_name", type: "required", rule: "", errorMessage: "Project name is required" }],
    status: "active",
  },
  {
    id: "eacc-database",
    name: "Ethics and Anti-Corruption Commission",
    type: "government",
    url: "https://eacc.go.ke",
    authMethod: "oauth",
    dataFormat: "json",
    updateFrequency: "weekly",
    trustScore: 96,
    extractionMethod: "api",
    fieldMapping: {
      case_number: "id",
      project_involved: "project_name",
      corruption_type: "violation_type",
      amount_involved: "financial_loss",
    },
    validationRules: [{ field: "case_number", type: "required", rule: "", errorMessage: "Case number is required" }],
    status: "active",
  },
  {
    id: "county-governments",
    name: "County Government Portals",
    type: "government",
    url: "various",
    authMethod: "none",
    dataFormat: "html",
    updateFrequency: "weekly",
    trustScore: 85,
    extractionMethod: "scraping",
    fieldMapping: {
      project_name: "title",
      county: "location",
      budget: "allocation",
      progress: "completion_percentage",
    },
    validationRules: [{ field: "county", type: "required", rule: "", errorMessage: "County is required" }],
    status: "active",
  },
  {
    id: "construction-companies",
    name: "Construction Company Records",
    type: "private",
    url: "various",
    authMethod: "api_key",
    dataFormat: "json",
    updateFrequency: "daily",
    trustScore: 80,
    extractionMethod: "api",
    fieldMapping: {
      contract_id: "project_id",
      project_title: "name",
      client: "contracting_authority",
      value: "contract_value",
      status: "project_status",
    },
    validationRules: [{ field: "contract_id", type: "required", rule: "", errorMessage: "Contract ID is required" }],
    status: "active",
  },
  {
    id: "media-sources",
    name: "Media Reports Aggregator",
    type: "media",
    url: "various",
    authMethod: "api_key",
    dataFormat: "json",
    updateFrequency: "hourly",
    trustScore: 75,
    extractionMethod: "api",
    fieldMapping: {
      article_id: "id",
      headline: "title",
      content: "body",
      publication_date: "date",
      source: "publisher",
    },
    validationRules: [{ field: "headline", type: "required", rule: "", errorMessage: "Headline is required" }],
    status: "active",
  },
  {
    id: "citizen-reports",
    name: "Citizen Reporting Platform",
    type: "crowdsourced",
    url: "internal",
    authMethod: "none",
    dataFormat: "json",
    updateFrequency: "real-time",
    trustScore: 70,
    extractionMethod: "api",
    fieldMapping: {
      report_id: "id",
      project_name: "title",
      location: "county",
      issue_type: "category",
      evidence: "attachments",
    },
    validationRules: [
      { field: "project_name", type: "required", rule: "", errorMessage: "Project name is required" },
      { field: "location", type: "required", rule: "", errorMessage: "Location is required" },
    ],
    status: "active",
  },
]

// Stalled project identification criteria
export interface StalledProjectCriteria {
  id: string
  name: string
  description: string
  weight: number
  threshold: number | string
  evaluationFunction: string
}

export const stalledProjectCriteria: StalledProjectCriteria[] = [
  {
    id: "timeline_overrun",
    name: "Timeline Overrun",
    description: "Project has exceeded expected completion date by more than 6 months",
    weight: 0.3,
    threshold: 6,
    evaluationFunction: "monthsOverdue > threshold",
  },
  {
    id: "budget_overrun",
    name: "Budget Overrun",
    description: "Project has exceeded allocated budget by more than 20%",
    weight: 0.25,
    threshold: 0.2,
    evaluationFunction: "(actualSpent - allocatedBudget) / allocatedBudget > threshold",
  },
  {
    id: "no_progress_updates",
    name: "No Progress Updates",
    description: "No progress updates reported in the last 3 months",
    weight: 0.2,
    threshold: 90,
    evaluationFunction: "daysSinceLastUpdate > threshold",
  },
  {
    id: "contractor_disputes",
    name: "Contractor Disputes",
    description: "Active disputes or legal issues with contractors",
    weight: 0.15,
    threshold: 1,
    evaluationFunction: "activeDisputes >= threshold",
  },
  {
    id: "audit_findings",
    name: "Audit Findings",
    description: "Negative audit findings or financial irregularities",
    weight: 0.1,
    threshold: 1,
    evaluationFunction: "auditFindings >= threshold",
  },
]
