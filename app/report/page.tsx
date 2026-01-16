"use client"

import type React from "react"

import { useState } from "react"
import { FileText, MapPin, AlertTriangle, Upload, CheckCircle, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { formatDateTime } from "@/lib/formatters"

export default function CitizenReportingPage() {
  const [reportType, setReportType] = useState("stalled-project")
  const [submitted, setSubmitted] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [reportId, setReportId] = useState<string | null>(null)
  const [submittedAt, setSubmittedAt] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTimeout(() => {
      const id = `KAT-2025-${Math.floor(1000 + Math.random() * 9000)}`
      setReportId(id)
      setSubmittedAt(new Date().toISOString())
      setSubmitted(true)
    }, 1500)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploading(true)
      setTimeout(() => {
        setFiles(Array.from(e.target.files || []))
        setUploading(false)
      }, 1500)
    }
  }

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Card className="border-foreground/10 bg-white/90 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-foreground/10 p-3">
                <CheckCircle className="h-8 w-8 text-foreground" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl">Report submitted successfully</CardTitle>
            <CardDescription className="text-center">
              Thank you for contributing to government accountability.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>What happens next?</AlertTitle>
              <AlertDescription>
                Your report will be reviewed by our team within 48 hours. We may contact you for additional information
                if needed.
              </AlertDescription>
            </Alert>

            <div className="rounded-2xl border border-foreground/10 bg-background p-4">
              <h3 className="font-medium mb-2 text-foreground">Report details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Report ID:</div>
                <div>{reportId}</div>
                <div className="text-muted-foreground">Submitted:</div>
                <div>{submittedAt ? formatDateTime(submittedAt) : "Just now"}</div>
                <div className="text-muted-foreground">Status:</div>
                <div>
                  <Badge>Pending review</Badge>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button className="w-full" onClick={() => setSubmitted(false)}>
              Submit another report
            </Button>
            <Button variant="outline" className="w-full">
              Track your report
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 pt-10 max-w-4xl">
        <div className="rounded-3xl border border-foreground/10 bg-white/80 p-8 text-center shadow-sm">
          <Badge className="bg-foreground text-background">Citizen reporting portal</Badge>
          <h1 className="mt-4 font-display text-3xl text-foreground md:text-4xl">Report stalled projects or misuse</h1>
          <p className="mt-2 text-muted-foreground">
            Help us track accountability by reporting stalled projects, corruption concerns, or leadership misconduct.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 max-w-4xl">
        <Tabs defaultValue="report" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 gap-2 rounded-full bg-foreground/5 p-1 text-foreground/70">
            {[
              { value: "report", label: "Submit report" },
              { value: "guide", label: "Reporting guide" },
              { value: "track", label: "Track reports" },
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

          <TabsContent value="report">
            <Card className="border-foreground/10 bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle>Report a stalled project or corruption</CardTitle>
                <CardDescription>Your information helps us hold leaders accountable and track public resources.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="report-type">What are you reporting?</Label>
                      <Select value={reportType} onValueChange={setReportType}>
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
                          <SelectItem value="uasin-gishu">Uasin Gishu County</SelectItem>
                          <SelectItem value="other">Other County</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Report title</Label>
                    <Input
                      id="title"
                      placeholder={
                        reportType === "stalled-project"
                          ? "e.g., Abandoned Health Center in Nakuru"
                          : "e.g., Misappropriation of Road Construction Funds"
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Detailed description</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide as much detail as possible about the issue..."
                      className="min-h-[150px]"
                      required
                    />
                  </div>

                  {reportType === "stalled-project" && (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="project-start">When did the project start?</Label>
                        <Input id="project-start" type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="project-stalled">When did it stall?</Label>
                        <Input id="project-stalled" type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="project-budget">Estimated/known budget (KSh)</Label>
                        <Input id="project-budget" type="text" placeholder="e.g., 45,000,000" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="project-contractor">Contractor (if known)</Label>
                        <Input id="project-contractor" type="text" placeholder="Name of contractor" />
                      </div>
                    </div>
                  )}

                  {reportType === "corruption" && (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="involved-parties">Parties involved</Label>
                        <Input id="involved-parties" type="text" placeholder="Names of individuals or organizations" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="amount">Estimated amount (KSh)</Label>
                        <Input id="amount" type="text" placeholder="e.g., 10,000,000" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="when-occurred">When did this occur?</Label>
                        <Input id="when-occurred" type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reported-elsewhere">Have you reported this elsewhere?</Label>
                        <Select defaultValue="no">
                          <SelectTrigger id="reported-elsewhere" className="rounded-full border-foreground/20">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no">No</SelectItem>
                            <SelectItem value="police">Police</SelectItem>
                            <SelectItem value="eacc">EACC</SelectItem>
                            <SelectItem value="media">Media</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Evidence upload</Label>
                    <div className="rounded-2xl border-2 border-dashed border-foreground/20 bg-foreground/5 p-6">
                      <div className="flex flex-col items-center">
                        {uploading ? (
                          <div className="flex flex-col items-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-foreground mb-2"></div>
                            <p className="text-sm text-muted-foreground">Uploading...</p>
                          </div>
                        ) : files.length > 0 ? (
                          <div className="w-full">
                            <div className="flex items-center justify-center mb-4">
                              <CheckCircle className="h-8 w-8 text-foreground mr-2" />
                              <span>{files.length} file(s) uploaded</span>
                            </div>
                            <ul className="space-y-2">
                              {Array.from(files).map((file, index) => (
                                <li key={index} className="flex items-center justify-between rounded-xl bg-background p-2">
                                  <div className="flex items-center">
                                    <FileText className="mr-2 h-4 w-4" />
                                    <span className="truncate text-sm max-w-[200px]">{file.name}</span>
                                  </div>
                                  <Badge variant="outline" className="border-foreground/20 text-xs text-foreground">
                                    {(file.size / 1024).toFixed(0)} KB
                                  </Badge>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <>
                            <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                            <p className="text-sm font-medium">Drag and drop files here, or click to browse</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Photos, documents, videos up to 10MB each
                            </p>
                          </>
                        )}
                        <div className="mt-4">
                          <Input id="file-upload" type="file" multiple className="hidden" onChange={handleFileChange} />
                          <Label htmlFor="file-upload" asChild>
                            <Button variant="outline" type="button">
                              {files.length > 0 ? "Upload more files" : "Browse files"}
                            </Button>
                          </Label>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Strong evidence increases the chances of your report being verified and acted upon.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="exact-location" />
                      <Label htmlFor="exact-location">I can provide exact location (GPS coordinates)</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="anonymous" defaultChecked />
                      <Label htmlFor="anonymous">Submit anonymously</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="contact-me" />
                      <div>
                        <Label htmlFor="contact-me">I am willing to be contacted for more information</Label>
                        <p className="text-xs text-muted-foreground">Your contact information will be kept confidential.</p>
                      </div>
                    </div>
                  </div>

                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Important</AlertTitle>
                    <AlertDescription>
                      Ensure your report is factual and evidence-based. False reports may have legal consequences.
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-end">
                    <Button type="submit">Submit report</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guide">
            <Card className="border-foreground/10 bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle>Reporting guide</CardTitle>
                <CardDescription>How to submit effective and impactful reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                  {[
                    {
                      title: "What to report",
                      icon: FileText,
                      items: [
                        "Stalled or abandoned public projects",
                        "Misuse of public funds or resources",
                        "Corruption by public officials",
                        "Procurement irregularities",
                        "Budget discrepancies in public projects",
                      ],
                    },
                    {
                      title: "Evidence needed",
                      icon: AlertTriangle,
                      items: [
                        "Photos of stalled projects",
                        "Documents showing budget allocations",
                        "Copies of contracts or tenders",
                        "Audio/video recordings (where legal)",
                        "Witness statements (anonymized)",
                      ],
                    },
                    {
                      title: "Location details",
                      icon: MapPin,
                      items: [
                        "County and sub-county",
                        "Nearest town or landmark",
                        "GPS coordinates (if possible)",
                        "Road or street name",
                        "Photos showing the location",
                      ],
                    },
                  ].map((section) => (
                    <div key={section.title} className="rounded-2xl border border-foreground/10 bg-background p-4">
                      <div className="flex items-center mb-4">
                        <div className="rounded-full bg-foreground/10 p-2 mr-2">
                          <section.icon className="h-5 w-5 text-foreground" />
                        </div>
                        <h3 className="font-medium text-foreground">{section.title}</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {section.items.map((item) => (
                          <li key={item} className="flex items-start">
                            <CheckCircle className="mr-2 mt-0.5 h-4 w-4 text-foreground" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-foreground/10 bg-background p-6">
                  <h3 className="font-medium mb-4 text-foreground">How we verify reports</h3>
                  <div className="space-y-4">
                    {[
                      {
                        step: "1",
                        title: "Initial review",
                        body: "Our team reviews all submissions within 48 hours to assess credibility and completeness.",
                      },
                      {
                        step: "2",
                        title: "Cross-verification",
                        body: "We check against official records, media reports, and other sources.",
                      },
                      {
                        step: "3",
                        title: "Field verification",
                        body: "For high-priority reports, we may conduct site visits or engage local partners.",
                      },
                      {
                        step: "4",
                        title: "Publication",
                        body: "Verified reports are published on our platform with appropriate trust indicators.",
                      },
                    ].map((step) => (
                      <div key={step.step} className="flex gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/10 text-sm font-medium text-foreground">
                          {step.step}
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Your safety matters</AlertTitle>
                  <AlertDescription>
                    We prioritize whistleblower protection. All reports can be submitted anonymously, and we never
                    share your personal information without consent.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="track">
            <Card className="border-foreground/10 bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle>Track your reports</CardTitle>
                <CardDescription>Check the status of reports you have submitted</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-2xl border border-foreground/10 bg-background p-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground">Enter your report ID</h3>
                    <p className="text-sm text-muted-foreground">
                      You received a report ID when you submitted your report. Enter it below to track its status.
                    </p>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Input placeholder="e.g., KAT-2025-1234" className="flex-1" />
                      <Button>Track report</Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-foreground/10 bg-background p-6">
                  <h3 className="font-medium mb-4 text-foreground">Report status meanings</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Pending Review", desc: "Your report has been received and is awaiting initial review." },
                      { label: "Under Investigation", desc: "We are actively verifying the information you provided." },
                      { label: "Needs More Info", desc: "Additional information or evidence is required." },
                      { label: "Verified", desc: "Your report has been verified and published on our platform." },
                      { label: "Closed", desc: "Report closed due to insufficient evidence or duplication." },
                    ].map((status) => (
                      <div key={status.label} className="flex items-center gap-3">
                        <Badge variant="outline" className="border-foreground/20 text-foreground">
                          {status.label}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{status.desc}</span>
                      </div>
                    ))}
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
