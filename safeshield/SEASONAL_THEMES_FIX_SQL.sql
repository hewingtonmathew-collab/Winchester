-- ═══════════════════════════════════════════════════════════════════════════
-- SAFESHIELD — SEASONAL THEMES — SAFE RE-RUN FIX
-- Run this in Supabase → SQL Editor if themes are not working.
-- Safe to run multiple times.
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Create table (if it doesn't already exist)
create table if not exists public.theme_assignments (
  id           uuid primary key default gen_random_uuid(),
  theme_slug   text not null,
  target_type  text not null check (target_type in ('org', 'school', 'user')),
  target_id    uuid not null,
  banner_url   text default null,
  assigned_by  uuid references auth.users(id) on delete set null,
  created_at   timestamptz not null default now(),
  unique (target_type, target_id)
);

-- 2. Enable RLS
alter table public.theme_assignments enable row level security;

-- 3. Drop existing policies (safe re-run)
drop policy if exists theme_assignments_super_admin on public.theme_assignments;
drop policy if exists theme_assignments_read on public.theme_assignments;

-- 4. Super admin: full access (INSERT, UPDATE, DELETE, SELECT)
create policy theme_assignments_super_admin on public.theme_assignments
  for all to authenticated
  using (
    coalesce(((auth.jwt() -> 'app_metadata') ->> 'role') = 'admin', false)
  )
  with check (
    coalesce(((auth.jwt() -> 'app_metadata') ->> 'role') = 'admin', false)
  );

-- 5. Regular users: read only their own relevant assignments
create policy theme_assignments_read on public.theme_assignments
  for select to authenticated
  using (
    (target_type = 'user' and target_id = auth.uid())
    or exists (
      select 1 from public.org_members om
      where om.user_id = auth.uid()
        and (
          (target_type = 'school' and target_id = om.school_id)
          or (target_type = 'org'    and target_id = om.org_id)
        )
    )
  );

-- 6. Index for fast resolution
create index if not exists idx_theme_assignments_target
  on public.theme_assignments (target_type, target_id);

-- ── Storage bucket (run if theme-assets bucket doesn't exist) ───────────────
-- insert into storage.buckets (id, name, public)
-- values ('theme-assets', 'theme-assets', true)
-- on conflict do nothing;
