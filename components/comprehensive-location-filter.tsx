"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { ChevronDown, MapPin, X, Search, Filter, AlertCircle, RefreshCw, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { dataFetchingService } from "@/lib/data-fetching-service"
import type { County, Constituency } from "@/lib/data-fetching-service"

interface ComprehensiveLocationFilterProps {
  onLocationChange: (county: County | null, constituency: Constituency | null) => void
  initialCounty?: County | null
  initialConstituency?: Constituency | null
  className?: string
  showStatistics?: boolean
}

export function ComprehensiveLocationFilter({
  onLocationChange,
  initialCounty = null,
  initialConstituency = null,
  className = "",
  showStatistics = true,
}: ComprehensiveLocationFilterProps) {
  // State management
  const [selectedCounty, setSelectedCounty] = useState<County | null>(initialCounty)
  const [selectedConstituency, setSelectedConstituency] = useState<Constituency | null>(initialConstituency)
  const [counties, setCounties] = useState<County[]>([])
  const [constituencies, setConstituencies] = useState<Constituency[]>([])
  const [statistics, setStatistics] = useState<any>(null)

  // UI state
  const [countyDropdownOpen, setCountyDropdownOpen] = useState(false)
  const [constituencyDropdownOpen, setConstituencyDropdownOpen] = useState(false)
  const [countySearch, setCountySearch] = useState("")
  const [constituencySearch, setConstituencySearch] = useState("")

  // Loading and error states
  const [countiesLoading, setCountiesLoading] = useState(true)
  const [constituenciesLoading, setConstituenciesLoading] = useState(false)
  const [statisticsLoading, setStatisticsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load counties on component mount
  useEffect(() => {
    loadCounties()
    if (showStatistics) {
      loadStatistics()
    }
  }, [showStatistics])

  // Load constituencies when county changes
  useEffect(() => {
    if (selectedCounty) {
      loadConstituencies(selectedCounty.id)
    } else {
      setConstituencies([])
    }
  }, [selectedCounty])

  // Load counties data
  const loadCounties = useCallback(async () => {
    console.log("🔄 ComprehensiveLocationFilter: Loading counties...")
    setCountiesLoading(true)
    setError(null)

    try {
      const result = await dataFetchingService.getCounties()

      if (result.error) {
        console.error("❌ Error loading counties:", result.error)
        setError(result.error.message)
        setCounties([])
      } else if (result.data) {
        console.log(`✅ Loaded ${result.data.length} counties`)
        setCounties(result.data)
        setError(null)
      }
    } catch (err) {
      console.error("❌ Unexpected error loading counties:", err)
      setError("Failed to load counties data")
      setCounties([])
    } finally {
      setCountiesLoading(false)
    }
  }, [])

  // Load constituencies data
  const loadConstituencies = useCallback(async (countyId: string) => {
    console.log("🔄 ComprehensiveLocationFilter: Loading constituencies for county:", countyId)
    setConstituenciesLoading(true)

    try {
      const result = await dataFetchingService.getConstituenciesByCounty(countyId)

      if (result.error) {
        console.error("❌ Error loading constituencies:", result.error)
        setConstituencies([])
      } else if (result.data) {
        console.log(`✅ Loaded ${result.data.length} constituencies for county ${countyId}`)
        setConstituencies(result.data)
      }
    } catch (err) {
      console.error("❌ Unexpected error loading constituencies:", err)
      setConstituencies([])
    } finally {
      setConstituenciesLoading(false)
    }
  }, [])

  // Load statistics data
  const loadStatistics = useCallback(async () => {
    console.log("🔄 ComprehensiveLocationFilter: Loading statistics...")
    setStatisticsLoading(true)

    try {
      const result = await dataFetchingService.getStatistics()

      if (result.error) {
        console.error("❌ Error loading statistics:", result.error)
      } else if (result.data) {
        console.log("✅ Loaded statistics")
        setStatistics(result.data)
      }
    } catch (err) {
      console.error("❌ Unexpected error loading statistics:", err)
    } finally {
      setStatisticsLoading(false)
    }
  }, [])

  // Handle county selection
  const handleCountySelect = useCallback(
    (county: County) => {
      console.log(`🏛️ County selected: ${county.name}`)
      setSelectedCounty(county)
      setSelectedConstituency(null) // Reset constituency when county changes
      setCountyDropdownOpen(false)
      setCountySearch("")

      // Notify parent component
      onLocationChange(county, null)
    },
    [onLocationChange],
  )

  // Handle constituency selection
  const handleConstituencySelect = useCallback(
    (constituency: Constituency) => {
      console.log(`🏘️ Constituency selected: ${constituency.name}`)
      setSelectedConstituency(constituency)
      setConstituencyDropdownOpen(false)
      setConstituencySearch("")

      // Notify parent component
      onLocationChange(selectedCounty, constituency)
    },
    [selectedCounty, onLocationChange],
  )

  // Clear all filters
  const clearFilters = useCallback(() => {
    console.log("🧹 Clearing all filters")
    setSelectedCounty(null)
    setSelectedConstituency(null)
    setCountyDropdownOpen(false)
    setConstituencyDropdownOpen(false)
    setCountySearch("")
    setConstituencySearch("")
    onLocationChange(null, null)
  }, [onLocationChange])

  // Retry loading data
  const retryLoading = useCallback(() => {
    console.log("🔄 Retrying data load...")
    loadCounties()
    if (showStatistics) {
      loadStatistics()
    }
  }, [loadCounties, loadStatistics, showStatistics])

  // Filter counties based on search
  const filteredCounties = useMemo(() => {
    return counties.filter((county) => county.name.toLowerCase().includes(countySearch.toLowerCase()))
  }, [counties, countySearch])

  // Filter constituencies based on search
  const filteredConstituencies = useMemo(() => {
    return constituencies.filter((constituency) =>
      constituency.name.toLowerCase().includes(constituencySearch.toLowerCase()),
    )
  }, [constituencies, constituencySearch])

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={retryLoading}>
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics Display */}
      {showStatistics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-sm">
              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
              Kenya Administrative Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statisticsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : statistics ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{statistics.totalCounties}</div>
                  <div className="text-muted-foreground">Counties</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{statistics.totalConstituencies}</div>
                  <div className="text-muted-foreground">Constituencies</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {(statistics.totalPopulation / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-muted-foreground">Population</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{(statistics.totalArea / 1000).toFixed(0)}K</div>
                  <div className="text-muted-foreground">Area (km²)</div>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Location Filter
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              disabled={!selectedCounty && !selectedConstituency}
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* County Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">County</label>
              <div className="relative">
                {countiesLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                      onClick={() => {
                        console.log("🖱️ County button clicked, current state:", countyDropdownOpen)
                        setCountyDropdownOpen(!countyDropdownOpen)
                        setConstituencyDropdownOpen(false)
                      }}
                      disabled={counties.length === 0}
                    >
                      {selectedCounty ? (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{selectedCounty.name}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          {counties.length === 0 ? "No counties available" : "Select county..."}
                        </span>
                      )}
                      <ChevronDown
                        className={`ml-2 h-4 w-4 transition-transform ${countyDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </Button>

                    {/* County Dropdown Menu */}
                    {countyDropdownOpen && counties.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-hidden">
                        {/* Search Input */}
                        <div className="p-3 border-b">
                          <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search counties..."
                              value={countySearch}
                              onChange={(e) => setCountySearch(e.target.value)}
                              className="pl-10"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>

                        {/* Counties List */}
                        <div className="max-h-60 overflow-y-auto">
                          {filteredCounties.length > 0 ? (
                            filteredCounties.map((county) => (
                              <button
                                key={county.id}
                                className="w-full px-4 py-3 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-50 last:border-b-0"
                                onClick={() => handleCountySelect(county)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex flex-col">
                                    <span className="font-medium">{county.name}</span>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                      <span>Capital: {county.capital}</span>
                                      <span>•</span>
                                      <span>{county.region}</span>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end gap-1">
                                    <Badge variant="outline" className="text-xs">
                                      {county.constituencies.length} constituencies
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                      {(county.population / 1000000).toFixed(1)}M people
                                    </span>
                                  </div>
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                              No counties found matching "{countySearch}"
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Constituency Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Constituency</label>
              <div className="relative">
                {constituenciesLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                      disabled={!selectedCounty || constituencies.length === 0}
                      onClick={() => {
                        console.log("🖱️ Constituency button clicked, current state:", constituencyDropdownOpen)
                        setConstituencyDropdownOpen(!constituencyDropdownOpen)
                        setCountyDropdownOpen(false)
                      }}
                    >
                      {selectedConstituency ? (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{selectedConstituency.name}</span>
                        </div>
                      ) : selectedCounty ? (
                        constituencies.length === 0 ? (
                          <span className="text-muted-foreground">No constituencies available</span>
                        ) : (
                          <span className="text-muted-foreground">Select constituency...</span>
                        )
                      ) : (
                        <span className="text-muted-foreground">Select county first</span>
                      )}
                      <ChevronDown
                        className={`ml-2 h-4 w-4 transition-transform ${constituencyDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </Button>

                    {/* Constituency Dropdown Menu */}
                    {constituencyDropdownOpen && selectedCounty && constituencies.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-hidden">
                        {/* Search Input */}
                        <div className="p-3 border-b">
                          <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search constituencies..."
                              value={constituencySearch}
                              onChange={(e) => setConstituencySearch(e.target.value)}
                              className="pl-10"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>

                        {/* Constituencies List */}
                        <div className="max-h-60 overflow-y-auto">
                          {filteredConstituencies.length > 0 ? (
                            filteredConstituencies.map((constituency) => (
                              <button
                                key={constituency.id}
                                className="w-full px-4 py-3 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-50 last:border-b-0"
                                onClick={() => handleConstituencySelect(constituency)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex flex-col">
                                    <span className="font-medium">{constituency.name}</span>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                      <span>{constituency.wards} wards</span>
                                      {constituency.registeredVoters && (
                                        <>
                                          <span>•</span>
                                          <span>{constituency.registeredVoters.toLocaleString()} voters</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-xs text-gray-500">
                                      {constituency.population > 0
                                        ? `${constituency.population.toLocaleString()} people`
                                        : "Population data pending"}
                                    </div>
                                  </div>
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                              No constituencies found matching "{constituencySearch}"
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Summary */}
      {(selectedCounty || selectedConstituency) && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Active Filters:</span>

              {selectedCounty && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-300">
                  County: {selectedCounty.name}
                </Badge>
              )}

              {selectedConstituency && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">
                  Constituency: {selectedConstituency.name}
                </Badge>
              )}

              <span className="text-sm text-blue-700">
                {selectedConstituency
                  ? `Showing projects in ${selectedConstituency.name}, ${selectedCounty?.name}`
                  : selectedCounty
                    ? `Showing projects in ${selectedCounty.name} County`
                    : ""}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Click Outside Handler */}
      {(countyDropdownOpen || constituencyDropdownOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            console.log("🖱️ Clicked outside, closing dropdowns")
            setCountyDropdownOpen(false)
            setConstituencyDropdownOpen(false)
          }}
        />
      )}
    </div>
  )
}
