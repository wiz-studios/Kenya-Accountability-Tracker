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

// Import our data processing classes
import { DataExtractionEngine } from "@/lib/data-extraction-engine"
import { StalledProjectAnalyzer } from "@/lib/stalled-project-analyzer"
import { dataSourcesConfig, stalledProjectCriteria } from "@/lib/data-sources-config"

export default function DataPipelinePage() {
  const [isExtracting, setIsExtracting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [extractionResults, setExtractionResults] = useState<any[]>([])
  const [analysisResults, setAnalysisResults] = useState<any[]>([])
  const [pipelineStatus, setPipelineStatus] = useState<"idle" | "running" | "error">("idle")
  const [lastRun, setLastRun] = useState<Date | null>(null)
  const [autoMode, setAutoMode] = useState(false)

  // Initialize engines
  const [extractionEngine] = useState(() => new DataExtractionEngine(dataSourcesConfig))
  const [analyzer] = useState(() => new StalledProjectAnalyzer(stalledProjectCriteria))

  // Run full data pipeline
  const runFullPipeline = async () => {
    setPipelineStatus("running")
    setIsExtracting(true)

    try {
      console.log("Starting data extraction pipeline...")

      // Step 1: Extract data from all sources
      const extractionResults = await extractionEngine.extractAllSources()
      setExtractionResults(extractionResults)

      setIsExtracting(false)
      setIsAnalyzing(true)

      // Step 2: Combine and deduplicate data
      const allProjects = extractionResults.filter((result) => result.success).flatMap((result) => result.extractedData)

      console.log(`Extracted ${allProjects.length} projects from ${extractionResults.length} sources`)

      // Step 3: Analyze for stalled projects
      const analyses = await analyzer.analyzeProjects(allProjects)
      setAnalysisResults(analyses)

      setIsAnalyzing(false)
      setPipelineStatus("idle")
      setLastRun(new Date())

      console.log(`Analysis complete: ${analyses.length} projects analyzed`)
    } catch (error) {
      console.error("Pipeline error:", error)
      setPipelineStatus("error")
      setIsExtracting(false)
      setIsAnalyzing(false)
    }
  }

  // Auto-run pipeline every hour when enabled
  useEffect(() => {
    if (!autoMode) return

    const interval = setInterval(
      () => {
        runFullPipeline()
      },
      60 * 60 * 1000,
    ) // 1 hour

    return () => clearInterval(interval)
  }, [autoMode])

  // Get pipeline statistics
  const pipelineStats = {
    totalSources: dataSourcesConfig.length,
    activeSources: dataSourcesConfig.filter((s) => s.status === "active").length,
    totalExtractions: extractionResults.length,
    successfulExtractions: extractionResults.filter((r) => r.success).length,
    totalProjects: extractionResults.reduce((sum, r) => sum + r.recordsValidated, 0),
    stalledProjects: analysisResults.filter((a) => ["Confirmed Stalled", "Likely Stalled"].includes(a.stalledStatus))
      .length,
    lastRun: lastRun?.toLocaleString() || "Never",
  }

  const analysisStats = analysisResults.length > 0 ? analyzer.getAnalysisStatistics(analysisResults) : null

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Data Pipeline Management</h1>
          <p className="text-muted-foreground">
            Automated data extraction, validation, and stalled project identification
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={runFullPipeline} disabled={pipelineStatus === "running"} className="flex items-center gap-2">
            {pipelineStatus === "running" ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            Run Pipeline
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Pipeline Status */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Pipeline Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-3 ${
                  pipelineStatus === "running"
                    ? "bg-blue-500 animate-pulse"
                    : pipelineStatus === "error"
                      ? "bg-red-500"
                      : "bg-green-500"
                }`}
              />
              <div>
                <div className="font-medium">
                  {pipelineStatus === "running" ? "Running" : pipelineStatus === "error" ? "Error" : "Idle"}
                </div>
                <div className="text-sm text-muted-foreground">Current Status</div>
              </div>
            </div>

            <div className="flex items-center">
              <Clock className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <div className="font-medium">{pipelineStats.lastRun}</div>
                <div className="text-sm text-muted-foreground">Last Run</div>
              </div>
            </div>

            <div className="flex items-center">
              <Database className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <div className="font-medium">
                  {pipelineStats.activeSources}/{pipelineStats.totalSources}
                </div>
                <div className="text-sm text-muted-foreground">Active Sources</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Switch id="auto-mode" checked={autoMode} onCheckedChange={setAutoMode} />
                <Label htmlFor="auto-mode" className="ml-2">
                  Auto Mode
                </Label>
              </div>
              <div className="text-sm text-muted-foreground">{autoMode ? "Runs hourly" : "Manual only"}</div>
            </div>
          </div>

          {/* Progress Indicators */}
          {(isExtracting || isAnalyzing) && (
            <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Data Extraction</span>
                  <span>{isExtracting ? "In Progress..." : "Complete"}</span>
                </div>
                <Progress value={isExtracting ? 50 : 100} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Stalled Project Analysis</span>
                  <span>{isAnalyzing ? "In Progress..." : isExtracting ? "Waiting..." : "Complete"}</span>
                </div>
                <Progress value={isAnalyzing ? 50 : isExtracting ? 0 : 100} className="h-2" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <div className="text-2xl font-bold">{pipelineStats.totalProjects}</div>
                <div className="text-sm text-muted-foreground">Projects Extracted</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <div className="text-2xl font-bold">{pipelineStats.stalledProjects}</div>
                <div className="text-sm text-muted-foreground">Stalled Projects</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {pipelineStats.totalExtractions > 0
                    ? Math.round((pipelineStats.successfulExtractions / pipelineStats.totalExtractions) * 100)
                    : 0}
                  %
                </div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <div className="text-2xl font-bold">{analysisStats ? analysisStats.averageScore : 0}</div>
                <div className="text-sm text-muted-foreground">Avg Stalled Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="extraction" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="extraction">Data Extraction</TabsTrigger>
          <TabsTrigger value="analysis">Stalled Analysis</TabsTrigger>
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="extraction" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Extraction Results</CardTitle>
              <CardDescription>Results from the latest data extraction run</CardDescription>
            </CardHeader>
            <CardContent>
              {extractionResults.length === 0 ? (
                <div className="text-center py-8">
                  <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No extraction results yet. Run the pipeline to see results.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Records Extracted</TableHead>
                      <TableHead>Records Validated</TableHead>
                      <TableHead>Errors</TableHead>
                      <TableHead>Extraction Time</TableHead>
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
                            <Badge variant="outline" className="text-red-600">
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
          <Card>
            <CardHeader>
              <CardTitle>Stalled Project Analysis</CardTitle>
              <CardDescription>Automated identification of stalled projects</CardDescription>
            </CardHeader>
            <CardContent>
              {analysisResults.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No analysis results yet. Run the pipeline to see results.</p>
                </div>
              ) : (
                <>
                  {/* Analysis Summary */}
                  {analysisStats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{analysisStats.confirmed}</div>
                        <div className="text-sm text-red-600">Confirmed Stalled</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{analysisStats.likely}</div>
                        <div className="text-sm text-orange-600">Likely Stalled</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{analysisStats.atRisk}</div>
                        <div className="text-sm text-yellow-600">At Risk</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{analysisStats.active}</div>
                        <div className="text-sm text-green-600">Active</div>
                      </div>
                    </div>
                  )}

                  {/* Top Stalled Projects */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project Name</TableHead>
                        <TableHead>Stalled Score</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Confidence</TableHead>
                        <TableHead>Key Issues</TableHead>
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
                              <Progress value={analysis.stalledScore} className="h-2 w-16" />
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
                                .filter((c) => c.score > 0.7)
                                .slice(0, 2)
                                .map((criteria, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {criteria.criteriaName}
                                  </Badge>
                                ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              View Details
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
          <Card>
            <CardHeader>
              <CardTitle>Data Sources Configuration</CardTitle>
              <CardDescription>Manage and monitor data sources</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Trust Score</TableHead>
                    <TableHead>Update Frequency</TableHead>
                    <TableHead>Last Sync</TableHead>
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
                          <Progress value={source.trustScore} className="h-2 w-16" />
                        </div>
                      </TableCell>
                      <TableCell>{source.updateFrequency}</TableCell>
                      <TableCell>
                        {source.lastSuccessfulSync ? new Date(source.lastSuccessfulSync).toLocaleDateString() : "Never"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <RefreshCw className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="w-3 h-3" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pipeline Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data Freshness</span>
                    <Badge variant="default">Good</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Source Availability</span>
                    <Badge variant="default">95%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Validation Rate</span>
                    <Badge variant="default">92%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Analysis Accuracy</span>
                    <Badge variant="default">88%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>3 new stalled projects identified in the last 24 hours</AlertDescription>
                  </Alert>
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>County Government portal extraction failed - retrying in 1 hour</AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
