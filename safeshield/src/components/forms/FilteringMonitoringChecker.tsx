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
  // Filtering Controls
  { id: "fc1", tab: "Filtering Controls", text: "Does the school use a filtering solution that meets the DfE Filtering Standards baseline (e.g. blocks illegal content and age-inappropriate material)?", weight: 10 },
  { id: "fc2", tab: "Filtering Controls", text: "Is filtering applied consistently across all school-managed devices and networks, including Wi-Fi used by pupils?", weight: 10 },
  { id: "fc3", tab: "Filtering Controls", text: "Are filtering logs reviewed regularly to identify attempted access to blocked content or bypasses?", weight: 9 },
  { id: "fc4", tab: "Filtering Controls", text: "Is there a process for pupils or staff to report content they believe should be blocked or unblocked?", weight: 8 },

  // Monitoring Systems
  { id: "ms1", tab: "Monitoring Systems", text: "Does the school use a monitoring solution that alerts designated staff to concerning online activity by pupils?", weight: 10 },
  { id: "ms2", tab: "Monitoring Systems", text: "Are monitoring alerts reviewed in a timely manner by a trained designated safeguarding lead or deputy?", weight: 10 },
  { id: "ms3", tab: "Monitoring Systems", text: "Does the monitoring system cover all school-managed devices and remote learning platforms?", weight: 9 },
  { id: "ms4", tab: "Monitoring Systems", text: "Is the monitoring solution able to detect keywords or patterns associated with self-harm, radicalisation, or abuse?", weight: 9 },

  // Incident Response
  { id: "ir1", tab: "Incident Response", text: "Is there a documented procedure for responding to filtering/monitoring incidents that escalates to the DSL or headteacher?", weight: 10 },
  { id: "ir2", tab: "Incident Response", text: "Are all filtering and monitoring incidents logged, investigated, and reviewed as part of the school's safeguarding records?", weight: 9 },
  { id: "ir3", tab: "Incident Response", text: "Does the school have a process to share relevant safeguarding concerns identified through monitoring with external agencies?", weight: 9 },
  { id: "ir4", tab: "Incident Response", text: "Are parents informed when monitoring identifies a safeguarding concern involving their child?", weight: 8 },

  // Staff Responsibilities
  { id: "sr1", tab: "Staff Responsibilities", text: "Have all staff received training on the school's filtering and monitoring arrangements as part of safeguarding induction?", weight: 9 },
  { id: "sr2", tab: "Staff Responsibilities", text: "Is the DSL responsible for overseeing filtering and monitoring, with this documented in their role description?", weight: 9 },
  { id: "sr3", tab: "Staff Responsibilities", text: "Are technical staff who manage filtering and monitoring DBS checked and bound by a data protection agreement?", weight: 9 },
  { id: "sr4", tab: "Staff Responsibilities", text: "Does the school have an acceptable use policy that staff sign, covering their responsibilities for online safety?", weight: 8 },

  // Review & Compliance
  { id: "rc1", tab: "Review & Compliance", text: "Does the governing board receive an annual report on filtering and monitoring effectiveness and any safeguarding incidents?", weight: 9 },
  { id: "rc2", tab: "Review & Compliance", text: "Does the school's filtering and monitoring provision meet the requirements of KCSIE 2024 and the DfE Filtering Standards?", weight: 10 },
  { id: "rc3", tab: "Review & Compliance", text: "Is the filtering/monitoring solution reviewed at least annually to ensure it remains effective against new threats?", weight: 9 },
  { id: "rc4", tab: "Review & Compliance", text: "Is the school's online safety policy reviewed at least annually and approved by governors?", weight: 8 },
];

const TABS = ["Filtering Controls", "Monitoring Systems", "Incident Response", "Staff Responsibilities", "Review & Compliance"];

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

const COLOR = "#EF4444";
const DIM = "rgba(239,68,68,0.12)";
const BORDER = "rgba(239,68,68,0.25)";

const TAB_COLORS: Record<string, string> = {
  "Filtering Controls": "#F87171",
  "Monitoring Systems": "#FB923C",
  "Incident Response": "#FBBF24",
  "Staff Responsibilities": "#A78BFA",
  "Review & Compliance": "#34D399",
};

export default function FilteringMonitoringChecker() {
  const [meta, setMeta] = useState<ReportMetaData>(defaultMeta);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [step, setStep] = useState<"meta" | "questions">("meta");

  const answered = Object.keys(answers).filter((k) => answers[k] !== null).length;
  const score = calcScore(answers);
  const metaValid = meta.schoolName.trim() && meta.staffMember.trim() && meta.consultantName.trim();

  const rating = score >= 75 ? "Assured" : score >= 50 ? "Partially Assured" : "Not Assured";
  const ringColor = score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";

  const gaps: Gap[] = items
    .filter((i) => answers[i.id] === "no" || answers[i.id] === "partial")
    .map((i) => ({
      category: i.tab,
      text: i.text,
      priority: answers[i.id] === "no" && i.weight >= 9 ? "high" : answers[i.id] === "no" ? "medium" : "low",
    }));

  function submit() {
    setSubmitted(true);
    saveSubmission({ tool: "Filtering & Monitoring Assurance Review", ...meta, score, rating, ratingColor: ringColor });
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
                {score >= 75 ? "The school's filtering and monitoring arrangements are assured and meet required standards." : score >= 50 ? "Some filtering and monitoring controls are in place but gaps require attention." : "Significant gaps in filtering and monitoring — urgent action is required."}
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

        <Certificate meta={meta} toolName="Filtering & Monitoring Assurance Review" score={score} rating={rating} ratingColor={ringColor} accentColor={COLOR} areas={TABS.map(tab => {
          const ti = items.filter(i => i.tab === tab);
          const tot = ti.reduce((s, i) => s + i.weight * 2, 0);
          const earn = ti.reduce((s, i) => s + (scoreMap[answers[i.id] ?? "no"] ?? 0) * i.weight, 0);
          return { name: tab, score: tot > 0 ? Math.round((earn / tot) * 100) : 0 };
        })} />
        {gaps.length > 0 && (
          <ImprovementReport meta={meta} toolName="Filtering & Monitoring Assurance Review" score={score} rating={rating} ratingColor={ringColor} gaps={gaps} accentColor={COLOR} accentDim={DIM} accentBorder={BORDER} />
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
        <p className="text-[#64748B] text-xs mb-5">Rate each area based on your current arrangements.</p>
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
