// Comprehensive data extraction and processing engine
import type { DataSourceConfig, ValidationRule } from "./data-sources-config"

export interface ExtractionResult {
  sourceId: string
  success: boolean
  recordsExtracted: number
  recordsValidated: number
  errors: string[]
  warnings: string[]
  extractedData: any[]
  extractionTime: Date
  nextScheduledExtraction?: Date
}

export interface ProjectRecord {
  id: string
  name: string
  description?: string
  county: string
  constituency?: string
  sector: string
  budget: number
  spent: number
  status: string
  startDate: Date
  expectedCompletion: Date
  lastUpdate: Date
  contractor?: string
  supervisor?: string
  coordinates?: { lat: number; lng: number }
  sourceId: string
  trustScore: number
  rawData: any
}

export class DataExtractionEngine {
  private sources: Map<string, DataSourceConfig> = new Map()
  private extractionHistory: ExtractionResult[] = []
  private validationErrors: Map<string, string[]> = new Map()

  constructor(sources: DataSourceConfig[]) {
    sources.forEach((source) => this.sources.set(source.id, source))
  }

  // Main extraction orchestrator
  async extractAllSources(): Promise<ExtractionResult[]> {
    const results: ExtractionResult[] = []

    for (const [sourceId, config] of this.sources) {
      try {
        console.log(`Starting extraction from ${config.name}...`)
        const result = await this.extractFromSource(config)
        results.push(result)
        this.extractionHistory.push(result)
      } catch (error) {
        console.error(`Extraction failed for ${config.name}:`, error)
        results.push({
          sourceId,
          success: false,
          recordsExtracted: 0,
          recordsValidated: 0,
          errors: [error instanceof Error ? error.message : "Unknown error"],
          warnings: [],
          extractedData: [],
          extractionTime: new Date(),
        })
      }
    }

    return results
  }

  // Extract data from a specific source
  private async extractFromSource(config: DataSourceConfig): Promise<ExtractionResult> {
    const startTime = new Date()
    let extractedData: any[] = []
    const errors: string[] = []
    const warnings: string[] = []

    try {
      // Route to appropriate extraction method
      switch (config.extractionMethod) {
        case "api":
          extractedData = await this.extractFromAPI(config)
          break
        case "scraping":
          extractedData = await this.extractFromWebScraping(config)
          break
        case "file_upload":
          extractedData = await this.extractFromFileUpload(config)
          break
        case "manual":
          extractedData = await this.extractFromManualEntry(config)
          break
        default:
          throw new Error(`Unsupported extraction method: ${config.extractionMethod}`)
      }

      // Validate and clean data
      const validatedData = await this.validateAndCleanData(extractedData, config)

      return {
        sourceId: config.id,
        success: true,
        recordsExtracted: extractedData.length,
        recordsValidated: validatedData.length,
        errors,
        warnings,
        extractedData: validatedData,
        extractionTime: startTime,
        nextScheduledExtraction: this.calculateNextExtraction(config),
      }
    } catch (error) {
      return {
        sourceId: config.id,
        success: false,
        recordsExtracted: 0,
        recordsValidated: 0,
        errors: [error instanceof Error ? error.message : "Unknown error"],
        warnings,
        extractedData: [],
        extractionTime: startTime,
      }
    }
  }

  // API-based extraction
  private async extractFromAPI(config: DataSourceConfig): Promise<any[]> {
    if (!config.apiEndpoint) {
      throw new Error("API endpoint not configured")
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "User-Agent": "Kenya-Accountability-Platform/1.0",
    }

    // Add authentication headers based on method
    switch (config.authMethod) {
      case "api_key":
        headers["Authorization"] = `Bearer ${process.env[`${config.id.toUpperCase()}_API_KEY`] || "demo-key"}`
        break
      case "basic":
        const credentials = Buffer.from(
          `${process.env[`${config.id.toUpperCase()}_USERNAME`]}:${process.env[`${config.id.toUpperCase()}_PASSWORD`]}`,
        ).toString("base64")
        headers["Authorization"] = `Basic ${credentials}`
        break
    }

    // Simulate API calls with mock data for demonstration
    return this.generateMockData(config)
  }

  // Web scraping extraction
  private async extractFromWebScraping(config: DataSourceConfig): Promise<any[]> {
    console.log(`Scraping data from ${config.url}`)

    // In a real implementation, this would use libraries like Puppeteer or Cheerio
    // For now, we'll simulate with mock data
    return this.generateMockData(config)
  }

  // File upload extraction
  private async extractFromFileUpload(config: DataSourceConfig): Promise<any[]> {
    console.log(`Processing uploaded files for ${config.name}`)

    // In a real implementation, this would process CSV, Excel, PDF files
    return this.generateMockData(config)
  }

  // Manual entry extraction
  private async extractFromManualEntry(config: DataSourceConfig): Promise<any[]> {
    console.log(`Processing manual entries for ${config.name}`)

    // In a real implementation, this would fetch from a manual entry database
    return this.generateMockData(config)
  }

  // Generate mock data for demonstration
  private generateMockData(config: DataSourceConfig): any[] {
    const mockProjects = [
      {
        id: `${config.id}_001`,
        project_name: "Nairobi BRT System Phase 1",
        county: "Nairobi",
        constituency: "Westlands",
        sector: "Transport",
        budget: 45200000000,
        spent: 12800000000,
        status: "Stalled",
        start_date: "2019-03-15",
        expected_completion: "2022-12-31",
        last_update: "2025-05-15",
        contractor: "China Communications Construction Company",
        issues: ["Contractor disputes", "Environmental concerns", "Budget overruns"],
      },
      {
        id: `${config.id}_002`,
        project_name: "Kisumu Water Treatment Plant",
        county: "Kisumu",
        constituency: "Kisumu Central",
        sector: "Water",
        budget: 8700000000,
        spent: 3200000000,
        status: "Delayed",
        start_date: "2020-06-01",
        expected_completion: "2023-08-30",
        last_update: "2025-04-20",
        contractor: "Aqua Engineering Ltd",
        issues: ["Land acquisition delays", "Technical challenges"],
      },
      {
        id: `${config.id}_003`,
        project_name: "Nakuru Hospital Expansion",
        county: "Nakuru",
        constituency: "Nakuru Town East",
        sector: "Health",
        budget: 3200000000,
        spent: 480000000,
        status: "Stalled",
        start_date: "2021-02-15",
        expected_completion: "2024-02-15",
        last_update: "2025-03-10",
        contractor: "Local Construction Ltd",
        issues: ["Funding shortfall", "Design changes", "Contractor issues"],
      },
    ]

    // Filter based on source type
    if (config.type === "government") {
      return mockProjects.filter((p) => ["Stalled", "Delayed"].includes(p.status))
    } else if (config.type === "media") {
      return mockProjects.map((p) => ({
        article_id: `article_${p.id}`,
        headline: `Investigation: ${p.project_name} Project Faces Delays`,
        content: `Our investigation reveals that the ${p.project_name} project has encountered significant challenges...`,
        publication_date: new Date().toISOString(),
        source: config.name,
        project_mentioned: p.project_name,
      }))
    } else if (config.type === "crowdsourced") {
      return mockProjects.map((p) => ({
        report_id: `report_${p.id}`,
        project_name: p.project_name,
        location: p.county,
        issue_type: "Stalled Project",
        description: `Citizens report that ${p.project_name} has been stalled for months`,
        evidence: ["photo1.jpg", "document1.pdf"],
        submitted_date: new Date().toISOString(),
      }))
    }

    return mockProjects
  }

  // Data validation and cleaning
  private async validateAndCleanData(data: any[], config: DataSourceConfig): Promise<any[]> {
    const validatedData: any[] = []
    const errors: string[] = []

    for (const record of data) {
      const validationResult = this.validateRecord(record, config.validationRules)

      if (validationResult.isValid) {
        // Apply field mapping
        const mappedRecord = this.applyFieldMapping(record, config.fieldMapping)

        // Clean and standardize data
        const cleanedRecord = this.cleanRecord(mappedRecord)

        validatedData.push({
          ...cleanedRecord,
          sourceId: config.id,
          trustScore: config.trustScore,
          extractionDate: new Date(),
          rawData: record,
        })
      } else {
        errors.push(`Record ${record.id || "unknown"}: ${validationResult.errors.join(", ")}`)
      }
    }

    if (errors.length > 0) {
      this.validationErrors.set(config.id, errors)
    }

    return validatedData
  }

  // Validate individual record
  private validateRecord(record: any, rules: ValidationRule[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    for (const rule of rules) {
      const value = record[rule.field]

      switch (rule.type) {
        case "required":
          if (!value || value === "") {
            errors.push(rule.errorMessage)
          }
          break
        case "format":
          // Add format validation logic
          break
        case "range":
          if (typeof value === "number" && value < (rule.rule as number)) {
            errors.push(rule.errorMessage)
          }
          break
        case "enum":
          if (!Array.isArray(rule.rule) || !rule.rule.includes(value)) {
            errors.push(rule.errorMessage)
          }
          break
      }
    }

    return { isValid: errors.length === 0, errors }
  }

  // Apply field mapping
  private applyFieldMapping(record: any, mapping: Record<string, string>): any {
    const mappedRecord: any = {}

    for (const [sourceField, targetField] of Object.entries(mapping)) {
      if (record[sourceField] !== undefined) {
        mappedRecord[targetField] = record[sourceField]
      }
    }

    return mappedRecord
  }

  // Clean and standardize record
  private cleanRecord(record: any): any {
    const cleaned = { ...record }

    // Standardize dates
    if (cleaned.start_date) {
      cleaned.start_date = new Date(cleaned.start_date)
    }
    if (cleaned.expected_completion) {
      cleaned.expected_completion = new Date(cleaned.expected_completion)
    }
    if (cleaned.last_update) {
      cleaned.last_update = new Date(cleaned.last_update)
    }

    // Standardize budget values
    if (cleaned.budget) {
      cleaned.budget = Number.parseFloat(cleaned.budget.toString().replace(/[^0-9.-]/g, ""))
    }
    if (cleaned.spent) {
      cleaned.spent = Number.parseFloat(cleaned.spent.toString().replace(/[^0-9.-]/g, ""))
    }

    // Standardize status values
    if (cleaned.status) {
      cleaned.status = this.standardizeStatus(cleaned.status)
    }

    // Clean text fields
    if (cleaned.project_name) {
      cleaned.project_name = cleaned.project_name.trim()
    }
    if (cleaned.contractor) {
      cleaned.contractor = cleaned.contractor.trim()
    }

    return cleaned
  }

  // Standardize project status
  private standardizeStatus(status: string): string {
    const statusMap: Record<string, string> = {
      on_hold: "Stalled",
      "on hold": "Stalled",
      suspended: "Stalled",
      halted: "Stalled",
      delayed: "Delayed",
      behind_schedule: "Behind Schedule",
      "behind schedule": "Behind Schedule",
      in_progress: "Active",
      "in progress": "Active",
      ongoing: "Active",
      completed: "Completed",
      finished: "Completed",
      cancelled: "Cancelled",
      terminated: "Cancelled",
    }

    const normalizedStatus = status.toLowerCase().trim()
    return statusMap[normalizedStatus] || status
  }

  // Calculate next extraction time
  private calculateNextExtraction(config: DataSourceConfig): Date {
    const now = new Date()

    switch (config.updateFrequency) {
      case "hourly":
        return new Date(now.getTime() + 60 * 60 * 1000)
      case "daily":
        return new Date(now.getTime() + 24 * 60 * 60 * 1000)
      case "weekly":
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      case "monthly":
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000)
    }
  }

  // Get extraction statistics
  getExtractionStats(): any {
    const totalExtractions = this.extractionHistory.length
    const successfulExtractions = this.extractionHistory.filter((r) => r.success).length
    const totalRecords = this.extractionHistory.reduce((sum, r) => sum + r.recordsValidated, 0)

    return {
      totalExtractions,
      successfulExtractions,
      successRate: totalExtractions > 0 ? (successfulExtractions / totalExtractions) * 100 : 0,
      totalRecords,
      lastExtraction: this.extractionHistory[this.extractionHistory.length - 1]?.extractionTime,
      validationErrors: Object.fromEntries(this.validationErrors),
    }
  }
}
