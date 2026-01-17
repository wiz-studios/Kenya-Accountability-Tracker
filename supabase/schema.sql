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
