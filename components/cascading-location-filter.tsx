"use client"

import { useState, useEffect, useMemo } from "react"
import { Check, ChevronsUpDown, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  enhancedKenyaLocations,
  getConstituenciesByCounty,
  type County,
  type Constituency,
} from "@/lib/enhanced-kenya-locations"

interface CascadingLocationFilterProps {
  onLocationChange: (county: County | null, constituency: Constituency | null) => void
  initialCounty?: County | null
  initialConstituency?: Constituency | null
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function CascadingLocationFilter({
  onLocationChange,
  initialCounty = null,
  initialConstituency = null,
  placeholder = "Select location...",
  className,
  disabled = false,
}: CascadingLocationFilterProps) {
  const [open, setOpen] = useState(false)
  const [selectedCounty, setSelectedCounty] = useState<County | null>(initialCounty)
  const [selectedConstituency, setSelectedConstituency] = useState<Constituency | null>(initialConstituency)
  const [view, setView] = useState<"counties" | "constituencies">("counties")
  const [searchTerm, setSearchTerm] = useState("")

  // Initialize with provided values
  useEffect(() => {
    if (initialCounty) {
      setSelectedCounty(initialCounty)
    }
    if (initialConstituency) {
      setSelectedConstituency(initialConstituency)
    }
  }, [initialCounty, initialConstituency])

  // Filter counties based on search term
  const filteredCounties = useMemo(() => {
    if (!searchTerm) return enhancedKenyaLocations
    return enhancedKenyaLocations.filter((county) => county.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [searchTerm])

  // Get constituencies for selected county
  const constituencies = useMemo(() => {
    if (!selectedCounty) return []
    return getConstituenciesByCounty(selectedCounty.id)
  }, [selectedCounty])

  // Filter constituencies based on search term
  const filteredConstituencies = useMemo(() => {
    if (!searchTerm) return constituencies
    return constituencies.filter((constituency) => constituency.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [constituencies, searchTerm])

  // Handle county selection
  function selectCounty(county: County) {
    setSelectedCounty(county)
    setSelectedConstituency(null)
    setView("constituencies")
    setSearchTerm("")
    onLocationChange(county, null)
  }

  // Handle constituency selection
  function selectConstituency(constituency: Constituency) {
    setSelectedConstituency(constituency)
    setOpen(false)
    onLocationChange(selectedCounty, constituency)
  }

  // Clear selection
  function clearSelection() {
    setSelectedCounty(null)
    setSelectedConstituency(null)
    setView("counties")
    setSearchTerm("")
    onLocationChange(null, null)
  }

  // Display value for the button
  const displayValue = selectedConstituency
    ? `${selectedConstituency.name}, ${selectedCounty?.name}`
    : selectedCounty
      ? `${selectedCounty.name} County`
      : ""

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            onClick={() => {
              if (!open) {
                setView("counties")
                setSearchTerm("")
              }
            }}
            disabled={disabled}
          >
            {displayValue ? (
              <div className="flex items-center gap-2 truncate">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="truncate">{displayValue}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <div className="flex items-center border-b px-3">
              <CommandInput
                placeholder={view === "counties" ? "Search counties..." : "Search constituencies..."}
                onValueChange={setSearchTerm}
                value={searchTerm}
                className="h-9"
              />
              {(selectedCounty || selectedConstituency) && (
                <Button variant="ghost" size="sm" onClick={clearSelection} className="h-8 px-2 text-xs">
                  Clear
                </Button>
              )}
            </div>

            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>

              {/* Navigation */}
              {view === "constituencies" && selectedCounty && (
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      setView("counties")
                      setSearchTerm("")
                    }}
                    className="text-sm text-muted-foreground"
                  >
                    ← Back to counties
                  </CommandItem>
                </CommandGroup>
              )}

              {/* Counties List */}
              {view === "counties" && (
                <CommandGroup heading="Counties">
                  {filteredCounties.map((county) => (
                    <CommandItem
                      key={county.id}
                      onSelect={() => selectCounty(county)}
                      className="text-sm cursor-pointer"
                    >
                      <Check
                        className={cn("mr-2 h-4 w-4", selectedCounty?.id === county.id ? "opacity-100" : "opacity-0")}
                      />
                      {county.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {/* Constituencies List */}
              {view === "constituencies" && selectedCounty && (
                <CommandGroup heading={`${selectedCounty.name} Constituencies`}>
                  {filteredConstituencies.map((constituency) => (
                    <CommandItem
                      key={constituency.id}
                      onSelect={() => selectConstituency(constituency)}
                      className="text-sm cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedConstituency?.id === constituency.id ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {constituency.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
