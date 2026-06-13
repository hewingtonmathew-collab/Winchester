-- ═══════════════════════════════════════════════════════════════════════════
-- SAFESHIELD — SEASONAL THEME ASSIGNMENTS
-- ═══════════════════════════════════════════════════════════════════════════
-- Run in Supabase → SQL Editor. Idempotent (safe to re-run).
--
-- Creates the theme_assignments table. Super admin assigns a seasonal theme
-- (christmas, halloween, easter, summer, new-year) to a MAT, school, or user.
-- Resolution order: user > school > org (most specific wins).
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists public.theme_assignments (
  id           uuid primary key default gen_random_uuid(),
  theme_slug   text not null,
  target_type  text not null check (target_type in ('org', 'school', 'user')),
  target_id    uuid not null,
  banner_url   text default null,
  assigned_by  uuid references auth.users(id) on delete set null,
  created_at   timestamptz not null default now(),
  unique (target_type, target_id)   -- one active theme per target
);

-- Enable RLS
alter table public.theme_assignments enable row level security;

-- Super admin: full access
create policy theme_assignments_super_admin on theme_assignments
  for all to authenticated
  using (
    coalesce(((auth.jwt() -> 'app_metadata') ->> 'role') = 'admin', false)
  )
  with check (
    coalesce(((auth.jwt() -> 'app_metadata') ->> 'role') = 'admin', false)
  );

-- All authenticated users: read theme assignments that apply to them
create policy theme_assignments_read on theme_assignments
  for select to authenticated
  using (
    -- own user assignment
    (target_type = 'user' and target_id = auth.uid())
    -- school or org they belong to
    or exists (
      select 1 from public.org_members om
      where om.user_id = auth.uid()
        and (
          (target_type = 'school' and target_id = om.school_id)
          or (target_type = 'org'    and target_id = om.org_id)
        )
    )
  );

-- Index for fast resolution
create index if not exists idx_theme_assignments_target on theme_assignments (target_type, target_id);

-- Storage bucket for custom theme banner images
-- Run separately in Supabase → Storage if the bucket doesn't exist:
-- insert into storage.buckets (id, name, public) values ('theme-assets', 'theme-assets', true)
-- on conflict do nothing;
