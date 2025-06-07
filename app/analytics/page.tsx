"use client"

import { useState } from "react"
import { BarChart3, TrendingUp, MapPin, Filter, Download, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock analytics data
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
  const [selectedYear, setSelectedYear] = useState("2024")
  const [selectedMetric, setSelectedMetric] = useState("loss")

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics & Insights</h1>
          <p className="text-muted-foreground">Comprehensive analysis of accountability trends across Kenya</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{analyticsData.overview.totalProjects}</div>
            <div className="text-sm text-muted-foreground">Total Projects</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{analyticsData.overview.stalledProjects}</div>
            <div className="text-sm text-muted-foreground">Stalled Projects</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">KSh {analyticsData.overview.totalLoss}B</div>
            <div className="text-sm text-muted-foreground">Total Loss</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">KSh {analyticsData.overview.recoveredFunds}B</div>
            <div className="text-sm text-muted-foreground">Recovered</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{analyticsData.overview.activeCases}</div>
            <div className="text-sm text-muted-foreground">Active Cases</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">{analyticsData.overview.convictions}</div>
            <div className="text-sm text-muted-foreground">Convictions</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sectors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sectors">By Sector</TabsTrigger>
          <TabsTrigger value="counties">By County</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="leadership">Leadership</TabsTrigger>
        </TabsList>

        <TabsContent value="sectors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Sector Analysis
              </CardTitle>
              <CardDescription>Breakdown of stalled projects and losses by sector</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {analyticsData.sectorAnalysis.map((sector, index) => (
                  <div key={sector.sector} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <h3 className="font-medium">{sector.sector}</h3>
                        <Badge variant="outline">{sector.projects} projects</Badge>
                        <Badge variant={sector.trend.startsWith("+") ? "destructive" : "default"} className="text-xs">
                          {sector.trend} YoY
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">KSh {sector.loss}B lost</div>
                        <div className="text-sm text-muted-foreground">{sector.percentage}% of total</div>
                      </div>
                    </div>
                    <Progress value={sector.percentage} className="h-3" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sector Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Sector Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-900 mb-2">High Risk: Transport</h4>
                    <p className="text-sm text-red-800">
                      Requires immediate attention due to large budget allocations and high failure rate.
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <h4 className="font-medium text-orange-900 mb-2">Medium Risk: Health</h4>
                    <p className="text-sm text-orange-800">
                      Shows improvement but needs continued monitoring especially in rural areas.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Improving: Energy</h4>
                    <p className="text-sm text-green-800">
                      Showing positive trends with better project completion rates.
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Focus Area: Education</h4>
                    <p className="text-sm text-blue-800">
                      Increasing investments require enhanced oversight mechanisms.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="counties" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                County Accountability Rankings
              </CardTitle>
              <CardDescription>Counties ranked by accountability score (higher is better)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.countyRankings.map((county, index) => (
                  <div key={county.county} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{county.county} County</h4>
                        <div className="text-sm text-muted-foreground">
                          {county.projects} projects • KSh {county.loss}B lost
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-bold">{county.score}</div>
                        <div className="text-sm text-muted-foreground">/100</div>
                      </div>
                      <Progress value={county.score} className="h-2 w-20" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  View All 47 Counties
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Yearly Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.yearlyTrends.map((year) => (
                    <div key={year.year} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{year.year}</span>
                        <div className="text-right text-sm">
                          <div>{year.projects} projects</div>
                          <div className="text-red-600">KSh {year.loss}B lost</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Projects Lost</div>
                          <Progress value={(year.projects / 100) * 100} className="h-2" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Recovery Rate</div>
                          <Progress value={(year.recovery / year.loss) * 100} className="h-2 [&>div]:bg-green-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Peak Issues: 2022</h4>
                    <p className="text-sm text-blue-800">
                      Highest number of stalled projects coincided with election year activities.
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Recovery Improving</h4>
                    <p className="text-sm text-green-800">
                      Fund recovery rates have improved from 7% in 2020 to 27% in 2024.
                    </p>
                  </div>

                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <h4 className="font-medium text-orange-900 mb-2">Seasonal Patterns</h4>
                    <p className="text-sm text-orange-800">
                      More issues reported during budget preparation periods (March-June).
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leadership" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Leadership Accountability Analysis</CardTitle>
              <CardDescription>Breakdown of allegations and conviction rates by leadership position</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {analyticsData.leadershipAnalysis.map((leadership) => (
                  <div key={leadership.position} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{leadership.position}</h3>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          {leadership.withAllegations} of {leadership.total} with allegations
                        </div>
                        <div className="font-semibold">{leadership.convictionRate}% conviction rate</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">
                          Allegations Rate ({Math.round((leadership.withAllegations / leadership.total) * 100)}%)
                        </div>
                        <Progress value={(leadership.withAllegations / leadership.total) * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">
                          Conviction Rate ({leadership.convictionRate}%)
                        </div>
                        <Progress value={leadership.convictionRate} className="h-2 [&>div]:bg-orange-500" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Most Accountable Leaders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Gov. Anne Waiguru", county: "Kirinyaga", score: 92 },
                    { name: "Gov. Kivutha Kibwana", county: "Makueni", score: 89 },
                    { name: "Gov. Alfred Mutua", county: "Machakos", score: 87 },
                    { name: "Hon. John Mbadi", constituency: "Gwassi", score: 85 },
                  ].map((leader, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{leader.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {"county" in leader ? leader.county + " County" : leader.constituency + " Constituency"}
                        </div>
                      </div>
                      <div className="text-lg font-bold text-green-600">{leader.score}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Areas Needing Attention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { area: "Procurement Processes", severity: "High", cases: 45 },
                    { area: "Project Supervision", severity: "High", cases: 38 },
                    { area: "Budget Implementation", severity: "Medium", cases: 29 },
                    { area: "Public Participation", severity: "Medium", cases: 22 },
                  ].map((area, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{area.area}</div>
                        <div className="text-sm text-muted-foreground">{area.cases} active cases</div>
                      </div>
                      <Badge variant={area.severity === "High" ? "destructive" : "secondary"}>{area.severity}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
