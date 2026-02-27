"use client"

import { useState, useCallback } from "react"
import { CascadingFilterSystem } from "@/components/cascading-filter-system"
import { InteractiveMap } from "@/components/interactive-map"
import type { County, Constituency } from "@/lib/enhanced-kenya-locations"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export default function MapPage() {
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null)
  const [selectedConstituency, setSelectedConstituency] = useState<Constituency | null>(null)
  const [selectedProject, setSelectedProject] = useState<string | number | null>(null)

  const handleFilterChange = useCallback((county: County | null, constituency: Constituency | null) => {
    setSelectedCounty(county)
    setSelectedConstituency(constituency)
    setSelectedProject(null)
  }, [])

  const handleProjectSelect = useCallback((projectId: string | number) => {
    setSelectedProject(projectId)
  }, [])

  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 pt-10">
        <div className="rounded-3xl border border-foreground/10 bg-white/80 p-8 shadow-sm">
          <Badge className="bg-foreground text-background">Geospatial intelligence</Badge>
          <h1 className="mt-4 font-display text-3xl text-foreground md:text-4xl">Interactive Project Map</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Visualize projects across Kenya with location-based filtering and live risk overlays.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Card className="border-foreground/10 bg-white/90 shadow-sm">
            <CardContent className="p-6">
              <CascadingFilterSystem onFilterChange={handleFilterChange} />
            </CardContent>
          </Card>
          <InteractiveMap
            selectedProject={selectedProject}
            onProjectSelect={handleProjectSelect}
            selectedCounty={selectedCounty}
            selectedConstituency={selectedConstituency}
          />
        </div>
      </section>
    </div>
  )
}
