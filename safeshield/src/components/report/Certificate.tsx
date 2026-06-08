"use client";
import { useEffect, useState } from "react";
import { Printer, Mail, Sun, Moon } from "lucide-react";
import type { ReportMetaData } from "./ReportMeta";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

type Props = {
  meta: ReportMetaData;
  toolName: string;
  score: number;
  rating: string;
  ratingColor: string;
  date?: string;
  accentColor?: string;
  areas?: { name: string; score?: number }[];
};

/* ── SVG circular score gauge ─────────────────────────────────────────── */
function ScoreGauge({ score, accent }: { score: number; accent: string }) {
  const R = 52, C = 2 * Math.PI * R;
  const dash = (score / 100) * C;
  return (
    <svg width={130} height={130} viewBox="0 0 130 130" style={{ display: "block" }}>
      <defs>
        <filter id="gaugeGlow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feComposite in="SourceGraphic" in2="b" operator="over" />
        </filter>
        <radialGradient id="gaugeTrack" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
        </radialGradient>
      </defs>
      {/* glass disc */}
      <circle cx="65" cy="65" r="60" fill="url(#gaugeTrack)" />
      <circle cx="65" cy="65" r="60" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      {/* track */}
      <circle cx="65" cy="65" r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10"
        strokeLinecap="round" strokeDasharray={`${C}`} transform="rotate(-90 65 65)" />
      {/* arc */}
      <circle cx="65" cy="65" r={R} fill="none" stroke={accent} strokeWidth="10"
        strokeLinecap="round" strokeDasharray={`${dash} ${C}`}
        transform="rotate(-90 65 65)" filter="url(#gaugeGlow)"
        style={{ transition: "stroke-dasharray 1s cubic-bezier(.4,0,.2,1)" }} />
      {/* specular shine on arc */}
      <circle cx="65" cy="65" r={R} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5"
        strokeLinecap="round" strokeDasharray={`${dash * 0.3} ${C}`}
        transform="rotate(-90 65 65)" />
      {/* score text */}
      <text x="65" y="60" textAnchor="middle" dominantBaseline="middle"
        style={{ fill: "#fff", fontSize: 26, fontWeight: 700, fontFamily: "system-ui,sans-serif", letterSpacing: "-1px" }}>
        {score}
      </text>
      <text x="65" y="79" textAnchor="middle" dominantBaseline="middle"
        style={{ fill: "rgba(255,255,255,0.5)", fontSize: 10, fontFamily: "system-ui,sans-serif", letterSpacing: "2px" }}>
        SCORE
      </text>
    </svg>
  );
}

export default function Certificate({ meta, toolName, score, rating, ratingColor, date, accentColor = "#38BDF8", areas }: Props) {
  const { user } = useAuth();
  const [orgLogoUrl, setOrgLogoUrl] = useState<string | null>(null);
  const [schoolLogoUrl, setSchoolLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: membership } = await supabase.from("org_members").select("org_id, school_id")
        .eq("user_id", user.id).limit(1).maybeSingle();
      if (!membership) return;
      if (membership.org_id) {
        const { data: org } = await supabase.from("organisations").select("logo_url").eq("id", membership.org_id).single();
        if (org?.logo_url) setOrgLogoUrl(org.logo_url);
      }
      if (membership.school_id) {
        const { data: school } = await supabase.from("schools").select("logo_url").eq("id", membership.school_id).single();
        if (school?.logo_url) setSchoolLogoUrl(school.logo_url);
      }
    })();
  }, [user]);

  const [printMode, setPrintMode] = useState<"dark" | "light">("dark");
  const [emailSending, setEmailSending] = useState(false);
  const today = date ?? new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const certId = `MH-${Date.now().toString(36).toUpperCase().slice(-5)}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  const displaySchoolLogo = meta.logoDataUrl || schoolLogoUrl;
  const displayOrgLogo = orgLogoUrl && orgLogoUrl !== displaySchoolLogo ? orgLogoUrl : null;

  /* ── PRINT ──────────────────────────────────────────────────────────── */
  function buildHtml(dark: boolean) {
    const R = 70, C = 2 * Math.PI * R, dash = (score / 100) * C;

    const gaugeBg    = dark ? "#0D1117" : "#F1F5F9";
    const gaugeTrack = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
    const gaugeText  = dark ? "white" : "#0F172A";
    const gaugeSubText = dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)";

    const gaugesvg = `<svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
      <circle cx="90" cy="90" r="85" fill="${gaugeBg}"/>
      <circle cx="90" cy="90" r="85" fill="none" stroke="${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}" stroke-width="1"/>
      <circle cx="90" cy="90" r="${R}" fill="none" stroke="${gaugeTrack}" stroke-width="13" stroke-linecap="round" stroke-dasharray="${C}" transform="rotate(-90 90 90)"/>
      <circle cx="90" cy="90" r="${R}" fill="none" stroke="${accentColor}" stroke-width="13" stroke-linecap="round" stroke-dasharray="${dash} ${C}" transform="rotate(-90 90 90)"/>
      <text x="90" y="83" text-anchor="middle" dominant-baseline="middle" fill="${gaugeText}" font-size="38" font-weight="700" font-family="system-ui,sans-serif" letter-spacing="-2">${score}%</text>
      <text x="90" y="106" text-anchor="middle" dominant-baseline="middle" fill="${gaugeSubText}" font-size="12" font-family="system-ui,sans-serif" letter-spacing="3">SCORE</text>
    </svg>`;

    const areasHtml = areas && areas.length > 0
      ? `<div class="areas-grid">${areas.slice(0, 8).map(a => `
          <div class="area-cell">
            <span class="area-name">${a.name}</span>
            ${a.score !== undefined ? `<span class="area-score">${a.score}%</span>` : ""}
          </div>`).join("")}</div>`
      : "";

    const logoLeft  = displaySchoolLogo ? `<img src="${displaySchoolLogo}" class="logo-img"/>` : "";

    const css = dark ? `
.border-ring{position:absolute;inset:6mm;border-radius:18px;border:1px solid rgba(212,168,67,0.20)}
.border-ring-inner{position:absolute;inset:8mm;border-radius:14px;border:1px solid rgba(212,168,67,0.10)}
.page{background:linear-gradient(160deg,#0F1018 0%,#181420 55%,#1C1508 100%)}
.consultant-name{color:#D4A843}
.consultant-role{color:#8A6420}
.tool-pill{background:rgba(212,168,67,0.08);border:1.5px solid rgba(212,168,67,0.45);color:#D4A843}
.certifies-label{color:#A07828}
.school-name{color:#F0D080}
.completed-sub{color:#8A6420}
.completed-sub strong{color:#D4A843}
.rating-pill{background:rgba(212,168,67,0.07);border:1.5px solid ${ratingColor}99;color:${ratingColor}}
.score-label{color:#8A6420}
.details-panel{background:rgba(212,168,67,0.05);border:1px solid rgba(212,168,67,0.15);border-top-color:rgba(212,168,67,0.25)}
.field-label{color:#8A6420}
.field-value{color:#D4A843}
.areas-panel{background:rgba(212,168,67,0.04);border:1px solid rgba(212,168,67,0.12);border-top-color:rgba(212,168,67,0.20)}
.areas-heading{color:#8A6420}
.area-cell{border-bottom:1px solid rgba(212,168,67,0.08)}
.area-name{color:#C8A040}
.area-score{color:#D4A843}
.sig-rule{background:rgba(212,168,67,0.50)}
.sig-name{color:#D4A843}
.sig-role{color:#8A6420}
.footer{border-top:1px solid rgba(212,168,67,0.18)}
.footer span{color:#8A6420}
.accent-rule{background:linear-gradient(90deg,transparent,${accentColor},transparent)}
` : `
.page{background:#fff;border:1px solid #E8D5A0}
.border-ring{position:absolute;inset:6mm;border-radius:18px;border:1.5px solid #C49A3C66}
.border-ring-inner{position:absolute;inset:8mm;border-radius:14px;border:1px solid #C49A3C33}
.consultant-name{color:#B8860B}
.consultant-role{color:#C49A3C}
.wordmark-safe{color:#C49A3C;font-weight:300}
.wordmark-shield{color:#8A6420;font-weight:700}
.wordmark-tag{color:#C49A3C}
.tool-pill{background:#FFF8E6;border:1.5px solid #C49A3C;color:#8A6420}
.certifies-label{color:#C49A3C;font-style:italic}
.school-name{color:#7C5A1A}
.completed-sub{color:#C49A3C;font-style:italic}
.completed-sub strong{color:#8A6420;font-style:normal}
.rating-pill{background:${ratingColor}12;border:1.5px solid ${ratingColor};color:${ratingColor}}
.score-label{color:#C49A3C}
.details-panel{background:#FDFAF0;border:1px solid #E8D5A0}
.field-label{color:#C49A3C}
.field-value{color:#8A6420}
.areas-panel{background:#FDFAF0;border:1px solid #E8D5A0}
.areas-heading{color:#C49A3C}
.area-cell{border-bottom:1px solid #EDE0B8}
.area-name{color:#8A6420}
.area-score{color:#B8860B}
.sig-rule{background:#C49A3C}
.sig-name{color:#8A6420;font-style:italic}
.sig-role{color:#C49A3C}
.footer{border-top:1px solid #E8D5A0}
.footer span{color:#C49A3C}
.accent-rule{background:linear-gradient(90deg,transparent,#C49A3C,transparent)}
`;

    return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garant:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&display=swap" rel="stylesheet">
<title>Certificate — ${toolName}</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
@page{size:A4 portrait;margin:0}
html,body{width:210mm;height:297mm;-webkit-print-color-adjust:exact;print-color-adjust:exact;font-family:'Cormorant Garant',Georgia,serif}
.page{width:210mm;height:297mm;display:flex;flex-direction:column;align-items:center;padding:12mm 16mm 10mm;position:relative;overflow:hidden}
.topbar{width:100%;display:flex;justify-content:space-between;align-items:center;margin-bottom:6mm}
.logo-img{height:52px;object-fit:contain;max-width:140px}
.wordmark{font-family:system-ui,-apple-system,sans-serif;font-size:13px;letter-spacing:.12em;text-transform:uppercase;line-height:1}
.wordmark-safe{font-weight:300;color:${dark ? "rgba(255,255,255,0.55)" : "#C49A3C"}}
.wordmark-shield{font-weight:700;color:${dark ? "#fff" : "#8A6420"}}
.wordmark-tag{font-family:system-ui,sans-serif;font-size:7px;letter-spacing:.18em;text-transform:uppercase;margin-top:2px;color:${dark ? "rgba(255,255,255,0.4)" : "#C49A3C"}}
.consultant{text-align:right;font-family:system-ui,-apple-system,sans-serif}
.consultant-name{font-size:13px;font-weight:600;letter-spacing:.01em}
.consultant-role{font-size:9px;letter-spacing:.1em;text-transform:uppercase;margin-top:2px}
.tool-pill{display:inline-flex;align-items:center;gap:7px;padding:7px 20px;border-radius:999px;font-size:10px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;margin-bottom:8mm;font-family:system-ui,sans-serif}
.pill-dot{width:7px;height:7px;border-radius:50%;background:${accentColor}}
.certifies-label{font-size:13px;font-style:italic;font-weight:400;letter-spacing:.08em;margin-bottom:5mm;text-align:center;font-family:'Cormorant Garant',Georgia,serif}
.school-name{font-size:44px;font-weight:600;text-align:center;line-height:1.1;margin-bottom:3mm;font-family:'Cormorant Garant',Georgia,serif;letter-spacing:.02em}
.completed-sub{font-size:16px;font-style:italic;text-align:center;margin-bottom:8mm;font-family:'Cormorant Garant',Georgia,serif}
.accent-rule{width:60mm;height:2px;border-radius:2px;margin:0 auto 8mm}
.gauge-row{display:flex;align-items:center;gap:10mm;margin-bottom:8mm}
.rating-pill{display:inline-flex;align-items:center;justify-content:center;padding:8px 22px;border-radius:999px;font-size:14px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
.score-label{font-size:11px;letter-spacing:.06em;margin-top:4px}
.details-panel{width:140mm;border-radius:16px;padding:6mm 8mm;margin-bottom:6mm}
.field-row{display:flex;gap:10px;margin-bottom:5px;align-items:baseline}
.field-label{font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;min-width:26mm}
.field-value{font-size:12px;font-weight:500}
.areas-panel{width:140mm;border-radius:14px;padding:5mm 7mm;margin-bottom:6mm}
.areas-heading{font-size:8px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;margin-bottom:4mm;text-align:center}
.areas-grid{display:grid;grid-template-columns:1fr 1fr;gap:3px 8mm}
.area-cell{display:flex;justify-content:space-between;align-items:center;padding:3px 0}
.area-name{font-size:9px;flex:1;padding-right:6px}
.area-score{font-size:9px;font-weight:700;white-space:nowrap}
.sig-row{width:140mm;display:flex;justify-content:flex-end;margin-bottom:auto}
.sig-block{text-align:left}
.sig-rule{width:46mm;height:1px;margin-bottom:5px}
.sig-name{font-size:16px;font-style:italic;font-family:'Cormorant Garant',Georgia,serif;font-weight:400}
.sig-role{font-size:8px;text-transform:uppercase;letter-spacing:.12em;margin-top:2px;font-family:system-ui,sans-serif}
.footer{width:100%;display:flex;justify-content:space-between;align-items:center;padding-top:4mm;margin-top:4mm}
${css}
</style></head><body>
<div class="page">
  <div class="border-ring"></div>
  <div class="border-ring-inner"></div>
  <div class="topbar">
    <div style="display:flex;align-items:center;gap:12px">
      ${dark
        ? `<div style="border-left:2px solid rgba(255,255,255,0.35);padding-left:10px">
            <div class="wordmark"><span class="wordmark-safe">SAFE</span><span class="wordmark-shield">SHIELD</span></div>
            <div class="wordmark-tag">Protect · Comply · Assure</div>
           </div>
           ${displaySchoolLogo ? `<img src="${displaySchoolLogo}" style="height:44px;max-width:130px;object-fit:contain"/>` : ""}`
        : `${displaySchoolLogo ? `<img src="${displaySchoolLogo}" style="height:44px;max-width:130px;object-fit:contain"/>` : '<div style="width:8px"></div>'}`
      }
    </div>
    <div style="display:flex;align-items:center;gap:12px">
      ${!dark
        ? `<div style="border-right:2px solid #C49A3C;padding-right:10px;text-align:right">
            <div class="wordmark"><span class="wordmark-safe">SAFE</span><span class="wordmark-shield">SHIELD</span></div>
            <div class="wordmark-tag" style="text-align:right">Protect · Comply · Assure</div>
           </div>`
        : ""
      }
      <div class="consultant">
        <div class="consultant-name">${meta.consultantName || "Mathew Hewington"}</div>
        <div class="consultant-role">Education Consultant</div>
      </div>
    </div>
  </div>
  <span class="tool-pill"><span class="pill-dot"></span>${toolName} · Assessment Certificate</span>
  <p class="certifies-label">This is to certify that</p>
  <p class="school-name">${meta.schoolName || "School Name"}</p>
  <p class="completed-sub">has successfully completed the <span style="font-style:normal;font-weight:600">${toolName}</span></p>
  <div class="accent-rule"></div>
  <div class="gauge-row">
    ${gaugesvg}
    <div style="display:flex;flex-direction:column;align-items:flex-start;gap:8px">
      <span class="rating-pill">${rating}</span>
      <span class="score-label">Assessment Score</span>
    </div>
  </div>
  <div class="details-panel">
    ${meta.staffMember ? `<div class="field-row"><span class="field-label">Completed by</span><span class="field-value">${meta.staffMember}</span></div>` : ""}
    <div class="field-row"><span class="field-label">Date</span><span class="field-value">${today}</span></div>
  </div>
  ${areasHtml ? `<div class="areas-panel"><p class="areas-heading">Areas Assessed</p>${areasHtml}</div>` : ""}
  <div class="sig-row">
    <div class="sig-block">
      <div class="sig-rule"></div>
      <p class="sig-name">${meta.consultantName || "Mathew Hewington"}</p>
      <p class="sig-role">Education Consultant</p>
    </div>
  </div>
  <div class="footer">
    <span class="footer-brand" style="font-size:8px;font-weight:700;letter-spacing:.14em;text-transform:uppercase">SafeShield · Verified Assessment</span>
    <span class="footer-ref" style="font-size:8px;letter-spacing:.1em">${certId}</span>
  </div>
</div>
</body></html>`;
  }

  function handlePrint() {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(buildHtml(printMode === "dark"));
    w.document.close();
    setTimeout(() => w.print(), 600);
  }

  async function handleEmail() {
    const recipients = [meta.schoolEmail, meta.consultantEmail].filter(Boolean) as string[];
    if (recipients.length === 0) {
      alert("No email addresses on file. Add a school or consultant email first.");
      return;
    }
    setEmailSending(true);
    try {
      const res = await fetch("/api/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipients,
          subject: `${toolName} Certificate — ${meta.schoolName}`,
          html: buildHtml(false),
          type: "certificate",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Send failed");
      alert(`Certificate emailed to ${recipients.join(", ")}`);
    } catch (err: unknown) {
      alert(`Failed to send: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setEmailSending(false);
    }
  }

  /* ── ON-SCREEN CRISP GLASS PREVIEW ──────────────────────────────────── */
  const glassPanel: React.CSSProperties = {
    background: "linear-gradient(180deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.04) 100%)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderTop: "1px solid rgba(255,255,255,0.26)" as unknown as string,
    borderRadius: 16,
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), 0 8px 32px rgba(0,0,0,0.35)",
  };

  const pillStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 16px",
    borderRadius: 999,
    background: `linear-gradient(135deg,rgba(255,255,255,0.10),rgba(255,255,255,0.04)) padding-box,
      conic-gradient(from 130deg at 50% 50%,
        rgba(56,189,248,0.8), rgba(167,139,250,0.7),
        rgba(52,211,153,0.6), rgba(251,146,60,0.5),
        rgba(244,114,182,0.6), rgba(56,189,248,0.8)
      ) border-box`,
    border: "1.5px solid transparent",
    backdropFilter: "blur(16px) saturate(200%)",
    WebkitBackdropFilter: "blur(16px) saturate(200%)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.15), 0 2px 12px rgba(0,0,0,0.3)",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.06em",
    color: "#fff",
    textTransform: "uppercase" as const,
  };

  return (
    <div className="flex flex-col gap-5">

      {/* ── Certificate Canvas ───────────────────────────────────────────── */}
      <div style={{
        position: "relative",
        borderRadius: 28,
        overflow: "hidden",
        background: `linear-gradient(145deg, #0F1018 0%, #181420 50%, #1C1508 100%)`,
        boxShadow: `0 0 0 1px rgba(212,168,67,0.18), 0 24px 80px rgba(0,0,0,0.6), 0 0 60px rgba(212,168,67,0.08)`,
        padding: "32px 36px 28px",
        fontFamily: "'Cormorant Garant', Georgia, serif",
      }}>

        {/* Ambient glow blobs */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,168,67,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(180,130,40,0.10) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* ── Top bar ─────────────────────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, position: "relative", zIndex: 1 }}>
          {/* SafeShield wordmark + optional school logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ borderLeft: `2px solid ${accentColor}`, paddingLeft: 10 }}>
              <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase" as const, lineHeight: 1 }}>
                <span style={{ fontWeight: 300, color: "rgba(255,255,255,0.6)" }}>SAFE</span><span style={{ fontWeight: 700, color: "#fff" }}>SHIELD</span>
              </div>
              <div style={{ fontSize: 7, letterSpacing: "0.18em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase" as const, fontFamily: "system-ui, sans-serif", marginTop: 2 }}>PROTECT · COMPLY · ASSURE</div>
            </div>
            {displaySchoolLogo && (
              <img src={displaySchoolLogo} alt="School logo"
                style={{ height: 44, objectFit: "contain", maxWidth: 130 }} />
            )}
            {displayOrgLogo && (
              <img src={displayOrgLogo} alt="Org logo"
                style={{ height: 44, objectFit: "contain", maxWidth: 130 }} />
            )}
          </div>
          {/* Tool name iridescent pill */}
          <span style={pillStyle}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: accentColor, boxShadow: `0 0 6px ${accentColor}` }} />
            {toolName}
          </span>
        </div>

        {/* Accent gradient rule */}
        <div style={{ height: 2, borderRadius: 2, background: `linear-gradient(90deg, ${accentColor}, rgba(167,139,250,0.7), transparent)`, marginBottom: 28, position: "relative", zIndex: 1 }} />

        {/* ── Certifies label ─────────────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: 10, position: "relative", zIndex: 1 }}>
          <span style={{ fontSize: 11, fontWeight: 400, fontStyle: "italic", color: "#A07828", letterSpacing: "0.14em", fontFamily: "'Cormorant Garant', Georgia, serif" }}>
            This is to certify that
          </span>
        </div>

        {/* ── School name ─────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: 8, position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: 40, fontWeight: 600, color: "#F0D080", lineHeight: 1.1, margin: 0, fontFamily: "'Cormorant Garant', Georgia, serif", letterSpacing: "0.02em" }}>
            {meta.schoolName || "School Name"}
          </p>
        </div>

        {/* ── Subtitle ────────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: 28, position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: 15, color: "#8A6420", margin: 0, fontFamily: "'Cormorant Garant', Georgia, serif", fontStyle: "italic" }}>
            has successfully completed the <span style={{ color: "#D4A843", fontStyle: "normal", fontWeight: 600 }}>{toolName}</span>
          </p>
        </div>

        {/* ── Score gauge + rating pill ────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 28, position: "relative", zIndex: 1 }}>
          <ScoreGauge score={score} accent={accentColor} />
          <span style={{ ...pillStyle, background: `linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.05)) padding-box, conic-gradient(from 130deg, ${ratingColor}cc, ${accentColor}cc, ${ratingColor}cc) border-box`, fontSize: 12 }}>
            {rating}
          </span>
        </div>

        {/* Horizontal divider */}
        <div style={{ height: 1, background: "rgba(212,168,67,0.20)", marginBottom: 20, position: "relative", zIndex: 1 }} />

        {/* ── 3-column details row ─────────────────────────────────────── */}
        <div style={{ ...glassPanel, padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px 16px", marginBottom: 16, position: "relative", zIndex: 1 }}>
          {[
            { label: "Completed By", value: meta.staffMember || "—" },
            { label: "Date", value: today },
            { label: "Consultant", value: meta.consultantName || "Mathew Hewington" },
          ].map((col) => (
            <div key={col.label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: "#8A6420", textTransform: "uppercase" as const, letterSpacing: "0.14em" }}>{col.label}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#D4A843", lineHeight: 1.2, fontFamily: "'Cormorant Garant', Georgia, serif" }}>{col.value}</span>
            </div>
          ))}
        </div>

        {/* ── Areas assessed 2-column grid ─────────────────────────────── */}
        {areas && areas.length > 0 && (
          <div style={{ ...glassPanel, padding: "16px 20px", marginBottom: 20, position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: "#8A6420", letterSpacing: "0.16em", textTransform: "uppercase" as const }}>Areas Assessed</span>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(212,168,67,0.30), transparent)" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 20px" }}>
              {areas.slice(0, 8).map(a => (
                <div key={a.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontSize: 11, color: "#C8A040", lineHeight: 1.3 }}>{a.name}</span>
                  {a.score !== undefined && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: accentColor, whiteSpace: "nowrap", paddingLeft: 8 }}>{a.score}%</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Signature line ───────────────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20, position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ height: 1, width: 140, background: "rgba(212,168,67,0.50)", marginBottom: 6, marginLeft: "auto" }} />
            <p style={{ fontSize: 15, color: "#D4A843", fontStyle: "italic", margin: 0, fontFamily: "'Cormorant Garant', Georgia, serif" }}>{meta.consultantName || "Mathew Hewington"}</p>
            <p style={{ fontSize: 9, color: "#8A6420", marginTop: 2, textTransform: "uppercase" as const, letterSpacing: "0.12em", fontFamily: "system-ui, sans-serif" }}>Education Consultant</p>
          </div>
        </div>

        {/* ── Footer ──────────────────────────────────────────────────── */}
        <div style={{ paddingTop: 14, borderTop: "1px solid rgba(212,168,67,0.20)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
          <span style={{ fontSize: 9, fontWeight: 600, color: "#8A6420", letterSpacing: "0.12em", textTransform: "uppercase" as const }}>SafeShield · Verified Assessment</span>
          <span style={{ fontSize: 9, color: "#8A6420", letterSpacing: "0.1em" }}>{certId}</span>
        </div>
      </div>

      {/* ── Action buttons ───────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Print mode toggle */}
        <div className="flex rounded-xl overflow-hidden border border-white/10 shrink-0">
          <button onClick={() => setPrintMode("dark")}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-all"
            style={{ background: printMode === "dark" ? "rgba(255,255,255,0.12)" : "transparent", color: printMode === "dark" ? "#fff" : "#64748B" }}>
            <Moon size={12} /> Dark
          </button>
          <button onClick={() => setPrintMode("light")}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-all"
            style={{ background: printMode === "light" ? "rgba(255,255,255,0.12)" : "transparent", color: printMode === "light" ? "#fff" : "#64748B" }}>
            <Sun size={12} /> Light
          </button>
        </div>

        <button onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}40`, color: accentColor }}>
          <Printer size={14} /> Print / Save PDF
        </button>
        <button onClick={handleEmail} disabled={emailSending}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all bg-white/5 border border-white/10"
          style={{ color: emailSending ? "#64748B" : "#94A3B8", cursor: emailSending ? "default" : "pointer" }}>
          <Mail size={14} /> {emailSending ? "Sending…" : "Email Certificate"}
        </button>
      </div>
    </div>
  );
}
