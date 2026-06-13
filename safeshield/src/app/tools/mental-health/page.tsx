"use client";
import { Heart } from "lucide-react";
import ToolPageHeader from "@/components/ui/ToolPageHeader";
import GlassCard from "@/components/ui/GlassCard";

export default function MentalHealthPage() {
  return (
    <div className="min-h-screen pt-20 pb-16" style={{ background: "var(--bg)" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <ToolPageHeader
          title="Mental Health & Wellbeing Audit"
          description="Evaluate your school's mental health provision against the DfE Senior Mental Health Lead guidance. Assess whole-school approach, staff training, and pupil support structures."
          accentColor="#F472B6"
          icon={<Heart size={28} style={{ color: "#F472B6" }} />}
        />
        <GlassCard>
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "#F472B618", border: "1px solid #F472B635" }}>
              <Heart size={28} style={{ color: "#F472B6" }} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Coming Soon</h2>
            <p className="text-[#64748B] text-sm max-w-md mx-auto leading-relaxed">
              Evaluate your school's mental health provision against the DfE Senior Mental Health Lead guidance. Assess whole-school approach, staff training, and pupil support structures.
            </p>
            <p className="text-xs text-[#334155] mt-4">This tool is currently in development and will be available soon.</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
