"use client";
import { useState } from "react";
import { CheckCircle2, ChevronRight, Search, AlertTriangle, Loader2, ExternalLink } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import ReportMeta, { type ReportMetaData } from "@/components/report/ReportMeta";
import Certificate from "@/components/report/Certificate";
import ImprovementReport, { type Gap } from "@/components/report/ImprovementReport";
import { saveSubmission } from "@/lib/submissions";
import type { ScanResult, LighthouseCategories } from "@/app/api/accessibility-scan/route";

function ScoreRing({ label, score }: { label: string; score: number }) {
  const color = score >= 90 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
  const r = 28;
  const circ = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-16 h-16">
        <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
          <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
          <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={circ * (1 - score / 100)}
            style={{ transition: "stroke-dashoffset 1s ease" }} />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">{score}</span>
      </div>
      <span className="text-[10px] text-center leading-tight" style={{ color: "rgba(255,255,255,0.5)", maxWidth: 64 }}>{label}</span>
    </div>
  );
}

function CategoryRings({ cats }: { cats: LighthouseCategories }) {
  return (
    <div className="flex items-center justify-around mt-3 pt-3 border-t border-white/5">
      <ScoreRing label="Accessibility" score={cats.accessibility} />
      <ScoreRing label="Performance" score={cats.performance} />
      <ScoreRing label="SEO" score={cats.seo} />
      <ScoreRing label="Best Practices" score={cats.bestPractices} />
    </div>
  );
}

type Answer = "yes" | "no" | "partial" | null;
type Item = { id: string; category: string; text: string; weight: number; wcag?: string };

const items: Item[] = [
  // Perceivable
  { id: "p1", category: "Perceivable", text: "Do all non-text content items (images, icons, charts) have descriptive alt text?", weight: 10, wcag: "1.1.1" },
  { id: "p2", category: "Perceivable", text: "Are videos and audio content provided with captions or transcripts?", weight: 9, wcag: "1.2.1" },
  { id: "p3", category: "Perceivable", text: "Does the website work correctly when text size is increased to 200%?", weight: 8, wcag: "1.4.4" },
  { id: "p4", category: "Perceivable", text: "Is colour not the only means of conveying information (e.g. error messages, charts)?", weight: 9, wcag: "1.4.1" },
  { id: "p5", category: "Perceivable", text: "Does text have sufficient contrast against its background (minimum 4.5:1 ratio)?", weight: 10, wcag: "1.4.3" },
  // Operable
  { id: "o1", category: "Operable", text: "Can all functionality be operated using a keyboard alone (no mouse required)?", weight: 10, wcag: "2.1.1" },
  { id: "o2", category: "Operable", text: "Is there a visible focus indicator when navigating by keyboard?", weight: 9, wcag: "2.4.7" },
  { id: "o3", category: "Operable", text: "Does the site have skip navigation links to bypass repeated content?", weight: 7, wcag: "2.4.1" },
  { id: "o4", category: "Operable", text: "Do pages have descriptive, meaningful titles that identify their purpose?", weight: 8, wcag: "2.4.2" },
  { id: "o5", category: "Operable", text: "Are link texts descriptive (not 'click here' or 'read more')?", weight: 8, wcag: "2.4.4" },
  // Understandable
  { id: "u1", category: "Understandable", text: "Is the language of the page set in the HTML (lang attribute)?", weight: 7, wcag: "3.1.1" },
  { id: "u2", category: "Understandable", text: "Do forms have clear, descriptive labels associated with each field?", weight: 10, wcag: "3.3.2" },
  { id: "u3", category: "Understandable", text: "Are error messages descriptive and do they suggest how to fix the issue?", weight: 9, wcag: "3.3.1" },
  { id: "u4", category: "Understandable", text: "Is navigation consistent across all pages of the website?", weight: 8, wcag: "3.2.3" },
  // Robust
  { id: "r1", category: "Robust", text: "Is the HTML valid and does it parse without major errors?", weight: 8, wcag: "4.1.1" },
  { id: "r2", category: "Robust", text: "Do interactive elements (buttons, forms) have accessible names for screen readers?", weight: 10, wcag: "4.1.2" },
  { id: "r3", category: "Robust", text: "Is the site tested with at least one screen reader?", weight: 7, wcag: "4.1.2" },
  // Legal / Public Sector
  { id: "l1", category: "Legal & Compliance", text: "Does the school website have a published Accessibility Statement?", weight: 10 },
  { id: "l2", category: "Legal & Compliance", text: "Has the Accessibility Statement been updated within the last 12 months?", weight: 9 },
  { id: "l3", category: "Legal & Compliance", text: "Does the statement include a list of known accessibility issues and planned fixes?", weight: 8 },
  { id: "l4", category: "Legal & Compliance", text: "Is there a contact method for users to report accessibility issues?", weight: 9 },
];

const categories = [...new Set(items.map((i) => i.category))];

const defaultMeta: ReportMetaData = {
  schoolName: "", schoolEmail: "", consultantName: "", consultantEmail: "", staffMember: "", logoDataUrl: null,
};

function calcScore(answers: Record<string, Answer>): number {
  const total = items.reduce((s, i) => s + i.weight, 0);
  const earned = items.reduce((s, i) => {
    const a = answers[i.id] ?? null;
    return s + (a === "yes" ? 1 : a === "partial" ? 0.5 : 0) * i.weight;
  }, 0);
  return Math.round((earned / total) * 100);
}

const COLOR = "#F472B6";
const DIM = "rgba(244,114,182,0.12)";
const BORDER = "rgba(244,114,182,0.25)";

type Step = "scan" | "meta" | "questions";

export default function AccessibilityChecker() {
  const [meta, setMeta] = useState<ReportMetaData>(defaultMeta);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [step, setStep] = useState<Step>("scan");

  // Scan state
  const [scanUrl, setScanUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanError, setScanError] = useState("");

  const answered = Object.values(answers).filter(Boolean).length;
  const score = calcScore(answers);
  const metaValid = meta.schoolName.trim() && meta.staffMember.trim() && meta.consultantName.trim();

  const rating = score >= 80 ? "Compliant" : score >= 55 ? "Partially Compliant" : "Non-Compliant";
  const ringColor = score >= 80 ? "#22c55e" : score >= 55 ? "#f59e0b" : "#ef4444";

  const gaps: Gap[] = items
    .filter((i) => (answers[i.id] ?? null) !== "yes")
    .sort((a, b) => b.weight - a.weight)
    .map((i) => ({
      category: i.category,
      text: `${i.text}${i.wcag ? ` (WCAG ${i.wcag})` : ""}`,
      priority: i.weight >= 9 ? "high" : i.weight >= 7 ? "medium" : "low",
    }));

  // Merge Lighthouse violations as additional gaps (deduplicated)
  const lighthouseGaps: Gap[] = scanResult?.lighthouse?.violations.map(v => ({
    category: "Lighthouse Scan",
    text: `${v.description} — detected automatically via Lighthouse scan`,
    priority: (v.impact === "critical" ? "high" : v.impact === "serious" ? "medium" : "low") as Gap["priority"],
  })) ?? [];
  const allGaps = [...gaps, ...lighthouseGaps.filter(lg =>
    !gaps.some(g => g.text.toLowerCase().includes(lg.text.toLowerCase().slice(0, 20)))
  )];

  const areas = categories.map(cat => {
    const ci = items.filter(i => i.category === cat);
    const tot = ci.reduce((s, i) => s + i.weight, 0);
    const earn = ci.reduce((s, i) => { const a = answers[i.id] ?? null; return s + (a === "yes" ? 1 : a === "partial" ? 0.5 : 0) * i.weight; }, 0);
    return { name: cat, score: tot > 0 ? Math.round((earn / tot) * 100) : 0 };
  });

  async function runScan() {
    if (!scanUrl.trim()) return;
    setScanning(true);
    setScanError("");
    setScanResult(null);
    try {
      const res = await fetch("/api/accessibility-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: scanUrl.trim() }),
      });
      const data: ScanResult = await res.json();
      setScanResult(data);
      if (Object.keys(data.suggestedAnswers).length > 0) {
        setAnswers(prev => ({ ...prev, ...data.suggestedAnswers }));
      }
    } catch {
      setScanError("Scan failed — check the URL and try again.");
    } finally {
      setScanning(false);
    }
  }

  // ── Results ─────────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="flex flex-col gap-5">
        <GlassCard glow className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                <circle cx="50" cy="50" r="40" fill="none" stroke={ringColor} strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`}
                  style={{ transition: "stroke-dashoffset 1s ease" }} />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl">{score}%</span>
            </div>
            <span className="text-[#64748B] text-xs">accessibility score</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xl font-bold" style={{ color: ringColor }}>{rating}</span>
            {scanResult?.lighthouse && (
              <div className="flex flex-col gap-2">
                <CategoryRings cats={scanResult.lighthouse.categories} />
                <a href={`https://pagespeed.web.dev/report?url=${encodeURIComponent(scanResult.url)}`} target="_blank" rel="noopener noreferrer"
                  className="text-xs underline flex items-center gap-0.5 hover:opacity-80 self-start" style={{ color: COLOR }}>
                  View full PageSpeed report <ExternalLink size={10} />
                </a>
              </div>
            )}
            <p className="text-[#94A3B8] text-sm leading-relaxed max-w-md">
              {score >= 80 ? "Strong accessibility compliance. Continue reviewing annually and monitoring for new WCAG updates." : score >= 55 ? "Partial compliance — several barriers exist that may prevent disabled users from accessing your website. Address high-priority items immediately." : "Significant accessibility failures identified. The school may be in breach of the Public Sector Bodies Accessibility Regulations 2018."}
            </p>
          </div>
        </GlassCard>

        <Certificate meta={meta} toolName="Web Accessibility Checker" score={score} rating={rating} ratingColor={ringColor} accentColor={COLOR} areas={areas} />
        <ImprovementReport meta={meta} toolName="Web Accessibility Checker" score={score} rating={rating} ratingColor={ringColor} gaps={allGaps} accentColor={COLOR} accentDim={DIM} accentBorder={BORDER} reportId={submissionId ?? undefined} />

        <button onClick={() => { setSubmitted(false); setAnswers({}); setStep("scan"); setMeta(defaultMeta); setScanResult(null); setScanUrl(""); }}
          className="self-start text-sm hover:text-white transition-colors" style={{ color: COLOR }}>
          ← Start again
        </button>
      </div>
    );
  }

  // ── Step: URL Scan ──────────────────────────────────────────────────────────
  if (step === "scan") {
    return (
      <div className="flex flex-col gap-5">
        <GlassCard>
          <h2 className="text-white font-semibold text-sm mb-1">Automated Accessibility Scan</h2>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
            Enter your school website URL to run a Lighthouse accessibility audit. Results will pre-fill the questionnaire automatically.
          </p>
          <div className="flex gap-2">
            <input
              type="url"
              value={scanUrl}
              onChange={e => setScanUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && runScan()}
              placeholder="https://www.yourschool.org.uk"
              className="flex-1 px-3 py-2 rounded-xl text-sm text-white placeholder-[#475569] outline-none"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
            <button
              onClick={runScan}
              disabled={scanning || !scanUrl.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-40"
              style={{ background: DIM, border: `1px solid ${BORDER}`, color: COLOR }}>
              {scanning ? <><Loader2 size={13} className="animate-spin" /> Scanning…</> : <><Search size={13} /> Scan</>}
            </button>
          </div>

          {scanError && (
            <div className="mt-3 flex items-center gap-2 text-xs text-red-400">
              <AlertTriangle size={12} /> {scanError}
            </div>
          )}

          {scanResult && (
            <div className="mt-4 flex flex-col gap-3">
              {/* Lighthouse score rings */}
              {scanResult.lighthouse ? (
                <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white">Lighthouse Scores</span>
                    <a href={`https://pagespeed.web.dev/report?url=${encodeURIComponent(scanResult.url)}`} target="_blank" rel="noopener noreferrer"
                      className="text-xs underline flex items-center gap-0.5 hover:opacity-80" style={{ color: COLOR }}>
                      Full report <ExternalLink size={10} />
                    </a>
                  </div>
                  <CategoryRings cats={scanResult.lighthouse.categories} />
                  {scanResult.lighthouse.violations.length > 0 && (
                    <div className="mt-4 flex flex-col gap-1.5">
                      <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>
                        {scanResult.lighthouse.violations.length} accessibility issue{scanResult.lighthouse.violations.length !== 1 ? "s" : ""} detected:
                      </p>
                      {scanResult.lighthouse.violations.slice(0, 8).map((v, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
                          <span className={`mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full ${v.impact === "critical" ? "bg-red-400" : "bg-amber-400"}`} />
                          <span style={{ color: "rgba(255,255,255,0.7)" }}>{v.description}</span>
                        </div>
                      ))}
                      {scanResult.lighthouse.violations.length > 8 && (
                        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>+{scanResult.lighthouse.violations.length - 8} more in full report</p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-amber-400">
                  <AlertTriangle size={12} /> {scanResult.lighthouseError ?? "Lighthouse scan unavailable — complete the questionnaire manually."}
                </div>
              )}

              {/* HTML analysis */}
              {scanResult.htmlFindings.length > 0 && (
                <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <p className="text-xs font-semibold text-white mb-3">HTML Analysis</p>
                  <div className="flex flex-col gap-2">
                    {scanResult.htmlFindings.map((f, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <span className={`mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full ${f.type === "pass" ? "bg-green-400" : f.type === "error" ? "bg-red-400" : "bg-amber-400"}`} />
                        <div>
                          <span className="font-medium" style={{ color: f.type === "pass" ? "#4ade80" : f.type === "error" ? "#f87171" : "#fbbf24" }}>{f.check}</span>
                          <span className="ml-1" style={{ color: "rgba(255,255,255,0.5)" }}>— {f.detail}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {Object.keys(scanResult.suggestedAnswers).length > 0 && (
                <p className="text-xs" style={{ color: COLOR }}>✓ {Object.keys(scanResult.suggestedAnswers).length} questionnaire answers pre-filled from scan results.</p>
              )}
            </div>
          )}
        </GlassCard>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setStep("meta")}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all border"
            style={{ background: DIM, borderColor: BORDER, color: COLOR }}>
            {scanResult ? "Continue to Assessment" : "Skip — Go to Assessment"} <ChevronRight size={14} />
          </button>
          {!scanResult && <span className="text-xs" style={{ color: "var(--text-muted)" }}>You can complete the questionnaire manually without scanning.</span>}
        </div>
      </div>
    );
  }

  // ── Step: Meta ──────────────────────────────────────────────────────────────
  if (step === "meta") {
    return (
      <div className="flex flex-col gap-5">
        <ReportMeta value={meta} onChange={setMeta} accentColor={COLOR} accentDim={DIM} accentBorder={BORDER} />
        <div className="flex justify-end">
          <button onClick={() => setStep("questions")} disabled={!metaValid}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: DIM, border: `1px solid ${BORDER}`, color: COLOR }}>
            Start Assessment <ChevronRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  // ── Step: Questions ─────────────────────────────────────────────────────────
  const catItems = items.filter((i) => i.category === activeCategory);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between text-xs text-[#475569]">
        <span>{answered}/{items.length} answered</span>
        <span>{Math.round((answered / items.length) * 100)}% complete</span>
      </div>
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${(answered / items.length) * 100}%`, background: COLOR }} />
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const complete = items.filter((i) => i.category === cat).every((i) => answers[i.id]);
          return (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${activeCategory === cat ? "border" : "glass text-[#64748B] hover:text-white"}`}
              style={activeCategory === cat ? { background: DIM, borderColor: BORDER, color: COLOR } : {}}>
              {complete && <CheckCircle2 size={10} style={{ color: COLOR }} />}
              {cat}
            </button>
          );
        })}
      </div>

      <GlassCard>
        <h2 className="text-white font-semibold text-sm mb-5">{activeCategory}</h2>
        <div className="flex flex-col gap-5">
          {catItems.map((item) => (
            <div key={item.id}>
              <p className="text-[#CBD5E1] text-sm leading-relaxed mb-1">{item.text}</p>
              {item.wcag && <p className="text-[#475569] text-xs mb-2">WCAG {item.wcag}</p>}
              {answers[item.id] && scanResult?.suggestedAnswers[item.id] === answers[item.id] && (
                <p className="text-xs mb-1.5 flex items-center gap-1" style={{ color: COLOR }}>
                  <Search size={9} /> Pre-filled by Lighthouse scan
                </p>
              )}
              <div className="flex gap-2">
                {(["yes", "partial", "no"] as const).map((val) => {
                  const active = answers[item.id] === val;
                  const styles = {
                    yes: active ? "bg-green-500/20 border-green-500/40 text-green-400" : "glass text-[#64748B] hover:border-green-500/30 hover:text-green-400",
                    partial: active ? "bg-amber-500/20 border-amber-500/40 text-amber-400" : "glass text-[#64748B] hover:border-amber-500/30 hover:text-amber-400",
                    no: active ? "bg-red-500/20 border-red-500/40 text-red-400" : "glass text-[#64748B] hover:border-red-500/30 hover:text-red-400",
                  };
                  return (
                    <button key={val} onClick={() => setAnswers((p) => ({ ...p, [item.id]: val }))}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${styles[val]}`}>
                      {val === "partial" ? "Partial" : val === "yes" ? "Yes" : "No"}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-6 pt-5 border-t border-white/5">
          {activeCategory !== categories[categories.length - 1] ? (
            <button onClick={() => setActiveCategory(categories[categories.indexOf(activeCategory) + 1])}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium hover:opacity-80 transition-all border"
              style={{ background: DIM, borderColor: BORDER, color: COLOR }}>
              Next section <ChevronRight size={14} />
            </button>
          ) : (
            <button onClick={async () => { const s = await saveSubmission({ tool: "Web Accessibility Checker", ...meta, score, rating, ratingColor: ringColor, areas, gaps: allGaps }); setSubmitted(true); setSubmissionId(s.id); }}
              disabled={answered < items.length}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed border"
              style={{ background: DIM, borderColor: BORDER, color: COLOR }}>
              <CheckCircle2 size={14} /> View Results
            </button>
          )}
          {answered < items.length && <span className="text-[#475569] text-xs">{items.length - answered} unanswered</span>}
        </div>
      </GlassCard>
    </div>
  );
}
