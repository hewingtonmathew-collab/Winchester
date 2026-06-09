import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

export interface ScanResult {
  url: string;
  lighthouse: {
    score: number; // 0-100
    violations: { id: string; impact: string; description: string; wcag: string[] }[];
  } | null;
  lighthouseError?: string;
  // Pre-filled answers keyed by AccessibilityChecker item id
  suggestedAnswers: Record<string, "yes" | "no" | "partial">;
}

// Map Lighthouse audit ids to our questionnaire item ids
const LIGHTHOUSE_MAP: Record<string, string[]> = {
  "image-alt":           ["p1"],
  "video-caption":       ["p2"],
  "color-contrast":      ["p5"],
  "keyboard":            ["o1"],
  "focus-visible":       ["o2"],
  "bypass":              ["o3"],
  "document-title":      ["o4"],
  "link-name":           ["o5"],
  "html-has-lang":       ["u1"],
  "label":               ["u2"],
  "definition-list":     ["u4"],
  "duplicate-id":        ["r1"],
  "button-name":         ["r2"],
  "aria-allowed-attr":   ["r2"],
  "aria-required-attr":  ["r2"],
};

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "url required" }, { status: 400 });
  }

  // Normalise URL
  const target = url.startsWith("http") ? url : `https://${url}`;

  const result: ScanResult = {
    url: target,
    lighthouse: null,
    suggestedAnswers: {},
  };

  // ── 1. PageSpeed Insights (Lighthouse) ──────────────────────────────────────
  try {
    const apiKey = process.env.GOOGLE_PSI_API_KEY ?? "";
    const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(target)}&strategy=mobile&category=accessibility${apiKey ? `&key=${apiKey}` : ""}`;
    const psiRes = await fetch(psiUrl, { signal: AbortSignal.timeout(20000) });
    if (psiRes.ok) {
      const psi = await psiRes.json();
      const cats = psi.lighthouseResult?.categories?.accessibility;
      const audits = psi.lighthouseResult?.audits ?? {};
      const lhScore = cats ? Math.round(cats.score * 100) : null;

      const violations: { id: string; impact: string; description: string; wcag: string[] }[] = [];

      // Walk every audit in the accessibility category
      const auditRefs: { id: string }[] = cats?.auditRefs ?? [];
      for (const ref of auditRefs) {
        const audit = audits[ref.id];
        if (!audit || audit.score === 1 || audit.score === null) continue;
        const wcag: string[] = [];
        (audit.details?.items ?? []).forEach((item: Record<string, unknown>) => {
          const node = item?.node as Record<string, unknown> | undefined;
          if (node?.nodeLabel) wcag.push(String(node.nodeLabel).slice(0, 60));
        });
        violations.push({
          id: ref.id,
          impact: audit.score === 0 ? "critical" : "serious",
          description: audit.title ?? ref.id,
          wcag,
        });

        // Map to questionnaire answers
        const mapped = LIGHTHOUSE_MAP[ref.id] ?? [];
        for (const qid of mapped) {
          result.suggestedAnswers[qid] = audit.score === 0 ? "no" : "partial";
        }
      }

      if (lhScore !== null) {
        result.lighthouse = { score: lhScore, violations };
      }
    } else {
      result.lighthouseError = `PageSpeed API returned ${psiRes.status}`;
    }
  } catch (e) {
    result.lighthouseError = e instanceof Error ? e.message : "Lighthouse scan failed";
  }

  return NextResponse.json(result);
}
