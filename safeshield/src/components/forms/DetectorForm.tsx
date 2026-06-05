"use client";
import { useState } from "react";
import { detectAi, type DetectionResult } from "@/lib/ai-detector";
import { ScanSearch, AlertCircle, CheckCircle2, HelpCircle, ChevronRight } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import ReportMeta, { type ReportMetaData } from "@/components/report/ReportMeta";
import Certificate from "@/components/report/Certificate";
import ImprovementReport, { type Gap } from "@/components/report/ImprovementReport";
import { saveSubmission } from "@/lib/submissions";

const defaultMeta: ReportMetaData = {
  schoolName: "", schoolEmail: "", consultantName: "", consultantEmail: "", staffMember: "", logoDataUrl: null,
};

function ScoreGauge({ score }: { score: number }) {
  const r = 45;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score > 65 ? "#ef4444" : score > 35 ? "#f59e0b" : "#22c55e";
  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transform: "rotate(-90deg)", transformOrigin: "60px 60px", transition: "stroke-dashoffset 0.8s ease" }} />
        <text x="60" y="60" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="22" fontWeight="bold">{score}</text>
      </svg>
      <span className="text-[#64748B] text-xs">out of 100</span>
    </div>
  );
}

function Verdict({ label }: { label: DetectionResult["label"] }) {
  const map = {
    "Likely AI": { color: "text-red-400", bg: "bg-red-500/10 border-red-500/30", Icon: AlertCircle },
    "Possibly AI": { color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30", Icon: HelpCircle },
    "Likely Human": { color: "text-green-400", bg: "bg-green-500/10 border-green-500/30", Icon: CheckCircle2 },
  };
  const { color, bg, Icon } = map[label];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${bg} ${color}`}>
      <Icon size={13} /> {label}
    </span>
  );
}

export default function DetectorForm() {
  const [meta, setMeta] = useState<ReportMetaData>(defaultMeta);
  const [step, setStep] = useState<"meta" | "analyse">("meta");
  const [text, setText] = useState("");
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState("");

  const metaValid = meta.schoolName.trim() && meta.staffMember.trim() && meta.consultantName.trim();
  const wordCount = text.replace(/[^a-z0-9'\s]/gi, " ").split(/\s+/).filter(Boolean).length;

  const scoreAsPercent = result ? 100 - result.score : 0;
  const rating = result ? result.label : "";
  const ratingColor = result ? (result.score > 65 ? "#ef4444" : result.score > 35 ? "#f59e0b" : "#22c55e") : "#38BDF8";

  const reportGaps: Gap[] = result
    ? result.breakdown
        .filter((b) => b.weight >= 10)
        .map((b) => ({
          category: "AI Signal",
          text: `${b.signal}: ${b.explanation}`,
          priority: b.weight >= 18 ? "high" : b.weight >= 12 ? "medium" : "low",
        }))
    : [];

  const areas = [
    { name: "Linguistic Patterns" },
    { name: "Structural Analysis" },
    { name: "Vocabulary & Phrasing" },
    { name: "Sentence Variation" },
    { name: "Naturalness Signals" },
  ];

  function analyse() {
    setError("");
    if (!text.trim()) { setError("Please paste some text to analyse."); return; }
    if (wordCount < 50) { setError(`Please provide at least 50 words. You have ${wordCount}.`); return; }
    const res = detectAi(text);
    setResult(res);
    const lbl = res.label;
    const rc = res.score > 65 ? "#ef4444" : res.score > 35 ? "#f59e0b" : "#22c55e";
    saveSubmission({ tool: "AI Content Detector", ...meta, score: 100 - res.score, rating: lbl, ratingColor: rc, areas, gaps: reportGaps });
  }

  if (step === "meta") {
    return (
      <div className="flex flex-col gap-5">
        <ReportMeta value={meta} onChange={setMeta} accentColor="#38BDF8" accentDim="rgba(56,189,248,0.12)" accentBorder="rgba(56,189,248,0.25)" />
        <div className="flex justify-end">
          <button onClick={() => setStep("analyse")} disabled={!metaValid}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.3)", color: "#38BDF8" }}>
            Start Analysis <ChevronRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <GlassCard>
        <label className="block text-[#64748B] text-xs uppercase tracking-wider mb-2">Text to Analyse</label>
        <textarea
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text here…"
          className="w-full bg-black/30 border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder-[#334155] focus:outline-none focus:border-[rgba(56,189,248,0.4)] transition-colors resize-y min-h-[200px]"
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-[#475569]">
            {wordCount} words {wordCount > 0 && wordCount < 50 && <span className="text-amber-400">(min 50 required)</span>}
          </span>
        </div>
        {error && <p className="text-red-400 text-sm flex items-center gap-1.5 mt-2"><AlertCircle size={13} />{error}</p>}
        <button
          onClick={analyse}
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[rgba(56,189,248,0.12)] border border-[rgba(56,189,248,0.25)] text-[#38BDF8] text-sm font-medium hover:bg-[rgba(56,189,248,0.2)] transition-all duration-150"
        >
          <ScanSearch size={15} /> Analyse Text
        </button>
      </GlassCard>

      {result && (
        <>
          <GlassCard className="flex flex-col sm:flex-row items-center gap-6">
            <ScoreGauge score={result.score} />
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                <Verdict label={result.label} />
                <span className="text-[0.6rem] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[rgba(56,189,248,0.1)] border border-[rgba(56,189,248,0.2)] text-[#38BDF8]">
                  {result.confidence} Confidence
                </span>
              </div>
              <p className="text-[#94A3B8] text-sm leading-relaxed">
                {result.label === "Likely AI" ? "Strong indicators of AI generation detected across multiple signals." : result.label === "Possibly AI" ? "Mixed signals — some AI characteristics alongside human-like qualities." : "Strong indicators of human authorship. Few AI patterns detected."}
              </p>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Signal Breakdown</h3>
            <div className="flex flex-col divide-y divide-white/5">
              {result.breakdown.map((item) => (
                <div key={item.signal} className="py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-sm font-medium">{item.signal}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-[#38BDF8] transition-all duration-700" style={{ width: `${(item.weight / 25) * 100}%` }} />
                      </div>
                      <span className="text-[#38BDF8] text-xs font-semibold w-5 text-right">{item.weight}</span>
                    </div>
                  </div>
                  <p className="text-[#64748B] text-xs leading-relaxed">{item.explanation}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              ["Words", result.stats.wordCount],
              ["Sentences", result.stats.sentenceCount],
              ["Avg Length", `${result.stats.avgSentenceLength}w`],
              ["Lexical Div.", `${result.stats.lexicalDiversity}%`],
              ["Passive Voice", `${result.stats.passiveVoiceRatio}%`],
            ].map(([label, value]) => (
              <div key={label as string} className="glass rounded-xl p-4">
                <p className="text-[#475569] text-xs uppercase tracking-wider mb-1">{label}</p>
                <p className="text-white font-bold text-xl">{value}</p>
              </div>
            ))}
          </div>

          {result.flaggedPhrases.length > 0 && (
            <GlassCard>
              <h3 className="text-white font-semibold text-sm mb-3">Flagged Phrases ({result.flaggedPhrases.length})</h3>
              <div className="flex flex-wrap gap-2">
                {result.flaggedPhrases.map((p) => (
                  <span key={p} className="text-xs px-2.5 py-1 rounded bg-amber-400/10 border border-amber-400/20 text-amber-300">{p}</span>
                ))}
              </div>
            </GlassCard>
          )}

          <Certificate meta={meta} toolName="AI Content Detector" score={scoreAsPercent} rating={rating} ratingColor={ratingColor} accentColor="#38BDF8" areas={areas} />
          {reportGaps.length > 0 && (
            <ImprovementReport meta={meta} toolName="AI Content Detector" score={scoreAsPercent} rating={rating} ratingColor={ratingColor} gaps={reportGaps} accentColor="#38BDF8" accentDim="rgba(56,189,248,0.12)" accentBorder="rgba(56,189,248,0.25)" />
          )}

          <button onClick={() => { setResult(null); setText(""); setStep("meta"); setMeta(defaultMeta); }} className="self-start text-[#38BDF8] text-sm hover:text-white transition-colors">
            ← Start again
          </button>
        </>
      )}
    </div>
  );
}
