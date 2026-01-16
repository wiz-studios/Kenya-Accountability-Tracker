"use client"

import {
  ArrowRight,
  BarChart3,
  FileText,
  MapPin,
  Search,
  Shield,
  Sparkles,
  TrendingDown,
  Users,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { formatDate, formatNumber } from "@/lib/formatters"
import { stateHouseExpenditures } from "@/lib/state-house"

const headlineStats = [
  { label: "Stalled Projects", value: "234", note: "Across 47 counties" },
  { label: "Public Funds at Risk", value: "KSh 156.7B", note: "Verified exposure" },
  { label: "Open Investigations", value: "89", note: "Active accountability cases" },
  { label: "Citizen Reports", value: "156", note: "Verified submissions" },
]

const liveSignals = [
  {
    title: "Nairobi BRT officially cancelled",
    label: "Project",
    county: "Nairobi County",
    amount: "KSh 15.2B",
    status: "High impact",
  },
  {
    title: "Machakos governor charged",
    label: "Leadership",
    county: "Machakos County",
    amount: "KSh 2.1B",
    status: "Prosecution",
  },
  {
    title: "Mombasa water project resumed",
    label: "Project",
    county: "Mombasa County",
    amount: "KSh 8.7B",
    status: "Recovery",
  },
]

const countyPulse = [
  { county: "Nairobi", exposure: 78, value: "KSh 23.4B", projects: 45 },
  { county: "Mombasa", exposure: 66, value: "KSh 18.2B", projects: 28 },
  { county: "Kisumu", exposure: 52, value: "KSh 12.1B", projects: 19 },
  { county: "Nakuru", exposure: 47, value: "KSh 9.8B", projects: 22 },
]

const integrityPillars = [
  {
    title: "Project Intelligence",
    description: "Track delivery status, budgets, and contractors in one verified registry.",
  },
  {
    title: "Leadership Watch",
    description: "Surface allegations, court filings, and audit trails for public officials.",
  },
  {
    title: "Citizen Evidence",
    description: "Collect geo-tagged reports with supporting documentation and verification tags.",
  },
]

const sectorSignals = [
  { sector: "Transport", percent: 29, value: "KSh 45.2B" },
  { sector: "Health", percent: 22, value: "KSh 34.1B" },
  { sector: "Education", percent: 18, value: "KSh 28.7B" },
  { sector: "Water", percent: 16, value: "KSh 25.3B" },
  { sector: "Energy", percent: 15, value: "KSh 23.4B" },
]

const totalStateHouseFlagged = stateHouseExpenditures.reduce((acc, item) => acc + item.amountMillions, 0)
const stateHouseRiskAverage = stateHouseExpenditures.length
  ? Math.round(stateHouseExpenditures.reduce((acc, item) => acc + item.risk, 0) / stateHouseExpenditures.length)
  : 0

const stateHouseOverview = [
  {
    label: "Flagged spend",
    value: `KSh ${formatNumber(Math.round(totalStateHouseFlagged))}M`,
    context: "Unauthorized withdrawals and unsupported vouchers",
  },
  {
    label: "Active cases",
    value: `${stateHouseExpenditures.length}`,
    context: "Audit findings under review",
  },
  {
    label: "Avg risk score",
    value: `${stateHouseRiskAverage}%`,
    context: "Based on audit severity",
  },
]

const formatStateHouseAmount = (value: number) => `KSh ${formatNumber(Math.round(value))}M`

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-orange-400/20 blur-2xl" />
        </div>
        <div className="container mx-auto px-4 pb-12 pt-16">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-6">
              <Badge className="bg-foreground text-background shadow-sm">National Integrity Dashboard</Badge>
              <h1 className="font-display text-4xl leading-tight text-foreground md:text-6xl">
                Kenya Accountability Tracker
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground md:text-xl">
                Monitor public spending, stalled projects, and leadership integrity with a single, verified source of
                truth for all 47 counties.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/projects">
                  <Button size="lg">
                    <Search className="mr-2 h-4 w-4" />
                    Explore projects
                  </Button>
                </Link>
                <Link href="/report">
                  <Button size="lg" variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Submit evidence
                  </Button>
                </Link>
                <Link href="/analytics">
                  <Button size="lg" variant="ghost" className="text-foreground hover:bg-foreground/5">
                    View analytics
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-600" />
                  Verified public records
                </span>
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-amber-600" />
                  Citizen-led reporting
                </span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-6 right-4 hidden h-24 w-24 rounded-3xl border border-foreground/10 bg-white/70 shadow-sm md:block" />
              <Card className="relative border-foreground/10 bg-white/80 shadow-lg backdrop-blur">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Integrity snapshot</CardTitle>
                    <Badge variant="outline" className="border-foreground/20 text-foreground">
                      Updated today
                    </Badge>
                  </div>
                  <CardDescription>Live risk exposure and verified cases.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {headlineStats.map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-xl font-semibold text-foreground">{stat.value}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{stat.note}</span>
                    </div>
                  ))}
                  <div className="rounded-2xl border border-foreground/10 bg-foreground/5 p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingDown className="h-4 w-4 text-emerald-600" />
                      <span>18% recovery rate in Q2</span>
                    </div>
                    <p className="mt-1 text-lg font-semibold text-foreground">KSh 12.4B recovered</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Card className="border-foreground/10 bg-white/90 shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>Live signals</CardTitle>
                <CardDescription>Verified updates from audits and oversight bodies.</CardDescription>
              </div>
              <Badge variant="outline" className="border-foreground/20 text-foreground">
                Last 72 hours
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {liveSignals.map((signal) => (
                <div key={signal.title} className="rounded-2xl border border-foreground/10 bg-background p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">{signal.label}</p>
                      <p className="font-semibold text-foreground">{signal.title}</p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {signal.county}
                        </span>
                        <span>{signal.amount}</span>
                      </div>
                    </div>
                    <Badge className="bg-foreground text-background">{signal.status}</Badge>
                  </div>
                </div>
              ))}
              <Link href="/projects">
                <Button variant="outline" className="w-full">
                  Review full project list
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-foreground/10 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>County pulse</CardTitle>
              <CardDescription>Highest exposure counties by stalled project value.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {countyPulse.map((item) => (
                <div key={item.county} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{item.county}</span>
                    <span className="text-muted-foreground">
                      {item.projects} projects | {item.value}
                    </span>
                  </div>
                  <Progress value={item.exposure} className="h-2 bg-foreground/10" />
                </div>
              ))}
              <Link href="/analytics">
                <Button className="w-full">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Explore analytics
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-4">
            <Badge variant="outline" className="border-foreground/20 text-foreground">
              Accountability stack
            </Badge>
            <h2 className="font-display text-3xl text-foreground md:text-4xl">
              A single source of truth for public project integrity.
            </h2>
            <p className="text-muted-foreground">
              Connect official audits, citizen submissions, and media investigations into one integrated evidence
              stream. Get instant visibility into where funds stall and accountability follows.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {integrityPillars.map((pillar) => (
              <Card key={pillar.title} className="border-foreground/10 bg-white/90 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">{pillar.title}</CardTitle>
                  <CardDescription>{pillar.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
            <Card className="border-foreground/10 bg-foreground text-background shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Rapid response</CardTitle>
                <CardDescription className="text-background/80">
                  Trigger watchdog notifications when high-risk budgets stall.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/report">
                  <Button variant="secondary" className="w-full bg-background text-foreground hover:bg-white">
                    Send an alert
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="border-foreground/10 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Sector exposure</CardTitle>
              <CardDescription>Where stalled budgets hit the hardest.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sectorSignals.map((sector) => (
                <div key={sector.sector} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{sector.sector}</span>
                    <span className="text-muted-foreground">{sector.value}</span>
                  </div>
                  <Progress value={sector.percent} className="h-2 bg-foreground/10" />
                </div>
              ))}
              <Link href="/analytics">
                <Button variant="outline" className="w-full">
                  Compare sector reports
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-foreground/10 bg-foreground text-background shadow-sm">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <CardHeader>
              <Badge className="w-fit bg-white/10 text-background">Priority Watchlist</Badge>
              <CardTitle className="text-2xl">Projects needing immediate oversight</CardTitle>
              <CardDescription className="text-background/80">
                High-value initiatives with repeated delays and risk flags.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-background/70">Nairobi Transport</p>
                <p className="text-lg font-semibold">BRT Corridor 2</p>
                <p className="text-xs text-background/60">KSh 15.2B | 14 months stalled</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-background/70">Mombasa Water</p>
                <p className="text-lg font-semibold">Mainland Reservoir Upgrade</p>
                <p className="text-xs text-background/60">KSh 8.7B | 9 months delayed</p>
              </div>
              <Link href="/stalled-projects">
                <Button className="w-full bg-white text-foreground hover:bg-white/90">
                  View stalled projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="border-foreground/10 bg-white/90 shadow-sm">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <Badge className="bg-foreground text-background">State House Expenditures</Badge>
                <CardTitle className="mt-3 text-2xl">New category under active review</CardTitle>
                <CardDescription>
                  Tracking withdrawals, protocol spending, and procurement that fall outside legal thresholds.
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-foreground/20 text-foreground">
                Early access
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-3 sm:grid-cols-3">
                {stateHouseOverview.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-foreground/10 bg-background p-4">
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="text-2xl font-semibold text-foreground">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.context}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-foreground/10 bg-foreground/5 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-foreground">Compliance gap snapshot</span>
                  <span className="text-muted-foreground">Risk-weighted exposure</span>
                </div>
                <div className="mt-4 space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Unapproved withdrawals</span>
                      <span>82%</span>
                    </div>
                    <Progress value={82} className="h-2 bg-foreground/10" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Missing support documents</span>
                      <span>71%</span>
                    </div>
                    <Progress value={71} className="h-2 bg-foreground/10" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Procurement anomalies</span>
                      <span>64%</span>
                    </div>
                    <Progress value={64} className="h-2 bg-foreground/10" />
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="border-foreground/20">
                    Snapshot only
                  </Badge>
                  <span>Detailed evidence and receipts to follow once data is finalized.</span>
                </div>
              </div>
              <Link href="/analytics?tab=statehouse">
                <Button variant="outline" className="w-full">
                  Open full analytics
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-foreground/10 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Latest State House issues</CardTitle>
              <CardDescription>Early signals of non-compliant spend to validate with audit data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stateHouseExpenditures.map((item) => (
                <div key={item.title} className="rounded-2xl border border-foreground/10 bg-background p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">{formatDate(item.date)}</p>
                      <p className="text-lg font-semibold text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.issue}</p>
                    </div>
                    <Badge className="bg-foreground text-background">{item.status}</Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatStateHouseAmount(item.amountMillions)}</span>
                    <span>Risk {item.risk}%</span>
                  </div>
                  <Progress value={item.risk} className="mt-2 h-2 bg-foreground/10" />
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    {item.reference ? (
                      <Link href={item.reference} target="_blank" rel="noreferrer">
                        <Badge variant="outline" className="border-foreground/20">
                          Audit reference
                        </Badge>
                      </Link>
                    ) : (
                      <Badge variant="outline" className="border-amber-200 text-amber-700">
                        Reference pending
                      </Badge>
                    )}
                    {item.source ? <span>Source: {item.source}</span> : <span>Source pending</span>}
                  </div>
                </div>
              ))}
              <div className="rounded-2xl border border-foreground/10 bg-foreground/5 p-4 text-sm text-muted-foreground">
                Data placeholders shown; we will backfill with verified audit references and receipt evidence.
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <Card className="border-foreground/10 bg-white/90 shadow-sm">
          <CardContent className="grid gap-8 p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-4">
              <Badge variant="outline" className="border-foreground/20 text-foreground">
                Community intelligence
              </Badge>
              <h3 className="font-display text-3xl text-foreground">
                Empower citizens to document, verify, and escalate accountability.
              </h3>
              <p className="text-muted-foreground">
                Add evidence, attach images, and keep a public trail of official responses. Each report is verified by
                our fact-checkers before publication.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/report">
                  <Button>
                    <Sparkles className="mr-2 h-4 w-4" />
                    File a report
                  </Button>
                </Link>
                <Link href="/leaders">
                  <Button variant="outline">View leader profiles</Button>
                </Link>
              </div>
            </div>
            <div className="rounded-3xl border border-foreground/10 bg-foreground/5 p-6">
              <p className="text-sm text-muted-foreground">Latest citizen report</p>
              <h4 className="mt-2 text-xl font-semibold text-foreground">Kisumu Regional Hospital Wing</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Procurement stalled after second tender. Site remains idle; equipment in storage.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="border-foreground/20">
                  Health Sector
                </Badge>
                <Badge variant="outline" className="border-foreground/20">
                  Verified
                </Badge>
                <span>Updated 2 days ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <Card className="border-foreground/10 bg-white/90 shadow-sm">
          <CardContent className="flex flex-col items-center gap-6 p-8 text-center lg:flex-row lg:justify-between lg:text-left">
            <div>
              <h4 className="font-display text-2xl text-foreground">Stay informed with weekly briefs.</h4>
              <p className="text-muted-foreground">Curated updates on project status shifts and new accountability cases.</p>
            </div>
            <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="h-11 flex-1 rounded-full border border-foreground/20 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/40"
              />
              <Button className="h-11">Subscribe</Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
