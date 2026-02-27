import { NextResponse } from "next/server"

type RateLimitBucket = {
  count: number
  resetAt: number
}

type RateLimitGlobalState = typeof globalThis & {
  __katRateLimitStore?: Map<string, RateLimitBucket>
  __katRateLimitSweepAt?: number
}

export type IpRateLimitConfig = {
  namespace: string
  limit: number
  windowMs: number
}

export type IpRateLimitCheck = {
  allowed: boolean
  limit: number
  remaining: number
  resetAt: number
  retryAfterSeconds: number
  headers: Record<string, string>
}

const SWEEP_INTERVAL_MS = 60 * 1000

const getStore = () => {
  const globalState = globalThis as RateLimitGlobalState
  if (!globalState.__katRateLimitStore) {
    globalState.__katRateLimitStore = new Map<string, RateLimitBucket>()
  }
  return globalState.__katRateLimitStore
}

const sweepExpiredBuckets = (now: number) => {
  const globalState = globalThis as RateLimitGlobalState
  const nextSweepAt = globalState.__katRateLimitSweepAt ?? 0
  if (now < nextSweepAt) return

  const store = getStore()
  for (const [key, bucket] of store.entries()) {
    if (bucket.resetAt <= now) {
      store.delete(key)
    }
  }
  globalState.__katRateLimitSweepAt = now + SWEEP_INTERVAL_MS
}

const resolveClientIp = (request: Request) => {
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim()
    if (first) return first
  }

  const realIp = request.headers.get("x-real-ip") || request.headers.get("cf-connecting-ip")
  if (realIp) return realIp.trim()

  return "unknown"
}

export const checkIpRateLimit = (request: Request, config: IpRateLimitConfig): IpRateLimitCheck => {
  const now = Date.now()
  sweepExpiredBuckets(now)

  const ip = resolveClientIp(request)
  const key = `${config.namespace}:${ip}`
  const store = getStore()

  const existing = store.get(key)
  const bucket =
    !existing || existing.resetAt <= now
      ? {
          count: 0,
          resetAt: now + config.windowMs,
        }
      : existing

  let allowed = true
  if (bucket.count >= config.limit) {
    allowed = false
  } else {
    bucket.count += 1
    store.set(key, bucket)
  }

  const retryAfterSeconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000))
  const remaining = allowed ? Math.max(config.limit - bucket.count, 0) : 0
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(config.limit),
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(Math.floor(bucket.resetAt / 1000)),
  }
  if (!allowed) {
    headers["Retry-After"] = String(retryAfterSeconds)
  }

  return {
    allowed,
    limit: config.limit,
    remaining,
    resetAt: bucket.resetAt,
    retryAfterSeconds,
    headers,
  }
}

export const jsonRateLimitError = (message: string, check: IpRateLimitCheck) =>
  NextResponse.json(
    {
      error: message,
    },
    {
      status: 429,
      headers: check.headers,
    },
  )

export const attachRateLimitHeaders = <T extends Response>(response: T, check: IpRateLimitCheck): T => {
  for (const [name, value] of Object.entries(check.headers)) {
    response.headers.set(name, value)
  }
  return response
}

export const parsePositiveInt = (value: string | undefined, fallback: number) => {
  const parsed = Number.parseInt(value ?? "", 10)
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback
  return parsed
}
