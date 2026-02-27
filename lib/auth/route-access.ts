import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

type ReviewerRole = "admin" | "reviewer"

type AccessDenied = {
  ok: false
  response: NextResponse
}

type AccessGranted = {
  ok: true
  role: ReviewerRole
  userId: string
  userEmail: string | null
}

export type ReviewerAccessResult = AccessDenied | AccessGranted
export type ReviewerAccessGranted = AccessGranted

const getAuthClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
  if (!url || !anonKey) return null

  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

const parseBearerToken = (request: Request) => {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return null
  const match = authHeader.match(/^Bearer\s+(.+)$/i)
  if (!match) return null
  return match[1]
}

const parseReviewerRole = (value: unknown): ReviewerRole | null => {
  const normalized = typeof value === "string" ? value.toLowerCase() : ""
  if (normalized === "admin" || normalized === "reviewer") {
    return normalized
  }
  return null
}

export const requireReviewerAccess = async (request: Request): Promise<ReviewerAccessResult> => {
  const token = parseBearerToken(request)
  if (!token) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Missing bearer token" }, { status: 401 }),
    }
  }

  const authClient = getAuthClient()
  if (!authClient) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Supabase auth is not configured" }, { status: 500 }),
    }
  }

  const { data, error } = await authClient.auth.getUser(token)
  if (error || !data.user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Invalid session token" }, { status: 401 }),
    }
  }

  const role =
    parseReviewerRole(data.user.app_metadata?.role) || parseReviewerRole(data.user.user_metadata?.role)

  if (!role) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Insufficient role for reviewer operation" }, { status: 403 }),
    }
  }

  return {
    ok: true,
    role,
    userId: data.user.id,
    userEmail: data.user.email ?? null,
  }
}

export const tryGetReviewerAccess = async (request: Request): Promise<ReviewerAccessGranted | null> => {
  const token = parseBearerToken(request)
  if (!token) {
    return null
  }

  const authClient = getAuthClient()
  if (!authClient) {
    return null
  }

  const { data, error } = await authClient.auth.getUser(token)
  if (error || !data.user) {
    return null
  }

  const role =
    parseReviewerRole(data.user.app_metadata?.role) || parseReviewerRole(data.user.user_metadata?.role)

  if (!role) {
    return null
  }

  return {
    ok: true,
    role,
    userId: data.user.id,
    userEmail: data.user.email ?? null,
  }
}
