"use client"

import { useState } from "react"
import {
  ArrowLeft,
  AlertTriangle,
  Building,
  Calendar,
  DollarSign,
  ExternalLink,
  FileText,
  Flag,
  MapPin,
  Share2,
  User,
  Users,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { formatDate, formatYear } from "@/lib/formatters"

const projectDetail = {
  id: 1,
  name: "Nairobi BRT System Phase 1",
  description:
    "The Nairobi Bus Rapid Transit (BRT) system is designed to be a comprehensive public transportation solution connecting major corridors across the city. Phase 1 covers the route from Thika Road to Ngong Road, featuring dedicated bus lanes, modern stations with digital displays, and integration with existing transport systems. The project aims to reduce traffic congestion, improve air quality, and provide affordable, efficient public transport to over 300,000 daily commuters.",
  county: "Nairobi",
  constituency: "Westlands",
  sector: "Transport",
  budget: 45200000000,
  spent: 12800000000,
  status: "Stalled",
  startDate: "2019-03-15",
  expectedCompletion: "2022-12-31",
  actualStatus: "28% Complete",
  progress: 28,
  contractor: "China Communications Construction Company",
  supervisor: "Kenya National Highways Authority (KeNHA)",
  financier: "World Bank & Government of Kenya",
  issues: ["Contractor disputes", "Environmental concerns", "Budget overruns", "Land acquisition delays"],
  lastUpdate: "2025-05-15",
  source: "Ministry of Transport",
  urgency: "high",
  mp: "Hon. Timothy Wanyonyi",
  governor: "Johnson Sakaja",
  timeline: [
    {
      date: "2019-03-15",
      event: "Project Launch",
      status: "completed",
      description: "Official groundbreaking ceremony held",
    },
    {
      date: "2019-06-20",
      event: "Environmental Assessment",
      status: "completed",
      description: "EIA completed and approved",
    },
    {
      date: "2020-01-10",
      event: "Land Acquisition Begin",
      status: "completed",
      description: "Started acquiring private land",
    },
    {
      date: "2020-08-15",
      event: "Construction Phase 1",
      status: "completed",
      description: "Started construction of bus stations",
    },
    {
      date: "2021-03-20",
      event: "First Delays Reported",
      status: "issue",
      description: "Land acquisition delays affect timeline",
    },
    {
      date: "2022-01-15",
      event: "Budget Revision",
      status: "issue",
      description: "Budget increased by 30% due to cost overruns",
    },
    {
      date: "2022-12-31",
      event: "Original Completion Date",
      status: "missed",
      description: "Project was supposed to be completed",
    },
    {
      date: "2023-06-10",
      event: "Contractor Disputes",
      status: "issue",
      description: "Payment disputes halt construction",
    },
    {
      date: "2024-01-20",
      event: "Work Resumed",
      status: "partial",
      description: "Limited work resumed after partial payment",
    },
    {
      date: "2024-08-15",
      event: "Environmental Issues",
      status: "issue",
      description: "NEMA raises environmental concerns",
    },
    {
      date: "2025-05-15",
      event: "Current Status",
      status: "stalled",
      description: "Work completely halted pending resolution",
    },
  ],
  documents: [
    { name: "Project Proposal.pdf", size: "2.3 MB", date: "2019-01-15", type: "proposal" },
    { name: "Environmental Impact Assessment.pdf", size: "4.1 MB", date: "2019-06-20", type: "environmental" },
    { name: "Contract Agreement.pdf", size: "1.8 MB", date: "2019-03-01", type: "contract" },
    { name: "Budget Revision 2022.pdf", size: "890 KB", date: "2022-01-15", type: "budget" },
    { name: "NEMA Report 2024.pdf", size: "3.2 MB", date: "2024-08-15", type: "compliance" },
  ],
  financialBreakdown: [
    { category: "Infrastructure Development", allocated: 25000000000, spent: 7500000000 },
    { category: "Land Acquisition", allocated: 8000000000, spent: 3200000000 },
    { category: "Equipment Procurement", allocated: 6000000000, spent: 1200000000 },
    { category: "Design & Supervision", allocated: 3200000000, spent: 800000000 },
    { category: "Contingency", allocated: 3000000000, spent: 100000000 },
  ],
  images: [
    { url: "/placeholder.svg?height=640&width=960", caption: "Construction site showing incomplete bus station" },
    { url: "/placeholder.svg?height=640&width=960", caption: "Stalled construction of dedicated bus lanes" },
    { url: "/placeholder.svg?height=640&width=960", caption: "Original project design visualization" },
  ],
  relatedNews: [
    {
      title: "BRT Project Faces Further Delays as Contractor Demands Payment",
      source: "Daily Nation",
      date: "2025-05-20",
      url: "#",
    },
    {
      title: "Nairobi Residents Demand Answers on Stalled BRT System",
      source: "The Standard",
      date: "2025-04-15",
      url: "#",
    },
    {
      title: "Environmental Concerns Raised Over BRT Construction",
      source: "Business Daily",
      date: "2024-08-16",
      url: "#",
    },
  ],
}

interface ProjectDetailPageProps {
  params: {
    id: string
  }
}

export default function ProjectDetailPage({ params: _params }: ProjectDetailPageProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const selectedImage = projectDetail.images[selectedImageIndex]

  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 pt-10">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/projects">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to projects
            </Button>
          </Link>
          <div className="flex-1" />
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Flag className="mr-2 h-4 w-4" />
            Report issue
          </Button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-foreground/10 bg-white/80 p-8 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-foreground/20 text-foreground">
                {projectDetail.sector}
              </Badge>
              <Badge
                className={
                  projectDetail.status === "Stalled"
                    ? "bg-foreground text-background"
                    : "bg-foreground/10 text-foreground"
                }
              >
                {projectDetail.status}
              </Badge>
              {projectDetail.urgency === "high" && (
                <Badge variant="destructive" className="uppercase tracking-wide">
                  High Priority
                </Badge>
              )}
            </div>
            <h1 className="mt-4 font-display text-3xl text-foreground md:text-4xl">{projectDetail.name}</h1>
            <p className="mt-3 text-muted-foreground">{projectDetail.description}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-semibold text-foreground">{projectDetail.constituency}</div>
                  <div className="text-xs text-muted-foreground">{projectDetail.county} County</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-semibold text-foreground">Started {formatYear(projectDetail.startDate)}</div>
                  <div className="text-xs text-muted-foreground">
                    Due {formatYear(projectDetail.expectedCompletion)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    KSh {(projectDetail.budget / 1000000000).toFixed(1)}B
                  </div>
                  <div className="text-xs text-muted-foreground">Total budget</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-semibold text-foreground">{projectDetail.contractor}</div>
                  <div className="text-xs text-muted-foreground">Main contractor</div>
                </div>
              </div>
            </div>
          </div>

          <Card className="border-foreground/10 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Project status</CardTitle>
              <CardDescription>Progress and spend overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{projectDetail.progress}% Complete</span>
                </div>
                <Progress value={projectDetail.progress} className="mt-2 h-2 bg-foreground/10" />
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Budget spent</span>
                  <span>{Math.round((projectDetail.spent / projectDetail.budget) * 100)}%</span>
                </div>
                <Progress value={(projectDetail.spent / projectDetail.budget) * 100} className="mt-2 h-2 bg-foreground/10" />
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-semibold text-foreground">
                    KSh {(projectDetail.spent / 1000000000).toFixed(1)}B
                  </div>
                  <div className="text-xs text-muted-foreground">Spent</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-foreground">
                    KSh {((projectDetail.budget - projectDetail.spent) / 1000000000).toFixed(1)}B
                  </div>
                  <div className="text-xs text-muted-foreground">Remaining</div>
                </div>
              </div>
              <Separator />
              <div>
                <div className="text-sm font-medium">Last updated</div>
                <div className="text-sm text-muted-foreground">{formatDate(projectDetail.lastUpdate)}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 gap-2 rounded-full bg-foreground/5 p-1 text-foreground/70 lg:grid-cols-5">
            {["overview", "timeline", "financials", "documents", "accountability"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="border-foreground/10 bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle>Project overview</CardTitle>
                <CardDescription>Context, imagery, and status detail</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-2xl border border-foreground/10 bg-foreground/5 p-4">
                  <p className="text-muted-foreground leading-relaxed">{projectDetail.description}</p>
                </div>
                <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="space-y-4">
                    <div className="relative h-64 overflow-hidden rounded-2xl border border-foreground/10">
                      <Image
                        src={selectedImage?.url || "/placeholder.svg"}
                        alt={selectedImage?.caption || "Project image"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedImage?.caption}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                    {projectDetail.images.map((image, index) => (
                      <button
                        key={image.url}
                        className={`relative h-20 overflow-hidden rounded-xl border ${
                          selectedImageIndex === index ? "border-foreground" : "border-foreground/10"
                        }`}
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <Image src={image.url} alt={image.caption} fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-foreground/10 bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-foreground" />
                  Key issues & challenges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {projectDetail.issues.map((issue) => (
                    <div key={issue} className="flex items-start gap-3 rounded-xl border border-foreground/10 bg-background p-3">
                      <div className="mt-2 h-2 w-2 rounded-full bg-foreground" />
                      <span className="text-sm text-muted-foreground">{issue}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-foreground/10 bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle>Related news & updates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {projectDetail.relatedNews.map((news) => (
                  <div key={news.title} className="flex items-start justify-between gap-4 rounded-2xl border border-foreground/10 bg-background p-4">
                    <div>
                      <h4 className="font-medium text-foreground">{news.title}</h4>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span>{news.source}</span>
                        <span>{formatDate(news.date)}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <Card className="border-foreground/10 bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle>Project timeline</CardTitle>
                <CardDescription>Milestones, delays, and operational status changes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {projectDetail.timeline.map((event, index) => (
                  <div key={event.event} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          event.status === "completed"
                            ? "bg-emerald-500"
                            : event.status === "issue"
                              ? "bg-rose-500"
                              : event.status === "missed"
                                ? "bg-amber-500"
                                : event.status === "partial"
                                  ? "bg-yellow-500"
                                  : "bg-foreground/40"
                        }`}
                      />
                      {index < projectDetail.timeline.length - 1 && <div className="mt-2 h-12 w-px bg-foreground/15" />}
                    </div>
                    <div className="flex-1 rounded-2xl border border-foreground/10 bg-background p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-medium text-foreground">{event.event}</h4>
                        <span className="text-xs text-muted-foreground">{formatDate(event.date)}</span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financials" className="space-y-6">
            <Card className="border-foreground/10 bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle>Financial breakdown</CardTitle>
                <CardDescription>Allocation vs expenditure by category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {projectDetail.financialBreakdown.map((item) => (
                  <div key={item.category}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h4 className="font-medium text-foreground">{item.category}</h4>
                      <div className="text-right text-sm">
                        <div className="font-semibold text-foreground">
                          KSh {(item.spent / 1000000000).toFixed(1)}B / {(item.allocated / 1000000000).toFixed(1)}B
                        </div>
                        <div className="text-muted-foreground">
                          {Math.round((item.spent / item.allocated) * 100)}% utilized
                        </div>
                      </div>
                    </div>
                    <Progress value={(item.spent / item.allocated) * 100} className="mt-3 h-2 bg-foreground/10" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card className="border-foreground/10 bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle>Project documents</CardTitle>
                <CardDescription>Contracts, audits, and compliance documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {projectDetail.documents.map((doc) => (
                  <div key={doc.name} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-foreground/10 bg-background p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-foreground" />
                      <div>
                        <h4 className="font-medium text-foreground">{doc.name}</h4>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span>{doc.size}</span>
                          <span>{formatDate(doc.date)}</span>
                          <Badge variant="outline" className="border-foreground/20 text-xs text-foreground">
                            {doc.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accountability" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-foreground/10 bg-white/90 shadow-sm">
                <CardHeader>
                  <CardTitle>Responsible leaders</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="h-8 w-8 text-foreground" />
                    <div>
                      <div className="font-medium text-foreground">{projectDetail.governor}</div>
                      <div className="text-sm text-muted-foreground">County governor - {projectDetail.county}</div>
                      <Link href={`/leaders/governor-${projectDetail.county.toLowerCase()}`}>
                        <Button variant="outline" size="sm" className="mt-3">
                          View profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <User className="h-8 w-8 text-foreground" />
                    <div>
                      <div className="font-medium text-foreground">{projectDetail.mp}</div>
                      <div className="text-sm text-muted-foreground">
                        Member of Parliament - {projectDetail.constituency}
                      </div>
                      <Link href={`/leaders/mp-${projectDetail.constituency.toLowerCase().replace(" ", "-")}`}>
                        <Button variant="outline" size="sm" className="mt-3">
                          View profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-foreground/10 bg-white/90 shadow-sm">
                <CardHeader>
                  <CardTitle>Project management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-foreground">Implementing agency</div>
                    <div className="text-sm text-muted-foreground">{projectDetail.supervisor}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">Main contractor</div>
                    <div className="text-sm text-muted-foreground">{projectDetail.contractor}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">Financier</div>
                    <div className="text-sm text-muted-foreground">{projectDetail.financier}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">Data source</div>
                    <div className="text-sm text-muted-foreground">{projectDetail.source}</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-foreground/10 bg-foreground text-background shadow-sm">
              <CardHeader>
                <CardTitle>Take action</CardTitle>
                <CardDescription className="text-background/80">
                  Support transparency for this project
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-3">
                <Button className="h-16 flex-col bg-background text-foreground hover:bg-white">
                  <FileText className="mb-2 h-5 w-5" />
                  Submit evidence
                </Button>
                <Button variant="outline" className="h-16 flex-col border-white/30 text-background hover:bg-white/10">
                  <AlertTriangle className="mb-2 h-5 w-5" />
                  Report issue
                </Button>
                <Button variant="outline" className="h-16 flex-col border-white/30 text-background hover:bg-white/10">
                  <Users className="mb-2 h-5 w-5" />
                  Contact leaders
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}
