"use client";
import { Users } from "lucide-react";
import ToolPageHeader from "@/components/ui/ToolPageHeader";
import GlassCard from "@/components/ui/GlassCard";

export default function ParentalEngagementPage() {
  return (
    <div className="min-h-screen pt-20 pb-16" style={{ background: "var(--bg)" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <ToolPageHeader
          title="Parental Engagement Tracker"
          description="Evidence and improve your parental engagement strategy. Track communication channels, involvement in school life, and demonstrate impact for Ofsted."
          accentColor="#A78BFA"
          icon={<Users size={28} style={{ color: "#A78BFA" }} />}
        />
        <GlassCard>
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "#A78BFA18", border: "1px solid #A78BFA35" }}>
              <Users size={28} style={{ color: "#A78BFA" }} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Coming Soon</h2>
            <p className="text-[#64748B] text-sm max-w-md mx-auto leading-relaxed">
              Evidence and improve your parental engagement strategy. Track communication channels, involvement in school life, and demonstrate impact for Ofsted.
            </p>
            <p className="text-xs text-[#334155] mt-4">This tool is currently in development and will be available soon.</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
