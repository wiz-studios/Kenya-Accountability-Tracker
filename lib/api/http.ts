import { NextResponse } from "next/server"

export type PaginationMeta = {
  limit: number
  offset: number
  count: number
}

export const jsonOk = <T>(payload: T, init?: ResponseInit) => NextResponse.json(payload, init)

export const jsonError = (message: string, status = 500, details?: unknown) =>
  NextResponse.json(
    {
      error: message,
      ...(details !== undefined ? { details } : {}),
    },
    { status },
  )
