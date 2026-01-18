"use client"

import { useMemo, useState } from "react"
import { MapPin, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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

  const selectedCounty = useMemo(() => {
    if (selectedCountyId === ALL_COUNTIES_VALUE) return null
    return enhancedKenyaLocations.find((county) => county.id === selectedCountyId) ?? null
  }, [selectedCountyId])

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

    if (value === ALL_COUNTIES_VALUE) {
      onLocationChange?.(null, null)
      return
    }

    const nextCounty = enhancedKenyaLocations.find((county) => county.id === value) ?? null
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
        <SelectContent>
          <SelectItem value={ALL_COUNTIES_VALUE} className="cursor-pointer">
            All counties
          </SelectItem>
          {enhancedKenyaLocations.map((county) => (
            <SelectItem key={county.id} value={county.id} className="cursor-pointer">
              {county.name}
            </SelectItem>
          ))}
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
