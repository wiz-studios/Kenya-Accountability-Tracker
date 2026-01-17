import { NextResponse } from "next/server"
import { fetchExpenditures } from "@/lib/data/expenditures"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const { data, error } = await fetchExpenditures({
    search: searchParams.get("q") || undefined,
    category: searchParams.get("category") || undefined,
    status: searchParams.get("status") || undefined,
    minRisk: Number(searchParams.get("minRisk")) || 0,
    limit: Number(searchParams.get("limit")) || 60,
    offset: Number(searchParams.get("offset")) || 0,
  })

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json({ data })
}
