-- EnVizion Life Digital Caregiver Toolkit
-- CMS workflow expansion for approved educational content only.
-- No patient/caregiver PHI tables are introduced here.

-- Add the explicit approved state required by the content workflow.
alter table public.conditions drop constraint if exists conditions_status_check;
alter table public.conditions add constraint conditions_status_check
  check (status in ('draft', 'review', 'approved', 'published', 'archived'));

alter table public.condition_sections drop constraint if exists condition_sections_status_check;
alter table public.condition_sections add constraint condition_sections_status_check
  check (status in ('draft', 'review', 'approved', 'published', 'archived'));

alter table public.specialists drop constraint if exists specialists_status_check;
alter table public.specialists add constraint specialists_status_check
  check (status in ('draft', 'review', 'approved', 'published', 'archived'));

alter table public.action_plans drop constraint if exists action_plans_status_check;
alter table public.action_plans add constraint action_plans_status_check
  check (status in ('draft', 'review', 'approved', 'published', 'archived'));

alter table public.resources drop constraint if exists resources_status_check;
alter table public.resources add constraint resources_status_check
  check (status in ('draft', 'review', 'approved', 'published', 'archived'));

create table if not exists public.specialist_guides (
  id uuid primary key default gen_random_uuid(),
  specialist_id uuid references public.specialists(id) on delete set null,
  slug text not null unique,
  title text not null,
  summary text not null default '',
  body text not null default '',
  safety_note text not null default '',
  status text not null default 'draft'
    check (status in ('draft', 'review', 'approved', 'published', 'archived')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.safety_messages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  message text not null,
  severity text not null default 'info'
    check (severity in ('info', 'caution', 'urgent', 'emergency')),
  placement text not null default 'global',
  status text not null default 'draft'
    check (status in ('draft', 'review', 'approved', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.specialist_guides enable row level security;
alter table public.safety_messages enable row level security;

create policy "published specialist guides are readable"
on public.specialist_guides for select
using (status = 'published');

create policy "published safety messages are readable"
on public.safety_messages for select
using (status = 'published');

-- Admin write policies remain intentionally absent until admin authentication
-- and role authorization are implemented and reviewed.
