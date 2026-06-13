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
  // Job Advertising & Application
  { id: "ja1", tab: "Job Advertising & Application", text: "Do all job adverts and role profiles include a clear safeguarding commitment statement and indicate that the post is subject to an enhanced DBS check?", weight: 9 },
  { id: "ja2", tab: "Job Advertising & Application", text: "Does the application form require candidates to account for all employment history and explain any gaps in a way that cannot be omitted?", weight: 10 },
  { id: "ja3", tab: "Job Advertising & Application", text: "Are references always requested before interview (not after offer), with at least one referee being the most recent employer?", weight: 10 },
  { id: "ja4", tab: "Job Advertising & Application", text: "Are referees always contacted directly — by phone or email — rather than accepting open references or character testimonials?", weight: 9 },
  { id: "ja5", tab: "Job Advertising & Application", text: "Does the application process ask applicants to disclose any cautions, convictions, or information that may be relevant to working with children?", weight: 9 },

  // Shortlisting & Interview
  { id: "si1", tab: "Shortlisting & Interview", text: "Is shortlisting always carried out by at least two people, with records kept of the basis for shortlisting decisions?", weight: 8 },
  { id: "si2", tab: "Shortlisting & Interview", text: "Does at least one member of every interview panel hold a valid Safer Recruitment training certificate (DfE-recognised safer recruitment training)?", weight: 10 },
  { id: "si3", tab: "Shortlisting & Interview", text: "Do interview questions specifically explore the candidate's attitude to safeguarding children and child protection responsibilities?", weight: 9 },
  { id: "si4", tab: "Shortlisting & Interview", text: "Are candidates given the opportunity to address any gaps, concerns, or disclosures identified during the shortlisting stage?", weight: 9 },
  { id: "si5", tab: "Shortlisting & Interview", text: "Are structured interview notes retained for each candidate for a minimum period (recommended 6 months) after the appointment decision?", weight: 8 },

  // Pre-Employment Checks
  { id: "pe1", tab: "Pre-Employment Checks", text: "Is an enhanced DBS check with children's barred list check obtained for every new member of staff or volunteer in regulated activity before they start unsupervised work?", weight: 10 },
  { id: "pe2", tab: "Pre-Employment Checks", text: "Is a Section 128 direction check completed for any individual being appointed to a management role (headteacher, principal, trustee, governor)?", weight: 10 },
  { id: "pe3", tab: "Pre-Employment Checks", text: "Is the identity of every new employee verified in person against original documents before or on their first day?", weight: 10 },
  { id: "pe4", tab: "Pre-Employment Checks", text: "Is the right to work in the UK verified for every new employee using the Home Office-specified process before they begin work?", weight: 10 },
  { id: "pe5", tab: "Pre-Employment Checks", text: "Are relevant qualifications verified against original certificates where the role requires them (e.g. QTS, nursing qualifications)?", weight: 8 },
  { id: "pe6", tab: "Pre-Employment Checks", text: "Are overseas criminal record checks or professional standing checks obtained for staff who have lived or worked outside the UK?", weight: 9 },

  // Single Central Record
  { id: "sc1", tab: "Single Central Record", text: "Is the Single Central Record (SCR) maintained and kept fully up to date for all staff, supply teachers, regular volunteers and governors?", weight: 10 },
  { id: "sc2", tab: "Single Central Record", text: "Does the SCR contain all columns required by KCSIE — identity check, barred list, enhanced DBS, prohibition, right to work, qualifications, Section 128 (where applicable)?", weight: 10 },
  { id: "sc3", tab: "Single Central Record", text: "Is the SCR signed off by the headteacher or principal and made available to Ofsted inspectors on request?", weight: 9 },
  { id: "sc4", tab: "Single Central Record", text: "Are all agency, contractor, and third-party workers who work in regulated activity included in the SCR (or a separate equivalent record)?", weight: 9 },
  { id: "sc5", tab: "Single Central Record", text: "Is the SCR reviewed at least annually to ensure it is accurate, complete, and that DBS certificates for all staff are still current?", weight: 8 },

  // Induction & Ongoing
  { id: "io1", tab: "Induction & Ongoing", text: "Is a formal safeguarding induction completed on day 1 for all new starters, including receipt and acknowledgement of the child protection policy?", weight: 10 },
  { id: "io2", tab: "Induction & Ongoing", text: "Does every new employee sign a Code of Conduct on or before their first day, covering professional boundaries and expected behaviour?", weight: 9 },
  { id: "io3", tab: "Induction & Ongoing", text: "Is safer recruitment and safeguarding included in probationary reviews, with clear expectations set from the outset?", weight: 8 },
  { id: "io4", tab: "Induction & Ongoing", text: "Do all staff receive child protection training at induction and updated training at least every two years in line with KCSIE requirements?", weight: 9 },

  // Governance & Policy
  { id: "gp1", tab: "Governance & Policy", text: "Is the safer recruitment policy reviewed at least annually and ratified by governors or trustees?", weight: 8 },
  { id: "gp2", tab: "Governance & Policy", text: "Has at least one governor or trustee completed DfE-recognised safer recruitment training, enabling the board to hold the school to account?", weight: 9 },
  { id: "gp3", tab: "Governance & Policy", text: "Is there a documented process for managing allegations against staff, including referral to the LADO (Local Authority Designated Officer) where required?", weight: 10 },
  { id: "gp4", tab: "Governance & Policy", text: "When a member of staff is dismissed (or would have been dismissed) for safeguarding reasons, is a referral made to the DBS and Teaching Regulation Agency (TRA) as required?", weight: 10 },
];

const TABS = ["Job Advertising & Application", "Shortlisting & Interview", "Pre-Employment Checks", "Single Central Record", "Induction & Ongoing", "Governance & Policy"];

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

const COLOR = "#34D399";
const DIM = "rgba(52,211,153,0.12)";
const BORDER = "rgba(52,211,153,0.25)";

const TAB_COLORS: Record<string, string> = {
  "Job Advertising & Application": "#34D399",
  "Shortlisting & Interview": "#38BDF8",
  "Pre-Employment Checks": "#F87171",
  "Single Central Record": "#FBBF24",
  "Induction & Ongoing": "#A78BFA",
  "Governance & Policy": "#FB923C",
};

export default function SaferRecruitmentChecker() {
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
    saveSubmission({ tool: "Safer Recruitment Audit", ...meta, score, rating, ratingColor: ringColor, areas, gaps, id });
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
                {score >= 80 ? "Safer recruitment procedures are robust and KCSIE-compliant — keep the SCR updated and training current." : score >= 60 ? "Good processes in place but gaps in checks or the SCR need addressing before the next inspection." : score >= 40 ? "Several critical safer recruitment requirements need urgent attention — DBS, SCR, and LADO referral process." : "Significant safer recruitment gaps identified — immediate action required to meet statutory obligations."}
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

        <Certificate meta={meta} toolName="Safer Recruitment Audit" score={score} rating={rating} ratingColor={ringColor} accentColor={COLOR} areas={areas} />
        {gaps.length > 0 && (
          <ImprovementReport meta={meta} toolName="Safer Recruitment Audit" score={score} rating={rating} ratingColor={ringColor} gaps={gaps} accentColor={COLOR} accentDim={DIM} accentBorder={BORDER} reportId={submissionId ?? undefined} />
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
        <p className="text-[#64748B] text-xs mb-5">Rate each area against current safer recruitment practice and KCSIE compliance.</p>
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
