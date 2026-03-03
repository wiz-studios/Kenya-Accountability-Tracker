#!/usr/bin/env node
import {
  KAT_TABLES,
  createAdminClient,
  loadDotEnvFiles,
  parseArgs,
  resolveSchema,
  resolveTargetConfig,
} from "./_common.mjs"

const main = async () => {
  loadDotEnvFiles()
  const args = parseArgs()
  const schema = resolveSchema(args)
  const target = resolveTargetConfig(args)
  const bucket = (args.bucket || process.env.SUPABASE_EVIDENCE_BUCKET || "report-evidence").trim()

  const client = createAdminClient(target.url, target.serviceRoleKey)

  console.log(`Checking collisions in target project schema '${schema}'...`)
  const existingTables = []
  const missingTables = []
  const tableErrors = []

  for (const table of KAT_TABLES) {
    const { error } = await client.schema(schema).from(table).select("id").limit(1)
    if (!error) {
      existingTables.push(table)
      continue
    }
    const isMissing = /does not exist|relation .* does not exist|not found|PGRST205|schema cache/i.test(
      error.message || "",
    )
    if (isMissing) {
      missingTables.push(table)
    } else {
      tableErrors.push({ table, error: error.message || "Unknown error" })
    }
  }

  let bucketExists = false
  let bucketError = null
  const bucketResult = await client.storage.listBuckets()
  if (bucketResult.error) {
    bucketError = bucketResult.error.message || "Failed to list buckets"
  } else {
    bucketExists = (bucketResult.data || []).some((item) => item.id === bucket || item.name === bucket)
  }

  console.log("")
  console.log("Table collisions:")
  if (existingTables.length === 0) {
    console.log("- none")
  } else {
    for (const table of existingTables) {
      console.log(`- ${schema}.${table} already exists`)
    }
  }

  console.log("")
  console.log("Missing KAT tables (safe to create):")
  if (missingTables.length === 0) {
    console.log("- none")
  } else {
    for (const table of missingTables) {
      console.log(`- ${schema}.${table}`)
    }
  }

  if (tableErrors.length > 0) {
    console.log("")
    console.log("Table probe errors:")
    for (const item of tableErrors) {
      console.log(`- ${schema}.${item.table}: ${item.error}`)
    }
  }

  console.log("")
  if (bucketError) {
    console.log(`Storage check error: ${bucketError}`)
  } else if (bucketExists) {
    console.log(`Storage bucket collision: '${bucket}' already exists`)
  } else {
    console.log(`Storage bucket '${bucket}' is available`)
  }

  const hasCollision = existingTables.length > 0 || bucketExists || tableErrors.length > 0 || !!bucketError
  console.log("")
  console.log(hasCollision ? "Result: collisions found or checks incomplete." : "Result: no collisions detected.")
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
