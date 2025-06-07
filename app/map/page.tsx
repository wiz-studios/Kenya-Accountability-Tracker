"use client"

import { useState, useCallback } from "react"
import { CascadingFilterSystem } from "@/components/cascading-filter-system"
import { InteractiveMap } from "@/components/interactive-map"
import type { County, Constituency } from "@/lib/enhanced-kenya-locations"

export default function MapPage() {
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null)
  const [selectedConstituency, setSelectedConstituency] = useState<Constituency | null>(null)
  const [selectedProject, setSelectedProject] = useState<number | null>(null)

  // Handle filter changes
  const handleFilterChange = useCallback((county: County | null, constituency: Constituency | null) => {
    setSelectedCounty(county)
    setSelectedConstituency(constituency)
    setSelectedProject(null) // Clear selected project when location changes
  }, [])

  // Handle project selection
  const handleProjectSelect = useCallback((projectId: number) => {
    setSelectedProject(projectId)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Interactive Project Map</h1>
        <p className="text-muted-foreground">
          Visualize projects across Kenya with location-based filtering and real-time updates
        </p>
      </div>

      {/* Cascading Filter System */}
      <div className="mb-8">
        <CascadingFilterSystem onFilterChange={handleFilterChange} />
      </div>

      {/* Interactive Map */}
      <InteractiveMap
        selectedProject={selectedProject}
        onProjectSelect={handleProjectSelect}
        selectedCounty={selectedCounty}
        selectedConstituency={selectedConstituency}
      />
    </div>
  )
}
