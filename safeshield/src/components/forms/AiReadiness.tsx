"use client";
import { useState } from "react";
import { CheckCircle2, ChevronRight } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import ReportMeta, { type ReportMetaData } from "@/components/report/ReportMeta";
import Certificate from "@/components/report/Certificate";
import ImprovementReport, { type Gap } from "@/components/report/ImprovementReport";

const defaultMeta: ReportMetaData = {
  schoolName: "", schoolEmail: "", consultantName: "", consultantEmail: "", staffMember: "", logoDataUrl: null,
};

type Answer = 0 | 1 | 2 | 3 | null;

type Question = { id: string; category: string; text: string; weight: number };

const questions: Question[] = [
  // Policy
  { id: "a1", category: "Policy", text: "Does the school have a written AI usage policy for staff?", weight: 10 },
  { id: "a2", category: "Policy", text: "Is there a separate or embedded AI policy for student use that addresses academic integrity?", weight: 9 },
  { id: "a3", category: "Policy", text: "Has the board or senior leadership team formally approved the school's position on AI use?", weight: 8 },
  // Data Protection
  { id: "a4", category: "Data Protection", text: "Before adopting any AI tool, is a Data Protection Impact Assessment (DPIA) completed?", weight: 10 },
  { id: "a5", category: "Data Protection", text: "Does the school check whether AI tools process pupil or staff personal data outside the UK/EEA?", weight: 9 },
  { id: "a6", category: "Data Protection", text: "Are staff trained on data protection implications of using AI tools (e.g. not inputting personal data into public AI)?", weight: 9 },
  // Safeguarding
  { id: "a7", category: "Safeguarding", text: "Has the school assessed safeguarding risks associated with AI-generated content (e.g. deepfakes, AI-generated CSAM)?", weight: 10 },
  { id: "a8", category: "Safeguarding", text: "Are pupils taught about the risks and responsible use of generative AI as part of the online safety curriculum?", weight: 8 },
  // Procurement
  { id: "a9", category: "Procurement", text: "Is there a formal process for evaluating AI products before purchase, covering data, safeguarding, and pedagogical value?", weight: 9 },
  { id: "a10", category: "Procurement", text: "Are AI vendors vetted for compliance with UK GDPR, DfE standards, and safeguarding obligations?", weight: 8 },
  // Staff Capability
  { id: "a11", category: "Staff Capability", text: "Have staff received CPD on responsible AI use in their professional role?", weight: 9 },
  { id: "a12", category: "Staff Capability", text: "Do leaders understand AI's limitations, bias risks, and implications for professional judgment?", weight: 8 },
  { id: "a13", category: "Staff Capability", text: "Is there a named staff lead or working group responsible for AI governance in the school?", weight: 7 },
  // Governance
  { id: "a14", category: "Governance", text: "Has the governing board been briefed on AI risks and opportunities in the last 12 months?", weight: 8 },
  { id: "a15", category: "Governance", text: "Is AI included in the school's risk register with identified controls?", weight: 7 },
];

const categories = [...new Set(questions.map((q) => q.category))];

const LEVELS = [
  { value: 0, label: "Not started", color: "text-red-400", bg: "bg-red-500/15 border-red-500/30" },
  { value: 1, label: "Planned", color: "text-orange-400", bg: "bg-orange-500/15 border-orange-500/30" },
  { value: 2, label: "Partial", color: "text-amber-400", bg: "bg-amber-500/15 border-amber-500/30" },
  { value: 3, label: "Fully in place", color: "text-green-400", bg: "bg-green-500/15 border-green-500/30" },
] as const;

function calcScore(answers: Record<string, Answer>): number {
  const total = questions.reduce((s, q) => s + q.weight * 3, 0);
  const earned = questions.reduce((s, q) => s + (answers[q.id] ?? 0) * q.weight, 0);
  return Math.round((earned / total) * 100);
}

export default function AiReadiness() {
  const [meta, setMeta] = useState<ReportMetaData>(defaultMeta);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [submitted, setSubmitted] = useState(false);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [step, setStep] = useState<"meta" | "questions">("meta");

  const answered = Object.keys(answers).filter((k) => answers[k] !== null).length;
  const score = calcScore(answers);
  const metaValid = meta.schoolName.trim() && meta.staffMember.trim() && meta.consultantName.trim();

  const readinessLabel = score >= 75 ? "Ready" : score >= 50 ? "Developing" : score >= 25 ? "Early Stage" : "Not Started";
  const ringColor = score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : score >= 25 ? "#fb923c" : "#ef4444";

  const priorities = questions
    .filter((q) => (answers[q.id] ?? 0) < 3)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 8);

  const reportGaps: Gap[] = priorities.map((q) => ({
    category: q.category,
    text: q.text,
    priority: q.weight >= 9 ? "high" : q.weight >= 7 ? "medium" : "low",
  }));

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
            <span className="text-xl font-bold" style={{ color: ringColor }}>{readinessLabel}</span>
            <p className="text-[#94A3B8] text-sm leading-relaxed max-w-md">
              {score >= 75 ? "Strong AI governance foundations in place. Focus on embedding and continuous improvement as AI evolves." : score >= 50 ? "Good progress but several key areas need strengthening before full responsible adoption." : score >= 25 ? "Early stages of AI readiness. Prioritise policy, data protection, and safeguarding risk work." : "AI governance has not yet been established. Begin with policy development, board briefing, and data protection review."}
            </p>
          </div>
        </GlassCard>

        {/* Category breakdown */}
        <GlassCard>
          <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Readiness by Area</h3>
          <div className="flex flex-col gap-3">
            {categories.map((cat) => {
              const catQs = questions.filter((q) => q.category === cat);
              const catScore = calcScore(Object.fromEntries(catQs.map((q) => [q.id, answers[q.id] ?? null])));
              const barColor = catScore >= 75 ? "#22c55e" : catScore >= 50 ? "#f59e0b" : catScore >= 25 ? "#fb923c" : "#ef4444";
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

        {priorities.length > 0 && (
          <GlassCard>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Top Priority Actions</h3>
            <div className="flex flex-col gap-2.5">
              {priorities.map((q) => {
                const level = LEVELS.find((l) => l.value === (answers[q.id] ?? 0))!;
                return (
                  <div key={q.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className={`mt-0.5 shrink-0 text-xs font-bold px-1.5 py-0.5 rounded border ${level.bg} ${level.color}`}>{level.label.toUpperCase()}</span>
                    <div>
                      <p className="text-[#94A3B8] text-xs leading-relaxed">{q.text}</p>
                      <span className="text-[#475569] text-[0.6rem] uppercase tracking-wider">{q.category}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        )}

        <Certificate meta={meta} toolName="AI Readiness Assessment" score={score} rating={readinessLabel} ratingColor={ringColor} accentColor="#FB923C" />
        <ImprovementReport meta={meta} toolName="AI Readiness Assessment" score={score} rating={readinessLabel} ratingColor={ringColor} gaps={reportGaps} accentColor="#FB923C" accentDim="rgba(251,146,60,0.12)" accentBorder="rgba(251,146,60,0.25)" />

        <button onClick={() => { setSubmitted(false); setAnswers({}); setStep("meta"); setMeta(defaultMeta); }} className="self-start text-[#FB923C] text-sm hover:text-white transition-colors">
          ← Start again
        </button>
      </div>
    );
  }

  if (step === "meta") {
    return (
      <div className="flex flex-col gap-5">
        <ReportMeta value={meta} onChange={setMeta} accentColor="#FB923C" accentDim="rgba(251,146,60,0.12)" accentBorder="rgba(251,146,60,0.25)" />
        <div className="flex justify-end">
          <button onClick={() => setStep("questions")} disabled={!metaValid}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "rgba(251,146,60,0.12)", border: "1px solid rgba(251,146,60,0.3)", color: "#FB923C" }}>
            Start Assessment <ChevronRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between text-xs text-[#475569]">
        <span>{answered}/{questions.length} answered</span>
        <span>{Math.round((answered / questions.length) * 100)}% complete</span>
      </div>
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-[#FB923C] rounded-full transition-all duration-300" style={{ width: `${(answered / questions.length) * 100}%` }} />
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const complete = questions.filter((q) => q.category === cat).every((q) => answers[q.id] !== undefined);
          return (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${activeCategory === cat ? "bg-[rgba(251,146,60,0.15)] border border-[rgba(251,146,60,0.3)] text-[#FB923C]" : "glass text-[#64748B] hover:text-white"}`}>
              {complete && <CheckCircle2 size={10} className="text-[#FB923C]" />}
              {cat}
            </button>
          );
        })}
      </div>

      <GlassCard>
        <h2 className="text-white font-semibold text-sm mb-1">{activeCategory}</h2>
        <p className="text-[#475569] text-xs mb-5">Rate your current position for each statement.</p>
        <div className="flex flex-col gap-6">
          {questions.filter((q) => q.category === activeCategory).map((q) => (
            <div key={q.id}>
              <p className="text-[#CBD5E1] text-sm leading-relaxed mb-3">{q.text}</p>
              <div className="flex flex-wrap gap-2">
                {LEVELS.map((level) => {
                  const active = answers[q.id] === level.value;
                  return (
                    <button key={level.value} onClick={() => setAnswers((p) => ({ ...p, [q.id]: level.value as Answer }))}
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
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[rgba(251,146,60,0.1)] border border-[rgba(251,146,60,0.2)] text-[#FB923C] text-sm font-medium hover:bg-[rgba(251,146,60,0.18)] transition-all">
              Next section <ChevronRight size={14} />
            </button>
          ) : (
            <button onClick={() => setSubmitted(true)} disabled={answered < questions.length}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[rgba(251,146,60,0.15)] border border-[rgba(251,146,60,0.3)] text-[#FB923C] text-sm font-medium hover:bg-[rgba(251,146,60,0.25)] transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              <CheckCircle2 size={14} /> View Results
            </button>
          )}
          {answered < questions.length && <span className="text-[#475569] text-xs">{questions.length - answered} unanswered</span>}
        </div>
      </GlassCard>
    </div>
  );
}
