"use client";
import { useState } from "react";
import { CheckCircle2, ChevronRight } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import ReportMeta, { type ReportMetaData } from "@/components/report/ReportMeta";
import Certificate from "@/components/report/Certificate";
import ImprovementReport, { type Gap } from "@/components/report/ImprovementReport";
import { saveSubmission } from "@/lib/submissions";

type Answer = "outstanding" | "good" | "requires" | "inadequate" | null;
type Item = { id: string; category: string; text: string; weight: number };

const items: Item[] = [
  // Quality of Education
  { id: "q1", category: "Quality of Education", text: "Does the school have an ambitious, knowledge-rich curriculum that is well-sequenced from EYFS to KS4/5?", weight: 10 },
  { id: "q2", category: "Quality of Education", text: "Is assessment used effectively to identify gaps and inform future teaching (not just for data collection)?", weight: 9 },
  { id: "q3", category: "Quality of Education", text: "Do pupils read widely and frequently, with struggling readers given targeted support?", weight: 9 },
  { id: "q4", category: "Quality of Education", text: "Is there strong subject-specific pedagogy across all areas of the curriculum?", weight: 8 },
  { id: "q5", category: "Quality of Education", text: "Do pupils make strong progress and achieve well relative to their starting points?", weight: 9 },
  // Behaviour & Attitudes
  { id: "b1", category: "Behaviour & Attitudes", text: "Is behaviour consistently good across the school, including in corridors, at lunch, and during transitions?", weight: 9 },
  { id: "b2", category: "Behaviour & Attitudes", text: "Is attendance high (above national average) and persistent absence low and declining?", weight: 10 },
  { id: "b3", category: "Behaviour & Attitudes", text: "Are bullying incidents (including online) recorded, responded to promptly, and tracked over time?", weight: 9 },
  { id: "b4", category: "Behaviour & Attitudes", text: "Do pupils show positive attitudes to learning and demonstrate resilience in the face of challenge?", weight: 7 },
  // Personal Development
  { id: "pd1", category: "Personal Development", text: "Is there a broad, well-planned PSHE and RSE curriculum that meets statutory requirements?", weight: 9 },
  { id: "pd2", category: "Personal Development", text: "Do pupils receive impartial, high-quality careers education and guidance from Year 7 onwards?", weight: 8 },
  { id: "pd3", category: "Personal Development", text: "Are pupils' spiritual, moral, social, and cultural (SMSC) development actively promoted?", weight: 8 },
  { id: "pd4", category: "Personal Development", text: "Is British Values education embedded meaningfully (not just a tick-box exercise)?", weight: 7 },
  // Leadership & Management
  { id: "l1", category: "Leadership & Management", text: "Does senior leadership have a clear, shared vision and strategy that staff understand and believe in?", weight: 10 },
  { id: "l2", category: "Leadership & Management", text: "Is staff workload managed well, with a culture that values wellbeing and avoids performative accountability?", weight: 9 },
  { id: "l3", category: "Leadership & Management", text: "Is safeguarding effective, with a strong culture of vigilance and clear reporting processes?", weight: 10 },
  { id: "l4", category: "Leadership & Management", text: "Does the governing board provide effective strategic oversight and hold leaders to account with appropriate challenge?", weight: 9 },
  { id: "l5", category: "Leadership & Management", text: "Is the school's self-evaluation honest, accurate, and used to drive improvement?", weight: 8 },
  // SEND & Inclusion
  { id: "s1", category: "SEND & Inclusion", text: "Are the needs of SEND pupils identified early and met effectively across all year groups and subjects?", weight: 10 },
  { id: "s2", category: "SEND & Inclusion", text: "Do disadvantaged pupils (PP/FSM) make strong progress relative to their peers?", weight: 9 },
  { id: "s3", category: "SEND & Inclusion", text: "Is the school's SEND Information Report up to date and accessible on the website?", weight: 7 },
];

const categories = [...new Set(items.map((i) => i.category))];

const defaultMeta: ReportMetaData = {
  schoolName: "", schoolEmail: "", consultantName: "", consultantEmail: "", staffMember: "", logoDataUrl: null,
};

const LEVELS: { value: Answer; label: string; color: string; bg: string }[] = [
  { value: "outstanding", label: "Outstanding", color: "text-blue-400", bg: "bg-blue-500/15 border-blue-500/30" },
  { value: "good", label: "Good", color: "text-green-400", bg: "bg-green-500/15 border-green-500/30" },
  { value: "requires", label: "Requires Improvement", color: "text-amber-400", bg: "bg-amber-500/15 border-amber-500/30" },
  { value: "inadequate", label: "Inadequate", color: "text-red-400", bg: "bg-red-500/15 border-red-500/30" },
];

function calcScore(answers: Record<string, Answer>): number {
  const scoreMap = { outstanding: 3, good: 2, requires: 1, inadequate: 0 };
  const total = items.reduce((s, i) => s + i.weight * 3, 0);
  const earned = items.reduce((s, i) => s + (scoreMap[answers[i.id] ?? "inadequate"] ?? 0) * i.weight, 0);
  return Math.round((earned / total) * 100);
}

const COLOR = "#4ADE80";
const DIM = "rgba(74,222,128,0.12)";
const BORDER = "rgba(74,222,128,0.25)";

export default function OfstedChecker() {
  const [meta, setMeta] = useState<ReportMetaData>(defaultMeta);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [step, setStep] = useState<"meta" | "questions">("meta");

  const answered = Object.keys(answers).filter((k) => answers[k] !== null).length;
  const score = calcScore(answers);
  const metaValid = meta.schoolName.trim() && meta.staffMember.trim() && meta.consultantName.trim();

  const rating = score >= 80 ? "Outstanding / Good" : score >= 60 ? "Good" : score >= 40 ? "Requires Improvement" : "Inadequate Risk";
  const ringColor = score >= 80 ? "#22c55e" : score >= 60 ? "#38BDF8" : score >= 40 ? "#f59e0b" : "#ef4444";

  const gaps: Gap[] = items
    .filter((i) => answers[i.id] === "requires" || answers[i.id] === "inadequate" || !answers[i.id])
    .sort((a, b) => b.weight - a.weight)
    .map((i) => ({
      category: i.category,
      text: i.text,
      priority: (answers[i.id] === "inadequate" || i.weight >= 9) ? "high" : i.weight >= 7 ? "medium" : "low",
    }));

  const areas = categories.map(cat => {
    const ci = items.filter(i => i.category === cat);
    return { name: cat, score: calcScore(Object.fromEntries(ci.map(i => [i.id, answers[i.id] ?? null]))) };
  });

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
            <span className="text-[#64748B] text-xs">readiness score</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xl font-bold" style={{ color: ringColor }}>{rating}</span>
            <p className="text-[#94A3B8] text-sm leading-relaxed max-w-md">
              {score >= 80 ? "Strong Ofsted readiness across all framework areas. Focus on sustaining quality and evidencing impact." : score >= 60 ? "Good foundations with areas for development. Address improvement areas before any inspection window." : score >= 40 ? "Several areas require attention. A structured improvement plan is needed urgently." : "Significant risk across multiple Ofsted framework areas. Immediate leadership action is required."}
            </p>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Readiness by Framework Area</h3>
          <div className="flex flex-col gap-3">
            {categories.map((cat) => {
              const catItems = items.filter((i) => i.category === cat);
              const catScore = calcScore(Object.fromEntries(catItems.map((i) => [i.id, answers[i.id] ?? null])));
              const barColor = catScore >= 80 ? "#22c55e" : catScore >= 60 ? "#38BDF8" : catScore >= 40 ? "#f59e0b" : "#ef4444";
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

        <Certificate meta={meta} toolName="Ofsted Ready Checker" score={score} rating={rating} ratingColor={ringColor} accentColor={COLOR} areas={areas} />
        <ImprovementReport meta={meta} toolName="Ofsted Ready Checker" score={score} rating={rating} ratingColor={ringColor} gaps={gaps} accentColor={COLOR} accentDim={DIM} accentBorder={BORDER} reportId={submissionId ?? undefined} />

        <button onClick={() => { setSubmitted(false); setAnswers({}); setStep("meta"); setMeta(defaultMeta); }} className="self-start text-sm hover:text-white transition-colors" style={{ color: COLOR }}>
          ← Start again
        </button>
      </div>
    );
  }

  if (step === "meta") {
    return (
      <div className="flex flex-col gap-5">
        <ReportMeta value={meta} onChange={setMeta} accentColor={COLOR} accentDim={DIM} accentBorder={BORDER} />
        <div className="flex justify-end">
          <button onClick={() => setStep("questions")} disabled={!metaValid}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed border"
            style={{ background: DIM, borderColor: BORDER, color: COLOR }}>
            Start Assessment <ChevronRight size={14} />
          </button>
        </div>
      </div>
    );
  }

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
        <h2 className="text-white font-semibold text-sm mb-2">{activeCategory}</h2>
        <p className="text-[#475569] text-xs mb-5">Rate each area against the Ofsted EIF descriptors.</p>
        <div className="flex flex-col gap-6">
          {catItems.map((item) => (
            <div key={item.id}>
              <p className="text-[#CBD5E1] text-sm leading-relaxed mb-3">{item.text}</p>
              <div className="flex flex-wrap gap-2">
                {LEVELS.map((level) => {
                  const active = answers[item.id] === level.value;
                  return (
                    <button key={level.value!} onClick={() => setAnswers((p) => ({ ...p, [item.id]: level.value }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${active ? `${level.bg} ${level.color}` : "glass text-[#64748B] hover:text-white"}`}>
                      {level.label}
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
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all"
              style={{ background: DIM, borderColor: BORDER, color: COLOR }}>
              Next section <ChevronRight size={14} />
            </button>
          ) : (
            <button onClick={async () => { const s = await saveSubmission({ tool: "Ofsted Ready Checker", ...meta, score, rating, ratingColor: ringColor, areas, gaps }); setSubmitted(true); setSubmissionId(s.id); }}
              disabled={answered < items.length}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium border transition-all disabled:opacity-40 disabled:cursor-not-allowed"
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
