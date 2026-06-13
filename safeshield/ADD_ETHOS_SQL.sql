-- ═══════════════════════════════════════════════════════════════════════════
-- SAFESHIELD — ADD ETHOS FIELD TO SCHOOLS AND ORGANISATIONS
-- ═══════════════════════════════════════════════════════════════════════════
-- Run in Supabase → SQL Editor. Idempotent (safe to re-run).
--
-- Adds an optional free-text ethos/motto field to both tables.
-- Displayed on the dashboard identity banner beneath the school/org name.
-- Set by super admin during school/org setup or editing.
-- ═══════════════════════════════════════════════════════════════════════════

alter table public.schools
  add column if not exists ethos text default null;

alter table public.organisations
  add column if not exists ethos text default null;
