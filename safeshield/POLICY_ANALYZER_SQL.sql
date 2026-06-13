-- ── Policy Analyzer: Reference Documents & Register ──────────────────────────
-- Run this once in your Supabase SQL editor.

-- Reference document library (admin-managed, grounds the AI)
CREATE TABLE IF NOT EXISTS policy_reference_docs (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text        NOT NULL,
  category     text        NOT NULL DEFAULT 'guidance',
  -- category: legislation | guidance | framework | template
  description  text,
  content      text        NOT NULL,
  source_url   text,
  is_active    boolean     NOT NULL DEFAULT true,
  uploaded_by  uuid        REFERENCES auth.users ON DELETE SET NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE policy_reference_docs ENABLE ROW LEVEL SECURITY;

-- Super admin: full CRUD
CREATE POLICY "policy_ref_docs_admin_all" ON policy_reference_docs
  FOR ALL TO authenticated
  USING   (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- All authenticated users: read active docs (needed for analysis)
CREATE POLICY "policy_ref_docs_read_active" ON policy_reference_docs
  FOR SELECT TO authenticated
  USING (is_active = true);


-- Policy register (one row per completed analysis)
CREATE TABLE IF NOT EXISTS policy_register (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by       uuid        REFERENCES auth.users ON DELETE SET NULL,
  school_id        uuid        REFERENCES schools(id) ON DELETE CASCADE,
  org_id           uuid        REFERENCES organisations(id) ON DELETE CASCADE,
  policy_title     text        NOT NULL,
  policy_type      text        NOT NULL,
  overall_status   text        NOT NULL,   -- compliant | needs_update | non_compliant
  summary          text,
  stats            jsonb       NOT NULL DEFAULT '{}',
  findings         jsonb       NOT NULL DEFAULT '[]',
  accepted_ids     text[]      NOT NULL DEFAULT '{}',
  changes          jsonb       NOT NULL DEFAULT '[]',
  revised_policy   text,
  school_profile   jsonb       NOT NULL DEFAULT '{}',
  review_cycle     text,
  review_due_at    date,
  ref_doc_ids      uuid[]      NOT NULL DEFAULT '{}',  -- which docs grounded this analysis
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE policy_register ENABLE ROW LEVEL SECURITY;

-- Super admin: full access
CREATE POLICY "policy_register_admin_all" ON policy_register
  FOR ALL TO authenticated
  USING   (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Users: see and manage their own records
CREATE POLICY "policy_register_own" ON policy_register
  FOR ALL TO authenticated
  USING   (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Org/school members: read records for their school or org
CREATE POLICY "policy_register_org_read" ON policy_register
  FOR SELECT TO authenticated
  USING (
    school_id IN (
      SELECT school_id FROM org_members
      WHERE user_id = auth.uid() AND school_id IS NOT NULL
    )
    OR org_id IN (
      SELECT org_id FROM org_members WHERE user_id = auth.uid()
    )
  );
