"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Building, Calendar, DollarSign, MapPin, TriangleAlert } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatDate, formatNumber, formatYear } from "@/lib/formatters"

type ProjectDetail = {
  id: string
  name: string
  county: string
  constituency: string
  sector: string
  status: string
  budgetAllocated: number
  budgetSpent: number
  riskScore: number
  startDate?: string | null
  endDate?: string | null
}

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>()
  const projectId = decodeURIComponent(params?.id || "")
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      if (!projectId) {
        setError("Project id is missing")
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/projects/${encodeURIComponent(projectId)}`)
        const body = await res.json()
        if (!res.ok || !body.data) {
          throw new Error(body.error || `Failed to fetch project (${res.status})`)
        }
        setProject(body.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load project")
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [projectId])

  const progress = useMemo(() => {
    if (!project || !project.budgetAllocated) return 0
    return Math.max(Math.min(Math.round((project.budgetSpent / project.budgetAllocated) * 100), 100), 0)
  }, [project])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="border-foreground/10 bg-white/90 shadow-sm">
          <CardContent className="p-8 text-sm text-muted-foreground">Loading project details...</CardContent>
        </Card>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="border-foreground/10 bg-white/90 shadow-sm">
          <CardContent className="space-y-4 p-8">
            <div className="flex items-center gap-2 text-rose-600">
              <TriangleAlert className="h-5 w-5" />
              <span className="font-medium">Project unavailable</span>
            </div>
            <p className="text-sm text-muted-foreground">{error || "Project not found."}</p>
            <Link href="/projects">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to projects
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

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
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-foreground/10 bg-white/80 p-8 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-foreground/20 text-foreground">
                {project.sector}
              </Badge>
              <Badge className={project.status === "Stalled" ? "bg-foreground text-background" : ""}>{project.status}</Badge>
            </div>
            <h1 className="mt-4 font-display text-3xl text-foreground md:text-4xl">{project.name}</h1>
            <p className="mt-3 text-muted-foreground">
              Evidence-driven project overview sourced from the KAT API. Further timeline and supporting files will be
              attached as verification records are published.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-semibold text-foreground">{project.constituency}</div>
                  <div className="text-xs text-muted-foreground">{project.county} County</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    Started {project.startDate ? formatYear(project.startDate) : "Unknown"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Due {project.endDate ? formatYear(project.endDate) : "Unknown"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    KSh {formatNumber(Math.round(project.budgetAllocated / 1_000_000_000))}B
                  </div>
                  <div className="text-xs text-muted-foreground">Allocated budget</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-semibold text-foreground">Risk {project.riskScore}%</div>
                  <div className="text-xs text-muted-foreground">Computed risk score</div>
                </div>
              </div>
            </div>
          </div>

          <Card className="border-foreground/10 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Execution snapshot</CardTitle>
              <CardDescription>Spend, progress, and accountability indicators.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Budget utilization</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="mt-2 h-2 bg-foreground/10" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-semibold text-foreground">
                    KSh {formatNumber(Math.round(project.budgetSpent / 1_000_000_000))}B
                  </div>
                  <div className="text-xs text-muted-foreground">Spent</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-foreground">
                    KSh {formatNumber(Math.round((project.budgetAllocated - project.budgetSpent) / 1_000_000_000))}B
                  </div>
                  <div className="text-xs text-muted-foreground">Remaining</div>
                </div>
              </div>
              <div className="rounded-2xl border border-foreground/10 bg-foreground/5 p-4 text-sm text-muted-foreground">
                Last refreshed {formatDate(new Date().toISOString().slice(0, 10))}. Timeline events and evidence
                documents are being backfilled from validated sources.
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
