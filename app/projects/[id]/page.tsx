"use client"

import { useState } from "react"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  FileText,
  AlertTriangle,
  ExternalLink,
  Share2,
  Flag,
  Building,
  User,
  Download,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Image from "next/image"

// Mock detailed project data
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

  // Detailed timeline
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

  // Documents
  documents: [
    { name: "Project Proposal.pdf", size: "2.3 MB", date: "2019-01-15", type: "proposal" },
    { name: "Environmental Impact Assessment.pdf", size: "4.1 MB", date: "2019-06-20", type: "environmental" },
    { name: "Contract Agreement.pdf", size: "1.8 MB", date: "2019-03-01", type: "contract" },
    { name: "Budget Revision 2022.pdf", size: "890 KB", date: "2022-01-15", type: "budget" },
    { name: "NEMA Report 2024.pdf", size: "3.2 MB", date: "2024-08-15", type: "compliance" },
  ],

  // Financial breakdown
  financialBreakdown: [
    { category: "Infrastructure Development", allocated: 25000000000, spent: 7500000000 },
    { category: "Land Acquisition", allocated: 8000000000, spent: 3200000000 },
    { category: "Equipment Procurement", allocated: 6000000000, spent: 1200000000 },
    { category: "Design & Supervision", allocated: 3200000000, spent: 800000000 },
    { category: "Contingency", allocated: 3000000000, spent: 100000000 },
  ],

  // Images
  images: [
    { url: "/placeholder.svg?height=400&width=600", caption: "Construction site showing incomplete bus station" },
    { url: "/placeholder.svg?height=400&width=600", caption: "Stalled construction of dedicated bus lanes" },
    { url: "/placeholder.svg?height=400&width=600", caption: "Original project design visualization" },
  ],

  // Related news/updates
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

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/projects">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
          <div className="flex-1" />
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Flag className="w-4 h-4 mr-2" />
            Report Issue
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="outline">{projectDetail.sector}</Badge>
              <Badge variant={projectDetail.status === "Stalled" ? "destructive" : "secondary"}>
                {projectDetail.status}
              </Badge>
              {projectDetail.urgency === "high" && <Badge variant="destructive">High Priority</Badge>}
            </div>

            <h1 className="text-3xl font-bold mb-4">{projectDetail.name}</h1>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-muted-foreground" />
                <div>
                  <div className="font-medium">{projectDetail.constituency}</div>
                  <div className="text-sm text-muted-foreground">{projectDetail.county} County</div>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-muted-foreground" />
                <div>
                  <div className="font-medium">Started {new Date(projectDetail.startDate).getFullYear()}</div>
                  <div className="text-sm text-muted-foreground">
                    Due {new Date(projectDetail.expectedCompletion).getFullYear()}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-muted-foreground" />
                <div>
                  <div className="font-medium">KSh {(projectDetail.budget / 1000000000).toFixed(1)}B</div>
                  <div className="text-sm text-muted-foreground">Total Budget</div>
                </div>
              </div>
              <div className="flex items-center">
                <Building className="w-5 h-5 mr-2 text-muted-foreground" />
                <div>
                  <div className="font-medium">{projectDetail.contractor}</div>
                  <div className="text-sm text-muted-foreground">Main Contractor</div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Stats Card */}
          <Card className="lg:w-80">
            <CardHeader>
              <CardTitle className="text-lg">Project Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{projectDetail.progress}% Complete</span>
                  </div>
                  <Progress value={projectDetail.progress} className="h-3" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Budget Spent</span>
                    <span>{Math.round((projectDetail.spent / projectDetail.budget) * 100)}%</span>
                  </div>
                  <Progress value={(projectDetail.spent / projectDetail.budget) * 100} className="h-3" />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      KSh {(projectDetail.spent / 1000000000).toFixed(1)}B
                    </div>
                    <div className="text-xs text-muted-foreground">Spent</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">
                      KSh {((projectDetail.budget - projectDetail.spent) / 1000000000).toFixed(1)}B
                    </div>
                    <div className="text-xs text-muted-foreground">Remaining</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="text-sm font-medium">Last Updated</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(projectDetail.lastUpdate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="accountability">Accountability</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Project Description */}
          <Card>
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-6">{projectDetail.description}</p>

              {/* Project Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Project Images</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {projectDetail.images.map((image, index) => (
                    <div key={index} className="cursor-pointer" onClick={() => setSelectedImageIndex(index)}>
                      <Image
                        src={image.url || "/placeholder.svg"}
                        alt={image.caption}
                        width={400}
                        height={300}
                        className="rounded-lg object-cover w-full h-48"
                      />
                      <p className="text-sm text-muted-foreground mt-2">{image.caption}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Issues */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                Key Issues & Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectDetail.issues.map((issue, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 mr-3 flex-shrink-0" />
                    <span className="text-sm">{issue}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent News */}
          <Card>
            <CardHeader>
              <CardTitle>Related News & Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectDetail.relatedNews.map((news, index) => (
                  <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{news.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{news.source}</span>
                        <span>{new Date(news.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
              <CardDescription>Chronological view of project milestones, delays, and key events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {projectDetail.timeline.map((event, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex flex-col items-center mr-4">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          event.status === "completed"
                            ? "bg-green-500"
                            : event.status === "issue"
                              ? "bg-red-500"
                              : event.status === "missed"
                                ? "bg-orange-500"
                                : event.status === "partial"
                                  ? "bg-yellow-500"
                                  : "bg-gray-400"
                        }`}
                      />
                      {index < projectDetail.timeline.length - 1 && <div className="w-0.5 h-12 bg-gray-300 mt-2" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{event.event}</h4>
                        <span className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Breakdown</CardTitle>
              <CardDescription>Detailed breakdown of budget allocation and expenditure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {projectDetail.financialBreakdown.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{item.category}</h4>
                      <div className="text-right">
                        <div className="font-semibold">
                          KSh {(item.spent / 1000000000).toFixed(1)}B / {(item.allocated / 1000000000).toFixed(1)}B
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {Math.round((item.spent / item.allocated) * 100)}% utilized
                        </div>
                      </div>
                    </div>
                    <Progress value={(item.spent / item.allocated) * 100} className="h-3" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Documents</CardTitle>
              <CardDescription>Official documents, reports, and contracts related to this project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectDetail.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <FileText className="w-8 h-8 text-blue-600 mr-3" />
                      <div>
                        <h4 className="font-medium">{doc.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{doc.size}</span>
                          <span>{new Date(doc.date).toLocaleDateString()}</span>
                          <Badge variant="outline" className="text-xs">
                            {doc.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accountability" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Responsible Leaders */}
            <Card>
              <CardHeader>
                <CardTitle>Responsible Leaders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <User className="w-8 h-8 text-blue-600 mr-3 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-medium">{projectDetail.governor}</h4>
                      <p className="text-sm text-muted-foreground">County Governor - {projectDetail.county}</p>
                      <div className="mt-2">
                        <Link href={`/leaders/governor-${projectDetail.county.toLowerCase()}`}>
                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start">
                    <User className="w-8 h-8 text-green-600 mr-3 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-medium">{projectDetail.mp}</h4>
                      <p className="text-sm text-muted-foreground">
                        Member of Parliament - {projectDetail.constituency}
                      </p>
                      <div className="mt-2">
                        <Link href={`/leaders/mp-${projectDetail.constituency.toLowerCase().replace(" ", "-")}`}>
                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Management */}
            <Card>
              <CardHeader>
                <CardTitle>Project Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">Implementing Agency</h4>
                    <p className="text-sm text-muted-foreground">{projectDetail.supervisor}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-1">Main Contractor</h4>
                    <p className="text-sm text-muted-foreground">{projectDetail.contractor}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-1">Financier</h4>
                    <p className="text-sm text-muted-foreground">{projectDetail.financier}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-1">Data Source</h4>
                    <p className="text-sm text-muted-foreground">{projectDetail.source}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Citizen Action */}
          <Card>
            <CardHeader>
              <CardTitle>Take Action</CardTitle>
              <CardDescription>Help us track accountability for this project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-20 flex-col">
                  <FileText className="w-6 h-6 mb-2" />
                  Submit Evidence
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <AlertTriangle className="w-6 h-6 mb-2" />
                  Report Issue
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Users className="w-6 h-6 mb-2" />
                  Contact Leaders
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
