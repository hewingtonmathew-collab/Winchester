"use client";
import { useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, ChevronRight } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import ReportMeta, { type ReportMetaData } from "@/components/report/ReportMeta";
import Certificate from "@/components/report/Certificate";
import ImprovementReport, { type Gap } from "@/components/report/ImprovementReport";
import { saveSubmission } from "@/lib/submissions";

const COLOR = "#F59E0B";
const DIM = "rgba(245,158,11,0.12)";
const BORDER = "rgba(245,158,11,0.25)";
const TOOL_NAME = "AI Use Risk Assessment";

type Answer = "yes" | "no" | "partial" | null;

type Question = {
  id: string;
  category: string;
  text: string;
  weight: number;
};

const questions: Question[] = [
  // AI Product & Supplier
  { id: "q1",  category: "AI Product & Supplier",       text: "Has the school obtained and reviewed the supplier's privacy policy and data processing agreement?",                                          weight: 10 },
  { id: "q2",  category: "AI Product & Supplier",       text: "Is the AI product from a reputable supplier with a verifiable UK/EU data protection compliance record?",                                   weight: 9  },
  { id: "q3",  category: "AI Product & Supplier",       text: "Has the supplier confirmed whether pupil data is used to train or improve the AI model?",                                                   weight: 10 },
  { id: "q4",  category: "AI Product & Supplier",       text: "Is the AI product on an approved DfE or LA recommended list, or has it undergone equivalent vetting?",                                     weight: 8  },
  // Intended Users & Age Restrictions
  { id: "q5",  category: "Intended Users & Age Restrictions", text: "Is the AI product used only with age groups for which it is designed and approved?",                                                  weight: 10 },
  { id: "q6",  category: "Intended Users & Age Restrictions", text: "Are staff who use the AI product trained on its appropriate and inappropriate uses?",                                                 weight: 9  },
  { id: "q7",  category: "Intended Users & Age Restrictions", text: "Is there a clear record of which staff and pupils have access to each AI product?",                                                   weight: 8  },
  { id: "q8",  category: "Intended Users & Age Restrictions", text: "Are pupils supervised when using AI tools, with appropriate human oversight maintained?",                                             weight: 9  },
  // Data Protection
  { id: "q9",  category: "Data Protection",             text: "Has a Data Protection Impact Assessment (DPIA) been completed or initiated for this AI product?",                                          weight: 10 },
  { id: "q10", category: "Data Protection",             text: "Does the AI product process any special category data (health, SEN, behaviour)?",                                                          weight: 10 },
  { id: "q11", category: "Data Protection",             text: "Are personal data transfers to countries outside the UK or EEA assessed and documented?",                                                  weight: 9  },
  { id: "q12", category: "Data Protection",             text: "Is the AI product covered in the school's privacy notice and data retention schedule?",                                                    weight: 8  },
  // Safeguarding & Content
  { id: "q13", category: "Safeguarding & Content",      text: "Has the school assessed whether the AI product could generate harmful, biased or inappropriate content?",                                  weight: 10 },
  { id: "q14", category: "Safeguarding & Content",      text: "Is there a clear process for pupils or staff to report concerns about AI-generated content?",                                              weight: 9  },
  { id: "q15", category: "Safeguarding & Content",      text: "Does the school's safeguarding policy reference the use of AI tools and associated risks?",                                                weight: 9  },
  { id: "q16", category: "Safeguarding & Content",      text: "Are AI tools prevented from accessing or storing pupil images, voice recordings or sensitive documents without explicit consent?",        weight: 10 },
  // Policy & Governance
  { id: "q17", category: "Policy & Governance",         text: "Does the school have an AI Use Policy (or equivalent section in its online safety policy)?",                                               weight: 9  },
  { id: "q18", category: "Policy & Governance",         text: "Has the governing board been informed of AI tools in use and associated risks?",                                                           weight: 8  },
  { id: "q19", category: "Policy & Governance",         text: "Is there an annual review process for all AI products in use at the school?",                                                              weight: 8  },
  { id: "q20", category: "Policy & Governance",         text: "Are AI products assessed against KCSIE requirements before deployment?",                                                                   weight: 9  },
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
  if (score >= 75) return { label: "Approved",     color: "#22c55e" };
  if (score >= 50) return { label: "Conditional",  color: "#f59e0b" };
  return             { label: "Not Approved",  color: "#ef4444" };
}

function RatingBadge({ score }: { score: number }) {
  const { label } = getRating(score);
  if (score >= 75) return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-green-500/10 border border-green-500/25 text-green-400"><CheckCircle2 size={13} />{label}</span>;
  if (score >= 50) return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-amber-500/10 border border-amber-500/25 text-amber-400"><AlertTriangle size={13} />{label}</span>;
  return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-red-500/10 border border-red-500/25 text-red-400"><XCircle size={13} />{label}</span>;
}

export default function AiRiskChecker() {
  const [meta, setMeta] = useState<ReportMetaData>(defaultMeta);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [submitted, setSubmitted] = useState(false);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [step, setStep] = useState<"meta" | "questions">("meta");
  const [submissionId, setSubmissionId] = useState<string | null>(null);

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

  const areas = categories.map((cat) => {
    const cqs = questions.filter((q) => q.category === cat);
    const tot = cqs.reduce((s, q) => s + q.weight, 0);
    const earn = cqs.reduce((s, q) => s + scoreValue(answers[q.id] ?? null) * q.weight, 0);
    return { name: cat, score: tot > 0 ? Math.round((earn / tot) * 100) : 0 };
  });

  const metaValid = meta.schoolName.trim() && meta.staffMember.trim() && meta.consultantName.trim();

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
            <RatingBadge score={score} />
            <p className="text-[#94A3B8] text-sm leading-relaxed max-w-md">
              {score >= 75
                ? "This AI product meets the school's governance threshold. Maintain records, review annually, and ensure all staff remain trained on appropriate use."
                : score >= 50
                ? "Conditional approval only — significant gaps remain in supplier vetting, data protection or safeguarding controls. Address priority items before wider deployment."
                : "This AI product cannot be approved for school use in its current state. Significant risks across data protection, safeguarding or governance require immediate resolution."}
            </p>
          </div>
        </GlassCard>

        <Certificate meta={meta} toolName={TOOL_NAME} score={score} rating={rating} ratingColor={ratingColor} accentColor={COLOR} areas={areas} />
        <ImprovementReport meta={meta} toolName={TOOL_NAME} score={score} rating={rating} ratingColor={ratingColor} gaps={gaps} accentColor={COLOR} accentDim={DIM} accentBorder={BORDER} />

        <button
          onClick={() => { setSubmitted(false); setAnswers({}); setStep("meta"); setMeta(defaultMeta); setSubmissionId(null); }}
          className="self-start text-sm hover:text-white transition-colors"
          style={{ color: COLOR }}
        >
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
          <button
            onClick={() => setStep("questions")}
            disabled={!metaValid}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: DIM, border: `1px solid ${BORDER}`, color: COLOR }}
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
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${(answered / questions.length) * 100}%`, background: COLOR }} />
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const catQs = questions.filter((q) => q.category === cat);
          const complete = catQs.every((q) => answers[q.id]);
          return (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-1.5 ${activeCategory === cat ? "" : "glass text-[#64748B] hover:text-white"}`}
              style={activeCategory === cat ? { background: DIM, border: `1px solid ${BORDER}`, color: COLOR } : undefined}>
              {complete && <CheckCircle2 size={10} style={{ color: COLOR }} />}
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
                    yes:     active ? "bg-green-500/20 border-green-500/40 text-green-400"   : "glass text-[#64748B] hover:border-green-500/30 hover:text-green-400",
                    partial: active ? "bg-amber-500/20 border-amber-500/40 text-amber-400"   : "glass text-[#64748B] hover:border-amber-500/30 hover:text-amber-400",
                    no:      active ? "bg-red-500/20 border-red-500/40 text-red-400"         : "glass text-[#64748B] hover:border-red-500/30 hover:text-red-400",
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
            <button
              onClick={() => setActiveCategory(categories[categories.indexOf(activeCategory) + 1])}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium hover:opacity-80 transition-all"
              style={{ background: DIM, border: `1px solid ${BORDER}`, color: COLOR }}>
              Next section <ChevronRight size={14} />
            </button>
          ) : (
            <button
              onClick={() => {
                const id = crypto.randomUUID();
                setSubmissionId(id);
                setSubmitted(true);
                saveSubmission({ tool: TOOL_NAME, ...meta, score, rating, ratingColor, areas });
              }}
              disabled={answered < questions.length}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-80 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: DIM, border: `1px solid ${BORDER}`, color: COLOR }}>
              <CheckCircle2 size={14} /> View Results
            </button>
          )}
          {answered < questions.length && (
            <span className="text-[#475569] text-xs">{questions.length - answered} unanswered</span>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
