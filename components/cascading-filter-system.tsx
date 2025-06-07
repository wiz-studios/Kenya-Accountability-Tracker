"use client"

import { useState, useMemo, useCallback } from "react"
import { Check, ChevronsUpDown, MapPin, Loader2, X, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  enhancedKenyaLocations,
  getConstituenciesByCounty,
  type County,
  type Constituency,
} from "@/lib/enhanced-kenya-locations"

interface CascadingFilterSystemProps {
  onFilterChange: (county: County | null, constituency: Constituency | null) => void
  className?: string
  disabled?: boolean
}

export function CascadingFilterSystem({ onFilterChange, className, disabled = false }: CascadingFilterSystemProps) {
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null)
  const [selectedConstituency, setSelectedConstituency] = useState<Constituency | null>(null)
  const [countyOpen, setCountyOpen] = useState(false)
  const [constituencyOpen, setConstituencyOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [countySearch, setCountySearch] = useState("")
  const [constituencySearch, setConstituencySearch] = useState("")

  // Filter counties based on search
  const filteredCounties = useMemo(() => {
    if (!countySearch) return enhancedKenyaLocations
    return enhancedKenyaLocations.filter((county) => county.name.toLowerCase().includes(countySearch.toLowerCase()))
  }, [countySearch])

  // Get constituencies for selected county
  const constituencies = useMemo(() => {
    if (!selectedCounty) return []
    return getConstituenciesByCounty(selectedCounty.id)
  }, [selectedCounty])

  // Filter constituencies based on search
  const filteredConstituencies = useMemo(() => {
    if (!constituencySearch) return constituencies
    return constituencies.filter((constituency) =>
      constituency.name.toLowerCase().includes(constituencySearch.toLowerCase()),
    )
  }, [constituencies, constituencySearch])

  // Handle county selection
  const handleCountySelect = useCallback(
    async (county: County) => {
      setIsLoading(true)
      setSelectedCounty(county)
      setSelectedConstituency(null)
      setCountyOpen(false)
      setCountySearch("")

      // Simulate loading delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 300))
      setIsLoading(false)

      onFilterChange(county, null)
    },
    [onFilterChange],
  )

  // Handle constituency selection
  const handleConstituencySelect = useCallback(
    async (constituency: Constituency) => {
      setIsLoading(true)
      setSelectedConstituency(constituency)
      setConstituencyOpen(false)
      setConstituencySearch("")

      // Simulate loading delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 200))
      setIsLoading(false)

      onFilterChange(selectedCounty, constituency)
    },
    [selectedCounty, onFilterChange],
  )

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSelectedCounty(null)
    setSelectedConstituency(null)
    setCountySearch("")
    setConstituencySearch("")
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
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={countyOpen}
                className="w-full justify-between"
                disabled={disabled}
              >
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
                <CommandInput
                  placeholder="Search counties..."
                  value={countySearch}
                  onValueChange={setCountySearch}
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No counties found.</CommandEmpty>
                  <CommandGroup heading={`Counties (${filteredCounties.length})`}>
                    {filteredCounties.map((county) => (
                      <CommandItem
                        key={county.id}
                        onSelect={() => handleCountySelect(county)}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn("mr-2 h-4 w-4", selectedCounty?.id === county.id ? "opacity-100" : "opacity-0")}
                        />
                        <div className="flex items-center justify-between w-full">
                          <div className="flex flex-col">
                            <span>{county.name}</span>
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
                disabled={disabled || !selectedCounty || isLoading}
              >
                {isLoading ? (
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
                  <CommandEmpty>No constituencies found.</CommandEmpty>
                  {selectedCounty && (
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

      {/* Loading State */}
      {isLoading && (
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
              <span className="text-sm text-gray-600">
                {selectedConstituency ? "Loading projects..." : "Loading constituencies..."}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
