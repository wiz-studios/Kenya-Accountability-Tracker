"use client"

import { useState, useCallback } from "react"
import { Download, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ComprehensiveLocationFilter } from "@/components/comprehensive-location-filter"
import { ProjectListDisplay } from "@/components/project-list-display"
import { enhancedProjectData, getProjectsByLocation } from "@/lib/enhanced-project-data"
import type { County, Constituency } from "@/lib/data-fetching-service"
import type { EnhancedProject } from "@/lib/enhanced-project-data"
import Link from "next/link"

export default function ProjectsPage() {
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null)
  const [selectedConstituency, setSelectedConstituency] = useState<Constituency | null>(null)
  const [projects, setProjects] = useState<EnhancedProject[]>(enhancedProjectData)
  const [isLoading, setIsLoading] = useState(false)

  // Handle filter changes and load projects
  const handleFilterChange = useCallback(async (county: County | null, constituency: Constituency | null) => {
    console.log("🔄 ProjectsPage: Filter changed", { county: county?.name, constituency: constituency?.name })

    setSelectedCounty(county)
    setSelectedConstituency(constituency)
    setIsLoading(true)

    // Simulate loading delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300))

    try {
      let filteredProjects: EnhancedProject[]

      if (constituency) {
        // Filter by constituency
        filteredProjects = getProjectsByLocation(county?.id, constituency.id)
        console.log(`✅ Found ${filteredProjects.length} projects in ${constituency.name}`)
      } else if (county) {
        // Filter by county
        filteredProjects = getProjectsByLocation(county.id)
        console.log(`✅ Found ${filteredProjects.length} projects in ${county.name}`)
      } else {
        // Show all projects
        filteredProjects = enhancedProjectData
        console.log(`✅ Showing all ${filteredProjects.length} projects`)
      }

      setProjects(filteredProjects)
    } catch (err) {
      console.error("❌ ProjectsPage: Error filtering projects:", err)
      setProjects([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Export data function
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

    // Create CSV content
    const headers = Object.keys(csvData[0]).join(",")
    const rows = csvData.map((row) => Object.values(row).join(","))
    const csvContent = [headers, ...rows].join("\n")

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `projects-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }, [projects])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Kenya Projects Database</h1>
          <p className="text-muted-foreground">
            Comprehensive tracking of {enhancedProjectData.length} public projects across all 47 counties and 290+
            constituencies
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportData} disabled={projects.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export Data ({projects.length})
          </Button>
          <Link href="/map">
            <Button variant="outline">
              <Map className="w-4 h-4 mr-2" />
              View on Map
            </Button>
          </Link>
        </div>
      </div>

      {/* Comprehensive Location Filter System */}
      <div className="mb-8">
        <ComprehensiveLocationFilter onLocationChange={handleFilterChange} showStatistics={true} />
      </div>

      {/* Project List Display */}
      <ProjectListDisplay
        selectedCounty={selectedCounty}
        selectedConstituency={selectedConstituency}
        projects={projects}
        isLoading={isLoading}
      />
    </div>
  )
}
