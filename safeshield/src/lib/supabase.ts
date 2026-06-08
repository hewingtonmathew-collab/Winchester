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
