"use client"

import { useEffect, useMemo, useState } from "react"
import {
  CheckCircle,
  Clock,
  Database,
  Download,
  ExternalLink,
  FileText,
  Filter,
  Search,
  Shield,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate, formatNumber } from "@/lib/formatters"
import type { DataSource } from "@/lib/types"

type SourceReport = {
  title: string
  source: string
  date: string
  type: string
  findings: string
  url: string
}

export default function DataSourcesPage() {
  const [sources, setSources] = useState<DataSource[]>([])
  const [recentReports, setRecentReports] = useState<SourceReport[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("All Types")
  const [selectedStatus, setSelectedStatus] = useState("All Status")
  const [sortBy, setSortBy] = useState("trustScore")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const query = new URLSearchParams({
          sort: sortBy,
          q: searchTerm,
          includeReports: "true",
          limit: "1000",
        })
        if (selectedType !== "All Types") query.set("type", selectedType)
        if (selectedStatus !== "All Status") query.set("status", selectedStatus.toLowerCase())

        const res = await fetch(`/api/sources?${query.toString()}`)
        const body = await res.json()
        if (!res.ok) throw new Error(body.error || `Failed to fetch sources (${res.status})`)
        setSources(Array.isArray(body.data) ? body.data : [])
        setRecentReports(Array.isArray(body.recentReports) ? body.recentReports : [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load sources")
        setSources([])
        setRecentReports([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [searchTerm, selectedType, selectedStatus, sortBy])

  const sourceTypes = useMemo(
    () => ["All Types", ...Array.from(new Set(sources.map((source) => source.type))).sort()],
    [sources],
  )
  const statusOptions = ["All Status", "active", "inactive", "pending"]

  const averageTrustScore = Math.round(sources.reduce((sum, source) => sum + source.trustScore, 0) / sources.length || 0)
  const totalRecords = sources.reduce((sum, source) => sum + source.recordsCount, 0)
  const activeSources = sources.filter((source) => source.status === "active").length

  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 pt-10">
        <div className="rounded-3xl border border-foreground/10 bg-white/80 p-8 shadow-sm">
          <Badge className="bg-foreground text-background">Data intelligence</Badge>
          <h1 className="mt-4 font-display text-3xl text-foreground md:text-4xl">Data Sources Library</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Live registry of datasets, report streams, and source trust scores powering KAT.
          </p>
          {error && (
            <div className="mt-4 rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {error}
            </div>
          )}
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Data sources", value: sources.length, icon: Database },
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
                  <div className="text-xl font-semibold text-foreground">{loading ? "..." : stat.value}</div>
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
                        onChange={(event) => setSearchTerm(event.target.value)}
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
              {sources.map((source) => (
                <Card key={source.id} className="border-foreground/10 bg-white/90 shadow-sm">
                  <CardHeader>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="border-foreground/20 text-foreground">
                        {source.type}
                      </Badge>
                      <Badge variant={source.status === "active" ? "default" : "secondary"}>{source.status}</Badge>
                    </div>
                    <CardTitle className="text-lg text-foreground">{source.name}</CardTitle>
                    <CardDescription>{source.description}</CardDescription>
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

                    <div className="flex gap-2 border-t border-foreground/10 pt-2">
                      {source.url !== "Internal" && (
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <a href={source.url} target="_blank" rel="noreferrer">
                            <ExternalLink className="mr-1 h-3 w-3" />
                            Visit source
                          </a>
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
                <CardDescription>Latest reports from connected data sources</CardDescription>
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
                      <Button variant="ghost" size="sm" asChild>
                        <a href={report.url} target="_blank" rel="noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="border-foreground/10 bg-background shadow-sm">
                    <CardContent className="space-y-2 p-4 text-sm">
                      <div className="flex items-center gap-2 text-foreground">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span>Up to date</span>
                      </div>
                      <div className="font-semibold">{activeSources} sources</div>
                    </CardContent>
                  </Card>
                  <Card className="border-foreground/10 bg-background shadow-sm">
                    <CardContent className="space-y-2 p-4 text-sm">
                      <div className="flex items-center gap-2 text-foreground">
                        <Clock className="h-4 w-4 text-amber-500" />
                        <span>Freshness window</span>
                      </div>
                      <div className="font-semibold">API-driven</div>
                    </CardContent>
                  </Card>
                  <Card className="border-foreground/10 bg-background shadow-sm">
                    <CardContent className="space-y-2 p-4 text-sm">
                      <div className="flex items-center gap-2 text-foreground">
                        <Shield className="h-4 w-4 text-foreground" />
                        <span>Average trust</span>
                      </div>
                      <div className="font-semibold">{averageTrustScore}%</div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}
