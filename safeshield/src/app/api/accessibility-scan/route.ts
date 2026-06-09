import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

export interface LighthouseCategories {
  accessibility: number;
  performance: number;
  seo: number;
  bestPractices: number;
}

export interface HtmlFinding {
  type: "error" | "warning" | "pass";
  check: string;
  detail: string;
}

export interface ScanResult {
  url: string;
  lighthouse: {
    categories: LighthouseCategories;
    violations: { id: string; impact: string; description: string; wcag: string[] }[];
  } | null;
  lighthouseError?: string;
  htmlFindings: HtmlFinding[];
  suggestedAnswers: Record<string, "yes" | "no" | "partial">;
}

const LIGHTHOUSE_MAP: Record<string, string[]> = {
  "image-alt":          ["p1"],
  "video-caption":      ["p2"],
  "color-contrast":     ["p5"],
  "keyboard":           ["o1"],
  "focus-visible":      ["o2"],
  "bypass":             ["o3"],
  "document-title":     ["o4"],
  "link-name":          ["o5"],
  "html-has-lang":      ["u1"],
  "label":              ["u2"],
  "definition-list":    ["u4"],
  "duplicate-id":       ["r1"],
  "button-name":        ["r2"],
  "aria-allowed-attr":  ["r2"],
  "aria-required-attr": ["r2"],
};

function analyseHtml(html: string): { findings: HtmlFinding[]; answers: Record<string, "yes" | "no" | "partial"> } {
  const findings: HtmlFinding[] = [];
  const answers: Record<string, "yes" | "no" | "partial"> = {};

  // Lang attribute
  if (/<html[^>]+lang\s*=\s*["'][a-z]/i.test(html)) {
    findings.push({ type: "pass", check: "HTML lang attribute", detail: "Page language is declared correctly." });
    answers["u1"] = "yes";
  } else {
    findings.push({ type: "error", check: "HTML lang attribute missing", detail: 'The <html> element has no lang attribute. Screen readers cannot determine the page language (WCAG 3.1.1).' });
    answers["u1"] = "no";
  }

  // Title tag
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (titleMatch && titleMatch[1].trim().length > 0) {
    findings.push({ type: "pass", check: "Page title present", detail: `Title: "${titleMatch[1].trim().slice(0, 60)}"` });
    answers["o4"] = "yes";
  } else {
    findings.push({ type: "error", check: "Page title missing or empty", detail: "Every page must have a descriptive <title> element (WCAG 2.4.2)." });
    answers["o4"] = "no";
  }

  // Images without alt
  const allImgs = (html.match(/<img[^>]*>/gi) ?? []);
  const imgsWithoutAlt = allImgs.filter(tag => !/alt\s*=/i.test(tag));
  if (allImgs.length === 0) {
    findings.push({ type: "pass", check: "Images", detail: "No <img> tags found on this page." });
  } else if (imgsWithoutAlt.length === 0) {
    findings.push({ type: "pass", check: "Image alt text", detail: `All ${allImgs.length} image(s) have alt attributes.` });
    answers["p1"] = "yes";
  } else {
    findings.push({ type: "error", check: "Images missing alt text", detail: `${imgsWithoutAlt.length} of ${allImgs.length} image(s) are missing alt attributes (WCAG 1.1.1).` });
    answers["p1"] = "no";
  }

  // Skip link
  if (/skip.*nav|skip.*content|skip.*main/i.test(html)) {
    findings.push({ type: "pass", check: "Skip navigation link", detail: "A skip navigation link was detected." });
    answers["o3"] = "yes";
  } else {
    findings.push({ type: "warning", check: "Skip navigation link not found", detail: "No skip link detected. Keyboard users must tab through all navigation on every page (WCAG 2.4.1)." });
    answers["o3"] = "partial";
  }

  // Form labels
  const inputs = (html.match(/<input[^>]*type\s*=\s*["'](?:text|email|password|search|tel|url|number)[^>]*>/gi) ?? []);
  const labels = (html.match(/<label[^>]*>/gi) ?? []);
  if (inputs.length > 0) {
    if (labels.length >= inputs.length) {
      findings.push({ type: "pass", check: "Form labels", detail: `${labels.length} label(s) found for ${inputs.length} input(s).` });
      answers["u2"] = "yes";
    } else {
      findings.push({ type: "error", check: "Form labels missing", detail: `Only ${labels.length} label(s) found for ${inputs.length} text input(s). Unlabelled inputs are inaccessible to screen readers (WCAG 3.3.2).` });
      answers["u2"] = "no";
    }
  }

  // Heading hierarchy
  const headings = (html.match(/<h[1-6][^>]*>/gi) ?? []).map(h => parseInt(h[2]));
  if (headings.length === 0) {
    findings.push({ type: "warning", check: "No headings found", detail: "No heading elements detected. Headings are essential for screen reader navigation." });
  } else {
    const hasH1 = headings.includes(1);
    if (!hasH1) {
      findings.push({ type: "error", check: "No H1 heading", detail: "Page has no <h1> element. Each page should have exactly one H1 (WCAG 1.3.1)." });
    } else {
      findings.push({ type: "pass", check: "Heading structure", detail: `${headings.length} heading(s) found including H1.` });
    }
  }

  // Accessibility statement link
  if (/accessibility.statement|accessibility-statement/i.test(html)) {
    findings.push({ type: "pass", check: "Accessibility statement link", detail: "A link to an accessibility statement was found." });
    answers["l1"] = "yes";
  } else {
    findings.push({ type: "warning", check: "Accessibility statement link not detected", detail: "No accessibility statement link found. Required under Public Sector Bodies Accessibility Regulations 2018." });
  }

  // Meta description
  if (/<meta[^>]+name\s*=\s*["']description["'][^>]*content\s*=\s*["'][^"']{10}/i.test(html) ||
      /<meta[^>]+content\s*=\s*["'][^"']{10}[^>]*name\s*=\s*["']description["']/i.test(html)) {
    findings.push({ type: "pass", check: "Meta description", detail: "Page has a meta description." });
  } else {
    findings.push({ type: "warning", check: "Meta description missing", detail: "No meta description found. Impacts SEO and how the page is announced by some assistive technologies." });
  }

  // Viewport meta (mobile accessibility)
  if (/<meta[^>]+name\s*=\s*["']viewport["']/i.test(html)) {
    findings.push({ type: "pass", check: "Viewport meta tag", detail: "Viewport is configured for mobile/responsive display." });
  } else {
    findings.push({ type: "error", check: "Viewport meta tag missing", detail: "No viewport meta tag found. Page may not be usable on mobile devices (WCAG 1.4.4)." });
    answers["p3"] = "no";
  }

  return { findings, answers };
}

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "url required" }, { status: 400 });
  }

  const target = url.startsWith("http") ? url : `https://${url}`;

  const result: ScanResult = {
    url: target,
    lighthouse: null,
    htmlFindings: [],
    suggestedAnswers: {},
  };

  // ── 1. Fetch HTML for analysis ───────────────────────────────────────────────
  try {
    const htmlRes = await fetch(target, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SafeShieldBot/1.0; accessibility audit)" },
      signal: AbortSignal.timeout(10000),
    });
    if (htmlRes.ok) {
      const html = await htmlRes.text();
      const { findings, answers } = analyseHtml(html);
      result.htmlFindings = findings;
      result.suggestedAnswers = { ...result.suggestedAnswers, ...answers };
    }
  } catch { /* HTML fetch failed — skip */ }

  // ── 2. PageSpeed Insights (all categories) ──────────────────────────────────
  try {
    const apiKey = process.env.GOOGLE_PSI_API_KEY ?? "";
    const cats = ["accessibility", "performance", "seo", "best-practices"];
    const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(target)}&strategy=mobile${cats.map(c => `&category=${c}`).join("")}${apiKey ? `&key=${apiKey}` : ""}`;
    const psiRes = await fetch(psiUrl, { signal: AbortSignal.timeout(25000) });
    if (psiRes.ok) {
      const psi = await psiRes.json();
      const lhCats = psi.lighthouseResult?.categories ?? {};
      const audits = psi.lighthouseResult?.audits ?? {};

      const categories: LighthouseCategories = {
        accessibility: lhCats.accessibility ? Math.round(lhCats.accessibility.score * 100) : 0,
        performance:   lhCats.performance   ? Math.round(lhCats.performance.score * 100)   : 0,
        seo:           lhCats.seo           ? Math.round(lhCats.seo.score * 100)           : 0,
        bestPractices: lhCats["best-practices"] ? Math.round(lhCats["best-practices"].score * 100) : 0,
      };

      const violations: { id: string; impact: string; description: string; wcag: string[] }[] = [];
      const accAuditRefs: { id: string }[] = lhCats.accessibility?.auditRefs ?? [];
      for (const ref of accAuditRefs) {
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
        const mapped = LIGHTHOUSE_MAP[ref.id] ?? [];
        for (const qid of mapped) {
          result.suggestedAnswers[qid] = audit.score === 0 ? "no" : "partial";
        }
      }

      result.lighthouse = { categories, violations };
    } else {
      result.lighthouseError = `PageSpeed API returned ${psiRes.status}`;
    }
  } catch (e) {
    result.lighthouseError = e instanceof Error ? e.message : "Lighthouse scan failed";
  }

  return NextResponse.json(result);
}
