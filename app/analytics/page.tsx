"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { BarChart3, Download, Filter, MapPin, Shield, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate, formatNumber } from "@/lib/formatters"
import { stateHouseExpenditures } from "@/lib/state-house"

type AnalyticsSnapshot = {
  generatedAt: string
  overview: {
    totalProjects: number
    stalledProjects: number
    totalLossBillions: number
    recoveredFundsBillions: number
    activeCases: number
    convictions: number
  }
  sectorAnalysis: Array<{ sector: string; projects: number; loss: number; percentage: number; trend: string }>
  countyRankings: Array<{ county: string; projects: number; loss: number; score: number }>
  leadershipAnalysis: Array<{ position: string; total: number; withAllegations: number; convictionRate: number }>
}

const fallbackSnapshot: AnalyticsSnapshot = {
  generatedAt: new Date().toISOString(),
  overview: {
    totalProjects: 0,
    stalledProjects: 0,
    totalLossBillions: 0,
    recoveredFundsBillions: 0,
    activeCases: 0,
    convictions: 0,
  },
  sectorAnalysis: [],
  countyRankings: [],
  leadershipAnalysis: [],
}

export default function AnalyticsPage() {
  const searchParams = useSearchParams()
  const [snapshot, setSnapshot] = useState<AnalyticsSnapshot>(fallbackSnapshot)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/analytics")
        const body = await res.json()
        if (!res.ok || !body.data) {
          throw new Error(body.error || `Failed to load analytics (${res.status})`)
        }
        setSnapshot(body.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load analytics")
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const tabParam = searchParams?.get("tab") || "sectors"
  const defaultTab = ["sectors", "counties", "leadership", "statehouse", "trends"].includes(tabParam)
    ? tabParam
    : "sectors"

  const stateHouseSummary = useMemo(() => {
    const total = stateHouseExpenditures.reduce((sum, item) => sum + item.amountMillions, 0)
    const avgRisk = stateHouseExpenditures.length
      ? Math.round(stateHouseExpenditures.reduce((sum, item) => sum + item.risk, 0) / stateHouseExpenditures.length)
      : 0
    return { total, avgRisk }
  }, [])

  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 pt-10">
        <div className="rounded-3xl border border-foreground/10 bg-white/80 p-8 shadow-sm">
          <Badge className="bg-foreground text-background">Accountability insights</Badge>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <h1 className="font-display text-3xl text-foreground md:text-4xl">Analytics & Insights</h1>
              <p className="max-w-2xl text-muted-foreground">
                Aggregated metrics from projects, leaders, and expenditure evidence.
              </p>
              <p className="text-xs text-muted-foreground">Last refreshed: {formatDate(snapshot.generatedAt)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export report
              </Button>
            </div>
          </div>
          {error && (
            <div className="mt-4 rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {error}
            </div>
          )}
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {[
            { label: "Total projects", value: snapshot.overview.totalProjects },
            { label: "Stalled projects", value: snapshot.overview.stalledProjects },
            { label: "Total loss", value: `KSh ${snapshot.overview.totalLossBillions}B` },
            { label: "Recovered", value: `KSh ${snapshot.overview.recoveredFundsBillions}B` },
            { label: "Active cases", value: snapshot.overview.activeCases },
            { label: "Convictions", value: snapshot.overview.convictions },
          ].map((metric) => (
            <Card key={metric.label} className="border-foreground/10 bg-white/90 shadow-sm">
              <CardContent className="p-4">
                <div className="text-xl font-semibold text-foreground">{isLoading ? "..." : metric.value}</div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{metric.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-12">
        <Tabs defaultValue={defaultTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 gap-2 rounded-full bg-foreground/5 p-1 text-foreground/70 md:grid-cols-5">
            {["sectors", "counties", "trends", "leadership", "statehouse"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                {tab === "sectors"
                  ? "By Sector"
                  : tab === "counties"
                    ? "By County"
                    : tab === "trends"
                      ? "Trends"
                      : tab === "leadership"
                        ? "Leadership"
                        : "State House"}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="sectors" className="space-y-6">
            <Card className="border-foreground/10 bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Sector analysis
                </CardTitle>
                <CardDescription>Loss exposure and project volume by sector</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {snapshot.sectorAnalysis.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No sector analytics available.</div>
                ) : (
                  snapshot.sectorAnalysis.map((sector) => (
                    <div key={sector.sector} className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="font-medium text-foreground">{sector.sector}</h3>
                          <Badge variant="outline" className="border-foreground/20 text-foreground">
                            {sector.projects} projects
                          </Badge>
                          <Badge variant="outline" className="border-foreground/20 text-foreground">
                            {sector.trend}
                          </Badge>
                        </div>
                        <div className="text-right text-sm">
                          <div className="font-semibold text-foreground">KSh {sector.loss}B</div>
                          <div className="text-muted-foreground">{sector.percentage}% share</div>
                        </div>
                      </div>
                      <Progress value={sector.percentage} className="h-2 bg-foreground/10" />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="counties" className="space-y-6">
            <Card className="border-foreground/10 bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  County accountability rankings
                </CardTitle>
                <CardDescription>Lower score means higher immediate accountability pressure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {snapshot.countyRankings.map((county, index) => (
                  <div
                    key={county.county}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-foreground/10 bg-background p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/10 text-sm font-medium text-foreground">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{county.county} County</h4>
                        <div className="text-sm text-muted-foreground">
                          {county.projects} projects | KSh {county.loss}B at risk
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="text-lg font-semibold text-foreground">{county.score}</div>
                        <div className="text-sm text-muted-foreground">/100</div>
                      </div>
                      <Progress value={county.score} className="mt-1 h-2 w-24 bg-foreground/10" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card className="border-foreground/10 bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trend notes
                </CardTitle>
                <CardDescription>Trend module is now fed by generated analytics snapshots.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>Risk concentration is highest in sectors where budget utilization is low relative to allocation.</p>
                <p>County rankings update automatically whenever project and expenditure records refresh.</p>
                <p>Next iteration will add time-series charts from project status events.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leadership" className="space-y-6">
            <Card className="border-foreground/10 bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Leadership accountability analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {snapshot.leadershipAnalysis.map((leader) => (
                  <div key={leader.position} className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <h3 className="font-medium text-foreground">{leader.position}</h3>
                      <div className="text-right text-sm text-muted-foreground">
                        <div>
                          {leader.withAllegations} of {leader.total} with allegations
                        </div>
                        <div className="font-semibold text-foreground">{leader.convictionRate}% conviction rate</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div>
                        <div className="mb-1 text-xs text-muted-foreground">
                          Allegations rate ({leader.total ? Math.round((leader.withAllegations / leader.total) * 100) : 0}%)
                        </div>
                        <Progress value={leader.total ? (leader.withAllegations / leader.total) * 100 : 0} className="h-2 bg-foreground/10" />
                      </div>
                      <div>
                        <div className="mb-1 text-xs text-muted-foreground">Conviction proxy ({leader.convictionRate}%)</div>
                        <Progress value={leader.convictionRate} className="h-2 bg-foreground/10" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statehouse" className="space-y-6">
            <Card className="border-foreground/10 bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle>State House Expenditures</CardTitle>
                <CardDescription>Non-compliant or unexplained expenditures requiring accountability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-foreground/10 bg-background p-4 text-sm">
                  <div className="font-semibold text-foreground">
                    KSh {formatNumber(Math.round(stateHouseSummary.total))}M flagged
                  </div>
                  <div className="text-muted-foreground">Average risk score: {stateHouseSummary.avgRisk}%</div>
                </div>
                {stateHouseExpenditures.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-foreground/10 bg-background p-4 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h4 className="font-medium text-foreground">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.issue}</p>
                        <div className="mt-2 text-xs text-muted-foreground">{formatDate(item.date)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-foreground">
                          KSh {formatNumber(Math.round(item.amountMillions))}M
                        </div>
                        <Badge variant="outline" className="border-foreground/20 text-foreground">
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">Risk {item.risk}%</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}
