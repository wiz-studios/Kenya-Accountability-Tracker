"use client"

import { useState, useMemo } from "react"
import { MapPin, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  enhancedKenyaLocations,
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
  const [searchInput, setSearchInput] = useState("")
  const [mode, setMode] = useState<"county" | "constituency">("county")

  const filteredCounties = useMemo(() => {
    return enhancedKenyaLocations.filter((c) =>
      c.name.toLowerCase().includes(searchInput.toLowerCase())
    )
  }, [searchInput])

  const filteredConstituencies = useMemo(() => {
    if (!selectedCounty) return []
    return getConstituenciesByCounty(selectedCounty.id).filter((con) =>
      con.name.toLowerCase().includes(searchInput.toLowerCase())
    )
  }, [selectedCounty, searchInput])

  const handleSelectCounty = (county: County) => {
    setSelectedCounty(county)
    setSelectedConstituency(null)
    setSearchInput("")
    setMode("constituency")
    onLocationChange?.(county, null)
  }

  const handleSelectConstituency = (constituency: Constituency) => {
    setSelectedConstituency(constituency)
    setOpen(false)
    setSearchInput("")
    onLocationChange?.(selectedCounty, constituency)
  }

  const handleClear = () => {
    setSelectedCounty(null)
    setSelectedConstituency(null)
    setSearchInput("")
    setMode("county")
    onLocationChange?.(null, null)
  }

  const handleBackToCounties = () => {
    setMode("county")
    setSearchInput("")
  }

  const displayText = selectedConstituency
    ? `${selectedConstituency.name}, ${selectedCounty?.name}`
    : selectedCounty
      ? `${selectedCounty.name} County`
      : placeholder

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="justify-between rounded-full border-foreground/20 bg-background"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate text-sm">{displayText}</span>
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-0" align="start">
          <div className="space-y-2 p-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">
                {mode === "county" ? "Select County" : `Select Constituency${selectedCounty ? ` (${selectedCounty.name})` : ""}`}
              </h3>
              {mode === "constituency" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToCounties}
                  className="h-6 px-2 text-xs"
                >
                  Back
                </Button>
              )}
            </div>

            {/* Search Input */}
            <Input
              placeholder={mode === "county" ? "Search counties..." : "Search constituencies..."}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-8"
            />

            {/* Counties List */}
            {mode === "county" && (
              <ScrollArea className="h-[300px] border rounded-lg">
                <div className="p-2 space-y-1">
                  {filteredCounties.length === 0 ? (
                    <div className="text-sm text-muted-foreground p-3 text-center">
                      No counties found
                    </div>
                  ) : (
                    filteredCounties.map((county) => (
                      <button
                        key={county.id}
                        onClick={() => handleSelectCounty(county)}
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-between group"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium">{county.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {county.constituencies.length} constituencies
                          </div>
                        </div>
                        {selectedCounty?.id === county.id && (
                          <Badge variant="secondary" className="ml-2 flex-shrink-0">
                            ✓
                          </Badge>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
            )}

            {/* Constituencies List */}
            {mode === "constituency" && selectedCounty && (
              <ScrollArea className="h-[300px] border rounded-lg">
                <div className="p-2 space-y-1">
                  {filteredConstituencies.length === 0 ? (
                    <div className="text-sm text-muted-foreground p-3 text-center">
                      No constituencies found
                    </div>
                  ) : (
                    filteredConstituencies.map((constituency) => (
                      <button
                        key={constituency.id}
                        onClick={() => handleSelectConstituency(constituency)}
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-between"
                      >
                        <div className="text-sm font-medium">{constituency.name}</div>
                        {selectedConstituency?.id === constituency.id && (
                          <Badge variant="secondary">✓</Badge>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Clear button */}
      {(selectedCounty || selectedConstituency) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="h-6 self-start px-2 text-xs gap-1"
        >
          <X className="h-3 w-3" />
          Clear
        </Button>
      )}
    </div>
  )
}
