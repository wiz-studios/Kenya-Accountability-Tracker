"use client"

import { useEffect, useMemo, useState } from "react"
import { CheckCircle, Database, FileText, Filter, RefreshCw, Search, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminAuthGate } from "@/components/admin-auth-gate"
import { formatDateTime, formatNumber } from "@/lib/formatters"
import type { DataSource, Report, ReportEvidence, ReportStatusEvent } from "@/lib/types"

type DataManagementContentProps = {
  accessToken: string
  reviewerLabel: string
}

function DataManagementContent({ accessToken, reviewerLabel }: DataManagementContentProps) {
  const [sources, setSources] = useState<DataSource[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reviewBusyId, setReviewBusyId] = useState<string | null>(null)
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)
  const [reportEvidence, setReportEvidence] = useState<ReportEvidence[]>([])
  const [reportTimeline, setReportTimeline] = useState<ReportStatusEvent[]>([])
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [evidenceBusyId, setEvidenceBusyId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const sourceQuery = new URLSearchParams({
        q: search,
        status: statusFilter === "all" ? "" : statusFilter,
        limit: "1000",
      })
      const reportQuery = new URLSearchParams({ limit: "1000" })
      if (statusFilter !== "all") {
        const mappedStatus =
          statusFilter === "active"
            ? "Pending Review"
            : statusFilter === "pending"
              ? "Under Investigation"
              : statusFilter === "inactive"
                ? "Closed"
                : ""
        if (mappedStatus) reportQuery.set("status", mappedStatus)
      }

      const [sourcesRes, reportsRes] = await Promise.all([
        fetch(`/api/sources?${sourceQuery.toString()}`),
        fetch(`/api/reports?${reportQuery.toString()}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      ])
      const [sourcesBody, reportsBody] = await Promise.all([sourcesRes.json(), reportsRes.json()])

      if (!sourcesRes.ok) throw new Error(sourcesBody.error || `Failed to load sources (${sourcesRes.status})`)
      if (!reportsRes.ok) throw new Error(reportsBody.error || `Failed to load reports (${reportsRes.status})`)

      setSources(Array.isArray(sourcesBody.data) ? sourcesBody.data : [])
      setReports(Array.isArray(reportsBody.data) ? reportsBody.data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data operations")
      setSources([])
      setReports([])
    } finally {
      setLoading(false)
    }
  }

  const loadReportDetails = async (publicId: string) => {
    setDetailsLoading(true)
    try {
      const [evidenceRes, timelineRes] = await Promise.all([
        fetch(`/api/reports/${encodeURIComponent(publicId)}/evidence`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        fetch(`/api/reports/${encodeURIComponent(publicId)}/timeline`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      ])
      const [evidenceBody, timelineBody] = await Promise.all([evidenceRes.json(), timelineRes.json()])

      if (!evidenceRes.ok) throw new Error(evidenceBody.error || `Failed to load evidence (${evidenceRes.status})`)
      if (!timelineRes.ok) throw new Error(timelineBody.error || `Failed to load timeline (${timelineRes.status})`)

      setReportEvidence(Array.isArray(evidenceBody.data) ? evidenceBody.data : [])
      setReportTimeline(Array.isArray(timelineBody.data) ? timelineBody.data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load report details")
      setReportEvidence([])
      setReportTimeline([])
    } finally {
      setDetailsLoading(false)
    }
  }

  const handleReviewAction = async (
    publicId: string,
    status: "Pending Review" | "Under Investigation" | "Needs More Info" | "Verified" | "Closed",
  ) => {
    setReviewBusyId(publicId)
    setError(null)
    try {
      const res = await fetch(`/api/reports/${encodeURIComponent(publicId)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          status,
          verificationNotes: `Status updated via admin action to '${status}'.`,
        }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || `Failed to update report (${res.status})`)
      await load()
      if (selectedReportId === publicId) {
        await loadReportDetails(publicId)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update report")
    } finally {
      setReviewBusyId(null)
    }
  }

  const handleEvidenceAction = async (
    publicId: string,
    evidenceId: string,
    verificationState: "verified" | "rejected" | "unverified",
  ) => {
    setEvidenceBusyId(evidenceId)
    setError(null)
    try {
      const res = await fetch(
        `/api/reports/${encodeURIComponent(publicId)}/evidence/${encodeURIComponent(evidenceId)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            verificationState,
            note: `Evidence marked as '${verificationState}' via admin moderation by ${reviewerLabel}.`,
          }),
        },
      )
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || `Failed to update evidence (${res.status})`)
      await loadReportDetails(publicId)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update evidence")
    } finally {
      setEvidenceBusyId(null)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter, accessToken])

  useEffect(() => {
    if (!selectedReportId) return
    const exists = reports.some((report) => report.publicId === selectedReportId)
    if (!exists) {
      setSelectedReportId(null)
      setReportEvidence([])
      setReportTimeline([])
    }
  }, [reports, selectedReportId])

  const stats = useMemo(() => {
    const totalRecords = sources.reduce((sum, source) => sum + source.recordsCount, 0)
    const avgTrust = Math.round(sources.reduce((sum, source) => sum + source.trustScore, 0) / sources.length || 0)
    const pendingReports = reports.filter((report) => report.status === "Pending Review").length
    return { totalRecords, avgTrust, pendingReports }
  }, [sources, reports])

  const selectedReport = useMemo(
    () => reports.find((report) => report.publicId === selectedReportId) || null,
    [reports, selectedReportId],
  )

  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 pt-10">
        <div className="rounded-3xl border border-foreground/10 bg-white/80 p-8 shadow-sm">
          <Badge className="bg-foreground text-background">Data operations</Badge>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <h1 className="font-display text-3xl text-foreground md:text-4xl">Data Management</h1>
              <p className="max-w-2xl text-muted-foreground">
                Live operational view for data sources and citizen-report workflow.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={load} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button>
                <Database className="mr-2 h-4 w-4" />
                Add data source
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
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Data sources", value: sources.length, icon: Database },
            { label: "Total records", value: formatNumber(stats.totalRecords), icon: FileText },
            { label: "Avg trust score", value: `${stats.avgTrust}%`, icon: Shield },
            { label: "Pending reports", value: stats.pendingReports, icon: CheckCircle },
          ].map((metric) => (
            <Card key={metric.label} className="border-foreground/10 bg-white/90 shadow-sm">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-foreground/5">
                  <metric.icon className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <div className="text-xl font-semibold text-foreground">{loading ? "..." : metric.value}</div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">{metric.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-12">
        <Card className="mb-6 border-foreground/10 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Operations filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-10"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Find source or report context"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Status
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="rounded-full border-foreground/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active / Pending</SelectItem>
                    <SelectItem value="pending">Investigating</SelectItem>
                    <SelectItem value="inactive">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="sources" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 gap-2 rounded-full bg-foreground/5 p-1 text-foreground/70">
            <TabsTrigger
              value="sources"
              className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background"
            >
              Sources
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background"
            >
              Citizen reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sources">
            <Card className="border-foreground/10 bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle>Connected data sources</CardTitle>
                <CardDescription>Operational view of reliability and freshness.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Trust</TableHead>
                      <TableHead>Records</TableHead>
                      <TableHead>Last update</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sources.map((source) => (
                      <TableRow key={source.id}>
                        <TableCell className="font-medium">{source.name}</TableCell>
                        <TableCell>{source.type}</TableCell>
                        <TableCell>
                          <Badge variant={source.status === "active" ? "default" : "secondary"}>{source.status}</Badge>
                        </TableCell>
                        <TableCell>{source.trustScore}%</TableCell>
                        <TableCell>{formatNumber(source.recordsCount)}</TableCell>
                        <TableCell>{source.lastUpdate ? formatDateTime(`${source.lastUpdate}T00:00:00Z`) : "Unknown"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card className="border-foreground/10 bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle>Citizen report queue</CardTitle>
                <CardDescription>Submitted reports with verification signals.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>County</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.publicId}</TableCell>
                        <TableCell>{report.title}</TableCell>
                        <TableCell>{report.county}</TableCell>
                        <TableCell>
                          <Badge variant={report.status === "Pending Review" ? "secondary" : "outline"}>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{report.confidenceScore}%</TableCell>
                        <TableCell>{formatDateTime(report.insertedAt)}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant={selectedReportId === report.publicId ? "default" : "outline"}
                              size="sm"
                              onClick={async () => {
                                setSelectedReportId(report.publicId)
                                await loadReportDetails(report.publicId)
                              }}
                            >
                              Review
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={reviewBusyId === report.publicId}
                              onClick={() => handleReviewAction(report.publicId, "Verified")}
                            >
                              Verify
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={reviewBusyId === report.publicId}
                              onClick={() => handleReviewAction(report.publicId, "Needs More Info")}
                            >
                              Needs info
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={reviewBusyId === report.publicId}
                              onClick={() => handleReviewAction(report.publicId, "Closed")}
                            >
                              Close
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {selectedReport && (
              <Card className="mt-6 border-foreground/10 bg-white/90 shadow-sm">
                <CardHeader>
                  <CardTitle>Moderation workspace: {selectedReport.publicId}</CardTitle>
                  <CardDescription>
                    Evidence review and audit timeline for {selectedReport.title}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {detailsLoading ? (
                    <div className="text-sm text-muted-foreground">Loading moderation details...</div>
                  ) : (
                    <>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl border border-foreground/10 bg-background p-4">
                          <h4 className="mb-3 text-sm font-medium text-foreground">Evidence ({reportEvidence.length})</h4>
                          {reportEvidence.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No evidence attached.</p>
                          ) : (
                            <div className="space-y-3">
                              {reportEvidence.map((evidence) => (
                                <div
                                  key={evidence.id}
                                  className="rounded-xl border border-foreground/10 bg-white p-3 text-sm"
                                >
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="font-medium text-foreground">{evidence.label}</div>
                                    <Badge variant="outline">{evidence.verificationState}</Badge>
                                  </div>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      disabled={evidenceBusyId === evidence.id}
                                      onClick={() =>
                                        handleEvidenceAction(selectedReport.publicId, evidence.id, "verified")
                                      }
                                    >
                                      Verify
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      disabled={evidenceBusyId === evidence.id}
                                      onClick={() =>
                                        handleEvidenceAction(selectedReport.publicId, evidence.id, "rejected")
                                      }
                                    >
                                      Reject
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      disabled={evidenceBusyId === evidence.id}
                                      onClick={() =>
                                        handleEvidenceAction(selectedReport.publicId, evidence.id, "unverified")
                                      }
                                    >
                                      Reset
                                    </Button>
                                    {evidence.fileUrl && (
                                      <Button variant="outline" size="sm" asChild>
                                        <a href={evidence.fileUrl} target="_blank" rel="noreferrer">
                                          Open
                                        </a>
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="rounded-2xl border border-foreground/10 bg-background p-4">
                          <h4 className="mb-3 text-sm font-medium text-foreground">Audit trail ({reportTimeline.length})</h4>
                          {reportTimeline.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No timeline events available.</p>
                          ) : (
                            <div className="space-y-3">
                              {reportTimeline.map((event) => (
                                <div key={event.id} className="rounded-xl border border-foreground/10 bg-white p-3 text-sm">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="font-medium text-foreground">
                                      {event.fromStatus ? `${event.fromStatus} -> ${event.toStatus}` : event.toStatus}
                                    </div>
                                    <span className="text-xs text-muted-foreground">{formatDateTime(event.insertedAt)}</span>
                                  </div>
                                  <p className="mt-1 text-xs text-muted-foreground">
                                    {event.note || "No note"}
                                    {event.changedBy ? ` - by ${event.changedBy}` : ""}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}

export default function DataManagementDashboard() {
  return (
    <AdminAuthGate title="Data Management">
      {({ accessToken, reviewerLabel }) => (
        <DataManagementContent accessToken={accessToken} reviewerLabel={reviewerLabel} />
      )}
    </AdminAuthGate>
  )
}
