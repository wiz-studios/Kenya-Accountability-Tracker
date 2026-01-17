import { NextResponse } from "next/server"
import { fetchProjects } from "@/lib/data/projects"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const { data, error } = await fetchProjects({
    search: searchParams.get("q") || undefined,
    county: searchParams.get("county") || undefined,
    constituency: searchParams.get("constituency") || undefined,
    sector: searchParams.get("sector") || undefined,
    status: searchParams.get("status") || undefined,
    limit: Number(searchParams.get("limit")) || 60,
    offset: Number(searchParams.get("offset")) || 0,
    sort: (searchParams.get("sort") as any) || "risk",
  })

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json({ data })
}
