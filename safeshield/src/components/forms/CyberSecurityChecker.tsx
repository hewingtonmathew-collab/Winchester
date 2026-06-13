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
  // Network & Infrastructure
  { id: "ni1", tab: "Network & Infrastructure", text: "Is a network firewall in place and configured to block unauthorised inbound and outbound traffic, with rules reviewed at least annually?", weight: 10 },
  { id: "ni2", tab: "Network & Infrastructure", text: "Is the school Wi-Fi network segmented so that staff, pupil, and guest devices are on separate networks with appropriate access controls?", weight: 9 },
  { id: "ni3", tab: "Network & Infrastructure", text: "Is multi-factor authentication (MFA) required for all remote access to school systems (e.g. VPN, remote desktop, cloud admin portals)?", weight: 10 },
  { id: "ni4", tab: "Network & Infrastructure", text: "Are operating systems and software patched promptly — critical patches applied within 14 days and all software kept within vendor support?", weight: 10 },
  { id: "ni5", tab: "Network & Infrastructure", text: "Is network traffic monitored for anomalies, and are logs retained for at least 90 days to support incident investigation?", weight: 8 },
  { id: "ni6", tab: "Network & Infrastructure", text: "Have penetration tests or vulnerability scans been carried out within the last 12 months, with findings remediated?", weight: 8 },

  // Access Control
  { id: "ac1", tab: "Access Control", text: "Does every user (staff, pupil, governor) have a unique, individual account — no shared passwords or generic logins?", weight: 10 },
  { id: "ac2", tab: "Access Control", text: "Are administrator and privileged accounts strictly limited to those who require them, with separate admin and day-to-day accounts for IT staff?", weight: 10 },
  { id: "ac3", tab: "Access Control", text: "Is there a password policy enforcing a minimum length of 12 characters, no reuse of recent passwords, and no forced periodic changes without cause?", weight: 9 },
  { id: "ac4", tab: "Access Control", text: "Is MFA enabled for all cloud services and email accounts (Microsoft 365 / Google Workspace)?", weight: 10 },
  { id: "ac5", tab: "Access Control", text: "Is there a documented leaver and role-change process ensuring accounts and access are revoked or updated on the same day as departure?", weight: 10 },
  { id: "ac6", tab: "Access Control", text: "Are access rights reviewed at least annually to ensure users only have access to what they need (principle of least privilege)?", weight: 8 },

  // Data Protection
  { id: "dp1", tab: "Data Protection", text: "Is there a current information asset register or data inventory identifying what personal data is held, where it is stored, and who can access it?", weight: 9 },
  { id: "dp2", tab: "Data Protection", text: "Is data encrypted at rest on servers, laptops, and USB drives — particularly any device that leaves the school premises?", weight: 10 },
  { id: "dp3", tab: "Data Protection", text: "Is all data transmitted over public networks encrypted in transit (HTTPS/TLS), including emails containing personal data?", weight: 9 },
  { id: "dp4", tab: "Data Protection", text: "Are backups taken regularly (at least daily for critical systems), stored off-site or in the cloud, and tested for restoration at least quarterly?", weight: 10 },
  { id: "dp5", tab: "Data Protection", text: "Are data processing agreements (DPAs) in place with all cloud and software suppliers who handle personal data?", weight: 8 },
  { id: "dp6", tab: "Data Protection", text: "Is personal data minimised — only collected and retained as long as necessary, with a data retention and disposal schedule followed?", weight: 8 },

  // Device Management
  { id: "dm1", tab: "Device Management", text: "Is there an up-to-date inventory of all devices (servers, laptops, tablets, phones) that connect to the school network?", weight: 9 },
  { id: "dm2", tab: "Device Management", text: "Is endpoint protection (anti-malware) installed and actively managed on all school-owned devices, with definitions updated automatically?", weight: 10 },
  { id: "dm3", tab: "Device Management", text: "Are laptops and portable devices encrypted using BitLocker, FileVault, or equivalent full-disk encryption?", weight: 10 },
  { id: "dm4", tab: "Device Management", text: "Is there a mobile device management (MDM) policy covering school-owned and BYOD devices used for school work?", weight: 8 },
  { id: "dm5", tab: "Device Management", text: "Is automatic screen lock enforced on all devices after a maximum of 5 minutes of inactivity?", weight: 8 },
  { id: "dm6", tab: "Device Management", text: "Is there a documented procedure for reporting and remotely wiping lost or stolen devices?", weight: 9 },

  // Incident Response
  { id: "ir1", tab: "Incident Response", text: "Is there a documented cyber incident response plan, with named roles and contact details, reviewed within the last 12 months?", weight: 10 },
  { id: "ir2", tab: "Incident Response", text: "Has the incident response plan been tested — via a tabletop exercise or simulation — within the last 12 months?", weight: 9 },
  { id: "ir3", tab: "Incident Response", text: "Do all staff know how to report a suspected cyber incident and to whom, with a clear out-of-hours contact available?", weight: 9 },
  { id: "ir4", tab: "Incident Response", text: "Does the school know how to contact NCSC (via Cyber Incident Response) and the ICO (for reportable data breaches) in the event of an attack?", weight: 9 },
  { id: "ir5", tab: "Incident Response", text: "Is there a post-incident review process to capture lessons learned and update procedures after any significant incident?", weight: 8 },
  { id: "ir6", tab: "Incident Response", text: "Does the school hold cyber insurance and has the scope been reviewed to confirm it covers ransomware and business interruption?", weight: 7 },

  // Staff Awareness
  { id: "sa1", tab: "Staff Awareness", text: "Do all staff receive annual cyber security awareness training covering phishing, social engineering, and safe online practices?", weight: 10 },
  { id: "sa2", tab: "Staff Awareness", text: "Have phishing simulation exercises been run in the last 12 months to test staff vigilance, with follow-up training for those who click?", weight: 8 },
  { id: "sa3", tab: "Staff Awareness", text: "Is there a clear, published Acceptable Use Policy (AUP) that all staff and relevant pupils have read and signed?", weight: 9 },
  { id: "sa4", tab: "Staff Awareness", text: "Are staff trained to recognise social engineering attempts — including phone-based vishing and impersonation attacks?", weight: 8 },
  { id: "sa5", tab: "Staff Awareness", text: "Is there specific guidance for staff working remotely covering secure Wi-Fi use, VPN requirements, and screen privacy?", weight: 8 },
];

const TABS = ["Network & Infrastructure", "Access Control", "Data Protection", "Device Management", "Incident Response", "Staff Awareness"];

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

const COLOR = "#F87171";
const DIM = "rgba(248,113,113,0.12)";
const BORDER = "rgba(248,113,113,0.25)";

const TAB_COLORS: Record<string, string> = {
  "Network & Infrastructure": "#F87171",
  "Access Control": "#FB923C",
  "Data Protection": "#FBBF24",
  "Device Management": "#34D399",
  "Incident Response": "#38BDF8",
  "Staff Awareness": "#A78BFA",
};

export default function CyberSecurityChecker() {
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
    saveSubmission({ tool: "Cyber Security Checker", ...meta, score, rating, ratingColor: ringColor, areas, gaps, id });
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
                {score >= 80 ? "Strong cyber security posture — keep controls up to date and continue staff training." : score >= 60 ? "Good foundations in place but some gaps need addressing before a serious incident occurs." : score >= 40 ? "Several significant weaknesses identified — prioritise MFA, patching, and incident response." : "Critical cyber security gaps present — immediate action required to protect the school."}
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

        <Certificate meta={meta} toolName="Cyber Security Checker" score={score} rating={rating} ratingColor={ringColor} accentColor={COLOR} areas={areas} />
        {gaps.length > 0 && (
          <ImprovementReport meta={meta} toolName="Cyber Security Checker" score={score} rating={rating} ratingColor={ringColor} gaps={gaps} accentColor={COLOR} accentDim={DIM} accentBorder={BORDER} reportId={submissionId ?? undefined} />
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
        <p className="text-[#64748B] text-xs mb-5">Rate each area based on your current cyber security controls.</p>
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
