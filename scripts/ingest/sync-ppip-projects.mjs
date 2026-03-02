#!/usr/bin/env node
import crypto from "crypto"
import fs from "fs"
import path from "path"
import zlib from "zlib"
import {
  createAdminClient,
  loadDotEnvFiles,
  parseArgs,
  resolveSchema,
  resolveTargetConfig,
  toBool,
} from "../migration/_common.mjs"

const DEFAULT_PUBLICATION_ID = "147"
const DEFAULT_SOURCE_NAME = "Public Procurement Information Portal (PPIP) - OCDS"
const DEFAULT_SOURCE_URL = "https://tenders.go.ke/ocds"
const DEFAULT_DATASET_BASE = "https://data.open-contracting.org"

const CHUNK_SIZE = 500
const REQUIRED_TABLES = ["projects", "data_sources"]

const parseCountiesFromTs = (rootDir) => {
  const filePath = path.join(rootDir, "lib", "complete-kenya-data.ts")
  if (!fs.existsSync(filePath)) {
    throw new Error(`County reference file not found: ${filePath}`)
  }

  const text = fs.readFileSync(filePath, "utf8")
  const regex = /id:\s*"[^"]+",\s*\n\s*name:\s*"([^"]+)",\s*\n\s*code:/g
  const counties = []
  let match
  while ((match = regex.exec(text)) !== null) {
    counties.push(match[1])
  }

  if (counties.length === 0) {
    throw new Error("Could not parse county names from complete-kenya-data.ts")
  }

  return counties
}

const normalizeText = (value) => String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "")

const buildCountyMatcher = (counties) =>
  counties.map((county) => ({
    name: county,
    key: normalizeText(county),
  }))

const inferCounty = (input, countyMatcher) => {
  const candidates = [input.buyerName, input.title, input.ocid, input.tenderId].map(normalizeText)

  for (const county of countyMatcher) {
    if (candidates.some((value) => value.includes(county.key))) {
      return county.name
    }
  }

  return "National"
}

const mapSector = (category) => {
  const normalized = normalizeText(category)
  if (!normalized) return "Public Procurement"
  if (normalized.includes("work")) return "Infrastructure"
  if (normalized.includes("service")) return "Services"
  if (normalized.includes("good")) return "Supply Chain"
  return "Public Procurement"
}

const toDateString = (value) => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString().slice(0, 10)
}

const toNumber = (value) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

const hasPast = (value) => {
  if (!value) return false
  const date = new Date(value)
  return !Number.isNaN(date.getTime()) && date.getTime() < Date.now()
}

const daysSince = (value) => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
}

const deriveStatus = ({ contractStatus, hasContract, hasAward, tenderEndDate, contractEndDate }) => {
  const normalizedContractStatus = normalizeText(contractStatus)

  if (normalizedContractStatus.includes("cancel") || normalizedContractStatus.includes("terminat")) {
    return "Cancelled"
  }

  if (hasContract) {
    if (hasPast(contractEndDate)) return "Completed"
    return "Active"
  }

  if (hasAward) return "Active"

  const tenderAgeDays = daysSince(tenderEndDate)
  if (typeof tenderAgeDays === "number" && tenderAgeDays > 180) {
    return "Delayed"
  }

  return "Active"
}

const deriveRiskScore = ({ status, amount, procurementMethod, releaseDate }) => {
  if (status === "Cancelled") return 95
  if (status === "Delayed") return 72
  if (status === "Completed") return 18

  let score = 32

  if (!amount || amount <= 0) {
    score += 10
  }

  const normalizedMethod = normalizeText(procurementMethod)
  if (
    normalizedMethod.includes("limited") ||
    normalizedMethod.includes("selective") ||
    normalizedMethod.includes("direct") ||
    normalizedMethod.includes("singlesource")
  ) {
    score += 8
  }

  const updatedAt = releaseDate ? new Date(releaseDate) : null
  if (updatedAt && !Number.isNaN(updatedAt.getTime())) {
    const ageDays = Math.floor((Date.now() - updatedAt.getTime()) / (1000 * 60 * 60 * 24))
    if (ageDays > 120) score += 12
    else if (ageDays > 60) score += 6
  }

  return clamp(Math.round(score), 0, 100)
}

const deterministicUuid = (value) => {
  const hash = crypto.createHash("md5").update(value).digest("hex")
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`
}

const chunkRows = (rows, size = CHUNK_SIZE) => {
  const chunks = []
  for (let index = 0; index < rows.length; index += size) {
    chunks.push(rows.slice(index, index + size))
  }
  return chunks
}

const safeTitle = (value, fallback) => {
  const cleaned = String(value || "").replace(/\s+/g, " ").trim()
  return cleaned || fallback
}

const buildDownloadUrl = ({ publicationId, year, datasetBase }) => {
  const fileName = year ? `${year}.jsonl.gz` : "full.jsonl.gz"
  return `${datasetBase}/en/publication/${publicationId}/download?name=${fileName}`
}

const assertReadableRelease = (release) => {
  if (!release || typeof release !== "object") return false
  if (!release.ocid && !release.id) return false
  const tender = release.tender || {}
  return Boolean(tender.title || release.awards?.length || release.contracts?.length)
}

const convertReleaseToProject = (release, countyMatcher) => {
  const tender = release.tender || {}
  const buyer = release.buyer || {}
  const award = Array.isArray(release.awards) && release.awards.length > 0 ? release.awards[0] : null
  const contract = Array.isArray(release.contracts) && release.contracts.length > 0 ? release.contracts[0] : null
  const supplier =
    award && Array.isArray(award.suppliers) && award.suppliers.length > 0 ? award.suppliers[0]?.name || null : null

  const budgetAmount = toNumber(contract?.value?.amount ?? award?.value?.amount ?? 0)
  const title = safeTitle(contract?.title || award?.title || tender?.title, `PPIP Procurement ${release.ocid || release.id}`)
  const county = inferCounty(
    {
      buyerName: buyer?.name,
      title,
      ocid: release.ocid,
      tenderId: tender?.id,
    },
    countyMatcher,
  )
  const constituency = county === "National" ? "National" : "County-wide"

  const startDate =
    contract?.period?.startDate || award?.contractPeriod?.startDate || tender?.tenderPeriod?.startDate || null
  const endDate = contract?.period?.endDate || award?.contractPeriod?.endDate || tender?.tenderPeriod?.endDate || null
  const status = deriveStatus({
    contractStatus: contract?.status,
    hasContract: Boolean(contract),
    hasAward: Boolean(award),
    tenderEndDate: tender?.tenderPeriod?.endDate || null,
    contractEndDate: endDate,
  })
  const riskScore = deriveRiskScore({
    status,
    amount: budgetAmount,
    procurementMethod: tender?.procurementMethod,
    releaseDate: release?.date,
  })

  const seedKey = `${release.ocid || release.id}:${contract?.id || award?.id || tender?.id || release.id}`
  const id = deterministicUuid(seedKey)

  return {
    id,
    name: title,
    county,
    constituency,
    sector: mapSector(tender?.mainProcurementCategory),
    status,
    budget_allocated: budgetAmount,
    budget_spent: status === "Completed" ? budgetAmount : 0,
    risk_score: riskScore,
    start_date: toDateString(startDate),
    end_date: toDateString(endDate),
    latitude: null,
    longitude: null,
    meta: {
      buyerName: buyer?.name || null,
      supplierName: supplier,
      ocid: release.ocid || null,
      releaseDate: release.date || null,
      procurementMethod: tender?.procurementMethod || null,
    },
  }
}

const fetchDatasetBuffer = async ({ inputPath, url }) => {
  if (inputPath) {
    const resolved = path.resolve(inputPath)
    if (!fs.existsSync(resolved)) {
      throw new Error(`Input file not found: ${resolved}`)
    }
    return fs.readFileSync(resolved)
  }

  const response = await fetch(url, {
    headers: {
      "User-Agent": "KAT-Project-Sync/1.0",
      Accept: "application/gzip, application/octet-stream, */*",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to download dataset (${response.status} ${response.statusText})`)
  }

  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

const parseReleasesFromGzip = (gzipBuffer) => {
  const raw = zlib.gunzipSync(gzipBuffer).toString("utf8")
  const lines = raw.split(/\r?\n/).filter(Boolean)
  const releases = []

  for (const line of lines) {
    try {
      const parsed = JSON.parse(line)
      if (assertReadableRelease(parsed)) {
        releases.push(parsed)
      }
    } catch {
      // Ignore malformed JSON lines and continue.
    }
  }

  return releases
}

const ensureTablesAvailable = async (client, schema, tableNames) => {
  for (const tableName of tableNames) {
    const { error } = await client.schema(schema).from(tableName).select("*").limit(1)
    if (!error) continue
    throw new Error(`Table '${schema}.${tableName}' is unavailable: ${error.message || "Unknown error"}`)
  }
}

const upsertProjects = async (client, schema, projects) => {
  let written = 0
  const chunks = chunkRows(projects, CHUNK_SIZE)

  for (const chunk of chunks) {
    const payload = chunk.map(({ meta: _meta, ...row }) => row)
    const { error } = await client.schema(schema).from("projects").upsert(payload, { onConflict: "id" })
    if (error) {
      throw new Error(`Failed to upsert projects: ${error.message || "Unknown error"}`)
    }
    written += chunk.length
  }

  return written
}

const upsertSourceRegistry = async (client, schema, summary) => {
  const sourceRecord = {
    name: DEFAULT_SOURCE_NAME,
    type: "Government",
    description:
      "Official PPIP procurement records in Open Contracting Data Standard (OCDS) format, synced into KAT projects.",
    url: DEFAULT_SOURCE_URL,
    trust_score: 94,
    status: "active",
    update_frequency: "Daily",
    coverage: "National",
    data_types: ["OCDS JSONL", "Tenders", "Awards", "Contracts"],
    categories: ["Public Procurement", "Project Delivery", "Government Spending"],
    last_update: toDateString(summary.latestReleaseDate || new Date().toISOString()),
    records_count: summary.totalProjects,
  }

  const { error } = await client.schema(schema).from("data_sources").upsert(sourceRecord, { onConflict: "name" })
  if (error) {
    throw new Error(`Failed to upsert data source registry: ${error.message || "Unknown error"}`)
  }
}

const summarizeProjects = (projects) => {
  const counties = new Set()
  const statuses = new Map()
  const sectors = new Map()
  let latestReleaseDate = null

  for (const project of projects) {
    counties.add(project.county)
    statuses.set(project.status, (statuses.get(project.status) || 0) + 1)
    sectors.set(project.sector, (sectors.get(project.sector) || 0) + 1)
    if (project.meta?.releaseDate) {
      if (!latestReleaseDate || project.meta.releaseDate > latestReleaseDate) {
        latestReleaseDate = project.meta.releaseDate
      }
    }
  }

  return {
    totalProjects: projects.length,
    countiesCovered: counties.size,
    statusBreakdown: Object.fromEntries(statuses),
    sectorBreakdown: Object.fromEntries(sectors),
    latestReleaseDate,
  }
}

const main = async () => {
  loadDotEnvFiles()

  const args = parseArgs()
  const schema = resolveSchema(args)
  const dryRun = toBool(args["dry-run"] || "")
  const limit = Number.parseInt(args.limit || "0", 10) || 0
  const yearArg = (args.year || String(new Date().getUTCFullYear())).trim().toLowerCase()
  const year = yearArg === "full" ? "" : yearArg
  const publicationId = (args["publication-id"] || process.env.PPIP_PUBLICATION_ID || DEFAULT_PUBLICATION_ID).trim()
  const datasetBase = (args["dataset-base"] || process.env.PPIP_DATASET_BASE || DEFAULT_DATASET_BASE).trim()
  const inputPath = args.in || ""
  const url = buildDownloadUrl({ publicationId, year, datasetBase })
  const rootDir = path.resolve(process.cwd())

  console.log(`Syncing PPIP projects (${year || "full dataset"})`)
  console.log(`Schema: ${schema}`)
  console.log(inputPath ? `Input file: ${path.resolve(inputPath)}` : `Download URL: ${url}`)

  const gzipBuffer = await fetchDatasetBuffer({ inputPath, url })
  const releases = parseReleasesFromGzip(gzipBuffer)
  const counties = parseCountiesFromTs(rootDir)
  const countyMatcher = buildCountyMatcher(counties)

  const projectsById = new Map()
  for (const release of releases) {
    const project = convertReleaseToProject(release, countyMatcher)
    projectsById.set(project.id, project)
  }

  let projects = Array.from(projectsById.values())
  projects.sort((a, b) => (b.meta?.releaseDate || "").localeCompare(a.meta?.releaseDate || ""))

  if (limit > 0) {
    projects = projects.slice(0, limit)
  }

  const summary = summarizeProjects(projects)
  console.log(`Releases parsed: ${releases.length}`)
  console.log(`Projects prepared: ${projects.length}`)
  console.log(`Counties covered: ${summary.countiesCovered}`)
  console.log(`Latest release date: ${summary.latestReleaseDate || "unknown"}`)

  if (projects.length === 0) {
    console.log("No projects to sync. Exiting.")
    return
  }

  if (dryRun) {
    console.log("")
    console.log("Dry run complete. No database writes were performed.")
    console.log(`Status breakdown: ${JSON.stringify(summary.statusBreakdown)}`)
    console.log(`Sector breakdown: ${JSON.stringify(summary.sectorBreakdown)}`)
    return
  }

  const target = resolveTargetConfig(args)
  const client = createAdminClient(target.url, target.serviceRoleKey)
  await ensureTablesAvailable(client, schema, REQUIRED_TABLES)

  const upsertedProjects = await upsertProjects(client, schema, projects)
  await upsertSourceRegistry(client, schema, summary)

  console.log("")
  console.log(`Upserted projects: ${upsertedProjects}`)
  console.log(`Updated data source: ${DEFAULT_SOURCE_NAME}`)
  console.log("Sync complete.")
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
