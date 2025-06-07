"use client"
import {
  AlertTriangle,
  DollarSign,
  MapPin,
  Users,
  FileText,
  Search,
  Eye,
  ArrowRight,
  Shield,
  AlertCircle,
  BarChart3,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

// Enhanced mock data for the homepage
const platformStats = {
  totalProjects: 847,
  stalledProjects: 234,
  totalLoss: 156.7, // in billions
  activeCases: 89,
  verifiedReports: 156,
  lastUpdated: "2025-06-03",
}

const recentUpdates = [
  {
    id: 1,
    type: "project",
    title: "Nairobi BRT System Officially Cancelled",
    location: "Nairobi County",
    amount: "KSh 15.2B",
    date: "2025-06-02",
    status: "cancelled",
    source: "Ministry of Transport",
  },
  {
    id: 2,
    type: "leader",
    title: "Machakos Governor Charged with Embezzlement",
    location: "Machakos County",
    amount: "KSh 2.1B",
    date: "2025-06-01",
    status: "charged",
    source: "EACC",
  },
  {
    id: 3,
    type: "project",
    title: "Mombasa Water Project Back on Track",
    location: "Mombasa County",
    amount: "KSh 8.7B",
    date: "2025-05-30",
    status: "resumed",
    source: "County Government",
  },
]

const criticalIssues = [
  {
    county: "Nairobi",
    projects: 45,
    amountLost: 23.4,
    urgency: "high",
  },
  {
    county: "Mombasa",
    projects: 28,
    amountLost: 18.2,
    urgency: "high",
  },
  {
    county: "Kisumu",
    projects: 19,
    amountLost: 12.1,
    urgency: "medium",
  },
  {
    county: "Nakuru",
    projects: 22,
    amountLost: 9.8,
    urgency: "medium",
  },
]

const sectorBreakdown = [
  { sector: "Transport", projects: 89, amount: 45.2, percentage: 29 },
  { sector: "Health", projects: 67, amount: 34.1, percentage: 22 },
  { sector: "Education", projects: 78, amount: 28.7, percentage: 18 },
  { sector: "Water", projects: 45, amount: 25.3, percentage: 16 },
  { sector: "Energy", projects: 34, amount: 23.4, percentage: 15 },
]

export default function Homepage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Kenya Accountability Tracker</h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Monitoring public projects and leadership accountability across all 47 counties
            </p>

            {/* Key Impact Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-300">{platformStats.stalledProjects}</div>
                <div className="text-blue-100">Stalled Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-red-300">KSh {platformStats.totalLoss}B</div>
                <div className="text-blue-100">Funds Lost</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-orange-300">{platformStats.activeCases}</div>
                <div className="text-blue-100">Active Cases</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-300">{platformStats.verifiedReports}</div>
                <div className="text-blue-100">Citizen Reports</div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link href="/projects">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Search className="w-5 h-5 mr-2" />
                  Explore Projects
                </Button>
              </Link>
              <Link href="/report">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Report an Issue
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Recent Updates Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Recent Updates</h2>
            <Link href="/updates">
              <Button variant="outline">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentUpdates.map((update) => (
              <Card key={update.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge
                      variant={
                        update.status === "cancelled"
                          ? "destructive"
                          : update.status === "charged"
                            ? "secondary"
                            : "default"
                      }
                    >
                      {update.status === "cancelled"
                        ? "Project Cancelled"
                        : update.status === "charged"
                          ? "Leader Charged"
                          : "Project Resumed"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{new Date(update.date).toLocaleDateString()}</span>
                  </div>
                  <CardTitle className="text-lg">{update.title}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {update.location}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {update.amount}
                      </div>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Source: {update.source}</span>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Critical Issues by County */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Counties with Critical Issues</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {criticalIssues.map((issue) => (
              <Card key={issue.county}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{issue.county} County</CardTitle>
                    <AlertTriangle
                      className={`w-5 h-5 ${issue.urgency === "high" ? "text-red-500" : "text-yellow-500"}`}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Stalled Projects</span>
                      <span className="font-semibold">{issue.projects}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Amount Lost</span>
                      <span className="font-semibold text-red-600">KSh {issue.amountLost}B</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Urgency Level</span>
                        <span className="capitalize">{issue.urgency}</span>
                      </div>
                      <Progress
                        value={issue.urgency === "high" ? 80 : 50}
                        className={`h-2 ${issue.urgency === "high" ? "[&>div]:bg-red-500" : "[&>div]:bg-yellow-500"}`}
                      />
                    </div>
                    <Link href={`/county/${issue.county.toLowerCase()}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        View County Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Sector Analysis */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Issues by Sector</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                {sectorBreakdown.map((sector) => (
                  <div key={sector.sector} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <h3 className="font-medium">{sector.sector}</h3>
                        <Badge variant="outline">{sector.projects} projects</Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">KSh {sector.amount}B</div>
                        <div className="text-sm text-muted-foreground">{sector.percentage}% of total</div>
                      </div>
                    </div>
                    <Progress value={sector.percentage} className="h-2" />
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t">
                <Link href="/analytics">
                  <Button className="w-full">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Detailed Analytics
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Quick Action Cards */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Take Action</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <div className="flex items-center">
                  <Search className="w-8 h-8 text-blue-600 mr-3" />
                  <div>
                    <CardTitle className="text-blue-900">Explore Projects</CardTitle>
                    <CardDescription className="text-blue-700">
                      Search and filter stalled projects by location
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-800 mb-4">
                  Browse our database of {platformStats.totalProjects} projects across all counties and constituencies.
                </p>
                <Link href="/projects">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Start Exploring</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <div className="flex items-center">
                  <FileText className="w-8 h-8 text-green-600 mr-3" />
                  <div>
                    <CardTitle className="text-green-900">Report an Issue</CardTitle>
                    <CardDescription className="text-green-700">
                      Submit evidence of stalled projects or corruption
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-800 mb-4">
                  Help us track accountability by reporting issues in your area. All reports are verified.
                </p>
                <Link href="/report">
                  <Button className="w-full bg-green-600 hover:bg-green-700">Submit Report</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardHeader>
                <div className="flex items-center">
                  <Shield className="w-8 h-8 text-purple-600 mr-3" />
                  <div>
                    <CardTitle className="text-purple-900">Leader Profiles</CardTitle>
                    <CardDescription className="text-purple-700">
                      Track accountability of governors and MPs
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-purple-800 mb-4">
                  View detailed profiles, allegations, and track records of public leaders.
                </p>
                <Link href="/leaders">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">View Leaders</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Data Sources Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Our Data Sources</h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium mb-1">Auditor General</h3>
                  <p className="text-sm text-muted-foreground">Official audit reports</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-medium mb-1">EACC</h3>
                  <p className="text-sm text-muted-foreground">Anti-corruption cases</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-medium mb-1">NGO Reports</h3>
                  <p className="text-sm text-muted-foreground">Civil society research</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <AlertCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-medium mb-1">Citizen Reports</h3>
                  <p className="text-sm text-muted-foreground">Verified submissions</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Last updated: {new Date(platformStats.lastUpdated).toLocaleDateString()}
                </p>
                <Link href="/data-sources">
                  <Button variant="outline">View All Data Sources</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Newsletter Signup */}
        <section className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Informed</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Get weekly updates on new cases, project status changes, and accountability insights delivered to your
            inbox.
          </p>
          <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-2 border rounded-md" />
            <Button>Subscribe</Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">We respect your privacy. Unsubscribe at any time.</p>
        </section>
      </div>
    </div>
  )
}
