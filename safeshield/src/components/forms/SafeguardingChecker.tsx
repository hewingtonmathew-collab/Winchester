"use client";
import { useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, ChevronRight } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import ReportMeta, { type ReportMetaData } from "@/components/report/ReportMeta";
import Certificate from "@/components/report/Certificate";
import ImprovementReport, { type Gap } from "@/components/report/ImprovementReport";
import { saveSubmission } from "@/lib/submissions";

type Answer = "yes" | "no" | "partial" | null;

type Question = {
  id: string;
  category: string;
  text: string;
  weight: number;
};

const questions: Question[] = [
  { id: "q1", category: "Online Filtering", text: "Does the school have a web content filtering solution that blocks inappropriate content across all school devices and networks?", weight: 10 },
  { id: "q2", category: "Online Filtering", text: "Is the filtering solution reviewed and updated at least annually to align with current risks and statutory guidance?", weight: 8 },
  { id: "q3", category: "Online Monitoring", text: "Does the school have monitoring software that flags safeguarding concerns from pupil online activity?", weight: 9 },
  { id: "q4", category: "Online Monitoring", text: "Are staff trained to respond to monitoring alerts promptly and appropriately?", weight: 8 },
  { id: "q5", category: "Policy", text: "Is there a current, up-to-date Online Safety Policy that has been reviewed within the last 12 months?", weight: 9 },
  { id: "q6", category: "Policy", text: "Does the school have an Acceptable Use Policy (AUP) for both staff and pupils?", weight: 7 },
  { id: "q7", category: "Policy", text: "Has the AUP been acknowledged/signed by all staff and communicated to parents and pupils?", weight: 6 },
  { id: "q8", category: "DSL & Staff", text: "Has the Designated Safeguarding Lead (DSL) received specific online safety/digital safeguarding training in the last two years?", weight: 10 },
  { id: "q9", category: "DSL & Staff", text: "Do all staff receive regular online safety awareness training as part of safeguarding CPD?", weight: 8 },
  { id: "q10", category: "DSL & Staff", text: "Is there a clear escalation pathway for staff to report digital safeguarding concerns?", weight: 9 },
  { id: "q11", category: "Curriculum", text: "Is online safety education embedded into the curriculum across all year groups (not just one-off assemblies)?", weight: 7 },
  { id: "q12", category: "Curriculum", text: "Are pupils taught about specific risks such as grooming, sexting, cyberbullying, and radicalisation online?", weight: 7 },
  { id: "q13", category: "Governance", text: "Does the governing board receive regular reports on online safety and digital safeguarding?", weight: 6 },
  { id: "q14", category: "Governance", text: "Has the school completed a digital safeguarding self-evaluation in the last 12 months?", weight: 5 },
  { id: "q15", category: "Devices", text: "Are safeguarding controls applied to all devices used for learning, including personally-owned devices used on the school network?", weight: 6 },
];

const categories = [...new Set(questions.map((q) => q.category))];

const defaultMeta: ReportMetaData = {
  schoolName: "", schoolEmail: "", consultantName: "", consultantEmail: "", staffMember: "", logoDataUrl: null,
};

function scoreValue(ans: Answer): number {
  return ans === "yes" ? 1 : ans === "partial" ? 0.5 : 0;
}

function calcScore(answers: Record<string, Answer>): number {
  const totalWeight = questions.reduce((sum, q) => sum + q.weight, 0);
  const earned = questions.reduce((sum, q) => sum + scoreValue(answers[q.id] ?? null) * q.weight, 0);
  return Math.round((earned / totalWeight) * 100);
}

function getRating(score: number): { label: string; color: string } {
  if (score >= 75) return { label: "Low Risk", color: "#22c55e" };
  if (score >= 45) return { label: "Medium Risk", color: "#f59e0b" };
  return { label: "High Risk", color: "#ef4444" };
}

function RiskBadge({ score }: { score: number }) {
  const { label, color } = getRating(score);
  if (score >= 75) return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-green-500/10 border border-green-500/25 text-green-400"><CheckCircle2 size={13} />{label}</span>;
  if (score >= 45) return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-amber-500/10 border border-amber-500/25 text-amber-400"><AlertTriangle size={13} />{label}</span>;
  return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-red-500/10 border border-red-500/25 text-red-400"><XCircle size={13} />{label}</span>;
}

export default function SafeguardingChecker() {
  const [meta, setMeta] = useState<ReportMetaData>(defaultMeta);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [step, setStep] = useState<"meta" | "questions">("meta");

  const answered = Object.values(answers).filter(Boolean).length;
  const score = calcScore(answers);
  const { label: rating, color: ratingColor } = getRating(score);

  const gaps: Gap[] = questions
    .filter((q) => (answers[q.id] ?? null) !== "yes")
    .sort((a, b) => b.weight - a.weight)
    .map((q) => ({
      category: q.category,
      text: q.text,
      priority: q.weight >= 9 ? "high" : q.weight >= 7 ? "medium" : "low",
    }));

  const metaValid = meta.schoolName.trim() && meta.staffMember.trim() && meta.consultantName.trim();

  const areas = categories.map(cat => {
    const cqs = questions.filter(q => q.category === cat);
    const tot = cqs.reduce((s, q) => s + q.weight, 0);
    const earn = cqs.reduce((s, q) => s + scoreValue(answers[q.id] ?? null) * q.weight, 0);
    return { name: cat, score: tot > 0 ? Math.round((earn / tot) * 100) : 0 };
  });

  function handleAnswer(id: string, val: Answer) {
    setAnswers((prev) => ({ ...prev, [id]: val }));
  }

  if (submitted) {
    return (
      <div className="flex flex-col gap-5">
        <GlassCard glow className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                <circle cx="50" cy="50" r="40" fill="none" stroke={ratingColor} strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`}
                  style={{ transition: "stroke-dashoffset 1s ease" }} />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl">{score}%</span>
            </div>
            <span className="text-[#64748B] text-xs">compliance score</span>
          </div>
          <div className="flex flex-col gap-3">
            <RiskBadge score={score} />
            <p className="text-[#94A3B8] text-sm leading-relaxed max-w-md">
              {score >= 75 ? "Your safeguarding provision appears strong. Continue monitoring and ensure annual reviews of all policies and tools." : score >= 45 ? "There are notable gaps in your digital safeguarding provision. Prioritise the actions below before your next inspection or review." : "Significant safeguarding risks identified. Immediate action is required across multiple areas of your digital provision."}
            </p>
          </div>
        </GlassCard>

        <Certificate meta={meta} toolName="Safeguarding Risk Checker" score={score} rating={rating} ratingColor={ratingColor} accentColor="#34D399" areas={areas} />
        <ImprovementReport meta={meta} toolName="Safeguarding Risk Checker" score={score} rating={rating} ratingColor={ratingColor} gaps={gaps} accentColor="#34D399" accentDim="rgba(52,211,153,0.12)" accentBorder="rgba(52,211,153,0.25)" reportId={submissionId ?? undefined} />

        <button onClick={() => { setSubmitted(false); setAnswers({}); setStep("meta"); setMeta(defaultMeta); }} className="self-start text-[#34D399] text-sm hover:text-white transition-colors">
          ← Start again
        </button>
      </div>
    );
  }

  if (step === "meta") {
    return (
      <div className="flex flex-col gap-5">
        <ReportMeta value={meta} onChange={setMeta} accentColor="#34D399" accentDim="rgba(52,211,153,0.12)" accentBorder="rgba(52,211,153,0.25)" />
        <div className="flex justify-end">
          <button
            onClick={() => setStep("questions")}
            disabled={!metaValid}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)", color: "#34D399" }}
          >
            Start Assessment <ChevronRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  const catQuestions = questions.filter((q) => q.category === activeCategory);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between text-xs text-[#475569] mb-1">
        <span>{answered}/{questions.length} answered</span>
        <span>{Math.round((answered / questions.length) * 100)}% complete</span>
      </div>
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-[#34D399] rounded-full transition-all duration-300" style={{ width: `${(answered / questions.length) * 100}%` }} />
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const catQs = questions.filter((q) => q.category === cat);
          const complete = catQs.every((q) => answers[q.id]);
          return (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-1.5 ${activeCategory === cat ? "bg-[rgba(52,211,153,0.15)] border border-[rgba(52,211,153,0.3)] text-[#34D399]" : "glass text-[#64748B] hover:text-white"}`}>
              {complete && <CheckCircle2 size={10} className="text-[#34D399]" />}
              {cat}
            </button>
          );
        })}
      </div>

      <GlassCard>
        <h2 className="text-white font-semibold text-sm mb-5">{activeCategory}</h2>
        <div className="flex flex-col gap-5">
          {catQuestions.map((q) => (
            <div key={q.id}>
              <p className="text-[#CBD5E1] text-sm leading-relaxed mb-2.5">{q.text}</p>
              <div className="flex gap-2">
                {(["yes", "partial", "no"] as const).map((val) => {
                  const active = answers[q.id] === val;
                  const styles = {
                    yes: active ? "bg-green-500/20 border-green-500/40 text-green-400" : "glass text-[#64748B] hover:border-green-500/30 hover:text-green-400",
                    partial: active ? "bg-amber-500/20 border-amber-500/40 text-amber-400" : "glass text-[#64748B] hover:border-amber-500/30 hover:text-amber-400",
                    no: active ? "bg-red-500/20 border-red-500/40 text-red-400" : "glass text-[#64748B] hover:border-red-500/30 hover:text-red-400",
                  };
                  return (
                    <button key={val} onClick={() => handleAnswer(q.id, val)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 capitalize ${styles[val]}`}>
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
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[rgba(52,211,153,0.1)] border border-[rgba(52,211,153,0.2)] text-[#34D399] text-sm font-medium hover:bg-[rgba(52,211,153,0.18)] transition-all">
              Next section <ChevronRight size={14} />
            </button>
          ) : (
            <button onClick={async () => { const s = await saveSubmission({ tool: "Safeguarding Risk Checker", ...meta, score, rating, ratingColor, areas, gaps }); setSubmitted(true); setSubmissionId(s.id); }} disabled={answered < questions.length}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[rgba(52,211,153,0.15)] border border-[rgba(52,211,153,0.3)] text-[#34D399] text-sm font-medium hover:bg-[rgba(52,211,153,0.25)] transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              <CheckCircle2 size={14} /> View Results
            </button>
          )}
          {answered < questions.length && <span className="text-[#475569] text-xs">{questions.length - answered} unanswered</span>}
        </div>
      </GlassCard>
    </div>
  );
}
