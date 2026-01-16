"use client"

import { useState } from "react"
import {
  Database,
  FileText,
  Shield,
  ExternalLink,
  Download,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatDate, formatNumber } from "@/lib/formatters"

const dataSources = [
  {
    id: 1,
    name: "Office of the Auditor General",
    type: "Government",
    description: "Official audit reports on government spending and project implementation",
    url: "https://oagkenya.go.ke",
    trustScore: 98,
    lastUpdate: "2025-05-28",
    recordsCount: 1247,
    categories: ["Financial Audits", "Performance Audits", "Compliance Audits"],
    status: "active",
    frequency: "Quarterly",
    coverage: "National",
    dataTypes: ["PDF Reports", "Financial Statements", "Audit Findings"],
  },
  {
    id: 2,
    name: "Ethics and Anti-Corruption Commission (EACC)",
    type: "Government",
    description: "Corruption cases, investigations, and asset recovery information",
    url: "https://eacc.go.ke",
    trustScore: 95,
    lastUpdate: "2025-06-01",
    recordsCount: 892,
    categories: ["Corruption Cases", "Asset Recovery", "Investigations"],
    status: "active",
    frequency: "Monthly",
    coverage: "National",
    dataTypes: ["Case Files", "Investigation Reports", "Asset Declarations"],
  },
  {
    id: 3,
    name: "Kenya Open Data Portal",
    type: "Government",
    description: "Government datasets including budgets, procurement, and project information",
    url: "https://opendata.go.ke",
    trustScore: 92,
    lastUpdate: "2025-06-02",
    recordsCount: 2156,
    categories: ["Budgets", "Procurement", "Projects", "Demographics"],
    status: "active",
    frequency: "Weekly",
    coverage: "National",
    dataTypes: ["CSV", "JSON", "XML", "API"],
  },
  {
    id: 4,
    name: "Transparency International Kenya",
    type: "NGO",
    description: "Research reports on corruption trends and governance issues",
    url: "https://tikenya.org",
    trustScore: 90,
    lastUpdate: "2025-05-15",
    recordsCount: 234,
    categories: ["Corruption Indices", "Research Reports", "Policy Analysis"],
    status: "active",
    frequency: "Quarterly",
    coverage: "National",
    dataTypes: ["Research Papers", "Surveys", "Policy Briefs"],
  },
  {
    id: 5,
    name: "Daily Nation Archives",
    type: "Media",
    description: "News articles and investigative reports on governance and corruption",
    url: "https://nation.africa",
    trustScore: 85,
    lastUpdate: "2025-06-03",
    recordsCount: 3421,
    categories: ["News Articles", "Investigations", "Opinion Pieces"],
    status: "active",
    frequency: "Daily",
    coverage: "National",
    dataTypes: ["Articles", "Videos", "Images"],
  },
  {
    id: 6,
    name: "The Standard Digital",
    type: "Media",
    description: "News coverage of government projects and accountability issues",
    url: "https://standardmedia.co.ke",
    trustScore: 83,
    lastUpdate: "2025-06-03",
    recordsCount: 2876,
    categories: ["News", "Business", "Politics"],
    status: "active",
    frequency: "Daily",
    coverage: "National",
    dataTypes: ["Articles", "Videos", "Podcasts"],
  },
  {
    id: 7,
    name: "Citizen Reports Database",
    type: "Crowdsourced",
    description: "Verified reports submitted by citizens about stalled projects and corruption",
    url: "Internal",
    trustScore: 75,
    lastUpdate: "2025-06-03",
    recordsCount: 567,
    categories: ["Project Reports", "Corruption Reports", "Evidence"],
    status: "active",
    frequency: "Real-time",
    coverage: "National",
    dataTypes: ["Reports", "Images", "Documents", "Videos"],
  },
  {
    id: 8,
    name: "Parliamentary Hansard",
    type: "Government",
    description: "Official records of parliamentary proceedings and debates",
    url: "https://parliament.go.ke",
    trustScore: 94,
    lastUpdate: "2025-06-02",
    recordsCount: 1834,
    categories: ["Debates", "Committee Reports", "Bills"],
    status: "active",
    frequency: "Daily",
    coverage: "National",
    dataTypes: ["Transcripts", "Audio", "Video"],
  },
]

const recentReports = [
  {
    title: "Auditor General Report on County Governments FY 2023/24",
    source: "Office of the Auditor General",
    date: "2025-05-28",
    type: "Audit Report",
    findings: "KSh 12.4B in questionable expenditure across 15 counties",
    url: "#",
  },
  {
    title: "EACC Investigation: Nairobi County Procurement Irregularities",
    source: "EACC",
    date: "2025-06-01",
    type: "Investigation",
    findings: "Irregular procurement worth KSh 2.1B identified",
    url: "#",
  },
  {
    title: "TI Kenya Corruption Index 2024",
    source: "Transparency International Kenya",
    date: "2025-05-15",
    type: "Research",
    findings: "Kenya ranks 123/180 in global corruption perception index",
    url: "#",
  },
  {
    title: "Parliamentary Committee Report on Stalled Projects",
    source: "Parliamentary Hansard",
    date: "2025-05-20",
    type: "Committee Report",
    findings: "234 stalled projects worth KSh 156B identified",
    url: "#",
  },
]

export default function DataSourcesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("All Types")
  const [selectedStatus, setSelectedStatus] = useState("All Status")
  const [sortBy, setSortBy] = useState("trustScore")

  const sourceTypes = ["All Types", "Government", "NGO", "Media", "Crowdsourced"]
  const statusOptions = ["All Status", "active", "inactive", "pending"]

  const filteredSources = dataSources.filter((source) => {
    const matchesSearch =
      source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      source.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = selectedType === "All Types" || source.type === selectedType
    const matchesStatus = selectedStatus === "All Status" || source.status === selectedStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const sortedSources = [...filteredSources].sort((a, b) => {
    switch (sortBy) {
      case "trustScore":
        return b.trustScore - a.trustScore
      case "records":
        return b.recordsCount - a.recordsCount
      case "name":
        return a.name.localeCompare(b.name)
      case "lastUpdate":
        return new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime()
      default:
        return 0
    }
  })

  const totalSources = filteredSources.length
  const averageTrustScore = Math.round(filteredSources.reduce((sum, s) => sum + s.trustScore, 0) / totalSources || 0)
  const totalRecords = filteredSources.reduce((sum, s) => sum + s.recordsCount, 0)
  const activeSources = filteredSources.filter((s) => s.status === "active").length

  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 pt-10">
        <div className="rounded-3xl border border-foreground/10 bg-white/80 p-8 shadow-sm">
          <Badge className="bg-foreground text-background">Data intelligence</Badge>
          <h1 className="mt-4 font-display text-3xl text-foreground md:text-4xl">Data Sources Library</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Comprehensive repository of official reports, investigations, and verified information feeding the
            accountability platform.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Data sources", value: totalSources, icon: Database },
            { label: "Active sources", value: activeSources, icon: CheckCircle },
            { label: "Avg trust score", value: `${averageTrustScore}%`, icon: Shield },
            { label: "Total records", value: formatNumber(totalRecords), icon: FileText },
          ].map((stat) => (
            <Card key={stat.label} className="border-foreground/10 bg-white/90 shadow-sm">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-foreground/5">
                  <stat.icon className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <div className="text-xl font-semibold text-foreground">{stat.value}</div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-12">
        <Tabs defaultValue="sources" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 gap-2 rounded-full bg-foreground/5 p-1 text-foreground/70">
            <TabsTrigger
              value="sources"
              className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background"
            >
              Data sources
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background"
            >
              Recent reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sources" className="space-y-6">
            <Card className="border-foreground/10 bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filter data sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Search sources
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search sources..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Source type
                    </label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="rounded-full border-foreground/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sourceTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Status
                    </label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="rounded-full border-foreground/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Sort by
                    </label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="rounded-full border-foreground/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="trustScore">Trust score</SelectItem>
                        <SelectItem value="records">Record count</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="lastUpdate">Last updated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              {sortedSources.map((source) => (
                <Card key={source.id} className="border-foreground/10 bg-white/90 shadow-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="border-foreground/20 text-foreground">
                            {source.type}
                          </Badge>
                          <Badge variant={source.status === "active" ? "default" : "secondary"}>{source.status}</Badge>
                        </div>
                        <CardTitle className="mt-3 text-lg text-foreground">{source.name}</CardTitle>
                        <CardDescription className="mt-2">{source.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div>
                      <div className="mb-1 flex justify-between text-sm">
                        <span>Trust score</span>
                        <span>{source.trustScore}%</span>
                      </div>
                      <Progress value={source.trustScore} className="h-2 bg-foreground/10" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Records</div>
                        <div className="font-semibold text-foreground">{formatNumber(source.recordsCount)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Update frequency</div>
                        <div className="font-semibold text-foreground">{source.frequency}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Coverage</div>
                        <div className="font-semibold text-foreground">{source.coverage}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Last updated</div>
                        <div className="font-semibold text-foreground">{formatDate(source.lastUpdate)}</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Data categories</h4>
                      <div className="flex flex-wrap gap-1">
                        {source.categories.map((category) => (
                          <Badge key={category} variant="outline" className="border-foreground/20 text-xs text-foreground">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Available formats</h4>
                      <div className="flex flex-wrap gap-1">
                        {source.dataTypes.map((type) => (
                          <Badge key={type} variant="secondary" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 border-t border-foreground/10 pt-2">
                      {source.url !== "Internal" && (
                        <Button variant="outline" size="sm" className="flex-1">
                          <ExternalLink className="mr-1 h-3 w-3" />
                          Visit source
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="mr-1 h-3 w-3" />
                        Export data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card className="border-foreground/10 bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Recent reports & publications
                </CardTitle>
                <CardDescription>Latest reports, investigations, and publications from our data sources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.title} className="rounded-2xl border border-foreground/10 bg-background p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="border-foreground/20 text-foreground">
                            {report.type}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{formatDate(report.date)}</span>
                        </div>
                        <h4 className="mt-2 font-medium text-foreground">{report.title}</h4>
                        <p className="mt-1 text-sm text-muted-foreground">Source: {report.source}</p>
                        <p className="mt-2 text-sm">{report.findings}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="text-center">
                  <Button variant="outline">View all reports</Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-foreground/10 bg-white/90 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Data quality</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: "Accuracy", value: 94 },
                    { label: "Completeness", value: 87 },
                    { label: "Timeliness", value: 91 },
                  ].map((metric) => (
                    <div key={metric.label}>
                      <div className="flex items-center justify-between text-sm">
                        <span>{metric.label}</span>
                        <span className="font-semibold text-foreground">{metric.value}%</span>
                      </div>
                      <Progress value={metric.value} className="mt-2 h-2 bg-foreground/10" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-foreground/10 bg-white/90 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Update status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" />
                      <span>Up to date</span>
                    </div>
                    <span className="font-semibold text-foreground">6 sources</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-amber-500" />
                      <span>Pending update</span>
                    </div>
                    <span className="font-semibold text-foreground">2 sources</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4 text-rose-500" />
                      <span>Delayed</span>
                    </div>
                    <span className="font-semibold text-foreground">0 sources</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-foreground/10 bg-white/90 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Coverage stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Counties covered</span>
                    <span className="font-semibold text-foreground">47/47</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sectors covered</span>
                    <span className="font-semibold text-foreground">12/12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data freshness</span>
                    <span className="font-semibold text-foreground">2.3 days avg</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}
