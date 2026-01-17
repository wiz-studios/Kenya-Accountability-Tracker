import { NextResponse } from "next/server"
import { fetchLeaders } from "@/lib/data/leaders"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const { data, error } = await fetchLeaders({
    search: searchParams.get("q") || undefined,
    county: searchParams.get("county") || undefined,
    constituency: searchParams.get("constituency") || undefined,
    position: searchParams.get("position") || undefined,
    party: searchParams.get("party") || undefined,
    limit: Number(searchParams.get("limit")) || 60,
    offset: Number(searchParams.get("offset")) || 0,
    sort: (searchParams.get("sort") as any) || "score",
  })

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json({ data })
}
