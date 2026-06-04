import AiReadiness from "@/components/forms/AiReadiness";
import GlassCard from "@/components/ui/GlassCard";
import { Cpu } from "lucide-react";

export default function AiReadinessPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-10 pb-10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-[rgba(251,146,60,0.1)] border border-[rgba(251,146,60,0.2)]">
            <Cpu size={22} className="text-[#FB923C]" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[#FB923C] text-xs font-medium uppercase tracking-widest mb-1">Readiness Assessment</p>
            <h1 className="text-white text-3xl font-bold mb-2">AI Readiness Assessment</h1>
            <p className="text-[#94A3B8] text-sm max-w-xl leading-relaxed">
              Rate your school's current position across five AI governance dimensions. Receive a readiness score and prioritised action list to support responsible AI adoption.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            <AiReadiness />
          </div>
          <div className="flex flex-col gap-4">
            <GlassCard>
              <h2 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">Dimensions Assessed</h2>
              <ul className="flex flex-col gap-2">
                {["AI policy (staff & student)", "Data protection & DPIAs", "Safeguarding risk awareness", "AI procurement due diligence", "Staff capability & CPD", "Board briefing & risk register"].map((a) => (
                  <li key={a} className="flex items-center gap-2 text-[#64748B] text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FB923C] shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
            </GlassCard>
            <GlassCard>
              <h2 className="text-white font-semibold text-xs uppercase tracking-wider mb-2">Rating Scale</h2>
              <div className="flex flex-col gap-2">
                {[
                  ["Not started", "text-red-400", "Nothing is in place yet."],
                  ["Planned", "text-orange-400", "Work has been identified but not begun."],
                  ["Partial", "text-amber-400", "Something exists but is incomplete or underdeveloped."],
                  ["Fully in place", "text-green-400", "Robust, documented, and reviewed."],
                ].map(([label, color, desc]) => (
                  <div key={label as string}>
                    <span className={`text-xs font-semibold ${color}`}>{label}</span>
                    <span className="text-[#475569] text-xs"> — {desc}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
