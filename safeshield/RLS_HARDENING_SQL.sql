-- ═══════════════════════════════════════════════════════════════════════════
-- SAFESHIELD — RLS HARDENING & DATA COMPARTMENTALISATION
-- ═══════════════════════════════════════════════════════════════════════════
-- Run in Supabase → SQL Editor. Idempotent (safe to re-run).
--
-- Closes:
--   1. org_members privilege-escalation hole (members_insert CHECK(true))
--   2. MAT cross-school leak on reports (org admin read ignored school_id)
--   4. organisations self-join typo blocking org reads
--   5. schools cross-school enumeration
--   6. duplicate/redundant report policies
--
-- Uses the JWT app_metadata->>role mechanism (matches existing core tables)
-- and SECURITY DEFINER helpers to avoid RLS recursion and improve performance.
--
-- ── ROLE MODEL ───────────────────────────────────────────────────────────────
--   Super admin     : JWT app_metadata.role = 'admin'         → everything
--   MAT admin        : org_members.role='admin', school_id IS NULL → whole trust
--   School user      : org_members.school_id = <school>          → that school only
--                      (even if role='admin' — a school-scoped admin is NOT a MAT admin)
--   Basic user       : no membership                            → own reports only
-- ═══════════════════════════════════════════════════════════════════════════


-- ── 0. HELPER FUNCTIONS (SECURITY DEFINER bypasses RLS → no recursion) ────────

create or replace function public.is_super_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(((auth.jwt() -> 'app_metadata') ->> 'role') = 'admin', false);
$$;

-- TRUE only for a trust-level admin (admin with NO specific school assigned).
create or replace function public.is_mat_admin(target_org uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.org_members
    where user_id = auth.uid()
      and org_id  = target_org
      and role    = 'admin'
      and school_id is null
  );
$$;

-- TRUE if the current user belongs to this specific school.
create or replace function public.is_member_of_school(target_school uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.org_members
    where user_id = auth.uid()
      and school_id = target_school
  );
$$;

-- TRUE if the current user is any admin (school- or trust-level) of this org.
create or replace function public.is_org_admin_any(target_org uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.org_members
    where user_id = auth.uid()
      and org_id  = target_org
      and role    = 'admin'
  );
$$;


-- ── 1. ORG_MEMBERS — close the privilege-escalation hole ──────────────────────
-- Previously: members_insert CHECK(true) → anyone could self-grant org admin.
-- Now: you may insert a membership row ONLY if you are super admin, an existing
-- admin of that org, OR you are attaching YOURSELF to an org YOU created
-- (the self-registration bootstrap path).

drop policy if exists members_insert on org_members;

create policy members_insert on org_members
  for insert to authenticated
  with check (
    is_super_admin()
    or is_org_admin_any(org_id)
    or (
      user_id = auth.uid()
      and exists (
        select 1 from public.organisations o
        where o.id = org_members.org_id
          and o.created_by = auth.uid()
      )
    )
  );

-- (members_read / members_manage / members_super_admin are left intact — they
--  already use auth.uid() / JWT / is_org_admin and are sound.)


-- ── 2 + 6. REPORTS — fix MAT cross-school leak + consolidate duplicates ───────
-- Drop the redundant/leaky read policies and recreate a clean, minimal set.

drop policy if exists reports_admin_all        on reports;
drop policy if exists reports_super_admin       on reports;
drop policy if exists reports_insert            on reports;
drop policy if exists reports_insert_own        on reports;
drop policy if exists reports_read_own          on reports;
drop policy if exists reports_select_own        on reports;
drop policy if exists reports_org_admin_read    on reports;
drop policy if exists reports_read_org_admin    on reports;
drop policy if exists reports_read_member       on reports;
drop policy if exists reports_delete            on reports;

-- Super admin: full access.
create policy reports_super_admin on reports
  for all to authenticated
  using (is_super_admin()) with check (is_super_admin());

-- Owner: read their own reports.
create policy reports_read_own on reports
  for select to authenticated
  using (created_by = auth.uid());

-- MAT admin: read every report in their trust (school_id-agnostic) —
-- but ONLY a true trust-level admin (school_id IS NULL membership).
create policy reports_mat_admin_read on reports
  for select to authenticated
  using (org_id is not null and is_mat_admin(org_id));

-- School user: read ONLY their own school's reports.
create policy reports_school_read on reports
  for select to authenticated
  using (school_id is not null and is_member_of_school(school_id));

-- Insert: must be the creator AND may only attribute the report to a school/org
-- the user actually belongs to (prevents forging reports into other schools).
create policy reports_insert on reports
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and (
      is_super_admin()
      or (school_id is null and org_id is null)               -- personal/unscoped
      or (school_id is not null and is_member_of_school(school_id))
      or (org_id is not null and is_org_admin_any(org_id))
    )
  );

-- Update own (covers the upsert path).
create policy reports_update_own on reports
  for update to authenticated
  using (created_by = auth.uid()) with check (created_by = auth.uid());

-- Delete own or super admin.
create policy reports_delete on reports
  for delete to authenticated
  using (created_by = auth.uid() or is_super_admin());


-- ── 4. ORGANISATIONS — fix the self-join typo blocking member reads ──────────
drop policy if exists orgs_read_member on organisations;

create policy orgs_read_member on organisations
  for select to authenticated
  using (
    is_super_admin()
    or exists (
      select 1 from public.org_members om
      where om.org_id = organisations.id          -- was org_members.id (bug)
        and om.user_id = auth.uid()
    )
  );

-- (orgs_create / orgs_super_admin left intact.)


-- ── 5. SCHOOLS — stop cross-school enumeration by school-scoped users ─────────
drop policy if exists schools_read on schools;

create policy schools_read on schools
  for select to authenticated
  using (
    is_super_admin()
    or is_mat_admin(org_id)                 -- trust admin sees all trust schools
    or is_member_of_school(id)              -- school user sees only their school
  );

-- (schools_manage / schools_super_admin left intact.)


-- ── 9. INDEXES — keep the EXISTS/IN subqueries fast at scale ──────────────────
create index if not exists idx_org_members_user      on org_members (user_id);
create index if not exists idx_org_members_org        on org_members (org_id);
create index if not exists idx_org_members_school     on org_members (school_id);
create index if not exists idx_reports_org            on reports (org_id);
create index if not exists idx_reports_school         on reports (school_id);
create index if not exists idx_reports_created_by     on reports (created_by);


-- ── ROLLBACK (run only if something breaks) ───────────────────────────────────
-- alter table org_members  disable row level security;
-- alter table reports       disable row level security;
-- alter table schools       disable row level security;
-- alter table organisations disable row level security;
-- (then re-create the original policies from your backup)
