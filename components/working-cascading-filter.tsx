"use client"

import { useState, useEffect, useCallback } from "react"
import { Check, ChevronsUpDown, MapPin, X, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { enhancedKenyaLocations, getConstituenciesByCounty } from "@/lib/enhanced-kenya-locations"
import type { County, Constituency } from "@/lib/enhanced-kenya-locations"

interface WorkingCascadingFilterProps {
  onFilterChange: (county: County | null, constituency: Constituency | null) => void
  className?: string
}

export function WorkingCascadingFilter({ onFilterChange, className }: WorkingCascadingFilterProps) {
  // State management
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null)
  const [selectedConstituency, setSelectedConstituency] = useState<Constituency | null>(null)
  const [constituencies, setConstituencies] = useState<Constituency[]>([])

  // UI state
  const [countyOpen, setCountyOpen] = useState(false)
  const [constituencyOpen, setConstituencyOpen] = useState(false)

  // Get all counties directly from the data
  const counties = enhancedKenyaLocations

  console.log("🔍 WorkingCascadingFilter: Available counties:", counties.length)

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
      setCountyOpen(false)

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
      setConstituencyOpen(false)

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
    onFilterChange(null, null)
  }, [onFilterChange])

  return (
    <div className={cn("space-y-4", className)}>
      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* County Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">County</label>
          <Popover open={countyOpen} onOpenChange={setCountyOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={countyOpen} className="w-full justify-between">
                {selectedCounty ? (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{selectedCounty.name}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Select county...</span>
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search counties..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No counties found.</CommandEmpty>
                  <CommandGroup heading={`Counties (${counties.length})`}>
                    {counties.map((county) => (
                      <CommandItem
                        key={county.id}
                        value={county.name}
                        onSelect={() => handleCountySelect(county)}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn("mr-2 h-4 w-4", selectedCounty?.id === county.id ? "opacity-100" : "opacity-0")}
                        />
                        <div className="flex items-center justify-between w-full">
                          <div className="flex flex-col">
                            <span>{county.name}</span>
                            <span className="text-xs text-muted-foreground">Capital: {county.capital}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {county.constituencies.length}
                          </Badge>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Constituency Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Constituency</label>
          <Popover open={constituencyOpen} onOpenChange={setConstituencyOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={constituencyOpen}
                className="w-full justify-between"
                disabled={!selectedCounty}
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
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search constituencies..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No constituencies found.</CommandEmpty>
                  {selectedCounty && constituencies.length > 0 && (
                    <CommandGroup heading={`${selectedCounty.name} Constituencies (${constituencies.length})`}>
                      {constituencies.map((constituency) => (
                        <CommandItem
                          key={constituency.id}
                          value={constituency.name}
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
            <div>County Dropdown Open: {countyOpen.toString()}</div>
            <div>Constituency Dropdown Open: {constituencyOpen.toString()}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
