"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { AlertCircle, CheckCircle, ChevronDown, Filter, MapPin, RefreshCw, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { dataFetchingService } from "@/lib/data-fetching-service"
import { formatNumber } from "@/lib/formatters"
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
  const [selectedCounty, setSelectedCounty] = useState<County | null>(initialCounty)
  const [selectedConstituency, setSelectedConstituency] = useState<Constituency | null>(initialConstituency)
  const [counties, setCounties] = useState<County[]>([])
  const [constituencies, setConstituencies] = useState<Constituency[]>([])
  const [statistics, setStatistics] = useState<any>(null)

  const [countyDropdownOpen, setCountyDropdownOpen] = useState(false)
  const [constituencyDropdownOpen, setConstituencyDropdownOpen] = useState(false)
  const [countySearch, setCountySearch] = useState("")
  const [constituencySearch, setConstituencySearch] = useState("")

  const [countiesLoading, setCountiesLoading] = useState(true)
  const [constituenciesLoading, setConstituenciesLoading] = useState(false)
  const [statisticsLoading, setStatisticsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCounties()
    if (showStatistics) {
      loadStatistics()
    }
  }, [showStatistics])

  useEffect(() => {
    if (selectedCounty) {
      loadConstituencies(selectedCounty.id)
    } else {
      setConstituencies([])
    }
  }, [selectedCounty])

  const loadCounties = useCallback(async () => {
    setCountiesLoading(true)
    setError(null)

    try {
      const result = await dataFetchingService.getCounties()

      if (result.error) {
        setError(result.error.message)
        setCounties([])
      } else if (result.data) {
        setCounties(result.data)
        setError(null)
      }
    } catch (err) {
      setError("Failed to load counties data")
      setCounties([])
    } finally {
      setCountiesLoading(false)
    }
  }, [])

  const loadConstituencies = useCallback(async (countyId: string) => {
    setConstituenciesLoading(true)

    try {
      const result = await dataFetchingService.getConstituenciesByCounty(countyId)

      if (result.error) {
        setConstituencies([])
      } else if (result.data) {
        setConstituencies(result.data)
      }
    } catch (err) {
      setConstituencies([])
    } finally {
      setConstituenciesLoading(false)
    }
  }, [])

  const loadStatistics = useCallback(async () => {
    setStatisticsLoading(true)

    try {
      const result = await dataFetchingService.getStatistics()
      if (!result.error && result.data) {
        setStatistics(result.data)
      }
    } finally {
      setStatisticsLoading(false)
    }
  }, [])

  const handleCountySelect = useCallback(
    (county: County) => {
      setSelectedCounty(county)
      setSelectedConstituency(null)
      setCountyDropdownOpen(false)
      setCountySearch("")
      onLocationChange(county, null)
    },
    [onLocationChange],
  )

  const handleConstituencySelect = useCallback(
    (constituency: Constituency) => {
      setSelectedConstituency(constituency)
      setConstituencyDropdownOpen(false)
      setConstituencySearch("")
      onLocationChange(selectedCounty, constituency)
    },
    [selectedCounty, onLocationChange],
  )

  const clearFilters = useCallback(() => {
    setSelectedCounty(null)
    setSelectedConstituency(null)
    setCountyDropdownOpen(false)
    setConstituencyDropdownOpen(false)
    setCountySearch("")
    setConstituencySearch("")
    onLocationChange(null, null)
  }, [onLocationChange])

  const retryLoading = useCallback(() => {
    loadCounties()
    if (showStatistics) {
      loadStatistics()
    }
  }, [loadCounties, loadStatistics, showStatistics])

  const filteredCounties = useMemo(() => {
    return counties.filter((county) => county.name.toLowerCase().includes(countySearch.toLowerCase()))
  }, [counties, countySearch])

  const filteredConstituencies = useMemo(() => {
    return constituencies.filter((constituency) =>
      constituency.name.toLowerCase().includes(constituencySearch.toLowerCase()),
    )
  }, [constituencies, constituencySearch])

  return (
    <div className={`space-y-6 ${className}`}>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between gap-4">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={retryLoading}>
              <RefreshCw className="mr-1 h-3 w-3" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {showStatistics && (
        <Card className="border-foreground/10 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-sm">
              <CheckCircle className="mr-2 h-4 w-4 text-foreground" />
              Kenya administrative data
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statisticsLoading ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : statistics ? (
              <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-foreground">{statistics.totalCounties}</div>
                  <div className="text-muted-foreground">Counties</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-foreground">{statistics.totalConstituencies}</div>
                  <div className="text-muted-foreground">Constituencies</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-foreground">
                    {(statistics.totalPopulation / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-muted-foreground">Population</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-foreground">
                    {formatNumber(Math.round(statistics.totalArea / 1000))}K
                  </div>
                  <div className="text-muted-foreground">Area (km2)</div>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}

      <Card className="border-foreground/10 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Location filter
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              disabled={!selectedCounty && !selectedConstituency}
              className="rounded-full"
            >
              <X className="mr-1 h-4 w-4" />
              Clear
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">County</label>
              <div className="relative">
                {countiesLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                      onClick={() => {
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
                          {counties.length === 0 ? "No counties available" : "Select county"}
                        </span>
                      )}
                      <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${countyDropdownOpen ? "rotate-180" : ""}`} />
                    </Button>

                    {countyDropdownOpen && counties.length > 0 && (
                      <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-2xl border border-foreground/10 bg-background shadow-lg">
                        <div className="border-b border-foreground/10 p-3">
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
                        <div className="max-h-60 overflow-y-auto">
                          {filteredCounties.length > 0 ? (
                            filteredCounties.map((county) => (
                              <button
                                key={county.id}
                                className="w-full border-b border-foreground/5 px-4 py-3 text-left transition hover:bg-foreground/5 last:border-b-0"
                                onClick={() => handleCountySelect(county)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex flex-col">
                                    <span className="font-medium text-foreground">{county.name}</span>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <span>Capital: {county.capital}</span>
                                      <span>|</span>
                                      <span>{county.region}</span>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end gap-1">
                                    <Badge variant="outline" className="border-foreground/20 text-xs text-foreground">
                                      {county.constituencies.length} constituencies
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {(county.population / 1000000).toFixed(1)}M people
                                    </span>
                                  </div>
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-center text-sm text-muted-foreground">
                              No counties found for "{countySearch}"
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Constituency</label>
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
                          <span className="text-muted-foreground">Select constituency</span>
                        )
                      ) : (
                        <span className="text-muted-foreground">Select county first</span>
                      )}
                      <ChevronDown
                        className={`ml-2 h-4 w-4 transition-transform ${constituencyDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </Button>

                    {constituencyDropdownOpen && selectedCounty && constituencies.length > 0 && (
                      <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-2xl border border-foreground/10 bg-background shadow-lg">
                        <div className="border-b border-foreground/10 p-3">
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
                        <div className="max-h-60 overflow-y-auto">
                          {filteredConstituencies.length > 0 ? (
                            filteredConstituencies.map((constituency) => (
                              <button
                                key={constituency.id}
                                className="w-full border-b border-foreground/5 px-4 py-3 text-left transition hover:bg-foreground/5 last:border-b-0"
                                onClick={() => handleConstituencySelect(constituency)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex flex-col">
                                    <span className="font-medium text-foreground">{constituency.name}</span>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <span>{constituency.wards} wards</span>
                                      {constituency.registeredVoters && (
                                        <>
                                          <span>|</span>
                                          <span>{formatNumber(constituency.registeredVoters)} voters</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right text-xs text-muted-foreground">
                                    {constituency.population > 0
                                      ? `${formatNumber(constituency.population)} people`
                                      : "Population data pending"}
                                  </div>
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-center text-sm text-muted-foreground">
                              No constituencies found for "{constituencySearch}"
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

      {(selectedCounty || selectedConstituency) && (
        <Card className="border-foreground/10 bg-foreground/5 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-foreground" />
              <span className="text-sm font-medium text-foreground">Active filters:</span>
              {selectedCounty && (
                <Badge variant="outline" className="border-foreground/20 text-foreground">
                  County: {selectedCounty.name}
                </Badge>
              )}
              {selectedConstituency && (
                <Badge variant="outline" className="border-foreground/20 text-foreground">
                  Constituency: {selectedConstituency.name}
                </Badge>
              )}
              <span className="text-sm text-muted-foreground">
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

      {(countyDropdownOpen || constituencyDropdownOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setCountyDropdownOpen(false)
            setConstituencyDropdownOpen(false)
          }}
        />
      )}
    </div>
  )
}
