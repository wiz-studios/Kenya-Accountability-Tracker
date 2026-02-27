import { createHmac, timingSafeEqual } from "crypto"

const TOKEN_TTL_SECONDS = 30 * 60

type UploadTokenPayload = {
  publicId: string
  exp: number
}

type VerifyUploadTokenResult =
  | { ok: true }
  | { ok: false; error: string }

const getUploadTokenSecret = () => process.env.REPORT_UPLOAD_TOKEN_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || ""

const encodePayload = (payload: UploadTokenPayload) => Buffer.from(JSON.stringify(payload), "utf8").toString("base64url")

const decodePayload = (encoded: string): UploadTokenPayload | null => {
  try {
    const decoded = Buffer.from(encoded, "base64url").toString("utf8")
    const parsed = JSON.parse(decoded) as Partial<UploadTokenPayload>
    if (typeof parsed.publicId !== "string" || typeof parsed.exp !== "number") {
      return null
    }
    return {
      publicId: parsed.publicId,
      exp: parsed.exp,
    }
  } catch {
    return null
  }
}

const signPayload = (encodedPayload: string, secret: string) =>
  createHmac("sha256", secret).update(encodedPayload).digest("base64url")

export const createEvidenceUploadToken = (publicId: string, ttlSeconds = TOKEN_TTL_SECONDS): string | null => {
  const secret = getUploadTokenSecret()
  if (!secret || !publicId) return null

  const nowEpoch = Math.floor(Date.now() / 1000)
  const payload: UploadTokenPayload = {
    publicId,
    exp: nowEpoch + ttlSeconds,
  }
  const encodedPayload = encodePayload(payload)
  const signature = signPayload(encodedPayload, secret)
  return `${encodedPayload}.${signature}`
}

export const verifyEvidenceUploadToken = (publicId: string, token: string | null | undefined): VerifyUploadTokenResult => {
  const secret = getUploadTokenSecret()
  if (!secret) {
    return { ok: false, error: "Evidence upload token secret is not configured" }
  }
  if (!publicId || !token) {
    return { ok: false, error: "Missing evidence upload token" }
  }

  const [encodedPayload, providedSignature] = token.split(".")
  if (!encodedPayload || !providedSignature) {
    return { ok: false, error: "Invalid evidence upload token format" }
  }

  const expectedSignature = signPayload(encodedPayload, secret)
  const expected = Buffer.from(expectedSignature, "utf8")
  const provided = Buffer.from(providedSignature, "utf8")

  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) {
    return { ok: false, error: "Invalid evidence upload token signature" }
  }

  const payload = decodePayload(encodedPayload)
  if (!payload) {
    return { ok: false, error: "Invalid evidence upload token payload" }
  }
  if (payload.publicId !== publicId) {
    return { ok: false, error: "Evidence upload token does not match report id" }
  }

  const nowEpoch = Math.floor(Date.now() / 1000)
  if (payload.exp <= nowEpoch) {
    return { ok: false, error: "Evidence upload token has expired" }
  }

  return { ok: true }
}
