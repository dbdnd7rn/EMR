-- EnVizion Life Digital Caregiver Toolkit
-- Initial non-PHI content catalog only.
-- Personal caregiver / patient tracking is intentionally excluded until
-- privacy, hosting, retention, access, and compliance requirements are confirmed.

create extension if not exists pgcrypto;

create table if not exists public.conditions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  specialist_name text,
  status text not null default 'draft' check (status in ('draft', 'review', 'published', 'archived')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.condition_sections (
  id uuid primary key default gen_random_uuid(),
  condition_id uuid not null references public.conditions(id) on delete cascade,
  slug text not null,
  title text not null,
  body text not null default '',
  section_type text not null default 'education',
  status text not null default 'draft' check (status in ('draft', 'review', 'published', 'archived')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(condition_id, slug)
);

create table if not exists public.specialists (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  role text not null default '',
  focus text not null default '',
  status text not null default 'draft' check (status in ('draft', 'review', 'published', 'archived')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.action_plans (
  id uuid primary key default gen_random_uuid(),
  condition_id uuid not null references public.conditions(id) on delete cascade,
  title text not null,
  intro text not null default '',
  status text not null default 'draft' check (status in ('draft', 'review', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.action_plan_zones (
  id uuid primary key default gen_random_uuid(),
  action_plan_id uuid not null references public.action_plans(id) on delete cascade,
  zone_key text not null check (zone_key in ('green', 'yellow', 'red')),
  label text not null,
  title text not null,
  summary text not null default '',
  instructions text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(action_plan_id, zone_key)
);

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  resource_type text not null default 'link' check (resource_type in ('link', 'video', 'download', 'text')),
  url text,
  status text not null default 'draft' check (status in ('draft', 'review', 'published', 'archived')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_versions (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  version_number integer not null,
  change_note text not null default '',
  approved_by text,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  unique(entity_type, entity_id, version_number)
);

alter table public.conditions enable row level security;
alter table public.condition_sections enable row level security;
alter table public.specialists enable row level security;
alter table public.action_plans enable row level security;
alter table public.action_plan_zones enable row level security;
alter table public.resources enable row level security;
alter table public.content_versions enable row level security;

create policy "published conditions are readable"
on public.conditions for select
using (status = 'published');

create policy "published condition sections are readable"
on public.condition_sections for select
using (status = 'published');

create policy "published specialists are readable"
on public.specialists for select
using (status = 'published');

create policy "published action plans are readable"
on public.action_plans for select
using (status = 'published');

create policy "zones for published plans are readable"
on public.action_plan_zones for select
using (
  exists (
    select 1 from public.action_plans ap
    where ap.id = action_plan_id and ap.status = 'published'
  )
);

create policy "published resources are readable"
on public.resources for select
using (status = 'published');

-- No client-side write policies are added in this migration.
-- Admin publishing will be introduced later with explicit authorization rules.
