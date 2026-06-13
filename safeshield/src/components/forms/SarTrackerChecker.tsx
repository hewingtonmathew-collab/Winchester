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
  // Policy & Procedure
  { id: "pp1", tab: "Policy & Procedure", text: "Is there a written Subject Access Request (SAR) procedure that covers how requests are received, acknowledged, processed, and responded to?", weight: 10 },
  { id: "pp2", tab: "Policy & Procedure", text: "Has a named individual (DPO or data lead) been designated to handle SARs and are they contactable by both staff and data subjects?", weight: 9 },
  { id: "pp3", tab: "Policy & Procedure", text: "Has the SAR procedure been reviewed in the last 12 months to ensure it reflects current UK GDPR and DPA 2018 requirements?", weight: 8 },
  { id: "pp4", tab: "Policy & Procedure", text: "Is a SAR log maintained that records every request received, key dates, actions taken, and the outcome?", weight: 10 },
  { id: "pp5", tab: "Policy & Procedure", text: "Do all staff know how to identify a SAR — including informal requests, requests made verbally, or requests made via a third party?", weight: 9 },
  { id: "pp6", tab: "Policy & Procedure", text: "Does the procedure cover SARs made by or on behalf of children, including requests from parents, carers, and legal guardians?", weight: 9 },

  // Receipt & Verification
  { id: "rv1", tab: "Receipt & Verification", text: "Is an acknowledgement sent to the requester within 5 working days, confirming receipt and the expected response date?", weight: 10 },
  { id: "rv2", tab: "Receipt & Verification", text: "Is there a documented process for verifying the identity of the requester before disclosing personal data — including what ID is accepted?", weight: 10 },
  { id: "rv3", tab: "Receipt & Verification", text: "Is there a process for handling SARs made by third parties (e.g. solicitors, parents on behalf of an adult child) including consent requirements?", weight: 8 },
  { id: "rv4", tab: "Receipt & Verification", text: "Is there a process for assessing requests from children — considering whether the child has sufficient understanding to exercise their own rights?", weight: 9 },
  { id: "rv5", tab: "Receipt & Verification", text: "Are verbal SARs recognised and treated as formal requests, with a written record created immediately upon receipt?", weight: 8 },

  // Processing & Response
  { id: "pr1", tab: "Processing & Response", text: "Is the 30 calendar day response deadline tracked for every SAR from the date of receipt (or date of identity verification, whichever is later)?", weight: 10 },
  { id: "pr2", tab: "Processing & Response", text: "Is there a documented process for extending the deadline by a further two months for complex or numerous requests, including notifying the requester within one month?", weight: 9 },
  { id: "pr3", tab: "Processing & Response", text: "Is there a clear redaction process to protect the personal data of third parties before disclosure, with someone competent in redaction responsible?", weight: 9 },
  { id: "pr4", tab: "Processing & Response", text: "Are relevant exemptions (safeguarding, legal professional privilege, management information, regulatory activity) understood and applied correctly where appropriate?", weight: 9 },
  { id: "pr5", tab: "Processing & Response", text: "Is personal data provided in a commonly used, machine-readable format where the requester has requested electronic access?", weight: 7 },

  // Refusal & Exemptions
  { id: "re1", tab: "Refusal & Exemptions", text: "Is there a documented process for identifying and handling manifestly unfounded or excessive SAR requests?", weight: 8 },
  { id: "re2", tab: "Refusal & Exemptions", text: "Where a SAR is refused (in whole or in part), is the requester notified in writing within the 30-day deadline with reasons and their right to complain to the ICO?", weight: 10 },
  { id: "re3", tab: "Refusal & Exemptions", text: "Are partial refusals documented — recording what was disclosed, what was withheld, and the specific exemption relied upon?", weight: 8 },
  { id: "re4", tab: "Refusal & Exemptions", text: "Is there an internal appeals or complaints process for requesters who are dissatisfied with a SAR response?", weight: 7 },
  { id: "re5", tab: "Refusal & Exemptions", text: "Do relevant staff know when to involve the ICO proactively (e.g. if a breach is identified during SAR processing) and how to make contact?", weight: 8 },

  // Record-Keeping
  { id: "rk1", tab: "Record-Keeping", text: "Is every SAR logged with the date received, date responded, requester identity, data disclosed, exemptions applied, and outcome?", weight: 10 },
  { id: "rk2", tab: "Record-Keeping", text: "Are SAR records retained for a minimum of two years (or longer if related to litigation or regulatory action)?", weight: 9 },
  { id: "rk3", tab: "Record-Keeping", text: "Is the SAR log reviewed regularly (at least annually) to identify trends, recurring requesters, or systemic data management issues?", weight: 7 },
  { id: "rk4", tab: "Record-Keeping", text: "Is the data protection register (or Article 30 record of processing activities) updated when new categories of data subject or processing are identified through SARs?", weight: 7 },

  // Staff Training
  { id: "tr1", tab: "Staff Training", text: "Have all staff received training on how to identify a SAR and the importance of passing it immediately to the designated lead?", weight: 10 },
  { id: "tr2", tab: "Staff Training", text: "Has the DPO or data lead received specific training on SAR handling — including exemptions, redaction, and the rights of children?", weight: 9 },
  { id: "tr3", tab: "Staff Training", text: "Have governors received awareness training on the school's data subject rights obligations including SARs?", weight: 7 },
  { id: "tr4", tab: "Staff Training", text: "Are training records for data protection and SAR handling maintained, with refresher training at least every two years?", weight: 8 },
];

const TABS = ["Policy & Procedure", "Receipt & Verification", "Processing & Response", "Refusal & Exemptions", "Record-Keeping", "Staff Training"];

const defaultMeta: ReportMetaData = {
  schoolName: "", schoolEmail: "", consultantName: "", consultantEmail: "", staffMember: "", logoDataUrl: null,
};

const LEVELS: { value: Answer; label: string; color: string; bg: string }[] = [
  { value: "yes", label: "Yes — Compliant", color: "text-green-400", bg: "bg-green-500/15 border-green-500/30" },
  { value: "partial", label: "Partially Compliant", color: "text-amber-400", bg: "bg-amber-500/15 border-amber-500/30" },
  { value: "no", label: "Not Compliant", color: "text-red-400", bg: "bg-red-500/15 border-red-500/30" },
];

const scoreMap: Record<NonNullable<Answer>, number> = { yes: 2, partial: 1, no: 0 };

function calcScore(answers: Record<string, Answer>): number {
  const total = items.reduce((s, i) => s + i.weight * 2, 0);
  const earned = items.reduce((s, i) => s + (scoreMap[answers[i.id] ?? "no"] ?? 0) * i.weight, 0);
  return Math.round((earned / total) * 100);
}

const COLOR = "#38BDF8";
const DIM = "rgba(56,189,248,0.12)";
const BORDER = "rgba(56,189,248,0.25)";

const TAB_COLORS: Record<string, string> = {
  "Policy & Procedure": "#38BDF8",
  "Receipt & Verification": "#34D399",
  "Processing & Response": "#FBBF24",
  "Refusal & Exemptions": "#F87171",
  "Record-Keeping": "#A78BFA",
  "Staff Training": "#FB923C",
};

export default function SarTrackerChecker() {
  const [meta, setMeta] = useState<ReportMetaData>(defaultMeta);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [step, setStep] = useState<"meta" | "questions">("meta");

  const answered = Object.keys(answers).filter((k) => answers[k] !== null).length;
  const score = calcScore(answers);
  const metaValid = meta.schoolName.trim() && meta.staffMember.trim() && meta.consultantName.trim();

  const rating = score >= 80 ? "Broadly Compliant" : score >= 60 ? "Mostly Compliant" : score >= 40 ? "Requires Improvement" : "Significant Risks";
  const ringColor = score >= 80 ? "#22c55e" : score >= 60 ? "#38BDF8" : score >= 40 ? "#f59e0b" : "#ef4444";

  const gaps: Gap[] = items
    .filter((i) => answers[i.id] === "no" || answers[i.id] === "partial")
    .map((i) => ({
      category: i.tab,
      text: i.text,
      priority: answers[i.id] === "no" && i.weight >= 9 ? "high" : answers[i.id] === "no" ? "medium" : "low",
    }));

  const areas = TABS.map(tab => {
    const ti = items.filter(i => i.tab === tab);
    const tot = ti.reduce((s, i) => s + i.weight * 2, 0);
    const earn = ti.reduce((s, i) => s + (scoreMap[answers[i.id] ?? "no"] ?? 0) * i.weight, 0);
    return { name: tab, score: tot > 0 ? Math.round((earn / tot) * 100) : 0 };
  });

  function submit() {
    const id = crypto.randomUUID();
    setSubmissionId(id);
    setSubmitted(true);
    saveSubmission({ tool: "Subject Access Request Tracker", ...meta, score, rating, ratingColor: ringColor, areas, gaps, id });
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
                {score >= 80 ? "SAR procedures are robust and UK GDPR compliant — maintain your log and keep training current." : score >= 60 ? "Good foundations but gaps in acknowledgement, logging, or exemption handling need addressing." : score >= 40 ? "Several SAR compliance gaps present — the 30-day deadline and refusal process need urgent attention." : "Significant SAR compliance failures identified — risk of ICO enforcement. Immediate action required."}
              </p>
            </div>
          </div>
        </GlassCard>

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

        <Certificate meta={meta} toolName="Subject Access Request Tracker" score={score} rating={rating} ratingColor={ringColor} accentColor={COLOR} areas={areas} />
        {gaps.length > 0 && (
          <ImprovementReport meta={meta} toolName="Subject Access Request Tracker" score={score} rating={rating} ratingColor={ringColor} gaps={gaps} accentColor={COLOR} accentDim={DIM} accentBorder={BORDER} reportId={submissionId ?? undefined} />
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

      <GlassCard>
        <h3 className="text-white font-semibold text-sm mb-1 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: TAB_COLORS[activeTab] }} />
          {activeTab}
        </h3>
        <p className="text-[#64748B] text-xs mb-5">Rate each area against your current SAR handling practice.</p>
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

      <div className="flex items-center justify-between">
        <span className="text-xs text-[#475569]">{answered} of {items.length} questions answered</span>
        <div className="flex gap-2">
          {TABS.indexOf(activeTab) < TABS.length - 1 ? (
            <button onClick={() => setActiveTab(TABS[TABS.indexOf(activeTab) + 1])}
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
