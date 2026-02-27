"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Download, Map } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ComprehensiveLocationFilter } from "@/components/comprehensive-location-filter"
import { ProjectListDisplay } from "@/components/project-list-display"
import type { County, Constituency } from "@/lib/data-fetching-service"
import type { EnhancedProject } from "@/lib/enhanced-project-data"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

type ApiProject = {
  id: string
  name: string
  county: string
  constituency: string
  sector: string
  status: string
  budgetAllocated: number
  budgetSpent: number
  riskScore: number
  startDate?: string | null
  endDate?: string | null
  latitude?: number | null
  longitude?: number | null
}

const toEnhancedProject = (project: ApiProject): EnhancedProject => ({
  id: project.id,
  name: project.name,
  description: `Public ${project.sector.toLowerCase()} project in ${project.county}.`,
  county: project.county,
  countyId: project.county.toLowerCase().replace(/\s+/g, "-"),
  constituency: project.constituency,
  constituencyId: project.constituency.toLowerCase().replace(/\s+/g, "-"),
  sector: project.sector,
  budget: Number(project.budgetAllocated || 0),
  spent: Number(project.budgetSpent || 0),
  status: project.status,
  startDate: project.startDate || "2024-01-01",
  expectedCompletion: project.endDate || "2026-12-31",
  actualStatus: `${Math.round(
    project.budgetAllocated ? ((project.budgetSpent || 0) / project.budgetAllocated) * 100 : 0,
  )}% Budget Utilized`,
  progress: Math.max(Math.min(Math.round(project.budgetAllocated ? ((project.budgetSpent || 0) / project.budgetAllocated) * 100 : 0), 100), 0),
  contractor: "Data pending verification",
  supervisor: "Data pending verification",
  issues: project.status === "Stalled" ? ["Delivery stalled"] : [],
  lastUpdate: new Date().toISOString().slice(0, 10),
  source: "KAT API",
  urgency: project.riskScore >= 80 ? "high" : project.riskScore >= 50 ? "medium" : "low",
  images: [],
  documents: [],
  mp: "Pending",
  governor: "Pending",
  coordinates:
    project.latitude !== null && project.latitude !== undefined && project.longitude !== null && project.longitude !== undefined
      ? { lat: Number(project.latitude), lng: Number(project.longitude) }
      : undefined,
})

export default function ProjectsPage() {
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null)
  const [selectedConstituency, setSelectedConstituency] = useState<Constituency | null>(null)
  const [projects, setProjects] = useState<EnhancedProject[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = useCallback(async (county?: string, constituency?: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const query = new URLSearchParams({ limit: "1000", sort: "risk" })
      if (county) query.set("county", county)
      if (constituency) query.set("constituency", constituency)
      const res = await fetch(`/api/projects?${query.toString()}`)
      if (!res.ok) throw new Error(`Failed to fetch projects (${res.status})`)
      const body = await res.json()
      const apiProjects: ApiProject[] = Array.isArray(body.data) ? body.data : []
      setProjects(apiProjects.map(toEnhancedProject))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects")
      setProjects([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleFilterChange = useCallback(
    async (county: County | null, constituency: Constituency | null) => {
      setSelectedCounty(county)
      setSelectedConstituency(constituency)
      await fetchProjects(county?.name, constituency?.name)
    },
    [fetchProjects],
  )

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

  const summary = useMemo(
    () => ({
      totalProjects: projects.length,
      stalled: projects.filter((project) => project.status === "Stalled").length,
      countiesCovered: new Set(projects.map((project) => project.county)).size,
    }),
    [projects],
  )

  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 pt-10">
        <div className="rounded-3xl border border-foreground/10 bg-white/80 p-8 shadow-sm">
          <Badge className="bg-foreground text-background">National project registry</Badge>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <h1 className="font-display text-3xl text-foreground md:text-4xl">Kenya Projects Database</h1>
              <p className="max-w-2xl text-muted-foreground">
                Track delivery status, budgets, and risks across public projects from the centralized KAT data API.
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
          {error && (
            <div className="mt-4 rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {error}
            </div>
          )}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total projects", value: summary.totalProjects },
              { label: "Stalled", value: summary.stalled },
              { label: "Counties covered", value: summary.countiesCovered || 0 },
              { label: "Live updates", value: "API-backed" },
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
            projects={projects}
            selectedCounty={selectedCounty}
            selectedConstituency={selectedConstituency}
            isLoading={isLoading}
          />
        </div>
      </section>
    </div>
  )
}
