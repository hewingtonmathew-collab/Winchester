"use client";
import { useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, ChevronRight } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import ReportMeta, { type ReportMetaData } from "@/components/report/ReportMeta";
import Certificate from "@/components/report/Certificate";
import ImprovementReport, { type Gap } from "@/components/report/ImprovementReport";
import { saveSubmission } from "@/lib/submissions";

const COLOR = "#EF4444";
const DIM = "rgba(239,68,68,0.12)";
const BORDER = "rgba(239,68,68,0.25)";
const TOOL_NAME = "Filtering & Monitoring Assurance";

type Answer = "yes" | "no" | "partial" | null;

type Question = {
  id: string;
  category: string;
  text: string;
  weight: number;
};

const questions: Question[] = [
  // Filtering Controls
  { id: "q1",  category: "Filtering Controls",                 text: "Does the school use an approved filtering solution that meets the DfE Filtering Standards for schools?",                                             weight: 10 },
  { id: "q2",  category: "Filtering Controls",                 text: "Is the filtering solution configured to block categories of harmful content including pornography, extremism, self-harm and gambling?",             weight: 10 },
  { id: "q3",  category: "Filtering Controls",                 text: "Is the filtering solution applied consistently across all school-owned devices, including mobile devices and tablets?",                              weight: 9  },
  { id: "q4",  category: "Filtering Controls",                 text: "Is the filtering solution reviewed and updated at least annually to address new and emerging online threats?",                                       weight: 8  },
  // Monitoring Controls
  { id: "q5",  category: "Monitoring Controls",                text: "Does the school use a monitoring solution that meets the DfE Monitoring Standards?",                                                                weight: 10 },
  { id: "q6",  category: "Monitoring Controls",                text: "Does the monitoring system provide real-time or near-real-time alerts for safeguarding concerns?",                                                   weight: 9  },
  { id: "q7",  category: "Monitoring Controls",                text: "Are monitoring alerts reviewed promptly by a trained member of staff (DSL or nominated deputy)?",                                                   weight: 10 },
  { id: "q8",  category: "Monitoring Controls",                text: "Is monitoring applied to all school-managed platforms including email, Google Workspace and Microsoft 365?",                                        weight: 8  },
  // DSL Oversight & Alert Management
  { id: "q9",  category: "DSL Oversight & Alert Management",   text: "Has the Designated Safeguarding Lead received specific training on interpreting and responding to monitoring alerts?",                               weight: 10 },
  { id: "q10", category: "DSL Oversight & Alert Management",   text: "Is there a documented escalation process for managing high-priority monitoring alerts?",                                                            weight: 9  },
  { id: "q11", category: "DSL Oversight & Alert Management",   text: "Are filtering and monitoring reports reviewed by the DSL at least termly?",                                                                        weight: 8  },
  { id: "q12", category: "DSL Oversight & Alert Management",   text: "Is the governing board informed of filtering and monitoring arrangements and any significant incidents?",                                           weight: 7  },
  // BYOD, AI Tools & Emerging Risks
  { id: "q13", category: "BYOD, AI Tools & Emerging Risks",    text: "Are BYOD (bring your own device) policies in place that specify filtering and monitoring expectations for personal devices on the school network?",  weight: 9  },
  { id: "q14", category: "BYOD, AI Tools & Emerging Risks",    text: "Has the school assessed whether AI tools in use are subject to appropriate content filtering?",                                                    weight: 9  },
  { id: "q15", category: "BYOD, AI Tools & Emerging Risks",    text: "Is there a process for reviewing and approving new apps or platforms before they are used with pupils?",                                           weight: 8  },
  { id: "q16", category: "BYOD, AI Tools & Emerging Risks",    text: "Are staff aware of the risks of pupils bypassing filtering using VPNs or personal mobile data connections?",                                      weight: 8  },
  // Vulnerable Pupils & Compliance
  { id: "q17", category: "Vulnerable Pupils & Compliance",     text: "Are enhanced monitoring arrangements in place for pupils who are identified as vulnerable or at risk?",                                            weight: 10 },
  { id: "q18", category: "Vulnerable Pupils & Compliance",     text: "Are SEND pupils' needs considered when configuring filtering to avoid over-blocking educational content?",                                         weight: 8  },
  { id: "q19", category: "Vulnerable Pupils & Compliance",     text: "Has the school completed an annual review of filtering and monitoring in line with KCSIE and DfE standards?",                                     weight: 9  },
  { id: "q20", category: "Vulnerable Pupils & Compliance",     text: "Is filtering and monitoring evidenced as part of the school's safeguarding self-evaluation?",                                                     weight: 8  },
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
  if (score >= 75) return { label: "Assured",           color: "#22c55e" };
  if (score >= 50) return { label: "Partially Assured", color: "#f59e0b" };
  return               { label: "Not Assured",          color: "#ef4444" };
}

function RatingBadge({ score }: { score: number }) {
  const { label } = getRating(score);
  if (score >= 75) return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-green-500/10 border border-green-500/25 text-green-400"><CheckCircle2 size={13} />{label}</span>;
  if (score >= 50) return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-amber-500/10 border border-amber-500/25 text-amber-400"><AlertTriangle size={13} />{label}</span>;
  return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-red-500/10 border border-red-500/25 text-red-400"><XCircle size={13} />{label}</span>;
}

export default function FilteringMonitoringChecker() {
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
                ? "Your school's filtering and monitoring arrangements meet the required standards. Continue annual reviews and maintain DSL oversight of alerts."
                : score >= 50
                ? "Your school has partial filtering and monitoring provision. Address the priority gaps below to achieve full compliance with KCSIE and DfE standards."
                : "Significant gaps identified in filtering and monitoring arrangements. Immediate action is required to meet KCSIE legal requirements and DfE standards."}
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
                saveSubmission({ id, tool: TOOL_NAME, ...meta, score, rating, ratingColor, areas, gaps });
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
