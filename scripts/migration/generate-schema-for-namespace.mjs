#!/usr/bin/env node
import fs from "fs"
import path from "path"
import { loadDotEnvFiles, parseArgs, resolveSchema } from "./_common.mjs"

const main = async () => {
  loadDotEnvFiles()
  const args = parseArgs()
  const schema = resolveSchema(args)
  const bucket = (args.bucket || process.env.SUPABASE_EVIDENCE_BUCKET || "report-evidence").trim()
  const inPath = path.resolve(args.in || path.join("supabase", "schema.sql"))
  const outPath = path.resolve(args.out || path.join("supabase", `schema.${schema}.sql`))

  if (!fs.existsSync(inPath)) {
    throw new Error(`Input schema file not found: ${inPath}`)
  }
  if (!/^[a-z0-9._-]+$/i.test(bucket)) {
    throw new Error(`Invalid bucket '${bucket}'. Use letters, digits, dots, dashes, or underscores.`)
  }

  const sourceSql = fs.readFileSync(inPath, "utf8")
  const withBucket = bucket === "report-evidence" ? sourceSql : sourceSql.replace(/report-evidence/g, bucket)
  if (schema === "public") {
    fs.writeFileSync(outPath, withBucket, "utf8")
    console.log(`Schema copied without namespace rewrite: ${outPath}`)
    return
  }

  const rewrittenSql = withBucket.replace(/\bpublic\./g, `${schema}.`)
  const output = `-- Generated from ${path.basename(inPath)} on ${new Date().toISOString()}
create schema if not exists ${schema};

${rewrittenSql}`

  fs.writeFileSync(outPath, output, "utf8")
  console.log(`Generated namespaced schema for '${schema}': ${outPath}`)
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
