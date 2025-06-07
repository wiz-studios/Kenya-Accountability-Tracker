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

// Mock data for demonstration
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
    // Simulate sync process
    setTimeout(() => {
      setSyncInProgress(null)
    }, 3000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Data Management</h1>
          <p className="text-muted-foreground">Manage data sources, validation, and citizen reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Database className="w-4 h-4 mr-2" />
            Add Data Source
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Data Sources</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataSources.length}</div>
            <p className="text-xs text-muted-foreground">Active integration points</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataValidationStats.totalRecords.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all sources</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Validation Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((dataValidationStats.validated / dataValidationStats.totalRecords) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Records validated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReports.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sources" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
          <TabsTrigger value="validation">Data Validation</TabsTrigger>
          <TabsTrigger value="reports">Citizen Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connected Data Sources</CardTitle>
              <CardDescription>Manage your data sources and synchronization schedules</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Trust Score</TableHead>
                    <TableHead>Last Sync</TableHead>
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
                          <Progress value={source.trustScore} className="h-2 w-16" />
                        </div>
                      </TableCell>
                      <TableCell>{new Date(source.lastSync).toLocaleString()}</TableCell>
                      <TableCell>{source.recordsImported.toLocaleString()}</TableCell>
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
            <Card>
              <CardHeader>
                <CardTitle>Data Source Details: {selectedSource}</CardTitle>
                <CardDescription>Configuration and synchronization settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Connection Settings</h3>
                      <div className="grid gap-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="endpoint">API Endpoint</Label>
                            <Input id="endpoint" value="https://api.example.com/v1/data" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="auth-type">Authentication Type</Label>
                            <Select defaultValue="api-key">
                              <SelectTrigger id="auth-type">
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
                          <Label htmlFor="api-key">API Key</Label>
                          <Input id="api-key" type="password" value="••••••••••••••••" />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-sm font-medium mb-2">Data Mapping</h3>
                      <div className="grid gap-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="project-field">Project ID Field</Label>
                            <Input id="project-field" value="project_identifier" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="budget-field">Budget Field</Label>
                            <Input id="budget-field" value="allocated_funds" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="status-field">Status Field</Label>
                            <Input id="status-field" value="current_status" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="location-field">Location Field</Label>
                            <Input id="location-field" value="geographic_location" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Synchronization Schedule</h3>
                      <div className="grid gap-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="frequency">Sync Frequency</Label>
                            <Select defaultValue="daily">
                              <SelectTrigger id="frequency">
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
                            <Label htmlFor="time">Sync Time</Label>
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
                      <h3 className="text-sm font-medium mb-2">Data Transformation</h3>
                      <div className="grid gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="transform-script">Transformation Script</Label>
                          <div className="relative">
                            <div className="bg-muted rounded-md p-3 font-mono text-sm h-32 overflow-auto">
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
  // Map source status to our standardized statuses
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
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setSelectedSource(null)}>
                  Cancel
                </Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="validation" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Validation Statistics</CardTitle>
                <CardDescription>Overview of data validation processes and results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Validated Records</span>
                      <span>
                        {dataValidationStats.validated} / {dataValidationStats.totalRecords}
                      </span>
                    </div>
                    <Progress
                      value={(dataValidationStats.validated / dataValidationStats.totalRecords) * 100}
                      className="h-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Validation Method</h3>
                      <div className="flex items-center">
                        <div className="w-16 h-16">
                          <div className="relative w-full h-full">
                            <div
                              className="absolute inset-0 rounded-full border-4 border-primary"
                              style={{
                                clipPath: `polygon(0 0, 100% 0, 100% 100%, 0% 100%)`,
                              }}
                            ></div>
                            <div
                              className="absolute inset-0 rounded-full border-4 border-muted"
                              style={{
                                clipPath: `polygon(0 0, ${
                                  (dataValidationStats.automatedValidation / dataValidationStats.validated) * 100
                                }% 0, ${
                                  (dataValidationStats.automatedValidation / dataValidationStats.validated) * 100
                                }% 100%, 0% 100%)`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                            <span className="text-sm">
                              Automated (
                              {Math.round(
                                (dataValidationStats.automatedValidation / dataValidationStats.validated) * 100,
                              )}
                              %)
                            </span>
                          </div>
                          <div className="flex items-center mt-1">
                            <div className="w-3 h-3 rounded-full bg-muted mr-2"></div>
                            <span className="text-sm">
                              Manual (
                              {Math.round((dataValidationStats.manualValidation / dataValidationStats.validated) * 100)}
                              %)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Flagged Records</h3>
                      <div className="flex items-center">
                        <div className="w-16 h-16 flex items-center justify-center bg-muted rounded-full">
                          <span className="text-2xl font-bold">{dataValidationStats.flaggedForReview}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm">Require manual review</div>
                          <div className="text-xs text-muted-foreground">
                            {Math.round(
                              (dataValidationStats.flaggedForReview / dataValidationStats.totalRecords) * 100,
                            )}
                            % of total records
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Validation Rules</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          <span>Data source trust score &gt; 90%</span>
                        </div>
                        <Badge>Auto-validate</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                          <span>Citizen reports without evidence</span>
                        </div>
                        <Badge variant="outline">Manual review</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                          <span>Budget discrepancies &gt; 15%</span>
                        </div>
                        <Badge variant="outline">Manual review</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Records Requiring Review</CardTitle>
                <CardDescription>Records flagged for manual validation</CardDescription>
              </CardHeader>
              <CardContent className="max-h-[400px] overflow-auto">
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{i % 2 === 0 ? "Budget Discrepancy" : "Data Inconsistency"}</h4>
                          <p className="text-sm text-muted-foreground">
                            {i % 2 === 0
                              ? "Reported budget differs from official records"
                              : "Project status inconsistent across sources"}
                          </p>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {i % 3 === 0 ? "High" : i % 3 === 1 ? "Medium" : "Low"} Priority
                        </Badge>
                      </div>
                      <div className="mt-2 text-sm">
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
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button size="sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Validate
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Flagged Records
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Validation Rules Configuration</CardTitle>
              <CardDescription>Configure automated validation rules and thresholds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trust-threshold">Trust Score Threshold (%)</Label>
                    <div className="flex items-center gap-2">
                      <Input id="trust-threshold" type="number" min="0" max="100" defaultValue="90" />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Auto-validate data from sources above this threshold
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget-variance">Budget Variance Threshold (%)</Label>
                    <div className="flex items-center gap-2">
                      <Input id="budget-variance" type="number" min="0" max="100" defaultValue="15" />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Flag records with budget discrepancies above this threshold
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="min-sources">Minimum Corroborating Sources</Label>
                    <Input id="min-sources" type="number" min="1" max="10" defaultValue="2" />
                    <p className="text-xs text-muted-foreground">Minimum sources required to auto-validate a record</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-2">Source Trust Configuration</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Source Type</TableHead>
                        <TableHead>Base Trust Score</TableHead>
                        <TableHead>Auto-validate</TableHead>
                        <TableHead>Requires Evidence</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Government Sources</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Input type="number" min="0" max="100" defaultValue="95" className="w-20" />
                            <span className="text-sm text-muted-foreground">%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Switch defaultChecked />
                        </TableCell>
                        <TableCell>
                          <Switch />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>NGO Reports</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Input type="number" min="0" max="100" defaultValue="90" className="w-20" />
                            <span className="text-sm text-muted-foreground">%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Switch defaultChecked />
                        </TableCell>
                        <TableCell>
                          <Switch />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Media Reports</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Input type="number" min="0" max="100" defaultValue="85" className="w-20" />
                            <span className="text-sm text-muted-foreground">%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Switch />
                        </TableCell>
                        <TableCell>
                          <Switch defaultChecked />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Citizen Reports</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Input type="number" min="0" max="100" defaultValue="70" className="w-20" />
                            <span className="text-sm text-muted-foreground">%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Switch />
                        </TableCell>
                        <TableCell>
                          <Switch defaultChecked />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Configuration</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Citizen Reports</CardTitle>
              <CardDescription>Review and validate reports submitted by citizens</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Title</TableHead>
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
                      <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {report.hasEvidence ? (
                          <Badge variant="default" className="bg-green-500">
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

          <Card>
            <CardHeader>
              <CardTitle>Citizen Reporting Form</CardTitle>
              <CardDescription>Form used by citizens to submit reports and evidence</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 border rounded-lg">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Report a Stalled Project or Corruption</h3>
                    <p className="text-sm text-muted-foreground">
                      Help us track accountability by submitting evidence and information
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="report-type">Report Type</Label>
                      <Select defaultValue="stalled-project">
                        <SelectTrigger id="report-type">
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="stalled-project">Stalled Project</SelectItem>
                          <SelectItem value="corruption">Corruption Report</SelectItem>
                          <SelectItem value="misappropriation">Fund Misappropriation</SelectItem>
                          <SelectItem value="other">Other Issue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location/County</Label>
                      <Select defaultValue="nairobi">
                        <SelectTrigger id="location">
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
                    <Label htmlFor="report-title">Report Title</Label>
                    <Input id="report-title" placeholder="Brief title describing the issue" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="report-description">Detailed Description</Label>
                    <textarea
                      id="report-description"
                      className="w-full min-h-[100px] p-2 border rounded-md"
                      placeholder="Provide as much detail as possible about the issue..."
                    ></textarea>
                  </div>

                  <div className="space-y-2">
                    <Label>Evidence Upload</Label>
                    <div className="border-2 border-dashed rounded-md p-6 text-center">
                      <div className="flex flex-col items-center">
                        <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">Drag and drop files here, or click to browse</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Supports images, documents, and videos up to 10MB
                        </p>
                        <Button variant="outline" size="sm" className="mt-4">
                          Browse Files
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
                      Your identity will be protected if you choose to submit anonymously
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <Button>Submit Report</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
