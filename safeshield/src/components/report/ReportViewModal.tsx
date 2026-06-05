"use client";
import { useState } from "react";
import { X, Award, BarChart3, ClipboardList } from "lucide-react";
import Certificate from "@/components/report/Certificate";
import ImprovementReport, { type Gap } from "@/components/report/ImprovementReport";
import type { ReportMetaData } from "./ReportMeta";

export type ReportViewData = {
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
  const areas = data.areas ?? [];
  const gaps = data.gaps ?? [];

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
          gaps.length > 0 ? (
            <ImprovementReport
              meta={data.meta}
              toolName={data.toolName}
              score={data.score}
              rating={data.rating}
              ratingColor={data.ratingColor}
              gaps={gaps}
              accentColor={data.accentColor}
            />
          ) : (
            <div className="rounded-2xl bg-[#0B1220] border border-white/10 p-8 text-center">
              <p className="text-sm text-[#64748B]">No improvement recommendations were saved for this assessment.</p>
              <p className="text-xs text-[#475569] mt-2">Recommendations are captured on assessments completed after this feature was added.</p>
            </div>
          )
        ) : (
          <div className="rounded-2xl bg-[#0B1220] border border-white/10 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: data.accentColor }}>{data.toolName}</p>
                <h3 className="text-xl font-bold text-white">{data.meta.schoolName}</h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  {data.date}{data.meta.staffMember ? ` · ${data.meta.staffMember}` : ""}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-3xl font-bold" style={{ color: data.accentColor }}>{data.score}%</p>
                <p className="text-xs" style={{ color: data.ratingColor }}>{data.rating}</p>
              </div>
            </div>

            {areas.length === 0 ? (
              <p className="text-sm text-[#64748B] text-center py-8">No area breakdown was saved for this assessment.</p>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-xs font-medium uppercase tracking-wider text-[#475569]">Areas covered</p>
                {areas.map((a, i) => {
                  const pct = a.score ?? 0;
                  const barColor = pct >= 80 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-white">{a.name}</span>
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
                  <div><span className="text-[#475569]">School email: </span><span className="text-[#94A3B8]">{data.meta.schoolEmail}</span></div>
                )}
                {data.meta.consultantName && (
                  <div><span className="text-[#475569]">Consultant: </span><span className="text-[#94A3B8]">{data.meta.consultantName}</span></div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
