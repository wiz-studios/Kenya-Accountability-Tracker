"use client"

import { useState } from "react"
import { Database, FileText, AlertTriangle, RefreshCw, CheckCircle, XCircle, Filter, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { formatDate, formatDateTime, formatNumber } from "@/lib/formatters"

const dataSources = [
  {
    id: 1,
    name: "Kenya Open Data Portal",
    type: "Government",
    status: "Active",
    lastSync: "2025-06-01T10:30:00",
    recordsImported: 1245,
    trustScore: 95,
    url: "https://opendata.go.ke",
    dataTypes: ["Projects", "Budgets", "Procurement"],
    automationStatus: "Scheduled",
    nextSync: "2025-06-08T10:30:00",
  },
  {
    id: 2,
    name: "Auditor General Reports",
    type: "Government",
    status: "Active",
    lastSync: "2025-05-28T14:15:00",
    recordsImported: 832,
    trustScore: 98,
    url: "https://oagkenya.go.ke",
    dataTypes: ["Financial Irregularities", "Audit Reports"],
    automationStatus: "Scheduled",
    nextSync: "2025-06-28T14:15:00",
  },
  {
    id: 3,
    name: "Daily Nation News API",
    type: "Media",
    status: "Active",
    lastSync: "2025-06-02T08:00:00",
    recordsImported: 347,
    trustScore: 85,
    url: "https://nation.africa",
    dataTypes: ["News Articles", "Investigations"],
    automationStatus: "Daily",
    nextSync: "2025-06-03T08:00:00",
  },
  {
    id: 4,
    name: "Citizen Reports",
    type: "Crowdsourced",
    status: "Active",
    lastSync: "2025-06-02T23:59:59",
    recordsImported: 512,
    trustScore: 70,
    url: "Internal",
    dataTypes: ["Project Reports", "Corruption Reports", "Evidence"],
    automationStatus: "Real-time",
    nextSync: "Continuous",
  },
  {
    id: 5,
    name: "Transparency International Kenya",
    type: "NGO",
    status: "Active",
    lastSync: "2025-05-15T16:45:00",
    recordsImported: 128,
    trustScore: 90,
    url: "https://tikenya.org",
    dataTypes: ["Corruption Indices", "Research Reports"],
    automationStatus: "Monthly",
    nextSync: "2025-06-15T16:45:00",
  },
]

const pendingReports = [
  {
    id: 1,
    title: "Abandoned Health Center in Nakuru",
    submittedBy: "Anonymous",
    date: "2025-06-02T09:23:15",
    type: "Stalled Project",
    location: "Nakuru County",
    hasEvidence: true,
    status: "Pending Review",
  },
  {
    id: 2,
    title: "Misappropriation of Road Construction Funds",
    submittedBy: "John K.",
    date: "2025-06-01T16:45:30",
    type: "Corruption Report",
    location: "Machakos County",
    hasEvidence: true,
    status: "Pending Review",
  },
  {
    id: 3,
    title: "School Building Left Incomplete",
    submittedBy: "Education Advocate",
    date: "2025-05-31T11:12:45",
    type: "Stalled Project",
    location: "Kisumu County",
    hasEvidence: false,
    status: "Pending Review",
  },
]

const dataValidationStats = {
  totalRecords: 3064,
  validated: 2845,
  flaggedForReview: 219,
  automatedValidation: 2612,
  manualValidation: 452,
}

export default function DataManagementDashboard() {
  const [selectedSource, setSelectedSource] = useState<string | null>(null)
  const [syncInProgress, setSyncInProgress] = useState<number | null>(null)

  const handleSync = (sourceId: number) => {
    setSyncInProgress(sourceId)
    setTimeout(() => {
      setSyncInProgress(null)
    }, 3000)
  }

  const automatedPercent = Math.round((dataValidationStats.automatedValidation / dataValidationStats.validated) * 100)
  const manualPercent = Math.round((dataValidationStats.manualValidation / dataValidationStats.validated) * 100)

  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 pt-10">
        <div className="rounded-3xl border border-foreground/10 bg-white/80 p-8 shadow-sm">
          <Badge className="bg-foreground text-background">Data management</Badge>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <h1 className="font-display text-3xl text-foreground md:text-4xl">Data Operations</h1>
              <p className="max-w-2xl text-muted-foreground">
                Manage data sources, validation workflows, and citizen reports across the accountability platform.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button>
                <Database className="mr-2 h-4 w-4" />
                Add data source
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Data sources", value: dataSources.length, icon: Database },
            { label: "Total records", value: formatNumber(dataValidationStats.totalRecords), icon: FileText },
            {
              label: "Validation rate",
              value: `${Math.round((dataValidationStats.validated / dataValidationStats.totalRecords) * 100)}%`,
              icon: CheckCircle,
            },
            { label: "Pending reports", value: pendingReports.length, icon: AlertTriangle },
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
          <TabsList className="grid w-full grid-cols-3 gap-2 rounded-full bg-foreground/5 p-1 text-foreground/70">
            {[
              { value: "sources", label: "Data sources" },
              { value: "validation", label: "Data validation" },
              { value: "reports", label: "Citizen reports" },
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

          <TabsContent value="sources" className="space-y-6">
            <Card className="border-foreground/10 bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle>Connected data sources</CardTitle>
                <CardDescription>Manage your data sources and synchronization schedules</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Trust score</TableHead>
                      <TableHead>Last sync</TableHead>
                      <TableHead>Records</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataSources.map((source) => (
                      <TableRow key={source.id}>
                        <TableCell className="font-medium">{source.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{source.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{source.trustScore}%</span>
                            <Progress value={source.trustScore} className="h-2 w-16 bg-foreground/10" />
                          </div>
                        </TableCell>
                        <TableCell>{formatDateTime(source.lastSync)}</TableCell>
                        <TableCell>{formatNumber(source.recordsImported)}</TableCell>
                        <TableCell>
                          <Badge variant={source.status === "Active" ? "default" : "secondary"} className="capitalize">
                            {source.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSync(source.id)}
                              disabled={syncInProgress === source.id}
                            >
                              {syncInProgress === source.id ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <RefreshCw className="h-4 w-4" />
                              )}
                              <span className="sr-only">Sync</span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setSelectedSource(source.name)}>
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {selectedSource && (
              <Card className="border-foreground/10 bg-white/90 shadow-sm">
                <CardHeader>
                  <CardTitle>Data source details: {selectedSource}</CardTitle>
                  <CardDescription>Configuration and synchronization settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <h3 className="mb-2 text-sm font-medium text-foreground">Connection settings</h3>
                        <div className="grid gap-2">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="endpoint">API endpoint</Label>
                              <Input id="endpoint" value="https://api.example.com/v1/data" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="auth-type">Authentication type</Label>
                              <Select defaultValue="api-key">
                                <SelectTrigger id="auth-type" className="rounded-full border-foreground/20">
                                  <SelectValue placeholder="Select authentication type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="api-key">API Key</SelectItem>
                                  <SelectItem value="oauth">OAuth 2.0</SelectItem>
                                  <SelectItem value="basic">Basic Auth</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="api-key">API key</Label>
                            <Input id="api-key" type="password" value="****************" />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="mb-2 text-sm font-medium text-foreground">Data mapping</h3>
                        <div className="grid gap-2">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="project-field">Project ID field</Label>
                              <Input id="project-field" value="project_identifier" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="budget-field">Budget field</Label>
                              <Input id="budget-field" value="allocated_funds" />
                            </div>
                          </div>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="status-field">Status field</Label>
                              <Input id="status-field" value="current_status" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="location-field">Location field</Label>
                              <Input id="location-field" value="geographic_location" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="mb-2 text-sm font-medium text-foreground">Synchronization schedule</h3>
                        <div className="grid gap-2">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="frequency">Sync frequency</Label>
                              <Select defaultValue="daily">
                                <SelectTrigger id="frequency" className="rounded-full border-foreground/20">
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="hourly">Hourly</SelectItem>
                                  <SelectItem value="daily">Daily</SelectItem>
                                  <SelectItem value="weekly">Weekly</SelectItem>
                                  <SelectItem value="monthly">Monthly</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="time">Sync time</Label>
                              <Input id="time" type="time" value="08:00" />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 pt-2">
                            <Switch id="auto-validate" defaultChecked />
                            <Label htmlFor="auto-validate">Auto-validate data from this source</Label>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="mb-2 text-sm font-medium text-foreground">Data transformation</h3>
                        <div className="grid gap-2">
                          <div className="space-y-2">
                            <Label htmlFor="transform-script">Transformation script</Label>
                            <div className="rounded-md bg-muted p-3 font-mono text-sm h-32 overflow-auto">
{`// Example transformation script
function transform(data) {
  return data.map(item => ({
    project_id: item.project_identifier,
    name: item.project_name,
    budget: parseFloat(item.allocated_funds),
    status: mapStatus(item.current_status),
    location: item.geographic_location,
    progress: calculateProgress(item)
  }));
}

function mapStatus(status) {
  const statusMap = {
    "on_hold": "Stalled",
    "delayed": "Delayed",
    "in_progress": "Active"
  };
  return statusMap[status] || "Unknown";
}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setSelectedSource(null)}>
                    Cancel
                  </Button>
                  <Button>Save changes</Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="validation" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-foreground/10 bg-white/90 shadow-sm">
                <CardHeader>
                  <CardTitle>Validation statistics</CardTitle>
                  <CardDescription>Overview of data validation processes and results</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Validated records</span>
                      <span>
                        {dataValidationStats.validated} / {dataValidationStats.totalRecords}
                      </span>
                    </div>
                    <Progress
                      value={(dataValidationStats.validated / dataValidationStats.totalRecords) * 100}
                      className="mt-2 h-2 bg-foreground/10"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="text-sm font-medium text-foreground">Automated validation</div>
                      <div className="mt-2 text-2xl font-semibold text-foreground">
                        {formatNumber(dataValidationStats.automatedValidation)}
                      </div>
                      <div className="text-xs text-muted-foreground">{automatedPercent}% of validated</div>
                      <Progress value={automatedPercent} className="mt-2 h-2 bg-foreground/10" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">Manual validation</div>
                      <div className="mt-2 text-2xl font-semibold text-foreground">
                        {formatNumber(dataValidationStats.manualValidation)}
                      </div>
                      <div className="text-xs text-muted-foreground">{manualPercent}% of validated</div>
                      <Progress value={manualPercent} className="mt-2 h-2 bg-foreground/10" />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-foreground/10 bg-background p-4">
                    <div className="text-sm font-medium text-foreground">Flagged for review</div>
                    <div className="mt-2 text-2xl font-semibold text-foreground">
                      {formatNumber(dataValidationStats.flaggedForReview)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((dataValidationStats.flaggedForReview / dataValidationStats.totalRecords) * 100)}% of
                      total records
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-medium text-foreground">Validation rules</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between rounded-md bg-muted p-2">
                        <div className="flex items-center">
                          <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" />
                          <span>Data source trust score &gt; 90%</span>
                        </div>
                        <Badge>Auto-validate</Badge>
                      </div>
                      <div className="flex items-center justify-between rounded-md bg-muted p-2">
                        <div className="flex items-center">
                          <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                          <span>Citizen reports without evidence</span>
                        </div>
                        <Badge variant="outline">Manual review</Badge>
                      </div>
                      <div className="flex items-center justify-between rounded-md bg-muted p-2">
                        <div className="flex items-center">
                          <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                          <span>Budget discrepancies &gt; 15%</span>
                        </div>
                        <Badge variant="outline">Manual review</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-foreground/10 bg-white/90 shadow-sm">
                <CardHeader>
                  <CardTitle>Records requiring review</CardTitle>
                  <CardDescription>Records flagged for manual validation</CardDescription>
                </CardHeader>
                <CardContent className="max-h-[400px] overflow-auto">
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="rounded-2xl border border-foreground/10 bg-background p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="font-medium text-foreground">
                              {i % 2 === 0 ? "Budget Discrepancy" : "Data Inconsistency"}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {i % 2 === 0
                                ? "Reported budget differs from official records."
                                : "Project status inconsistent across sources."}
                            </p>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {i % 3 === 0 ? "High" : i % 3 === 1 ? "Medium" : "Low"} Priority
                          </Badge>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-muted-foreground">Project:</span>{" "}
                              {i % 2 === 0 ? "Nairobi-Mombasa Highway Expansion" : "Kisumu Water Treatment Plant"}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Source:</span>{" "}
                              {i % 3 === 0
                                ? "Kenya Open Data Portal"
                                : i % 3 === 1
                                  ? "Citizen Report"
                                  : "Auditor General Report"}
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <XCircle className="mr-1 h-4 w-4" />
                            Reject
                          </Button>
                          <Button size="sm">
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Validate
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View all flagged records
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <Card className="border-foreground/10 bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle>Validation rules configuration</CardTitle>
                <CardDescription>Configure automated validation rules and thresholds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="trust-threshold">Trust score threshold (%)</Label>
                    <div className="flex items-center gap-2">
                      <Input id="trust-threshold" type="number" min="0" max="100" defaultValue="90" />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Auto-validate data from sources above this threshold.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget-variance">Budget variance threshold (%)</Label>
                    <div className="flex items-center gap-2">
                      <Input id="budget-variance" type="number" min="0" max="100" defaultValue="15" />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Flag records with budget discrepancies above this threshold.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="min-sources">Minimum corroborating sources</Label>
                    <Input id="min-sources" type="number" min="1" max="10" defaultValue="2" />
                    <p className="text-xs text-muted-foreground">
                      Minimum sources required to auto-validate a record.
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-2 text-sm font-medium text-foreground">Source trust configuration</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Source type</TableHead>
                        <TableHead>Base trust score</TableHead>
                        <TableHead>Auto-validate</TableHead>
                        <TableHead>Requires evidence</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { label: "Government Sources", value: 95, auto: true, evidence: false },
                        { label: "NGO Reports", value: 90, auto: true, evidence: false },
                        { label: "Media Reports", value: 85, auto: false, evidence: true },
                        { label: "Citizen Reports", value: 70, auto: false, evidence: true },
                      ].map((row) => (
                        <TableRow key={row.label}>
                          <TableCell>{row.label}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Input type="number" min="0" max="100" defaultValue={row.value.toString()} className="w-20" />
                              <span className="text-sm text-muted-foreground">%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Switch defaultChecked={row.auto} />
                          </TableCell>
                          <TableCell>
                            <Switch defaultChecked={row.evidence} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save configuration</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card className="border-foreground/10 bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle>Pending citizen reports</CardTitle>
                <CardDescription>Review and validate reports submitted by citizens</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Evidence</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{report.type}</Badge>
                        </TableCell>
                        <TableCell>{report.location}</TableCell>
                        <TableCell>{formatDate(report.date.split("T")[0])}</TableCell>
                        <TableCell>
                          {report.hasEvidence ? (
                            <Badge variant="default" className="bg-emerald-600">
                              Yes
                            </Badge>
                          ) : (
                            <Badge variant="outline">No</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{report.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                            <Button variant="outline" size="sm">
                              <CheckCircle className="h-4 w-4" />
                              <span className="sr-only">Approve</span>
                            </Button>
                            <Button variant="outline" size="sm">
                              <XCircle className="h-4 w-4" />
                              <span className="sr-only">Reject</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="border-foreground/10 bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle>Citizen reporting form</CardTitle>
                <CardDescription>Form used by citizens to submit reports and evidence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-2xl border border-foreground/10 bg-background p-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-foreground">Report a stalled project or corruption</h3>
                      <p className="text-sm text-muted-foreground">
                        Help us track accountability by submitting evidence and information.
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="report-type">Report type</Label>
                        <Select defaultValue="stalled-project">
                          <SelectTrigger id="report-type" className="rounded-full border-foreground/20">
                            <SelectValue placeholder="Select report type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="stalled-project">Stalled project</SelectItem>
                            <SelectItem value="corruption">Corruption report</SelectItem>
                            <SelectItem value="misappropriation">Fund misappropriation</SelectItem>
                            <SelectItem value="other">Other issue</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location/County</Label>
                        <Select defaultValue="nairobi">
                          <SelectTrigger id="location" className="rounded-full border-foreground/20">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="nairobi">Nairobi County</SelectItem>
                            <SelectItem value="mombasa">Mombasa County</SelectItem>
                            <SelectItem value="kisumu">Kisumu County</SelectItem>
                            <SelectItem value="nakuru">Nakuru County</SelectItem>
                            <SelectItem value="other">Other County</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="report-title">Report title</Label>
                      <Input id="report-title" placeholder="Brief title describing the issue" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="report-description">Detailed description</Label>
                      <Textarea
                        id="report-description"
                        className="min-h-[120px]"
                        placeholder="Provide as much detail as possible about the issue..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Evidence upload</Label>
                      <div className="rounded-2xl border-2 border-dashed border-foreground/20 bg-foreground/5 p-6 text-center">
                        <div className="flex flex-col items-center">
                          <FileText className="mb-2 h-8 w-8 text-muted-foreground" />
                          <p className="text-sm font-medium">Drag and drop files here, or click to browse</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Supports images, documents, and videos up to 10MB.
                          </p>
                          <Button variant="outline" size="sm" className="mt-4">
                            Browse files
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="anonymous" />
                        <Label htmlFor="anonymous">Submit anonymously</Label>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Your identity will be protected if you choose to submit anonymously.
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <Button>Submit report</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}
