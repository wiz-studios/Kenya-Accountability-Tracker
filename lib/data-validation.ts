// Data validation and error handling utilities
export interface DataValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export interface CountyValidation extends DataValidationResult {
  county?: County
}

export interface ConstituencyValidation extends DataValidationResult {
  constituency?: Constituency
}

export interface ProjectValidation extends DataValidationResult {
  project?: EnhancedProject
}

import type { County, Constituency } from "./enhanced-kenya-locations"
import type { EnhancedProject } from "./enhanced-project-data"

// Validate county data structure
export function validateCounty(data: any): CountyValidation {
  const errors: string[] = []
  const warnings: string[] = []

  if (!data) {
    errors.push("County data is null or undefined")
    return { isValid: false, errors, warnings }
  }

  if (typeof data !== "object") {
    errors.push("County data must be an object")
    return { isValid: false, errors, warnings }
  }

  // Required fields validation
  if (!data.id || typeof data.id !== "string") {
    errors.push("County must have a valid string ID")
  }

  if (!data.name || typeof data.name !== "string") {
    errors.push("County must have a valid string name")
  }

  if (!data.code || typeof data.code !== "string") {
    errors.push("County must have a valid string code")
  }

  if (!data.capital || typeof data.capital !== "string") {
    errors.push("County must have a valid string capital")
  }

  if (!Array.isArray(data.constituencies)) {
    errors.push("County must have a constituencies array")
  } else if (data.constituencies.length === 0) {
    warnings.push("County has no constituencies")
  }

  // Optional fields validation
  if (data.population && (typeof data.population !== "number" || data.population < 0)) {
    warnings.push("County population should be a positive number")
  }

  if (data.area && (typeof data.area !== "number" || data.area < 0)) {
    warnings.push("County area should be a positive number")
  }

  if (data.coordinates) {
    if (
      typeof data.coordinates !== "object" ||
      typeof data.coordinates.lat !== "number" ||
      typeof data.coordinates.lng !== "number"
    ) {
      warnings.push("County coordinates should have valid lat/lng numbers")
    }
  }

  const isValid = errors.length === 0
  return {
    isValid,
    errors,
    warnings,
    county: isValid ? (data as County) : undefined,
  }
}

// Validate constituency data structure
export function validateConstituency(data: any): ConstituencyValidation {
  const errors: string[] = []
  const warnings: string[] = []

  if (!data) {
    errors.push("Constituency data is null or undefined")
    return { isValid: false, errors, warnings }
  }

  if (typeof data !== "object") {
    errors.push("Constituency data must be an object")
    return { isValid: false, errors, warnings }
  }

  // Required fields validation
  if (!data.id || typeof data.id !== "string") {
    errors.push("Constituency must have a valid string ID")
  }

  if (!data.name || typeof data.name !== "string") {
    errors.push("Constituency must have a valid string name")
  }

  if (!data.countyId || typeof data.countyId !== "string") {
    errors.push("Constituency must have a valid string countyId")
  }

  // Optional fields validation
  if (data.population && (typeof data.population !== "number" || data.population < 0)) {
    warnings.push("Constituency population should be a positive number")
  }

  if (data.area && (typeof data.area !== "number" || data.area < 0)) {
    warnings.push("Constituency area should be a positive number")
  }

  if (data.coordinates) {
    if (
      typeof data.coordinates !== "object" ||
      typeof data.coordinates.lat !== "number" ||
      typeof data.coordinates.lng !== "number"
    ) {
      warnings.push("Constituency coordinates should have valid lat/lng numbers")
    }
  }

  const isValid = errors.length === 0
  return {
    isValid,
    errors,
    warnings,
    constituency: isValid ? (data as Constituency) : undefined,
  }
}

// Validate project data structure
export function validateProject(data: any): ProjectValidation {
  const errors: string[] = []
  const warnings: string[] = []

  if (!data) {
    errors.push("Project data is null or undefined")
    return { isValid: false, errors, warnings }
  }

  if (typeof data !== "object") {
    errors.push("Project data must be an object")
    return { isValid: false, errors, warnings }
  }

  // Required fields validation
  const requiredFields = [
    "id",
    "name",
    "description",
    "county",
    "countyId",
    "constituency",
    "constituencyId",
    "sector",
    "budget",
    "spent",
    "status",
    "startDate",
    "expectedCompletion",
    "progress",
  ]

  requiredFields.forEach((field) => {
    if (data[field] === undefined || data[field] === null) {
      errors.push(`Project must have a ${field}`)
    }
  })

  // Type validation
  if (data.id && typeof data.id !== "number") {
    errors.push("Project ID must be a number")
  }

  if (data.budget && (typeof data.budget !== "number" || data.budget < 0)) {
    errors.push("Project budget must be a positive number")
  }

  if (data.spent && (typeof data.spent !== "number" || data.spent < 0)) {
    errors.push("Project spent amount must be a positive number")
  }

  if (data.progress && (typeof data.progress !== "number" || data.progress < 0 || data.progress > 100)) {
    errors.push("Project progress must be a number between 0 and 100")
  }

  const isValid = errors.length === 0
  return {
    isValid,
    errors,
    warnings,
    project: isValid ? (data as EnhancedProject) : undefined,
  }
}

// Validate data relationships
export function validateDataRelationships(
  counties: County[],
  projects: EnhancedProject[],
): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []

  // Create lookup maps for efficient validation
  const countyIds = new Set(counties.map((c) => c.id))
  const constituencyIds = new Set()

  counties.forEach((county) => {
    county.constituencies.forEach((constituency) => {
      constituencyIds.add(constituency.id)
      // Validate constituency belongs to correct county
      if (constituency.countyId !== county.id) {
        errors.push(`Constituency ${constituency.name} has incorrect countyId: ${constituency.countyId}`)
      }
    })
  })

  // Validate project relationships
  projects.forEach((project) => {
    if (!countyIds.has(project.countyId)) {
      errors.push(`Project ${project.name} references non-existent county ID: ${project.countyId}`)
    }

    if (!constituencyIds.has(project.constituencyId)) {
      errors.push(`Project ${project.name} references non-existent constituency ID: ${project.constituencyId}`)
    }

    // Validate county-constituency relationship in projects
    const county = counties.find((c) => c.id === project.countyId)
    if (county) {
      const constituency = county.constituencies.find((c) => c.id === project.constituencyId)
      if (!constituency) {
        errors.push(
          `Project ${project.name} references constituency ${project.constituencyId} not in county ${project.countyId}`,
        )
      }
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}
