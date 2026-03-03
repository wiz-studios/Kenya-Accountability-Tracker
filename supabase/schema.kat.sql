-- Generated from schema.sql on 2026-02-27T15:58:10.098Z
create schema if not exists kat;

-- Projects table
create table if not exists kat.projects (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  county text not null,
  constituency text not null,
  sector text not null,
  status text not null,
  budget_allocated numeric default 0,
  budget_spent numeric default 0,
  risk_score integer default 0,
  start_date date,
  end_date date,
  latitude numeric,
  longitude numeric,
  inserted_at timestamp with time zone default timezone('utc', now())
);

-- Leaders table
create table if not exists kat.leaders (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  position text not null,
  county text not null,
  constituency text not null,
  party text not null,
  term text,
  allegations_count integer default 0,
  projects_overseen integer default 0,
  budget_managed numeric default 0,
  accountability_score integer default 0,
  phone text,
  email text,
  photo_url text,
  recent_actions text[],
  key_projects text[],
  social_twitter text,
  social_facebook text,
  inserted_at timestamp with time zone default timezone('utc', now())
);

-- Expenditures table
create table if not exists kat.expenditures (
  id uuid default gen_random_uuid() primary key,
  category text not null,
  amount numeric not null,
  date date not null,
  description text,
  status text,
  risk_score integer default 0,
  reference_url text,
  source text,
  tags text[],
  inserted_at timestamp with time zone default timezone('utc', now())
);

-- Basic indexes for filters
create index if not exists idx_projects_county on kat.projects(county);
create index if not exists idx_projects_sector on kat.projects(sector);
create index if not exists idx_projects_status on kat.projects(status);

create index if not exists idx_leaders_county on kat.leaders(county);
create index if not exists idx_leaders_position on kat.leaders(position);
create index if not exists idx_leaders_party on kat.leaders(party);

create index if not exists idx_expenditures_category on kat.expenditures(category);
create index if not exists idx_expenditures_status on kat.expenditures(status);
create index if not exists idx_expenditures_risk on kat.expenditures(risk_score);

-- Data sources table
create table if not exists kat.data_sources (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  type text not null,
  description text,
  url text,
  trust_score integer not null default 0 check (trust_score >= 0 and trust_score <= 100),
  status text not null default 'active',
  update_frequency text,
  coverage text,
  data_types text[] default '{}',
  categories text[] default '{}',
  last_update date,
  records_count integer not null default 0,
  inserted_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now())
);

create index if not exists idx_data_sources_type on kat.data_sources(type);
create index if not exists idx_data_sources_status on kat.data_sources(status);
create index if not exists idx_data_sources_trust on kat.data_sources(trust_score);

-- Citizen reports table
create table if not exists kat.reports (
  id uuid default gen_random_uuid() primary key,
  public_id text not null unique,
  report_type text not null,
  title text not null,
  description text not null,
  county text not null,
  constituency text,
  project_name text,
  involved_parties text,
  estimated_amount numeric default 0,
  occurred_on date,
  reported_elsewhere text,
  status text not null default 'Pending Review',
  confidence_score integer not null default 0 check (confidence_score >= 0 and confidence_score <= 100),
  is_anonymous boolean not null default true,
  allow_contact boolean not null default false,
  submitter_name text,
  submitter_email text,
  submitter_phone text,
  source_trust integer not null default 0 check (source_trust >= 0 and source_trust <= 100),
  verification_notes text,
  assigned_reviewer text,
  inserted_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now())
);

create index if not exists idx_reports_status on kat.reports(status);
create index if not exists idx_reports_county on kat.reports(county);
create index if not exists idx_reports_type on kat.reports(report_type);
create index if not exists idx_reports_public_id on kat.reports(public_id);
create index if not exists idx_reports_inserted_at on kat.reports(inserted_at desc);

-- Evidence files/links associated with reports
create table if not exists kat.evidence (
  id uuid default gen_random_uuid() primary key,
  report_id uuid not null references kat.reports(id) on delete cascade,
  label text not null,
  file_url text,
  mime_type text,
  file_size_bytes bigint,
  source_url text,
  checksum text,
  verification_state text not null default 'unverified',
  inserted_at timestamp with time zone default timezone('utc', now())
);

create index if not exists idx_evidence_report on kat.evidence(report_id);
create index if not exists idx_evidence_verification on kat.evidence(verification_state);

-- Report status history/audit trail
create table if not exists kat.report_status_events (
  id uuid default gen_random_uuid() primary key,
  report_id uuid not null references kat.reports(id) on delete cascade,
  from_status text,
  to_status text not null,
  note text,
  changed_by text,
  inserted_at timestamp with time zone default timezone('utc', now())
);

create index if not exists idx_report_status_events_report on kat.report_status_events(report_id);
create index if not exists idx_report_status_events_inserted_at on kat.report_status_events(inserted_at desc);

-- Project status history to improve traceability
create table if not exists kat.project_status_events (
  id uuid default gen_random_uuid() primary key,
  project_id uuid not null references kat.projects(id) on delete cascade,
  status text not null,
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  note text,
  source text,
  event_date date not null,
  inserted_at timestamp with time zone default timezone('utc', now())
);

create index if not exists idx_project_status_events_project on kat.project_status_events(project_id);
create index if not exists idx_project_status_events_date on kat.project_status_events(event_date desc);

-- =====================================
-- Row-level security (RLS)
-- =====================================

-- Public read-only datasets
alter table kat.projects enable row level security;
alter table kat.leaders enable row level security;
alter table kat.expenditures enable row level security;
alter table kat.data_sources enable row level security;

drop policy if exists "public_read_projects" on kat.projects;
create policy "public_read_projects" on kat.projects
  for select
  to anon, authenticated
  using (true);

drop policy if exists "public_read_leaders" on kat.leaders;
create policy "public_read_leaders" on kat.leaders
  for select
  to anon, authenticated
  using (true);

drop policy if exists "public_read_expenditures" on kat.expenditures;
create policy "public_read_expenditures" on kat.expenditures
  for select
  to anon, authenticated
  using (true);

drop policy if exists "public_read_data_sources" on kat.data_sources;
create policy "public_read_data_sources" on kat.data_sources
  for select
  to anon, authenticated
  using (true);

-- Sensitive workflow datasets
alter table kat.reports enable row level security;
alter table kat.evidence enable row level security;
alter table kat.report_status_events enable row level security;

-- Public can submit reports; reads/updates are reserved for reviewers/admins.
drop policy if exists "public_insert_reports" on kat.reports;
create policy "public_insert_reports" on kat.reports
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "reviewer_read_reports" on kat.reports;
create policy "reviewer_read_reports" on kat.reports
  for select
  to authenticated
  using (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') in ('admin', 'reviewer')
  );

drop policy if exists "reviewer_update_reports" on kat.reports;
create policy "reviewer_update_reports" on kat.reports
  for update
  to authenticated
  using (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') in ('admin', 'reviewer')
  )
  with check (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') in ('admin', 'reviewer')
  );

-- Evidence and timeline should only be visible/modifiable to reviewers/admins.
drop policy if exists "reviewer_read_evidence" on kat.evidence;
create policy "reviewer_read_evidence" on kat.evidence
  for select
  to authenticated
  using (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') in ('admin', 'reviewer')
  );

drop policy if exists "reviewer_write_evidence" on kat.evidence;
create policy "reviewer_write_evidence" on kat.evidence
  for all
  to authenticated
  using (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') in ('admin', 'reviewer')
  )
  with check (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') in ('admin', 'reviewer')
  );

drop policy if exists "reviewer_read_report_status_events" on kat.report_status_events;
create policy "reviewer_read_report_status_events" on kat.report_status_events
  for select
  to authenticated
  using (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') in ('admin', 'reviewer')
  );

drop policy if exists "reviewer_write_report_status_events" on kat.report_status_events;
create policy "reviewer_write_report_status_events" on kat.report_status_events
  for all
  to authenticated
  using (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') in ('admin', 'reviewer')
  )
  with check (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') in ('admin', 'reviewer')
  );

-- =====================================
-- Storage bucket + policies
-- =====================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'kat-report-evidence',
  'kat-report-evidence',
  false,
  10485760,
  array[
    'image/jpeg',
    'image/png',
    'application/pdf',
    'video/mp4',
    'text/plain'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "reviewer_read_report_evidence_objects" on storage.objects;
create policy "reviewer_read_report_evidence_objects" on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'kat-report-evidence'
    and coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') in ('admin', 'reviewer')
  );

drop policy if exists "reviewer_write_report_evidence_objects" on storage.objects;
create policy "reviewer_write_report_evidence_objects" on storage.objects
  for all
  to authenticated
  using (
    bucket_id = 'kat-report-evidence'
    and coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') in ('admin', 'reviewer')
  )
  with check (
    bucket_id = 'kat-report-evidence'
    and coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') in ('admin', 'reviewer')
  );
