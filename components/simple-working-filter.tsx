"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronDown, MapPin, X, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { enhancedKenyaLocations, getConstituenciesByCounty } from "@/lib/enhanced-kenya-locations"
import type { County, Constituency } from "@/lib/enhanced-kenya-locations"

interface SimpleWorkingFilterProps {
  onFilterChange: (county: County | null, constituency: Constituency | null) => void
  className?: string
}

export function SimpleWorkingFilter({ onFilterChange, className }: SimpleWorkingFilterProps) {
  // State management
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null)
  const [selectedConstituency, setSelectedConstituency] = useState<Constituency | null>(null)
  const [constituencies, setConstituencies] = useState<Constituency[]>([])

  // UI state
  const [countyDropdownOpen, setCountyDropdownOpen] = useState(false)
  const [constituencyDropdownOpen, setConstituencyDropdownOpen] = useState(false)
  const [countySearch, setCountySearch] = useState("")
  const [constituencySearch, setConstituencySearch] = useState("")

  // Get all counties directly from the data
  const counties = enhancedKenyaLocations

  console.log("🔍 SimpleWorkingFilter: Available counties:", counties.length)

  // Load constituencies when county changes
  useEffect(() => {
    if (selectedCounty) {
      console.log(`🔄 Loading constituencies for ${selectedCounty.name}...`)
      const constituenciesForCounty = getConstituenciesByCounty(selectedCounty.id)
      setConstituencies(constituenciesForCounty)
      console.log(`✅ Loaded ${constituenciesForCounty.length} constituencies for ${selectedCounty.name}`)
    } else {
      setConstituencies([])
    }
  }, [selectedCounty])

  // Handle county selection
  const handleCountySelect = useCallback(
    (county: County) => {
      console.log(`🏛️ County selected: ${county.name}`)
      setSelectedCounty(county)
      setSelectedConstituency(null) // Reset constituency when county changes
      setCountyDropdownOpen(false)
      setCountySearch("")

      // Notify parent component
      onFilterChange(county, null)
    },
    [onFilterChange],
  )

  // Handle constituency selection
  const handleConstituencySelect = useCallback(
    (constituency: Constituency) => {
      console.log(`🏘️ Constituency selected: ${constituency.name}`)
      setSelectedConstituency(constituency)
      setConstituencyDropdownOpen(false)
      setConstituencySearch("")

      // Notify parent component
      onFilterChange(selectedCounty, constituency)
    },
    [selectedCounty, onFilterChange],
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
    onFilterChange(null, null)
  }, [onFilterChange])

  // Filter counties based on search
  const filteredCounties = counties.filter((county) => county.name.toLowerCase().includes(countySearch.toLowerCase()))

  // Filter constituencies based on search
  const filteredConstituencies = constituencies.filter((constituency) =>
    constituency.name.toLowerCase().includes(constituencySearch.toLowerCase()),
  )

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* County Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">County</label>
          <div className="relative">
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => {
                console.log("🖱️ County button clicked, current state:", countyDropdownOpen)
                setCountyDropdownOpen(!countyDropdownOpen)
                setConstituencyDropdownOpen(false)
              }}
            >
              {selectedCounty ? (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{selectedCounty.name}</span>
                </div>
              ) : (
                <span className="text-muted-foreground">Select county...</span>
              )}
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${countyDropdownOpen ? "rotate-180" : ""}`} />
            </Button>

            {/* County Dropdown Menu */}
            {countyDropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                {/* Search Input */}
                <div className="p-2 border-b">
                  <input
                    type="text"
                    placeholder="Search counties..."
                    value={countySearch}
                    onChange={(e) => setCountySearch(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {/* Counties List */}
                <div className="py-1">
                  {filteredCounties.length > 0 ? (
                    filteredCounties.map((county) => (
                      <button
                        key={county.id}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                        onClick={() => handleCountySelect(county)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="font-medium">{county.name}</span>
                            <span className="text-xs text-gray-500">Capital: {county.capital}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {county.constituencies.length}
                          </Badge>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">No counties found</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Constituency Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Constituency</label>
          <div className="relative">
            <Button
              variant="outline"
              className="w-full justify-between"
              disabled={!selectedCounty}
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
                <span className="text-muted-foreground">Select constituency...</span>
              ) : (
                <span className="text-muted-foreground">Select county first</span>
              )}
              <ChevronDown
                className={`ml-2 h-4 w-4 transition-transform ${constituencyDropdownOpen ? "rotate-180" : ""}`}
              />
            </Button>

            {/* Constituency Dropdown Menu */}
            {constituencyDropdownOpen && selectedCounty && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                {/* Search Input */}
                <div className="p-2 border-b">
                  <input
                    type="text"
                    placeholder="Search constituencies..."
                    value={constituencySearch}
                    onChange={(e) => setConstituencySearch(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {/* Constituencies List */}
                <div className="py-1">
                  {filteredConstituencies.length > 0 ? (
                    filteredConstituencies.map((constituency) => (
                      <button
                        key={constituency.id}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                        onClick={() => handleConstituencySelect(constituency)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="font-medium">{constituency.name}</span>
                            {constituency.population && (
                              <span className="text-xs text-gray-500">
                                {constituency.population.toLocaleString()} people
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">No constituencies found</div>
                  )}
                </div>
              </div>
            )}
          </div>
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

      {/* Debug Information */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="text-xs text-gray-600 space-y-1">
            <div>
              <strong>Debug Info:</strong>
            </div>
            <div>Total Counties Available: {counties.length}</div>
            <div>
              Counties Data:{" "}
              {counties
                .slice(0, 3)
                .map((c) => c.name)
                .join(", ")}
              ...
            </div>
            <div>Selected County: {selectedCounty?.name || "None"}</div>
            <div>Available Constituencies: {constituencies.length}</div>
            <div>Selected Constituency: {selectedConstituency?.name || "None"}</div>
            <div>County Dropdown Open: {countyDropdownOpen.toString()}</div>
            <div>Constituency Dropdown Open: {constituencyDropdownOpen.toString()}</div>
            <div>County Search: "{countySearch}"</div>
            <div>Filtered Counties: {filteredCounties.length}</div>
            <div>Filtered Constituencies: {filteredConstituencies.length}</div>
          </div>
        </CardContent>
      </Card>

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
