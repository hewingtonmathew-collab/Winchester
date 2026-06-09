-- Training & Certification Module
-- Run this in Supabase SQL Editor

-- Courses
CREATE TABLE IF NOT EXISTS training_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'General',
  level text NOT NULL DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  duration_minutes int NOT NULL DEFAULT 30,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  thumbnail_color text DEFAULT '#8B5CF6',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Sections (chapters within a course)
CREATE TABLE IF NOT EXISTS training_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES training_courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Lessons
CREATE TABLE IF NOT EXISTS training_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES training_courses(id) ON DELETE CASCADE,
  section_id uuid NOT NULL REFERENCES training_sections(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text,
  video_url text,
  duration_minutes int NOT NULL DEFAULT 5,
  sort_order int NOT NULL DEFAULT 0,
  has_quiz boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Quiz questions
CREATE TABLE IF NOT EXISTS training_quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES training_lessons(id) ON DELETE CASCADE,
  question text NOT NULL,
  options jsonb NOT NULL DEFAULT '[]',
  correct_answer int NOT NULL DEFAULT 0,
  explanation text,
  sort_order int NOT NULL DEFAULT 0
);

-- User progress (one row per user per lesson)
CREATE TABLE IF NOT EXISTS training_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES training_courses(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES training_lessons(id) ON DELETE CASCADE,
  completed boolean NOT NULL DEFAULT false,
  quiz_score int,
  quiz_passed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Course assignments (optional: assign specific courses to users/orgs/schools)
CREATE TABLE IF NOT EXISTS training_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES training_courses(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id uuid REFERENCES organisations(id) ON DELETE CASCADE,
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  assigned_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  due_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS Policies
ALTER TABLE training_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_assignments ENABLE ROW LEVEL SECURITY;

-- Published courses visible to all authenticated users
CREATE POLICY "courses_select" ON training_courses
  FOR SELECT TO authenticated
  USING (status = 'published' OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Sections/lessons/quizzes: visible if course is published or user is admin
CREATE POLICY "sections_select" ON training_sections
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM training_courses tc
    WHERE tc.id = training_sections.course_id
    AND (tc.status = 'published' OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  ));

CREATE POLICY "lessons_select" ON training_lessons
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM training_courses tc
    WHERE tc.id = training_lessons.course_id
    AND (tc.status = 'published' OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  ));

CREATE POLICY "quizzes_select" ON training_quizzes
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM training_lessons tl
    JOIN training_courses tc ON tc.id = tl.course_id
    WHERE tl.id = training_quizzes.lesson_id
    AND (tc.status = 'published' OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  ));

-- Users can read/write their own progress
CREATE POLICY "progress_select" ON training_progress
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "progress_insert" ON training_progress
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "progress_update" ON training_progress
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Admins can manage courses
CREATE POLICY "courses_admin" ON training_courses FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "sections_admin" ON training_sections FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "lessons_admin" ON training_lessons FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "quizzes_admin" ON training_quizzes FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "assignments_admin" ON training_assignments FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
