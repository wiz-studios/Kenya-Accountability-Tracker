-- Projects table
create table if not exists public.projects (
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
create table if not exists public.leaders (
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
create table if not exists public.expenditures (
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
create index if not exists idx_projects_county on public.projects(county);
create index if not exists idx_projects_sector on public.projects(sector);
create index if not exists idx_projects_status on public.projects(status);

create index if not exists idx_leaders_county on public.leaders(county);
create index if not exists idx_leaders_position on public.leaders(position);
create index if not exists idx_leaders_party on public.leaders(party);

create index if not exists idx_expenditures_category on public.expenditures(category);
create index if not exists idx_expenditures_status on public.expenditures(status);
create index if not exists idx_expenditures_risk on public.expenditures(risk_score);

-- Data sources table
create table if not exists public.data_sources (
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

create index if not exists idx_data_sources_type on public.data_sources(type);
create index if not exists idx_data_sources_status on public.data_sources(status);
create index if not exists idx_data_sources_trust on public.data_sources(trust_score);

-- Citizen reports table
create table if not exists public.reports (
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

create index if not exists idx_reports_status on public.reports(status);
create index if not exists idx_reports_county on public.reports(county);
create index if not exists idx_reports_type on public.reports(report_type);
create index if not exists idx_reports_public_id on public.reports(public_id);
create index if not exists idx_reports_inserted_at on public.reports(inserted_at desc);

-- Evidence files/links associated with reports
create table if not exists public.evidence (
  id uuid default gen_random_uuid() primary key,
  report_id uuid not null references public.reports(id) on delete cascade,
  label text not null,
  file_url text,
  mime_type text,
  file_size_bytes bigint,
  source_url text,
  checksum text,
  verification_state text not null default 'unverified',
  inserted_at timestamp with time zone default timezone('utc', now())
);

create index if not exists idx_evidence_report on public.evidence(report_id);
create index if not exists idx_evidence_verification on public.evidence(verification_state);

-- Report status history/audit trail
create table if not exists public.report_status_events (
  id uuid default gen_random_uuid() primary key,
  report_id uuid not null references public.reports(id) on delete cascade,
  from_status text,
  to_status text not null,
  note text,
  changed_by text,
  inserted_at timestamp with time zone default timezone('utc', now())
);

create index if not exists idx_report_status_events_report on public.report_status_events(report_id);
create index if not exists idx_report_status_events_inserted_at on public.report_status_events(inserted_at desc);

-- Project status history to improve traceability
create table if not exists public.project_status_events (
  id uuid default gen_random_uuid() primary key,
  project_id uuid not null references public.projects(id) on delete cascade,
  status text not null,
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  note text,
  source text,
  event_date date not null,
  inserted_at timestamp with time zone default timezone('utc', now())
);

create index if not exists idx_project_status_events_project on public.project_status_events(project_id);
create index if not exists idx_project_status_events_date on public.project_status_events(event_date desc);

-- =====================================
-- Row-level security (RLS)
-- =====================================

-- Public read-only datasets
alter table public.projects enable row level security;
alter table public.leaders enable row level security;
alter table public.expenditures enable row level security;
alter table public.data_sources enable row level security;

drop policy if exists "public_read_projects" on public.projects;
create policy "public_read_projects" on public.projects
  for select
  to anon, authenticated
  using (true);

drop policy if exists "public_read_leaders" on public.leaders;
create policy "public_read_leaders" on public.leaders
  for select
  to anon, authenticated
  using (true);

drop policy if exists "public_read_expenditures" on public.expenditures;
create policy "public_read_expenditures" on public.expenditures
  for select
  to anon, authenticated
  using (true);

drop policy if exists "public_read_data_sources" on public.data_sources;
create policy "public_read_data_sources" on public.data_sources
  for select
  to anon, authenticated
  using (true);

-- Sensitive workflow datasets
alter table public.reports enable row level security;
alter table public.evidence enable row level security;
alter table public.report_status_events enable row level security;

-- Public can submit reports; reads/updates are reserved for reviewers/admins.
drop policy if exists "public_insert_reports" on public.reports;
create policy "public_insert_reports" on public.reports
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "reviewer_read_reports" on public.reports;
create policy "reviewer_read_reports" on public.reports
  for select
  to authenticated
  using (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') in ('admin', 'reviewer')
  );

drop policy if exists "reviewer_update_reports" on public.reports;
create policy "reviewer_update_reports" on public.reports
  for update
  to authenticated
  using (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') in ('admin', 'reviewer')
  )
  with check (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') in ('admin', 'reviewer')
  );

-- Evidence and timeline should only be visible/modifiable to reviewers/admins.
drop policy if exists "reviewer_read_evidence" on public.evidence;
create policy "reviewer_read_evidence" on public.evidence
  for select
  to authenticated
  using (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') in ('admin', 'reviewer')
  );

drop policy if exists "reviewer_write_evidence" on public.evidence;
create policy "reviewer_write_evidence" on public.evidence
  for all
  to authenticated
  using (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') in ('admin', 'reviewer')
  )
  with check (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') in ('admin', 'reviewer')
  );

drop policy if exists "reviewer_read_report_status_events" on public.report_status_events;
create policy "reviewer_read_report_status_events" on public.report_status_events
  for select
  to authenticated
  using (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') in ('admin', 'reviewer')
  );

drop policy if exists "reviewer_write_report_status_events" on public.report_status_events;
create policy "reviewer_write_report_status_events" on public.report_status_events
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
  'report-evidence',
  'report-evidence',
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
    bucket_id = 'report-evidence'
    and coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') in ('admin', 'reviewer')
  );

drop policy if exists "reviewer_write_report_evidence_objects" on storage.objects;
create policy "reviewer_write_report_evidence_objects" on storage.objects
  for all
  to authenticated
  using (
    bucket_id = 'report-evidence'
    and coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') in ('admin', 'reviewer')
  )
  with check (
    bucket_id = 'report-evidence'
    and coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') in ('admin', 'reviewer')
  );
