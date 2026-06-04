"use client";
import { useEffect, useState } from "react";
import { getSubmissions, deleteSubmission, type Submission } from "@/lib/submissions";
import { Trash2, Mail, ShieldCheck, LayoutDashboard, ChevronDown, ChevronUp } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

const TOOL_COLORS: Record<string, string> = {
  "Safeguarding Risk Checker": "#34D399",
  "Governance Compliance Checker": "#A78BFA",
  "AI Readiness Assessment": "#FB923C",
  "DPIA Wizard": "#FCD34D",
  "Web Accessibility Checker": "#F472B6",
  "Ofsted Ready Checker": "#4ADE80",
  "AI Content Detector": "#38BDF8",
};

function ScoreBadge({ score, color }: { score: number; color: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border"
      style={{ color, background: `${color}15`, borderColor: `${color}40` }}>
      {score}%
    </span>
  );
}

function sendCertificateEmail(s: Submission) {
  const subject = encodeURIComponent(`${s.tool} Certificate — ${s.schoolName}`);
  const date = new Date(s.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const body = encodeURIComponent(
    `Dear ${s.schoolName},\n\nPlease find below your ${s.tool} certificate completed on ${date}.\n\nAssessment Summary:\n• Score: ${s.score}%\n• Rating: ${s.rating}\n• Staff Member: ${s.staffMember}\n• Consultant: ${s.consultantName}\n\nThis certificate was generated via SafeShield Tools by SafeShield.\n\nKind regards,\n${s.consultantName}\nSafeShield`
  );
  window.location.href = `mailto:${s.schoolEmail}?subject=${subject}&body=${body}`;
}

function GroupedBySchool({ submissions, onDelete }: { submissions: Submission[]; onDelete: (id: string) => void }) {
  const schools = [...new Set(submissions.map((s) => s.schoolName))];
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <div className="flex flex-col gap-4">
      {schools.map((school) => {
        const schoolSubs = submissions.filter((s) => s.schoolName === school);
        const isOpen = expanded[school] !== false;
        return (
          <GlassCard key={school}>
            <button className="w-full flex items-center justify-between" onClick={() => setExpanded((p) => ({ ...p, [school]: !isOpen }))}>
              <div className="flex items-center gap-3">
                {schoolSubs[0]?.logoDataUrl ? (
                  <img src={schoolSubs[0].logoDataUrl} alt="" className="h-8 w-8 object-contain rounded bg-white/10 p-0.5" />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <ShieldCheck size={14} className="text-[#38BDF8]" />
                  </div>
                )}
                <div className="text-left">
                  <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{school}</p>
                  <p className="text-xs" style={{ color: "var(--text-faint)" }}>{schoolSubs.length} assessment{schoolSubs.length !== 1 ? "s" : ""} · {schoolSubs[0]?.consultantName}</p>
                </div>
              </div>
              {isOpen ? <ChevronUp size={14} style={{ color: "var(--text-dim)" }} /> : <ChevronDown size={14} style={{ color: "var(--text-dim)" }} />}
            </button>

            {isOpen && (
              <div className="mt-4 flex flex-col gap-2.5">
                {schoolSubs.map((s) => {
                  const color = TOOL_COLORS[s.tool] ?? "#38BDF8";
                  const date = new Date(s.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
                  return (
                    <div key={s.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="shrink-0 w-2 h-2 rounded-full" style={{ background: color }} />
                        <div className="min-w-0">
                          <p className="text-xs font-medium truncate" style={{ color: "var(--text-muted)" }}>{s.tool}</p>
                          <p className="text-[0.65rem]" style={{ color: "var(--text-faint)" }}>{date} · {s.staffMember}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <ScoreBadge score={s.score} color={color} />
                        {s.schoolEmail && (
                          <button onClick={() => sendCertificateEmail(s)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center glass hover:bg-white/10 transition-all"
                            title="Send certificate by email">
                            <Mail size={12} className="text-[#38BDF8]" />
                          </button>
                        )}
                        <button onClick={() => onDelete(s.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center glass hover:bg-red-500/10 transition-all"
                          title="Delete record">
                          <Trash2 size={12} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>
        );
      })}
    </div>
  );
}

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [view, setView] = useState<"schools" | "all">("schools");

  useEffect(() => {
    setSubmissions(getSubmissions());
  }, []);

  function handleDelete(id: string) {
    deleteSubmission(id);
    setSubmissions(getSubmissions());
  }

  const schools = [...new Set(submissions.map((s) => s.schoolName))];
  const toolCounts = submissions.reduce<Record<string, number>>((acc, s) => {
    acc[s.tool] = (acc[s.tool] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-10 pb-10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-[rgba(56,189,248,0.1)] border border-[rgba(56,189,248,0.2)]">
            <LayoutDashboard size={22} className="text-[#38BDF8]" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[#38BDF8] text-xs font-medium uppercase tracking-widest mb-1">Admin</p>
            <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>Admin Panel</h1>
            <p className="text-sm max-w-xl leading-relaxed" style={{ color: "var(--text-muted)" }}>
              View all schools that have completed assessments, track results, and send certificates.
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Schools", value: schools.length },
            { label: "Assessments", value: submissions.length },
            { label: "Avg Score", value: submissions.length ? `${Math.round(submissions.reduce((s, x) => s + x.score, 0) / submissions.length)}%` : "—" },
            { label: "Tools Used", value: Object.keys(toolCounts).length },
          ].map((stat) => (
            <GlassCard key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-[#38BDF8]">{stat.value}</p>
              <p className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>{stat.label}</p>
            </GlassCard>
          ))}
        </div>

        {submissions.length === 0 ? (
          <GlassCard className="text-center py-16">
            <ShieldCheck size={32} className="text-[#38BDF8] mx-auto mb-4 opacity-40" />
            <p className="font-semibold mb-1" style={{ color: "var(--text)" }}>No assessments yet</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Completed assessments from any tool will appear here.
            </p>
          </GlassCard>
        ) : (
          <>
            {/* View toggle */}
            <div className="flex gap-2 mb-5">
              {(["schools", "all"] as const).map((v) => (
                <button key={v} onClick={() => setView(v)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all border ${view === v ? "bg-[rgba(56,189,248,0.15)] border-[rgba(56,189,248,0.3)] text-[#38BDF8]" : "glass border-transparent"}`}
                  style={{ color: view === v ? "#38BDF8" : "var(--text-dim)" }}>
                  {v === "schools" ? "By School" : "All Submissions"}
                </button>
              ))}
            </div>

            {view === "schools" ? (
              <GroupedBySchool submissions={submissions} onDelete={handleDelete} />
            ) : (
              <div className="flex flex-col gap-3">
                {submissions.map((s) => {
                  const color = TOOL_COLORS[s.tool] ?? "#38BDF8";
                  const date = new Date(s.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
                  return (
                    <GlassCard key={s.id} className="flex items-center gap-4">
                      {s.logoDataUrl ? (
                        <img src={s.logoDataUrl} alt="" className="h-10 w-10 object-contain rounded bg-white/10 p-0.5 shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate" style={{ color: "var(--text)" }}>{s.schoolName}</p>
                        <p className="text-xs truncate" style={{ color: "var(--text-faint)" }}>{s.tool} · {date} · {s.staffMember}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <ScoreBadge score={s.score} color={color} />
                        {s.schoolEmail && (
                          <button onClick={() => sendCertificateEmail(s)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center glass hover:bg-white/10 transition-all"
                            title="Send certificate">
                            <Mail size={14} className="text-[#38BDF8]" />
                          </button>
                        )}
                        <button onClick={() => handleDelete(s.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center glass hover:bg-red-500/10 transition-all"
                          title="Delete">
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            )}
          </>
        )}

        <p className="text-xs mt-8 text-center" style={{ color: "var(--text-faint)" }}>
          Assessment records are stored locally in your browser. Clear browser data will remove them.
        </p>
      </div>
    </div>
  );
}
