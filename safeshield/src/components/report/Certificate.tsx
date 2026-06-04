"use client";
import { useRef } from "react";
import { Printer, Mail } from "lucide-react";
import type { ReportMetaData } from "./ReportMeta";

type Props = {
  meta: ReportMetaData;
  toolName: string;
  score: number;
  rating: string;
  ratingColor: string;
  date?: string;
  accentColor?: string;
};

export default function Certificate({ meta, toolName, score, rating, ratingColor, date, accentColor = "#38BDF8" }: Props) {
  const certRef = useRef<HTMLDivElement>(null);
  const today = date ?? new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const certId = `WC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  function handlePrint() {
    const content = certRef.current?.innerHTML ?? "";
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>Certificate — ${toolName}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #020610; display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: Georgia, serif; }
  .cert { width: 190mm; min-height: 270mm; background: linear-gradient(160deg, #0d1726 0%, #060d1a 60%, #020610 100%); border: 1px solid rgba(255,255,255,0.1); position: relative; overflow: hidden; }
  .cert-inner { padding: 14mm 16mm 0; position: relative; z-index: 2; }
  .logo-row { display: flex; justify-content: center; margin-bottom: 8mm; }
  .logo-row img { height: 52px; object-fit: contain; }
  .brand-pill { display: inline-flex; align-items: center; gap: 8px; padding: 5px 14px; border-radius: 40px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); }
  .brand-dot { width: 22px; height: 22px; border-radius: 5px; background: ${accentColor}22; border: 1px solid ${accentColor}55; display: flex; align-items: center; justify-content: center; }
  .brand-name { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.7); letter-spacing: 0.5px; font-family: system-ui, sans-serif; }
  .cert-title-word { font-size: 40px; font-weight: 700; color: #fff; letter-spacing: 6px; text-align: center; display: block; }
  .cert-title-sub { font-size: 20px; font-style: italic; color: rgba(255,255,255,0.5); text-align: center; display: block; margin-top: 2px; font-weight: 400; }
  .divider { width: 60mm; height: 1px; background: linear-gradient(90deg, transparent, ${accentColor}, transparent); margin: 6mm auto; }
  .awarded-text { text-align: center; font-size: 9px; color: rgba(255,255,255,0.4); letter-spacing: 3px; text-transform: uppercase; margin-bottom: 4mm; font-family: system-ui, sans-serif; }
  .school-name { font-size: 34px; font-style: italic; font-weight: 700; color: ${accentColor}; text-align: center; margin-bottom: 5mm; line-height: 1.2; }
  .assessment-text { font-size: 10px; color: rgba(255,255,255,0.5); text-align: center; max-width: 110mm; margin: 0 auto 5mm; line-height: 1.7; font-family: system-ui, sans-serif; }
  .score-pill { display: inline-flex; align-items: center; gap: 10px; padding: 6px 18px; border-radius: 40px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); margin: 0 auto 5mm; }
  .score-num { font-size: 22px; font-weight: 700; color: ${ratingColor}; }
  .score-sep { color: rgba(255,255,255,0.2); }
  .score-rating { font-size: 13px; font-weight: 600; color: ${ratingColor}; font-family: system-ui, sans-serif; }
  .meta-row { display: flex; justify-content: center; gap: 12mm; margin-bottom: 6mm; font-family: system-ui, sans-serif; }
  .meta-block { text-align: center; }
  .meta-value { font-size: 14px; font-weight: 700; color: #ffffff; display: block; }
  .meta-label { font-size: 8px; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 1.5px; margin-top: 3px; display: block; }
  .sig-row { display: flex; justify-content: flex-end; padding: 0 14mm 4mm; position: relative; z-index: 2; }
  .sig-block { text-align: center; }
  .sig-line { width: 44mm; height: 1px; background: rgba(255,255,255,0.2); margin-bottom: 5px; }
  .sig-name { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.8); font-family: system-ui, sans-serif; }
  .sig-role { font-size: 8px; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 1.5px; font-family: system-ui, sans-serif; margin-top: 2px; }
  .swoosh-area { position: relative; z-index: 1; margin-top: -10mm; }
  .badge-wrap { position: absolute; bottom: 22mm; left: 14mm; z-index: 3; }
  .badge-outer { width: 66px; height: 66px; border-radius: 50%; background: linear-gradient(135deg, #D4AF37, #F9E87B, #B8860B); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(212,175,55,0.4); }
  .badge-inner { width: 55px; height: 55px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.35); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; }
  .badge-text { font-size: 7px; font-weight: 700; color: #5a3800; letter-spacing: 1px; font-family: system-ui, sans-serif; }
  .badge-star { font-size: 15px; color: #5a3800; line-height: 1; }
  .cert-id { position: absolute; bottom: 6mm; left: 0; right: 0; text-align: center; font-size: 7px; color: rgba(255,255,255,0.25); letter-spacing: 1.5px; font-family: system-ui, sans-serif; z-index: 3; }
</style>
</head><body><div class="cert">
  <div class="cert-inner">
    <div class="logo-row">
      ${meta.logoDataUrl
        ? `<img src="${meta.logoDataUrl}" alt="Logo" />`
        : `<div class="brand-pill"><div class="brand-dot"><svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1l4 2v3.5c0 2-1.5 3.5-4 4.5C3.5 10 2 8.5 2 6.5V3L6 1z" fill="none" stroke="${accentColor}" stroke-width="1.2"/></svg></div><span class="brand-name">SafeShield</span></div>`
      }
    </div>
    <span class="cert-title-word">CERTIFICATE</span>
    <span class="cert-title-sub">of Assessment</span>
    <div class="divider"></div>
    <p class="awarded-text">This certificate is awarded to</p>
    <div class="school-name">${meta.schoolName || "School Name"}</div>
    <p class="assessment-text">In recognition of completing the <strong style="color:rgba(255,255,255,0.7)">${toolName}</strong> and demonstrating commitment to compliance and safeguarding excellence.</p>
    <div style="text-align:center"><div class="score-pill"><span class="score-num">${score}%</span><span class="score-sep">|</span><span class="score-rating">${rating}</span></div></div>
    <div class="meta-row">
      <div class="meta-block"><span class="meta-value">${meta.staffMember || "—"}</span><span class="meta-label">Staff Member</span></div>
      <div class="meta-block"><span class="meta-value">${today}</span><span class="meta-label">Date Completed</span></div>
    </div>
  </div>
  <div class="sig-row">
    <div class="sig-block"><div class="sig-line"></div><div class="sig-name">${meta.consultantName || "Consultant"}</div><div class="sig-role">SafeShield</div></div>
  </div>
  <div class="swoosh-area">
    <svg viewBox="0 0 570 190" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%">
      <defs>
        <linearGradient id="sw1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="${accentColor}" stop-opacity="0.05"/>
        </linearGradient>
        <linearGradient id="sw2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.12)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0.02)"/>
        </linearGradient>
      </defs>
      <path d="M0 190 L0 90 Q220 -10 570 70 L570 190 Z" fill="rgba(255,255,255,0.03)"/>
      <path d="M0 150 Q200 30 570 100 L570 128 Q200 58 0 178 Z" fill="url(#sw1)"/>
      <path d="M0 168 Q210 48 570 115 L570 138 Q210 70 0 192 Z" fill="url(#sw2)"/>
    </svg>
    <div class="badge-wrap">
      <div class="badge-outer"><div class="badge-inner"><span class="badge-text">BEST</span><span class="badge-star">★</span><span class="badge-text">AWARD</span></div></div>
    </div>
    <div class="cert-id">Certificate ID: ${certId}</div>
  </div>
</div></body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 800);
  }

  function handleEmail() {
    const subject = encodeURIComponent(`${toolName} Certificate — ${meta.schoolName}`);
    const body = encodeURIComponent(
      `Dear ${meta.schoolName},\n\nPlease find below the ${toolName} assessment certificate completed on ${today}.\n\nTo save the certificate as a PDF:\n1. Open the SafeShield tool and complete the assessment\n2. Click "Print / Save PDF" on the certificate\n3. Choose "Save as PDF" in your print dialog\n\nAssessment Summary\n──────────────────\nSchool:       ${meta.schoolName}\nScore:        ${score}%\nRating:       ${rating}\nStaff Member: ${meta.staffMember}\nConsultant:   ${meta.consultantName}\nDate:         ${today}\nCertificate:  ${certId}\n\nKind regards,\n${meta.consultantName}\nSafeShield`
    );
    const recipients = [meta.schoolEmail, meta.consultantEmail].filter(Boolean).join(",");
    window.location.href = `mailto:${recipients}?subject=${subject}&body=${body}`;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Certificate preview */}
      <div ref={certRef} style={{ background: "linear-gradient(160deg, #0d1726 0%, #060d1a 60%, #020610 100%)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, overflow: "hidden", fontFamily: "Georgia, serif", position: "relative" }}>
        {/* Top section */}
        <div style={{ padding: "32px 40px 0", position: "relative", zIndex: 2 }}>
          {/* Logo / brand */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            {meta.logoDataUrl ? (
              <img src={meta.logoDataUrl} alt="Logo" style={{ height: 48, objectFit: "contain" }} />
            ) : (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px", borderRadius: 40, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ width: 22, height: 22, borderRadius: 5, background: `${accentColor}22`, border: `1px solid ${accentColor}55`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1l4 2v3.5c0 2-1.5 3.5-4 4.5C3.5 10 2 8.5 2 6.5V3L6 1z" fill="none" stroke={accentColor} strokeWidth="1.2" /></svg>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.6)", fontFamily: "system-ui, sans-serif", letterSpacing: "0.5px" }}>SafeShield</span>
              </div>
            )}
          </div>

          {/* Title */}
          <div style={{ textAlign: "center", marginBottom: 0 }}>
            <div style={{ fontSize: 34, fontWeight: 700, color: "#fff", letterSpacing: 6, fontFamily: "Georgia, serif" }}>CERTIFICATE</div>
            <div style={{ fontSize: 18, fontStyle: "italic", color: "rgba(255,255,255,0.45)", fontFamily: "Georgia, serif", marginTop: 2 }}>of Assessment</div>
          </div>

          {/* Accent divider */}
          <div style={{ width: 80, height: 1, background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`, margin: "16px auto" }} />

          <p style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", textAlign: "center", letterSpacing: 3, textTransform: "uppercase", marginBottom: 10, fontFamily: "system-ui, sans-serif" }}>This certificate is awarded to</p>

          {/* School name */}
          <div style={{ fontSize: 28, fontStyle: "italic", fontWeight: 700, color: accentColor, textAlign: "center", marginBottom: 12, fontFamily: "Georgia, serif", lineHeight: 1.2 }}>
            {meta.schoolName || "School Name"}
          </div>

          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: 14, lineHeight: 1.7, fontFamily: "system-ui, sans-serif" }}>
            In recognition of completing the <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>{toolName}</span> and demonstrating commitment to compliance and safeguarding excellence.
          </p>

          {/* Score pill */}
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "7px 20px", borderRadius: 40, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: ratingColor, fontFamily: "Georgia, serif" }}>{score}%</span>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: ratingColor, fontFamily: "system-ui, sans-serif" }}>{rating}</span>
            </div>
          </div>

          {/* Meta */}
          <div style={{ display: "flex", justifyContent: "center", gap: 40, marginBottom: 12, fontFamily: "system-ui, sans-serif" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{meta.staffMember || "—"}</div>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 1.5, marginTop: 2 }}>Staff Member</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#ffffff" }}>{today}</div>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: 1.5, marginTop: 3 }}>Date Completed</div>
            </div>
          </div>
        </div>

        {/* Signature */}
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 40px 8px", position: "relative", zIndex: 2 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 120, height: 1, background: "rgba(255,255,255,0.2)", marginBottom: 5 }} />
            <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.75)", fontFamily: "system-ui, sans-serif" }}>{meta.consultantName || "Consultant"}</div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 1.5, fontFamily: "system-ui, sans-serif", marginTop: 2 }}>SafeShield</div>
          </div>
        </div>

        {/* Swoosh */}
        <div style={{ position: "relative", zIndex: 1, marginTop: -8 }}>
          <svg viewBox="0 0 570 160" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", width: "100%" }}>
            <defs>
              <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={accentColor} stopOpacity="0.3" />
                <stop offset="100%" stopColor={accentColor} stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.01)" />
              </linearGradient>
            </defs>
            <path d="M0 160 L0 70 Q220 -20 570 55 L570 160 Z" fill="rgba(255,255,255,0.025)" />
            <path d="M0 125 Q200 10 570 78 L570 105 Q200 38 0 155 Z" fill="url(#g1)" />
            <path d="M0 142 Q210 28 570 92 L570 115 Q210 55 0 168 Z" fill="url(#g2)" />
          </svg>

          {/* Gold badge */}
          <div style={{ position: "absolute", bottom: 16, left: 32, zIndex: 3 }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg, #D4AF37, #F9E87B, #B8860B)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 20px rgba(212,175,55,0.5), 0 0 40px rgba(212,175,55,0.2)` }}>
              <div style={{ width: 50, height: 50, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.35)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1 }}>
                <span style={{ fontSize: 7, fontWeight: 700, color: "#5a3800", letterSpacing: 1, fontFamily: "system-ui, sans-serif" }}>BEST</span>
                <span style={{ fontSize: 14, color: "#5a3800", lineHeight: 1 }}>★</span>
                <span style={{ fontSize: 7, fontWeight: 700, color: "#5a3800", letterSpacing: 1, fontFamily: "system-ui, sans-serif" }}>AWARD</span>
              </div>
            </div>
          </div>

          {/* Certificate ID */}
          <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, textAlign: "center", fontSize: 8, color: "rgba(255,255,255,0.2)", letterSpacing: 1.5, fontFamily: "system-ui, sans-serif", zIndex: 3 }}>
            Certificate ID: {certId}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3">
        <button onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}40`, color: accentColor }}>
          <Printer size={14} /> Print / Save PDF
        </button>
        {(meta.schoolEmail || meta.consultantEmail) && (
          <button onClick={handleEmail}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all bg-white/5 border border-white/10 text-[#94A3B8] hover:text-white hover:border-white/20">
            <Mail size={14} /> Email Certificate
          </button>
        )}
      </div>
      <p className="text-[#475569] text-xs">To email the PDF: use "Print / Save PDF" first, then attach the saved file to your email.</p>
    </div>
  );
}
