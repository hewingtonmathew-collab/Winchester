"use client";
import { useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, ChevronRight } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import ReportMeta, { type ReportMetaData } from "@/components/report/ReportMeta";
import Certificate from "@/components/report/Certificate";
import ImprovementReport, { type Gap } from "@/components/report/ImprovementReport";

type Answer = "yes" | "no" | "partial" | null;

type Item = { id: string; category: string; text: string; weight: number };

const defaultMeta: ReportMetaData = {
  schoolName: "", schoolEmail: "", consultantName: "", consultantEmail: "", staffMember: "", logoDataUrl: null,
};

const items: Item[] = [
  // Structure
  { id: "g1", category: "Board Structure", text: "Does the governing board have a clear, up-to-date scheme of delegation that sets out decision-making responsibilities?", weight: 9 },
  { id: "g2", category: "Board Structure", text: "Are committee structures and terms of reference formally documented and reviewed annually?", weight: 8 },
  { id: "g3", category: "Board Structure", text: "Does the board have at least one link governor for each statutory area (safeguarding, SEND, pupil premium, etc.)?", weight: 7 },
  // Skills & membership
  { id: "g4", category: "Skills & Membership", text: "Has the board completed a skills audit in the last 12 months to identify knowledge gaps?", weight: 8 },
  { id: "g5", category: "Skills & Membership", text: "Is there a formal induction programme for all new governors and trustees?", weight: 7 },
  { id: "g6", category: "Skills & Membership", text: "Do all governors and trustees undertake relevant CPD at least annually?", weight: 6 },
  // Statutory compliance
  { id: "g7", category: "Statutory Compliance", text: "Does the school publish all required information on its website as per the DfE statutory guidance?", weight: 9 },
  { id: "g8", category: "Statutory Compliance", text: "Are all statutory policies reviewed and approved by the governing board on schedule?", weight: 10 },
  { id: "g9", category: "Statutory Compliance", text: "Is the register of governors' business interests maintained and publicly available?", weight: 8 },
  { id: "g10", category: "Statutory Compliance", text: "Are minutes of governing board meetings taken, approved, and published (with appropriate redactions)?", weight: 7 },
  // Accountability & challenge
  { id: "g11", category: "Accountability", text: "Does the board receive a termly headteacher report that includes progress data, safeguarding updates, and financial health?", weight: 9 },
  { id: "g12", category: "Accountability", text: "Can governors demonstrate they challenge as well as support the headteacher?", weight: 8 },
  { id: "g13", category: "Accountability", text: "Has the board set clear strategic priorities and reviewed progress against them in the last 12 months?", weight: 8 },
  // Finance
  { id: "g14", category: "Financial Oversight", text: "Does the board have a finance committee (or equivalent) with appropriate financial expertise?", weight: 8 },
  { id: "g15", category: "Financial Oversight", text: "Has the board approved the school budget and reviewed mid-year financial performance?", weight: 9 },
  { id: "g16", category: "Financial Oversight", text: "Are internal financial controls reviewed and any audit recommendations tracked to completion?", weight: 7 },
];

const categories = [...new Set(items.map((i) => i.category))];

function calcScore(answers: Record<string, Answer>): number {
  const total = items.reduce((s, i) => s + i.weight, 0);
  const earned = items.reduce((s, i) => {
    const a = answers[i.id] ?? null;
    return s + (a === "yes" ? 1 : a === "partial" ? 0.5 : 0) * i.weight;
  }, 0);
  return Math.round((earned / total) * 100);
}

export default function GovernanceChecker() {
  const [meta, setMeta] = useState<ReportMetaData>(defaultMeta);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [submitted, setSubmitted] = useState(false);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [step, setStep] = useState<"meta" | "questions">("meta");

  const answered = Object.values(answers).filter(Boolean).length;
  const score = calcScore(answers);
  const gaps = items.filter((i) => (answers[i.id] ?? null) !== "yes");
  const metaValid = meta.schoolName.trim() && meta.staffMember.trim() && meta.consultantName.trim();

  const reportGaps: Gap[] = gaps.sort((a, b) => b.weight - a.weight).map((i) => ({
    category: i.category,
    text: i.text,
    priority: i.weight >= 9 ? "high" : i.weight >= 7 ? "medium" : "low",
  }));

  if (submitted) {
    const label = score >= 80 ? "Strong" : score >= 55 ? "Developing" : "Requires Improvement";
    const labelColor = score >= 80 ? "text-green-400" : score >= 55 ? "text-amber-400" : "text-red-400";
    const ringColor = score >= 80 ? "#22c55e" : score >= 55 ? "#f59e0b" : "#ef4444";
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
            <span className="text-[#64748B] text-xs">compliance score</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className={`text-xl font-bold ${labelColor}`}>{label}</span>
            <p className="text-[#94A3B8] text-sm leading-relaxed max-w-md">
              {score >= 80 ? "Your governance arrangements appear well-developed. Maintain annual review cycles and continue building board expertise." : score >= 55 ? "Several governance areas need attention. Address the gaps below to strengthen oversight and reduce inspection risk." : "Significant governance weaknesses identified. Prioritised action across multiple areas is needed urgently."}
            </p>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Compliance by Area</h3>
          <div className="flex flex-col gap-3">
            {categories.map((cat) => {
              const catItems = items.filter((i) => i.category === cat);
              const catScore = calcScore(Object.fromEntries(catItems.map((i) => [i.id, answers[i.id] ?? null])));
              const barColor = catScore >= 80 ? "#22c55e" : catScore >= 55 ? "#f59e0b" : "#ef4444";
              return (
                <div key={cat}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#94A3B8]">{cat}</span>
                    <span className="text-white font-medium">{catScore}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${catScore}%`, background: barColor }} />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {gaps.length > 0 && (
          <GlassCard>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Gaps & Actions ({gaps.length})</h3>
            <div className="flex flex-col gap-2.5">
              {gaps.sort((a, b) => b.weight - a.weight).map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className={`mt-0.5 shrink-0 text-xs font-bold px-1.5 py-0.5 rounded ${answers[item.id] === "partial" ? "bg-amber-500/15 text-amber-400" : "bg-red-500/15 text-red-400"}`}>
                    {answers[item.id] === "partial" ? "PARTIAL" : "GAP"}
                  </span>
                  <div>
                    <p className="text-[#94A3B8] text-xs leading-relaxed">{item.text}</p>
                    <span className="text-[#475569] text-[0.6rem] uppercase tracking-wider">{item.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        <Certificate meta={meta} toolName="Governance Compliance Checker" score={score} rating={label} ratingColor={ringColor} accentColor="#A78BFA" />
        <ImprovementReport meta={meta} toolName="Governance Compliance Checker" score={score} rating={label} ratingColor={ringColor} gaps={reportGaps} accentColor="#A78BFA" accentDim="rgba(167,139,250,0.12)" accentBorder="rgba(167,139,250,0.25)" />

        <button onClick={() => { setSubmitted(false); setAnswers({}); setStep("meta"); setMeta(defaultMeta); }} className="self-start text-[#A78BFA] text-sm hover:text-white transition-colors">
          ← Start again
        </button>
      </div>
    );
  }

  if (step === "meta") {
    return (
      <div className="flex flex-col gap-5">
        <ReportMeta value={meta} onChange={setMeta} accentColor="#A78BFA" accentDim="rgba(167,139,250,0.12)" accentBorder="rgba(167,139,250,0.25)" />
        <div className="flex justify-end">
          <button onClick={() => setStep("questions")} disabled={!metaValid}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.3)", color: "#A78BFA" }}>
            Start Assessment <ChevronRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between text-xs text-[#475569]">
        <span>{answered}/{items.length} answered</span>
        <span>{Math.round((answered / items.length) * 100)}% complete</span>
      </div>
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-[#A78BFA] rounded-full transition-all duration-300" style={{ width: `${(answered / items.length) * 100}%` }} />
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const catItems = items.filter((i) => i.category === cat);
          const complete = catItems.every((i) => answers[i.id]);
          return (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-1.5 ${activeCategory === cat ? "bg-[rgba(167,139,250,0.15)] border border-[rgba(167,139,250,0.3)] text-[#A78BFA]" : "glass text-[#64748B] hover:text-white"}`}>
              {complete && <CheckCircle2 size={10} className="text-[#A78BFA]" />}
              {cat}
            </button>
          );
        })}
      </div>

      <GlassCard>
        <h2 className="text-white font-semibold text-sm mb-5">{activeCategory}</h2>
        <div className="flex flex-col gap-5">
          {items.filter((i) => i.category === activeCategory).map((item) => (
            <div key={item.id}>
              <p className="text-[#CBD5E1] text-sm leading-relaxed mb-2.5">{item.text}</p>
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
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[rgba(167,139,250,0.1)] border border-[rgba(167,139,250,0.2)] text-[#A78BFA] text-sm font-medium hover:bg-[rgba(167,139,250,0.18)] transition-all">
              Next section <ChevronRight size={14} />
            </button>
          ) : (
            <button onClick={() => setSubmitted(true)} disabled={answered < items.length}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[rgba(167,139,250,0.15)] border border-[rgba(167,139,250,0.3)] text-[#A78BFA] text-sm font-medium hover:bg-[rgba(167,139,250,0.25)] transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              <CheckCircle2 size={14} /> View Results
            </button>
          )}
          {answered < items.length && <span className="text-[#475569] text-xs">{items.length - answered} unanswered</span>}
        </div>
      </GlassCard>
    </div>
  );
}
