"use client"

import { useMemo, useState } from "react"
import { AlertTriangle, Search, MapPin, FileText } from "lucide-react"
import type { County, Constituency } from "@/lib/enhanced-kenya-locations"
import { SimpleLocationSelector } from "@/components/simple-location-selector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatDate, formatYear } from "@/lib/formatters"

const stalledProjectsData = [
  {
    id: 1,
    name: "Nairobi BRT System Phase 1",
    county: "Nairobi",
    constituency: "Westlands",
    sector: "Transport",
    budget: 45200000000,
    spent: 12800000000,
    stalledScore: 95,
    stalledStatus: "Confirmed Stalled",
    confidenceLevel: 92,
    monthsStalled: 18,
    issues: ["Contractor disputes", "Environmental concerns", "Budget overruns", "Land acquisition delays"],
    lastUpdate: "2025-05-15",
    expectedCompletion: "2022-12-31",
    startDate: "2019-03-15",
    contractor: "China Communications Construction Company",
    supervisor: "KeNHA",
    recommendations: [
      "Immediate project review and timeline reassessment required",
      "Consider appointing a project recovery manager",
      "Escalate to relevant authorities for intervention",
    ],
    coordinates: { lat: -1.2676, lng: 36.8108 },
  },
  {
    id: 2,
    name: "Nakuru Level 5 Hospital Expansion",
    county: "Nakuru",
    constituency: "Nakuru Town East",
    sector: "Health",
    budget: 3200000000,
    spent: 480000000,
    stalledScore: 88,
    stalledStatus: "Confirmed Stalled",
    confidenceLevel: 85,
    monthsStalled: 12,
    issues: ["Funding shortfall", "Design changes", "Contractor issues"],
    lastUpdate: "2025-03-10",
    expectedCompletion: "2024-02-15",
    startDate: "2021-02-15",
    contractor: "Local Construction Ltd",
    supervisor: "Ministry of Health",
    recommendations: [
      "Financial audit and budget reallocation needed",
      "Address audit findings immediately",
      "Increase public transparency and reporting",
    ],
    coordinates: { lat: -0.3031, lng: 36.1034 },
  },
  {
    id: 3,
    name: "Seme Irrigation Project",
    county: "Kisumu",
    constituency: "Seme",
    sector: "Agriculture",
    budget: 1200000000,
    spent: 240000000,
    stalledScore: 82,
    stalledStatus: "Confirmed Stalled",
    confidenceLevel: 78,
    monthsStalled: 8,
    issues: ["Land disputes", "Environmental clearance delays"],
    lastUpdate: "2025-04-15",
    expectedCompletion: "2024-08-31",
    startDate: "2021-09-01",
    contractor: "Agri-Tech Solutions",
    supervisor: "Ministry of Agriculture",
    recommendations: [
      "Initiate dispute resolution process",
      "Deploy field monitoring team",
      "Consider alternative contractors if necessary",
    ],
    coordinates: { lat: -0.1045, lng: 34.7345 },
  },
  {
    id: 4,
    name: "Mombasa Affordable Housing Project",
    county: "Mombasa",
    constituency: "Changamwe",
    sector: "Housing",
    budget: 5600000000,
    spent: 1680000000,
    stalledScore: 75,
    stalledStatus: "Likely Stalled",
    confidenceLevel: 82,
    monthsStalled: 6,
    issues: ["Material shortages", "Labor disputes", "Permit delays"],
    lastUpdate: "2025-04-28",
    expectedCompletion: "2025-12-31",
    startDate: "2022-01-10",
    contractor: "Coastal Construction Ltd",
    supervisor: "National Housing Corporation",
    recommendations: [
      "Establish mandatory weekly progress reporting",
      "Implement stricter financial controls",
      "Continue regular monitoring",
    ],
    coordinates: { lat: -4.0435, lng: 39.6682 },
  },
  {
    id: 5,
    name: "Turkana Wind Power Extension",
    county: "Turkana",
    constituency: "Loima",
    sector: "Energy",
    budget: 8900000000,
    spent: 2670000000,
    stalledScore: 68,
    stalledStatus: "At Risk",
    confidenceLevel: 75,
    monthsStalled: 4,
    issues: ["Technical challenges", "Access road problems"],
    lastUpdate: "2025-05-01",
    expectedCompletion: "2026-06-30",
    startDate: "2023-03-01",
    contractor: "Wind Energy Solutions",
    supervisor: "Ministry of Energy",
    recommendations: ["Continue regular monitoring", "Address technical challenges immediately"],
    coordinates: { lat: 3.1167, lng: 35.6167 },
  },
]

const statusStyles: Record<string, { badge: "default" | "secondary" | "destructive" | "outline"; tone: string }> = {
  "Confirmed Stalled": { badge: "destructive", tone: "text-rose-600" },
  "Likely Stalled": { badge: "secondary", tone: "text-amber-600" },
  "At Risk": { badge: "outline", tone: "text-foreground" },
}

export default function StalledProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null)
  const [selectedConstituency, setSelectedConstituency] = useState<Constituency | null>(null)
  const [selectedSector, setSelectedSector] = useState("All sectors")

  const handleLocationChange = (county: County | null, constituency: Constituency | null) => {
    setSelectedCounty(county)
    setSelectedConstituency(constituency)
  }

  const sectors = useMemo(() => {
    const sectorSet = new Set(stalledProjectsData.map((project) => project.sector))
    return ["All sectors", ...Array.from(sectorSet)]
  }, [])

  const filteredProjects = useMemo(() => {
    return stalledProjectsData.filter((project) => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesLocation =
        (!selectedCounty || project.county === selectedCounty.name) &&
        (!selectedConstituency || project.constituency === selectedConstituency.name)
      const matchesSector = selectedSector === "All sectors" || project.sector === selectedSector
      return matchesSearch && matchesLocation && matchesSector
    })
  }, [searchTerm, selectedCounty, selectedConstituency, selectedSector])

  const stats = useMemo(() => {
    const total = filteredProjects.length
    const confirmed = filteredProjects.filter((p) => p.stalledStatus === "Confirmed Stalled").length
    const likely = filteredProjects.filter((p) => p.stalledStatus === "Likely Stalled").length
    const averageScore = Math.round(
      filteredProjects.reduce((sum, p) => sum + p.stalledScore, 0) / total || 0,
    )
    return { total, confirmed, likely, averageScore }
  }, [filteredProjects])

  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 pt-10">
        <div className="rounded-3xl border border-foreground/10 bg-white/80 p-8 shadow-sm">
          <Badge className="bg-foreground text-background">High risk watchlist</Badge>
          <h1 className="mt-4 font-display text-3xl text-foreground md:text-4xl">Stalled Projects Tracker</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Monitor projects flagged as stalled or at risk, with risk scores, timelines, and recovery recommendations.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              { label: "Projects listed", value: stats.total },
              { label: "Confirmed stalled", value: stats.confirmed },
              { label: "Likely stalled", value: stats.likely },
              { label: "Avg risk score", value: `${stats.averageScore}%` },
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
                  onChange={(e) => setSearchTerm(e.target.value)}
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
            const style = statusStyles[project.stalledStatus] || statusStyles["At Risk"]
            return (
              <Card key={project.id} className="border-foreground/10 bg-white/90 shadow-sm">
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-foreground/20 text-foreground">
                          {project.sector}
                        </Badge>
                        <Badge variant={style.badge}>{project.stalledStatus}</Badge>
                      </div>
                      <CardTitle className="mt-3 text-lg text-foreground">{project.name}</CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        {project.constituency}, {project.county}
                      </CardDescription>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-semibold text-foreground">KSh {(project.budget / 1000000000).toFixed(1)}B</div>
                      <div className="text-muted-foreground">Budget</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Stalled score</span>
                      <span className={`font-semibold ${style.tone}`}>{project.stalledScore}%</span>
                    </div>
                    <Progress value={project.stalledScore} className="mt-2 h-2 bg-foreground/10" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Started</div>
                      <div className="font-semibold text-foreground">{formatYear(project.startDate)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Expected completion</div>
                      <div className="font-semibold text-foreground">{formatYear(project.expectedCompletion)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Months stalled</div>
                      <div className="font-semibold text-foreground">{project.monthsStalled}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Confidence</div>
                      <div className="font-semibold text-foreground">{project.confidenceLevel}%</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Key issues</h4>
                    <div className="flex flex-wrap gap-1">
                      {project.issues.slice(0, 3).map((issue) => (
                        <Badge key={issue} variant="outline" className="border-foreground/20 text-xs text-foreground">
                          {issue}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-foreground/10 bg-background p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <AlertTriangle className="h-4 w-4" />
                      Recovery recommendations
                    </div>
                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                      {project.recommendations.map((rec) => (
                        <li key={rec} className="flex items-start gap-2">
                          <div className="mt-1 h-1 w-1 rounded-full bg-foreground/60" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between border-t border-foreground/10 pt-2 text-xs text-muted-foreground">
                    <span>Last update: {formatDate(project.lastUpdate)}</span>
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
