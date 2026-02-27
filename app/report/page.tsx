"use client"

import { ChangeEvent, FormEvent, useState } from "react"
import { AlertTriangle, CheckCircle, FileText, Info, MapPin, Search, Upload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { formatDateTime } from "@/lib/formatters"
import type { Report, ReportEvidence, ReportStatusEvent } from "@/lib/types"

type FormState = {
  reportType: string
  county: string
  title: string
  description: string
  projectName: string
  involvedParties: string
  estimatedAmount: string
  occurredOn: string
  reportedElsewhere: string
  isAnonymous: boolean
  allowContact: boolean
  submitterName: string
  submitterEmail: string
  submitterPhone: string
}

const initialFormState: FormState = {
  reportType: "stalled-project",
  county: "Nairobi",
  title: "",
  description: "",
  projectName: "",
  involvedParties: "",
  estimatedAmount: "",
  occurredOn: "",
  reportedElsewhere: "no",
  isAnonymous: true,
  allowContact: false,
  submitterName: "",
  submitterEmail: "",
  submitterPhone: "",
}

export default function CitizenReportingPage() {
  const [form, setForm] = useState<FormState>(initialFormState)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submittedReport, setSubmittedReport] = useState<Report | null>(null)
  const [trackId, setTrackId] = useState("")
  const [trackedReport, setTrackedReport] = useState<Report | null>(null)
  const [trackedEvidence, setTrackedEvidence] = useState<ReportEvidence[]>([])
  const [trackedTimeline, setTrackedTimeline] = useState<ReportStatusEvent[]>([])
  const [trackError, setTrackError] = useState<string | null>(null)
  const [trackNotice, setTrackNotice] = useState<string | null>(null)
  const [tracking, setTracking] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])
  const [attachmentWarning, setAttachmentWarning] = useState<string | null>(null)

  const onFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setAttachments(files)
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setSubmitError(null)
    setAttachmentWarning(null)
    setSubmittedReport(null)

    try {
      const payload = {
        reportType: form.reportType,
        title: form.title,
        description: form.description,
        county: form.county,
        projectName: form.projectName || null,
        involvedParties: form.involvedParties || null,
        estimatedAmount: form.estimatedAmount ? Number(form.estimatedAmount) : null,
        occurredOn: form.occurredOn || null,
        reportedElsewhere: form.reportedElsewhere || null,
        isAnonymous: form.isAnonymous,
        allowContact: form.allowContact,
        submitterName: form.isAnonymous ? null : form.submitterName || null,
        submitterEmail: form.isAnonymous ? null : form.submitterEmail || null,
        submitterPhone: form.isAnonymous ? null : form.submitterPhone || null,
      }

      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const body = await res.json()
      if (!res.ok || !body.data) {
        throw new Error(body.error || `Failed to submit report (${res.status})`)
      }
      const uploadToken = typeof body.uploadToken === "string" ? body.uploadToken : null
      if (attachments.length > 0) {
        if (!uploadToken) {
          setAttachmentWarning("Attachments were skipped because the evidence upload token was not issued.")
        } else {
          let failedUploads = 0
          for (const file of attachments) {
            const evidenceFormData = new FormData()
            evidenceFormData.append("file", file)
            evidenceFormData.append("label", file.name)

            const evidenceRes = await fetch(`/api/reports/${encodeURIComponent(body.data.publicId)}/evidence`, {
              method: "POST",
              headers: {
                "x-report-upload-token": uploadToken,
              },
              body: evidenceFormData,
            })
            if (!evidenceRes.ok) {
              failedUploads += 1
            }
          }
          if (failedUploads > 0) {
            setAttachmentWarning(`${failedUploads} attachment(s) failed to upload.`)
          }
        }
      }
      setSubmittedReport(body.data)
      setForm(initialFormState)
      setAttachments([])
      setTrackId(body.data.publicId)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not submit report")
    } finally {
      setSubmitting(false)
    }
  }

  const onTrack = async () => {
    if (!trackId.trim()) return
    setTracking(true)
    setTrackError(null)
    setTrackNotice(null)
    setTrackedReport(null)
    setTrackedEvidence([])
    setTrackedTimeline([])
    try {
      const res = await fetch(`/api/reports/${encodeURIComponent(trackId.trim())}`)
      const body = await res.json()
      if (!res.ok || !body.data) {
        throw new Error(body.error || `Could not find report (${res.status})`)
      }
      setTrackedReport(body.data)

      const [evidenceRes, timelineRes] = await Promise.all([
        fetch(`/api/reports/${encodeURIComponent(trackId.trim())}/evidence`),
        fetch(`/api/reports/${encodeURIComponent(trackId.trim())}/timeline`),
      ])
      const [evidenceBody, timelineBody] = await Promise.all([evidenceRes.json(), timelineRes.json()])
      if (evidenceRes.ok && Array.isArray(evidenceBody.data)) {
        setTrackedEvidence(evidenceBody.data)
      }
      if (timelineRes.ok && Array.isArray(timelineBody.data)) {
        setTrackedTimeline(timelineBody.data)
      }
      if (
        evidenceRes.status === 401 ||
        evidenceRes.status === 403 ||
        timelineRes.status === 401 ||
        timelineRes.status === 403
      ) {
        setTrackNotice("Evidence files and internal timeline are reviewer-only.")
      }
    } catch (error) {
      setTrackError(error instanceof Error ? error.message : "Could not track report")
    } finally {
      setTracking(false)
    }
  }

  return (
    <div className="min-h-screen">
      <section className="container mx-auto max-w-4xl px-4 pt-10">
        <div className="rounded-3xl border border-foreground/10 bg-white/80 p-8 text-center shadow-sm">
          <Badge className="bg-foreground text-background">Citizen reporting portal</Badge>
          <h1 className="mt-4 font-display text-3xl text-foreground md:text-4xl">Report stalled projects or misuse</h1>
          <p className="mt-2 text-muted-foreground">
            Submit evidence-backed accountability reports. Each submission is assigned a trackable public ID.
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-4xl px-4 py-8">
        <Tabs defaultValue="report" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 gap-2 rounded-full bg-foreground/5 p-1 text-foreground/70">
            <TabsTrigger
              value="report"
              className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background"
            >
              Submit report
            </TabsTrigger>
            <TabsTrigger
              value="guide"
              className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background"
            >
              Reporting guide
            </TabsTrigger>
            <TabsTrigger
              value="track"
              className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background"
            >
              Track reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="report">
            <Card className="border-foreground/10 bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle>Submit accountability report</CardTitle>
                <CardDescription>Reports are ingested directly into the KAT review queue.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="report-type">Report type</Label>
                      <Select
                        value={form.reportType}
                        onValueChange={(value) => setForm((prev) => ({ ...prev, reportType: value }))}
                      >
                        <SelectTrigger id="report-type" className="rounded-full border-foreground/20">
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="stalled-project">Stalled project</SelectItem>
                          <SelectItem value="corruption">Corruption or misuse of funds</SelectItem>
                          <SelectItem value="leader">Leader misconduct</SelectItem>
                          <SelectItem value="other">Other issue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="county">County</Label>
                      <Select value={form.county} onValueChange={(value) => setForm((prev) => ({ ...prev, county: value }))}>
                        <SelectTrigger id="county" className="rounded-full border-foreground/20">
                          <SelectValue placeholder="Select county" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Nairobi">Nairobi</SelectItem>
                          <SelectItem value="Mombasa">Mombasa</SelectItem>
                          <SelectItem value="Kisumu">Kisumu</SelectItem>
                          <SelectItem value="Nakuru">Nakuru</SelectItem>
                          <SelectItem value="Machakos">Machakos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="attachments">Evidence attachments</Label>
                    <Input id="attachments" type="file" multiple onChange={onFilesChange} />
                    <p className="text-xs text-muted-foreground">
                      Attach photos or documents. Files upload after report creation.
                    </p>
                    {attachments.length > 0 && (
                      <div className="rounded-xl border border-foreground/10 bg-background p-3 text-sm">
                        {attachments.length} file(s) selected for upload.
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Report title</Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                      placeholder="Brief title of the issue"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Detailed description</Label>
                    <Textarea
                      id="description"
                      value={form.description}
                      onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                      className="min-h-[150px]"
                      placeholder="Provide full context, timeline, and observed impact..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="project-name">Project name (if known)</Label>
                      <Input
                        id="project-name"
                        value={form.projectName}
                        onChange={(event) => setForm((prev) => ({ ...prev, projectName: event.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="involved-parties">Involved parties (if known)</Label>
                      <Input
                        id="involved-parties"
                        value={form.involvedParties}
                        onChange={(event) => setForm((prev) => ({ ...prev, involvedParties: event.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estimated-amount">Estimated amount (KSh)</Label>
                      <Input
                        id="estimated-amount"
                        type="number"
                        min={0}
                        value={form.estimatedAmount}
                        onChange={(event) => setForm((prev) => ({ ...prev, estimatedAmount: event.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="occurred-on">Date occurred</Label>
                      <Input
                        id="occurred-on"
                        type="date"
                        value={form.occurredOn}
                        onChange={(event) => setForm((prev) => ({ ...prev, occurredOn: event.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="anonymous"
                        checked={form.isAnonymous}
                        onCheckedChange={(value) => setForm((prev) => ({ ...prev, isAnonymous: value }))}
                      />
                      <Label htmlFor="anonymous">Submit anonymously</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="contact-me"
                        checked={form.allowContact}
                        onCheckedChange={(value) => setForm((prev) => ({ ...prev, allowContact: value }))}
                      />
                      <Label htmlFor="contact-me">I am willing to be contacted</Label>
                    </div>
                  </div>

                  {!form.isAnonymous && (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="submitter-name">Name</Label>
                        <Input
                          id="submitter-name"
                          value={form.submitterName}
                          onChange={(event) => setForm((prev) => ({ ...prev, submitterName: event.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="submitter-email">Email</Label>
                        <Input
                          id="submitter-email"
                          type="email"
                          value={form.submitterEmail}
                          onChange={(event) => setForm((prev) => ({ ...prev, submitterEmail: event.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="submitter-phone">Phone</Label>
                        <Input
                          id="submitter-phone"
                          value={form.submitterPhone}
                          onChange={(event) => setForm((prev) => ({ ...prev, submitterPhone: event.target.value }))}
                        />
                      </div>
                    </div>
                  )}

                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Important</AlertTitle>
                    <AlertDescription>
                      Submit factual, evidence-based information. False reports may have legal consequences.
                    </AlertDescription>
                  </Alert>

                  {submitError && (
                    <div className="rounded-2xl border border-rose-300/60 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                      {submitError}
                    </div>
                  )}

                  {submittedReport && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>Report submitted</AlertTitle>
                      <AlertDescription>
                        Report ID <strong>{submittedReport.publicId}</strong> created at{" "}
                        {formatDateTime(submittedReport.insertedAt)}.
                      </AlertDescription>
                    </Alert>
                  )}
                  {attachmentWarning && (
                    <div className="rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                      {attachmentWarning}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button type="submit" disabled={submitting}>
                      {submitting ? "Submitting..." : "Submit report"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guide">
            <Card className="border-foreground/10 bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle>Reporting guide</CardTitle>
                <CardDescription>How to submit high-confidence and actionable reports.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="rounded-2xl border border-foreground/10 bg-background p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-foreground" />
                      <h3 className="font-medium text-foreground">What to report</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>Stalled or abandoned projects</li>
                      <li>Budget misuse and fund diversion</li>
                      <li>Procurement irregularities</li>
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-foreground/10 bg-background p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-foreground" />
                      <h3 className="font-medium text-foreground">Evidence</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>Site photos and timelines</li>
                      <li>Budget documents where available</li>
                      <li>Multiple corroborating signals</li>
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-foreground/10 bg-background p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-foreground" />
                      <h3 className="font-medium text-foreground">Location details</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>County and nearest constituency</li>
                      <li>Landmark or GPS coordinates</li>
                      <li>Approximate timeline</li>
                    </ul>
                  </div>
                </div>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Whistleblower protection</AlertTitle>
                  <AlertDescription>
                    Anonymous submissions are supported and personally identifying data is optional.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="track">
            <Card className="border-foreground/10 bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle>Track your reports</CardTitle>
                <CardDescription>Enter a report ID (for example `KAT-2026-AB12CD34`).</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-2xl border border-foreground/10 bg-background p-6">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input value={trackId} onChange={(event) => setTrackId(event.target.value)} placeholder="Report ID" />
                    <Button onClick={onTrack} disabled={tracking}>
                      <Search className="mr-2 h-4 w-4" />
                      {tracking ? "Tracking..." : "Track report"}
                    </Button>
                  </div>
                </div>

                {trackError && (
                  <div className="rounded-2xl border border-rose-300/60 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {trackError}
                  </div>
                )}
                {trackNotice && (
                  <div className="rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    {trackNotice}
                  </div>
                )}

                {trackedReport && (
                  <div className="rounded-2xl border border-foreground/10 bg-background p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-medium text-foreground">{trackedReport.title}</h3>
                        <p className="text-sm text-muted-foreground">{trackedReport.county}</p>
                      </div>
                      <Badge>{trackedReport.status}</Badge>
                    </div>
                    <div className="mt-4 grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Report ID</span>
                        <span>{trackedReport.publicId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Confidence score</span>
                        <span>{trackedReport.confidenceScore}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Submitted</span>
                        <span>{formatDateTime(trackedReport.insertedAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last updated</span>
                        <span>{formatDateTime(trackedReport.updatedAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Evidence files</span>
                        <span>{trackedEvidence.length}</span>
                      </div>
                    </div>
                    {trackedEvidence.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {trackedEvidence.map((evidence) => (
                          <div
                            key={evidence.id}
                            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-foreground/10 bg-white p-3 text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <Upload className="h-4 w-4 text-muted-foreground" />
                              <span>{evidence.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{evidence.verificationState}</Badge>
                              {evidence.fileUrl && (
                                <a
                                  href={evidence.fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs text-foreground underline"
                                >
                                  Open
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {trackedTimeline.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h4 className="text-sm font-medium text-foreground">Status timeline</h4>
                        {trackedTimeline.map((event) => (
                          <div key={event.id} className="rounded-xl border border-foreground/10 bg-white p-3 text-xs">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-medium text-foreground">
                                {event.fromStatus ? `${event.fromStatus} -> ${event.toStatus}` : event.toStatus}
                              </span>
                              <span className="text-muted-foreground">{formatDateTime(event.insertedAt)}</span>
                            </div>
                            <div className="mt-1 text-muted-foreground">
                              {event.note || "No note"}
                              {event.changedBy ? ` - by ${event.changedBy}` : ""}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}
