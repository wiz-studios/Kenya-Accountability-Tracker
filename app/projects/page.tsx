"use client"

import { useState, useCallback } from "react"
import { Download, Map } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ComprehensiveLocationFilter } from "@/components/comprehensive-location-filter"
import { ProjectListDisplay } from "@/components/project-list-display"
import { enhancedProjectData, getProjectsByLocation } from "@/lib/enhanced-project-data"
import type { County, Constituency } from "@/lib/data-fetching-service"
import type { EnhancedProject } from "@/lib/enhanced-project-data"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export default function ProjectsPage() {
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null)
  const [selectedConstituency, setSelectedConstituency] = useState<Constituency | null>(null)
  const [projects, setProjects] = useState<EnhancedProject[]>(enhancedProjectData)
  const [isLoading, setIsLoading] = useState(false)

  const handleFilterChange = useCallback(async (county: County | null, constituency: Constituency | null) => {
    setSelectedCounty(county)
    setSelectedConstituency(constituency)
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 300))

    try {
      let filteredProjects: EnhancedProject[]

      if (constituency) {
        filteredProjects = getProjectsByLocation(county?.id, constituency.id)
      } else if (county) {
        filteredProjects = getProjectsByLocation(county.id)
      } else {
        filteredProjects = enhancedProjectData
      }

      setProjects(filteredProjects)
    } catch (err) {
      setProjects([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const exportData = useCallback(() => {
    const csvData = projects.map((project) => ({
      Name: project.name,
      County: project.county,
      Constituency: project.constituency,
      Sector: project.sector,
      Status: project.status,
      Budget: project.budget,
      Spent: project.spent,
      Progress: project.progress,
      Urgency: project.urgency,
    }))

    if (csvData.length === 0) {
      alert("No data to export")
      return
    }

    const headers = Object.keys(csvData[0]).join(",")
    const rows = csvData.map((row) => Object.values(row).join(","))
    const csvContent = [headers, ...rows].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `projects-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }, [projects])

  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 pt-10">
        <div className="rounded-3xl border border-foreground/10 bg-white/80 p-8 shadow-sm">
          <Badge className="bg-foreground text-background">National project registry</Badge>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <h1 className="font-display text-3xl text-foreground md:text-4xl">Kenya Projects Database</h1>
              <p className="max-w-2xl text-muted-foreground">
                Track delivery status, budgets, and risks across {enhancedProjectData.length} public projects in all
                counties and constituencies.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={exportData} disabled={projects.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                Export data ({projects.length})
              </Button>
              <Link href="/map">
                <Button variant="outline">
                  <Map className="mr-2 h-4 w-4" />
                  View on map
                </Button>
              </Link>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total projects", value: enhancedProjectData.length },
              { label: "Displayed", value: projects.length },
              { label: "Counties covered", value: 47 },
              { label: "Live updates", value: "Daily" },
            ].map((stat) => (
              <Card key={stat.label} className="border-foreground/10 bg-white/90 shadow-sm">
                <CardContent className="p-4">
                  <div className="text-xl font-semibold text-foreground">{stat.value}</div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="space-y-8">
          <ComprehensiveLocationFilter onLocationChange={handleFilterChange} showStatistics={true} />
          <ProjectListDisplay
            selectedCounty={selectedCounty}
            selectedConstituency={selectedConstituency}
            isLoading={isLoading}
          />
        </div>
      </section>
    </div>
  )
}
