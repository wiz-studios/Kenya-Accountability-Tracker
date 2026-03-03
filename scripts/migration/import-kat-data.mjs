#!/usr/bin/env node
import fs from "fs"
import path from "path"
import {
  KAT_TABLES,
  createAdminClient,
  loadDotEnvFiles,
  parseArgs,
  resolveSchema,
  resolveTargetConfig,
  toBool,
} from "./_common.mjs"

const IMPORT_ORDER = [
  "projects",
  "leaders",
  "expenditures",
  "data_sources",
  "reports",
  "project_status_events",
  "evidence",
  "report_status_events",
]

const chunkRows = (rows, size) => {
  const chunks = []
  for (let i = 0; i < rows.length; i += size) {
    chunks.push(rows.slice(i, i + size))
  }
  return chunks
}

const main = async () => {
  loadDotEnvFiles()
  const args = parseArgs()
  const schema = resolveSchema(args)
  const target = resolveTargetConfig(args)
  const dryRun = toBool(args["dry-run"] || "")
  const chunkSize = Number.parseInt(args["chunk-size"] || "500", 10) || 500
  const inPath = path.resolve(args.in || path.join("migration-data", "kat-export.json"))

  if (!fs.existsSync(inPath)) {
    throw new Error(`Input file not found: ${inPath}`)
  }

  const parsed = JSON.parse(fs.readFileSync(inPath, "utf8"))
  const sourceTables = parsed?.tables
  if (!sourceTables || typeof sourceTables !== "object") {
    throw new Error("Invalid input file. Expected top-level object with 'tables'.")
  }

  const client = createAdminClient(target.url, target.serviceRoleKey)
  const tableOrder = IMPORT_ORDER.filter((table) => KAT_TABLES.includes(table))
  const extraTables = Object.keys(sourceTables).filter((table) => !tableOrder.includes(table))
  tableOrder.push(...extraTables)

  for (const table of tableOrder) {
    const rows = Array.isArray(sourceTables[table]) ? sourceTables[table] : []
    if (rows.length === 0) {
      console.log(`- skipping ${schema}.${table}: 0 row(s)`)
      continue
    }

    if (dryRun) {
      console.log(`- dry-run ${schema}.${table}: would import ${rows.length} row(s)`)
      continue
    }

    const chunks = chunkRows(rows, chunkSize)
    let imported = 0

    for (const chunk of chunks) {
      const { error } = await client.schema(schema).from(table).upsert(chunk, { onConflict: "id" })
      if (error) {
        throw new Error(`Failed to import into ${schema}.${table}: ${error.message || "Unknown error"}`)
      }
      imported += chunk.length
    }

    console.log(`- imported ${schema}.${table}: ${imported} row(s)`)
  }

  console.log("")
  console.log(dryRun ? "Dry run complete." : "Import complete.")
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
