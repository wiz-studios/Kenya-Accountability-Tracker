# Supabase Merge Runbook

This runbook merges KAT into another Supabase project safely, even when that project already serves a different app.

## 1) Recommended Strategy

Use a dedicated schema for KAT in the shared Supabase project:

- KAT tables live in `kat` schema (not `public`)
- Existing app keeps using its current `public` tables
- KAT app sets `SUPABASE_DATA_SCHEMA=kat`

This avoids table-name collisions (`projects`, `reports`, etc.).

## 2) Required Inputs

You need service-role keys for:

- source project (old KAT project, if still accessible)
- target project (shared project you still control)

You can pass these as CLI args or env vars.

Supported env names:

- source: `SOURCE_SUPABASE_URL`, `SOURCE_SUPABASE_SERVICE_ROLE_KEY`
- target: `TARGET_SUPABASE_URL`, `TARGET_SUPABASE_SERVICE_ROLE_KEY`

## 3) Pre-check Collisions

Run:

```bash
pnpm merge:check --schema public --target-url <TARGET_URL> --target-key <TARGET_SERVICE_ROLE_KEY>
```

If collisions appear, proceed with `kat` schema below.

## 4) Generate Namespaced SQL

Run:

```bash
pnpm merge:namespace-sql --schema kat --bucket kat-report-evidence --out supabase/schema.kat.sql
```

Then execute `supabase/schema.kat.sql` in the target project's SQL editor.

## 5) Export KAT Data (from old project)

Run:

```bash
pnpm merge:export --schema public --source-url <SOURCE_URL> --source-key <SOURCE_SERVICE_ROLE_KEY> --out migration-data/kat-export.json
```

If old project is not accessible, skip this and start with empty KAT tables in target.

## 6) Import KAT Data (to target project)

Dry run:

```bash
pnpm merge:import --schema kat --target-url <TARGET_URL> --target-key <TARGET_SERVICE_ROLE_KEY> --in migration-data/kat-export.json --dry-run
```

Actual import:

```bash
pnpm merge:import --schema kat --target-url <TARGET_URL> --target-key <TARGET_SERVICE_ROLE_KEY> --in migration-data/kat-export.json
```

## 7) Configure KAT App

Set KAT env to target project + schema:

- `NEXT_PUBLIC_SUPABASE_URL=<TARGET_URL>`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=<TARGET_ANON_KEY>`
- `SUPABASE_SERVICE_ROLE_KEY=<TARGET_SERVICE_ROLE_KEY>`
- `SUPABASE_DATA_SCHEMA=kat`
- `REPORT_UPLOAD_TOKEN_SECRET=<long random secret>`

If you generated SQL with a custom bucket, set:

- `SUPABASE_EVIDENCE_BUCKET=<same-bucket-name-used-in-generated-sql>`

## 8) Post-Merge Checks

1. Submit report from `/report`
2. Upload evidence
3. Sign in to admin reviewer UI
4. Review report/evidence
5. Track report status publicly

## Notes

- Supabase Auth is shared per project. Both apps share users.
- Recreate reviewer/admin role metadata for KAT reviewers:
  - `app_metadata.role = "reviewer"` or `"admin"`
- If target already has a `report-evidence` bucket, generate namespaced SQL with `--bucket <new-name>`.
