#!/usr/bin/env node
import fs from "fs"
import path from "path"
import {
  createAdminClient,
  ensureDir,
  fetchAllRows,
  formatTimestamp,
  loadDotEnvFiles,
  parseArgs,
  resolveSchema,
  resolveSourceConfig,
  resolveTableList,
} from "./_common.mjs"

const main = async () => {
  loadDotEnvFiles()
  const args = parseArgs()
  const schema = resolveSchema(args)
  const source = resolveSourceConfig(args)
  const tables = resolveTableList(args)
  const pageSize = Number.parseInt(args["page-size"] || "1000", 10) || 1000

  const defaultFileName = `kat-export-${schema}-${formatTimestamp()}.json`
  const outPath = path.resolve(args.out || path.join("migration-data", defaultFileName))

  const client = createAdminClient(source.url, source.serviceRoleKey)

  const payload = {
    exportedAt: new Date().toISOString(),
    schema,
    tables: {},
    meta: {
      rowsByTable: {},
      skippedTables: [],
    },
  }

  for (const table of tables) {
    const { rows, error, missing } = await fetchAllRows(client, schema, table, pageSize)
    if (error) {
      if (missing) {
        payload.meta.skippedTables.push({ table, reason: "missing table" })
        console.log(`- skipped ${schema}.${table} (missing)`)
        continue
      }
      throw new Error(`Failed to export ${schema}.${table}: ${error}`)
    }
    payload.tables[table] = rows
    payload.meta.rowsByTable[table] = rows.length
    console.log(`- exported ${schema}.${table}: ${rows.length} row(s)`)
  }

  ensureDir(outPath)
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), "utf8")
  console.log("")
  console.log(`Export complete: ${outPath}`)
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
