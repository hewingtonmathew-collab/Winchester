"use client";
import { AlertTriangle } from "lucide-react";
import ToolPageHeader from "@/components/ui/ToolPageHeader";
import GlassCard from "@/components/ui/GlassCard";

export default function PreventPage() {
  return (
    <div className="min-h-screen pt-20 pb-16" style={{ background: "var(--bg)" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <ToolPageHeader
          title="Prevent & Radicalisation Self-Assessment"
          description="Structured self-assessment of your school's Prevent duty compliance — risk assessment, staff training, curriculum, and reporting procedures."
          accentColor="#FBBF24"
          icon={<AlertTriangle size={28} style={{ color: "#FBBF24" }} />}
        />
        <GlassCard>
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "#FBBF2418", border: "1px solid #FBBF2435" }}>
              <AlertTriangle size={28} style={{ color: "#FBBF24" }} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Coming Soon</h2>
            <p className="text-[#64748B] text-sm max-w-md mx-auto leading-relaxed">
              Structured self-assessment of your school's Prevent duty compliance — risk assessment, staff training, curriculum, and reporting procedures.
            </p>
            <p className="text-xs text-[#334155] mt-4">This tool is currently in development and will be available soon.</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
