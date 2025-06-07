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

// Data sources information
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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Data Sources Library</h1>
        <p className="text-muted-foreground">
          Comprehensive repository of official reports, investigations, and verified information
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <div className="text-2xl font-bold">{totalSources}</div>
                <div className="text-sm text-muted-foreground">Data Sources</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <div className="text-2xl font-bold">{activeSources}</div>
                <div className="text-sm text-muted-foreground">Active Sources</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <div className="text-2xl font-bold">{averageTrustScore}%</div>
                <div className="text-sm text-muted-foreground">Avg Trust Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <div className="text-2xl font-bold">{totalRecords.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Records</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sources" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
          <TabsTrigger value="reports">Recent Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filter Data Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Search Sources</label>
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
                  <label className="text-sm font-medium mb-2 block">Source Type</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
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
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
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
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trustScore">Trust Score</SelectItem>
                      <SelectItem value="records">Record Count</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="lastUpdate">Last Updated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sources Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sortedSources.map((source) => (
              <Card key={source.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{source.type}</Badge>
                        <Badge variant={source.status === "active" ? "default" : "secondary"}>{source.status}</Badge>
                      </div>
                      <CardTitle className="text-lg">{source.name}</CardTitle>
                      <CardDescription className="mt-2">{source.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Trust Score */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Trust Score</span>
                        <span>{source.trustScore}%</span>
                      </div>
                      <Progress value={source.trustScore} className="h-2" />
                    </div>

                    {/* Key Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Records</div>
                        <div className="font-semibold">{source.recordsCount.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Update Frequency</div>
                        <div className="font-semibold">{source.frequency}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Coverage</div>
                        <div className="font-semibold">{source.coverage}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Last Updated</div>
                        <div className="font-semibold">{new Date(source.lastUpdate).toLocaleDateString()}</div>
                      </div>
                    </div>

                    {/* Categories */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Data Categories</h4>
                      <div className="flex flex-wrap gap-1">
                        {source.categories.map((category, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Data Types */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Available Formats</h4>
                      <div className="flex flex-wrap gap-1">
                        {source.dataTypes.map((type, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t">
                      {source.url !== "Internal" && (
                        <Button variant="outline" size="sm" className="flex-1">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Visit Source
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="w-3 h-3 mr-1" />
                        Export Data
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Recent Reports & Publications
              </CardTitle>
              <CardDescription>Latest reports, investigations, and publications from our data sources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{report.type}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(report.date).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-medium mb-1">{report.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">Source: {report.source}</p>
                        <p className="text-sm">{report.findings}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <Button variant="outline">View All Reports</Button>
              </div>
            </CardContent>
          </Card>

          {/* Data Quality Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Data Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Accuracy</span>
                    <span className="font-semibold">94%</span>
                  </div>
                  <Progress value={94} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completeness</span>
                    <span className="font-semibold">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Timeliness</span>
                    <span className="font-semibold">91%</span>
                  </div>
                  <Progress value={91} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Update Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm">Up to date</span>
                    </div>
                    <span className="font-semibold">6 sources</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-yellow-500 mr-2" />
                      <span className="text-sm">Pending update</span>
                    </div>
                    <span className="font-semibold">2 sources</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                      <span className="text-sm">Delayed</span>
                    </div>
                    <span className="font-semibold">0 sources</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Coverage Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Counties Covered</span>
                    <span className="font-semibold">47/47</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sectors Covered</span>
                    <span className="font-semibold">12/12</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data Freshness</span>
                    <span className="font-semibold">2.3 days avg</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
