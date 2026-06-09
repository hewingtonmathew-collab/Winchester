"use client";
import { useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, ChevronRight } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import ReportMeta, { type ReportMetaData } from "@/components/report/ReportMeta";
import Certificate from "@/components/report/Certificate";
import ImprovementReport, { type Gap } from "@/components/report/ImprovementReport";
import { saveSubmission } from "@/lib/submissions";

const COLOR = "#8B5CF6";
const DIM = "rgba(139,92,246,0.12)";
const BORDER = "rgba(139,92,246,0.25)";
const TOOL_NAME = "SEND Digital Impact Review";

type Answer = "yes" | "no" | "partial" | null;

type Question = {
  id: string;
  category: string;
  text: string;
  weight: number;
};

const questions: Question[] = [
  // Accessibility & Universal Design
  { id: "q1",  category: "Accessibility & Universal Design",    text: "Are all digital tools used in school assessed for accessibility compliance (WCAG 2.1 AA) before deployment?",                                       weight: 10 },
  { id: "q2",  category: "Accessibility & Universal Design",    text: "Do devices provided to SEND pupils include appropriate accessibility settings (font size, contrast, screen readers)?",                              weight: 9  },
  { id: "q3",  category: "Accessibility & Universal Design",    text: "Are digital platforms used by the school compatible with assistive technologies such as text-to-speech and AAC devices?",                           weight: 9  },
  { id: "q4",  category: "Accessibility & Universal Design",    text: "Is there a named person responsible for reviewing the accessibility of digital tools for SEND pupils?",                                             weight: 7  },
  // Learning & Communication Support
  { id: "q5",  category: "Learning & Communication Support",    text: "Are digital tools selected to support SEND pupils' individual communication needs (e.g. symbol-based, visual communication apps)?",                 weight: 9  },
  { id: "q6",  category: "Learning & Communication Support",    text: "Do SEND pupils have access to digital tools that support their specific learning difficulties (e.g. dyslexia, processing difficulties)?",            weight: 10 },
  { id: "q7",  category: "Learning & Communication Support",    text: "Are staff trained to use assistive and adaptive technologies effectively with SEND pupils?",                                                         weight: 9  },
  { id: "q8",  category: "Learning & Communication Support",    text: "Are digital literacy skills taught to SEND pupils in a way that is adapted to their needs?",                                                        weight: 8  },
  // EHCP & Independence
  { id: "q9",  category: "EHCP & Independence",                 text: "Where relevant, is technology provision and use referenced in pupils' Education, Health and Care Plans (EHCPs)?",                                   weight: 10 },
  { id: "q10", category: "EHCP & Independence",                 text: "Are digital tools used to promote independence and reduce reliance on adult support where appropriate?",                                             weight: 8  },
  { id: "q11", category: "EHCP & Independence",                 text: "Is progress towards EHCP outcomes tracked using digital tools or systems in a SEND-appropriate way?",                                               weight: 8  },
  { id: "q12", category: "EHCP & Independence",                 text: "Are SEND pupils supported to develop self-regulation skills around their use of digital technology?",                                               weight: 7  },
  // Sensory, Cognitive & Anxiety Considerations
  { id: "q13", category: "Sensory, Cognitive & Anxiety",        text: "Are sensory considerations (screen brightness, sound levels, visual stimulation) addressed for pupils with sensory processing needs?",              weight: 9  },
  { id: "q14", category: "Sensory, Cognitive & Anxiety",        text: "Are digital workloads appropriately adjusted for pupils with cognitive processing difficulties?",                                                   weight: 9  },
  { id: "q15", category: "Sensory, Cognitive & Anxiety",        text: "Is screen use monitored and limited where pupils experience technology-related anxiety or sensory overload?",                                       weight: 9  },
  { id: "q16", category: "Sensory, Cognitive & Anxiety",        text: "Are staff aware of the signs that a SEND pupil is becoming overwhelmed by digital technology?",                                                    weight: 8  },
  // Pupil Voice, Parent & SENCO Review
  { id: "q17", category: "Pupil Voice, Parent & SENCO Review",  text: "Are SEND pupils' views on their use of digital technology sought and acted upon?",                                                                  weight: 8  },
  { id: "q18", category: "Pupil Voice, Parent & SENCO Review",  text: "Are parents and carers of SEND pupils involved in decisions about technology use at school and at home?",                                          weight: 8  },
  { id: "q19", category: "Pupil Voice, Parent & SENCO Review",  text: "Does the SENCO conduct regular reviews of digital tool effectiveness for SEND pupils?",                                                            weight: 9  },
  { id: "q20", category: "Pupil Voice, Parent & SENCO Review",  text: "Is the impact of digital technology on SEND pupils reported to governors at least annually?",                                                      weight: 7  },
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
  if (score >= 75) return { label: "Inclusive",             color: "#22c55e" };
  if (score >= 50) return { label: "Developing",            color: "#f59e0b" };
  return               { label: "Requires Improvement",    color: "#ef4444" };
}

function RatingBadge({ score }: { score: number }) {
  const { label } = getRating(score);
  if (score >= 75) return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-green-500/10 border border-green-500/25 text-green-400"><CheckCircle2 size={13} />{label}</span>;
  if (score >= 50) return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-amber-500/10 border border-amber-500/25 text-amber-400"><AlertTriangle size={13} />{label}</span>;
  return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-red-500/10 border border-red-500/25 text-red-400"><XCircle size={13} />{label}</span>;
}

export default function SendDigitalChecker() {
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
                ? "Your school demonstrates inclusive digital practice for SEND pupils. Continue reviewing tools annually and involving the SENCO and pupils in evaluations."
                : score >= 50
                ? "Your school is developing its SEND digital provision. Address the priority gaps below to strengthen inclusion and compliance with the SEND Code of Practice."
                : "Significant gaps identified in SEND digital provision. Immediate action is required to meet legal duties under the Equality Act 2010 and SEND Code of Practice."}
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
