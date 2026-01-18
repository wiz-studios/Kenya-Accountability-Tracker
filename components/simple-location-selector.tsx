"use client"

import { useMemo, useState } from "react"
import { MapPin, Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { enhancedKenyaLocations, getConstituenciesByCounty, type County, type Constituency } from "@/lib/enhanced-kenya-locations"

interface SimpleLocationSelectorProps {
  onLocationChange?: (county: County | null, constituency: Constituency | null) => void
  placeholder?: string
  className?: string
}

const ALL_COUNTIES_VALUE = "__all_counties__"
const ALL_CONSTITUENCIES_VALUE = "__all_constituencies__"

export function SimpleLocationSelector({
  onLocationChange,
  placeholder = "Select location",
  className,
}: SimpleLocationSelectorProps) {
  const [selectedCountyId, setSelectedCountyId] = useState<string>(ALL_COUNTIES_VALUE)
  const [selectedConstituencyId, setSelectedConstituencyId] = useState<string>(ALL_CONSTITUENCIES_VALUE)
  const [countySearch, setCountySearch] = useState("")

  const sortedCounties = useMemo(
    () => [...enhancedKenyaLocations].sort((a, b) => a.name.localeCompare(b.name)),
    []
  )

  const filteredCounties = useMemo(() => {
    const term = countySearch.toLowerCase().trim()
    if (!term) return sortedCounties
    return sortedCounties.filter((c) => c.name.toLowerCase().includes(term))
  }, [countySearch, sortedCounties])

  const selectedCounty = useMemo(() => {
    if (selectedCountyId === ALL_COUNTIES_VALUE) return null
    return sortedCounties.find((county) => county.id === selectedCountyId) ?? null
  }, [selectedCountyId, sortedCounties])

  const constituencies = useMemo(() => {
    if (!selectedCounty) return []
    return getConstituenciesByCounty(selectedCounty.id)
  }, [selectedCounty])

  const selectedConstituency = useMemo(() => {
    if (!selectedCounty) return null
    if (selectedConstituencyId === ALL_CONSTITUENCIES_VALUE) return null
    return constituencies.find((constituency) => constituency.id === selectedConstituencyId) ?? null
  }, [constituencies, selectedCounty, selectedConstituencyId])

  const handleCountyChange = (value: string) => {
    setSelectedCountyId(value)
    setSelectedConstituencyId(ALL_CONSTITUENCIES_VALUE)
    setCountySearch("")

    if (value === ALL_COUNTIES_VALUE) {
      onLocationChange?.(null, null)
      return
    }

    const nextCounty = sortedCounties.find((county) => county.id === value) ?? null
    onLocationChange?.(nextCounty, null)
  }

  const handleConstituencyChange = (value: string) => {
    if (!selectedCounty) return

    setSelectedConstituencyId(value)

    if (value === ALL_CONSTITUENCIES_VALUE) {
      onLocationChange?.(selectedCounty, null)
      return
    }

    const nextConstituency = constituencies.find((constituency) => constituency.id === value) ?? null
    onLocationChange?.(selectedCounty, nextConstituency)
  }

  const handleClear = () => {
    setSelectedCountyId(ALL_COUNTIES_VALUE)
    setSelectedConstituencyId(ALL_CONSTITUENCIES_VALUE)
    setCountySearch("")
    onLocationChange?.(null, null)
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Select value={selectedCountyId} onValueChange={handleCountyChange}>
        <SelectTrigger className="rounded-full border-foreground/20 bg-background cursor-pointer">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent className="w-[260px]">
          <div className="p-2">
            <div className="flex items-center gap-2 rounded-md border px-2 py-1.5">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                value={countySearch}
                onChange={(e) => setCountySearch(e.target.value)}
                placeholder="Search counties..."
                className="h-7 border-0 shadow-none focus-visible:ring-0 p-0 text-sm"
              />
            </div>
          </div>
          <SelectItem value={ALL_COUNTIES_VALUE} className="cursor-pointer">
            All counties
          </SelectItem>
          {filteredCounties.length === 0 ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">No counties found</div>
          ) : (
            filteredCounties.map((county) => (
              <SelectItem key={county.id} value={county.id} className="cursor-pointer">
                {county.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {selectedCounty && (
        <Select value={selectedConstituencyId} onValueChange={handleConstituencyChange}>
          <SelectTrigger className="rounded-full border-foreground/20 bg-background cursor-pointer">
            <SelectValue placeholder="All constituencies" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_CONSTITUENCIES_VALUE} className="cursor-pointer">
              All constituencies
            </SelectItem>
            {constituencies.map((constituency) => (
              <SelectItem key={constituency.id} value={constituency.id} className="cursor-pointer">
                {constituency.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

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
