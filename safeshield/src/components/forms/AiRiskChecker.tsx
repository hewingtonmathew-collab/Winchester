"use client";
import { useState } from "react";
import { CheckCircle2, ChevronRight } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import ReportMeta, { type ReportMetaData } from "@/components/report/ReportMeta";
import Certificate from "@/components/report/Certificate";
import ImprovementReport, { type Gap } from "@/components/report/ImprovementReport";
import { saveSubmission } from "@/lib/submissions";

type Answer = "yes" | "partial" | "no" | null;
type Item = { id: string; tab: string; text: string; weight: number };

const items: Item[] = [
  // AI Governance & Policy
  { id: "ag1", tab: "AI Governance & Policy", text: "Does the school have a written AI use policy covering both staff and pupil use of AI tools?", weight: 10 },
  { id: "ag2", tab: "AI Governance & Policy", text: "Does the policy specify which AI tools are approved for use and under what conditions?", weight: 9 },
  { id: "ag3", tab: "AI Governance & Policy", text: "Has the policy been reviewed by the governing board and approved within the last 12 months?", weight: 8 },
  { id: "ag4", tab: "AI Governance & Policy", text: "Is there a named AI lead or coordinator responsible for governance and staff guidance?", weight: 8 },

  // Pupil Data & Privacy
  { id: "dp1", tab: "Pupil Data & Privacy", text: "Has a Data Protection Impact Assessment (DPIA) been completed for each AI tool used with pupil data?", weight: 10 },
  { id: "dp2", tab: "Pupil Data & Privacy", text: "Are staff prohibited from inputting identifiable pupil data into unapproved AI tools or consumer AI platforms?", weight: 10 },
  { id: "dp3", tab: "Pupil Data & Privacy", text: "Does the school's privacy notice inform parents about the use of AI tools that may process pupil data?", weight: 9 },
  { id: "dp4", tab: "Pupil Data & Privacy", text: "Are data processing agreements in place with all AI tool providers used in school?", weight: 9 },

  // Staff Training
  { id: "st1", tab: "Staff Training", text: "Have all staff who use AI tools received training on safe, ethical, and effective use within the last 12 months?", weight: 9 },
  { id: "st2", tab: "Staff Training", text: "Are staff trained to critically evaluate AI outputs and understand the risk of hallucination or bias?", weight: 9 },
  { id: "st3", tab: "Staff Training", text: "Do staff understand their professional responsibility when using AI to assist with communications, reports, or assessments?", weight: 8 },
  { id: "st4", tab: "Staff Training", text: "Is there a process for staff to report concerns or incidents related to AI tool use?", weight: 8 },

  // Curriculum Integration
  { id: "ci1", tab: "Curriculum Integration", text: "Does the school teach pupils about AI literacy, including how AI works, its benefits, and its risks?", weight: 9 },
  { id: "ci2", tab: "Curriculum Integration", text: "Are pupils taught to critically evaluate AI-generated content and understand concepts like bias and hallucination?", weight: 9 },
  { id: "ci3", tab: "Curriculum Integration", text: "Does the school have clear academic integrity guidance covering pupil use of AI for schoolwork?", weight: 9 },
  { id: "ci4", tab: "Curriculum Integration", text: "Is AI education embedded within the computing or PSHE curriculum in a structured way?", weight: 8 },

  // Safeguarding & Ethics
  { id: "se1", tab: "Safeguarding & Ethics", text: "Has the school assessed whether any approved AI tools could generate inappropriate, harmful, or biased content?", weight: 10 },
  { id: "se2", tab: "Safeguarding & Ethics", text: "Are content filtering or moderation controls in place for AI tools accessible to pupils?", weight: 10 },
  { id: "se3", tab: "Safeguarding & Ethics", text: "Does the school monitor and review AI tool usage to identify any safeguarding concerns?", weight: 9 },
  { id: "se4", tab: "Safeguarding & Ethics", text: "Is there an escalation process if an AI tool produces content that raises a safeguarding concern?", weight: 9 },
];

const TABS = ["AI Governance & Policy", "Pupil Data & Privacy", "Staff Training", "Curriculum Integration", "Safeguarding & Ethics"];

const defaultMeta: ReportMetaData = {
  schoolName: "", schoolEmail: "", consultantName: "", consultantEmail: "", staffMember: "", logoDataUrl: null,
};

const LEVELS: { value: Answer; label: string; color: string; bg: string }[] = [
  { value: "yes", label: "Yes — In Place", color: "text-green-400", bg: "bg-green-500/15 border-green-500/30" },
  { value: "partial", label: "Partially in Place", color: "text-amber-400", bg: "bg-amber-500/15 border-amber-500/30" },
  { value: "no", label: "Not in Place", color: "text-red-400", bg: "bg-red-500/15 border-red-500/30" },
];

const scoreMap: Record<NonNullable<Answer>, number> = { yes: 2, partial: 1, no: 0 };

function calcScore(answers: Record<string, Answer>): number {
  const total = items.reduce((s, i) => s + i.weight * 2, 0);
  const earned = items.reduce((s, i) => s + (scoreMap[answers[i.id] ?? "no"] ?? 0) * i.weight, 0);
  return Math.round((earned / total) * 100);
}

const COLOR = "#F59E0B";
const DIM = "rgba(245,158,11,0.12)";
const BORDER = "rgba(245,158,11,0.25)";

const TAB_COLORS: Record<string, string> = {
  "AI Governance & Policy": "#F59E0B",
  "Pupil Data & Privacy": "#FBBF24",
  "Staff Training": "#FCD34D",
  "Curriculum Integration": "#D97706",
  "Safeguarding & Ethics": "#B45309",
};

export default function AiRiskChecker() {
  const [meta, setMeta] = useState<ReportMetaData>(defaultMeta);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [step, setStep] = useState<"meta" | "questions">("meta");

  const answered = Object.keys(answers).filter((k) => answers[k] !== null).length;
  const score = calcScore(answers);
  const metaValid = meta.schoolName.trim() && meta.staffMember.trim() && meta.consultantName.trim();

  const rating = score >= 75 ? "Approved" : score >= 50 ? "Conditional" : "Not Approved";
  const ringColor = score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";

  const gaps: Gap[] = items
    .filter((i) => i.weight >= 9 && answers[i.id] !== "yes")
    .map((i) => ({
      category: i.tab,
      text: i.text,
      priority: i.weight >= 9 ? "high" : i.weight >= 7 ? "medium" : "low",
    }));

  function submit() {
    setSubmitted(true);
    const areas = TABS.map((tab) => {
      const ti = items.filter((i) => i.tab === tab);
      const tot = ti.reduce((s, i) => s + i.weight * 2, 0);
      const earn = ti.reduce((s, i) => s + (scoreMap[answers[i.id] ?? "no"] ?? 0) * i.weight, 0);
      return { name: tab, score: tot > 0 ? Math.round((earn / tot) * 100) : 0 };
    });
    saveSubmission({ tool: "AI Use Risk Assessment", ...meta, score, rating, ratingColor: ringColor, areas });
  }

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

  if (submitted) {
    return (
      <div className="flex flex-col gap-5">
        <GlassCard>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex flex-col items-center gap-1.5">
              <svg width="110" height="110" viewBox="0 0 110 110">
                <circle cx="55" cy="55" r="45" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                <circle cx="55" cy="55" r="45" fill="none" stroke={ringColor} strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 45} strokeDashoffset={2 * Math.PI * 45 - (score / 100) * 2 * Math.PI * 45}
                  style={{ transform: "rotate(-90deg)", transformOrigin: "55px 55px", transition: "stroke-dashoffset 0.8s ease" }} />
                <text x="55" y="55" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="22" fontWeight="bold">{score}</text>
              </svg>
              <span className="text-[#64748B] text-xs">out of 100</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold"
                style={{ background: "#000", border: `2px solid ${ringColor}`, color: ringColor }}>
                <CheckCircle2 size={13} /> {rating}
              </span>
              <p className="text-[#94A3B8] text-sm leading-relaxed max-w-xs">
                {score >= 75 ? "The school's AI governance and safeguarding controls meet the standard for approved use." : score >= 50 ? "Some controls are in place but important gaps must be addressed before full approval." : "Significant AI governance gaps identified — use of AI tools should be reviewed urgently."}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Per-tab breakdown */}
        <GlassCard>
          <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Results by Area</h3>
          <div className="flex flex-col gap-3">
            {TABS.map((tab) => {
              const tabItems = items.filter((i) => i.tab === tab);
              const tabTotal = tabItems.reduce((s, i) => s + i.weight * 2, 0);
              const tabEarned = tabItems.reduce((s, i) => s + (scoreMap[answers[i.id] ?? "no"] ?? 0) * i.weight, 0);
              const tabScore = Math.round((tabEarned / tabTotal) * 100);
              const tc = TAB_COLORS[tab];
              return (
                <div key={tab}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-xs font-medium">{tab}</span>
                    <span className="text-xs font-semibold" style={{ color: tc }}>{tabScore}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${tabScore}%`, background: tc }} />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        <Certificate meta={meta} toolName="AI Use Risk Assessment" score={score} rating={rating} ratingColor={ringColor} accentColor={COLOR} areas={TABS.map((tab) => {
          const ti = items.filter((i) => i.tab === tab);
          const tot = ti.reduce((s, i) => s + i.weight * 2, 0);
          const earn = ti.reduce((s, i) => s + (scoreMap[answers[i.id] ?? "no"] ?? 0) * i.weight, 0);
          return { name: tab, score: tot > 0 ? Math.round((earn / tot) * 100) : 0 };
        })} />
        {gaps.length > 0 && (
          <ImprovementReport meta={meta} toolName="AI Use Risk Assessment" score={score} rating={rating} ratingColor={ringColor} gaps={gaps} accentColor={COLOR} accentDim={DIM} accentBorder={BORDER} />
        )}
        <button onClick={() => { setSubmitted(false); setAnswers({}); setStep("meta"); setMeta(defaultMeta); }}
          className="self-start text-sm hover:text-white transition-colors" style={{ color: COLOR }}>
          ← Start again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Tab navigation */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const tc = TAB_COLORS[tab];
          const tabItems = items.filter((i) => i.tab === tab);
          const answeredInTab = tabItems.filter((i) => answers[i.id] !== undefined && answers[i.id] !== null).length;
          const complete = answeredInTab === tabItems.length;
          return (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={activeTab === tab
                ? { background: `${tc}20`, border: `1px solid ${tc}60`, color: tc }
                : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: complete ? tc : "#64748B" }}>
              {complete && <CheckCircle2 size={11} />}
              {tab}
              <span className="opacity-60 text-[10px]">{answeredInTab}/{tabItems.length}</span>
            </button>
          );
        })}
      </div>

      {/* Questions */}
      <GlassCard>
        <h3 className="text-white font-semibold text-sm mb-1 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: TAB_COLORS[activeTab] }} />
          {activeTab}
        </h3>
        <p className="text-[#64748B] text-xs mb-5">Rate each area based on your current provision.</p>
        <div className="flex flex-col divide-y divide-white/5">
          {items.filter((i) => i.tab === activeTab).map((item) => (
            <div key={item.id} className="py-4">
              <p className="text-[#CBD5E1] text-sm leading-relaxed mb-3">{item.text}</p>
              <div className="flex flex-wrap gap-2">
                {LEVELS.map(({ value, label, color, bg }) => (
                  <button key={value} onClick={() => setAnswers((a) => ({ ...a, [item.id]: value }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${answers[item.id] === value ? `${bg} ${color}` : "bg-white/3 border-white/8 text-[#475569] hover:border-white/15"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Navigation + submit */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#475569]">{answered} of {items.length} questions answered</span>
        <div className="flex gap-2">
          {TABS.indexOf(activeTab) < TABS.length - 1 ? (
            <button
              onClick={() => setActiveTab(TABS[TABS.indexOf(activeTab) + 1])}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: DIM, border: `1px solid ${BORDER}`, color: COLOR }}>
              Next Section <ChevronRight size={14} />
            </button>
          ) : (
            <button onClick={submit} disabled={answered < items.length}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: DIM, border: `1px solid ${BORDER}`, color: COLOR }}>
              Generate Report <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
