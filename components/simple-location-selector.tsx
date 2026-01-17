"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import {
  enhancedKenyaLocations,
  getCountyById,
  getConstituenciesByCounty,
  type County,
  type Constituency,
} from "@/lib/enhanced-kenya-locations"

interface SimpleLocationSelectorProps {
  onLocationChange?: (county: County | null, constituency: Constituency | null) => void
  placeholder?: string
  className?: string
}

export function SimpleLocationSelector({
  onLocationChange,
  placeholder = "Select location",
  className,
}: SimpleLocationSelectorProps) {
  const [open, setOpen] = useState(false)
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null)
  const [selectedConstituency, setSelectedConstituency] = useState<Constituency | null>(null)
  const [searchValue, setSearchValue] = useState("")
  const [mode, setMode] = useState<"county" | "constituency">("county")

  const handleCountySelect = (county: County) => {
    setSelectedCounty(county)
    setSelectedConstituency(null)
    setSearchValue("")
    setMode("county") // stay on counties; user can reopen to drill down
    setOpen(false)
    onLocationChange?.(county, null)
  }

  const handleConstituencySelect = (constituency: Constituency) => {
    const county = getCountyById(constituency.countyId)
    setSelectedCounty(county || null)
    setSelectedConstituency(constituency)
    setOpen(false)
    setSearchValue("")
    onLocationChange?.(county || null, constituency)
  }

  const clearSelection = () => {
    setSelectedCounty(null)
    setSelectedConstituency(null)
    setSearchValue("")
    setMode("county")
    onLocationChange?.(null, null)
  }

  const resetToCountyMode = () => {
    setMode("county")
    setSearchValue("")
  }

  const filteredCounties = enhancedKenyaLocations.filter((county) =>
    county.name.toLowerCase().includes(searchValue.toLowerCase()),
  )

  const availableConstituencies = selectedCounty
    ? getConstituenciesByCounty(selectedCounty.id).filter((constituency) =>
        constituency.name.toLowerCase().includes(searchValue.toLowerCase()),
      )
    : []

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between rounded-full border-foreground/20 bg-background"
          >
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              {selectedConstituency ? (
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <span className="truncate">{selectedConstituency.name}</span>
                  <Badge variant="outline" className="border-foreground/20 text-xs text-foreground">
                    {selectedCounty?.name}
                  </Badge>
                </div>
              ) : selectedCounty ? (
                <span className="truncate">{selectedCounty.name} County</span>
              ) : (
                <span className="truncate text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[350px] rounded-2xl border-foreground/10 bg-background p-0 shadow-lg">
          <Command>
            <CommandInput
              placeholder={mode === "county" ? "Search counties..." : "Search constituencies..."}
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>No {mode === "county" ? "counties" : "constituencies"} found.</CommandEmpty>

              {selectedCounty && mode === "constituency" && (
                <CommandGroup>
                  <CommandItem onSelect={resetToCountyMode} className="text-muted-foreground">
                    Back to counties
                  </CommandItem>
                </CommandGroup>
              )}

              {mode === "county" && (
                <CommandGroup heading="Counties">
                  {filteredCounties.map((county) => (
                    <CommandItem key={county.id} value={county.name} onSelect={() => handleCountySelect(county)}>
                      <Check
                        className={cn("mr-2 h-4 w-4", selectedCounty?.id === county.id ? "opacity-100" : "opacity-0")}
                      />
                      <div className="flex w-full items-center justify-between">
                        <span>{county.name}</span>
                        <Badge variant="outline" className="border-foreground/20 text-xs text-foreground">
                          {county.constituencies.length} constituencies
                        </Badge>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {mode === "constituency" && selectedCounty && (
                <CommandGroup heading={`Constituencies in ${selectedCounty.name}`}>
                  {availableConstituencies.map((constituency) => (
                    <CommandItem
                      key={constituency.id}
                      value={constituency.name}
                      onSelect={() => handleConstituencySelect(constituency)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedConstituency?.id === constituency.id ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <span>{constituency.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {(selectedCounty || selectedConstituency) && (
        <Button variant="ghost" size="sm" onClick={clearSelection} className="h-6 self-start px-2 text-xs">
          Clear selection
        </Button>
      )}
    </div>
  )
}
