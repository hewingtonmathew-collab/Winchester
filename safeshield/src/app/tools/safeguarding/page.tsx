"use client";
import AuthGuard from "@/components/ui/AuthGuard";
import SafeguardingChecker from "@/components/forms/SafeguardingChecker";
import GlassCard from "@/components/ui/GlassCard";
import { ShieldCheck } from "lucide-react";

export default function SafeguardingPage() {
  return (
    <AuthGuard toolSlug="safeguarding">
    <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="pt-10 pb-10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-[rgba(52,211,153,0.1)] border border-[rgba(52,211,153,0.2)]">
              <ShieldCheck size={22} className="text-[#34D399]" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[#34D399] text-xs font-medium uppercase tracking-widest mb-1">Risk Assessment</p>
              <h1 className="text-white text-3xl font-bold mb-2">Safeguarding Risk Checker</h1>
              <p className="text-[#94A3B8] text-sm max-w-xl leading-relaxed">
                Answer 15 structured questions across key safeguarding areas to receive an instant risk rating and prioritised action list aligned to KCSIE expectations.
              </p>
            </div>
          </div>
  
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <SafeguardingChecker />
            </div>
            <div className="flex flex-col gap-4">
              <GlassCard>
                <h2 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">Areas Covered</h2>
                <ul className="flex flex-col gap-2">
                  {["Online Filtering", "Online Monitoring", "Policy & AUPs", "DSL & Staff Training", "Curriculum Delivery", "Governor Oversight", "Devices & BYOD"].map((area) => (
                    <li key={area} className="flex items-center gap-2 text-[#64748B] text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] shrink-0" />
                      {area}
                    </li>
                  ))}
                </ul>
              </GlassCard>
              <GlassCard>
                <h2 className="text-white font-semibold text-xs uppercase tracking-wider mb-2">Framework Alignment</h2>
                <p className="text-[#475569] text-xs leading-relaxed">Questions are aligned to KCSIE, the UK Council for Internet Safety (UKCIS) framework, and Ofsted inspection expectations.</p>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}