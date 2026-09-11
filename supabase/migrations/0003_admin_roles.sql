-- EnVizion Life Digital Caregiver Toolkit
-- Admin authentication and role-based CMS permissions.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  role text not null check (role in ('admin', 'editor', 'reviewer')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.current_admin_role()
returns text
language sql
stable
security definer
set search_path = public, auth
as $$
  select role
  from public.admin_users
  where user_id = auth.uid()
    and active = true
  limit 1;
$$;

create or replace function public.is_active_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
      and active = true
  );
$$;

create or replace function public.can_write_content_status(target_status text)
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select case public.current_admin_role()
    when 'admin' then target_status in ('draft', 'review', 'approved', 'published', 'archived')
    when 'reviewer' then target_status in ('review', 'approved')
    when 'editor' then target_status in ('draft', 'review')
    else false
  end;
$$;

create policy "admin users can read own role"
on public.admin_users for select
to authenticated
using (user_id = auth.uid());

create policy "admins can read admin directory"
on public.admin_users for select
to authenticated
using (public.current_admin_role() = 'admin');

-- Authenticated CMS users may read draft/review/approved content in addition to
-- the public published-content policies created in earlier migrations.
create policy "cms users can read all conditions"
on public.conditions for select to authenticated
using (public.is_active_admin_user());

create policy "cms users can read all condition sections"
on public.condition_sections for select to authenticated
using (public.is_active_admin_user());

create policy "cms users can read all specialists"
on public.specialists for select to authenticated
using (public.is_active_admin_user());

create policy "cms users can read all specialist guides"
on public.specialist_guides for select to authenticated
using (public.is_active_admin_user());

create policy "cms users can read all action plans"
on public.action_plans for select to authenticated
using (public.is_active_admin_user());

create policy "cms users can read all action plan zones"
on public.action_plan_zones for select to authenticated
using (public.is_active_admin_user());

create policy "cms users can read all resources"
on public.resources for select to authenticated
using (public.is_active_admin_user());

create policy "cms users can read all safety messages"
on public.safety_messages for select to authenticated
using (public.is_active_admin_user());

create policy "cms users can read content versions"
on public.content_versions for select to authenticated
using (public.is_active_admin_user());

-- Status-bearing content tables use role-aware write checks.
create policy "cms users can insert conditions"
on public.conditions for insert to authenticated
with check (public.can_write_content_status(status));
create policy "cms users can update conditions"
on public.conditions for update to authenticated
using (public.is_active_admin_user())
with check (public.can_write_content_status(status));

create policy "cms users can insert condition sections"
on public.condition_sections for insert to authenticated
with check (public.can_write_content_status(status));
create policy "cms users can update condition sections"
on public.condition_sections for update to authenticated
using (public.is_active_admin_user())
with check (public.can_write_content_status(status));

create policy "cms users can insert specialists"
on public.specialists for insert to authenticated
with check (public.can_write_content_status(status));
create policy "cms users can update specialists"
on public.specialists for update to authenticated
using (public.is_active_admin_user())
with check (public.can_write_content_status(status));

create policy "cms users can insert specialist guides"
on public.specialist_guides for insert to authenticated
with check (public.can_write_content_status(status));
create policy "cms users can update specialist guides"
on public.specialist_guides for update to authenticated
using (public.is_active_admin_user())
with check (public.can_write_content_status(status));

create policy "cms users can insert action plans"
on public.action_plans for insert to authenticated
with check (public.can_write_content_status(status));
create policy "cms users can update action plans"
on public.action_plans for update to authenticated
using (public.is_active_admin_user())
with check (public.can_write_content_status(status));

create policy "cms users can insert resources"
on public.resources for insert to authenticated
with check (public.can_write_content_status(status));
create policy "cms users can update resources"
on public.resources for update to authenticated
using (public.is_active_admin_user())
with check (public.can_write_content_status(status));

create policy "cms users can insert safety messages"
on public.safety_messages for insert to authenticated
with check (public.can_write_content_status(status));
create policy "cms users can update safety messages"
on public.safety_messages for update to authenticated
using (public.is_active_admin_user())
with check (public.can_write_content_status(status));

-- Zone rows inherit the action plan's workflow. Editors/reviewers/admins may
-- maintain them while authenticated; publishing remains controlled by the
-- parent action plan status.
create policy "cms users can insert action plan zones"
on public.action_plan_zones for insert to authenticated
with check (public.is_active_admin_user());
create policy "cms users can update action plan zones"
on public.action_plan_zones for update to authenticated
using (public.is_active_admin_user())
with check (public.is_active_admin_user());

-- Version records are append-only from the application. Reviewers and admins
-- may create approval/version events.
create policy "reviewers can create content versions"
on public.content_versions for insert to authenticated
with check (public.current_admin_role() in ('admin', 'reviewer'));

-- No delete policies are granted here. Archiving should be preferred so the
-- editorial history remains auditable.
