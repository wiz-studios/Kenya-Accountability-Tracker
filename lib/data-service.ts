// Centralized data service for handling all data operations
import { enhancedKenyaLocations, searchLocations, type County, type Constituency } from "./enhanced-kenya-locations"
import { enhancedProjectData, type EnhancedProject } from "./enhanced-project-data"
import { validateCounty, validateProject, validateDataRelationships } from "./data-validation"

export interface DataServiceError {
  code: string
  message: string
  details?: any
}

export interface DataServiceResult<T> {
  data?: T
  error?: DataServiceError
  isLoading: boolean
}

export class DataService {
  private static instance: DataService
  private counties: County[] = []
  private projects: EnhancedProject[] = []
  private isInitialized = false
  private initializationError: DataServiceError | null = null

  private constructor() {
    this.initialize()
  }

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService()
    }
    return DataService.instance
  }

  // Initialize data and validate
  private async initialize(): Promise<void> {
    try {
      console.log("🔄 DataService: Initializing...")

      // Load and validate counties
      this.counties = enhancedKenyaLocations
      console.log(`📊 DataService: Loaded ${this.counties.length} counties`)

      // Validate each county
      const countyValidations = this.counties.map((county, index) => {
        const validation = validateCounty(county)
        if (!validation.isValid) {
          console.error(`❌ County validation failed for index ${index}:`, validation.errors)
        }
        if (validation.warnings.length > 0) {
          console.warn(`⚠️ County warnings for ${county.name}:`, validation.warnings)
        }
        return validation
      })

      const invalidCounties = countyValidations.filter((v) => !v.isValid)
      if (invalidCounties.length > 0) {
        throw new Error(`${invalidCounties.length} counties failed validation`)
      }

      // Load and validate projects
      this.projects = enhancedProjectData
      console.log(`📊 DataService: Loaded ${this.projects.length} projects`)

      // Validate each project
      const projectValidations = this.projects.map((project, index) => {
        const validation = validateProject(project)
        if (!validation.isValid) {
          console.error(`❌ Project validation failed for index ${index}:`, validation.errors)
        }
        return validation
      })

      const invalidProjects = projectValidations.filter((v) => !v.isValid)
      if (invalidProjects.length > 0) {
        throw new Error(`${invalidProjects.length} projects failed validation`)
      }

      // Validate data relationships
      const relationshipValidation = validateDataRelationships(this.counties, this.projects)
      if (!relationshipValidation.isValid) {
        console.error("❌ Data relationship validation failed:", relationshipValidation.errors)
        throw new Error("Data relationship validation failed")
      }

      this.isInitialized = true
      console.log("✅ DataService: Initialization complete")
    } catch (error) {
      console.error("❌ DataService: Initialization failed:", error)
      this.initializationError = {
        code: "INITIALIZATION_FAILED",
        message: error instanceof Error ? error.message : "Unknown initialization error",
        details: error,
      }
    }
  }

  // Get all counties with error handling
  public async getCounties(): Promise<DataServiceResult<County[]>> {
    if (!this.isInitialized) {
      if (this.initializationError) {
        return {
          data: undefined,
          error: this.initializationError,
          isLoading: false,
        }
      }
      return {
        data: undefined,
        error: undefined,
        isLoading: true,
      }
    }

    try {
      console.log(`📋 DataService: Returning ${this.counties.length} counties`)
      return {
        data: [...this.counties], // Return a copy to prevent mutations
        error: undefined,
        isLoading: false,
      }
    } catch (error) {
      console.error("❌ DataService: Error getting counties:", error)
      return {
        data: undefined,
        error: {
          code: "GET_COUNTIES_FAILED",
          message: "Failed to retrieve counties",
          details: error,
        },
        isLoading: false,
      }
    }
  }

  // Get county by ID with validation
  public async getCountyById(countyId: string): Promise<DataServiceResult<County>> {
    if (!this.isInitialized) {
      return {
        data: undefined,
        error: this.initializationError || undefined,
        isLoading: !this.initializationError,
      }
    }

    try {
      const county = this.counties.find((c) => c.id === countyId)
      if (!county) {
        return {
          data: undefined,
          error: {
            code: "COUNTY_NOT_FOUND",
            message: `County with ID '${countyId}' not found`,
          },
          isLoading: false,
        }
      }

      console.log(`🏛️ DataService: Found county ${county.name} (${county.constituencies.length} constituencies)`)
      return {
        data: county,
        error: undefined,
        isLoading: false,
      }
    } catch (error) {
      console.error("❌ DataService: Error getting county by ID:", error)
      return {
        data: undefined,
        error: {
          code: "GET_COUNTY_FAILED",
          message: "Failed to retrieve county",
          details: error,
        },
        isLoading: false,
      }
    }
  }

  // Get constituencies by county with validation
  public async getConstituenciesByCounty(countyId: string): Promise<DataServiceResult<Constituency[]>> {
    if (!this.isInitialized) {
      return {
        data: undefined,
        error: this.initializationError || undefined,
        isLoading: !this.initializationError,
      }
    }

    try {
      const county = this.counties.find((c) => c.id === countyId)
      if (!county) {
        return {
          data: undefined,
          error: {
            code: "COUNTY_NOT_FOUND",
            message: `County with ID '${countyId}' not found`,
          },
          isLoading: false,
        }
      }

      console.log(`🏘️ DataService: Found ${county.constituencies.length} constituencies for ${county.name}`)
      return {
        data: [...county.constituencies], // Return a copy
        error: undefined,
        isLoading: false,
      }
    } catch (error) {
      console.error("❌ DataService: Error getting constituencies:", error)
      return {
        data: undefined,
        error: {
          code: "GET_CONSTITUENCIES_FAILED",
          message: "Failed to retrieve constituencies",
          details: error,
        },
        isLoading: false,
      }
    }
  }

  // Get projects by location with validation
  public async getProjectsByLocation(
    countyId?: string,
    constituencyId?: string,
  ): Promise<DataServiceResult<EnhancedProject[]>> {
    if (!this.isInitialized) {
      return {
        data: undefined,
        error: this.initializationError || undefined,
        isLoading: !this.initializationError,
      }
    }

    try {
      let filteredProjects = [...this.projects]

      if (constituencyId) {
        filteredProjects = filteredProjects.filter((p) => p.constituencyId === constituencyId)
        console.log(`🏗️ DataService: Found ${filteredProjects.length} projects for constituency ${constituencyId}`)
      } else if (countyId) {
        filteredProjects = filteredProjects.filter((p) => p.countyId === countyId)
        console.log(`🏗️ DataService: Found ${filteredProjects.length} projects for county ${countyId}`)
      }

      return {
        data: filteredProjects,
        error: undefined,
        isLoading: false,
      }
    } catch (error) {
      console.error("❌ DataService: Error getting projects:", error)
      return {
        data: undefined,
        error: {
          code: "GET_PROJECTS_FAILED",
          message: "Failed to retrieve projects",
          details: error,
        },
        isLoading: false,
      }
    }
  }

  // Search functionality with error handling
  public async searchLocations(
    query: string,
  ): Promise<DataServiceResult<{ counties: County[]; constituencies: Constituency[] }>> {
    if (!this.isInitialized) {
      return {
        data: undefined,
        error: this.initializationError || undefined,
        isLoading: !this.initializationError,
      }
    }

    try {
      if (!query || query.trim().length === 0) {
        return {
          data: { counties: [], constituencies: [] },
          error: undefined,
          isLoading: false,
        }
      }

      const result = searchLocations(query)
      console.log(
        `🔍 DataService: Search for '${query}' found ${result.counties.length} counties, ${result.constituencies.length} constituencies`,
      )

      return {
        data: result,
        error: undefined,
        isLoading: false,
      }
    } catch (error) {
      console.error("❌ DataService: Error searching locations:", error)
      return {
        data: undefined,
        error: {
          code: "SEARCH_FAILED",
          message: "Failed to search locations",
          details: error,
        },
        isLoading: false,
      }
    }
  }

  // Get initialization status
  public getInitializationStatus(): {
    isInitialized: boolean
    error: DataServiceError | null
  } {
    return {
      isInitialized: this.isInitialized,
      error: this.initializationError,
    }
  }

  // Get data statistics
  public getDataStats(): {
    totalCounties: number
    totalConstituencies: number
    totalProjects: number
    projectsByStatus: Record<string, number>
  } {
    const totalConstituencies = this.counties.reduce((sum, county) => sum + county.constituencies.length, 0)
    const projectsByStatus = this.projects.reduce(
      (acc, project) => {
        acc[project.status] = (acc[project.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      totalCounties: this.counties.length,
      totalConstituencies,
      totalProjects: this.projects.length,
      projectsByStatus,
    }
  }
}

// Export singleton instance
export const dataService = DataService.getInstance()
