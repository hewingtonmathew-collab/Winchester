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
  created_by: string | null;
  created_at: string;
};

export type School = {
  id: string;
  org_id: string;
  name: string;
  email: string | null;
  created_at: string;
};

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
  created_by: string | null;
  created_at: string;
};
