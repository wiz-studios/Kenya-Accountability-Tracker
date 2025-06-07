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

export default function CitizenReportingPage() {
  const [reportType, setReportType] = useState("stalled-project")
  const [submitted, setSubmitted] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true)
    }, 1500)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploading(true)
      // Simulate upload delay
      setTimeout(() => {
        setFiles(Array.from(e.target.files || []))
        setUploading(false)
      }, 1500)
    }
  }

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl">Report Submitted Successfully</CardTitle>
            <CardDescription className="text-center">
              Thank you for contributing to government accountability
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

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Report Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Report ID:</div>
                <div>KAT-2025-{Math.floor(Math.random() * 10000)}</div>
                <div className="text-muted-foreground">Submitted:</div>
                <div>{new Date().toLocaleString()}</div>
                <div className="text-muted-foreground">Status:</div>
                <div>
                  <Badge>Pending Review</Badge>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button className="w-full" onClick={() => setSubmitted(false)}>
              Submit Another Report
            </Button>
            <Button variant="outline" className="w-full">
              Track Your Report
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Citizen Reporting Portal</h1>
        <p className="text-muted-foreground mt-2">
          Help us track accountability by reporting stalled projects or corruption concerns
        </p>
      </div>

      <Tabs defaultValue="report" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="report">Submit Report</TabsTrigger>
          <TabsTrigger value="guide">Reporting Guide</TabsTrigger>
          <TabsTrigger value="track">Track Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="report">
          <Card>
            <CardHeader>
              <CardTitle>Report a Stalled Project or Corruption</CardTitle>
              <CardDescription>
                Your information helps us hold leaders accountable and track public resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="report-type">What are you reporting?</Label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger id="report-type">
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stalled-project">Stalled Project</SelectItem>
                        <SelectItem value="corruption">Corruption or Misuse of Funds</SelectItem>
                        <SelectItem value="leader">Leader Misconduct</SelectItem>
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
                        <SelectItem value="uasin-gishu">Uasin Gishu County</SelectItem>
                        <SelectItem value="other">Other County</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Report Title</Label>
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
                  <Label htmlFor="description">Detailed Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide as much detail as possible about the issue..."
                    className="min-h-[150px]"
                    required
                  />
                </div>

                {reportType === "stalled-project" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="project-start">When did the project start?</Label>
                      <Input id="project-start" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-stalled">When did it stall?</Label>
                      <Input id="project-stalled" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-budget">Estimated/Known Budget (KSh)</Label>
                      <Input id="project-budget" type="text" placeholder="e.g., 45,000,000" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-contractor">Contractor (if known)</Label>
                      <Input id="project-contractor" type="text" placeholder="Name of contractor" />
                    </div>
                  </div>
                )}

                {reportType === "corruption" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="involved-parties">Parties Involved</Label>
                      <Input id="involved-parties" type="text" placeholder="Names of individuals or organizations" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Estimated Amount (KSh)</Label>
                      <Input id="amount" type="text" placeholder="e.g., 10,000,000" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="when-occurred">When did this occur?</Label>
                      <Input id="when-occurred" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reported-elsewhere">Have you reported this elsewhere?</Label>
                      <Select defaultValue="no">
                        <SelectTrigger id="reported-elsewhere">
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
                  <Label>Evidence Upload</Label>
                  <div className="border-2 border-dashed rounded-md p-6">
                    <div className="flex flex-col items-center">
                      {uploading ? (
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                          <p className="text-sm">Uploading...</p>
                        </div>
                      ) : files.length > 0 ? (
                        <div className="w-full">
                          <div className="flex items-center justify-center mb-4">
                            <CheckCircle className="h-8 w-8 text-green-600 mr-2" />
                            <span>{files.length} file(s) uploaded</span>
                          </div>
                          <ul className="space-y-2">
                            {Array.from(files).map((file, index) => (
                              <li key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                                <div className="flex items-center">
                                  <FileText className="h-4 w-4 mr-2" />
                                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                                </div>
                                <Badge variant="outline">{(file.size / 1024).toFixed(0)} KB</Badge>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm font-medium">Drag and drop files here, or click to browse</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Photos, documents, videos up to 10MB each
                          </p>
                        </>
                      )}
                      <div className="mt-4">
                        <Input id="file-upload" type="file" multiple className="hidden" onChange={handleFileChange} />
                        <Label htmlFor="file-upload" asChild>
                          <Button variant="outline" type="button">
                            {files.length > 0 ? "Upload More Files" : "Browse Files"}
                          </Button>
                        </Label>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Strong evidence increases the chances of your report being verified and acted upon
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
                      <Label htmlFor="contact-me">I'm willing to be contacted for more information</Label>
                      <p className="text-xs text-muted-foreground">
                        Your contact information will be kept confidential
                      </p>
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
                  <Button type="submit">Submit Report</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guide">
          <Card>
            <CardHeader>
              <CardTitle>Reporting Guide</CardTitle>
              <CardDescription>How to submit effective and impactful reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <div className="rounded-full bg-primary/10 p-2 mr-2">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-medium">What to Report</h3>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Stalled or abandoned public projects</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Misuse of public funds or resources</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Corruption by public officials</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Procurement irregularities</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Budget discrepancies in public projects</span>
                    </li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <div className="rounded-full bg-primary/10 p-2 mr-2">
                      <AlertTriangle className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-medium">Evidence Needed</h3>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Photos of stalled projects</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Documents showing budget allocations</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Copies of contracts or tenders</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Audio/video recordings (where legal)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Witness statements (anonymized)</span>
                    </li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <div className="rounded-full bg-primary/10 p-2 mr-2">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-medium">Location Details</h3>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>County and sub-county</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Nearest town or landmark</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>GPS coordinates (if possible)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Road or street name</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Photos showing the location</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="font-medium mb-4">How We Verify Reports</h3>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="rounded-full bg-muted h-8 w-8 flex items-center justify-center mr-3">
                      <span className="font-medium">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Initial Review</h4>
                      <p className="text-sm text-muted-foreground">
                        Our team reviews all submissions within 48 hours to assess credibility and completeness
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="rounded-full bg-muted h-8 w-8 flex items-center justify-center mr-3">
                      <span className="font-medium">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Cross-Verification</h4>
                      <p className="text-sm text-muted-foreground">
                        We check against official records, media reports, and other sources
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="rounded-full bg-muted h-8 w-8 flex items-center justify-center mr-3">
                      <span className="font-medium">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Field Verification</h4>
                      <p className="text-sm text-muted-foreground">
                        For high-priority reports, we may conduct site visits or engage local partners
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="rounded-full bg-muted h-8 w-8 flex items-center justify-center mr-3">
                      <span className="font-medium">4</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Publication</h4>
                      <p className="text-sm text-muted-foreground">
                        Verified reports are published on our platform with appropriate trust indicators
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Your Safety Matters</AlertTitle>
                <AlertDescription>
                  We prioritize whistleblower protection. All reports can be submitted anonymously, and we never share
                  your personal information without consent.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="track">
          <Card>
            <CardHeader>
              <CardTitle>Track Your Reports</CardTitle>
              <CardDescription>Check the status of reports you've submitted</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-lg p-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Enter Your Report ID</h3>
                  <p className="text-sm text-muted-foreground">
                    You received a report ID when you submitted your report. Enter it below to track its status.
                  </p>
                  <div className="flex gap-2">
                    <Input placeholder="e.g., KAT-2025-1234" className="flex-1" />
                    <Button>Track Report</Button>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="font-medium mb-4">Report Status Meanings</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Badge className="mr-3">Pending Review</Badge>
                    <span className="text-sm">Your report has been received and is awaiting initial review</span>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="secondary" className="mr-3">
                      Under Investigation
                    </Badge>
                    <span className="text-sm">We are actively verifying the information you provided</span>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-3">
                      Needs More Info
                    </Badge>
                    <span className="text-sm">Additional information or evidence is required</span>
                  </div>
                  <div className="flex items-center">
                    <Badge className="bg-green-600 mr-3">Verified</Badge>
                    <span className="text-sm">Your report has been verified and published on our platform</span>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="destructive" className="mr-3">
                      Closed
                    </Badge>
                    <span className="text-sm">Report closed due to insufficient evidence or duplication</span>
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
