import fs from "fs"
import path from "path"
import { createClient } from "@supabase/supabase-js"

export const KAT_TABLES = [
  "projects",
  "leaders",
  "expenditures",
  "data_sources",
  "reports",
  "evidence",
  "report_status_events",
  "project_status_events",
]

const parseEnvFile = (content) => {
  const output = {}
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const separatorIndex = trimmed.indexOf("=")
    if (separatorIndex <= 0) continue
    const key = trimmed.slice(0, separatorIndex).trim()
    let value = trimmed.slice(separatorIndex + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    output[key] = value
  }
  return output
}

export const loadDotEnvFiles = (rootDir = process.cwd()) => {
  const candidates = [".env.local", ".env"]
  for (const fileName of candidates) {
    const fullPath = path.join(rootDir, fileName)
    if (!fs.existsSync(fullPath)) continue
    const parsed = parseEnvFile(fs.readFileSync(fullPath, "utf8"))
    for (const [key, value] of Object.entries(parsed)) {
      if (!process.env[key]) process.env[key] = value
    }
  }
}

export const parseArgs = (argv = process.argv.slice(2)) => {
  const args = {}
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i]
    if (!token.startsWith("--")) continue
    const withoutPrefix = token.slice(2)
    const equalsIndex = withoutPrefix.indexOf("=")
    if (equalsIndex > 0) {
      const key = withoutPrefix.slice(0, equalsIndex)
      const value = withoutPrefix.slice(equalsIndex + 1)
      args[key] = value
      continue
    }
    const next = argv[i + 1]
    if (!next || next.startsWith("--")) {
      args[withoutPrefix] = "true"
      continue
    }
    args[withoutPrefix] = next
    i += 1
  }
  return args
}

export const toBool = (value) => {
  if (typeof value !== "string") return false
  return ["1", "true", "yes", "on"].includes(value.toLowerCase())
}

export const resolveSchema = (args) => {
  const schema = (args.schema || process.env.SUPABASE_DATA_SCHEMA || "public").trim()
  if (!/^[a-z_][a-z0-9_]*$/i.test(schema)) {
    throw new Error(`Invalid schema name '${schema}'. Use letters, digits, and underscores.`)
  }
  return schema
}

export const resolveTableList = (args) => {
  if (!args.tables) return [...KAT_TABLES]
  return args.tables
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
}

export const createAdminClient = (url, serviceRoleKey) => {
  if (!url || !serviceRoleKey) {
    throw new Error("Supabase URL and service-role key are required.")
  }
  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export const resolveSourceConfig = (args) => ({
  url:
    args["source-url"] ||
    process.env.SOURCE_SUPABASE_URL ||
    process.env.OLD_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "",
  serviceRoleKey:
    args["source-key"] ||
    process.env.SOURCE_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.OLD_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "",
})

export const resolveTargetConfig = (args) => ({
  url:
    args["target-url"] ||
    process.env.TARGET_SUPABASE_URL ||
    process.env.NEW_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "",
  serviceRoleKey:
    args["target-key"] ||
    process.env.TARGET_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEW_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "",
})

export const ensureDir = (targetPath) => {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true })
}

export const formatTimestamp = () => {
  const now = new Date()
  const yyyy = now.getUTCFullYear()
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0")
  const dd = String(now.getUTCDate()).padStart(2, "0")
  const hh = String(now.getUTCHours()).padStart(2, "0")
  const min = String(now.getUTCMinutes()).padStart(2, "0")
  const ss = String(now.getUTCSeconds()).padStart(2, "0")
  return `${yyyy}${mm}${dd}-${hh}${min}${ss}Z`
}

export const fetchAllRows = async (client, schema, table, pageSize = 1000) => {
  const rows = []
  let offset = 0

  while (true) {
    const { data, error } = await client
      .schema(schema)
      .from(table)
      .select("*")
      .order("id", { ascending: true })
      .range(offset, offset + pageSize - 1)

    if (error) {
      const message = `${error.message || "Unknown error"}`
      const missing = /does not exist|relation .* does not exist|not found|PGRST205|schema cache/i.test(message)
      return { rows, error: message, missing }
    }

    if (!Array.isArray(data) || data.length === 0) break
    rows.push(...data)
    if (data.length < pageSize) break
    offset += data.length
  }

  return { rows, error: null, missing: false }
}
