"use client";
import { useRef, useEffect, useState } from "react";
import { Printer, Mail } from "lucide-react";
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

  const today = date ?? new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const certId = `MH-${Date.now().toString(36).toUpperCase().slice(-5)}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  const displaySchoolLogo = meta.logoDataUrl || schoolLogoUrl;
  const displayOrgLogo = orgLogoUrl && orgLogoUrl !== displaySchoolLogo ? orgLogoUrl : null;

  /* ── PRINT — dark liquid glass A4 portrait certificate ──────────────── */
  function handlePrint() {
    const w = window.open("", "_blank");
    if (!w) return;

    const R = 70, C = 2 * Math.PI * R, dash = (score / 100) * C;

    /* Large centred score gauge */
    const gaugesvg = `<svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gd" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.08)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0.02)"/>
        </radialGradient>
        <filter id="gf"><feGaussianBlur stdDeviation="4" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/></filter>
      </defs>
      <circle cx="90" cy="90" r="85" fill="url(#gd)"/>
      <circle cx="90" cy="90" r="85" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <circle cx="90" cy="90" r="${R}" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="13" stroke-linecap="round" stroke-dasharray="${C}" transform="rotate(-90 90 90)"/>
      <circle cx="90" cy="90" r="${R}" fill="none" stroke="${accentColor}" stroke-width="13" stroke-linecap="round" stroke-dasharray="${dash} ${C}" transform="rotate(-90 90 90)" filter="url(#gf)"/>
      <circle cx="90" cy="90" r="${R}" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="${dash * 0.28} ${C}" transform="rotate(-90 90 90)"/>
      <text x="90" y="83" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="38" font-weight="700" font-family="system-ui,sans-serif" letter-spacing="-2">${score}%</text>
      <text x="90" y="106" text-anchor="middle" dominant-baseline="middle" fill="rgba(255,255,255,0.45)" font-size="12" font-family="system-ui,sans-serif" letter-spacing="3">SCORE</text>
    </svg>`;

    const areasHtml = areas && areas.length > 0
      ? `<div class="areas-grid">${areas.slice(0, 8).map(a => `
          <div class="area-cell">
            <span class="area-name">${a.name}</span>
            ${a.score !== undefined ? `<span class="area-score">${a.score}%</span>` : ""}
          </div>`).join("")}</div>`
      : "";

    const logoLeft  = displaySchoolLogo ? `<img src="${displaySchoolLogo}" class="logo-img"/>` : "";
    const logoRight = displayOrgLogo    ? `<img src="${displayOrgLogo}" class="logo-img"/>` : "";

    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>Certificate — ${toolName}</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
@page{size:A4 portrait;margin:0}
html,body{width:210mm;height:297mm;-webkit-print-color-adjust:exact;print-color-adjust:exact;font-family:system-ui,-apple-system,sans-serif}
.page{
  width:210mm;height:297mm;
  background:linear-gradient(160deg,#060A12 0%,#0C0A1C 55%,${accentColor}18 100%);
  display:flex;flex-direction:column;align-items:center;
  padding:12mm 16mm 10mm;
  position:relative;overflow:hidden;
}
/* ambient blobs — hidden in print */
.blob-tr,.blob-bl,.blob-br{display:none}

/* decorative border ring */
.border-ring{
  position:absolute;inset:6mm;border-radius:18px;pointer-events:none;
  border:1px solid rgba(255,255,255,0.07);
}
.border-ring-inner{
  position:absolute;inset:8mm;border-radius:14px;pointer-events:none;
  border:1px solid rgba(255,255,255,0.04);
}

/* top bar */
.topbar{
  width:100%;display:flex;justify-content:space-between;align-items:center;
  position:relative;z-index:2;margin-bottom:6mm;
}
.logo-img{height:52px;object-fit:contain;border-radius:10px;background:rgba(255,255,255,0.06);padding:5px}
.consultant{text-align:right}
.consultant-name{font-size:13px;font-weight:600;color:rgba(255,255,255,0.8);letter-spacing:.01em}
.consultant-role{font-size:9px;color:rgba(255,255,255,0.35);letter-spacing:.1em;text-transform:uppercase;margin-top:2px}

/* tool pill */
.tool-pill{
  display:inline-flex;align-items:center;gap:7px;
  padding:7px 20px;border-radius:999px;
  background:rgba(255,255,255,0.07);
  border:1.5px solid ${accentColor}70;
  font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,0.85);
  margin-bottom:8mm;position:relative;z-index:2;
}
.pill-dot{width:7px;height:7px;border-radius:50%;background:${accentColor};box-shadow:0 0 8px ${accentColor}}

/* certifies block */
.certifies-label{
  font-size:10px;font-weight:600;color:rgba(255,255,255,0.35);
  letter-spacing:.18em;text-transform:uppercase;
  margin-bottom:5mm;position:relative;z-index:2;text-align:center;
}
.school-name{
  font-size:34px;font-weight:700;color:#fff;text-align:center;
  line-height:1.15;margin-bottom:3mm;position:relative;z-index:2;
  text-shadow:0 0 40px ${accentColor}44;
}
.completed-sub{
  font-size:13px;color:rgba(255,255,255,0.45);text-align:center;
  margin-bottom:8mm;position:relative;z-index:2;
}
.completed-sub strong{color:rgba(255,255,255,0.72);font-weight:600}

/* accent rule */
.accent-rule{
  width:60mm;height:2px;border-radius:2px;
  background:linear-gradient(90deg,transparent,${accentColor},transparent);
  margin:0 auto 8mm;position:relative;z-index:2;
}

/* gauge row */
.gauge-row{
  display:flex;align-items:center;gap:10mm;
  margin-bottom:8mm;position:relative;z-index:2;
}
.rating-pill{
  display:inline-flex;align-items:center;justify-content:center;
  padding:8px 22px;border-radius:999px;
  background:rgba(255,255,255,0.07);
  border:1.5px solid ${ratingColor}99;
  font-size:14px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;
  color:${ratingColor};text-shadow:0 0 12px ${ratingColor}66;
}

/* details glass panel */
.details-panel{
  width:140mm;
  background:rgba(255,255,255,0.06);
  border:1px solid rgba(255,255,255,0.12);
  border-top-color:rgba(255,255,255,0.20);
  border-radius:16px;padding:6mm 8mm;
  position:relative;z-index:2;margin-bottom:6mm;
}
.field-row{display:flex;gap:10px;margin-bottom:5px;align-items:baseline}
.field-label{font-size:8px;font-weight:700;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:.14em;min-width:26mm}
.field-value{font-size:12px;color:rgba(255,255,255,0.78);font-weight:500}

/* areas grid */
.areas-panel{
  width:140mm;
  background:rgba(255,255,255,0.05);
  border:1px solid rgba(255,255,255,0.10);
  border-top-color:rgba(255,255,255,0.16);
  border-radius:14px;padding:5mm 7mm;
  position:relative;z-index:2;margin-bottom:6mm;
}
.areas-heading{font-size:8px;font-weight:700;color:rgba(255,255,255,0.28);letter-spacing:.16em;text-transform:uppercase;margin-bottom:4mm;text-align:center}
.areas-grid{display:grid;grid-template-columns:1fr 1fr;gap:3px 8mm}
.area-cell{display:flex;justify-content:space-between;align-items:center;padding:3px 0;border-bottom:1px solid rgba(255,255,255,0.05)}
.area-name{font-size:9px;color:rgba(255,255,255,0.6);flex:1;padding-right:6px}
.area-score{font-size:9px;font-weight:700;color:${accentColor};white-space:nowrap}

/* signature */
.sig-row{
  width:140mm;display:flex;justify-content:flex-end;
  position:relative;z-index:2;margin-bottom:auto;
}
.sig-block{text-align:left}
.sig-rule{width:46mm;height:1px;background:rgba(255,255,255,0.22);margin-bottom:5px}
.sig-name{font-size:12px;color:rgba(255,255,255,0.6);font-style:italic}
.sig-role{font-size:9px;color:rgba(255,255,255,0.28);text-transform:uppercase;letter-spacing:.1em;margin-top:2px}

/* footer */
.footer{
  width:100%;display:flex;justify-content:space-between;align-items:center;
  border-top:1px solid rgba(255,255,255,0.07);padding-top:4mm;
  position:relative;z-index:2;margin-top:4mm;
}
.footer-brand{font-size:8px;color:rgba(255,255,255,0.18);letter-spacing:.14em;font-weight:700;text-transform:uppercase}
.footer-ref{font-size:8px;color:rgba(255,255,255,0.18);letter-spacing:.1em}
</style></head><body>
<div class="page">
  <div class="blob-tr"></div>
  <div class="blob-bl"></div>
  <div class="blob-br"></div>
  <div class="border-ring"></div>
  <div class="border-ring-inner"></div>

  <!-- top bar: logos left, consultant right -->
  <div class="topbar">
    <div style="display:flex;align-items:center;gap:8px">${logoLeft || '<div style="width:52px"></div>'}</div>
    <div class="consultant">
      <div class="consultant-name">${meta.consultantName || "Mathew Hewington"}</div>
      <div class="consultant-role">Education Consultant</div>
    </div>
  </div>

  <!-- tool pill -->
  <span class="tool-pill"><span class="pill-dot"></span>${toolName} · Assessment Certificate</span>

  <!-- certifies -->
  <p class="certifies-label">This is to certify that</p>
  <p class="school-name">${meta.schoolName || "School Name"}</p>
  <p class="completed-sub">has successfully completed the <strong>${toolName}</strong></p>
  <div class="accent-rule"></div>

  <!-- gauge + rating -->
  <div class="gauge-row">
    ${gaugesvg}
    <div style="display:flex;flex-direction:column;align-items:flex-start;gap:8px">
      <span class="rating-pill">${rating}</span>
      <span style="font-size:11px;color:rgba(255,255,255,0.35);letter-spacing:.06em">Assessment Score</span>
    </div>
  </div>

  <!-- details -->
  <div class="details-panel">
    ${meta.staffMember ? `<div class="field-row"><span class="field-label">Completed by</span><span class="field-value">${meta.staffMember}</span></div>` : ""}
    <div class="field-row"><span class="field-label">Date</span><span class="field-value">${today}</span></div>
    ${logoRight ? `<div class="field-row"><span class="field-label">Organisation</span><div style="display:flex;align-items:center;gap:6px"><img src="${logoRight.match(/src="([^"]+)"/)?.[1] || ""}" style="height:22px;object-fit:contain;border-radius:4px;background:rgba(255,255,255,0.06);padding:2px"/></div></div>` : ""}
  </div>

  ${areasHtml ? `<div class="areas-panel"><p class="areas-heading">Areas Assessed</p>${areasHtml}</div>` : ""}

  <!-- signature -->
  <div class="sig-row">
    <div class="sig-block">
      <div class="sig-rule"></div>
      <p class="sig-name">${meta.consultantName || "Mathew Hewington"}</p>
      <p class="sig-role">Education Consultant</p>
    </div>
  </div>

  <div class="footer">
    <span class="footer-brand">SafeShield · Verified Assessment</span>
    <span class="footer-ref">${certId}</span>
  </div>
</div>
</body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 600);
  }

  /* ── EMAIL ──────────────────────────────────────────────────────────── */
  function handleEmail() {
    const subject = encodeURIComponent(`${toolName} Certificate — ${meta.schoolName}`);
    const areasLine = areas && areas.length > 0
      ? `\nAudit areas:\n${areas.map(a => `  • ${a.name}${a.score !== undefined ? ` — ${a.score}%` : ""}`).join("\n")}` : "";
    const body = encodeURIComponent(
      `Dear ${meta.schoolName},\n\nPlease find your ${toolName} assessment certificate below.\n\nAssessment Summary\n──────────────────\nSchool:       ${meta.schoolName}\nCompleted by: ${meta.staffMember}\nConsultant:   ${meta.consultantName}\nScore:        ${score}% — ${rating}${areasLine}\nDate:         ${today}\nRef:          ${certId}\n\nKind regards,\n${meta.consultantName || "Mathew Hewington"}\nEducation Consultant`
    );
    const recipients = [meta.schoolEmail, meta.consultantEmail].filter(Boolean).join(",");
    window.location.href = `mailto:${recipients}?subject=${subject}&body=${body}`;
  }

  /* ── ON-SCREEN LIQUID GLASS PREVIEW ─────────────────────────────────── */
  const glassPanel: React.CSSProperties = {
    background: "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)",
    border: "1px solid rgba(255,255,255,0.13)",
    borderTopColor: "rgba(255,255,255,0.22)",
    borderRadius: 20,
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.12), 0 4px 24px rgba(0,0,0,0.35)",
    padding: "20px 24px",
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

      {/* ── Liquid Glass Certificate Canvas ─────────────────────────────── */}
      <div style={{
        position: "relative",
        borderRadius: 28,
        overflow: "hidden",
        background: `linear-gradient(145deg, #060A12 0%, #0D0A1A 45%, ${accentColor}1A 100%)`,
        boxShadow: `0 0 0 1px rgba(255,255,255,0.07), 0 24px 80px rgba(0,0,0,0.7), 0 0 60px ${accentColor}22`,
        minHeight: 520,
        padding: "36px 36px 32px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}>

        {/* Ambient glow blobs */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}25 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Top: logos + tool pill */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, position: "relative", zIndex: 1 }}>
          {/* School / org logos */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {displaySchoolLogo && (
              <img src={displaySchoolLogo} alt="School logo"
                style={{ height: 52, objectFit: "contain", borderRadius: 10, background: "rgba(255,255,255,0.06)", padding: 4 }} />
            )}
            {displayOrgLogo && (
              <img src={displayOrgLogo} alt="Org logo"
                style={{ height: 52, objectFit: "contain", borderRadius: 10, background: "rgba(255,255,255,0.06)", padding: 4 }} />
            )}
            {!displaySchoolLogo && !displayOrgLogo && (
              <div style={{ width: 52, height: 52, borderRadius: 12, ...glassPanel, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 22 }}>🏫</span>
              </div>
            )}
          </div>

          {/* Tool name pill */}
          <span style={pillStyle}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: accentColor, boxShadow: `0 0 6px ${accentColor}` }} />
            {toolName}
          </span>
        </div>

        {/* Main body: left text + right gauge */}
        <div style={{ display: "flex", gap: 28, alignItems: "flex-start", position: "relative", zIndex: 1, flexWrap: "wrap" }}>

          {/* Left — school info glass panel */}
          <div style={{ ...glassPanel, flex: 1, minWidth: 220 }}>
            {/* Specular top highlight */}
            <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 1,
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)", borderRadius: 1 }} />

            <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6 }}>
              This is to certify that
            </p>
            <p style={{ fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 4, lineHeight: 1.2 }}>
              {meta.schoolName || "School Name"}
            </p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 20 }}>
              has completed the <span style={{ color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>{toolName}</span>
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {meta.staffMember && (
                <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", minWidth: 80 }}>Completed by</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{meta.staffMember}</span>
                </div>
              )}
              {(meta.consultantName) && (
                <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", minWidth: 80 }}>Consultant</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{meta.consultantName || "Mathew Hewington"}</span>
                </div>
              )}
              <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", minWidth: 80 }}>Date</span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{today}</span>
              </div>
            </div>

            {/* Signature line */}
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ height: 1, width: 120, background: "rgba(255,255,255,0.25)", marginBottom: 6 }} />
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}>{meta.consultantName || "Mathew Hewington"}</p>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.08em" }}>Education Consultant</p>
            </div>
          </div>

          {/* Right — score gauge + rating pill + areas */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, minWidth: 160 }}>
            <ScoreGauge score={score} accent={accentColor} />

            {/* Rating pill */}
            <span style={{ ...pillStyle, background: `linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.05)) padding-box, conic-gradient(from 130deg, ${ratingColor}cc, ${accentColor}cc, ${ratingColor}cc) border-box`, fontSize: 12 }}>
              {rating}
            </span>

            {/* Areas glass panel */}
            {areas && areas.length > 0 && (
              <div style={{ ...glassPanel, padding: "14px 16px", width: "100%", minWidth: 160 }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>
                  Areas assessed
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {areas.slice(0, 7).map(a => (
                    <div key={a.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", flex: 1, paddingRight: 8, lineHeight: 1.3 }}>{a.name}</span>
                      {a.score !== undefined && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: accentColor, whiteSpace: "nowrap" }}>{a.score}%</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom ref */}
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.18)", letterSpacing: "0.12em", fontWeight: 600, textTransform: "uppercase" }}>SafeShield · Verified Assessment</span>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.18)", letterSpacing: "0.1em" }}>{certId}</span>
        </div>
      </div>

      {/* ── Action buttons ───────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        <button onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}40`, color: accentColor }}>
          <Printer size={14} /> Print / Save PDF
        </button>
        {(meta.schoolEmail || meta.consultantEmail) && (
          <button onClick={handleEmail}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all bg-white/5 border border-white/10"
            style={{ color: "#94A3B8" }}>
            <Mail size={14} /> Email Certificate
          </button>
        )}
      </div>
      <p className="text-[0.7rem]" style={{ color: "var(--text-dim)" }}>
        To email the PDF: use "Print / Save PDF" first, then attach the saved file.
      </p>
    </div>
  );
}
