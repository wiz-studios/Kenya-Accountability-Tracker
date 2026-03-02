# Project Source Sync (PPIP/OCDS)

This project now includes a real project-ingestion command for official procurement data:

- Source registry: PPIP OCDS publication `147`
- Portal: `https://tenders.go.ke/ocds`
- Dataset host: `https://data.open-contracting.org`

## Command

```bash
pnpm sync:projects:ppip
```

## What it does

1. Downloads PPIP OCDS JSONL (`<year>.jsonl.gz`, default is current UTC year).
2. Normalizes releases into the existing `projects` table schema.
3. Upserts rows by deterministic UUID (derived from OCID/release IDs) to avoid duplicates.
4. Upserts `data_sources` with a PPIP source record and refresh metadata.

## Flags

- `--dry-run`: parse and summarize only, no database writes.
- `--year <yyyy|full>`: choose dataset year (default: current year, e.g. `2026`).
- `--limit <n>`: import only first `n` normalized projects after sorting by newest release date.
- `--schema <name>`: target schema (default uses `SUPABASE_DATA_SCHEMA` or `public`).
- `--target-url <url>`: override Supabase URL.
- `--target-key <service-role-key>`: override Supabase service role key.
- `--publication-id <id>`: override publication ID (default `147`).
- `--dataset-base <url>`: override dataset host (default `https://data.open-contracting.org`).
- `--in <path/to/file.jsonl.gz>`: use local gzip dataset instead of downloading.

## Examples

Dry run:

```bash
pnpm sync:projects:ppip --dry-run
```

Import full history:

```bash
pnpm sync:projects:ppip --year full
```

Import only latest 500:

```bash
pnpm sync:projects:ppip --limit 500
```

## Required environment

Same as other migration/admin scripts:

- `NEXT_PUBLIC_SUPABASE_URL` (or `TARGET_SUPABASE_URL`, or `--target-url`)
- `SUPABASE_SERVICE_ROLE_KEY` (or `TARGET_SUPABASE_SERVICE_ROLE_KEY`, or `--target-key`)
- Optional: `SUPABASE_DATA_SCHEMA`

## Notes on accuracy

- PPIP/OCDS gives authoritative procurement lifecycle records (tender, award, contract).
- This sync maps procurement records into KAT `projects` for consistency with the UI.
- County is inferred from buyer/title metadata; unmatched records are stored as `National`.
