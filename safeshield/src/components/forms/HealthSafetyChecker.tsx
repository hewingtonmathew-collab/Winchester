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
  // Fire Safety
  { id: "fs1", tab: "Fire Safety", text: "Has a suitable and sufficient fire risk assessment been completed by a competent person and reviewed within the last 12 months?", weight: 10 },
  { id: "fs2", tab: "Fire Safety", text: "Are all fire doors in good working order, with self-closing mechanisms functioning, seals intact, and no wedges or obstructions?", weight: 10 },
  { id: "fs3", tab: "Fire Safety", text: "Are fire evacuation drills carried out at least twice per year (once per term for primary), with records kept?", weight: 9 },
  { id: "fs4", tab: "Fire Safety", text: "Is fire detection and alarm equipment tested weekly (weekly alarm test) and formally serviced at least annually?", weight: 9 },
  { id: "fs5", tab: "Fire Safety", text: "Are fire extinguishers of the correct type, accessible, in date, and annually inspected?", weight: 8 },
  { id: "fs6", tab: "Fire Safety", text: "Are all escape routes clearly signed, unobstructed, and usable in an emergency at all times?", weight: 10 },
  { id: "fs7", tab: "Fire Safety", text: "Is there a Personal Emergency Evacuation Plan (PEEP) in place for every person with a mobility or disability need?", weight: 9 },
  { id: "fs8", tab: "Fire Safety", text: "Are fire safety responsibilities clearly assigned to named staff and communicated to all employees?", weight: 7 },

  // COSHH
  { id: "co1", tab: "COSHH", text: "Has a COSHH assessment been completed for every hazardous substance used on site (cleaning products, lab chemicals, art materials etc.)?", weight: 10 },
  { id: "co2", tab: "COSHH", text: "Are Safety Data Sheets (SDS/MSDS) available and accessible for all hazardous substances stored or used on site?", weight: 9 },
  { id: "co3", tab: "COSHH", text: "Are hazardous substances stored correctly — secure, labelled, segregated, and away from sources of ignition or incompatible materials?", weight: 9 },
  { id: "co4", tab: "COSHH", text: "Is appropriate Personal Protective Equipment (PPE) provided, maintained, and used wherever COSHH assessments require it?", weight: 9 },
  { id: "co5", tab: "COSHH", text: "Are staff who handle hazardous substances trained in safe use, storage, spillage procedures, and emergency response?", weight: 8 },
  { id: "co6", tab: "COSHH", text: "Are COSHH assessments reviewed whenever a new substance is introduced or when working methods change?", weight: 8 },
  { id: "co7", tab: "COSHH", text: "Is there a documented procedure for dealing with spillages or exposure incidents, including first aid and reporting?", weight: 9 },

  // Premises & Facilities
  { id: "pr1", tab: "Premises & Facilities", text: "Is there a documented premises inspection programme with regular checks of floors, stairs, walkways, and external areas for slip/trip/fall hazards?", weight: 9 },
  { id: "pr2", tab: "Premises & Facilities", text: "Has a legionella risk assessment been carried out and is a written control scheme in place with regular flushing and temperature monitoring?", weight: 10 },
  { id: "pr3", tab: "Premises & Facilities", text: "Has asbestos been surveyed? Is there an asbestos register and management plan, with annual condition checks where asbestos is present?", weight: 10 },
  { id: "pr4", tab: "Premises & Facilities", text: "Are all fixed electrical installations inspected and tested (EICR) every 5 years, with portable appliances PAT tested on a risk-based schedule?", weight: 9 },
  { id: "pr5", tab: "Premises & Facilities", text: "Are working at height activities (maintenance, displays, PE) properly risk assessed with suitable equipment and never using makeshift solutions?", weight: 9 },
  { id: "pr6", tab: "Premises & Facilities", text: "Are play equipment and sports facilities subject to regular inspection, with records kept and defects actioned promptly?", weight: 8 },
  { id: "pr7", tab: "Premises & Facilities", text: "Is the site secure with appropriate perimeter controls, visitor sign-in, and key/access management to prevent unauthorised access?", weight: 9 },

  // Policies & Documentation
  { id: "pd1", tab: "Policies & Documentation", text: "Does the school have a written Health & Safety Policy (required by law for 5+ employees) that has been reviewed within the last 12 months?", weight: 10 },
  { id: "pd2", tab: "Policies & Documentation", text: "Are specific risk assessments in place and up to date for all significant activities — off-site visits, science experiments, PE, cooking, woodwork etc.?", weight: 10 },
  { id: "pd3", tab: "Policies & Documentation", text: "Is there a documented accident/incident reporting procedure, with RIDDOR reportable incidents notified to the HSE within the required timeframes?", weight: 9 },
  { id: "pd4", tab: "Policies & Documentation", text: "Are accident records and near-miss reports reviewed at least termly to identify trends and prevent recurrence?", weight: 8 },
  { id: "pd5", tab: "Policies & Documentation", text: "Is there an up-to-date Business Continuity Plan that covers major premises incidents, loss of utilities, and severe weather?", weight: 8 },
  { id: "pd6", tab: "Policies & Documentation", text: "Are H&S responsibilities clearly delegated in writing and included in relevant job descriptions, including the governing board's oversight role?", weight: 8 },
  { id: "pd7", tab: "Policies & Documentation", text: "Is H&S a standing agenda item at governor/trustee meetings, with termly updates and an annual report reviewed by the board?", weight: 8 },

  // Staff & Pupil Welfare
  { id: "sw1", tab: "Staff & Pupil Welfare", text: "Are there sufficient trained first aiders on site at all times (including lunch and PE), with up-to-date certificates and well-stocked first aid kits?", weight: 10 },
  { id: "sw2", tab: "Staff & Pupil Welfare", text: "Is manual handling training provided to all staff who regularly lift or move loads, with manual handling risk assessments in place?", weight: 8 },
  { id: "sw3", tab: "Staff & Pupil Welfare", text: "Is there a lone working policy and procedure for staff who work outside normal hours or in isolated areas?", weight: 8 },
  { id: "sw4", tab: "Staff & Pupil Welfare", text: "Does the school have a staff stress and mental wellbeing policy, with workload regularly reviewed and support available?", weight: 8 },
  { id: "sw5", tab: "Staff & Pupil Welfare", text: "Are display screen equipment (DSE) assessments completed for all staff who regularly use computers, with adjustments actioned?", weight: 7 },
  { id: "sw6", tab: "Staff & Pupil Welfare", text: "Are educational visits (off-site trips) subject to a thorough risk assessment process, with appropriate adult ratios and emergency procedures?", weight: 9 },
  { id: "sw7", tab: "Staff & Pupil Welfare", text: "Is there a documented procedure for managing medical conditions (including anaphylaxis, asthma, epilepsy) with trained staff and care plans in place?", weight: 10 },

  // Contractors & Visitors
  { id: "cv1", tab: "Contractors & Visitors", text: "Is there a formal contractor management procedure covering pre-approval, induction, supervision, and permit-to-work for high-risk tasks?", weight: 9 },
  { id: "cv2", tab: "Contractors & Visitors", text: "Are contractors required to provide evidence of their own risk assessments and method statements (RAMS) before starting work?", weight: 9 },
  { id: "cv3", tab: "Contractors & Visitors", text: "Are all contractors and regular volunteers subject to appropriate DBS checks before working with or near pupils?", weight: 10 },
  { id: "cv4", tab: "Contractors & Visitors", text: "Is there a visitor sign-in/out system in operation at all entry points, with visitors clearly identified (badges) at all times?", weight: 8 },
  { id: "cv5", tab: "Contractors & Visitors", text: "Are contractors briefed on fire evacuation procedures and site-specific hazards before starting work?", weight: 8 },
  { id: "cv6", tab: "Contractors & Visitors", text: "Is there a process to ensure contractors' work does not create hazards for pupils or staff (e.g. segregation, out-of-hours working)?", weight: 9 },
];

const TABS = ["Fire Safety", "COSHH", "Premises & Facilities", "Policies & Documentation", "Staff & Pupil Welfare", "Contractors & Visitors"];

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

const COLOR = "#F97316";
const DIM = "rgba(249,115,22,0.12)";
const BORDER = "rgba(249,115,22,0.25)";

const TAB_COLORS: Record<string, string> = {
  "Fire Safety": "#F87171",
  "COSHH": "#FB923C",
  "Premises & Facilities": "#FBBF24",
  "Policies & Documentation": "#A78BFA",
  "Staff & Pupil Welfare": "#34D399",
  "Contractors & Visitors": "#38BDF8",
};

export default function HealthSafetyChecker() {
  const [meta, setMeta] = useState<ReportMetaData>(defaultMeta);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [submitted, setSubmitted] = useState(false);
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

  function submit() {
    setSubmitted(true);
    saveSubmission({ tool: "Health & Safety Checker", ...meta, score, rating, ratingColor: ringColor });
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
                {score >= 80 ? "The school is broadly meeting its health and safety obligations." : score >= 60 ? "Good foundations but some important gaps need addressing." : score >= 40 ? "Several compliance areas require urgent attention." : "Significant health and safety risks identified — immediate action required."}
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

        {/* OpenCase callout */}
        <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.25)" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8s2.91 6.5 6.5 6.5 6.5-2.91 6.5-6.5S11.59 1.5 8 1.5zm0 11.5a5 5 0 110-10 5 5 0 010 10z" fill="#F97316"/><path d="M8 4.5v4l2.5 1.5" stroke="#F97316" strokeWidth="1.3" strokeLinecap="round"/></svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-white mb-0.5">Check the law with OpenCase</p>
            <p className="text-xs text-[#94A3B8] leading-relaxed mb-2">OpenCase provides the legal framework behind every H&amp;S obligation identified in this report. Use it to verify your duties under UK law before taking action.</p>
            <a href="https://www.opencase.com" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
              style={{ color: "#F97316" }}>
              Visit OpenCase →
            </a>
          </div>
        </div>

        <Certificate meta={meta} toolName="Health & Safety Checker" score={score} rating={rating} ratingColor={ringColor} accentColor={COLOR} />
        {gaps.length > 0 && (
          <ImprovementReport meta={meta} toolName="Health & Safety Checker" score={score} rating={rating} ratingColor={ringColor} gaps={gaps} accentColor={COLOR} accentDim={DIM} accentBorder={BORDER} />
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
        <p className="text-[#64748B] text-xs mb-5">Rate each area based on your current compliance.</p>
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

      {/* Progress + submit */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#475569]">{answered} of {items.length} questions answered</span>
        <button onClick={submit} disabled={answered < items.length}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: DIM, border: `1px solid ${BORDER}`, color: COLOR }}>
          Generate Report <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
