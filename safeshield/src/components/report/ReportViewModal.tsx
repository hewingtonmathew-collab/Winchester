"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import { X, Award, BarChart3, ClipboardList, Printer, Mail, Loader2, Sun, Moon } from "lucide-react";
import type { Gap } from "@/components/report/ImprovementReport";
import type { ReportMetaData } from "./ReportMeta";

const Certificate = dynamic(() => import("@/components/report/Certificate"), { ssr: false, loading: () => <div className="flex items-center justify-center py-20"><Loader2 size={22} className="animate-spin opacity-40" /></div> });
const ImprovementReport = dynamic(() => import("@/components/report/ImprovementReport"), { ssr: false, loading: () => <div className="flex items-center justify-center py-20"><Loader2 size={22} className="animate-spin opacity-40" /></div> });

export type ReportViewData = {
  reportId?: string;
  meta: ReportMetaData;
  toolName: string;
  score: number;
  rating: string;
  ratingColor: string;
  accentColor: string;
  date: string;
  areas?: { name: string; score?: number }[];
  gaps?: Gap[];
};

export default function ReportViewModal({ data, onClose }: { data: ReportViewData; onClose: () => void }) {
  const [tab, setTab] = useState<"certificate" | "report" | "recommendations">("certificate");
  const [reportPrintMode, setReportPrintMode] = useState<"dark" | "light">("dark");
  const [emailSending, setEmailSending] = useState(false);
  const [loadedGaps, setLoadedGaps] = useState<Gap[]>(data.gaps ?? []);
  const areas = data.areas ?? [];
  const gaps = loadedGaps;

  // Load gaps from fallback sources if not present in report data
  useEffect(() => {
    if ((data.gaps && data.gaps.length > 0) || !data.reportId) return;
    const id = data.reportId;

    // 1. Try localStorage first (immediate)
    try {
      const stored = localStorage.getItem(`safeshield_gaps_${id}`);
      if (stored) { setLoadedGaps(JSON.parse(stored)); return; }
    } catch { /* ignore */ }

    // 2. Try site_content table
    supabase.from("site_content").select("value").eq("key", `report_gaps_${id}`).maybeSingle().then(({ data: row }) => {
      if (row?.value) {
        try { setLoadedGaps(JSON.parse(row.value)); } catch { /* ignore */ }
      }
    });
  }, [data.reportId, data.gaps]);

  const accentColor = data.accentColor || "#38BDF8";
  const ratingColor = data.ratingColor || "#22c55e";

  function buildReportDetailsHtml(dark: boolean) {
    const bg = dark ? "linear-gradient(160deg,#060A12 0%,#0C0A1C 60%,rgba(56,189,248,0.08) 100%)" : "#ffffff";
    const textColor = dark ? "#E8EDF2" : "#0F172A";
    const mutedColor = dark ? "#8A9BB0" : "#64748B";
    const areaNameColor = dark ? "#C8D8E8" : "#334155";
    const panelBg = dark ? "rgba(255,255,255,0.05)" : "#F8FAFC";
    const panelBorder = dark ? "rgba(255,255,255,0.12)" : "#E2E8F0";
    const trackBg = dark ? "rgba(255,255,255,0.07)" : "#E2E8F0";
    const footerBorder = dark ? "rgba(255,255,255,0.10)" : "#E2E8F0";

    const barSection = areas.map(a => {
      const pct = a.score ?? 0;
      const barColor = pct >= 80 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";
      return `
        <div style="margin-bottom:14px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <span style="font-size:13px;color:${areaNameColor}">${a.name}</span>
            ${a.score !== undefined ? `<span style="font-size:13px;font-weight:700;color:${barColor}">${pct}%</span>` : ""}
          </div>
          ${a.score !== undefined ? `
          <div style="height:8px;border-radius:999px;background:${trackBg};overflow:hidden">
            <div style="height:100%;border-radius:999px;width:${pct}%;background:${barColor}"></div>
          </div>` : ""}
        </div>`;
    }).join("");

    return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>Report Details — ${data.toolName}</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
@page{size:A4 portrait;margin:0}
html,body{width:210mm;-webkit-print-color-adjust:exact;print-color-adjust:exact;font-family:system-ui,-apple-system,sans-serif}
.page{width:210mm;min-height:297mm;padding:14mm 16mm;background:${bg}}
</style></head><body>
<div class="page">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10mm">
    <div>
      <p style="font-size:9px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:${accentColor};margin-bottom:4px">Report Details</p>
      <p style="font-size:26px;font-weight:700;color:${textColor};letter-spacing:-.5px;line-height:1.1">${data.toolName}</p>
      <p style="font-size:11px;color:${mutedColor};margin-top:4px">${data.date}${data.meta.staffMember ? ` · ${data.meta.staffMember}` : ""}</p>
    </div>
    <div style="text-align:right">
      <p style="font-size:38px;font-weight:700;color:${accentColor};line-height:1">${data.score}%</p>
      <p style="font-size:13px;color:${ratingColor};font-weight:600;margin-top:2px">${data.rating}</p>
    </div>
  </div>
  <div style="height:2px;border-radius:2px;background:linear-gradient(90deg,${accentColor},rgba(167,139,250,0.6),transparent);margin-bottom:9mm"></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:4mm 8mm;background:${panelBg};border:1px solid ${panelBorder};border-radius:14px;padding:5mm 6mm;margin-bottom:9mm">
    <div><label style="font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:${mutedColor};display:block;margin-bottom:3px">School / Trust</label><span style="font-size:12px;color:${textColor};font-weight:500">${data.meta.schoolName || "—"}</span></div>
    <div><label style="font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:${mutedColor};display:block;margin-bottom:3px">Consultant</label><span style="font-size:12px;color:${textColor};font-weight:500">${data.meta.consultantName || "Mathew Hewington"}</span></div>
    ${data.meta.staffMember ? `<div><label style="font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:${mutedColor};display:block;margin-bottom:3px">Completed By</label><span style="font-size:12px;color:${textColor};font-weight:500">${data.meta.staffMember}</span></div>` : ""}
    ${data.meta.schoolEmail ? `<div><label style="font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:${mutedColor};display:block;margin-bottom:3px">School Email</label><span style="font-size:12px;color:${textColor};font-weight:500">${data.meta.schoolEmail}</span></div>` : ""}
  </div>
  ${areas.length > 0 ? `
  <p style="font-size:9px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:${mutedColor};margin-bottom:5mm;padding-bottom:3mm;border-bottom:1px solid ${footerBorder}">Areas Assessed</p>
  ${barSection}` : ""}
  <div style="margin-top:12mm;padding-top:4mm;border-top:1px solid ${footerBorder};display:flex;justify-content:space-between">
    <span style="font-size:8px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:${mutedColor}">SafeShield · Verified Assessment Report</span>
    <span style="font-size:8px;color:${mutedColor};letter-spacing:.08em">${data.date}</span>
  </div>
</div>
</body></html>`;
  }

  function handlePrintReportDetails() {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(buildReportDetailsHtml(reportPrintMode === "dark"));
    w.document.close();
    setTimeout(() => w.print(), 400);
  }

  async function handleEmailReportDetails() {
    const recipients = [data.meta.schoolEmail, data.meta.consultantEmail].filter(Boolean) as string[];
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
          subject: `${data.toolName} Report Details — ${data.meta.schoolName}`,
          html: buildReportDetailsHtml(reportPrintMode === "dark"),
          type: "report",
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Send failed");
      alert(`Report emailed to ${recipients.join(", ")}`);
    } catch (err: unknown) {
      alert(`Failed to send: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setEmailSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 backdrop-blur-sm p-4 sm:p-8"
      onClick={onClose}>
      <div className="relative w-full max-w-3xl my-8" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose}
          className="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center bg-[#0F172A] border border-white/15 hover:bg-white/10 transition-all"
          title="Close">
          <X size={16} className="text-white" />
        </button>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 justify-center flex-wrap">
          {([["certificate", "Certificate", Award], ["report", "Report Details", BarChart3], ["recommendations", "Recommendations", ClipboardList]] as const).map(([key, label, Icon]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${tab === key ? "bg-[rgba(56,189,248,0.15)] border-[rgba(56,189,248,0.3)] text-[#38BDF8]" : "bg-white/5 border-white/10 text-[#94A3B8] hover:bg-white/10"}`}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {tab === "certificate" ? (
          <Certificate
            meta={data.meta}
            toolName={data.toolName}
            score={data.score}
            rating={data.rating}
            ratingColor={data.ratingColor}
            accentColor={data.accentColor}
            date={data.date}
            areas={areas}
          />
        ) : tab === "recommendations" ? (
          <ImprovementReport
            meta={data.meta}
            toolName={data.toolName}
            score={data.score}
            rating={data.rating}
            ratingColor={data.ratingColor}
            gaps={gaps}
            accentColor={data.accentColor}
            reportId={data.reportId}
          />
        ) : (
          <div className="rounded-2xl bg-[#0B1220] border border-white/10 p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: accentColor }}>{data.toolName}</p>
                <h3 className="text-xl font-bold" style={{ color: "#E8EDF2" }}>{data.meta.schoolName}</h3>
                <p className="text-xs mt-0.5" style={{ color: "#8A9BB0" }}>
                  {data.date}{data.meta.staffMember ? ` · ${data.meta.staffMember}` : ""}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-3xl font-bold" style={{ color: accentColor }}>{data.score}%</p>
                <p className="text-xs font-semibold" style={{ color: ratingColor }}>{data.rating}</p>
              </div>
            </div>

            {areas.length === 0 ? (
              <p className="text-sm text-[#64748B] text-center py-8">No area breakdown was saved for this assessment.</p>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#8A9BB0" }}>Areas covered</p>
                {areas.map((a, i) => {
                  const pct = a.score ?? 0;
                  const barColor = pct >= 80 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm" style={{ color: "#C8D8E8" }}>{a.name}</span>
                        {a.score !== undefined && (
                          <span className="text-sm font-semibold" style={{ color: barColor }}>{pct}%</span>
                        )}
                      </div>
                      {a.score !== undefined && (
                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: barColor }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {(data.meta.consultantName || data.meta.schoolEmail) && (
              <div className="mt-6 pt-4 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {data.meta.schoolEmail && (
                  <div><span style={{ color: "#8A9BB0" }}>School email: </span><span style={{ color: "#C8D8E8" }}>{data.meta.schoolEmail}</span></div>
                )}
                {data.meta.consultantName && (
                  <div><span style={{ color: "#8A9BB0" }}>Consultant: </span><span style={{ color: "#C8D8E8" }}>{data.meta.consultantName}</span></div>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap gap-3 items-center">
              {/* Dark / Light toggle */}
              <div style={{ display: "flex", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.10)", flexShrink: 0 }}>
                <button onClick={() => setReportPrintMode("dark")}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-all"
                  style={{ background: reportPrintMode === "dark" ? "rgba(255,255,255,0.12)" : "transparent", color: reportPrintMode === "dark" ? "#fff" : "#64748B", border: "none", cursor: "pointer" }}>
                  <Moon size={11} /> Dark
                </button>
                <button onClick={() => setReportPrintMode("light")}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-all"
                  style={{ background: reportPrintMode === "light" ? "rgba(255,255,255,0.12)" : "transparent", color: reportPrintMode === "light" ? "#fff" : "#64748B", border: "none", cursor: "pointer" }}>
                  <Sun size={11} /> Light
                </button>
              </div>
              <button onClick={handlePrintReportDetails}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}40`, color: accentColor }}>
                <Printer size={14} /> Print / Save PDF
              </button>
              <button onClick={handleEmailReportDetails} disabled={emailSending}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#C8D8E8",
                  opacity: emailSending ? 0.6 : 1, cursor: emailSending ? "default" : "pointer" }}>
                <Mail size={14} /> {emailSending ? "Sending…" : "Email Report"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
