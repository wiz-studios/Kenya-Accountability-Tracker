"use client"

import { useMemo } from "react"
import { MapPin, Calendar, DollarSign, Users, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { County, Constituency } from "@/lib/enhanced-kenya-locations"
import { enhancedProjectData, getProjectsByLocation, type EnhancedProject } from "@/lib/enhanced-project-data"
import Link from "next/link"
import { formatDate, formatYear } from "@/lib/formatters"

interface ProjectListDisplayProps {
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
  selectedCounty,
  selectedConstituency,
  isLoading = false,
  className,
}: ProjectListDisplayProps) {
  // Filter projects based on location
  const filteredProjects = useMemo(() => {
    if (selectedConstituency) {
      return getProjectsByLocation(selectedCounty?.id, selectedConstituency.id)
    } else if (selectedCounty) {
      return getProjectsByLocation(selectedCounty.id)
    }
    return enhancedProjectData
  }, [selectedCounty, selectedConstituency])

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
                  {projects.map((project) => (
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
                            <CardDescription className="text-sm text-muted-foreground">
                              {project.description.substring(0, 120)}...
                            </CardDescription>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-muted-foreground" />
                            <span>
                              {project.constituency}, {project.county}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1 text-muted-foreground" />
                            <span>Started {formatYear(project.startDate)}</span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1 text-muted-foreground" />
                            <span>KSh {(project.budget / 1000000000).toFixed(1)}B</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1 text-muted-foreground" />
                            <span>{project.contractor.substring(0, 20)}...</span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <div className="space-y-4">
                          {/* Progress */}
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{project.progress}% Complete</span>
                            </div>
                            <Progress value={project.progress} className="h-2 bg-foreground/10" />
                          </div>

                          {/* Budget Utilization */}
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Budget Utilization</span>
                              <span>{Math.round((project.spent / project.budget) * 100)}%</span>
                            </div>
                            <Progress value={(project.spent / project.budget) * 100} className="h-2 bg-foreground/10" />
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
                            <div className="text-xs text-muted-foreground">
                              Updated: {formatDate(project.lastUpdate)}
                            </div>
                            <Link href={`/projects/${project.id}`}>
                              <Button size="sm">View Details</Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
