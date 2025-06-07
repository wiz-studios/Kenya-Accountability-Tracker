"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Check, ChevronsUpDown, MapPin, Loader2, X, Filter, AlertCircle, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { dataService, type DataServiceError } from "@/lib/data-service"
import type { County, Constituency } from "@/lib/enhanced-kenya-locations"

interface EnhancedCascadingFilterProps {
  onFilterChange: (county: County | null, constituency: Constituency | null) => void
  className?: string
  disabled?: boolean
}

export function EnhancedCascadingFilter({ onFilterChange, className, disabled = false }: EnhancedCascadingFilterProps) {
  // State management
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null)
  const [selectedConstituency, setSelectedConstituency] = useState<Constituency | null>(null)
  const [counties, setCounties] = useState<County[]>([])
  const [constituencies, setConstituencies] = useState<Constituency[]>([])

  // UI state
  const [countyOpen, setCountyOpen] = useState(false)
  const [constituencyOpen, setConstituencyOpen] = useState(false)
  const [isLoadingCounties, setIsLoadingCounties] = useState(true)
  const [isLoadingConstituencies, setIsLoadingConstituencies] = useState(false)

  // Search state
  const [countySearch, setCountySearch] = useState("")
  const [constituencySearch, setConstituencySearch] = useState("")

  // Error state
  const [error, setError] = useState<DataServiceError | null>(null)

  // Load counties on component mount
  useEffect(() => {
    const loadCounties = async () => {
      console.log("🔄 EnhancedCascadingFilter: Loading counties...")
      setIsLoadingCounties(true)
      setError(null)

      try {
        const result = await dataService.getCounties()

        if (result.error) {
          console.error("❌ EnhancedCascadingFilter: Error loading counties:", result.error)
          setError(result.error)
          setCounties([])
        } else if (result.data) {
          console.log(`✅ EnhancedCascadingFilter: Loaded ${result.data.length} counties`)
          setCounties(result.data)
          setError(null)
        }
      } catch (err) {
        console.error("❌ EnhancedCascadingFilter: Unexpected error loading counties:", err)
        setError({
          code: "UNEXPECTED_ERROR",
          message: "An unexpected error occurred while loading counties",
          details: err,
        })
      } finally {
        setIsLoadingCounties(false)
      }
    }

    loadCounties()
  }, [])

  // Load constituencies when county changes
  useEffect(() => {
    const loadConstituencies = async () => {
      if (!selectedCounty) {
        setConstituencies([])
        return
      }

      console.log(`🔄 EnhancedCascadingFilter: Loading constituencies for ${selectedCounty.name}...`)
      setIsLoadingConstituencies(true)
      setError(null)

      try {
        const result = await dataService.getConstituenciesByCounty(selectedCounty.id)

        if (result.error) {
          console.error("❌ EnhancedCascadingFilter: Error loading constituencies:", result.error)
          setError(result.error)
          setConstituencies([])
        } else if (result.data) {
          console.log(
            `✅ EnhancedCascadingFilter: Loaded ${result.data.length} constituencies for ${selectedCounty.name}`,
          )
          setConstituencies(result.data)
          setError(null)
        }
      } catch (err) {
        console.error("❌ EnhancedCascadingFilter: Unexpected error loading constituencies:", err)
        setError({
          code: "UNEXPECTED_ERROR",
          message: "An unexpected error occurred while loading constituencies",
          details: err,
        })
      } finally {
        setIsLoadingConstituencies(false)
      }
    }

    loadConstituencies()
  }, [selectedCounty])

  // Filter counties based on search
  const filteredCounties = useMemo(() => {
    if (!countySearch.trim()) return counties
    const searchLower = countySearch.toLowerCase()
    return counties.filter(
      (county) =>
        county.name.toLowerCase().includes(searchLower) ||
        county.capital.toLowerCase().includes(searchLower) ||
        county.code.includes(searchLower),
    )
  }, [counties, countySearch])

  // Filter constituencies based on search
  const filteredConstituencies = useMemo(() => {
    if (!constituencySearch.trim()) return constituencies
    const searchLower = constituencySearch.toLowerCase()
    return constituencies.filter((constituency) => constituency.name.toLowerCase().includes(searchLower))
  }, [constituencies, constituencySearch])

  // Handle county selection
  const handleCountySelect = useCallback(
    async (county: County) => {
      console.log(`🏛️ EnhancedCascadingFilter: County selected: ${county.name}`)
      setSelectedCounty(county)
      setSelectedConstituency(null) // Reset constituency when county changes
      setCountyOpen(false)
      setCountySearch("")
      setConstituencySearch("")

      // Notify parent component
      onFilterChange(county, null)
    },
    [onFilterChange],
  )

  // Handle constituency selection
  const handleConstituencySelect = useCallback(
    async (constituency: Constituency) => {
      console.log(`🏘️ EnhancedCascadingFilter: Constituency selected: ${constituency.name}`)
      setSelectedConstituency(constituency)
      setConstituencyOpen(false)
      setConstituencySearch("")

      // Notify parent component
      onFilterChange(selectedCounty, constituency)
    },
    [selectedCounty, onFilterChange],
  )

  // Clear all filters
  const clearFilters = useCallback(() => {
    console.log("🧹 EnhancedCascadingFilter: Clearing all filters")
    setSelectedCounty(null)
    setSelectedConstituency(null)
    setCountySearch("")
    setConstituencySearch("")
    onFilterChange(null, null)
  }, [onFilterChange])

  // Retry loading data
  const retryLoading = useCallback(() => {
    console.log("🔄 EnhancedCascadingFilter: Retrying data load...")
    setError(null)
    // Trigger re-load by clearing and setting counties
    setCounties([])
    setIsLoadingCounties(true)

    // Re-trigger the useEffect
    setTimeout(() => {
      dataService.getCounties().then((result) => {
        if (result.data) {
          setCounties(result.data)
        }
        setIsLoadingCounties(false)
      })
    }, 100)
  }, [])

  return (
    <div className={cn("space-y-4", className)}>
      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <strong>Error:</strong> {error.message}
              {error.code && <span className="text-xs block">Code: {error.code}</span>}
            </div>
            <Button variant="outline" size="sm" onClick={retryLoading}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* County Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            County {isLoadingCounties && <Loader2 className="inline h-3 w-3 animate-spin ml-1" />}
          </label>
          <Popover open={countyOpen} onOpenChange={setCountyOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={countyOpen}
                className="w-full justify-between"
                disabled={disabled || isLoadingCounties || !!error}
              >
                {isLoadingCounties ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading counties...</span>
                  </div>
                ) : selectedCounty ? (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{selectedCounty.name}</span>
                  </div>
                ) : error ? (
                  <span className="text-red-500">Error loading counties</span>
                ) : (
                  <span className="text-muted-foreground">Select county...</span>
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
              <Command>
                <CommandInput
                  placeholder="Search counties..."
                  value={countySearch}
                  onValueChange={setCountySearch}
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>{isLoadingCounties ? "Loading counties..." : "No counties found."}</CommandEmpty>
                  {!isLoadingCounties && filteredCounties.length > 0 && (
                    <CommandGroup heading={`Counties (${filteredCounties.length})`}>
                      {filteredCounties.map((county) => (
                        <CommandItem
                          key={county.id}
                          onSelect={() => handleCountySelect(county)}
                          className="cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedCounty?.id === county.id ? "opacity-100" : "opacity-0",
                            )}
                          />
                          <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col">
                              <span>{county.name}</span>
                              <span className="text-xs text-muted-foreground">Capital: {county.capital}</span>
                              {county.population && (
                                <span className="text-xs text-muted-foreground">
                                  {(county.population / 1000000).toFixed(1)}M people
                                </span>
                              )}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {county.constituencies.length} constituencies
                            </Badge>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Constituency Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Constituency {isLoadingConstituencies && <Loader2 className="inline h-3 w-3 animate-spin ml-1" />}
          </label>
          <Popover open={constituencyOpen} onOpenChange={setConstituencyOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={constituencyOpen}
                className="w-full justify-between"
                disabled={disabled || !selectedCounty || isLoadingConstituencies || !!error}
              >
                {isLoadingConstituencies ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : selectedConstituency ? (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{selectedConstituency.name}</span>
                  </div>
                ) : selectedCounty ? (
                  <span className="text-muted-foreground">Select constituency...</span>
                ) : (
                  <span className="text-muted-foreground">Select county first</span>
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
              <Command>
                <CommandInput
                  placeholder="Search constituencies..."
                  value={constituencySearch}
                  onValueChange={setConstituencySearch}
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>
                    {isLoadingConstituencies ? "Loading constituencies..." : "No constituencies found."}
                  </CommandEmpty>
                  {selectedCounty && !isLoadingConstituencies && filteredConstituencies.length > 0 && (
                    <CommandGroup heading={`${selectedCounty.name} Constituencies (${filteredConstituencies.length})`}>
                      {filteredConstituencies.map((constituency) => (
                        <CommandItem
                          key={constituency.id}
                          onSelect={() => handleConstituencySelect(constituency)}
                          className="cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedConstituency?.id === constituency.id ? "opacity-100" : "opacity-0",
                            )}
                          />
                          <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col">
                              <span>{constituency.name}</span>
                              {constituency.population && (
                                <span className="text-xs text-muted-foreground">
                                  {constituency.population.toLocaleString()} people
                                </span>
                              )}
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Clear Filters Button */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 opacity-0">Actions</label>
          <Button
            variant="outline"
            onClick={clearFilters}
            disabled={!selectedCounty && !selectedConstituency}
            className="w-full"
          >
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      </div>

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

      {/* Debug Information (Development Only) */}
      {process.env.NODE_ENV === "development" && (
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4">
            <div className="text-xs text-gray-600 space-y-1">
              <div>
                <strong>Debug Info:</strong>
              </div>
              <div>Counties loaded: {counties.length}</div>
              <div>Constituencies loaded: {constituencies.length}</div>
              <div>Selected County: {selectedCounty?.name || "None"}</div>
              <div>Selected Constituency: {selectedConstituency?.name || "None"}</div>
              <div>Loading Counties: {isLoadingCounties.toString()}</div>
              <div>Loading Constituencies: {isLoadingConstituencies.toString()}</div>
              <div>Error: {error?.message || "None"}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
