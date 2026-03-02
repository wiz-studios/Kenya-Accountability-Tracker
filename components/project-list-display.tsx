"use client"

import { useMemo } from "react"
import { MapPin, Calendar, DollarSign, Users, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { County, Constituency } from "@/lib/enhanced-kenya-locations"
import type { EnhancedProject } from "@/lib/enhanced-project-data"
import Link from "next/link"
import { formatDate, formatYear } from "@/lib/formatters"

interface ProjectListDisplayProps {
  projects: EnhancedProject[]
  selectedCounty: County | null
  selectedConstituency: Constituency | null
  isLoading?: boolean
  className?: string
}

// Status configuration with colors and icons
const statusConfig = {
  Stalled: {
    variant: "destructive" as const,
    icon: XCircle,
    color: "text-rose-600",
    surface: "bg-rose-50/70",
    border: "border-rose-200/60",
  },
  Delayed: {
    variant: "secondary" as const,
    icon: Clock,
    color: "text-amber-600",
    surface: "bg-amber-50/70",
    border: "border-amber-200/60",
  },
  "Behind Schedule": {
    variant: "outline" as const,
    icon: AlertCircle,
    color: "text-orange-600",
    surface: "bg-orange-50/70",
    border: "border-orange-200/60",
  },
  Completed: {
    variant: "default" as const,
    icon: CheckCircle,
    color: "text-emerald-600",
    surface: "bg-emerald-50/70",
    border: "border-emerald-200/60",
  },
  Resumed: {
    variant: "secondary" as const,
    icon: Clock,
    color: "text-sky-600",
    surface: "bg-sky-50/70",
    border: "border-sky-200/60",
  },
  Cancelled: {
    variant: "destructive" as const,
    icon: XCircle,
    color: "text-rose-600",
    surface: "bg-rose-50/70",
    border: "border-rose-200/60",
  },
}

export function ProjectListDisplay({
  projects,
  selectedCounty,
  selectedConstituency,
  isLoading = false,
  className,
}: ProjectListDisplayProps) {
  const filteredProjects = projects

  // Group projects by status
  const projectsByStatus = useMemo(() => {
    return filteredProjects.reduce(
      (acc, project) => {
        if (!acc[project.status]) {
          acc[project.status] = []
        }
        acc[project.status].push(project)
        return acc
      },
      {} as Record<string, EnhancedProject[]>,
    )
  }, [filteredProjects])

  // Calculate statistics
  const stats = useMemo(() => {
    const total = filteredProjects.length
    const stalled = filteredProjects.filter((p) => p.status === "Stalled").length
    const completed = filteredProjects.filter((p) => p.status === "Completed").length
    const totalBudget = filteredProjects.reduce((sum, p) => sum + p.budget, 0)
    const avgProgress = Math.round(filteredProjects.reduce((sum, p) => sum + p.progress, 0) / total || 0)

    return { total, stalled, completed, totalBudget, avgProgress }
  }, [filteredProjects])

  if (isLoading) {
    return (
      <div className={className}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-2 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (filteredProjects.length === 0) {
    return (
      <div className={className}>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No projects found</h3>
            <p className="text-muted-foreground text-center">
              {selectedConstituency
                ? `No projects found in ${selectedConstituency.name}, ${selectedCounty?.name}.`
                : selectedCounty
                  ? `No projects found in ${selectedCounty.name} County.`
                  : "Select a location to view projects."}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Statistics Summary */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Total Projects", value: stats.total },
          { label: "Stalled", value: stats.stalled },
          { label: "Completed", value: stats.completed },
          { label: "Avg Progress", value: `${stats.avgProgress}%` },
        ].map((item) => (
          <Card key={item.label} className="border-foreground/10 bg-white/90 shadow-sm">
            <CardContent className="p-4">
              <div className="text-xl font-semibold text-foreground">{item.value}</div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Projects by Status */}
      <div className="space-y-6">
        {Object.entries(projectsByStatus)
          .sort(([a], [b]) => {
            // Sort to show problematic statuses first
            const order = ["Stalled", "Delayed", "Behind Schedule", "Cancelled", "Resumed", "Completed"]
            return order.indexOf(a) - order.indexOf(b)
          })
          .map(([status, projects]) => {
            const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Stalled
            const StatusIcon = config.icon

            return (
              <div key={status}>
                <div className="mb-4 flex items-center gap-2">
                  <StatusIcon className={`h-5 w-5 ${config.color}`} />
                  <h3 className="text-lg font-semibold text-foreground">{status} Projects</h3>
                  <Badge variant="outline" className="border-foreground/20 text-foreground">
                    {projects.length}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {projects.map((project) => {
                    const hasBudget = Number(project.budget) > 0
                    const budgetUtilization = hasBudget ? Math.round((project.spent / project.budget) * 100) : null
                    const progressLabel = hasBudget || project.status === "Completed" ? `${project.progress}% Complete` : "N/A"
                    const progressValue = hasBudget || project.status === "Completed" ? project.progress : 0
                    const budgetLabel = hasBudget ? `KSh ${(project.budget / 1000000000).toFixed(1)}B` : "Budget N/A"
                    const budgetUtilizationLabel = typeof budgetUtilization === "number" ? `${budgetUtilization}%` : "N/A"
                    const budgetUtilizationValue = typeof budgetUtilization === "number" ? budgetUtilization : 0
                    const locationLabel =
                      project.constituency && project.constituency !== project.county
                        ? `${project.constituency}, ${project.county}`
                        : project.county
                    const startedLabel =
                      project.startDate && project.startDate !== "Unknown"
                        ? `Started ${formatYear(project.startDate)}`
                        : "Start date unknown"
                    const contractorLabel = (project.contractor || "").trim() || "Contractor not published"
                    const contractorPreview =
                      contractorLabel.length > 28 ? `${contractorLabel.slice(0, 28).trimEnd()}...` : contractorLabel
                    const description = (project.description || "").trim() || "No description published in source."
                    const descriptionPreview = description.length > 120 ? `${description.slice(0, 120).trimEnd()}...` : description
                    const updatedLabel =
                      project.lastUpdate && project.lastUpdate !== "Unknown" ? formatDate(project.lastUpdate) : "Unknown"

                    return (
                      <Card
                        key={project.id}
                        className={`border-foreground/10 shadow-sm transition-all duration-200 hover:shadow-lg ${config.surface} ${config.border}`}
                      >
                        <CardHeader>
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="border-foreground/20 text-foreground">
                                  {project.sector}
                                </Badge>
                                <Badge variant={config.variant}>{project.status}</Badge>
                                {project.urgency === "high" && (
                                  <Badge variant="destructive" className="text-xs uppercase tracking-wide">
                                    High priority
                                  </Badge>
                                )}
                              </div>
                              <CardTitle className="text-lg mb-1 text-foreground">{project.name}</CardTitle>
                              <CardDescription className="text-sm text-muted-foreground">{descriptionPreview}</CardDescription>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1 text-muted-foreground" />
                              <span>{locationLabel}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1 text-muted-foreground" />
                              <span>{startedLabel}</span>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-1 text-muted-foreground" />
                              <span>{budgetLabel}</span>
                            </div>
                            <div className="flex items-center" title={contractorLabel}>
                              <Users className="w-4 h-4 mr-1 text-muted-foreground" />
                              <span>{contractorPreview}</span>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent>
                          <div className="space-y-4">
                            {/* Progress */}
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Progress</span>
                                <span>{progressLabel}</span>
                              </div>
                              <Progress value={progressValue} className="h-2 bg-foreground/10" />
                            </div>

                            {/* Budget Utilization */}
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Budget Utilization</span>
                                <span>{budgetUtilizationLabel}</span>
                              </div>
                              <Progress value={budgetUtilizationValue} className="h-2 bg-foreground/10" />
                            </div>

                            {/* Key Issues */}
                            {project.issues.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium mb-2">Key Issues</h4>
                                <div className="flex flex-wrap gap-1">
                                  {project.issues.slice(0, 2).map((issue, index) => (
                                    <Badge key={index} variant="outline" className="border-foreground/20 text-xs text-foreground">
                                      {issue}
                                    </Badge>
                                  ))}
                                  {project.issues.length > 2 && (
                                    <Badge variant="outline" className="border-foreground/20 text-xs text-foreground">
                                      +{project.issues.length - 2} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex justify-between items-center pt-2">
                              <div className="text-xs text-muted-foreground">Updated: {updatedLabel}</div>
                              <Link href={`/projects/${project.id}`}>
                                <Button size="sm">View Details</Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
