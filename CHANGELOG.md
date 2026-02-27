# Changelog

All notable project changes are documented here.

## 2026-02-27 - Full Platform Revamp

### Added
- New API routes for analytics, sources, projects by ID, and full reporting workflow (`/api/reports/*`).
- New data modules for Supabase-backed reads/writes with local fallback datasets.
- New admin authentication gate component for reviewer/admin session access.
- New auth utilities for reviewer route access and evidence upload token validation.
- New rate-limiting utility for abuse protection on public write endpoints.
- New report timeline/audit event support with moderation workflows.
- New database schema sections for reports, evidence, status events, project status events, and data sources.
- New Supabase storage bucket and policies for private evidence files.

### Changed
- Reworked core pages to use live API data: home, analytics, projects, project detail, leaders, data sources, stalled projects, map, and report tracking.
- Reworked admin pages:
  - `admin/data-management` for moderation queue, evidence review, and timeline/audit.
  - `admin/data-pipeline` gated behind authenticated reviewer/admin access.
- Updated API endpoints (`projects`, `leaders`, `expenditures`) with stricter query validation and richer filtering/sorting.
- Improved ID generation for reports to non-guessable format (`KAT-YYYY-XXXXXXXX`).
- Strengthened Supabase client usage to avoid service-role fallback in browser contexts.
- Updated core types to include report/evidence/timeline entities.

### Security
- Enforced role-based authorization on sensitive report/evidence moderation endpoints.
- Restricted evidence and report timeline reads to reviewer/admin roles.
- Added signed upload token checks for public evidence uploads.
- Added per-IP rate limiting with standard rate headers and retry hints.
- Added/updated RLS policies for sensitive tables and storage objects.

### Operational Notes
- Build and type checks passed after revamp:
  - `pnpm exec tsc --noEmit`
  - `pnpm build`
