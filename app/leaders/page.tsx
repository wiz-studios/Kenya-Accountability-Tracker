"use client"

import { useEffect, useMemo, useState } from "react"
import { AlertTriangle, ExternalLink, Filter, MapPin, Phone, Search, Shield, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SimpleLocationSelector } from "@/components/simple-location-selector"
import type { County, Constituency } from "@/lib/enhanced-kenya-locations"
import { formatNumber } from "@/lib/formatters"
import type { Leader } from "@/lib/types"

const positions = ["All Positions", "County Governor", "Member of Parliament", "Senator", "County Executive"]
const parties = ["All Parties", "UDA", "ODM", "Jubilee", "ANC", "DAP-K", "Other"]

export default function LeadersPage() {
  const [leaders, setLeaders] = useState<Leader[]>([])
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
        const query = new URLSearchParams({
          limit: "1000",
          sort: sortBy,
        })
        if (selectedCounty) query.set("county", selectedCounty.name)
        if (selectedConstituency) query.set("constituency", selectedConstituency.name)
        if (selectedPosition !== "All Positions") query.set("position", selectedPosition)
        if (selectedParty !== "All Parties") query.set("party", selectedParty)
        if (searchTerm) query.set("q", searchTerm)

        const res = await fetch(`/api/leaders?${query.toString()}`)
        const body = await res.json()
        if (!res.ok) throw new Error(body.error || `Failed to fetch leaders (${res.status})`)
        setLeaders(Array.isArray(body.data) ? body.data : [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load leaders")
        setLeaders([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [searchTerm, selectedCounty, selectedConstituency, selectedPosition, selectedParty, sortBy])

  const totalLeaders = leaders.length
  const leadersWithAllegations = leaders.filter((leader) => leader.allegations > 0).length
  const averageScore = Math.round(leaders.reduce((sum, leader) => sum + leader.accountabilityScore, 0) / totalLeaders || 0)
  const totalBudget = leaders.reduce((sum, leader) => sum + leader.budgetManaged, 0)

  const sortedLeaders = useMemo(() => {
    return [...leaders].sort((a, b) => {
      switch (sortBy) {
        case "allegations":
          return a.allegations - b.allegations
        case "budget":
          return b.budgetManaged - a.budgetManaged
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return b.accountabilityScore - a.accountabilityScore
      }
    })
  }, [leaders, sortBy])

  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 pt-10">
        <div className="rounded-3xl border border-foreground/10 bg-white/80 p-8 shadow-sm">
          <Badge className="bg-foreground text-background">Leadership accountability</Badge>
          <h1 className="mt-4 font-display text-3xl text-foreground md:text-4xl">Leadership Intelligence</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            API-backed leadership profiles with accountability metrics and governance signals.
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
              { label: "Total budget", value: `KSh ${formatNumber(Math.round(totalBudget / 1_000_000_000))}B`, icon: Users },
            ].map((stat) => (
              <Card key={stat.label} className="border-foreground/10 bg-white/90 shadow-sm">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-foreground/5">
                    <stat.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <div className="text-xl font-semibold text-foreground">{loading ? "..." : stat.value}</div>
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
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Location
                </label>
                <SimpleLocationSelector
                  onLocationChange={(county, constituency) => {
                    setSelectedCounty(county)
                    setSelectedConstituency(constituency)
                  }}
                  placeholder="Select location"
                />
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
        {sortedLeaders.length === 0 ? (
          <Card className="border-foreground/10 bg-white/90 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium text-foreground">No leaders found</h3>
              <p className="text-center text-muted-foreground">
                Try adjusting filters or ensure leader data is available in the configured source.
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
                          <span>{leader.constituency === "County-wide" ? `${leader.county} County` : `${leader.constituency}, ${leader.county}`}</span>
                        </div>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="border-foreground/20 text-foreground">
                      {leader.party}
                    </Badge>
                    <Badge variant={leader.allegations === 0 ? "default" : "destructive"}>
                      {leader.allegations === 0 ? "Clean record" : `${leader.allegations} allegation(s)`}
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
                        KSh {(leader.budgetManaged / 1_000_000_000).toFixed(1)}B
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
      </section>
    </div>
  )
}
