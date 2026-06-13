-- ── School Training Profiles ─────────────────────────────────────────────────
-- Stores the key safeguarding/data-protection personnel per school.
-- This data is SCHOOL-SPECIFIC — it must never be aggregated at org level.
-- Used in training certificates and learner records.

CREATE TABLE IF NOT EXISTS school_training_profiles (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id            uuid REFERENCES schools(id) ON DELETE CASCADE,
  head_teacher         text,
  dsl_name             text,   -- Designated Safeguarding Lead
  dpo_name             text,   -- Data Protection Officer
  chair_of_governors   text,
  updated_at           timestamptz DEFAULT now(),
  updated_by           uuid REFERENCES auth.users,
  UNIQUE (school_id)
);

ALTER TABLE school_training_profiles ENABLE ROW LEVEL SECURITY;

-- Super admin: full access to all schools
CREATE POLICY "Super admin full access on school_training_profiles"
  ON school_training_profiles FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Org/school admin: read and write their own school only
CREATE POLICY "Org admin manages own school training profile"
  ON school_training_profiles FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM org_members
      WHERE user_id = auth.uid()
        AND school_id = school_training_profiles.school_id
        AND role = 'admin'
    )
  );

-- All authenticated users: read their own school's profile (for certificate display)
CREATE POLICY "Users read own school training profile"
  ON school_training_profiles FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM org_members
      WHERE user_id = auth.uid()
        AND school_id = school_training_profiles.school_id
    )
  );
