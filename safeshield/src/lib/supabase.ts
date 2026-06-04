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
