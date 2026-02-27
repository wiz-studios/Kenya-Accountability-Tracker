"use client"

import { useState, useEffect } from "react"
import {
  Database,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Settings,
  Play,
  BarChart3,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AdminAuthGate } from "@/components/admin-auth-gate"
import { DataExtractionEngine } from "@/lib/data-extraction-engine"
import { StalledProjectAnalyzer } from "@/lib/stalled-project-analyzer"
import { dataSourcesConfig, stalledProjectCriteria } from "@/lib/data-sources-config"
import { formatDate, formatDateTime } from "@/lib/formatters"

function DataPipelineContent() {
  const [isExtracting, setIsExtracting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [extractionResults, setExtractionResults] = useState<any[]>([])
  const [analysisResults, setAnalysisResults] = useState<any[]>([])
  const [pipelineStatus, setPipelineStatus] = useState<"idle" | "running" | "error">("idle")
  const [lastRun, setLastRun] = useState<Date | null>(null)
  const [autoMode, setAutoMode] = useState(false)

  const [extractionEngine] = useState(() => new DataExtractionEngine(dataSourcesConfig))
  const [analyzer] = useState(() => new StalledProjectAnalyzer(stalledProjectCriteria))

  const runFullPipeline = async () => {
    setPipelineStatus("running")
    setIsExtracting(true)

    try {
      const extractionResults = await extractionEngine.extractAllSources()
      setExtractionResults(extractionResults)

      setIsExtracting(false)
      setIsAnalyzing(true)

      const allProjects = extractionResults.filter((result) => result.success).flatMap((result) => result.extractedData)

      const analyses = await analyzer.analyzeProjects(allProjects)
      setAnalysisResults(analyses)

      setIsAnalyzing(false)
      setPipelineStatus("idle")
      setLastRun(new Date())
    } catch (error) {
      setPipelineStatus("error")
      setIsExtracting(false)
      setIsAnalyzing(false)
    }
  }

  useEffect(() => {
    if (!autoMode) return

    const interval = setInterval(() => {
      runFullPipeline()
    }, 60 * 60 * 1000)

    return () => clearInterval(interval)
  }, [autoMode])

  const pipelineStats = {
    totalSources: dataSourcesConfig.length,
    activeSources: dataSourcesConfig.filter((s) => s.status === "active").length,
    totalExtractions: extractionResults.length,
    successfulExtractions: extractionResults.filter((r) => r.success).length,
    totalProjects: extractionResults.reduce((sum, r) => sum + r.recordsValidated, 0),
    stalledProjects: analysisResults.filter((a) => ["Confirmed Stalled", "Likely Stalled"].includes(a.stalledStatus))
      .length,
    lastRun: lastRun ? formatDateTime(lastRun.toISOString()) : "Never",
  }

  const analysisStats = analysisResults.length > 0 ? analyzer.getAnalysisStatistics(analysisResults) : null

  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 pt-10">
        <div className="rounded-3xl border border-foreground/10 bg-white/80 p-8 shadow-sm">
          <Badge className="bg-foreground text-background">Data pipeline</Badge>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <h1 className="font-display text-3xl text-foreground md:text-4xl">Pipeline Management</h1>
              <p className="max-w-2xl text-muted-foreground">
                Automated data extraction, validation, and stalled project identification across all configured sources.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={runFullPipeline} disabled={pipelineStatus === "running"} className="flex items-center gap-2">
                {pipelineStatus === "running" ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                Run pipeline
              </Button>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Configure
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <Card className="border-foreground/10 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Pipeline status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-4">
              <div className="flex items-center gap-3">
                <div
                  className={`h-3 w-3 rounded-full ${
                    pipelineStatus === "running"
                      ? "bg-foreground animate-pulse"
                      : pipelineStatus === "error"
                        ? "bg-rose-500"
                        : "bg-emerald-500"
                  }`}
                />
                <div>
                  <div className="font-medium text-foreground">
                    {pipelineStatus === "running" ? "Running" : pipelineStatus === "error" ? "Error" : "Idle"}
                  </div>
                  <div className="text-sm text-muted-foreground">Current status</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-foreground" />
                <div>
                  <div className="font-medium text-foreground">{pipelineStats.lastRun}</div>
                  <div className="text-sm text-muted-foreground">Last run</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Database className="h-8 w-8 text-foreground" />
                <div>
                  <div className="font-medium text-foreground">
                    {pipelineStats.activeSources}/{pipelineStats.totalSources}
                  </div>
                  <div className="text-sm text-muted-foreground">Active sources</div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Switch id="auto-mode" checked={autoMode} onCheckedChange={setAutoMode} />
                  <Label htmlFor="auto-mode">Auto mode</Label>
                </div>
                <div className="text-sm text-muted-foreground">{autoMode ? "Runs hourly" : "Manual only"}</div>
              </div>
            </div>

            {(isExtracting || isAnalyzing) && (
              <div className="mt-6 space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Data extraction</span>
                    <span>{isExtracting ? "In progress..." : "Complete"}</span>
                  </div>
                  <Progress value={isExtracting ? 50 : 100} className="mt-2 h-2 bg-foreground/10" />
                </div>

                <div>
                  <div className="flex justify-between text-sm">
                    <span>Stalled project analysis</span>
                    <span>{isAnalyzing ? "In progress..." : isExtracting ? "Waiting..." : "Complete"}</span>
                  </div>
                  <Progress value={isAnalyzing ? 50 : isExtracting ? 0 : 100} className="mt-2 h-2 bg-foreground/10" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="container mx-auto px-4 pb-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Projects extracted", value: pipelineStats.totalProjects, icon: Database },
            { label: "Stalled projects", value: pipelineStats.stalledProjects, icon: AlertTriangle },
            {
              label: "Success rate",
              value:
                pipelineStats.totalExtractions > 0
                  ? `${Math.round((pipelineStats.successfulExtractions / pipelineStats.totalExtractions) * 100)}%`
                  : "0%",
              icon: CheckCircle,
            },
            { label: "Avg stalled score", value: analysisStats ? analysisStats.averageScore : 0, icon: BarChart3 },
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
        <Tabs defaultValue="extraction" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 gap-2 rounded-full bg-foreground/5 p-1 text-foreground/70 md:grid-cols-4">
            {[
              { value: "extraction", label: "Data extraction" },
              { value: "analysis", label: "Stalled analysis" },
              { value: "sources", label: "Data sources" },
              { value: "monitoring", label: "Monitoring" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="extraction" className="space-y-6">
            <Card className="border-foreground/10 bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle>Extraction results</CardTitle>
                <CardDescription>Results from the latest data extraction run</CardDescription>
              </CardHeader>
              <CardContent>
                {extractionResults.length === 0 ? (
                  <div className="py-8 text-center">
                    <Database className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground">No extraction results yet. Run the pipeline to see results.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Source</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Records extracted</TableHead>
                        <TableHead>Records validated</TableHead>
                        <TableHead>Errors</TableHead>
                        <TableHead>Extraction time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {extractionResults.map((result, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {dataSourcesConfig.find((s) => s.id === result.sourceId)?.name || result.sourceId}
                          </TableCell>
                          <TableCell>
                            <Badge variant={result.success ? "default" : "destructive"}>
                              {result.success ? "Success" : "Failed"}
                            </Badge>
                          </TableCell>
                          <TableCell>{result.recordsExtracted}</TableCell>
                          <TableCell>{result.recordsValidated}</TableCell>
                          <TableCell>
                            {result.errors.length > 0 && (
                              <Badge variant="outline" className="text-rose-600">
                                {result.errors.length} errors
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>{result.extractionTime.toLocaleTimeString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <Card className="border-foreground/10 bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle>Stalled project analysis</CardTitle>
                <CardDescription>Automated identification of stalled projects</CardDescription>
              </CardHeader>
              <CardContent>
                {analysisResults.length === 0 ? (
                  <div className="py-8 text-center">
                    <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground">No analysis results yet. Run the pipeline to see results.</p>
                  </div>
                ) : (
                  <>
                    {analysisStats && (
                      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                        {[
                          { label: "Confirmed stalled", value: analysisStats.confirmed },
                          { label: "Likely stalled", value: analysisStats.likely },
                          { label: "At risk", value: analysisStats.atRisk },
                          { label: "Active", value: analysisStats.active },
                        ].map((item) => (
                          <Card key={item.label} className="border-foreground/10 bg-background shadow-sm">
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl font-semibold text-foreground">{item.value}</div>
                              <div className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Project name</TableHead>
                          <TableHead>Stalled score</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Confidence</TableHead>
                          <TableHead>Key issues</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analysisResults.slice(0, 10).map((analysis, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{analysis.projectName}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{analysis.stalledScore}</span>
                                <Progress value={analysis.stalledScore} className="h-2 w-16 bg-foreground/10" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  analysis.stalledStatus === "Confirmed Stalled"
                                    ? "destructive"
                                    : analysis.stalledStatus === "Likely Stalled"
                                      ? "secondary"
                                      : analysis.stalledStatus === "At Risk"
                                        ? "outline"
                                        : "default"
                                }
                              >
                                {analysis.stalledStatus}
                              </Badge>
                            </TableCell>
                            <TableCell>{analysis.confidenceLevel}%</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {analysis.criteriaResults
                                  .filter((c: { score: number }) => c.score > 0.7)
                                  .slice(0, 2)
                                  .map((criteria: { criteriaName: string }, i: number) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {criteria.criteriaName}
                                    </Badge>
                                  ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                View details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sources" className="space-y-6">
            <Card className="border-foreground/10 bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle>Data sources configuration</CardTitle>
                <CardDescription>Manage and monitor data sources</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Trust score</TableHead>
                      <TableHead>Update frequency</TableHead>
                      <TableHead>Last sync</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataSourcesConfig.map((source) => (
                      <TableRow key={source.id}>
                        <TableCell className="font-medium">{source.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{source.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={source.status === "active" ? "default" : "secondary"}>{source.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{source.trustScore}%</span>
                            <Progress value={source.trustScore} className="h-2 w-16 bg-foreground/10" />
                          </div>
                        </TableCell>
                        <TableCell>{source.updateFrequency}</TableCell>
                        <TableCell>
                          {source.lastSuccessfulSync ? formatDate(source.lastSuccessfulSync.split("T")[0]) : "Never"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Settings className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-foreground/10 bg-white/90 shadow-sm">
                <CardHeader>
                  <CardTitle>Pipeline health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  {[
                    { label: "Data freshness", value: "Good" },
                    { label: "Source availability", value: "95%" },
                    { label: "Validation rate", value: "92%" },
                    { label: "Analysis accuracy", value: "88%" },
                  ].map((metric) => (
                    <div key={metric.label} className="flex items-center justify-between">
                      <span>{metric.label}</span>
                      <Badge variant="outline" className="border-foreground/20 text-foreground">
                        {metric.value}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-foreground/10 bg-white/90 shadow-sm">
                <CardHeader>
                  <CardTitle>Recent alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>3 new stalled projects identified in the last 24 hours</AlertDescription>
                  </Alert>
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>County Government portal extraction failed - retrying in 1 hour</AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}

export default function DataPipelinePage() {
  return <AdminAuthGate title="Pipeline Management">{() => <DataPipelineContent />}</AdminAuthGate>
}
