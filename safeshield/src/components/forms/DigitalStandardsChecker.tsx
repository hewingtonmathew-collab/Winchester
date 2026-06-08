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
  // Digital Safeguarding
  { id: "ds1", tab: "Digital Safeguarding", text: "Does the school have appropriate internet filtering in place that meets the DfE filtering standards and is reviewed at least annually?", weight: 10 },
  { id: "ds2", tab: "Digital Safeguarding", text: "Is monitoring software deployed across all school-managed devices and networks, with alerts reviewed regularly?", weight: 10 },
  { id: "ds3", tab: "Digital Safeguarding", text: "Is there a named Designated Safeguarding Lead (DSL) with responsibility for online safety, and are they trained to the current standard?", weight: 10 },
  { id: "ds4", tab: "Digital Safeguarding", text: "Does the school have an up-to-date Online Safety Policy that reflects the current KCSiE guidance and is reviewed annually?", weight: 9 },
  { id: "ds5", tab: "Digital Safeguarding", text: "Are staff receiving regular online safety training, including recognising signs of harmful online behaviour?", weight: 9 },
  { id: "ds6", tab: "Digital Safeguarding", text: "Is online safety taught as part of the curriculum (RSHE/Computing) at all key stages?", weight: 8 },
  { id: "ds7", tab: "Digital Safeguarding", text: "Are parents/carers given guidance on online safety risks and how to support children at home?", weight: 7 },
  { id: "ds8", tab: "Digital Safeguarding", text: "Does the school have a clear process for reporting and responding to online safety incidents, including referral to CEOP or police where required?", weight: 10 },

  // Cyber Security
  { id: "cs1", tab: "Cyber Security", text: "Has the school completed a cyber security self-assessment using the DfE's cyber security standards for schools?", weight: 9 },
  { id: "cs2", tab: "Cyber Security", text: "Are all school systems and devices protected with up-to-date antivirus/endpoint protection software?", weight: 10 },
  { id: "cs3", tab: "Cyber Security", text: "Is multi-factor authentication (MFA) enabled on all staff email accounts and admin systems?", weight: 10 },
  { id: "cs4", tab: "Cyber Security", text: "Are regular, tested backups of critical data carried out, with at least one copy stored offline or off-site?", weight: 10 },
  { id: "cs5", tab: "Cyber Security", text: "Does the school have a documented cyber incident response plan that staff are aware of?", weight: 9 },
  { id: "cs6", tab: "Cyber Security", text: "Are software and operating systems kept up to date with security patches applied promptly?", weight: 9 },
  { id: "cs7", tab: "Cyber Security", text: "Is there a strong password policy enforced across all systems (minimum length, no defaults, no sharing)?", weight: 8 },
  { id: "cs8", tab: "Cyber Security", text: "Are staff trained to recognise phishing emails and other social engineering attacks?", weight: 9 },

  // Data & GDPR
  { id: "dg1", tab: "Data & GDPR", text: "Does the school have a current Data Protection Officer (DPO) who is properly resourced and reports directly to the governing board?", weight: 10 },
  { id: "dg2", tab: "Data & GDPR", text: "Is there an up-to-date Record of Processing Activities (ROPA) covering all data processing carried out by the school?", weight: 9 },
  { id: "dg3", tab: "Data & GDPR", text: "Are Privacy Notices published on the school website for pupils, parents, staff, and governors?", weight: 8 },
  { id: "dg4", tab: "Data & GDPR", text: "Is a Data Protection Impact Assessment (DPIA) completed before introducing any new technology that processes personal data?", weight: 9 },
  { id: "dg5", tab: "Data & GDPR", text: "Are Subject Access Requests (SARs) handled within the statutory one-month timeframe with a documented process?", weight: 8 },
  { id: "dg6", tab: "Data & GDPR", text: "Are data breaches identified, assessed, and (where required) reported to the ICO within 72 hours?", weight: 10 },
  { id: "dg7", tab: "Data & GDPR", text: "Are data sharing agreements in place for all third-party processors, including EdTech providers?", weight: 9 },
  { id: "dg8", tab: "Data & GDPR", text: "Is staff training on data protection delivered at induction and refreshed annually?", weight: 8 },

  // Ofsted Readiness
  { id: "of1", tab: "Ofsted Readiness", text: "Can the school demonstrate how technology enhances curriculum delivery and supports pupil progress, not just replaces traditional methods?", weight: 9 },
  { id: "of2", tab: "Ofsted Readiness", text: "Is there evidence that EdTech procurement decisions are evaluated for impact and effectiveness before wider rollout?", weight: 8 },
  { id: "of3", tab: "Ofsted Readiness", text: "Does the school's self-evaluation (SEF) include a considered section on digital and technology provision?", weight: 8 },
  { id: "of4", tab: "Ofsted Readiness", text: "Are leaders able to articulate a clear vision for technology in the school that goes beyond cost-cutting or trend-following?", weight: 9 },
  { id: "of5", tab: "Ofsted Readiness", text: "Is there evidence that technology is used to reduce staff workload rather than increase it (e.g. marking, reporting)?", weight: 8 },
  { id: "of6", tab: "Ofsted Readiness", text: "Does the computing curriculum reflect the current DfE Computing Programme of Study and develop genuine digital literacy?", weight: 9 },
  { id: "of7", tab: "Ofsted Readiness", text: "Are disadvantaged and SEND pupils given equitable access to technology and digital learning?", weight: 10 },

  // Accessibility
  { id: "ac1", tab: "Accessibility", text: "Does the school website meet WCAG 2.1 Level AA accessibility standards, including an up-to-date Accessibility Statement?", weight: 9 },
  { id: "ac2", tab: "Accessibility", text: "Are assistive technologies (e.g. screen readers, text-to-speech, coloured overlays) available to pupils who need them?", weight: 9 },
  { id: "ac3", tab: "Accessibility", text: "Is digital content produced by staff (presentations, documents, videos) created with accessibility in mind?", weight: 7 },
  { id: "ac4", tab: "Accessibility", text: "Are online assessment and learning platforms used by the school accessible to pupils with SEND?", weight: 9 },
  { id: "ac5", tab: "Accessibility", text: "Is there a process for parents/carers with disabilities to access digital communications and parent portals?", weight: 7 },
  { id: "ac6", tab: "Accessibility", text: "Are accessibility needs identified as part of the EHCP/SEND review process and reflected in technology provision?", weight: 8 },

  // Infrastructure
  { id: "in1", tab: "Infrastructure", text: "Does the school's broadband meet the DfE minimum standards (at least 1 Gbps for secondary, 100 Mbps for primary) or is there a plan to upgrade?", weight: 9 },
  { id: "in2", tab: "Infrastructure", text: "Is there a device management system (MDM) that allows remote deployment, patching, and wiping of all school-managed devices?", weight: 9 },
  { id: "in3", tab: "Infrastructure", text: "Is there a documented asset register covering all hardware, software licences, and cloud subscriptions?", weight: 7 },
  { id: "in4", tab: "Infrastructure", text: "Does the school have a technology strategy or Digital Development Plan that is reviewed by governors annually?", weight: 9 },
  { id: "in5", tab: "Infrastructure", text: "Are cloud services (Google Workspace, Microsoft 365 etc.) configured in line with data protection requirements and DfE guidance?", weight: 9 },
  { id: "in6", tab: "Infrastructure", text: "Is there a clear process for disposing of old devices safely, including secure data wiping in line with ICO guidance?", weight: 8 },
  { id: "in7", tab: "Infrastructure", text: "Is the school's IT support provision (internal or external) adequate for its size, with defined response times?", weight: 7 },
];

const TABS = ["Digital Safeguarding", "Cyber Security", "Data & GDPR", "Ofsted Readiness", "Accessibility", "Infrastructure"];

const defaultMeta: ReportMetaData = {
  schoolName: "", schoolEmail: "", consultantName: "", consultantEmail: "", staffMember: "", logoDataUrl: null,
};

const LEVELS: { value: Answer; label: string; color: string; bg: string }[] = [
  { value: "yes", label: "Yes — Met", color: "text-green-400", bg: "bg-green-500/15 border-green-500/30" },
  { value: "partial", label: "Partially Met", color: "text-amber-400", bg: "bg-amber-500/15 border-amber-500/30" },
  { value: "no", label: "Not Met", color: "text-red-400", bg: "bg-red-500/15 border-red-500/30" },
];

const scoreMap: Record<NonNullable<Answer>, number> = { yes: 2, partial: 1, no: 0 };

function calcScore(answers: Record<string, Answer>): number {
  const total = items.reduce((s, i) => s + i.weight * 2, 0);
  const earned = items.reduce((s, i) => s + (scoreMap[answers[i.id] ?? "no"] ?? 0) * i.weight, 0);
  return Math.round((earned / total) * 100);
}

const COLOR = "#818CF8";
const DIM = "rgba(129,140,248,0.12)";
const BORDER = "rgba(129,140,248,0.25)";

const TAB_COLORS: Record<string, string> = {
  "Digital Safeguarding": "#34D399",
  "Cyber Security": "#F87171",
  "Data & GDPR": "#FCD34D",
  "Ofsted Readiness": "#4ADE80",
  "Accessibility": "#F472B6",
  "Infrastructure": "#38BDF8",
};

export default function DigitalStandardsChecker() {
  const [meta, setMeta] = useState<ReportMetaData>(defaultMeta);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [step, setStep] = useState<"meta" | "questions">("meta");

  const answered = Object.keys(answers).filter((k) => answers[k] !== null).length;
  const score = calcScore(answers);
  const metaValid = meta.schoolName.trim() && meta.staffMember.trim() && meta.consultantName.trim();

  const rating = score >= 80 ? "Meeting Standards" : score >= 60 ? "Mostly Compliant" : score >= 40 ? "Partially Compliant" : "Significant Gaps";
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
    setSubmitted(true);
    setSubmissionId(saveSubmission({ tool: "Digital Standards Checker", ...meta, score, rating, ratingColor: ringColor, areas, gaps }).id);
  }

  const tabItems = items.filter((i) => i.tab === activeTab);

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
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border"
                style={{ background: "#000", border: `2px solid ${ringColor}`, color: ringColor }}>
                <CheckCircle2 size={13} /> {rating}
              </span>
              <p className="text-[#94A3B8] text-sm leading-relaxed max-w-xs">
                {score >= 80 ? "The school is broadly meeting DfE digital and technology standards." : score >= 60 ? "Good progress but some important gaps remain to address." : score >= 40 ? "Several areas need attention to meet minimum standards." : "Significant work is needed across multiple areas to meet DfE standards."}
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

        <Certificate meta={meta} toolName="Digital Standards Checker" score={score} rating={rating} ratingColor={ringColor} accentColor={COLOR} areas={areas} />
        {gaps.length > 0 && (
          <ImprovementReport meta={meta} toolName="Digital Standards Checker" score={score} rating={rating} ratingColor={ringColor} gaps={gaps} accentColor={COLOR} accentDim={DIM} accentBorder={BORDER} reportId={submissionId ?? undefined} />
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

      {/* Questions for active tab */}
      <GlassCard>
        <h3 className="text-white font-semibold text-sm mb-1 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: TAB_COLORS[activeTab] }} />
          {activeTab}
        </h3>
        <p className="text-[#64748B] text-xs mb-5">Rate each standard below based on your current provision.</p>
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
