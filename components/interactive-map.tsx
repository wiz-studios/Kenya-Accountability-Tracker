"use client"

import { useState, useMemo, useCallback } from "react"
import { MapPin, ZoomIn, ZoomOut, RotateCcw, Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { getCountyById, type County, type Constituency } from "@/lib/enhanced-kenya-locations"
import { enhancedProjectData, getProjectsByLocation } from "@/lib/enhanced-project-data"

interface InteractiveMapProps {
  selectedProject?: string | number | null
  onProjectSelect?: (projectId: string | number) => void
  selectedCounty?: County | null
  selectedConstituency?: Constituency | null
  className?: string
}

export function InteractiveMap({
  selectedProject,
  onProjectSelect,
  selectedCounty,
  selectedConstituency,
  className,
}: InteractiveMapProps) {
  // Remove the internal location state since it's now passed as props
  // const [selectedCounty, setSelectedCounty] = useState<County | null>(null)
  // const [selectedConstituency, setSelectedConstituency] = useState<Constituency | null>(null)

  const [mapLayer, setMapLayer] = useState("projects")
  const [zoomLevel, setZoomLevel] = useState([7])
  const [selectedFilters, setSelectedFilters] = useState({
    status: "all",
    urgency: "all",
    budget: [0, 50000000000],
  })

  // Remove the handleLocationChange callback since location is managed externally
  // const handleLocationChange = useCallback((county: County | null, constituency: Constituency | null) => {
  //   console.log("Map location changed:", county?.name, constituency?.name)
  //   setSelectedCounty(county)
  //   setSelectedConstituency(constituency)
  // }, [])

  // Update the filteredProjects useMemo to use the props instead of internal state
  const filteredProjects = useMemo(() => {
    let projects = enhancedProjectData

    // Apply location filtering using props
    if (selectedConstituency) {
      projects = getProjectsByLocation(selectedCounty?.id, selectedConstituency.id)
    } else if (selectedCounty) {
      projects = getProjectsByLocation(selectedCounty.id)
    }

    // Apply other filters
    projects = projects.filter((project) => {
      const matchesStatus =
        selectedFilters.status === "all" || project.status.toLowerCase().includes(selectedFilters.status)
      const matchesUrgency = selectedFilters.urgency === "all" || project.urgency === selectedFilters.urgency
      const matchesBudget = project.budget >= selectedFilters.budget[0] && project.budget <= selectedFilters.budget[1]

      return matchesStatus && matchesUrgency && matchesBudget && project.coordinates
    })

    return projects
  }, [selectedCounty, selectedConstituency, selectedFilters])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSelectedFilters({
      status: "all",
      urgency: "all",
      budget: [0, 50000000000],
    })
  }, [])

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Map Controls */}
      <Card className="border-foreground/10 bg-white/90 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Interactive Project Map
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-full border-foreground/20">
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="rounded-full border-foreground/20">
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="rounded-full border-foreground/20">
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={clearFilters} className="rounded-full border-foreground/20">
                <Filter className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Location Filter */}
            {/* Remove the location filter from the controls since it's now external */}
            {/* Remove the CascadingLocationFilter component from the render */}

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">
                Map Layer
              </label>
              <Select value={mapLayer} onValueChange={setMapLayer}>
                <SelectTrigger className="rounded-full border-foreground/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="projects">Projects</SelectItem>
                  <SelectItem value="corruption">Corruption Cases</SelectItem>
                  <SelectItem value="leaders">Leader Locations</SelectItem>
                  <SelectItem value="budget">Budget Allocation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">
                Status Filter
              </label>
              <Select
                value={selectedFilters.status}
                onValueChange={(value) => setSelectedFilters((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="rounded-full border-foreground/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="stalled">Stalled</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                  <SelectItem value="behind">Behind Schedule</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">
                Urgency
              </label>
              <Select
                value={selectedFilters.urgency}
                onValueChange={(value) => setSelectedFilters((prev) => ({ ...prev, urgency: value }))}
              >
                <SelectTrigger className="rounded-full border-foreground/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Urgency</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Budget Range Filter */}
          <div className="mb-4">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">
              Budget Range: KSh {(selectedFilters.budget[0] / 1000000000).toFixed(1)}B - KSh{" "}
              {(selectedFilters.budget[1] / 1000000000).toFixed(1)}B
            </label>
            <Slider
              value={selectedFilters.budget}
              onValueChange={(value) => setSelectedFilters((prev) => ({ ...prev, budget: value }))}
              max={50000000000}
              min={0}
              step={1000000000}
              className="w-full"
            />
          </div>

          {/* Zoom Control */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">
              Zoom Level: {zoomLevel[0]}x
            </label>
            <Slider value={zoomLevel} onValueChange={setZoomLevel} max={15} min={5} step={1} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Active Location Filter Display */}
      {(selectedCounty || selectedConstituency) && (
        <Card className="border-foreground/10 bg-foreground/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Viewing:</span>
              {selectedConstituency ? (
                <Badge variant="outline" className="border-foreground/20 text-foreground">
                  {selectedConstituency.name}, {selectedCounty?.name}
                </Badge>
              ) : (
                <Badge variant="outline" className="border-foreground/20 text-foreground">
                  {selectedCounty?.name} County
                </Badge>
              )}
              <span className="text-sm text-muted-foreground">({filteredProjects.length} projects)</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map Container */}
      <Card className="border-foreground/10 bg-white/90 shadow-sm">
        <CardContent className="p-0">
          <div className="relative h-96 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-amber-50">
            {/* Simulated Map Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 via-amber-50 to-rose-50/60">
              {/* Kenya outline simulation */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
                <path
                  d="M50 50 L350 50 L350 250 L50 250 Z"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
                <text x="200" y="30" textAnchor="middle" className="text-xs fill-gray-500">
                  KENYA
                </text>
              </svg>
            </div>

            {/* Project Markers */}
            {filteredProjects.map((project) => {
              const x = ((project.coordinates!.lng + 42) / 8) * 400
              const y = ((project.coordinates!.lat + 5) / 10) * 300

              return (
                <div
                  key={project.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-110 ${
                    selectedProject === project.id ? "scale-125 z-10" : ""
                  }`}
                  style={{ left: `${x}px`, top: `${y}px` }}
                  onClick={() => onProjectSelect?.(project.id)}
                >
                  <div className="relative">
                    <div
                      className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                        project.urgency === "high"
                          ? "bg-red-500"
                          : project.urgency === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                    />
                    {selectedProject === project.id && (
                      <div className="absolute top-6 left-1/2 z-20 min-w-48 -translate-x-1/2 rounded-xl border border-foreground/10 bg-background p-3 shadow-lg">
                        <h4 className="font-medium text-sm mb-1">{project.name}</h4>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div>Status: {project.status}</div>
                          <div>Budget: KSh {(project.budget / 1000000000).toFixed(1)}B</div>
                          <div>Progress: {project.progress}%</div>
                          <div>County: {getCountyById(project.countyId)?.name}</div>
                        </div>
                        <Badge
                          variant={project.urgency === "high" ? "destructive" : "secondary"}
                          className="mt-2 text-xs"
                        >
                          {project.urgency} priority
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 rounded-xl border border-foreground/10 bg-background/90 p-3 shadow-lg">
              <h4 className="font-medium text-sm mb-2">Legend</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span>High Priority</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span>Medium Priority</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Low Priority</span>
                </div>
              </div>
            </div>

            {/* Map Stats */}
            <div className="absolute top-4 right-4 rounded-xl border border-foreground/10 bg-background/90 p-3 shadow-lg">
              <div className="text-xs text-muted-foreground">
                <div>Showing {filteredProjects.length} projects</div>
                <div>Zoom: {zoomLevel[0]}x</div>
                <div>Layer: {mapLayer}</div>
                {selectedCounty && <div>Location: {selectedCounty.name}</div>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-foreground/10 bg-white/90 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-foreground">
              {filteredProjects.filter((p) => p.urgency === "high").length}
            </div>
            <div className="text-sm text-muted-foreground">High Priority</div>
          </CardContent>
        </Card>
        <Card className="border-foreground/10 bg-white/90 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-foreground">
              {filteredProjects.filter((p) => p.urgency === "medium").length}
            </div>
            <div className="text-sm text-muted-foreground">Medium Priority</div>
          </CardContent>
        </Card>
        <Card className="border-foreground/10 bg-white/90 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-foreground">
              {filteredProjects.filter((p) => p.urgency === "low").length}
            </div>
            <div className="text-sm text-muted-foreground">Low Priority</div>
          </CardContent>
        </Card>
        <Card className="border-foreground/10 bg-white/90 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-semibold text-foreground">
              {Math.round(filteredProjects.reduce((sum, p) => sum + p.progress, 0) / filteredProjects.length || 0)}%
            </div>
            <div className="text-sm text-muted-foreground">Avg Progress</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
