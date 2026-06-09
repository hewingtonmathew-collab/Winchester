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

export async function saveSubmission(s: Omit<Submission, "id" | "date">): Promise<Submission> {
  const all = getSubmissions();
  const entry: Submission = { ...s, id: crypto.randomUUID(), date: new Date().toISOString() };

  // Always save to localStorage as immediate fallback
  localStorage.setItem(KEY, JSON.stringify([entry, ...all]));
  if (entry.gaps && entry.gaps.length > 0) {
    localStorage.setItem(`safeshield_gaps_${entry.id}`, JSON.stringify(entry.gaps));
  }

  // Save to Supabase immediately and await it
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await saveReportToSupabase(entry, session.user.id);
    }
  } catch (e) {
    console.error("Supabase save failed:", e);
  }

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
  const { data: membership } = await supabase
    .from("org_members")
    .select("org_id, school_id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("reports").upsert({
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
  }, { onConflict: "id" });

  if (error) console.error("Failed to save report to Supabase:", error);
}
