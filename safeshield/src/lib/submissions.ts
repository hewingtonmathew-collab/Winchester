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
  // Always persist gaps to localStorage by report ID so they survive page reloads
  if (entry.gaps && entry.gaps.length > 0 && typeof window !== "undefined") {
    localStorage.setItem(`safeshield_gaps_${entry.id}`, JSON.stringify(entry.gaps));
  }
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
    id: s.id,
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
    recommendations: s.gaps || null,
    created_by: userId,
    org_id: membership?.org_id || null,
    school_id: membership?.school_id || null,
  });
  if (error) console.error("Failed to save report to Supabase:", error);

  // Also persist gaps to site_content as a reliable fallback (recommendations column may not exist yet)
  if (s.gaps && s.gaps.length > 0) {
    try {
      await supabase.from("site_content").upsert(
        { key: `report_gaps_${s.id}`, value: JSON.stringify(s.gaps), updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );
    } catch { /* ignore */ }
  }
}
