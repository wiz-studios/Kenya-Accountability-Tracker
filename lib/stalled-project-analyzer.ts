// Automated stalled project identification and analysis
import type { StalledProjectCriteria } from "./data-sources-config"
import type { ProjectRecord } from "./data-extraction-engine"

export interface StalledProjectAnalysis {
  projectId: string
  projectName: string
  stalledScore: number
  stalledStatus: "Confirmed Stalled" | "Likely Stalled" | "At Risk" | "Active"
  criteriaResults: CriteriaResult[]
  recommendations: string[]
  lastAnalyzed: Date
  confidenceLevel: number
}

export interface CriteriaResult {
  criteriaId: string
  criteriaName: string
  score: number
  weight: number
  weightedScore: number
  details: string
  evidence: any[]
}

export class StalledProjectAnalyzer {
  private criteria: StalledProjectCriteria[]
  private analysisHistory: Map<string, StalledProjectAnalysis[]> = new Map()

  constructor(criteria: StalledProjectCriteria[]) {
    this.criteria = criteria
  }

  // Analyze all projects for stalled status
  async analyzeProjects(projects: ProjectRecord[]): Promise<StalledProjectAnalysis[]> {
    const analyses: StalledProjectAnalysis[] = []

    for (const project of projects) {
      try {
        const analysis = await this.analyzeProject(project)
        analyses.push(analysis)

        // Store in history
        const history = this.analysisHistory.get(project.id) || []
        history.push(analysis)
        this.analysisHistory.set(project.id, history.slice(-10)) // Keep last 10 analyses
      } catch (error) {
        console.error(`Failed to analyze project ${project.id}:`, error)
      }
    }

    return analyses.sort((a, b) => b.stalledScore - a.stalledScore)
  }

  // Analyze individual project
  private async analyzeProject(project: ProjectRecord): Promise<StalledProjectAnalysis> {
    const criteriaResults: CriteriaResult[] = []
    let totalWeightedScore = 0
    let totalWeight = 0

    // Evaluate each criteria
    for (const criteria of this.criteria) {
      const result = await this.evaluateCriteria(project, criteria)
      criteriaResults.push(result)
      totalWeightedScore += result.weightedScore
      totalWeight += criteria.weight
    }

    // Calculate overall stalled score (0-100)
    const stalledScore = totalWeight > 0 ? (totalWeightedScore / totalWeight) * 100 : 0

    // Determine stalled status
    const stalledStatus = this.determineStalledStatus(stalledScore)

    // Generate recommendations
    const recommendations = this.generateRecommendations(criteriaResults, project)

    // Calculate confidence level
    const confidenceLevel = this.calculateConfidenceLevel(criteriaResults, project)

    return {
      projectId: project.id,
      projectName: project.name,
      stalledScore: Math.round(stalledScore),
      stalledStatus,
      criteriaResults,
      recommendations,
      lastAnalyzed: new Date(),
      confidenceLevel,
    }
  }

  // Evaluate specific criteria for a project
  private async evaluateCriteria(project: ProjectRecord, criteria: StalledProjectCriteria): Promise<CriteriaResult> {
    let score = 0
    let details = ""
    const evidence: any[] = []

    switch (criteria.id) {
      case "timeline_overrun":
        const timelineThreshold = Number(criteria.threshold) || 0
        const monthsOverdue = this.calculateMonthsOverdue(project)
        score = monthsOverdue > timelineThreshold ? 1 : Math.min(monthsOverdue / Math.max(timelineThreshold, 1), 1)
        details = `Project is ${monthsOverdue} months overdue (threshold: ${timelineThreshold} months)`
        evidence.push({ type: "timeline", monthsOverdue, expectedCompletion: project.expectedCompletion })
        break

      case "budget_overrun":
        const budgetThreshold = Number(criteria.threshold) || 0
        const budgetOverrunRatio = (project.spent - project.budget) / project.budget
        score = budgetOverrunRatio > budgetThreshold ? 1 : Math.max(budgetOverrunRatio / Math.max(budgetThreshold, 0.0001), 0)
        details = `Budget overrun: ${(budgetOverrunRatio * 100).toFixed(1)}% (threshold: ${(budgetThreshold * 100).toFixed(1)}%)`
        evidence.push({
          type: "budget",
          overrunRatio: budgetOverrunRatio,
          budget: project.budget,
          spent: project.spent,
        })
        break

      case "no_progress_updates":
        const updateThreshold = Number(criteria.threshold) || 0
        const daysSinceUpdate = this.calculateDaysSinceLastUpdate(project)
        score = daysSinceUpdate > updateThreshold ? 1 : Math.min(daysSinceUpdate / Math.max(updateThreshold, 1), 1)
        details = `${daysSinceUpdate} days since last update (threshold: ${updateThreshold} days)`
        evidence.push({ type: "updates", daysSinceUpdate, lastUpdate: project.lastUpdate })
        break

      case "contractor_disputes":
        const disputes = this.identifyContractorDisputes(project)
        score = disputes.length > 0 ? 1 : 0
        details = `${disputes.length} active disputes identified`
        evidence.push({ type: "disputes", disputes })
        break

      case "audit_findings":
        const auditFindings = this.identifyAuditFindings(project)
        score = auditFindings.length > 0 ? 1 : 0
        details = `${auditFindings.length} audit findings identified`
        evidence.push({ type: "audit", findings: auditFindings })
        break

      default:
        score = 0
        details = "Unknown criteria"
    }

    return {
      criteriaId: criteria.id,
      criteriaName: criteria.name,
      score: Math.min(Math.max(score, 0), 1), // Ensure score is between 0 and 1
      weight: criteria.weight,
      weightedScore: score * criteria.weight,
      details,
      evidence,
    }
  }

  // Calculate months overdue
  private calculateMonthsOverdue(project: ProjectRecord): number {
    const now = new Date()
    const expectedCompletion = new Date(project.expectedCompletion)

    if (now <= expectedCompletion) return 0

    const diffTime = now.getTime() - expectedCompletion.getTime()
    const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30.44) // Average days per month

    return Math.max(0, diffMonths)
  }

  // Calculate days since last update
  private calculateDaysSinceLastUpdate(project: ProjectRecord): number {
    const now = new Date()
    const lastUpdate = new Date(project.lastUpdate)

    const diffTime = now.getTime() - lastUpdate.getTime()
    const diffDays = diffTime / (1000 * 60 * 60 * 24)

    return Math.max(0, diffDays)
  }

  // Identify contractor disputes (mock implementation)
  private identifyContractorDisputes(project: ProjectRecord): any[] {
    // In real implementation, this would check legal databases, news reports, etc.
    const disputes = []

    if (project.rawData?.issues?.includes("Contractor disputes")) {
      disputes.push({
        type: "payment_dispute",
        description: "Payment delays reported",
        severity: "high",
        source: "project_records",
      })
    }

    return disputes
  }

  // Identify audit findings (mock implementation)
  private identifyAuditFindings(project: ProjectRecord): any[] {
    // In real implementation, this would check audit reports, EACC records, etc.
    const findings = []

    if (project.rawData?.issues?.includes("Budget overruns")) {
      findings.push({
        type: "financial_irregularity",
        description: "Budget overruns without proper justification",
        severity: "medium",
        source: "audit_reports",
      })
    }

    return findings
  }

  // Determine stalled status based on score
  private determineStalledStatus(score: number): "Confirmed Stalled" | "Likely Stalled" | "At Risk" | "Active" {
    if (score >= 80) return "Confirmed Stalled"
    if (score >= 60) return "Likely Stalled"
    if (score >= 40) return "At Risk"
    return "Active"
  }

  // Generate recommendations
  private generateRecommendations(results: CriteriaResult[], project: ProjectRecord): string[] {
    const recommendations: string[] = []

    for (const result of results) {
      if (result.score > 0.7) {
        switch (result.criteriaId) {
          case "timeline_overrun":
            recommendations.push("Immediate project review and timeline reassessment required")
            recommendations.push("Consider appointing a project recovery manager")
            break
          case "budget_overrun":
            recommendations.push("Financial audit and budget reallocation needed")
            recommendations.push("Implement stricter financial controls")
            break
          case "no_progress_updates":
            recommendations.push("Establish mandatory weekly progress reporting")
            recommendations.push("Deploy field monitoring team")
            break
          case "contractor_disputes":
            recommendations.push("Initiate dispute resolution process")
            recommendations.push("Consider alternative contractors if necessary")
            break
          case "audit_findings":
            recommendations.push("Address audit findings immediately")
            recommendations.push("Implement corrective measures")
            break
        }
      }
    }

    // Add general recommendations
    if (recommendations.length === 0) {
      recommendations.push("Continue regular monitoring")
    } else {
      recommendations.push("Escalate to relevant authorities for intervention")
      recommendations.push("Increase public transparency and reporting")
    }

    return [...new Set(recommendations)] // Remove duplicates
  }

  // Calculate confidence level
  private calculateConfidenceLevel(results: CriteriaResult[], project: ProjectRecord): number {
    let confidenceFactors = 0
    let totalFactors = 0

    // Data source trust score
    confidenceFactors += project.trustScore / 100
    totalFactors += 1

    // Number of evidence sources
    const evidenceSources = results.reduce((count, r) => count + r.evidence.length, 0)
    confidenceFactors += Math.min(evidenceSources / 10, 1) // Max confidence from evidence
    totalFactors += 1

    // Data freshness
    const daysSinceExtraction = (new Date().getTime() - new Date(project.lastUpdate).getTime()) / (1000 * 60 * 60 * 24)
    const freshnessScore = Math.max(0, 1 - daysSinceExtraction / 30) // Decreases over 30 days
    confidenceFactors += freshnessScore
    totalFactors += 1

    return Math.round((confidenceFactors / totalFactors) * 100)
  }

  // Get analysis trends for a project
  getProjectTrends(projectId: string): any {
    const history = this.analysisHistory.get(projectId) || []

    if (history.length < 2) {
      return { trend: "insufficient_data", analyses: history.length }
    }

    const recent = history[history.length - 1]
    const previous = history[history.length - 2]

    const scoreDiff = recent.stalledScore - previous.stalledScore

    return {
      trend: scoreDiff > 5 ? "deteriorating" : scoreDiff < -5 ? "improving" : "stable",
      scoreDifference: scoreDiff,
      currentScore: recent.stalledScore,
      previousScore: previous.stalledScore,
      analysisCount: history.length,
    }
  }

  // Get overall statistics
  getAnalysisStatistics(analyses: StalledProjectAnalysis[]): any {
    const total = analyses.length
    const confirmed = analyses.filter((a) => a.stalledStatus === "Confirmed Stalled").length
    const likely = analyses.filter((a) => a.stalledStatus === "Likely Stalled").length
    const atRisk = analyses.filter((a) => a.stalledStatus === "At Risk").length
    const active = analyses.filter((a) => a.stalledStatus === "Active").length

    const averageScore = total > 0 ? analyses.reduce((sum, a) => sum + a.stalledScore, 0) / total : 0
    const averageConfidence = total > 0 ? analyses.reduce((sum, a) => sum + a.confidenceLevel, 0) / total : 0

    return {
      total,
      confirmed,
      likely,
      atRisk,
      active,
      averageScore: Math.round(averageScore),
      averageConfidence: Math.round(averageConfidence),
      stalledPercentage: total > 0 ? Math.round(((confirmed + likely) / total) * 100) : 0,
    }
  }
}
