-- ── Training module updates ──────────────────────────────────────────────────

-- 1. Add pitch field to lessons (short intro shown above content)
ALTER TABLE training_lessons ADD COLUMN IF NOT EXISTS pitch text;

-- 2. Add video_url editable in admin (already exists, just making sure)
-- training_lessons.video_url already exists from initial schema

-- 3. Allow admin to grant quiz retakes per lesson
ALTER TABLE training_progress ADD COLUMN IF NOT EXISTS retake_allowed boolean DEFAULT false;

-- 4. Learning completion reports (super admin only)
CREATE TABLE IF NOT EXISTS training_completion_reports (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users NOT NULL,
  course_id   uuid REFERENCES training_courses ON DELETE CASCADE NOT NULL,
  report_text text NOT NULL,
  created_by  uuid REFERENCES auth.users,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE training_completion_reports ENABLE ROW LEVEL SECURITY;

-- Admin: full access
CREATE POLICY "Admin full access on completion reports"
  ON training_completion_reports FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Learners: read their own reports
CREATE POLICY "Users read own completion reports"
  ON training_completion_reports FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- ── Certificate visibility ─────────────────────────────────────────────────
-- training_progress already holds the completion + score that IS the cert record.
-- Org/school admins (org_members with role='admin') can view their members' progress:
CREATE POLICY "Org admins read members training progress"
  ON training_progress FOR SELECT TO authenticated
  USING (
    -- Super admin sees all
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    OR
    -- Learner sees own
    user_id = auth.uid()
    OR
    -- Org/school admin sees members in same org
    EXISTS (
      SELECT 1 FROM org_members om_viewer
      JOIN org_members om_learner ON om_learner.org_id = om_viewer.org_id
      WHERE om_viewer.user_id = auth.uid()
        AND om_viewer.role = 'admin'
        AND om_learner.user_id = training_progress.user_id
    )
  );

-- Drop the default open policy if it exists (replace with above)
-- If you have an existing "Users manage own progress" policy, drop it first:
-- DROP POLICY IF EXISTS "Users manage own progress" ON training_progress;
