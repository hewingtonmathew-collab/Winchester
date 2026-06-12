import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin" | "user";
  status: "pending" | "active" | "suspended";
  org_type: "la_school" | "single_school" | "mat" | null;
  avatar_url: string | null;
  created_at: string;
};

export const ALL_TOOLS = [
  { slug: "safeguarding", name: "Safeguarding Risk Checker" },
  { slug: "governance", name: "Governance Compliance Checker" },
  { slug: "ai-readiness", name: "AI Readiness Assessment" },
  { slug: "dpia", name: "DPIA Wizard" },
  { slug: "accessibility", name: "Web Accessibility Checker" },
  { slug: "ofsted", name: "Ofsted Ready Checker" },
  { slug: "ai-detector", name: "AI Content Detector" },
  { slug: "digital-standards", name: "Digital Standards Checker" },
  { slug: "health-safety", name: "Health & Safety Checker" },
  // Screen Use, AI, SEND & Digital Safety Suite
  { slug: "screen-use", name: "Screen Use & Wellbeing Review" },
  { slug: "ai-risk", name: "AI Use Risk Assessment" },
  { slug: "send-digital", name: "SEND Digital Impact Review" },
  { slug: "filtering-monitoring", name: "Filtering & Monitoring Assurance" },
  { slug: "data-privacy", name: "Data Protection & AI Privacy" },
  { slug: "governor-dashboard", name: "Governor Digital Dashboard" },
  // Training & Certification Module
  { slug: "training", name: "Training & Certification" },
  // Policy Review
  { slug: "policy-analyzer", name: "Policy Analyzer" },
];

export type Organisation = {
  id: string;
  name: string;
  type: "school" | "mat";
  manager_name: string | null;
  notes: string | null;
  logo_url: string | null;
  status: "active" | "disabled";
  created_by: string | null;
  created_at: string;
};

export type School = {
  id: string;
  org_id: string;
  name: string;
  email: string | null;
  logo_url: string | null;
  status: "active" | "disabled";
  created_at: string;
};

// Tool entitlements exist at three levels: user, org, and school.
// A user can SEE a tool only if ALL of the following hold:
//   1. The super admin enabled it for that user (user_tools).
//   2. The user's org has it enabled (org_tools) — OR the org has no
//      org_tools rows at all (no restriction configured).
//   3. The user's school has it enabled (school_tools) — OR the school
//      has no school_tools rows at all (no restriction configured).
// Additionally, if the user's org or school status is 'disabled', the
// user loses access to all tools. The super admin panel is the single
// place where every one of these toggles is set.
export type OrgTool = { id: string; org_id: string; tool_slug: string; enabled: boolean };
export type SchoolTool = { id: string; school_id: string; tool_slug: string; enabled: boolean };

export type OrgMember = {
  id: string;
  user_id: string;
  org_id: string;
  school_id: string | null;
  role: "admin" | "member";
  created_at: string;
};

// ── Training & Certification types ───────────────────────────────────────────
export type TrainingCourse = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  duration_minutes: number;
  status: "draft" | "published";
  thumbnail_color: string | null;
  created_by: string | null;
  created_at: string;
};

export type TrainingSection = {
  id: string;
  course_id: string;
  title: string;
  sort_order: number;
};

export type TrainingLesson = {
  id: string;
  course_id: string;
  section_id: string;
  title: string;
  pitch: string | null;
  content: string | null;
  video_url: string | null;
  duration_minutes: number;
  sort_order: number;
  has_quiz: boolean;
};

export type TrainingQuiz = {
  id: string;
  lesson_id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string | null;
  sort_order: number;
};

export type TrainingProgress = {
  id: string;
  user_id: string;
  course_id: string;
  lesson_id: string;
  completed: boolean;
  quiz_score: number | null;
  quiz_passed: boolean;
  completed_at: string | null;
  retake_allowed: boolean;
};

export type SchoolTrainingProfile = {
  id: string;
  school_id: string;
  head_teacher: string | null;
  dsl_name: string | null;
  dpo_name: string | null;
  chair_of_governors: string | null;
  updated_at: string;
  updated_by: string | null;
};

export type TrainingCompletionReport = {
  id: string;
  user_id: string;
  course_id: string;
  report_text: string;
  created_by: string | null;
  created_at: string;
};

export type TrainingAssignment = {
  id: string;
  course_id: string;
  user_id: string | null;
  org_id: string | null;
  school_id: string | null;
  assigned_by: string | null;
  due_date: string | null;
  created_at: string;
};
// ─────────────────────────────────────────────────────────────────────────────

export type Report = {
  id: string;
  school_id: string | null;
  org_id: string | null;
  tool_slug: string;
  tool_name: string;
  school_name: string;
  school_email: string | null;
  staff_member: string | null;
  consultant_name: string | null;
  consultant_email: string | null;
  score: number;
  rating: string;
  rating_color: string;
  logo_data_url: string | null;
  areas: { name: string; score?: number }[] | null;
  recommendations: { category: string; text: string; priority: "high" | "medium" | "low" }[] | null;
  created_by: string | null;
  created_at: string;
};

// ── Policy Analyzer ───────────────────────────────────────────────────────────
export type PolicyReferenceDoc = {
  id: string;
  title: string;
  category: "legislation" | "guidance" | "framework" | "template";
  description: string | null;
  content: string;
  source_url: string | null;
  is_active: boolean;
  uploaded_by: string | null;
  created_at: string;
};

export type PolicyRegisterEntry = {
  id: string;
  created_by: string | null;
  school_id: string | null;
  org_id: string | null;
  policy_title: string;
  policy_type: string;
  overall_status: "compliant" | "needs_update" | "non_compliant";
  summary: string | null;
  stats: { critical: number; high: number; medium: number; low: number };
  findings: object[];
  accepted_ids: string[];
  changes: object[];
  revised_policy: string | null;
  school_profile: object;
  review_cycle: string | null;
  review_due_at: string | null;
  ref_doc_ids: string[];
  created_at: string;
  updated_at: string;
};
