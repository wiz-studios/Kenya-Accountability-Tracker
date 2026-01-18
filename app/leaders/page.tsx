"use client"

import { useEffect, useState } from "react"
import { Search, Filter, MapPin, Users, AlertTriangle, Shield, Phone, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SimpleLocationSelector } from "@/components/simple-location-selector"
import type { County, Constituency } from "@/lib/enhanced-kenya-locations"
import { formatNumber } from "@/lib/formatters"
import type { Leader, Senator } from "@/lib/types"
import { senatorsData } from "@/lib/senators-data"

const fallbackLeaders: Leader[] = [
  {
    id: "1",
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
    photoUrl: "/placeholder.svg?height=150&width=150",
    recentActions: [
      "Launched Nairobi Digital City project",
      "Addressed BRT system delays",
      "Signed MOU for affordable housing",
    ],
    keyProjects: ["Nairobi BRT System", "Digital City Initiative", "Green City Program"],
    socialTwitter: "@SakajaJohnson",
    socialFacebook: "Johnson Sakaja Official",
  },
  {
    id: "2",
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
    photoUrl: "/placeholder.svg?height=150&width=150",
    recentActions: [
      "Questioned stalled road projects",
      "Advocated for youth employment",
      "Launched education bursary program",
    ],
    keyProjects: ["Embakasi East Roads", "Youth Empowerment Center", "Education Bursary Fund"],
    socialTwitter: "@HonBabuOwino",
    socialFacebook: "Babu Owino Official",
  },
  {
    id: "3",
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
    photoUrl: "/placeholder.svg?height=150&width=150",
    recentActions: [
      "Completed water treatment plant",
      "Launched smart city initiative",
      "Improved healthcare facilities",
    ],
    keyProjects: ["Kisumu Smart City", "Water Treatment Expansion", "Port Development"],
    socialTwitter: "@ProfNyongo",
    socialFacebook: "Anyang Nyongo Official",
  },
  {
    id: "4",
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
    photoUrl: "/placeholder.svg?height=150&width=150",
    recentActions: ["Supported port modernization", "Advocated for fishing industry", "Promoted tourism development"],
    keyProjects: ["Kisumu Port Upgrade", "Fishing Industry Support", "Tourism Promotion"],
    socialTwitter: "@JoshuaOron",
    socialFacebook: "Joshua Oron MP",
  },
  {
    id: "5",
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
    photoUrl: "/placeholder.svg?height=150&width=150",
    recentActions: [
      "Launched agricultural modernization",
      "Improved healthcare services",
      "Addressed hospital expansion delays",
    ],
    keyProjects: ["Nakuru Level 5 Hospital", "Agricultural Hub", "Tourism Circuit"],
    socialTwitter: "@SusanKihika",
    socialFacebook: "Susan Kihika Official",
  },
  {
    id: "6",
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
    photoUrl: "/placeholder.svg?height=150&width=150",
    recentActions: ["Completed sports complex", "Launched digital literacy program", "Improved road infrastructure"],
    keyProjects: ["Eldoret Sports Complex", "Digital Literacy Program", "Road Network Upgrade"],
    socialTwitter: "@JonathanBii",
    socialFacebook: "Jonathan Bii Official",
  },
]

const positions = ["All Positions", "County Governor", "Member of Parliament", "Senator", "County Executive"]
const parties = ["All Parties", "UDA", "ODM", "Jubilee", "ANC", "DAP-K", "Other"]

// Convert senators data to Leader format
const senatorsAsLeaders: Leader[] = senatorsData.map((senator) => ({
  id: senator.id,
  name: senator.name,
  position: "Senator",
  county: senator.county,
  constituency: "County-wide",
  party: senator.party,
  term: senator.term,
  allegations: 0,
  projectsOverseen: 0,
  budgetManaged: 0,
  accountabilityScore: 0,
  phone: senator.phone || "",
  email: senator.email || "",
  photoUrl: senator.image || "/placeholder.svg?height=150&width=150",
  recentActions: [],
  keyProjects: [],
  socialTwitter: "",
  socialFacebook: "",
}))

export default function LeadersPage() {
  const [leaders, setLeaders] = useState<Leader[]>([...fallbackLeaders, ...senatorsAsLeaders])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null)
  const [selectedConstituency, setSelectedConstituency] = useState<Constituency | null>(null)
  const [selectedPosition, setSelectedPosition] = useState("All Positions")
  const [selectedParty, setSelectedParty] = useState("All Parties")
  const [sortBy, setSortBy] = useState("score")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        // pull a generous slice to avoid missing records (MPs + Governors)
        const res = await fetch("/api/leaders?limit=1000")
        if (!res.ok) {
          throw new Error(`Failed to fetch leaders (${res.status})`)
        }
        const body = await res.json()
        if (body.data && Array.isArray(body.data)) {
          // de-duplicate by normalized name + position + county
          const seen = new Set<string>()
          const deduped: Leader[] = []
          const normalizeKey = (value: string | null | undefined) =>
            (value || "").toLowerCase().replace(/\s+/g, " ").trim()
          for (const leader of body.data as Leader[]) {
            const key = [
              normalizeKey(leader.name),
              normalizeKey(leader.position),
              normalizeKey(leader.county),
            ].join("|")
            if (seen.has(key)) continue
            seen.add(key)
            deduped.push(leader)
          }
          setLeaders(deduped.length ? deduped : fallbackLeaders)
        } else {
          setError("Leaders API returned no data, showing fallback content.")
          setLeaders(fallbackLeaders)
        }
      } catch (err) {
        setError((err as Error).message)
        setLeaders(fallbackLeaders)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleLocationChange = (county: County | null, constituency: Constituency | null) => {
    setSelectedCounty(county)
    setSelectedConstituency(constituency)
  }

  const normalize = (value: string | null | undefined) =>
    (value || "")
      .toLowerCase()
      .replace(/county$/i, "")
      .replace(/\s+/g, " ")
      .trim()

  const filteredLeaders = leaders.filter((leader) => {
    const leaderCounty = normalize(leader.county)
    const leaderConstituency = normalize(leader.constituency)
    const search = searchTerm.toLowerCase()
    const selectedCountyName = normalize(selectedCounty?.name)
    const selectedConstituencyName = normalize(selectedConstituency?.name)

    const matchesSearch =
      leader.name.toLowerCase().includes(search) ||
      leader.position.toLowerCase().includes(search) ||
      leader.county.toLowerCase().includes(search)

    const matchesCounty =
      !selectedCounty ||
      leaderCounty === selectedCountyName ||
      leaderCounty.includes(selectedCountyName) ||
      selectedCountyName.includes(leaderCounty)

    const matchesConstituency =
      !selectedConstituency ||
      leaderConstituency === selectedConstituencyName ||
      leaderConstituency.includes(selectedConstituencyName) ||
      leaderConstituency === normalize("County-wide")

    const matchesLocation = matchesCounty && matchesConstituency

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
    <div className="min-h-screen">
      <section className="container mx-auto px-4 pt-10">
        <div className="rounded-3xl border border-foreground/10 bg-white/80 p-8 shadow-sm">
          <Badge className="bg-foreground text-background">Leadership accountability</Badge>
          <h1 className="mt-4 font-display text-3xl text-foreground md:text-4xl">Leadership Intelligence</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Track the performance and accountability of governors, MPs, and other leaders across all counties.
          </p>
          {error && (
            <div className="mt-3 rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {error}
            </div>
          )}
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              { label: "Leaders tracked", value: totalLeaders, icon: Users },
              { label: "With allegations", value: leadersWithAllegations, icon: AlertTriangle },
              { label: "Average score", value: averageScore, icon: Shield },
              { label: "Total budget", value: `KSh ${formatNumber(Math.round(totalBudget / 1000000000))}B`, icon: Users },
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
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <Card className="border-foreground/10 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter leaders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Search leaders
                </label>
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
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Location
                </label>
                <SimpleLocationSelector onLocationChange={handleLocationChange} placeholder="Select location" />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Position
                </label>
                <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                  <SelectTrigger className="rounded-full border-foreground/20">
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
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Party
                </label>
                <Select value={selectedParty} onValueChange={setSelectedParty}>
                  <SelectTrigger className="rounded-full border-foreground/20">
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
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Sort by
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="rounded-full border-foreground/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="score">Accountability score</SelectItem>
                    <SelectItem value="allegations">Allegations (low to high)</SelectItem>
                    <SelectItem value="budget">Budget managed</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="container mx-auto px-4 pb-12">
        {loading && (
          <Card className="mb-4 border-foreground/10 bg-white/90 shadow-sm">
            <CardContent className="p-4 text-sm text-muted-foreground">Loading leaders from Supabase...</CardContent>
          </Card>
        )}
        {sortedLeaders.length === 0 ? (
          <Card className="border-foreground/10 bg-white/90 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium text-foreground">No leaders found</h3>
              <p className="text-muted-foreground text-center">
                Try adjusting your search criteria or filters to find leaders.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedLeaders.map((leader) => (
              <Card key={leader.id} className="border-foreground/10 bg-white/90 shadow-sm">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-foreground/10 bg-foreground/5">
                      <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-foreground">{leader.name}</CardTitle>
                      <CardDescription className="space-y-1">
                        <div>{leader.position}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>
                            {leader.constituency === "County-wide"
                              ? `${leader.county} County`
                              : `${leader.constituency}, ${leader.county}`}
                          </span>
                        </div>
                      </CardDescription>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="border-foreground/20 text-foreground">
                      {leader.party}
                    </Badge>
                    <Badge variant={leader.allegations === 0 ? "default" : "destructive"}>
                      {leader.allegations === 0
                        ? "Clean record"
                        : `${leader.allegations} allegation${leader.allegations > 1 ? "s" : ""}`}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Accountability score</span>
                      <span>{leader.accountabilityScore}/100</span>
                    </div>
                    <Progress value={leader.accountabilityScore} className="mt-2 h-2 bg-foreground/10" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Projects</div>
                      <div className="font-semibold text-foreground">{leader.projectsOverseen}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Budget</div>
                      <div className="font-semibold text-foreground">
                        KSh {(leader.budgetManaged / 1000000000).toFixed(1)}B
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Term</div>
                      <div className="font-semibold text-foreground">{leader.term}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Party</div>
                      <div className="font-semibold text-foreground">{leader.party}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Recent actions</h4>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {(Array.isArray(leader.recentActions) ? leader.recentActions : []).slice(0, 2).map((action) => (
                        <li key={action} className="flex items-start">
                          <div className="mt-2 h-1 w-1 rounded-full bg-foreground/60" />
                          <span className="ml-2">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-2 border-t border-foreground/10 pt-2">
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Phone className="mr-1 h-3 w-3" />
                      Contact
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      <ExternalLink className="mr-1 h-3 w-3" />
                      Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {sortedLeaders.length > 0 && (
          <div className="mt-8 text-center">
            <Button variant="outline">Load more leaders</Button>
          </div>
        )}
      </section>
    </div>
  )
}
