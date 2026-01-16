"use client"

import { useSearchParams } from "next/navigation"
import { BarChart3, TrendingUp, MapPin, Filter, Download, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate, formatNumber } from "@/lib/formatters"
import { stateHouseExpenditures } from "@/lib/state-house"

const analyticsData = {
  overview: {
    totalProjects: 847,
    stalledProjects: 234,
    totalLoss: 156.7,
    recoveredFunds: 23.4,
    activeCases: 89,
    convictions: 12,
  },
  sectorAnalysis: [
    { sector: "Transport", projects: 89, loss: 45.2, percentage: 29, trend: "+12%" },
    { sector: "Health", projects: 67, loss: 34.1, percentage: 22, trend: "-3%" },
    { sector: "Education", projects: 78, loss: 28.7, percentage: 18, trend: "+8%" },
    { sector: "Water", projects: 45, loss: 25.3, percentage: 16, trend: "+5%" },
    { sector: "Energy", projects: 34, loss: 23.4, percentage: 15, trend: "-2%" },
  ],
  countyRankings: [
    { county: "Nairobi", projects: 45, loss: 23.4, score: 34 },
    { county: "Mombasa", projects: 28, loss: 18.2, score: 42 },
    { county: "Nakuru", projects: 22, loss: 12.1, score: 58 },
    { county: "Kisumu", projects: 19, loss: 9.8, score: 61 },
    { county: "Uasin Gishu", projects: 15, loss: 8.7, score: 65 },
    { county: "Machakos", projects: 18, loss: 7.9, score: 67 },
    { county: "Kiambu", projects: 12, loss: 6.2, score: 72 },
    { county: "Meru", projects: 10, loss: 4.8, score: 78 },
  ],
  yearlyTrends: [
    { year: "2020", projects: 45, loss: 28.3, recovery: 2.1 },
    { year: "2021", projects: 67, loss: 34.7, recovery: 4.8 },
    { year: "2022", projects: 89, loss: 42.1, recovery: 6.2 },
    { year: "2023", projects: 78, loss: 38.9, recovery: 7.9 },
    { year: "2024", projects: 56, loss: 31.2, recovery: 8.4 },
  ],
  leadershipAnalysis: [
    { position: "County Governors", total: 47, withAllegations: 12, convictionRate: 8.5 },
    { position: "Members of Parliament", total: 290, withAllegations: 34, convictionRate: 5.2 },
    { position: "County Executives", total: 235, withAllegations: 28, convictionRate: 6.1 },
    { position: "Chief Officers", total: 188, withAllegations: 19, convictionRate: 7.3 },
  ],
}

export default function AnalyticsPage() {
  const searchParams = useSearchParams()
  const tabParam = searchParams?.get("tab") || "sectors"
  const defaultTab =
    tabParam === "counties" || tabParam === "trends" || tabParam === "leadership" || tabParam === "statehouse"
      ? tabParam
      : "sectors"
  const formatStateHouseAmount = (value: number) => `KSh ${formatNumber(Math.round(value))}M`

  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 pt-10">
        <div className="rounded-3xl border border-foreground/10 bg-white/80 p-8 shadow-sm">
          <Badge className="bg-foreground text-background">Accountability insights</Badge>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <h1 className="font-display text-3xl text-foreground md:text-4xl">Analytics & Insights</h1>
              <p className="max-w-2xl text-muted-foreground">
                Comprehensive analysis of accountability trends across sectors, counties, and leadership tiers.
              </p>
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
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {[
            { label: "Total projects", value: analyticsData.overview.totalProjects },
            { label: "Stalled projects", value: analyticsData.overview.stalledProjects },
            { label: "Total loss", value: `KSh ${analyticsData.overview.totalLoss}B` },
            { label: "Recovered", value: `KSh ${analyticsData.overview.recoveredFunds}B` },
            { label: "Active cases", value: analyticsData.overview.activeCases },
            { label: "Convictions", value: analyticsData.overview.convictions },
          ].map((metric) => (
            <Card key={metric.label} className="border-foreground/10 bg-white/90 shadow-sm">
              <CardContent className="p-4">
                <div className="text-xl font-semibold text-foreground">{metric.value}</div>
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
                <CardDescription>Breakdown of stalled projects and losses by sector</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {analyticsData.sectorAnalysis.map((sector) => (
                  <div key={sector.sector} className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-medium text-foreground">{sector.sector}</h3>
                        <Badge variant="outline" className="border-foreground/20 text-foreground">
                          {sector.projects} projects
                        </Badge>
                        <Badge
                          variant="outline"
                          className={
                            sector.trend.startsWith("+")
                              ? "border-emerald-500/40 text-emerald-600"
                              : "border-rose-500/40 text-rose-600"
                          }
                        >
                          {sector.trend} YoY
                        </Badge>
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-semibold text-foreground">KSh {sector.loss}B lost</div>
                        <div className="text-muted-foreground">{sector.percentage}% of total</div>
                      </div>
                    </div>
                    <Progress value={sector.percentage} className="h-2 bg-foreground/10" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  title: "High risk: Transport",
                  body: "Requires immediate attention due to large budget allocations and high failure rate.",
                },
                {
                  title: "Medium risk: Health",
                  body: "Shows improvement but needs continued monitoring especially in rural areas.",
                },
                {
                  title: "Improving: Energy",
                  body: "Showing positive trends with better project completion rates.",
                },
                {
                  title: "Focus area: Education",
                  body: "Increasing investments require enhanced oversight mechanisms.",
                },
              ].map((item) => (
                <Card key={item.title} className="border-foreground/10 bg-white/90 shadow-sm">
                  <CardContent className="p-5">
                    <h4 className="font-medium text-foreground">{item.title}</h4>
                    <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="counties" className="space-y-6">
            <Card className="border-foreground/10 bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  County accountability rankings
                </CardTitle>
                <CardDescription>Counties ranked by accountability score (higher is better)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsData.countyRankings.map((county, index) => (
                  <div key={county.county} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-foreground/10 bg-background p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/10 text-sm font-medium text-foreground">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{county.county} County</h4>
                        <div className="text-sm text-muted-foreground">
                          {county.projects} projects | KSh {county.loss}B lost
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
                <div className="text-center">
                  <Button variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    View all 47 counties
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-foreground/10 bg-white/90 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Yearly trends
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analyticsData.yearlyTrends.map((year) => (
                    <div key={year.year} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{year.year}</span>
                        <div className="text-right text-muted-foreground">
                          <div>{year.projects} projects</div>
                          <div>KSh {year.loss}B lost</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Projects lost</div>
                          <Progress value={(year.projects / 100) * 100} className="h-2 bg-foreground/10" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Recovery rate</div>
                          <Progress value={(year.recovery / year.loss) * 100} className="h-2 bg-foreground/10" />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-foreground/10 bg-white/90 shadow-sm">
                <CardHeader>
                  <CardTitle>Key insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      title: "Peak issues: 2022",
                      body: "Highest number of stalled projects coincided with election year activities.",
                    },
                    {
                      title: "Recovery improving",
                      body: "Fund recovery rates have improved from 7% in 2020 to 27% in 2024.",
                    },
                    {
                      title: "Seasonal patterns",
                      body: "More issues reported during budget preparation periods (March-June).",
                    },
                  ].map((insight) => (
                    <div key={insight.title} className="rounded-2xl border border-foreground/10 bg-background p-4">
                      <h4 className="font-medium text-foreground">{insight.title}</h4>
                      <p className="mt-1 text-sm text-muted-foreground">{insight.body}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="leadership" className="space-y-6">
            <Card className="border-foreground/10 bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle>Leadership accountability analysis</CardTitle>
                <CardDescription>Breakdown of allegations and conviction rates by leadership position</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {analyticsData.leadershipAnalysis.map((leadership) => (
                  <div key={leadership.position} className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <h3 className="font-medium text-foreground">{leadership.position}</h3>
                      <div className="text-right text-sm text-muted-foreground">
                        <div>
                          {leadership.withAllegations} of {leadership.total} with allegations
                        </div>
                        <div className="font-semibold text-foreground">{leadership.convictionRate}% conviction rate</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">
                          Allegations rate ({Math.round((leadership.withAllegations / leadership.total) * 100)}%)
                        </div>
                        <Progress value={(leadership.withAllegations / leadership.total) * 100} className="h-2 bg-foreground/10" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Conviction rate ({leadership.convictionRate}%)</div>
                        <Progress value={leadership.convictionRate} className="h-2 bg-foreground/10" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-foreground/10 bg-white/90 shadow-sm">
                <CardHeader>
                  <CardTitle>Most accountable leaders</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: "Gov. Anne Waiguru", county: "Kirinyaga", score: 92 },
                    { name: "Gov. Kivutha Kibwana", county: "Makueni", score: 89 },
                    { name: "Gov. Alfred Mutua", county: "Machakos", score: 87 },
                    { name: "Hon. John Mbadi", constituency: "Gwassi", score: 85 },
                  ].map((leader) => (
                    <div key={leader.name} className="flex items-center justify-between rounded-2xl border border-foreground/10 bg-background p-3">
                      <div>
                        <div className="font-medium text-foreground">{leader.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {"county" in leader ? `${leader.county} County` : `${leader.constituency} Constituency`}
                        </div>
                      </div>
                      <div className="text-lg font-semibold text-foreground">{leader.score}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-foreground/10 bg-white/90 shadow-sm">
                <CardHeader>
                  <CardTitle>Areas needing attention</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { area: "Procurement Processes", severity: "High", cases: 45 },
                    { area: "Project Supervision", severity: "High", cases: 38 },
                    { area: "Budget Implementation", severity: "Medium", cases: 29 },
                    { area: "Public Participation", severity: "Medium", cases: 22 },
                  ].map((area) => (
                    <div key={area.area} className="flex items-center justify-between rounded-2xl border border-foreground/10 bg-background p-3">
                      <div>
                        <div className="font-medium text-foreground">{area.area}</div>
                        <div className="text-sm text-muted-foreground">{area.cases} active cases</div>
                      </div>
                      <Badge variant={area.severity === "High" ? "destructive" : "secondary"}>{area.severity}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="statehouse" className="space-y-6">
            <Card className="border-foreground/10 bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle>State House Expenditures</CardTitle>
                <CardDescription>Non-compliant or unexplained expenditures requiring accountability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                          {formatStateHouseAmount(item.amountMillions)}
                        </div>
                        <Badge variant="outline" className="border-foreground/20 text-foreground">
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="border-foreground/20 text-foreground">
                        Risk {item.risk}%
                      </Badge>
                      {item.reference ? (
                        <Badge variant="outline" className="border-foreground/20 text-foreground">
                          <a href={item.reference} target="_blank" rel="noreferrer">
                            Audit reference
                          </a>
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-amber-200 text-amber-700">
                          Reference pending
                        </Badge>
                      )}
                      {item.source ? <span>Source: {item.source}</span> : <span>Source pending</span>}
                    </div>
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
