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
};

const KEY = "safeshield_submissions";

export function saveSubmission(s: Omit<Submission, "id" | "date">): Submission {
  const all = getSubmissions();
  const entry: Submission = {
    ...s,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify([entry, ...all]));
  return entry;
}

export function getSubmissions(): Submission[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function deleteSubmission(id: string) {
  const all = getSubmissions().filter((s) => s.id !== id);
  localStorage.setItem(KEY, JSON.stringify(all));
}
