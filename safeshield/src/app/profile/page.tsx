"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Building2,
  Mail,
  Calendar,
  ShieldCheck,
  FileText,
  Loader2,
  KeyRound,
  Eye,
  Camera,
  Sparkles,
  Send,
  BarChart2,
  Wrench,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import ReportViewModal from "@/components/report/ReportViewModal";
import BannerUploadButton from "@/components/ui/BannerUploadButton";
import { useToolBanner } from "@/hooks/useToolBanner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import type { Report, Organisation, School } from "@/lib/supabase";
import { getSubmissions } from "@/lib/submissions";

const TOOL_COLORS: Record<string, string> = {
  "Safeguarding Risk Checker": "#34D399",
  "Governance Compliance Checker": "#A78BFA",
  "AI Readiness Assessment": "#FB923C",
  "DPIA Wizard": "#FCD34D",
  "Web Accessibility Checker": "#F472B6",
  "Ofsted Ready Checker": "#4ADE80",
  "AI Content Detector": "#38BDF8",
  "Digital Standards Checker": "#818CF8",
  "Health & Safety Checker": "#F97316",
};

const ORG_TYPE_LABELS: Record<string, string> = {
  la_school: "Local Authority School",
  single_school: "Independent School",
  mat: "Multi-Academy Trust",
};

const SUGGESTED_PROMPTS = [
  "Am I Ofsted ready?",
  "What does KCSIE require?",
  "Do I need a DPIA?",
  "How do I improve my safeguarding score?",
];

type ChatMessage = { role: "user" | "assistant"; content: string };

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const { bannerUrl, setBannerUrl, isVideo, uploadBanner, uploading: bannerUploading } = useToolBanner("profile");
  const [reports, setReports] = useState<Report[]>([]);
  const [org, setOrg] = useState<Organisation | null>(null);
  const [school, setSchool] = useState<School | null>(null);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [viewing, setViewing] = useState<Report | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, chatLoading]);

  useEffect(() => {
    if (!user) return;

    async function load() {
      setReportsLoading(true);

      // Load avatar from profiles table
      const { data: profileRow } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user!.id)
        .single();
      if (profileRow?.avatar_url) setAvatarUrl(profileRow.avatar_url);

      // Load org membership
      const { data: memberRow } = await supabase
        .from("org_members")
        .select("org_id, school_id")
        .eq("user_id", user!.id)
        .limit(1)
        .single();

      if (memberRow?.org_id) {
        const { data: orgData } = await supabase
          .from("organisations")
          .select("*")
          .eq("id", memberRow.org_id)
          .single();
        setOrg(orgData);
      }

      if (memberRow?.school_id) {
        const { data: schoolData } = await supabase
          .from("schools")
          .select("*")
          .eq("id", memberRow.school_id)
          .single();
        setSchool(schoolData);
      }

      const isOrgAdmin = memberRow
        ? await supabase
            .from("org_members")
            .select("id")
            .eq("user_id", user!.id)
            .eq("role", "admin")
            .limit(1)
            .maybeSingle()
            .then(({ data }) => !!data)
        : false;

      let query = supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (isOrgAdmin && (memberRow?.org_id || memberRow?.school_id)) {
        const orParts: string[] = [];
        if (memberRow?.org_id) orParts.push(`org_id.eq.${memberRow.org_id}`);
        if (memberRow?.school_id)
          orParts.push(`school_id.eq.${memberRow.school_id}`);
        query = query.or(orParts.join(","));
      } else {
        query = query.eq("created_by", user!.id);
      }

      const { data: reportRows, error: reportErr } = await query;
      if (reportErr) console.error("[Profile] reports fetch error:", reportErr);

      if (reportRows && reportRows.length > 0) {
        setReports(reportRows);
      } else {
        const local = getSubmissions();
        const mapped: Report[] = local.map((s) => ({
          id: s.id,
          school_id: null,
          org_id: null,
          tool_slug: s.tool.toLowerCase().replace(/\s+/g, "-"),
          tool_name: s.tool,
          school_name: s.schoolName,
          school_email: s.schoolEmail || null,
          staff_member: s.staffMember || null,
          consultant_name: s.consultantName || null,
          consultant_email: s.consultantEmail || null,
          score: s.score,
          rating: s.rating,
          rating_color: s.ratingColor,
          logo_data_url: s.logoDataUrl || null,
          areas: s.areas || null,
          recommendations: null,
          created_by: user!.id,
          created_at: s.date,
        }));
        setReports(mapped);
      }

      setReportsLoading(false);
    }

    load();
  }, [user]);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setAvatarUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        // Store base64 data URL directly in profiles table — no Storage bucket needed
        const { error } = await supabase
          .from("profiles")
          .update({ avatar_url: dataUrl })
          .eq("id", user.id);
        if (error) {
          console.error("[Avatar] save error:", error);
        } else {
          setAvatarUrl(dataUrl);
        }
        setAvatarUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("[Avatar] error:", err);
      setAvatarUploading(false);
    }
  }

  async function sendChatMessage(text: string) {
    if (!text.trim() || chatLoading) return;
    const userMsg: ChatMessage = { role: "user", content: text.trim() };
    const next = [...chatMessages, userMsg];
    setChatMessages(next);
    setChatInput("");
    setChatLoading(true);

    const context = [
      org ? `Organisation: ${org.name}` : null,
      school ? `School: ${school.name}` : null,
      reports.length > 0
        ? `Recent report scores: ${reports
            .slice(0, 3)
            .map((r) => `${r.tool_name}: ${r.score}%`)
            .join(", ")}`
        : null,
    ]
      .filter(Boolean)
      .join(". ");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
          context,
        }),
      });
      const { text: reply } = await res.json();
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply },
      ]);
    } catch (err) {
      console.error("[Chat] error:", err);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={24} className="animate-spin" style={{ color: "var(--accent)" }} />
      </div>
    );
  }

  if (!user || !profile) return null;

  const joinDate = new Date(profile.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const initials = (profile.full_name ?? user.email ?? "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const avgScore =
    reports.length > 0
      ? Math.round(reports.reduce((a, r) => a + r.score, 0) / reports.length)
      : null;

  const uniqueTools = new Set(reports.map((r) => r.tool_name)).size;

  return (
    <div className="min-h-screen pt-16 pb-20">
      {/* ─── Banner ──────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden w-full"
        style={{ aspectRatio: "1920 / 400", minHeight: 280 }}
      >
        {/* Background banner — video or image */}
        {!isVideo(bannerUrl) && (
            <img
            src={bannerUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: "cover", opacity: 0.6 }}
          />
          )}
        {/* Glass overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.65) 100%)",
          }}
        />
        <BannerUploadButton toolSlug="profile" onUploaded={(url) => setBannerUrl(url)} uploadBanner={uploadBanner} uploading={bannerUploading} />

        {/* Status badge */}
        <div className="absolute top-4 right-4 z-10">
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full border"
            style={
              profile.status === "active"
                ? {
                    background: "rgba(52,211,153,0.15)",
                    borderColor: "rgba(52,211,153,0.4)",
                    color: "#34D399",
                  }
                : {
                    background: "rgba(251,191,36,0.15)",
                    borderColor: "rgba(251,191,36,0.4)",
                    color: "#FBBF24",
                  }
            }
          >
            {profile.status === "active" ? "Active" : "Pending"}
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-10 flex flex-col items-start gap-4">
          {/* Avatar */}
          <div className="relative">
            <div
              className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-2xl font-bold border-2"
              style={{
                background: avatarUrl
                  ? "transparent"
                  : "rgba(56,189,248,0.15)",
                borderColor: "rgba(56,189,248,0.4)",
                color: "var(--accent)",
              }}
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt="Profile photo"
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            {/* Camera upload button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center transition-all disabled:opacity-50"
              style={{
                background: "var(--accent)",
                border: "2px solid rgba(0,0,0,0.4)",
                color: "#000",
              }}
              title="Upload profile photo"
            >
              {avatarUploading ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Camera size={12} />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>

          {/* Name / email / org / join date */}
          <div>
            <h1
              className="heading-luxury text-2xl text-white"
              style={{ fontWeight: 700 }}
            >
              {profile.full_name ?? "—"}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>
              {user.email}
            </p>
            {org && (
              <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                {org.name}
              </p>
            )}
            <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "rgba(255,255,255,0.4)" }}>
              <Calendar size={11} /> Joined {joinDate}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Quick stats bar ──────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            {
              icon: <FileText size={16} />,
              label: "Reports",
              value: reportsLoading ? "—" : String(reports.length),
              onClick: () => document.getElementById("reports-section")?.scrollIntoView({ behavior: "smooth" }),
            },
            {
              icon: <BarChart2 size={16} />,
              label: "Avg Score",
              value: reportsLoading
                ? "—"
                : avgScore !== null
                ? `${avgScore}%`
                : "—",
              onClick: () => document.getElementById("reports-section")?.scrollIntoView({ behavior: "smooth" }),
            },
            {
              icon: <Wrench size={16} />,
              label: "Tools Used",
              value: reportsLoading ? "—" : String(uniqueTools),
              onClick: () => router.push("/"),
            },
            {
              icon: <Building2 size={16} />,
              label: "Organisation",
              value: org ? org.name : "—",
              onClick: () => router.push("/org"),
            },
          ].map(({ icon, label, value, onClick }) => (
            <GlassCard
              key={label}
              className="text-center py-4 cursor-pointer transition-transform hover:-translate-y-0.5 active:scale-95"
              onClick={onClick}
            >
              <div
                className="flex justify-center mb-1"
                style={{ color: "var(--accent)" }}
              >
                {icon}
              </div>
              <p
                className="text-lg font-bold truncate"
                style={{ color: "var(--text)" }}
              >
                {value}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {label}
              </p>
            </GlassCard>
          ))}
        </div>

        {/* ─── AI Consultant Chat ───────────────────────────────────────── */}
        <GlassCard className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} style={{ color: "var(--accent)" }} />
            <h2 className="font-semibold text-base" style={{ color: "var(--text)" }}>
              AI Compliance Consultant
            </h2>
          </div>

          {/* Suggested prompts */}
          {chatMessages.length === 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => sendChatMessage(p)}
                  className="text-xs px-3 py-1.5 rounded-full border transition-all hover:opacity-80"
                  style={{
                    background: "rgba(56,189,248,0.08)",
                    borderColor: "rgba(56,189,248,0.25)",
                    color: "var(--accent)",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Message thread */}
          {chatMessages.length > 0 && (
            <div
              className="flex flex-col gap-3 mb-4 overflow-y-auto pr-1"
              style={{ maxHeight: 400 }}
            >
              {chatMessages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="max-w-[80%] text-sm rounded-2xl px-4 py-2.5 leading-relaxed"
                    style={
                      m.role === "user"
                        ? {
                            background: "var(--accent)",
                            color: "#000",
                          }
                        : {
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "var(--text)",
                          }
                    }
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full animate-bounce"
                        style={{
                          background: "var(--text-muted)",
                          animationDelay: `${i * 0.15}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}

          {/* Input bar */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendChatMessage(chatInput);
                }
              }}
              placeholder="Ask about safeguarding, Ofsted, GDPR…"
              className="input-glass flex-1 text-sm"
              disabled={chatLoading}
            />
            <button
              onClick={() => sendChatMessage(chatInput)}
              disabled={chatLoading || !chatInput.trim()}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-40"
              style={{
                background: "var(--accent)",
                color: "#000",
              }}
            >
              <Send size={15} />
            </button>
          </div>
        </GlassCard>

        {/* ─── Change Password (collapsible) ───────────────────────────── */}
        <ChangePasswordCard />

        {/* ─── My Reports ───────────────────────────────────────────────── */}
        <div id="reports-section" className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={16} style={{ color: "var(--accent)" }} />
            <h2 className="text-lg font-semibold" style={{ color: "var(--text)" }}>
              My Reports
            </h2>
            {reports.length > 0 && (
              <span
                className="text-xs px-2 py-0.5 rounded-full border"
                style={{
                  background: "rgba(56,189,248,0.1)",
                  borderColor: "rgba(56,189,248,0.2)",
                  color: "var(--accent)",
                }}
              >
                {reports.length}
              </span>
            )}
          </div>

          {reportsLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={20} className="animate-spin" style={{ color: "var(--accent)" }} />
            </div>
          ) : reports.length === 0 ? (
            <GlassCard className="text-center py-16">
              <ShieldCheck
                size={32}
                className="mx-auto mb-4 opacity-40"
                style={{ color: "var(--accent)" }}
              />
              <p className="font-semibold mb-1" style={{ color: "var(--text)" }}>
                No reports yet
              </p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Complete a tool assessment to generate your first report.
              </p>
            </GlassCard>
          ) : (
            <div className="flex flex-col gap-3">
              {reports.map((r) => {
                const color = TOOL_COLORS[r.tool_name] ?? "#38BDF8";
                const date = new Date(r.created_at).toLocaleDateString(
                  "en-GB",
                  { day: "numeric", month: "short", year: "numeric" }
                );
                return (
                  <GlassCard key={r.id}>
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          background: `${color}15`,
                          border: `1px solid ${color}30`,
                        }}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ background: color }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-semibold text-sm truncate"
                          style={{ color: "var(--text)" }}
                        >
                          {r.tool_name}
                        </p>
                        <p
                          className="text-xs truncate"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {r.school_name} · {date}
                        </p>
                        {r.staff_member && (
                          <p
                            className="text-xs truncate"
                            style={{ color: "var(--text-dim)" }}
                          >
                            {r.staff_member}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className="text-sm font-bold px-2.5 py-0.5 rounded-full border"
                          style={{
                            color,
                            background: `${color}15`,
                            borderColor: `${color}40`,
                          }}
                        >
                          {r.score}%
                        </span>
                        <span
                          className="text-xs hidden sm:block"
                          style={{ color: "var(--text-dim)" }}
                        >
                          {r.rating}
                        </span>
                        <button
                          onClick={() => setViewing(r)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                          }}
                          title="View report"
                        >
                          <Eye size={14} style={{ color: "var(--accent)" }} />
                        </button>
                      </div>
                    </div>
                    {r.areas && r.areas.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <p
                          className="text-[0.65rem] font-medium uppercase tracking-wider mb-2"
                          style={{ color: "var(--text-dim)" }}
                        >
                          Areas covered
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {r.areas.map((a, i) => (
                            <span
                              key={i}
                              className="text-[0.65rem] px-2 py-0.5 rounded-full"
                              style={{
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                color: "var(--text-dim)",
                              }}
                            >
                              {a.name}
                              {a.score !== undefined ? ` · ${a.score}%` : ""}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {viewing && (
        <ReportViewModal
          onClose={() => setViewing(null)}
          data={{
            meta: {
              schoolName: viewing.school_name,
              schoolEmail: viewing.school_email ?? "",
              consultantName: viewing.consultant_name ?? "",
              consultantEmail: viewing.consultant_email ?? "",
              staffMember: viewing.staff_member ?? "",
              logoDataUrl: viewing.logo_data_url,
            },
            toolName: viewing.tool_name,
            score: viewing.score,
            rating: viewing.rating,
            ratingColor: viewing.rating_color,
            accentColor: TOOL_COLORS[viewing.tool_name] ?? "#38BDF8",
            date: new Date(viewing.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
            areas: viewing.areas ?? undefined,
            gaps: viewing.recommendations ?? undefined,
          }}
        />
      )}
    </div>
  );
}

function ChangePasswordCard() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setMsg("");
    if (password.length < 8) {
      setErr("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setErr("Passwords do not match.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setMsg("Password updated successfully.");
    setPassword("");
    setConfirm("");
  }

  return (
    <GlassCard className="mb-8">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <KeyRound size={16} style={{ color: "var(--accent)" }} />
          <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>
            Change Password
          </span>
        </div>
        <span className="text-xs" style={{ color: "var(--text-dim)" }}>
          {open ? "Cancel" : "Edit"}
        </span>
      </button>
      {open && (
        <form onSubmit={save} className="mt-4 flex flex-col gap-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            minLength={8}
            required
            className="input-glass"
          />
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm new password"
            minLength={8}
            required
            className="input-glass"
          />
          {err && <p className="text-xs text-red-400">{err}</p>}
          {msg && <p className="text-xs text-green-400">{msg}</p>}
          <button
            type="submit"
            disabled={busy}
            className="self-start flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
            style={{
              background: "rgba(56,189,248,0.15)",
              border: "1px solid rgba(56,189,248,0.3)",
              color: "var(--accent)",
            }}
          >
            {busy && <Loader2 size={14} className="animate-spin" />} Update
            Password
          </button>
        </form>
      )}
    </GlassCard>
  );
}
