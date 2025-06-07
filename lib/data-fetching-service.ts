// Data Fetching Service for Kenya Counties and Constituencies
// Handles data loading, caching, error handling, and validation

import { completeKenyaData, validateAllData, getDataStatistics } from "./complete-kenya-data"
import type { County, Constituency } from "./complete-kenya-data"

export interface DataFetchResult<T> {
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  loading: boolean
  timestamp: number
}

export interface FilterOptions {
  search?: string
  region?: string
  minPopulation?: number
  maxPopulation?: number
}

class DataFetchingService {
  private cache: Map<string, any> = new Map()
  private cacheExpiry: Map<string, number> = new Map()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  constructor() {
    this.initializeData()
  }

  private initializeData(): void {
    console.log("🔄 DataFetchingService: Initializing data...")

    try {
      // Validate data on initialization
      const validation = validateAllData()

      if (!validation.isValid) {
        console.error("❌ Data validation failed:", validation.errors)
        throw new Error(`Data validation failed: ${validation.errors.join(", ")}`)
      }

      if (validation.warnings.length > 0) {
        console.warn("⚠️ Data warnings:", validation.warnings)
      }

      // Cache initial data
      this.setCacheItem("counties", completeKenyaData)
      this.setCacheItem("statistics", getDataStatistics())

      console.log("✅ DataFetchingService: Data initialized successfully")
      console.log("📊 Data Statistics:", getDataStatistics())
    } catch (error) {
      console.error("❌ DataFetchingService: Initialization failed:", error)
      throw error
    }
  }

  private setCacheItem(key: string, data: any): void {
    this.cache.set(key, data)
    this.cacheExpiry.set(key, Date.now() + this.CACHE_DURATION)
  }

  private getCacheItem(key: string): any | null {
    const expiry = this.cacheExpiry.get(key)
    if (!expiry || Date.now() > expiry) {
      this.cache.delete(key)
      this.cacheExpiry.delete(key)
      return null
    }
    return this.cache.get(key) || null
  }

  // Simulate async data fetching (for future API integration)
  private async simulateAsyncOperation<T>(operation: () => T, delay = 100): Promise<T> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(operation())
      }, delay)
    })
  }

  // Get all counties with optional filtering
  async getCounties(options: FilterOptions = {}): Promise<DataFetchResult<County[]>> {
    console.log("🔄 DataFetchingService: Fetching counties with options:", options)

    try {
      const cacheKey = `counties_${JSON.stringify(options)}`
      let counties = this.getCacheItem(cacheKey)

      if (!counties) {
        counties = await this.simulateAsyncOperation(() => {
          let result = [...completeKenyaData]

          // Apply filters
          if (options.search) {
            const searchLower = options.search.toLowerCase()
            result = result.filter(
              (county) =>
                county.name.toLowerCase().includes(searchLower) ||
                county.capital.toLowerCase().includes(searchLower) ||
                county.code.toLowerCase().includes(searchLower),
            )
          }

          if (options.region) {
            result = result.filter((county) => county.region === options.region)
          }

          if (options.minPopulation) {
            result = result.filter((county) => county.population >= options.minPopulation!)
          }

          if (options.maxPopulation) {
            result = result.filter((county) => county.population <= options.maxPopulation!)
          }

          return result
        })

        this.setCacheItem(cacheKey, counties)
      }

      console.log(`✅ DataFetchingService: Found ${counties.length} counties`)

      return {
        data: counties,
        loading: false,
        timestamp: Date.now(),
      }
    } catch (error) {
      console.error("❌ DataFetchingService: Error fetching counties:", error)

      return {
        error: {
          code: "FETCH_COUNTIES_ERROR",
          message: "Failed to fetch counties data",
          details: error,
        },
        loading: false,
        timestamp: Date.now(),
      }
    }
  }

  // Get county by ID
  async getCountyById(countyId: string): Promise<DataFetchResult<County>> {
    console.log("🔄 DataFetchingService: Fetching county by ID:", countyId)

    try {
      if (!countyId || countyId.trim() === "") {
        throw new Error("County ID is required")
      }

      const cacheKey = `county_${countyId}`
      let county = this.getCacheItem(cacheKey)

      if (!county) {
        county = await this.simulateAsyncOperation(() => {
          return completeKenyaData.find((c) => c.id === countyId)
        })

        if (!county) {
          throw new Error(`County with ID '${countyId}' not found`)
        }

        this.setCacheItem(cacheKey, county)
      }

      console.log(`✅ DataFetchingService: Found county: ${county.name}`)

      return {
        data: county,
        loading: false,
        timestamp: Date.now(),
      }
    } catch (error) {
      console.error("❌ DataFetchingService: Error fetching county:", error)

      return {
        error: {
          code: "FETCH_COUNTY_ERROR",
          message: `Failed to fetch county: ${error instanceof Error ? error.message : "Unknown error"}`,
          details: error,
        },
        loading: false,
        timestamp: Date.now(),
      }
    }
  }

  // Get constituencies by county ID
  async getConstituenciesByCounty(
    countyId: string,
    options: FilterOptions = {},
  ): Promise<DataFetchResult<Constituency[]>> {
    console.log("🔄 DataFetchingService: Fetching constituencies for county:", countyId)

    try {
      if (!countyId || countyId.trim() === "") {
        throw new Error("County ID is required")
      }

      const cacheKey = `constituencies_${countyId}_${JSON.stringify(options)}`
      let constituencies = this.getCacheItem(cacheKey)

      if (!constituencies) {
        constituencies = await this.simulateAsyncOperation(() => {
          const county = completeKenyaData.find((c) => c.id === countyId)

          if (!county) {
            throw new Error(`County with ID '${countyId}' not found`)
          }

          let result = [...county.constituencies]

          // Apply filters
          if (options.search) {
            const searchLower = options.search.toLowerCase()
            result = result.filter((constituency) => constituency.name.toLowerCase().includes(searchLower))
          }

          if (options.minPopulation) {
            result = result.filter((constituency) => constituency.population >= options.minPopulation!)
          }

          if (options.maxPopulation) {
            result = result.filter((constituency) => constituency.population <= options.maxPopulation!)
          }

          return result
        })

        this.setCacheItem(cacheKey, constituencies)
      }

      console.log(`✅ DataFetchingService: Found ${constituencies.length} constituencies in county ${countyId}`)

      return {
        data: constituencies,
        loading: false,
        timestamp: Date.now(),
      }
    } catch (error) {
      console.error("❌ DataFetchingService: Error fetching constituencies:", error)

      return {
        error: {
          code: "FETCH_CONSTITUENCIES_ERROR",
          message: `Failed to fetch constituencies: ${error instanceof Error ? error.message : "Unknown error"}`,
          details: error,
        },
        loading: false,
        timestamp: Date.now(),
      }
    }
  }

  // Get constituency by ID
  async getConstituencyById(constituencyId: string): Promise<DataFetchResult<Constituency>> {
    console.log("🔄 DataFetchingService: Fetching constituency by ID:", constituencyId)

    try {
      if (!constituencyId || constituencyId.trim() === "") {
        throw new Error("Constituency ID is required")
      }

      const cacheKey = `constituency_${constituencyId}`
      let constituency = this.getCacheItem(cacheKey)

      if (!constituency) {
        constituency = await this.simulateAsyncOperation(() => {
          for (const county of completeKenyaData) {
            const found = county.constituencies.find((c) => c.id === constituencyId)
            if (found) return found
          }
          return null
        })

        if (!constituency) {
          throw new Error(`Constituency with ID '${constituencyId}' not found`)
        }

        this.setCacheItem(cacheKey, constituency)
      }

      console.log(`✅ DataFetchingService: Found constituency: ${constituency.name}`)

      return {
        data: constituency,
        loading: false,
        timestamp: Date.now(),
      }
    } catch (error) {
      console.error("❌ DataFetchingService: Error fetching constituency:", error)

      return {
        error: {
          code: "FETCH_CONSTITUENCY_ERROR",
          message: `Failed to fetch constituency: ${error instanceof Error ? error.message : "Unknown error"}`,
          details: error,
        },
        loading: false,
        timestamp: Date.now(),
      }
    }
  }

  // Get data statistics
  async getStatistics(): Promise<DataFetchResult<any>> {
    console.log("🔄 DataFetchingService: Fetching data statistics")

    try {
      let statistics = this.getCacheItem("statistics")

      if (!statistics) {
        statistics = await this.simulateAsyncOperation(() => getDataStatistics())
        this.setCacheItem("statistics", statistics)
      }

      console.log("✅ DataFetchingService: Statistics retrieved")

      return {
        data: statistics,
        loading: false,
        timestamp: Date.now(),
      }
    } catch (error) {
      console.error("❌ DataFetchingService: Error fetching statistics:", error)

      return {
        error: {
          code: "FETCH_STATISTICS_ERROR",
          message: "Failed to fetch data statistics",
          details: error,
        },
        loading: false,
        timestamp: Date.now(),
      }
    }
  }

  // Clear cache
  clearCache(): void {
    console.log("🧹 DataFetchingService: Clearing cache")
    this.cache.clear()
    this.cacheExpiry.clear()
  }

  // Get cache status
  getCacheStatus(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    }
  }

  // Validate data integrity
  async validateData(): Promise<DataFetchResult<{ isValid: boolean; errors: string[]; warnings: string[] }>> {
    console.log("🔄 DataFetchingService: Validating data integrity")

    try {
      const validation = await this.simulateAsyncOperation(() => validateAllData())

      console.log("✅ DataFetchingService: Data validation completed")

      return {
        data: validation,
        loading: false,
        timestamp: Date.now(),
      }
    } catch (error) {
      console.error("❌ DataFetchingService: Error validating data:", error)

      return {
        error: {
          code: "VALIDATION_ERROR",
          message: "Failed to validate data",
          details: error,
        },
        loading: false,
        timestamp: Date.now(),
      }
    }
  }
}

// Export singleton instance
export const dataFetchingService = new DataFetchingService()

// Export types and interfaces
export type { County, Constituency, FilterOptions }
