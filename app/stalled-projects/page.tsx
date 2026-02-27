"use client"

import { useEffect, useMemo, useState } from "react"
import { AlertTriangle, FileText, MapPin, Search } from "lucide-react"
import type { County, Constituency } from "@/lib/enhanced-kenya-locations"
import { SimpleLocationSelector } from "@/components/simple-location-selector"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatDate, formatYear } from "@/lib/formatters"

type ProjectRecord = {
  id: string
  name: string
  county: string
  constituency: string
  sector: string
  budgetAllocated: number
  budgetSpent: number
  riskScore: number
  status: string
  startDate?: string | null
  endDate?: string | null
}

const stalledStatuses = new Set(["Stalled", "Delayed", "Behind Schedule", "Cancelled"])

export default function StalledProjectsPage() {
  const [allProjects, setAllProjects] = useState<ProjectRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null)
  const [selectedConstituency, setSelectedConstituency] = useState<Constituency | null>(null)
  const [selectedSector, setSelectedSector] = useState("All sectors")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/projects?limit=1000&sort=risk")
        const body = await res.json()
        if (!res.ok) throw new Error(body.error || `Failed to fetch projects (${res.status})`)
        setAllProjects(Array.isArray(body.data) ? body.data : [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load projects")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const stalledProjects = useMemo(() => allProjects.filter((project) => stalledStatuses.has(project.status)), [allProjects])
  const sectors = useMemo(() => ["All sectors", ...Array.from(new Set(stalledProjects.map((p) => p.sector))).sort()], [stalledProjects])

  const filteredProjects = useMemo(() => {
    return stalledProjects.filter((project) => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesLocation =
        (!selectedCounty || project.county === selectedCounty.name) &&
        (!selectedConstituency || project.constituency === selectedConstituency.name)
      const matchesSector = selectedSector === "All sectors" || project.sector === selectedSector
      return matchesSearch && matchesLocation && matchesSector
    })
  }, [searchTerm, selectedCounty, selectedConstituency, selectedSector, stalledProjects])

  const stats = useMemo(() => {
    const total = filteredProjects.length
    const confirmed = filteredProjects.filter((project) => project.status === "Stalled" || project.status === "Cancelled").length
    const likely = filteredProjects.filter((project) => project.status === "Delayed" || project.status === "Behind Schedule").length
    const averageScore = Math.round(filteredProjects.reduce((sum, project) => sum + (project.riskScore || 0), 0) / total || 0)
    return { total, confirmed, likely, averageScore }
  }, [filteredProjects])

  const handleLocationChange = (county: County | null, constituency: Constituency | null) => {
    setSelectedCounty(county)
    setSelectedConstituency(constituency)
  }

  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 pt-10">
        <div className="rounded-3xl border border-foreground/10 bg-white/80 p-8 shadow-sm">
          <Badge className="bg-foreground text-background">High risk watchlist</Badge>
          <h1 className="mt-4 font-display text-3xl text-foreground md:text-4xl">Stalled Projects Tracker</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            API-driven monitoring of stalled and delayed projects with dynamic risk indicators.
          </p>
          {error && (
            <div className="mt-4 rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {error}
            </div>
          )}
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              { label: "Projects listed", value: stats.total },
              { label: "Confirmed stalled", value: stats.confirmed },
              { label: "Likely stalled", value: stats.likely },
              { label: "Avg risk score", value: `${stats.averageScore}%` },
            ].map((stat) => (
              <Card key={stat.label} className="border-foreground/10 bg-white/90 shadow-sm">
                <CardContent className="p-4">
                  <div className="text-xl font-semibold text-foreground">{loading ? "..." : stat.value}</div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <Card className="border-foreground/10 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filter stalled projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Search project
                </label>
                <Input
                  placeholder="Search by project name"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Location
                </label>
                <SimpleLocationSelector onLocationChange={handleLocationChange} placeholder="Select location" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Sector
                </label>
                <Select value={selectedSector} onValueChange={setSelectedSector}>
                  <SelectTrigger className="rounded-full border-foreground/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="container mx-auto px-4 pb-12">
        <div className="grid gap-6 md:grid-cols-2">
          {filteredProjects.map((project) => {
            const stalledScore = Math.max(project.riskScore || 0, 40)
            const confidenceLevel = Math.min(60 + Math.round(stalledScore / 2), 98)
            const budgetUtilization = project.budgetAllocated
              ? Math.round((project.budgetSpent / project.budgetAllocated) * 100)
              : 0

            return (
              <Card key={project.id} className="border-foreground/10 bg-white/90 shadow-sm">
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-foreground/20 text-foreground">
                          {project.sector}
                        </Badge>
                        <Badge variant={project.status === "Stalled" || project.status === "Cancelled" ? "destructive" : "secondary"}>
                          {project.status}
                        </Badge>
                      </div>
                      <CardTitle className="mt-3 text-lg text-foreground">{project.name}</CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        {project.constituency}, {project.county}
                      </CardDescription>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-semibold text-foreground">
                        KSh {(project.budgetAllocated / 1_000_000_000).toFixed(1)}B
                      </div>
                      <div className="text-muted-foreground">Budget</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Stalled score</span>
                      <span className="font-semibold">{stalledScore}%</span>
                    </div>
                    <Progress value={stalledScore} className="mt-2 h-2 bg-foreground/10" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Started</div>
                      <div className="font-semibold text-foreground">
                        {project.startDate ? formatYear(project.startDate) : "Unknown"}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Expected completion</div>
                      <div className="font-semibold text-foreground">
                        {project.endDate ? formatYear(project.endDate) : "Unknown"}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Budget utilization</div>
                      <div className="font-semibold text-foreground">{budgetUtilization}%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Confidence</div>
                      <div className="font-semibold text-foreground">{confidenceLevel}%</div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-foreground/10 bg-background p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <AlertTriangle className="h-4 w-4" />
                      Recovery recommendations
                    </div>
                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                      <li>Escalate unresolved blockers to county oversight board.</li>
                      <li>Publish monthly progress and disbursement updates.</li>
                      <li>Attach supporting evidence in the project detail record.</li>
                    </ul>
                  </div>

                  <div className="flex items-center justify-between border-t border-foreground/10 pt-2 text-xs text-muted-foreground">
                    <span>Last refresh: {formatDate(new Date().toISOString().slice(0, 10))}</span>
                    <Button variant="outline" size="sm">
                      <FileText className="mr-1 h-3 w-3" />
                      View details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}
