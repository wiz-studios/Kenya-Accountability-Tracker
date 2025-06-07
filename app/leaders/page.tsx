"use client"

import { useState } from "react"
import { Search, Filter, MapPin, Users, AlertTriangle, Shield, Phone, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SimpleLocationSelector } from "@/components/simple-location-selector"
import type { County, Constituency } from "@/lib/enhanced-kenya-locations"

// Enhanced leader data
const leadersData = [
  {
    id: 1,
    name: "Johnson Sakaja",
    position: "County Governor",
    county: "Nairobi",
    constituency: "County-wide",
    party: "UDA",
    term: "2022-2027",
    allegations: 2,
    projectsOverseen: 15,
    budgetManaged: 37500000000,
    accountabilityScore: 68,
    phone: "+254 700 000 001",
    email: "governor@nairobi.go.ke",
    image: "/placeholder.svg?height=150&width=150",
    recentActions: [
      "Launched Nairobi Digital City project",
      "Addressed BRT system delays",
      "Signed MOU for affordable housing",
    ],
    keyProjects: ["Nairobi BRT System", "Digital City Initiative", "Green City Program"],
    socialMedia: {
      twitter: "@SakajaJohnson",
      facebook: "Johnson Sakaja Official",
    },
  },
  {
    id: 2,
    name: "Hon. Babu Owino",
    position: "Member of Parliament",
    county: "Nairobi",
    constituency: "Embakasi East",
    party: "ODM",
    term: "2022-2027",
    allegations: 1,
    projectsOverseen: 8,
    budgetManaged: 2100000000,
    accountabilityScore: 72,
    phone: "+254 700 000 002",
    email: "mp@embakasi-east.go.ke",
    image: "/placeholder.svg?height=150&width=150",
    recentActions: [
      "Questioned stalled road projects",
      "Advocated for youth employment",
      "Launched education bursary program",
    ],
    keyProjects: ["Embakasi East Roads", "Youth Empowerment Center", "Education Bursary Fund"],
    socialMedia: {
      twitter: "@HonBabuOwino",
      facebook: "Babu Owino Official",
    },
  },
  {
    id: 3,
    name: "Prof. Anyang' Nyong'o",
    position: "County Governor",
    county: "Kisumu",
    constituency: "County-wide",
    party: "ODM",
    term: "2017-2027",
    allegations: 0,
    projectsOverseen: 12,
    budgetManaged: 15800000000,
    accountabilityScore: 85,
    phone: "+254 700 000 003",
    email: "governor@kisumu.go.ke",
    image: "/placeholder.svg?height=150&width=150",
    recentActions: [
      "Completed water treatment plant",
      "Launched smart city initiative",
      "Improved healthcare facilities",
    ],
    keyProjects: ["Kisumu Smart City", "Water Treatment Expansion", "Port Development"],
    socialMedia: {
      twitter: "@ProfNyongo",
      facebook: "Anyang Nyongo Official",
    },
  },
  {
    id: 4,
    name: "Hon. Joshua Oron",
    position: "Member of Parliament",
    county: "Kisumu",
    constituency: "Kisumu Central",
    party: "ODM",
    term: "2022-2027",
    allegations: 0,
    projectsOverseen: 6,
    budgetManaged: 1800000000,
    accountabilityScore: 78,
    phone: "+254 700 000 004",
    email: "mp@kisumu-central.go.ke",
    image: "/placeholder.svg?height=150&width=150",
    recentActions: ["Supported port modernization", "Advocated for fishing industry", "Promoted tourism development"],
    keyProjects: ["Kisumu Port Upgrade", "Fishing Industry Support", "Tourism Promotion"],
    socialMedia: {
      twitter: "@JoshuaOron",
      facebook: "Joshua Oron MP",
    },
  },
  {
    id: 5,
    name: "Susan Kihika",
    position: "County Governor",
    county: "Nakuru",
    constituency: "County-wide",
    party: "UDA",
    term: "2022-2027",
    allegations: 1,
    projectsOverseen: 18,
    budgetManaged: 12400000000,
    accountabilityScore: 74,
    phone: "+254 700 000 005",
    email: "governor@nakuru.go.ke",
    image: "/placeholder.svg?height=150&width=150",
    recentActions: [
      "Launched agricultural modernization",
      "Improved healthcare services",
      "Addressed hospital expansion delays",
    ],
    keyProjects: ["Nakuru Level 5 Hospital", "Agricultural Hub", "Tourism Circuit"],
    socialMedia: {
      twitter: "@SusanKihika",
      facebook: "Susan Kihika Official",
    },
  },
  {
    id: 6,
    name: "Jonathan Bii",
    position: "County Governor",
    county: "Uasin Gishu",
    constituency: "County-wide",
    party: "UDA",
    term: "2022-2027",
    allegations: 0,
    projectsOverseen: 14,
    budgetManaged: 11200000000,
    accountabilityScore: 81,
    phone: "+254 700 000 006",
    email: "governor@uasingishu.go.ke",
    image: "/placeholder.svg?height=150&width=150",
    recentActions: ["Completed sports complex", "Launched digital literacy program", "Improved road infrastructure"],
    keyProjects: ["Eldoret Sports Complex", "Digital Literacy Program", "Road Network Upgrade"],
    socialMedia: {
      twitter: "@JonathanBii",
      facebook: "Jonathan Bii Official",
    },
  },
]

const positions = ["All Positions", "County Governor", "Member of Parliament", "Senator", "County Executive"]
const parties = ["All Parties", "UDA", "ODM", "Jubilee", "ANC", "DAP-K", "Other"]

export default function LeadersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null)
  const [selectedConstituency, setSelectedConstituency] = useState<Constituency | null>(null)
  const [selectedPosition, setSelectedPosition] = useState("All Positions")
  const [selectedParty, setSelectedParty] = useState("All Parties")
  const [sortBy, setSortBy] = useState("score")

  const handleLocationChange = (county: County | null, constituency: Constituency | null) => {
    console.log("Leaders page location change:", { county: county?.name, constituency: constituency?.name })
    setSelectedCounty(county)
    setSelectedConstituency(constituency)
  }

  const filteredLeaders = leadersData.filter((leader) => {
    const matchesSearch =
      leader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leader.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leader.county.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLocation =
      (!selectedCounty || leader.county === selectedCounty.name) &&
      (!selectedConstituency ||
        leader.constituency === selectedConstituency.name ||
        leader.constituency === "County-wide")

    const matchesPosition = selectedPosition === "All Positions" || leader.position === selectedPosition
    const matchesParty = selectedParty === "All Parties" || leader.party === selectedParty

    return matchesSearch && matchesLocation && matchesPosition && matchesParty
  })

  const sortedLeaders = [...filteredLeaders].sort((a, b) => {
    switch (sortBy) {
      case "score":
        return b.accountabilityScore - a.accountabilityScore
      case "allegations":
        return a.allegations - b.allegations
      case "budget":
        return b.budgetManaged - a.budgetManaged
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const totalLeaders = filteredLeaders.length
  const leadersWithAllegations = filteredLeaders.filter((l) => l.allegations > 0).length
  const averageScore = Math.round(
    filteredLeaders.reduce((sum, l) => sum + l.accountabilityScore, 0) / totalLeaders || 0,
  )
  const totalBudget = filteredLeaders.reduce((sum, l) => sum + l.budgetManaged, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Leadership Accountability</h1>
        <p className="text-muted-foreground">
          Track the performance and accountability of governors, MPs, and other leaders
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <div className="text-2xl font-bold">{totalLeaders}</div>
                <div className="text-sm text-muted-foreground">Leaders Tracked</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <div className="text-2xl font-bold">{leadersWithAllegations}</div>
                <div className="text-sm text-muted-foreground">With Allegations</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <div className="text-2xl font-bold">{averageScore}</div>
                <div className="text-sm text-muted-foreground">Avg. Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-purple-600 font-bold text-sm">KSh</span>
              </div>
              <div>
                <div className="text-2xl font-bold">{(totalBudget / 1000000000).toFixed(0)}B</div>
                <div className="text-sm text-muted-foreground">Total Budget</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filter Leaders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search Leaders</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <SimpleLocationSelector onLocationChange={handleLocationChange} placeholder="Select location..." />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Position</label>
              <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((position) => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Party</label>
              <Select value={selectedParty} onValueChange={setSelectedParty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {parties.map((party) => (
                    <SelectItem key={party} value={party}>
                      {party}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">Accountability Score</SelectItem>
                  <SelectItem value="allegations">Allegations (Low to High)</SelectItem>
                  <SelectItem value="budget">Budget Managed</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaders Grid */}
      {sortedLeaders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No leaders found</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your search criteria or filters to find leaders.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedLeaders.map((leader) => (
            <Card key={leader.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{leader.name}</CardTitle>
                    <CardDescription>
                      <div className="space-y-1">
                        <div>{leader.position}</div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          <span className="text-xs">
                            {leader.constituency === "County-wide"
                              ? `${leader.county} County`
                              : `${leader.constituency}, ${leader.county}`}
                          </span>
                        </div>
                      </div>
                    </CardDescription>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{leader.party}</Badge>
                  <Badge variant={leader.allegations === 0 ? "default" : "destructive"}>
                    {leader.allegations === 0
                      ? "Clean Record"
                      : `${leader.allegations} Allegation${leader.allegations > 1 ? "s" : ""}`}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Accountability Score */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Accountability Score</span>
                      <span>{leader.accountabilityScore}/100</span>
                    </div>
                    <Progress value={leader.accountabilityScore} className="h-2" />
                  </div>

                  {/* Key Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Projects</div>
                      <div className="font-semibold">{leader.projectsOverseen}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Budget</div>
                      <div className="font-semibold">KSh {(leader.budgetManaged / 1000000000).toFixed(1)}B</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Term</div>
                      <div className="font-semibold">{leader.term}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Party</div>
                      <div className="font-semibold">{leader.party}</div>
                    </div>
                  </div>

                  {/* Recent Actions */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Recent Actions</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {leader.recentActions.slice(0, 2).map((action, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-1 h-1 rounded-full bg-blue-500 mt-2 mr-2 flex-shrink-0" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Contact Info */}
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Phone className="w-3 h-3 mr-1" />
                      Contact
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Load More */}
      {sortedLeaders.length > 0 && (
        <div className="mt-8 text-center">
          <Button variant="outline">Load More Leaders</Button>
        </div>
      )}
    </div>
  )
}
