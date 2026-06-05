import { supabase } from "@/lib/supabase";

export type Submission = {
  id: string;
  tool: string;
  schoolName: string;
  schoolEmail: string;
  consultantName: string;
  consultantEmail: string;
  staffMember: string;
  logoDataUrl: string | null;
  score: number;
  rating: string;
  ratingColor: string;
  date: string;
  areas?: { name: string; score?: number }[];
  gaps?: { category: string; text: string; priority: "high" | "medium" | "low" }[];
};

const KEY = "safeshield_submissions";

export function saveSubmission(s: Omit<Submission, "id" | "date">): Submission {
  const all = getSubmissions();
  const entry: Submission = { ...s, id: crypto.randomUUID(), date: new Date().toISOString() };
  localStorage.setItem(KEY, JSON.stringify([entry, ...all]));
  // Fire-and-forget save to Supabase
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session?.user) saveReportToSupabase(entry, session.user.id);
  });
  return entry;
}

export function getSubmissions(): Submission[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); }
  catch { return []; }
}

export function deleteSubmission(id: string) {
  const all = getSubmissions().filter((s) => s.id !== id);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export async function saveReportToSupabase(s: Submission, userId: string) {
  // Look up the user's org and school membership
  const { data: membership } = await supabase
    .from("org_members")
    .select("org_id, school_id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("reports").insert({
    tool_slug: s.tool.toLowerCase().replace(/\s+/g, "-"),
    tool_name: s.tool,
    school_name: s.schoolName,
    school_email: s.schoolEmail || null,
    staff_member: s.staffMember || null,
    consultant_name: s.consultantName || null,
    consultant_email: s.consultantEmail || null,
    score: s.score,
    rating: s.rating,
    rating_color: s.ratingColor,
    logo_data_url: s.logoDataUrl || null,
    areas: s.areas || null,
    created_by: userId,
    org_id: membership?.org_id || null,
    school_id: membership?.school_id || null,
  });
  if (error) console.error("Failed to save report to Supabase:", error);
}
